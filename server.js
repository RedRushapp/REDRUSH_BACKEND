const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const locationRoutes = require("./routes/locationRoutes");
const pickupRoutes = require("./routes/pickupRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const companyRoutes = require("./routes/companyRoutes");
const truckRoutes = require("./routes/truckRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  ...(process.env.FRONTEND_URL || "").split(","),
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174"
].map((origin) => origin.trim()).filter(Boolean);

const isLocalDevOrigin = (origin) => {
  if (process.env.NODE_ENV === "production") {
    return false;
  }

  return /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
};

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || isLocalDevOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploaded photos are served as static files so the frontend can display them.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({ message: "CleanTrack Uganda API is running" });
});

const routeMappings = [
  ["/api/auth", authRoutes],
  ["/auth", authRoutes],
  ["/api/locations", locationRoutes],
  ["/locations", locationRoutes],
  ["/api/pickups", pickupRoutes],
  ["/pickups", pickupRoutes],
  ["/api/assignments", assignmentRoutes],
  ["/assignments", assignmentRoutes],
  ["/api/companies", companyRoutes],
  ["/companies", companyRoutes],
  ["/api/trucks", truckRoutes],
  ["/trucks", truckRoutes],
  ["/api/categories", categoryRoutes],
  ["/categories", categoryRoutes],
  ["/api/feedback", feedbackRoutes],
  ["/feedback", feedbackRoutes],
  ["/api/admin", adminRoutes],
  ["/admin", adminRoutes]
];

routeMappings.forEach(([prefix, router]) => app.use(prefix, router));

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error", error: err.message });
});

app.listen(PORT, () => {
  console.log(`CleanTrack Uganda backend running on port ${PORT}`);
});
