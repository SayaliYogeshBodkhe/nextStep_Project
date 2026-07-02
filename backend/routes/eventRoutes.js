const express = require("express");

const router = express.Router();

const {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

router.get(
  "/getEvents",
  getEvents
);

router.post(
  "/addEvent",
  addEvent
);

router.put("/updateEvent/:id", updateEvent);

router.delete(
  "/deleteEvent/:id",
  deleteEvent
);

module.exports = router;