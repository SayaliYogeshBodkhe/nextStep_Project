const mongoose = require("mongoose");

const alumniSchema = new mongoose.Schema({
  name: String,
  email: String,
  company: String,
  position: String,
  year: String,
  photo: String, // optional (for future upload)
});

module.exports = mongoose.model("Alumni", alumniSchema);