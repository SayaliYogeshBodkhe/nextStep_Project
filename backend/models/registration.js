const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  eventId: String,
  eventTitle: String,
  name: String,
  email: String,
  phone: String,
});

module.exports = mongoose.model(
  "Registration",
  registrationSchema
);