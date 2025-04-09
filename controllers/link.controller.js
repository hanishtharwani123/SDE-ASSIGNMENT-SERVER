const Link = require("../models/Link");
const Click = require("../models/Click");
const { nanoid } = require("nanoid");

// Create a new shortened link
exports.createLink = async (req, res) => {
  try {
    const { originalUrl, alias, expiresAt } = req.body;

    // Validate input
    if (!originalUrl) {
      return res.status(400).json({ message: "Original URL is required" });
    }

    // Validate URL format
    try {
      new URL(originalUrl);
    } catch (error) {
      return res.status(400).json({ message: "Invalid URL format" });
    }

    // Generate short code or use custom alias
    const shortCode = alias || nanoid(6);

    // Check if alias is already taken
    if (alias) {
      const existingLink = await Link.findOne({ shortCode });

      if (existingLink) {
        return res.status(400).json({ message: "This alias is already taken" });
      }
    }

    // Create new link
    const newLink = new Link({
      originalUrl,
      shortCode,
      alias: alias || null,
      userId: req.user.userId,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });

    await newLink.save();

    res.status(201).json(newLink);
  } catch (error) {
    console.error("Create link error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all links for a user
exports.getLinks = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1;
    const limit = Number.parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    // Build query
    const query = { userId: req.user.userId };

    if (search) {
      query.$or = [
        { originalUrl: { $regex: search, $options: "i" } },
        { shortCode: { $regex: search, $options: "i" } },
        { alias: { $regex: search, $options: "i" } },
      ];
    }

    // Get links with pagination
    const links = await Link.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Link.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Get analytics data for each link
    const linksWithAnalytics = await Promise.all(
      links.map(async (link) => {
        const clicks = await Click.find({ linkId: link._id });

        return {
          ...link.toJSON(),
          totalClicks: clicks.length,
          clicks,
        };
      })
    );

    res.json({
      links: linksWithAnalytics,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error("Get links error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single link by ID
exports.getLinkById = async (req, res) => {
  try {
    const link = await Link.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    // Get clicks for this link
    const clicks = await Click.find({ linkId: link._id });

    res.json({
      ...link.toJSON(),
      totalClicks: clicks.length,
      clicks,
    });
  } catch (error) {
    console.error("Get link error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a link
exports.deleteLink = async (req, res) => {
  try {
    const link = await Link.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    // Delete all clicks associated with this link
    await Click.deleteMany({ linkId: link._id });

    res.json({ message: "Link deleted successfully" });
  } catch (error) {
    console.error("Delete link error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
