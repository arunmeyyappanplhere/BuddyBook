import express from "express";
import { connectDB } from "./db.js";
import dotenv from "dotenv";
import routes from "./routes/route.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hi, from server!");
});

await connectDB()
  .then(
    app.listen(PORT || 3000, () => {
      console.log("Server is UP 👍");
    }),
  )
  .catch((err) => console.log(err));

app.use("/api", routes);
