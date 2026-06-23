const Event = require("../models/event");

/* GET EVENTS */
exports.getEvents = async (req, res) => {
  try {
    const now = new Date();
    const events = await Event.find();

    const data = events
      .filter((event) => {
        const eventDateTime = new Date(`${event.date}T${event.time}`);
        return eventDateTime >= now;
      })
      .sort(
        (a, b) =>
          new Date(`${a.date}T${a.time}`) -
          new Date(`${b.date}T${b.time}`)
      );

    res.json({
      status: "ok",
      data,
    });
  } catch (error) {
    console.log("GET EVENTS ERROR:", error);
    res.json({
      status: "error",
    });
  }
};

/* ADD EVENT */
exports.addEvent = async (req, res) => {
  try {
    const {
      title,
      date,
      time,
      mode,
      zoomLink,
    } = req.body;

    await Event.create({
      title,
      date,
      time,
      mode,
      zoomLink,
    });

    res.json({
      status: "ok",
    });
  } catch (error) {
    console.log("ADD EVENT ERROR:", error);
    res.json({
      status: "error",
    });
  }
};

/* UPDATE EVENT */
exports.updateEvent = async (req, res) => {
  try {
    await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      status: "ok",
    });
  } catch (error) {
    console.log("UPDATE EVENT ERROR:", error);
    res.json({
      status: "error",
    });
  }
};

/* DELETE EVENT */
exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);

    res.json({
      status: "ok",
    });
  } catch (error) {
    console.log("DELETE EVENT ERROR:", error);
    res.json({
      status: "error",
    });
  }
};