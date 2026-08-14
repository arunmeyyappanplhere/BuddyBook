import express from "express";
import { connectDB } from "./db.js";
import dotenv from "dotenv";
import routes from "./routes/route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(express.json());
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Hi, from server!");
});

// 404 handler for unknown API routes.
app.use("/api", (req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Global error handler.
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal Server Error" });
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
