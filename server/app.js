import express from "express";
import { connectDB } from "./db.js";
import dotenv from "dotenv";
import routes from "./routes/route.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/public", express.static("public"));
app.use(cookieParser());
app.use(express.json());
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Hi, from server!");
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT || 3000, () => {
      console.log("Server is UP 👍");
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

startServer();
