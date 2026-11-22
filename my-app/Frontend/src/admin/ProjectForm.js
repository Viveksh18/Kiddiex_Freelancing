import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { adminApi } from "../services/adminApi";


const colorNames = {
  pink: "#ffd9e6",
  blue: "#e3f3ff",
  mint: "#d9f5ee",
  lavender: "#e6e6ff",
  yellow: "#ffe3a3",
  rose: "#ffe0f3",
  peach: "#ffe0b2",
  green: "#d5f5b0",
  white: "#ffffff",
};

const resolveColor = (input) => {
  const value = (input || "").trim();
  return colorNames[value.toLowerCase().replace(/\s+/g, "")] || value;
};

const slugify = (text) =>
  text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const emptyForm = {
  id: "",
  title: "",
  tag: "",
  color: "",
  image: "",
  description: "",
  role: "",
  year: String(new Date().getFullYear()),
  href: "",
  live: "",
  overview: [""],
  challenge: "",
  solution: "",
  features: [{ title: "", text: "" }],
  gallery: [],
  videos: [],
  timeline: [{ title: "", date: "", state: "upcoming", text: "" }],
  order: 0,
  isActive: true,
};

/* one image field: uploads to Cloudinary right away and stores the URL */
const ImageField = ({ label, value, onChange, onError }) => {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) return onError("Please select a valid image.");
    if (file.size > 5 * 1024 * 1024) return onError("Image must be smaller than 5 MB.");

    try {
      setUploading(true);
      const res = await adminApi.uploadImage(file);
      onChange(res.data.url);
    } catch (err) {
      onError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-image-upload">
      <label>{label}</label>
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFile}
        disabled={uploading}
      />
      {uploading && <small>Uploading...</small>}
      {value && <img src={value} alt="" className="member-image-preview" />}
    </div>
  );
};

