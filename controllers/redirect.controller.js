const Link = require("../models/Link");
const Click = require("../models/Click");

// Redirect to original URL and log click data
exports.redirect = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const { deviceType, browser } = req.body;

    // Find the link by short code
    const link = await Link.findOne({ shortCode });

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    // Check if link is expired
    if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
      return res.status(410).json({ message: "Link has expired" });
    }

    // Log click data asynchronously (don't wait for it to complete)
    const clickData = new Click({
      linkId: link._id,
      ip: req.ip || req.headers["x-forwarded-for"] || "unknown",
      userAgent: req.headers["user-agent"] || "unknown",
      deviceType: deviceType || "unknown",
      browser: browser || "unknown",
      referrer: req.headers.referer || "direct",
    });

    clickData
      .save()
      .catch((err) => console.error("Error saving click data:", err));

    // Return the original URL for client-side redirect
    res.json({ originalUrl: link.originalUrl });
  } catch (error) {
    console.error("Redirect error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get analytics for all links
exports.getAnalytics = async (req, res) => {
  try {
    // Get all links for the user
    const links = await Link.find({ userId: req.user.userId });

    // Get all clicks for these links
    const linkIds = links.map((link) => link._id);
    const clicks = await Click.find({ linkId: { $in: linkIds } });

    // Group clicks by link
    const clicksByLink = {};

    clicks.forEach((click) => {
      if (!clicksByLink[click.linkId]) {
        clicksByLink[click.linkId] = [];
      }

      clicksByLink[click.linkId].push(click);
    });

    // Add click data to each link
    const linksWithAnalytics = links.map((link) => {
      const linkClicks = clicksByLink[link._id] || [];

      return {
        ...link.toJSON(),
        totalClicks: linkClicks.length,
        clicks: linkClicks,
      };
    });

    res.json(linksWithAnalytics);
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
