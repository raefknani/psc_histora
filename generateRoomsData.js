const cloudinary = require("cloudinary").v2;
const fs = require("fs");
require("dotenv").config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function fetchResources(resourceType) {
  let allResources = [];
  let nextCursor = null;

  do {
    let query = cloudinary.search
      .expression(`(folder:histora-psc/* OR folder:histora-psc/3D_models/* OR folder:histora-psc/*/3D_models/*) AND resource_type:${resourceType}`)
      .with_field('context')
      .with_field('metadata')
      .with_field('tags')
      .max_results(500);
      
    if (nextCursor) {
      query = query.next_cursor(nextCursor);
    }
    
    const result = await query.execute();
    
    console.log(`Fetched ${result.resources.length} resources for ${resourceType}`);
    if (result.resources.length > 0) {
       console.log(`First resource public_id: ${result.resources[0].public_id}`);
    }

    allResources = allResources.concat(result.resources);
    nextCursor = result.next_cursor;

  } while (nextCursor);

  return allResources;
}

async function generateRoomsData() {
  try {
    const args = process.argv.slice(2);
    const fetchImages = args.length === 0 || args.includes('--images');
    const fetchVideos = args.length === 0 || args.includes('--videos');
    const fetchDescriptions = args.length === 0 || args.includes('--descriptions');

    let existingData = [];
    try {
      const content = fs.readFileSync("./src/roomsData.js", "utf8");
      const jsonStr = content.substring(content.indexOf("["), content.lastIndexOf("]") + 1);
      existingData = JSON.parse(jsonStr);
      console.log(`Loaded ${existingData.length} existing rooms from roomsData.js`);
    } catch (e) {
      console.log("Could not parse existing roomsData.js, starting fresh.");
    }

    const rooms = {};

    // Initialize with existing data to preserve manually updated IDs and titles
    existingData.forEach((room) => {
      // Re-derive category from gallery or title to match Cloudinary filenames
      let category = "";
      if (room.img) {
        const match = room.img.match(/\/([^/_]+)_img/);
        if (match) category = match[1];
      }
      if (!category && room.gallery && room.gallery.length > 0) {
        const match = room.gallery[0].match(/\/([^/_]+)_img/);
        if (match) category = match[1];
      }
      if (!category) {
        // camelCase the title as fallback (e.g., "Atelier Tissage" -> "atelierTissage")
        category = room.title.replace(/\s(.)/g, m => m[1].toUpperCase());
        category = category.charAt(0).toLowerCase() + category.slice(1);
      }
      
      rooms[category] = { ...room };
    });

    if (fetchDescriptions) {
      console.log("Fetching descriptions (.txt files)...");
      const rawResources = await fetchResources("raw");
      for (const resource of rawResources) {
        const filename = resource.public_id.split("/").pop();
        const category = filename.split("_")[0];
        if (!category) continue;
        
        if (!rooms[category]) {
          rooms[category] = { title: category.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()) };
        }
        
        const isSTL = resource.format === "stl" || filename.toLowerCase().endsWith(".stl") || resource.public_id.toLowerCase().includes("3d_view");
        const isTXT = resource.format === "txt" || filename.toLowerCase().endsWith(".txt");

        if (isTXT) {
          try {
            console.log(`Fetching description for ${category}...`);
            const response = await fetch(resource.secure_url);
            const text = await response.text();
            rooms[category].description = text.trim();
          } catch (err) {
            console.error(`Failed to fetch description for ${category}:`, err);
          }
        } else if (isSTL) {
          console.log(`Found 3D model for ${category}: ${filename}`);
          rooms[category].model3d = resource.secure_url;
        }
      }
    }

    if (fetchImages || fetchVideos) {
      const mediaResources = [];
      if (fetchImages) {
        console.log("Fetching images...");
        mediaResources.push(...(await fetchResources("image")));
      }
      if (fetchVideos) {
        console.log("Fetching videos...");
        mediaResources.push(...(await fetchResources("video")));
      }
      
      console.log(`Total media resources fetched: ${mediaResources.length}`);

      // If we are fetching images or videos, we clear the existing ones so we don't duplicate
      if (fetchImages) {
        Object.values(rooms).forEach(r => { r.gallery = []; r.img = ""; });
      }
      if (fetchVideos) {
        Object.values(rooms).forEach(r => r.videos = []);
      }

      mediaResources.forEach((resource) => {
        if (resource.public_id.startsWith("samples/")) return;

        const filename = resource.public_id.split("/").pop();
        const category = filename.split("_")[0];

        if (!category) return;

        if (!rooms[category]) {
          rooms[category] = {
            title: category.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
            gallery: [],
            videos: [],
            description: "Description coming soon...",
          };
        }

        const url = resource.secure_url;

        if (resource.resource_type === "image" && fetchImages) {
          rooms[category].gallery = rooms[category].gallery || [];
          rooms[category].gallery.push(url);
          if (!rooms[category].img) {
            rooms[category].img = url;
          }
        }

        if (resource.resource_type === "video" && fetchVideos) {
          rooms[category].videos = rooms[category].videos || [];
          rooms[category].videos.push(url);
        }
      });
      
      // Make sure 001 image is the main img if it exists
      if (fetchImages) {
        Object.values(rooms).forEach(room => {
           if (room.gallery && room.gallery.length > 0) {
              // Sort the gallery by the image number (e.g., img001, img002)
              room.gallery.sort((a, b) => {
                const matchA = a.match(/_img(\d+)/);
                const matchB = b.match(/_img(\d+)/);
                const numA = matchA ? parseInt(matchA[1], 10) : 0;
                const numB = matchB ? parseInt(matchB[1], 10) : 0;
                return numA - numB;
              });

              // Set main cover image
              const coverImg = room.gallery.find(img => img.includes("001"));
              room.img = coverImg || room.gallery[0];
           }
        });
      }
    }

    const roomsData = Object.values(rooms).map((room, index) => ({
      id: room.id || index + 1,
      title: room.title || "Unknown",
      description: room.description || "Description coming soon...",
      img: room.img || "",
      gallery: room.gallery || [],
      videos: room.videos || [],
      model3d: room.model3d || "",
      button: room.button || "View",
    }));

    // Optional: Sort by ID if it exists so the order remains consistent
    roomsData.sort((a, b) => a.id - b.id);

    // Safety: Only write if we actually have rooms
    if (roomsData.length > 0) {
      const content = `const roomsData = ${JSON.stringify(roomsData, null, 2)};\n\nexport default roomsData;\n`;
      fs.writeFileSync("./src/roomsData.js", content);
      console.log("roomsData.js generated successfully");
      console.log(`Rooms updated: ${roomsData.length}`);
    } else {
      console.warn("No rooms found in Cloudinary! Aborting write to prevent data loss.");
    }

  } catch (error) {
    console.error("Error generating roomsData:", error);
  }
}

generateRoomsData();