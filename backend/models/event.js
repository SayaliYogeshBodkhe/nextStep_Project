const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    eventDateTime: {
      type: Date,
      required: true,
    },

    mode: {
      type: String,
      required: true,
      enum: ["Online", "Offline"],
    },

    zoomLink: {
      type: String,
      default: "",
    },

    meetingLive: {
      type: Boolean,
      default: false,
    },

    meetingCompleted: {
      type: Boolean,
      default: false,
    },

    liveMailSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", eventSchema);