const cloudinary = require("cloudinary").v2;
const fs = require("fs");
require("dotenv").config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── KEY FIX ──────────────────────────────────────────────────────────────────
// Your Cloudinary account uses the "asset folder" model (fixed public IDs).
// The old Search API `folder:histora-psc` expression ONLY scans the root folder
// and completely misses subfolders like atelierTissage/, cafe/, kobba/, etc.
//
// Solution: use cloudinary.api.resources_by_asset_folder() for each folder.
// This correctly retrieves all assets regardless of model.
// ─────────────────────────────────────────────────────────────────────────────

async function fetchAllFolders() {
  // Recursively discover all folders under histora-psc (including nested ones like 3D_models)
  const folders = ["histora-psc"];

  async function discoverSubfolders(parentPath) {
    try {
      const result = await cloudinary.api.sub_folders(parentPath);
      for (const f of result.folders) {
        folders.push(f.path);
        await discoverSubfolders(f.path); // recurse into nested folders
      }
    } catch (e) {
      // folder has no subfolders, that's fine
    }
  }

  await discoverSubfolders("histora-psc");
  console.log(`Found ${folders.length} folders to scan: ${folders.join(", ")}`);
  return folders;
}

async function fetchResourcesFromFolder(folderPath) {
  let allResources = [];
  let nextCursor = null;

  do {
    const params = { max_results: 500 };
    if (nextCursor) params.next_cursor = nextCursor;

    const result = await cloudinary.api.resources_by_asset_folder(
      folderPath,
      params
    );

    allResources = allResources.concat(result.resources);
    nextCursor = result.next_cursor;
  } while (nextCursor);

  return allResources;
}

// Extract and normalize a category key from a resource.
// Always decodes URI components so "commer%C3%A7ant" and "commerçant" map to the same key.
// e.g. "atelierTissage_img001_xyz"  →  "atelierTissage"
//      "cafe_z3cvpl.txt"            →  "cafe"
function getCategoryFromResource(resource) {
  const name = resource.display_name || resource.public_id.split("/").pop();
  try {
    return decodeURIComponent(name.split("_")[0]) || null;
  } catch {
    return name.split("_")[0] || null;
  }
}

