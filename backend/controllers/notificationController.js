const Notification = require("../models/notification");

/* GET NOTIFICATIONS */
exports.getNotifications = async (req, res) => {
  try {
    const data = await Notification.find().sort({ createdAt: -1 });

    res.json({
      status: "ok",
      data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error" });
  }
};

/* ADD NOTIFICATION (WITH SOCKET + VALIDATION) */
exports.addNotification = async (req, res) => {
  try {
    const { title, message, type } = req.body;

    console.log("BODY RECEIVED:", req.body);

    // ✅ VALIDATION (IMPORTANT)
    if (!title || !message) {
      return res.status(400).json({
        status: "error",
        message: "Title and message are required",
      });
    }

    const notification = await Notification.create({
      title,
      message,
      type,
    });

    // 🔥 REAL-TIME SOCKET EMIT
    const io = req.app.get("io");
    if (io) {
      io.emit("newNotification", notification);
    }

    res.json({
      status: "ok",
      data: notification,
    });
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

/* DELETE NOTIFICATION */
exports.deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);

    res.json({
      status: "ok",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error" });
  }
};