const Event = require("../models/event");
const Notification =
  require("../models/notification");

/* GET EVENTS */
exports.getEvents = async (
  req,
  res
) => {
  try {
    const data =
      await Event.find().sort({
        date: 1,
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

/* ADD EVENT */
exports.addEvent = async (
  req,
  res
) => {
  try {
    const {
      title,
      date,
      time,
      mode,
    } = req.body;

    await Event.create({
      title,
      date,
      time,
      mode,
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

/* UPDATE EVENT */
exports.updateEvent =
  async (req, res) => {
    try {
      await Event.findByIdAndUpdate(
        req.params.id,
        req.body
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

/* DELETE EVENT */
exports.deleteEvent =
  async (req, res) => {
    try {
      await Event.findByIdAndDelete(
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