// Normalize a raw category string (decodes URI encoding, lowercases for consistent key)
function normalizeCategory(raw) {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

async function generateRoomsData() {
  try {
    const args = process.argv.slice(2);
    const fetchImages = args.length === 0 || args.includes("--images");
    const fetchVideos = args.length === 0 || args.includes("--videos");
    const fetchDescriptions = args.length === 0 || args.includes("--descriptions");

    // ── Load existing data to preserve manually set IDs / titles ──────────────
    let existingData = [];
    try {
      const content = fs.readFileSync("./src/roomsData.js", "utf8");
      const jsonStr = content.substring(
        content.indexOf("["),
        content.lastIndexOf("]") + 1
      );
      existingData = JSON.parse(jsonStr);
      console.log(`Loaded ${existingData.length} existing rooms from roomsData.js`);
    } catch (e) {
      console.log("Could not parse existing roomsData.js, starting fresh.");
    }

    const rooms = {};

    // Seed rooms map from existing data so IDs / titles are preserved.
    // Always normalize the category key to avoid URL-encoded duplicates
    // (e.g. "commer%C3%A7ant" vs "commerçant" must map to the same entry).
    existingData.forEach((room) => {
      let category = "";
      if (room.img) {
        const match = room.img.match(/\/([^/_]+)_img/);
        if (match) category = normalizeCategory(match[1]);
      }
      if (!category && room.gallery && room.gallery.length > 0) {
        const match = room.gallery[0].match(/\/([^/_]+)_img/);
        if (match) category = normalizeCategory(match[1]);
      }
      if (!category) {
        category = room.title.replace(/\s(.)/g, (m) => m[1].toUpperCase());
        category = category.charAt(0).toLowerCase() + category.slice(1);
      }
      // Only seed if not already present (prevents stale duplicates)
      if (!rooms[category]) {
        rooms[category] = { ...room };
      }
    });

    // ── Fetch all assets from all folders ─────────────────────────────────────
    const allFolders = await fetchAllFolders();
    let allResources = [];

    for (const folder of allFolders) {
      const resources = await fetchResourcesFromFolder(folder);
      console.log(`  ${folder}: ${resources.length} assets`);
      allResources = allResources.concat(resources);
    }

    console.log(`\nTotal assets fetched: ${allResources.length}`);

    // ── Skip Cloudinary sample assets ─────────────────────────────────────────
    allResources = allResources.filter(
      (r) => !r.public_id.startsWith("samples/")
    );

    // ── Process descriptions (.txt) & 3D models (.stl) ───────────────────────
    if (fetchDescriptions) {
      console.log("\nProcessing descriptions and 3D models...");
      for (const resource of allResources) {
        if (resource.resource_type !== "raw") continue;

        const category = getCategoryFromResource(resource);
        if (!category) continue;

        if (!rooms[category]) {
          rooms[category] = {
            title: category
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (s) => s.toUpperCase()),
          };
        }

        const name = resource.display_name || resource.public_id.split("/").pop();
        const isSTL =
          resource.format === "stl" ||
          name.toLowerCase().endsWith(".stl") ||
          resource.public_id.toLowerCase().includes("3d_view");
        const isTXT =
          resource.format === "txt" || name.toLowerCase().endsWith(".txt");

        if (isTXT) {
          try {
            console.log(`  Fetching description for "${category}"...`);
            const response = await fetch(resource.secure_url);
            const text = await response.text();
            rooms[category].description = text.trim();
          } catch (err) {
            console.error(`  Failed to fetch description for "${category}":`, err.message);
          }
        } else if (isSTL) {
          console.log(`  Found 3D model for "${category}": ${name}`);
          rooms[category].model3d = resource.secure_url;
        }
      }
    }

    // ── Process images & videos ───────────────────────────────────────────────
    if (fetchImages || fetchVideos) {
      // Clear existing media so we don't accumulate duplicates
      if (fetchImages) {
        Object.values(rooms).forEach((r) => {
          r.gallery = [];
          r.img = "";
        });
      }
      if (fetchVideos) {
        Object.values(rooms).forEach((r) => (r.videos = []));
      }

      console.log("\nProcessing images and videos...");
      for (const resource of allResources) {
        const { resource_type } = resource;
        if (resource_type === "raw") continue;
        if (resource_type === "image" && !fetchImages) continue;
        if (resource_type === "video" && !fetchVideos) continue;

        const category = getCategoryFromResource(resource);
        if (!category) continue;

        if (!rooms[category]) {
          rooms[category] = {
            title: category
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (s) => s.toUpperCase()),
            gallery: [],
            videos: [],
            description: "Description coming soon...",
          };
        }

        const url = resource.secure_url;

        if (resource_type === "image") {
          rooms[category].gallery = rooms[category].gallery || [];
          rooms[category].gallery.push(url);
        }

        if (resource_type === "video") {
          rooms[category].videos = rooms[category].videos || [];
          rooms[category].videos.push(url);
        }
      }

      // Sort galleries and pick cover image
      if (fetchImages) {
        Object.values(rooms).forEach((room) => {
          if (room.gallery && room.gallery.length > 0) {
            room.gallery.sort((a, b) => {
              const matchA = a.match(/_img(\d+)/);
              const matchB = b.match(/_img(\d+)/);
              const numA = matchA ? parseInt(matchA[1], 10) : 999;
              const numB = matchB ? parseInt(matchB[1], 10) : 999;
              return numA - numB;
            });
            const coverImg = room.gallery.find((img) => img.includes("001"));
            room.img = coverImg || room.gallery[0];
          }
        });
      }

      const imageCount = Object.values(rooms).reduce((sum, r) => sum + (r.gallery?.length || 0), 0);
      const videoCount = Object.values(rooms).reduce((sum, r) => sum + (r.videos?.length || 0), 0);
      console.log(`  Images assigned: ${imageCount}`);
      console.log(`  Videos assigned: ${videoCount}`);
    }

    // ── Build final output ────────────────────────────────────────────────────
    const roomsData = Object.values(rooms).map((room, index) => ({
      id: room.id || index + 1,
      title: room.title || "Unknown",
      description: room.description || "Description coming soon...",
      img: room.img || "",
      gallery: room.gallery || [],
      videos: room.videos || [],
      model3d: room.model3d || "",
      button: room.button || "View",
      locked: false,
    }));

    // Sort by ID for consistent ordering
    roomsData.sort((a, b) => a.id - b.id);

    // Safety: only write if we actually found rooms
    if (roomsData.length > 0) {
      const fileContent = `const roomsData = ${JSON.stringify(roomsData, null, 2)};\n\nexport default roomsData;\n`;
      fs.writeFileSync("./src/roomsData.js", fileContent);
      console.log("\n✅ roomsData.js generated successfully!");
      console.log(`   Rooms written: ${roomsData.length}`);
      roomsData.forEach((r) =>
        console.log(
          `   - [${r.id}] ${r.title.padEnd(20)} | ${r.gallery.length} images | ${r.videos.length} videos`
        )
      );
    } else {
      console.warn("\n⚠️  No rooms found in Cloudinary! Aborting write to prevent data loss.");
    }
  } catch (error) {
    console.error("Error generating roomsData:", error);
  }
}

generateRoomsData();