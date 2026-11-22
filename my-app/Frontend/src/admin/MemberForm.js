import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { adminApi } from "../services/adminApi";

const emptyForm = {
  id: "",
  name: "",
  role: "",
  heading: "",
  email: "",
  photo: "",
  bg: "",
  bio: [""],
  skills: [{ label: "", value: 50, color: "#6366f1" }],
  capabilities: [{ label: "", icon: "", color: "#6366f1" }],
  isActive: true,
};

const colorNames = {
  // light shades (good for skill bars)
  lightblue: "#cfe8ff",
  lightgreen: "#d5f5b0",
  lightpink: "#ffd0ec",
  lavender: "#d6d6ff",
  peach: "#ffe0b2",
  mint: "#c8f7dc",
  yellow: "#ffc83d",
  orange: "#ff9f5c",

  // stronger shades (good for capability icons)
  indigo: "#5b5bd6",
  blue: "#3f7fbf",
  gold: "#d19a00",
  green: "#6aa820",
  purple: "#9b59b6",
  teal: "#009688",
  pink: "#d6457f",
  skyblue: "#0078d4",
  red: "#e53935",
  black: "#111111",
};

const resolveColor = (input) => {
  const value = (input || "").trim();
  return colorNames[value.toLowerCase().replace(/\s+/g, "")] || value;
};

const MemberForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");



  const [toast, setToast] = useState(null); // { type: "success" | "error", message }
  const redirectTimer = useRef(null);

  useEffect(() => {
    return () => clearTimeout(redirectTimer.current);
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    if (type === "error") {
      setTimeout(() => setToast(null), 4000);
    }
  };
  useEffect(() => {
    if (!editing) return;

    const loadMember = async () => {
      try {
        const result = await adminApi.getMember(id);
        setForm({ ...emptyForm, ...result.data });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMember();
  }, [id, editing]);

  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };


  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      return;
    }

    setError("");
    setPhotoFile(file);

    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
  };

  const updateArrayItem = (field, index, key, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: previous[field].map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      ),
    }));
  };

  const addArrayItem = (field, item) => {
    setForm((previous) => ({
      ...previous,
      [field]: [...previous[field], item],
    }));
  };

  const removeArrayItem = (field, index) => {
    setForm((previous) => ({
      ...previous,
      [field]: previous[field].filter((_, i) => i !== index),
    }));
  };

  const updateBio = (index, value) => {
    setForm((previous) => ({
      ...previous,
      bio: previous.bio.map((item, i) => (i === index ? value : item)),
    }));
  };

  const saveMember = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.id.trim() || !form.name.trim()) {
      setError("Member ID and name are required.");
      showToast("error", "Member ID and name are required.");
      return;
    }

    const payload = new FormData();

    Object.entries({
      ...form,
      bio: JSON.stringify(form.bio.filter(Boolean)),
      skills: JSON.stringify(
        form.skills
          .filter((item) => item.label.trim())
          .map((item) => ({ ...item, color: resolveColor(item.color) }))
      ),
      capabilities: JSON.stringify(
        form.capabilities
          .filter((item) => item.label.trim())
          .map((item) => ({ ...item, color: resolveColor(item.color) }))
      ),
    }).forEach(([key, value]) => {
      if (key === "photo") return; // old photo URL is not a form field
      payload.append(key, value ?? "");
    });

    if (photoFile) {
      payload.append("photo", photoFile);
    }

    try {
      setSaving(true);

      if (editing) {
        await adminApi.updateMember(id, payload);
      } else {
        await adminApi.addMember(payload);
      }

      showToast(
        "success",
        editing ? "Member updated successfully." : "Member saved successfully."
      );

      // let the admin see the message, then go back to the list
      redirectTimer.current = setTimeout(() => {
        navigate("/admin/members");
      }, 1500);
    } catch (err) {
      setError(err.message);
      showToast("error", err.message || "Could not save member.");
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-content">Loading member...</div>;

  return (
    <div className="admin-content">
      {toast && (
        <div className={`admin-toast ${toast.type}`} role="status">
          <span className="admin-toast-icon">
            {toast.type === "success" ? "✓" : "!"}
          </span>
          <span>{toast.message}</span>
          <button
            type="button"
            className="admin-toast-close"
            onClick={() => setToast(null)}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}
      <header className="admin-topbar">
        <div>
          <h1>{editing ? "Edit Member" : "Add New Member"}</h1>
          <p>Enter the team member's profile information.</p>
        </div>

        <Link to="/admin/members" className="admin-secondary-btn">
          Back to Members
        </Link>
      </header>

      {error && <div className="admin-alert">{error}</div>}

      <form className="admin-panel admin-form" onSubmit={saveMember}>
        <h2>Basic Information</h2>

        <div className="admin-form-grid">
          <label>
            Member ID *
            <input
              value={form.id}
              disabled={editing}
              onChange={(e) => updateField("id", e.target.value)}
              placeholder="e.g. vivek"
              required
            />
          </label>

          <label>
            Full Name *
            <input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Full name"
              required
            />
          </label>

          <label>
            Role
            <input
              value={form.role}
              onChange={(e) => updateField("role", e.target.value)}
              placeholder="AI Developer"
            />
          </label>

          <label>
            Heading
            <input
              value={form.heading}
              onChange={(e) => updateField("heading", e.target.value)}
              placeholder="Profile heading"
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="member@example.com"
            />
          </label>

          <div className="admin-image-upload">
            <label>Member Profile Image</label>

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageChange}
            />

            {(photoPreview || form.photo) && (
              <img
                src={photoPreview || form.photo}
                alt="Member preview"
                className="member-image-preview"
              />
            )}
          </div>

          <label>
            Background
            <input
              value={form.bg}
              onChange={(e) => updateField("bg", e.target.value)}
              placeholder="CSS background value or class"
            />
          </label>
        </div>

        <hr />

        <div className="admin-section-heading">
          <h2>Biography</h2>
          <button
            type="button"
            className="admin-small-btn"
            onClick={() => addArrayItem("bio", "")}
          >
            + Add Bio
          </button>
        </div>

        {form.bio.map((item, index) => (
          <div className="admin-array-row" key={index}>
            <textarea
              value={item}
              onChange={(e) => updateBio(index, e.target.value)}
              placeholder="Write a biography paragraph..."
            />
            <button
              type="button"
              className="admin-delete-btn"
              onClick={() => removeArrayItem("bio", index)}
            >
              Remove
            </button>
          </div>
        ))}

        <hr />

        <div className="admin-section-heading">
          <h2>Skills</h2>
          <button
            type="button"
            className="admin-small-btn"
            onClick={() =>
              addArrayItem("skills", {
                label: "",
                value: 50,
                color: "#6366f1",
              })
            }
          >
            + Add Skill
          </button>
        </div>

        {form.skills.map((skill, index) => (
          <div className="admin-form-grid admin-array-card" key={index}>
            <label>
              Skill Name
              <input
                value={skill.label}
                onChange={(e) =>
                  updateArrayItem("skills", index, "label", e.target.value)
                }
              />
            </label>

            <label>
              Skill Level (0–100)
              <input
                type="number"
                min="0"
                max="100"
                value={skill.value}
                onChange={(e) =>
                  updateArrayItem(
                    "skills",
                    index,
                    "value",
                    Number(e.target.value)
                  )
                }
              />
            </label>

            <label>
              Color (name)
              <input
                value={skill.color || ""}
                onChange={(e) =>
                  updateArrayItem("skills", index, "color", e.target.value)
                }
                placeholder="e.g. lightblue, lavender"
              />
              {skill.color && (
                <span
                  style={{
                    display: "inline-block",
                    width: 24,
                    height: 24,
                    marginTop: 6,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    background: resolveColor(skill.color),
                  }}
                />
              )}
            </label>

            <button
              type="button"
              className="admin-delete-btn"
              onClick={() => removeArrayItem("skills", index)}
            >
              Remove
            </button>
          </div>
        ))}

        <hr />

        <div className="admin-section-heading">
          <h2>Capabilities</h2>
          <button
            type="button"
            className="admin-small-btn"
            onClick={() =>
              addArrayItem("capabilities", {
                label: "",
                icon: "",
                color: "#6366f1",
              })
            }
          >
            + Add Capability
          </button>
        </div>

        {form.capabilities.map((item, index) => (
          <div className="admin-form-grid admin-array-card" key={index}>
            <label>
              Capability Name
              <input
                value={item.label}
                onChange={(e) =>
                  updateArrayItem(
                    "capabilities",
                    index,
                    "label",
                    e.target.value
                  )
                }
              />
            </label>

            <label>
              Icon Name
              <input
                value={item.icon || ""}
                onChange={(e) =>
                  updateArrayItem(
                    "capabilities",
                    index,
                    "icon",
                    e.target.value
                  )
                }
                placeholder="e.g. code"
              />
            </label>

            <label>
              Color (name)
              <input
                value={item.color || ""}
                onChange={(e) =>
                  updateArrayItem("capabilities", index, "color", e.target.value)
                }
                placeholder="e.g. indigo, gold, teal"
              />
              {item.color && (
                <span
                  style={{
                    display: "inline-block",
                    width: 24,
                    height: 24,
                    marginTop: 6,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    background: resolveColor(item.color),
                  }}
                />
              )}
            </label>

            <button
              type="button"
              className="admin-delete-btn"
              onClick={() => removeArrayItem("capabilities", index)}
            >
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
          Display this member on the public website
        </label>

        <div className="admin-form-actions">
          <Link to="/admin/members" className="admin-secondary-btn">
            Cancel
          </Link>

          <button
            type="submit"
            className="admin-primary-btn"
            disabled={saving}
          >
            {saving && <span className="btn-spinner" />}
            {saving ? "Saving..." : editing ? "Update Member" : "Save Member"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemberForm;