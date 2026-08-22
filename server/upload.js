import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "public", "profileImages");

// Ensure the upload directory exists.
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// File filter — only allow images
const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed."), false);
  }
};

// Storage configuration with secure filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate a random filename to prevent path traversal and name collisions
    const randomName = `${Date.now()}_${Math.random().toString(36).slice(2, 15)}${path.extname(file.originalname).toLowerCase()}`;
    return cb(null, randomName);
  },
});

// Limits to prevent DoS via large uploads
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 1, // max 1 file per request
  },
});

// Error handler for multer
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File size exceeds the 5MB limit." });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ message: "Only one file is allowed per upload." });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ message: "Unexpected file field." });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

export { upload };
