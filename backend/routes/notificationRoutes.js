const express = require("express");

const router = express.Router();

const {
  getNotifications,
  addNotification,
  deleteNotification,
} = require(
  "../controllers/notificationController"
);

router.get(
  "/getNotifications",
  getNotifications
);

router.post(
  "/addNotification",
  addNotification
);

router.delete(
  "/deleteNotification/:id",
  deleteNotification
);

module.exports = router;