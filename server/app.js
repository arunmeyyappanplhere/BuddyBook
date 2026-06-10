import express from "express";
import { connectDB } from "./db.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;

const app = express();

await connectDB()
  .then(
    app.listen(PORT || 3000, () => {
      console.log("Server is UP 👍");
    }),
  )
  .catch((err) => console.log(err));
