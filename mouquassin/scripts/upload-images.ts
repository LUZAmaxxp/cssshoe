import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: ".env.local" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const images = [
  "branding7.png",
  "first.PNG",
  "grid1.PNG",
  "grid2.PNG",
  "grid3.PNG",
  "grid4.PNG",
  "don2.jpg",
  "logo.jpg",
  "logo1v1.png",
  "title-nobg.png",
];

async function uploadAll() {
  const results: Record<string, string> = {};

  for (const file of images) {
    const filePath = path.join("public/images", file);
    if (!fs.existsSync(filePath)) {
      console.log(`SKIP: ${file} not found`);
      continue;
    }

    const stat = fs.statSync(filePath);
    const sizeMB = (stat.size / 1024 / 1024).toFixed(1);
    console.log(`Uploading ${file} (${sizeMB}MB)...`);

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "lyzane",
        public_id: file.replace(/\.[^.]+$/, ""),
        resource_type: "image",
        overwrite: true,
      });
      results[file] = result.secure_url;
      console.log(`  OK: ${result.secure_url}`);
    } catch (err) {
      console.error(`  FAIL: ${file}`, err);
    }
  }

  console.log("\n--- URL Map ---");
  console.log(JSON.stringify(results, null, 2));
}

uploadAll().catch(console.error);
