const express = require("express");
const { Readable } = require("stream");

const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/upload");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

const uploadToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    Readable.from(buffer).pipe(stream);
  });

router.post("/image", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image received." });
    }

    const uploaded = await uploadToCloudinary(req.file.buffer, "kiddiex/projects");

    res.json({
      success: true,
      data: { url: uploaded.secure_url, publicId: uploaded.public_id },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;