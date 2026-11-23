const express = require("express");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const Contact = require("../models/Contact");
const requireAdmin = require("../middleware/requireAdmin"); // adjust to your path

const router = express.Router();

/* ---------- helpers ---------- */

const escapeHtml = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Brevo transactional email (HTTPS API, works on Render free tier)
async function sendEmail({ to, subject, html, replyTo }) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: process.env.BRAND_NAME || "Kiddiex",
        email: process.env.SENDER_EMAIL,
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
      ...(replyTo ? { replyTo: { email: replyTo } } : {}),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Brevo error ${res.status}: ${text}`);
  }
}

const brand = () => process.env.BRAND_NAME || "Kiddiex";

const ownerEmailHtml = (c) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
    <h2>New contact message</h2>
    <p><strong>Name:</strong> ${escapeHtml(c.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(c.email)}</p>
    <p><strong>Message:</strong></p>
    <p style="white-space:pre-wrap;background:#f4f4f5;padding:12px;border-radius:8px">${escapeHtml(c.message)}</p>
  </div>`;

const welcomeEmailHtml = (c) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px">
    <h2>Thanks for reaching out, ${escapeHtml(c.name)}!</h2>
    <p>We received your message and will get back to you soon.</p>
    <a href="${process.env.SITE_URL || "#"}"
       style="display:inline-block;margin-top:16px;padding:12px 20px;background:#4f46e5;color:#fff;border-radius:8px;text-decoration:none">
      Visit ${escapeHtml(brand())}
    </a>
    <p style="margin-top:24px;color:#64748b">— Team ${escapeHtml(brand())}</p>
  </div>`;

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later." },
});

const validateId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }
  next();
};

/* ---------- PUBLIC: submit contact form ---------- */
// POST /api/contact
router.post("/", contactLimiter, async (req, res) => {
  try {
    const { name, email, message, website } = req.body || {};

    // honeypot: bots fill the hidden "website" field
    if (website) {
      return res.status(200).json({ success: true, message: "Message sent." });
    }

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ success: false, message: "Name, email and message are required." });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email address." });
    }
    if (message.length > 3000) {
      return res
        .status(400)
        .json({ success: false, message: "Message is too long (max 3000 characters)." });
    }

    // 1) save first so the message is never lost
    const contact = await Contact.create({ name, email, message });

    // 2) respond right away
    res.status(201).json({ success: true, message: "Message sent successfully." });

    // 3) send emails in the background and record the result
    const ownerPromise = sendEmail({
      to: process.env.OWNER_EMAIL,
      subject: `New message from ${contact.name}`,
      html: ownerEmailHtml(contact),
      replyTo: contact.email,
    })
      .then(() => true)
      .catch((err) => {
        console.error("Owner email failed:", err.message);
        return false;
      });

    const welcomePromise = sendEmail({
      to: contact.email,
      subject: `Thanks for contacting ${brand()}`,
      html: welcomeEmailHtml(contact),
    })
      .then(() => true)
      .catch((err) => {
        console.error("Welcome email failed:", err.message);
        return false;
      });

    const [ownerEmailSent, welcomeEmailSent] = await Promise.all([
      ownerPromise,
      welcomePromise,
    ]);

    await Contact.findByIdAndUpdate(contact._id, { ownerEmailSent, welcomeEmailSent });
  } catch (err) {
    console.error("Contact submit error:", err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
  }
});

/* ---------- ADMIN: list messages ---------- */
// GET /api/contact?status=new&page=1&limit=20
router.get("/", requireAdmin, async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const filter = {};
    if (["new", "read", "replied"].includes(req.query.status)) {
      filter.status = req.query.status;
    }

    const [items, total] = await Promise.all([
      Contact.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Contact.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: items,
    });
  } catch (err) {
    console.error("Contact list error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

/* ---------- ADMIN: get one message ---------- */
// GET /api/contact/:id
router.get("/:id", requireAdmin, validateId, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Message not found." });
    }
    res.json({ success: true, data: contact });
  } catch (err) {
    console.error("Contact get error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

/* ---------- ADMIN: update status ---------- */
// PATCH /api/contact/:id/status   body: { "status": "read" }
router.patch("/:id/status", requireAdmin, validateId, async (req, res) => {
  try {
    const { status } = req.body || {};
    if (!["new", "read", "replied"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status." });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!contact) {
      return res.status(404).json({ success: false, message: "Message not found." });
    }
    res.json({ success: true, data: contact });
  } catch (err) {
    console.error("Contact status error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

/* ---------- ADMIN: delete ---------- */
// DELETE /api/contact/:id
router.delete("/:id", requireAdmin, validateId, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Message not found." });
    }
    res.json({ success: true, message: "Message deleted." });
  } catch (err) {
    console.error("Contact delete error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;