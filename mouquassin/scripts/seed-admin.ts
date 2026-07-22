import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI!;

async function seed() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db!;

  const email = "admin@lyzane.com";
  const password = "admin123";
  const passwordHash = await bcrypt.hash(password, 12);

  const existing = await db.collection("users").findOne({ email });
  if (existing) {
    console.log("Admin user already exists:", email);
    await mongoose.disconnect();
    return;
  }

  await db.collection("users").insertOne({
    email,
    password: passwordHash,
    name: "Admin",
    role: "owner",
    createdAt: new Date(),
  });

  console.log("Admin user created:", email);
  console.log("Password:", password);
  console.log("CHANGE THIS PASSWORD IN PRODUCTION!");

  await mongoose.disconnect();
}

seed().catch(console.error);
