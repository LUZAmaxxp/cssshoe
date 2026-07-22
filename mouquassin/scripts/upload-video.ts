import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API key:", process.env.CLOUDINARY_API_KEY ? "set" : "missing");
console.log("API secret:", process.env.CLOUDINARY_API_SECRET ? "set" : "missing");

async function uploadVideo() {
  console.log("Uploading craft-optimized.mp4 to Cloudinary...");

  const result = await cloudinary.uploader.upload(
    "public/images/craft-optimized.mp4",
    {
      resource_type: "video",
      public_id: "craft-video",
      overwrite: true,
    }
  );

  console.log("Upload complete!");
  console.log("URL:", result.secure_url);
  console.log("Public ID:", result.public_id);
}

uploadVideo().catch(console.error);
