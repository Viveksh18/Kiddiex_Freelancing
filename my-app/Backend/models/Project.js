const mongoose = require("mongoose");

const featureSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: "" },
    text: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const timelineSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: "" },
    date: { type: String, trim: true, default: "" },
    state: { type: String, enum: ["done", "current", "upcoming"], default: "upcoming" },
    text: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const videoSchema = new mongoose.Schema(
  {
    id: { type: String, trim: true, default: "" },
    category: { type: String, trim: true, default: "ai" },
    title: { type: String, trim: true, default: "" },
    type: { type: String, trim: true, default: "file" },
    src: { type: String, trim: true, default: "" },
    poster: { type: String, trim: true, default: "" },
    ratio: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    tag: { type: String, trim: true, default: "" },
    color: { type: String, trim: true, default: "#e3f3ff" },
    image: { type: String, default: "" },
    description: { type: String, trim: true, default: "" },
    role: { type: String, trim: true, default: "" },
    year: { type: String, trim: true, default: "" },
    tools: { type: [String], default: [] },
    href: { type: String, trim: true, default: "" },
    live: { type: String, trim: true, default: "" },
    overview: { type: [String], default: [] },
    challenge: { type: String, trim: true, default: "" },
    solution: { type: String, trim: true, default: "" },
    features: { type: [featureSchema], default: [] },
    gallery: { type: [String], default: [] },
    videos: { type: [videoSchema], default: [] },
    timeline: { type: [timelineSchema], default: [] },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 }, // lower number shows first
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);