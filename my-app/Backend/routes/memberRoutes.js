const express = require("express");
const { Readable } = require("stream");

const Member = require("../models/Member");
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/upload");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

// Convert multipart JSON fields into JavaScript values
const parseField = (value, fallback) => {
  if (value === undefined) return fallback;

  if (typeof value !== "string") return value;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

// Upload an image buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "kiddiex/team",
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    Readable.from(buffer).pipe(stream);
  });
};

// GET all active members (public)
router.get("/", async (req, res) => {
  try {
    const members = await Member.find({ isActive: true })
      .sort({ createdAt: 1 })
      .lean();

    res.json({
      success: true,
      data: members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET one member (public)
router.get("/:id", async (req, res) => {
  try {
    const member = await Member.findOne({
      id: req.params.id,
      isActive: true,
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found.",
      });
    }

    res.json({
      success: true,
      data: member,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ADD member (admin)
router.post(
  "/",
  requireAdmin,
  upload.single("photo"),
  async (req, res) => {
    try {
      const {
        id,
        name,
        role,
        heading,
        email,
        bg,
        bio,
        skills,
        capabilities,
        isActive,
      } = req.body;

      if (!id?.trim() || !name?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Member ID and name are required.",
        });
      }

      const existing = await Member.findOne({ id: id.trim() });

      if (existing) {
        return res.status(409).json({
          success: false,
          message: "A member with this ID already exists.",
        });
      }

      let photo = "";
      let photoPublicId = "";

      if (req.file) {
        const uploaded = await uploadToCloudinary(req.file.buffer);
        photo = uploaded.secure_url;
        photoPublicId = uploaded.public_id;
      }

      const member = await Member.create({
        id: id.trim(),
        name: name.trim(),
        role,
        heading,
        email,
        photo,
        photoPublicId,
        bg,
        bio: parseField(bio, []),
        skills: parseField(skills, []),
        capabilities: parseField(capabilities, []),
        isActive: parseField(isActive, true),
      });

      res.status(201).json({
        success: true,
        message: "Member created successfully.",
        data: member,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// UPDATE member (admin)
router.put(
  "/:id",
  requireAdmin,
  upload.single("photo"),
  async (req, res) => {
    try {
      const member = await Member.findOne({ id: req.params.id });

      if (!member) {
        return res.status(404).json({
          success: false,
          message: "Member not found.",
        });
      }

      const fields = [
        "name",
        "role",
        "heading",
        "email",
        "bg",
      ];

      fields.forEach((field) => {
        if (req.body[field] !== undefined) {
          member[field] = req.body[field];
        }
      });

      if (req.body.bio !== undefined) {
        member.bio = parseField(req.body.bio, []);
      }

      if (req.body.skills !== undefined) {
        member.skills = parseField(req.body.skills, []);
      }

      if (req.body.capabilities !== undefined) {
        member.capabilities = parseField(req.body.capabilities, []);
      }

      if (req.body.isActive !== undefined) {
        member.isActive = parseField(req.body.isActive, true);
      }

      // Upload a replacement image if one was selected
      if (req.file) {
        const uploaded = await uploadToCloudinary(req.file.buffer);

        // Delete old Cloudinary image after the new upload succeeds
        const oldPublicId = member.photoPublicId;

        member.photo = uploaded.secure_url;
        member.photoPublicId = uploaded.public_id;

        if (oldPublicId) {
          try {
            await cloudinary.uploader.destroy(oldPublicId);
          } catch (deleteError) {
            console.error(
              "Old image deletion failed:",
              deleteError.message
            );
          }
        }
      }

      await member.save();

      res.json({
        success: true,
        message: "Member updated successfully.",
        data: member,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// DELETE member (admin) - soft delete
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const member = await Member.findOneAndUpdate(
      { id: req.params.id },
      { isActive: false },
      { new: true }
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found.",
      });
    }

    res.json({
      success: true,
      message: "Member deactivated successfully.",
      data: member,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;