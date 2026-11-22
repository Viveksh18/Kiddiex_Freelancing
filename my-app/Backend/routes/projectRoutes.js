const express = require("express");
const Project = require("../models/Project");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

const FIELDS = [
  "title", "tag", "color", "image", "description", "role", "year", "tools",
  "href", "live", "overview", "challenge", "solution", "features",
  "gallery", "videos", "timeline", "isActive", "order",
];

// copy only allowed fields from the request body
const pick = (body) =>
  FIELDS.reduce((out, key) => {
    if (body[key] !== undefined) out[key] = body[key];
    return out;
  }, {});

const fail = (res, error, status = 500) =>
  res.status(status).json({ success: false, message: error.message || error });

/* ---------- admin (must be registered before "/:id") ---------- */

// all projects, including hidden ones
router.get("/admin/list", requireAdmin, async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
    res.json({ success: true, data: projects });
  } catch (error) {
    fail(res, error);
  }
});

// one project, even if hidden (for the edit form)
router.get("/admin/:id", requireAdmin, async (req, res) => {
  try {
    const project = await Project.findOne({ id: req.params.id }).lean();
    if (!project) return fail(res, "Project not found.", 404);
    res.json({ success: true, data: project });
  } catch (error) {
    fail(res, error);
  }
});

router.post("/", requireAdmin, async (req, res) => {
  try {
    const id = (req.body.id || "").trim().toLowerCase();
    const title = (req.body.title || "").trim();

    if (!id || !title) return fail(res, "Project ID and title are required.", 400);

    if (await Project.findOne({ id })) {
      return fail(res, "A project with this ID already exists.", 409);
    }

    const project = await Project.create({ ...pick(req.body), id, title });
    res.status(201).json({
      success: true,
      message: "Project created successfully.",
      data: project,
    });
  } catch (error) {
    fail(res, error);
  }
});

router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { id: req.params.id },
      { $set: pick(req.body) },
      { new: true, runValidators: true }
    );
    if (!project) return fail(res, "Project not found.", 404);
    res.json({
      success: true,
      message: "Project updated successfully.",
      data: project,
    });
  } catch (error) {
    fail(res, error);
  }
});

// hide by default; ?permanent=true removes it from the database
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const permanent = req.query.permanent === "true";

    const project = permanent
      ? await Project.findOneAndDelete({ id: req.params.id })
      : await Project.findOneAndUpdate(
          { id: req.params.id },
          { isActive: false },
          { new: true }
        );

    if (!project) return fail(res, "Project not found.", 404);
    res.json({
      success: true,
      message: permanent ? "Project deleted." : "Project hidden.",
    });
  } catch (error) {
    fail(res, error);
  }
});

/* ---------- public ---------- */

router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    res.json({ success: true, data: projects });
  } catch (error) {
    fail(res, error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findOne({ id: req.params.id, isActive: true }).lean();
    if (!project) return fail(res, "Project not found.", 404);
    res.json({ success: true, data: project });
  } catch (error) {
    fail(res, error);
  }
});

module.exports = router;