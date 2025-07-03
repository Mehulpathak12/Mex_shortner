const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Url",
      required: true,
    },
    slug: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clickedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    ip: {
      type: String,
      required: true,
    },
    // country: {
    //   type: String,
    //   default: "Unknown",
    //   index: true,
    // },
  }
);
// Compound index for performance (optional)
clickSchema.index({ slug: 1, country: 1 });
clickSchema.index({ userId: 1 });

module.exports = mongoose.model("Click", clickSchema);
