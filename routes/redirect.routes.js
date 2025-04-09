const express = require("express");
const router = express.Router();
const redirectController = require("../controllers/redirect.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Redirect to original URL
router.post("/:shortCode", redirectController.redirect);

// Get analytics for all links (protected route)
router.get("/analytics", authMiddleware, redirectController.getAnalytics);

module.exports = router;
