require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const memberRoutes = require("./routes/memberRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = (
  process.env.CLIENT_URL 
)
  .split(",")
  .map((url) => url.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "KIDDIEX API is running.",
  });
});

// Member APIs
app.use("/api/members", memberRoutes);

// Multer and other errors
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

app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/uploads", require("./routes/uploadRoutes"));

app.use(express.json());
app.use("/api/contact", require("./routes/contactRoutes"));

// Start server after MongoDB connects
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`KIDDIEX server running on port ${PORT}`);
  });
};

startServer();