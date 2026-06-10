import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

export const connectDB = async () => {

  mongoose
    .connect(MONGO_URI)
    .then(console.log("DB is connected ✅."))
    .catch((err) => {
      console.error("❌ Error occured in connecting DB: " + err);
    });
};
