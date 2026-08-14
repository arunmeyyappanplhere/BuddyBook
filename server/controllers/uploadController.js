import { uploadToCloudinary, deleteFromCloudinary } from "../cloudinary.js";

export const uploadController = async (req, res) => {
  console.log(req.body);
  console.log(req.file);

  if (!req.file) {
    res.status(400).json({ message: "No file uploaded." });
    return;
  }

  try {
    const result = await uploadToCloudinary(req.file.path);

    if (result.success) {
      const { secure_url, public_id } = result.data;

      res.status(200).json({
        ok: true,
        filename: secure_url,
        public_id: public_id,
      });
    } else {
      res.status(500).json({ message: result.error || "Cloudinary upload failed." });
    }
  } catch (err) {
    console.error("Upload controller error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};