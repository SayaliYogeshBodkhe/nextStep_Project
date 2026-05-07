const express = require("express");

const router = express.Router();

const {
  registerEvent,
  getRegistrations,
  getEventStudents,
  deleteRegistration,
} = require("../controllers/registrationController");

router.post(
  "/registerEvent",
  registerEvent
);

router.get(
  "/getRegistrations",
  getRegistrations
);

router.get(
  "/getEventStudents/:eventId",
  getEventStudents
);

router.delete(
  "/deleteRegistration/:id",
  deleteRegistration
);

module.exports = router;