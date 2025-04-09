const mongoose = require("mongoose");

const LinkSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
  },
  alias: {
    type: String,
    default: null,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
});

// Virtual for shortUrl
LinkSchema.virtual("shortUrl").get(function () {
  return `${process.env.BASE_URL || "http://localhost:5000"}/${this.shortCode}`;
});

// Set toJSON option to include virtuals
LinkSchema.set("toJSON", { virtuals: true });
LinkSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Link", LinkSchema);
