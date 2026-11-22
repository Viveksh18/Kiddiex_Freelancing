const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: Number, min: 0, max: 100, default: 50 },
    color: { type: String, trim: true, default: "#cfe8ff" },
  },
  { _id: false }
);

const capabilitySchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    // stored lowercase with no spaces, e.g. "bot", "gamepad-2"
    icon: { type: String, trim: true, lowercase: true, default: "" },
    color: { type: String, trim: true, default: "#5b5bd6" },
  },
  { _id: false }
);

const memberSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    name: { type: String, required: true, trim: true },
    role: { type: String, trim: true, default: "" },
    heading: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, lowercase: true, default: "" },

    photo: { type: String, default: "" },
    photoPublicId: { type: String, default: "" },
    bg: { type: String, trim: true, default: "" },

    bio: { type: [String], default: [] },
    skills: { type: [skillSchema], default: [] },
    capabilities: { type: [capabilitySchema], default: [] },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Member", memberSchema);