import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

export const connectDB = async () => {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in the environment variables.");
  }
  try {
    await mongoose.connect(MONGO_URI);
    console.log("DB is connected ✅.");
  } catch (err) {
    console.error("❌ Error occured in connecting DB: " + err);
    throw err;
  }
};
