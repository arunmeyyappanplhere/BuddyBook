import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a profile image to Cloudinary.
 * @param {string} filePath - Local file path to upload.
 * @returns {Object} - Cloudinary upload result { secure_url, public_id }.
 */
export const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "buddybook/profile_images",
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    });

    // Clean up local file after successful upload.
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error("Failed to delete local file:", err);
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    // Attempt to clean up local file on error.
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error("Failed to delete local file after error:", err);
    }

    return { success: false, error: error.message };
  }
};

/**
 * Delete a profile image from Cloudinary.
 * @param {string} publicId - Cloudinary public ID of the image to delete.
 * @returns {Object} - Cloudinary deletion result.
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return { success: true, data: result };
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return { success: false, error: error.message };
  }
};