const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userType: {
    type: String,
    enum: ["Admin", "User"],
    default: "User",
  },
  name: {
    type: String,
    required: true,
  },
  phone: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);