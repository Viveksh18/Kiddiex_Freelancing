require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();

const PORT = process.env.PORT || 5000;
const BRAND = process.env.BRAND_NAME || "Kiddiex";
const SITE = process.env.SITE_URL || "http://localhost:3001";

// Render / Vercel sit behind a proxy
app.set("trust proxy", 1);

/* ---------- CORS (must be FIRST, before json parser, limiter and routes) ---------- */

const normalize = (url) => String(url).trim().replace(/\/+$/, "");

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://kiddiex-freelancing.vercel.app",
];

// Extra origins from env, comma separated: CLIENT_URL=https://a.com,https://b.com
if (process.env.CLIENT_URL) {
  allowedOrigins.push(...process.env.CLIENT_URL.split(",").map(normalize));
}

const allowed = new Set(allowedOrigins.map(normalize));

const corsOptions = {
  origin(origin, callback) {
    // No Origin header = curl, Postman, server-to-server: allow
    if (!origin) return callback(null, true);
    if (allowed.has(normalize(origin))) return callback(null, true);
    console.warn("Blocked by CORS:", origin);
    return callback(null, false); // no CORS headers -> browser blocks it
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

// app.use(cors()) also answers every OPTIONS preflight automatically
app.use(cors(corsOptions));

app.use(express.json({ limit: "10kb" }));

/* ---------- rate limit ---------- */

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    error: "Too many messages. Please try again later.",
  },
});

/* ---------- email sender (Brevo HTTPS API - works on Render free tier) ---------- */

async function sendMail({ to, subject, text, html, replyTo, fromName }) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: fromName, email: process.env.EMAIL_USER },
      to: [{ email: to }],
      replyTo: { email: replyTo },
      subject,
      textContent: text,
      htmlContent: html,
    }),
  });

  if (!res.ok) {
    throw new Error(`Brevo ${res.status}: ${await res.text()}`);
  }
  return res.json(); // { messageId }
}

if (!process.env.BREVO_API_KEY) {
  console.warn("BREVO_API_KEY is not set - emails will fail.");
}

/* ---------- helpers ---------- */

const isEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Escape user input before putting it into HTML
const esc = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/* ---------- the welcome email the visitor receives ---------- */
function welcomeHtml(name) {
  return `
  <div style="margin:0;padding:24px 12px;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e5e5;">

      <tr>
        <td style="padding:24px 30px;border-bottom:1px solid #eeeeee;">
          <div style="font-size:22px;font-weight:bold;color:#222222;letter-spacing:1px;">
            ${esc(BRAND)}
          </div>
        </td>
      </tr>

      <tr>
        <td style="padding:30px;">
          <p style="margin:0 0 20px;font-size:15px;color:#222222;">
            Hello ${esc(name)},
          </p>

          <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#444444;">
            Thank you for contacting ${esc(BRAND)}.
            This email confirms that we have received your enquiry.
          </p>

          <p style="margin:0 0 22px;font-size:14px;line-height:1.7;color:#444444;">
            Our team will review your message and get back to you
            within 24 business hours.
          </p>

          <p style="margin:0;font-size:14px;line-height:1.7;color:#444444;">
            Regards,<br />
            <strong style="color:#222222;">${esc(BRAND)} Team</strong>
          </p>
        </td>
      </tr>

      <tr>
        <td style="padding:16px 30px;background:#fafafa;border-top:1px solid #eeeeee;">
          <p style="margin:0;font-size:11px;line-height:1.6;color:#888888;">
            This is an automated confirmation of your website enquiry.
          </p>
          <p style="margin:8px 0 0;font-size:11px;color:#888888;">
            <a href="${esc(SITE)}" style="color:#555555;text-decoration:none;">
              ${esc(SITE)}
            </a>
          </p>
        </td>
      </tr>

    </table>
  </div>`;
}

/* ---------- the notification YOU receive ---------- */
function ownerHtml({ name, email, message }) {
  return `
  <div style="font-family:Arial,sans-serif;max-width:560px;">
    <h2 style="margin:0 0 16px;">New message from your website</h2>
    <p><strong>Name:</strong> ${esc(name)}</p>
    <p><strong>Email:</strong> ${esc(email)}</p>
    <p><strong>Message:</strong></p>
    <p style="white-space:pre-wrap;background:#f6f6f6;padding:14px;border-radius:10px;">${esc(message)}</p>
  </div>`;
}

/* ---------- routes ---------- */

app.get("/", (req, res) => {
  res.json({ ok: true, service: `${BRAND} contact API` });
});

app.post("/api/contact", limiter, async (req, res) => {
  const { name, email, message, website } = req.body || {};

  // Bot protection (honeypot field)
  if (website) {
    return res.json({ ok: true });
  }

  // Validation
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !message.trim()
  ) {
    return res.status(400).json({
      ok: false,
      error: "Please fill in all fields.",
    });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanMessage = message.trim();

  if (!isEmail(cleanEmail)) {
    return res.status(400).json({
      ok: false,
      error: "Please enter a valid email.",
    });
  }

  if (
    cleanName.length > 100 ||
    cleanEmail.length > 150 ||
    cleanMessage.length > 3000
  ) {
    return res.status(400).json({
      ok: false,
      error: "Your message is too long.",
    });
  }

  try {
    const ownerEmail = process.env.OWNER_EMAIL || process.env.EMAIL_USER;

    // Send both emails independently
    const [ownerResult, clientResult] = await Promise.allSettled([
      // 1. Notification to the owner
      sendMail({
        fromName: `${BRAND} Website`,
        to: ownerEmail,
        replyTo: cleanEmail,
        subject: `New contact message from ${cleanName}`,
        text: `Name: ${cleanName}
Email: ${cleanEmail}

Message:
${cleanMessage}`,
        html: ownerHtml({
          name: cleanName,
          email: cleanEmail,
          message: cleanMessage,
        }),
      }),

      // 2. Welcome email to the visitor
      sendMail({
        fromName: BRAND,
        to: cleanEmail,
        replyTo: ownerEmail,
        subject: `Thanks for contacting ${BRAND}!`,
        text: `Hi ${cleanName},

Thank you for contacting ${BRAND}!

We have received your message and will reply within 24 business hours.

Best regards,
The ${BRAND} Team

Visit our website: ${SITE}`,
        html: welcomeHtml(cleanName),
      }),
    ]);

    if (ownerResult.status === "fulfilled") {
      console.log("Owner email sent:", ownerResult.value.messageId);
    } else {
      console.error("Owner email failed:", ownerResult.reason);
    }

    if (clientResult.status === "fulfilled") {
      console.log("Client welcome email sent:", clientResult.value.messageId);
    } else {
      console.error("Client welcome email failed:", clientResult.reason);
    }

    // The owner notification is essential
    if (ownerResult.status === "rejected") {
      return res.status(500).json({
        ok: false,
        error: "Could not send your contact message.",
        ownerEmailSent: false,
        welcomeEmailSent: clientResult.status === "fulfilled",
      });
    }

    return res.json({
      ok: true,
      message: "Your message has been received!",
      ownerEmailSent: true,
      welcomeEmailSent: clientResult.status === "fulfilled",
    });
  } catch (error) {
    console.error("Contact API error:", error);

    return res.status(500).json({
      ok: false,
      error: "Something went wrong. Please try again.",
    });
  }
});

/* ---------- 404 + error handler (JSON, keeps CORS headers) ---------- */

app.use((req, res) => {
  res.status(404).json({ ok: false, error: "Not found." });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({ ok: false, error: "Server error." });
});

/* ---------- start server ---------- */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Allowed origins:", [...allowed].join(", "));
});