const ProjectForm = () => {
  
  const { id } = useParams();
  console.log("ProjectForm mounted, id =", id);
  const navigate = useNavigate();
  const editing = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [toolsText, setToolsText] = useState("");
  const [idTouched, setIdTouched] = useState(false);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const redirectTimer = useRef(null);

  useEffect(() => () => clearTimeout(redirectTimer.current), []);

  useEffect(() => {
    if (!editing) return;

    const load = async () => {
      try {
        const result = await adminApi.getAdminProject(id);
        setForm({ ...emptyForm, ...result.data });
        setToolsText((result.data.tools || []).join(", "));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, editing]);

  const showToast = (type, message) => {
    setToast({ type, message });
    if (type === "error") setTimeout(() => setToast(null), 4000);
  };

  const fail = (message) => {
    setError(message);
    showToast("error", message);
  };

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const updateTitle = (value) =>
    setForm((prev) => ({
      ...prev,
      title: value,
      id: editing || idTouched ? prev.id : slugify(value),
    }));

  /* generic helpers for list fields */
  const updateItem = (field, index, key, value) =>
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      ),
    }));

  const addItem = (field, item) =>
    setForm((prev) => ({ ...prev, [field]: [...prev[field], item] }));

  const removeItem = (field, index) =>
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));

  const updateOverview = (index, value) =>
    setForm((prev) => ({
      ...prev,
      overview: prev.overview.map((p, i) => (i === index ? value : p)),
    }));

  /* gallery: upload several images, append the URLs */
  const handleGallery = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;

    try {
      setUploadingGallery(true);
      for (const file of files) {
        if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
          fail(`"${file.name}" skipped: use an image under 5 MB.`);
          continue;
        }
        const res = await adminApi.uploadImage(file);
        setForm((prev) => ({ ...prev, gallery: [...prev.gallery, res.data.url] }));
      }
    } catch (err) {
      fail(err.message);
    } finally {
      setUploadingGallery(false);
    }
  };

  const saveProject = async (e) => {
    e.preventDefault();
    setError("");

    const projectId = form.id.trim().toLowerCase();
    if (!projectId || !form.title.trim()) {
      return fail("Project ID and title are required.");
    }

    const payload = {
      ...form,
      id: projectId,
      title: form.title.trim(),
      color: resolveColor(form.color) || "#e3f3ff",
      tools: toolsText.split(",").map((t) => t.trim()).filter(Boolean),
      overview: form.overview.filter((p) => p.trim()),
      features: form.features.filter((f) => f.title.trim()),
      timeline: form.timeline.filter((t) => t.title.trim()),
      videos: form.videos
        .filter((v) => v.src.trim())
        .map((v, i) => ({ ...v, id: `${projectId}-v${i + 1}`, type: "file" })),
      order: Number(form.order) || 0,
    };

    try {
      setSaving(true);

      if (editing) await adminApi.updateProject(id, payload);
      else await adminApi.addProject(payload);

      showToast(
        "success",
        editing ? "Project updated successfully." : "Project saved successfully."
      );

      redirectTimer.current = setTimeout(() => navigate("/admin/projects"), 1500);
    } catch (err) {
      fail(err.message || "Could not save project.");
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-content">Loading project...</div>;

  return (
    <div className="admin-content">
      {toast && (
        <div className={`admin-toast ${toast.type}`} role="status">
          <span className="admin-toast-icon">{toast.type === "success" ? "✓" : "!"}</span>
          <span>{toast.message}</span>
          <button type="button" className="admin-toast-close" onClick={() => setToast(null)} aria-label="Close">
            ×
          </button>
        </div>
      )}

      <header className="admin-topbar">
        <div>
          <h1>{editing ? "Edit Project" : "Add New Project"}</h1>
          <p>Everything here appears on your public projects page.</p>
        </div>
        <Link to="/admin/projects" className="admin-secondary-btn">
          Back to Projects
        </Link>
      </header>

      {error && <div className="admin-alert">{error}</div>}

      <form className="admin-panel admin-form" onSubmit={saveProject}>
        <h2>Basic Information</h2>

        <div className="admin-form-grid">
          <label>
            Title *
            <input
              value={form.title}
              onChange={(e) => updateTitle(e.target.value)}
              placeholder="AI Powered Email Copilot"
              required
            />
          </label>

          <label>
            Project ID * (used in the URL)
            <input
              value={form.id}
              disabled={editing}
              onChange={(e) => {
                setIdTouched(true);
                updateField("id", e.target.value);
              }}
              placeholder="email-copilot"
              required
            />
          </label>

          <label>
            Tag
            <input
              value={form.tag}
              onChange={(e) => updateField("tag", e.target.value)}
              placeholder="AI Agent, AI Video, Motion Graphics"
            />
          </label>

          <label>
            Card Color (name or hex)
            <input
              value={form.color}
              onChange={(e) => updateField("color", e.target.value)}
              placeholder="pink, blue, mint, lavender..."
            />
            {form.color && (
              <span
                style={{
                  display: "inline-block",
                  width: 28,
                  height: 28,
                  marginTop: 8,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  background: resolveColor(form.color),
                }}
              />
            )}
          </label>

          <label>
            Role
            <input
              value={form.role}
              onChange={(e) => updateField("role", e.target.value)}
              placeholder="AI Agent Design & Development"
            />
          </label>

          <label>
            Year
            <input value={form.year} onChange={(e) => updateField("year", e.target.value)} />
          </label>

          <label>
            Tools (comma separated)
            <input
              value={toolsText}
              onChange={(e) => setToolsText(e.target.value)}
              placeholder="React, Node.js, LLM API"
            />
          </label>

          <label>
            Display Order (lower shows first)
            <input
              type="number"
              value={form.order}
              onChange={(e) => updateField("order", e.target.value)}
            />
          </label>

          <label>
            GitHub / Source Link
            <input value={form.href} onChange={(e) => updateField("href", e.target.value)} placeholder="https://github.com/..." />
          </label>

          <label>
            Live Demo Link (leave empty to hide the button)
            <input value={form.live} onChange={(e) => updateField("live", e.target.value)} placeholder="https://..." />
          </label>

          <ImageField
            label="Cover Image"
            value={form.image}
            onChange={(url) => updateField("image", url)}
            onError={fail}
          />
        </div>

        <label>
          Short Description
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="One or two sentences shown on the project card."
          />
        </label>

        <hr />

        <div className="admin-section-heading">
          <h2>Overview</h2>
          <button type="button" className="admin-small-btn" onClick={() => addItem("overview", "")}>
            + Add Paragraph
          </button>
        </div>

        {form.overview.map((text, index) => (
          <div className="admin-array-row" key={index}>
            <textarea
              value={text}
              onChange={(e) => updateOverview(index, e.target.value)}
              placeholder="Overview paragraph..."
            />
            <button type="button" className="admin-delete-btn" onClick={() => removeItem("overview", index)}>
              Remove
            </button>
          </div>
        ))}

        <div className="admin-form-grid">
          <label>
            Challenge
            <textarea value={form.challenge} onChange={(e) => updateField("challenge", e.target.value)} />
          </label>
          <label>
            Solution
            <textarea value={form.solution} onChange={(e) => updateField("solution", e.target.value)} />
          </label>
        </div>

        <hr />

        <div className="admin-section-heading">
          <h2>Features</h2>
          <button type="button" className="admin-small-btn" onClick={() => addItem("features", { title: "", text: "" })}>
            + Add Feature
          </button>
        </div>

        {form.features.map((f, index) => (
          <div className="admin-form-grid admin-array-card" key={index}>
            <label>
              Feature Title
              <input value={f.title} onChange={(e) => updateItem("features", index, "title", e.target.value)} />
            </label>
            <label>
              Feature Text
              <input value={f.text} onChange={(e) => updateItem("features", index, "text", e.target.value)} />
            </label>
            <button type="button" className="admin-delete-btn" onClick={() => removeItem("features", index)}>
              Remove
            </button>
          </div>
        ))}

        <hr />

        <div className="admin-section-heading">
          <h2>Gallery Images</h2>
        </div>

        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          onChange={handleGallery}
          disabled={uploadingGallery}
        />
        {uploadingGallery && <small> Uploading...</small>}

        <div className="admin-gallery">
          {form.gallery.map((url, index) => (
            <div className="admin-gallery-item" key={url + index}>
              <img src={url} alt="" />
              <button type="button" className="admin-delete-btn" onClick={() => removeItem("gallery", index)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <hr />

        <div className="admin-section-heading">
          <h2>Videos</h2>
          <button
            type="button"
            className="admin-small-btn"
            onClick={() =>
              addItem("videos", { id: "", category: "ai", title: "", type: "file", src: "", poster: "", ratio: "" })
            }
          >
            + Add Video
          </button>
        </div>

        {form.videos.map((v, index) => (
          <div className="admin-form-grid admin-array-card" key={index}>
            <label>
              Video Title
              <input value={v.title} onChange={(e) => updateItem("videos", index, "title", e.target.value)} />
            </label>

            <label>
              Category
              <select value={v.category} onChange={(e) => updateItem("videos", index, "category", e.target.value)}>
                <option value="ai">AI Video</option>
                <option value="motion">Motion Graphics</option>
              </select>
            </label>

            <label>
              Video URL (.mp4 link)
              <input
                value={v.src}
                onChange={(e) => updateItem("videos", index, "src", e.target.value)}
                placeholder="https://res.cloudinary.com/.../video.mp4"
              />
            </label>

            <label>
              Aspect Ratio (empty = 16 / 9)
              <input
                value={v.ratio}
                onChange={(e) => updateItem("videos", index, "ratio", e.target.value)}
                placeholder="9 / 16 or 1 / 1"
              />
            </label>

            <ImageField
              label="Poster Image"
              value={v.poster}
              onChange={(url) => updateItem("videos", index, "poster", url)}
              onError={fail}
            />

            <button type="button" className="admin-delete-btn" onClick={() => removeItem("videos", index)}>
              Remove
            </button>
          </div>
        ))}

        <hr />

        <div className="admin-section-heading">
          <h2>Timeline</h2>
          <button
            type="button"
            className="admin-small-btn"
            onClick={() => addItem("timeline", { title: "", date: "", state: "upcoming", text: "" })}
          >
            + Add Step
          </button>
        </div>

        {form.timeline.map((t, index) => (
          <div className="admin-form-grid admin-array-card" key={index}>
            <label>
              Step Title
              <input value={t.title} onChange={(e) => updateItem("timeline", index, "title", e.target.value)} />
            </label>
            <label>
              Date
              <input value={t.date} onChange={(e) => updateItem("timeline", index, "date", e.target.value)} placeholder="Oct 2026" />
            </label>
            <label>
              Status
              <select value={t.state} onChange={(e) => updateItem("timeline", index, "state", e.target.value)}>
                <option value="done">Done</option>
                <option value="current">In progress</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </label>
            <label>
              Details
              <input value={t.text} onChange={(e) => updateItem("timeline", index, "text", e.target.value)} />
            </label>
            <button type="button" className="admin-delete-btn" onClick={() => removeItem("timeline", index)}>
              Remove
            </button>
          </div>
        ))}

        <hr />

        <label className="admin-checkbox">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => updateField("isActive", e.target.checked)}
          />
          Show this project on the public website
        </label>

        <div className="admin-form-actions">
          <Link to="/admin/projects" className="admin-secondary-btn">
            Cancel
          </Link>
          <button type="submit" className="admin-primary-btn" disabled={saving}>
            {saving && <span className="btn-spinner" />}
            {saving ? "Saving..." : editing ? "Update Project" : "Save Project"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;