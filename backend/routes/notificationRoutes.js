const express = require("express");
const router = express.Router();

const {
  getNotifications,
  addNotification,
  deleteNotification,
} = require("../controllers/notificationController");

/* GET */
router.get("/getNotifications", getNotifications);

/* POST */
router.post("/addNotification", addNotification);

/* DELETE */
router.delete("/deleteNotification/:id", deleteNotification);

module.exports = router;