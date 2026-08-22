import express from "express";
import { connectDB } from "./db.js";
import dotenv from "dotenv";
import routes from "./routes/route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import xss from "xss-clean";
import { sanitizeBody } from "./middleware/security.js";

dotenv.config();

const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust proxy if behind a reverse proxy (e.g., nginx, Vercel)
app.set("trust proxy", 1);

// Security headers
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:", "http:", "res.cloudinary.com"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'", "https:", "http:"],
        fontSrc: ["'self'", "data:", "https:", "http:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }),
);

// CORS — restrict to frontend origin only
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  }),
);

// Parse JSON with size limit to prevent large payload attacks
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Cookie parser
app.use(cookieParser());

// NoSQL injection prevention — strip $ and . operators from req.body/query/params
app.use(mongoSanitize());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// XSS prevention — sanitize user input
app.use(xss());

// Additional sanitization middleware
app.use(sanitizeBody);

// Static files with cache control
app.use(
  "/public",
  express.static(path.join(__dirname, "public"), {
    maxAge: "1d",
    etag: true,
    lastModified: true,
  }),
);

// Rate limiting — auth endpoints (prevent brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: { message: "Too many authentication attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

// General API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  message: { message: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Upload rate limiting (more restrictive)
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many upload attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiters
app.use("/api/login", authLimiter);
app.use("/api/register", authLimiter);
app.use("/api/upload", uploadLimiter);
app.use("/api", apiLimiter);

// API routes
app.use("/api", routes);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "BuddyBook API is running" });
});

// 404 handler for unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Global error handler — hide stack traces in production
app.use((err, req, res, next) => {
  const isProd = process.env.NODE_ENV === "production";
  console.error("Unhandled error:", err);

  res.status(err.status || 500).json({
    message: isProd ? "Internal Server Error" : err.message || "Internal Server Error",
    ...(isProd ? {} : { stack: err.stack }),
  });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT || 3000, () => {
      console.log(`Server is UP on port ${PORT || 3000} 🔒`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
