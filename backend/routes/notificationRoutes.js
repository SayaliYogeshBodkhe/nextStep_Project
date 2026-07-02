const express = require("express");
const router = express.Router();
const Notification = require("../models/notification");
const {
  getNotifications,
  addNotification,
  deleteNotification,
} = require("../controllers/notificationController");

/* GET */
router.get("/getNotifications", getNotifications);

/* POST */
router.post("/addNotification", addNotification);

/* PUT */
router.put("/updateNotification/:id", async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, req.body);
    res.json({ status: "ok" });
  } catch (err) {
    res.status(500).json({
      status: "error",
      error: err.message,
    });
  }
});

/* DELETE */
router.delete("/deleteNotification/:id", deleteNotification);

module.exports = router;