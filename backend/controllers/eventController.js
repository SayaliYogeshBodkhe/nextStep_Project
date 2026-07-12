const Event = require("../models/event");

/* ================= GET EVENTS (WITH STATUS) ================= */
exports.getEvents = async (req, res) => {
  try {
    const now = new Date();
    const events = await Event.find();

    const data = events.map((event) => {
      const start = new Date(`${event.date}T${event.time}`);
      const end = new Date(start);
      end.setHours(end.getHours() + 1);

      let status = "UPCOMING";

      if (now >= start && now < end) {
        status = "LIVE";
      } else if (now >= end) {
        status = "COMPLETED";
      }

      return {
        ...event._doc,
        status,
      };
    });

    res.json({
      status: "ok",
      data,
    });

  } catch (error) {
    console.log("GET EVENTS ERROR:", error);
    res.json({ status: "error" });
  }
};


/* ================= ADD EVENT ================= */
exports.addEvent = async (req, res) => {
  try {
    const { title, date, time, mode, zoomLink } = req.body;

    // Combine date and time into one Date object
    const eventDateTime = new Date(`${date}T${time}`);

    await Event.create({
      title,
      eventDateTime,
      mode,
      zoomLink,
    });

    res.json({ status: "ok" });

  } catch (error) {
    console.error("ADD EVENT ERROR:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};


/* ================= UPDATE EVENT ================= */
exports.updateEvent = async (req, res) => {
  try {
    await Event.findByIdAndUpdate(req.params.id, req.body);

    res.json({ status: "ok" });

  } catch (error) {
    console.log("UPDATE EVENT ERROR:", error);
    res.json({ status: "error" });
  }
};


/* ================= DELETE EVENT ================= */
exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);

    res.json({ status: "ok" });

  } catch (error) {
    console.log("DELETE EVENT ERROR:", error);
    res.json({ status: "error" });
  }
};