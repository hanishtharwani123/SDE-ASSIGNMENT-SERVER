const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/auth.routes");
const linkRoutes = require("./routes/link.routes");
const redirectRoutes = require("./routes/redirect.routes");

// Create Express app
const app = express();

// Configure CORS
const corsOptions = {
  origin: "https://sde-assignment-client.onrender.com", // Allow only your frontend domain
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials: true, // If you need to send cookies or auth headers
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/url-shortener")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Add this route BEFORE the static assets middleware
// This will handle the short URL redirects
const Link = require("./models/Link");
const Click = require("./models/Click");

// Handle short URL redirects
app.get("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Find the link by short code
    const link = await Link.findOne({ shortCode });

    if (!link) {
      return res.status(404).send("Link not found");
    }

    // Check if link is expired
    if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
      return res.status(410).send("Link has expired");
    }

    // Get device and browser info
    const userAgent = req.headers["user-agent"] || "unknown";
    const deviceType = /mobile|tablet|android|iphone|ipad/i.test(userAgent)
      ? "mobile"
      : "desktop";

    // Get browser info
    const browserInfo = {
      chrome: /chrome/i.test(userAgent),
      firefox: /firefox/i.test(userAgent),
      safari: /safari/i.test(userAgent),
      edge: /edge/i.test(userAgent),
      ie: /msie|trident/i.test(userAgent),
    };

    // Find the browser
    let browser = "other";
    for (const [key, value] of Object.entries(browserInfo)) {
      if (value) {
        browser = key;
        break;
      }
    }

    // Log click data asynchronously (don't wait for it to complete)
    const clickData = new Click({
      linkId: link._id,
      ip: req.ip || req.headers["x-forwarded-for"] || "unknown",
      userAgent,
      deviceType,
      browser,
      referrer: req.headers.referer || "direct",
    });

    clickData
      .save()
      .catch((err) => console.error("Error saving click data:", err));

    // Redirect to the original URL
    res.redirect(link.originalUrl);
  } catch (error) {
    console.error("Redirect error:", error);
    res.status(500).send("Server error");
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);
app.use("/api/redirect", redirectRoutes);

// // Serve static assets in production
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../client/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
//   });
// }

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
