const express = require("express");
const router = express.Router();
const linkController = require("../controllers/link.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Protect all routes
router.use(authMiddleware);

// Create a new link
router.post("/", linkController.createLink);

// Get all links for a user
router.get("/", linkController.getLinks);

// Get a single link by ID
router.get("/:id", linkController.getLinkById);

// Delete a link
router.delete("/:id", linkController.deleteLink);

module.exports = router;
