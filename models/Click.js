const mongoose = require("mongoose");

const ClickSchema = new mongoose.Schema({
  linkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Link",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ip: {
    type: String,
    default: "unknown",
  },
  userAgent: {
    type: String,
    default: "unknown",
  },
  deviceType: {
    type: String,
    enum: ["desktop", "mobile", "tablet", "unknown"],
    default: "unknown",
  },
  browser: {
    type: String,
    default: "unknown",
  },
  referrer: {
    type: String,
    default: "direct",
  },
});

module.exports = mongoose.model("Click", ClickSchema);
