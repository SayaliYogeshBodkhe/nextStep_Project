const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  eventId: String,
  eventTitle: String,
  date: String,
  time: String,
  zoomLink: String,
  name: String,
  email: String,
  phone: String,

  meetingLive: {
    type: Boolean,
    default: false,
  },

  joinMailSent: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Registration", registrationSchema);