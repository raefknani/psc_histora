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
      .expression(`folder:histora-psc/* AND resource_type:${resourceType}`)
      .with_field('context')
      .with_field('metadata')
      .with_field('tags')
      .max_results(500);
      
    if (nextCursor) {
      query = query.next_cursor(nextCursor);
    }
    
    const result = await query.execute();
    
    if (result.resources.length > 0 && allResources.length === 0) {
       console.log(`Sample ${resourceType} full resource object:`);
       console.log(JSON.stringify(result.resources[0], null, 2));
    }

    allResources = allResources.concat(result.resources);
    nextCursor = result.next_cursor;

  } while (nextCursor);

  return allResources;
}

async function generateRoomsData() {
  try {
    console.log("Fetching images...");
    const imageResources = await fetchResources("image");

    console.log("Fetching videos...");
    const videoResources = await fetchResources("video");
    
    console.log("Fetching descriptions (.txt files)...");
    const rawResources = await fetchResources("raw");

    const allResources = [...imageResources, ...videoResources];

    console.log(`Total media resources found: ${allResources.length}`);

    const rooms = {};

    // Process descriptions first
    for (const resource of rawResources) {
      const filename = resource.public_id.split("/").pop();
      // Filename like: zhaz_cbpp01.txt
      const category = filename.split("_")[0];
      
      if (!category) continue;
      
      if (!rooms[category]) {
        rooms[category] = { images: [], videos: [], description: "" };
      }
      
      try {
        const response = await fetch(resource.secure_url);
        const text = await response.text();
        rooms[category].description = text.trim();
      } catch (err) {
        console.error(`Failed to fetch description for ${category}:`, err);
      }
    }

    allResources.forEach((resource) => {
      // Ignore sample images
      if (resource.public_id.startsWith("samples/")) return;

      const filename = resource.public_id.split("/").pop();
      
      // Filenames look like: atelierTissage_img006_konhor, zhaz_img020_zh0dxq
      // We want to extract the part before the first underscore as the category
      const category = filename.split("_")[0];

      if (!category) return;

      if (!rooms[category]) {
        rooms[category] = {
          images: [],
          videos: [],
          description: "",
        };
      }

      const url = resource.secure_url;

      if (resource.resource_type === "image") {
        rooms[category].images.push(url);
      }

      if (resource.resource_type === "video") {
        rooms[category].videos.push(url);
      }
    });

    const roomsData = Object.keys(rooms).map((category, index) => ({
      id: index + 1,

      title: category
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase()),

      description: rooms[category].description || "Description coming soon...",

      img: rooms[category].images[0] || "",

      gallery: rooms[category].images,

      videos: rooms[category].videos,

      button: "View",
    }));

    const content = `
const roomsData = ${JSON.stringify(roomsData, null, 2)};

export default roomsData;
`;

    fs.writeFileSync("./src/roomsData.js", content);

    console.log("roomsData.js generated successfully");
    console.log(`Rooms generated: ${roomsData.length}`);

  } catch (error) {
    console.error("Error generating roomsData:", error);
  }
}

generateRoomsData();