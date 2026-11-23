require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const memberRoutes = require("./routes/memberRoutes");
const projectRoutes = require("./routes/projectRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// needed on Render so rate limiting sees real visitor IPs
app.set("trust proxy", 1);

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://kiddiex-freelancing.vercel.app",
  ...(process.env.CLIENT_URL || "").split(","),
]
  .map((url) => url.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.log("Blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));

// Health check
app.get("/", (req, res) => {
  res.json({ success: true, message: "KIDDIEX API is running." });
});

// APIs
app.use("/api/members", memberRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/contact", contactRoutes);

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// Error handler (must be LAST)
app.use((error, req, res, next) => {
  console.error("API Error:", error.message);

  if (error.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? "Image must be smaller than 5 MB."
          : error.message,
    });
  }

  res.status(400).json({
    success: false,
    message: error.message || "Something went wrong.",
  });
});

// Start server after MongoDB connects
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`KIDDIEX server running on port ${PORT}`);
  });
};

startServer();