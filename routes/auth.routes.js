const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Login route
router.post("/login", authController.login);

// Get user profile (protected route)
router.get("/profile", authMiddleware, authController.getProfile);

module.exports = router;
