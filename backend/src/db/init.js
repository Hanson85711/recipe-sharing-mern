import mongoose from "mongoose";

export async function initializeDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
  }

  await mongoose.connect(databaseUrl);

  console.log("Connected to MongoDB");
}