const Notification = require(
  "../models/notification"
);

/* GET */
exports.getNotifications =
  async (req, res) => {
    try {
      const data =
        await Notification.find().sort({
          createdAt: -1,
        });

      res.json({
        status: "ok",
        data,
      });

    } catch {
      res.json({
        status: "error",
      });
    }
  };

/* ADD */
exports.addNotification =
  async (req, res) => {
    try {
      const {
        title,
        message,
        type,
      } = req.body;

      await Notification.create({
        title,
        message,
        type,
      });

      res.json({
        status: "ok",
      });

    } catch {
      res.json({
        status: "error",
      });
    }
  };

/* DELETE */
exports.deleteNotification =
  async (req, res) => {
    try {
      await Notification.findByIdAndDelete(
        req.params.id
      );

      res.json({
        status: "ok",
      });

    } catch {
      res.json({
        status: "error",
      });
    }
  };