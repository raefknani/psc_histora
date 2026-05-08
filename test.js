const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function run() {
  const result = await cloudinary.search
    .expression('folder:histora-psc/* AND resource_type:raw')
    .max_results(500)
    .execute();

  console.log('Raw files found:', result.resources.length);
  result.resources.forEach(r => console.log(r.public_id, r.secure_url));
}

run().catch(console.error);
