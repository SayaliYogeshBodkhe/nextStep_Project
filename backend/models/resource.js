const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    category: String,
    type: String,
    difficulty: String,
    link: String,
    thumbnail: String,
    tags: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Resource",
  resourceSchema
);