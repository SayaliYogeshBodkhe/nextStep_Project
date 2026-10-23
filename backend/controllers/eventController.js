const Event = require("../models/event");

/* ================= HELPER: VALIDATE DATE AND TIME ================= */
const isValidDateTime = (date, time) => {
  if (
    typeof date !== "string" ||
    typeof time !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)
  ) {
    return false;
  }

  const parsed = new Date(`${date}T${time}:00`);

  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.getFullYear() === Number(date.slice(0, 4)) &&
    parsed.getMonth() + 1 === Number(date.slice(5, 7)) &&
    parsed.getDate() === Number(date.slice(8, 10))
  );
};

/* ================= GET EVENTS (WITH STATUS) ================= */
exports.getEvents = async (req, res) => {
  try {
    const now = new Date();

    const events = await Event.find().lean();

    const data = events
      .map((event) => {
        const start = new Date(`${event.date}T${event.time}:00`);
        const end = new Date(start.getTime() + 60 * 60 * 1000);

        let status = "UPCOMING";

        if (now >= start && now < end) {
          status = "LIVE";
        } else if (now >= end) {
          status = "COMPLETED";
        }

        return { ...event, status };
      })
      .sort(
        (a, b) =>
          new Date(`${a.date}T${a.time}:00`) -
          new Date(`${b.date}T${b.time}:00`)
      );

    return res.status(200).json({
      status: "ok",
      data,
    });
  } catch (error) {
    console.error("GET EVENTS ERROR:", error);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

/* ================= ADD EVENT ================= */
exports.addEvent = async (req, res) => {
  try {
    const { title, date, time, mode, zoomLink } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      !date ||
      !time ||
      !mode
    ) {
      return res.status(400).json({
        status: "error",
        message: "Title, date, time and mode are required",
      });
    }

    if (!isValidDateTime(date, time)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid date or time. Use YYYY-MM-DD and HH:mm.",
      });
    }

    if (!["Online", "Offline"].includes(mode)) {
      return res.status(400).json({
        status: "error",
        message: "Mode must be Online or Offline",
      });
    }

    const cleanZoomLink = zoomLink || "";

    if (typeof cleanZoomLink !== "string") {
      return res.status(400).json({
        status: "error",
        message: "Zoom link must be a string",
      });
    }

    if (mode === "Online" && cleanZoomLink.trim()) {
      try {
        const url = new URL(cleanZoomLink.trim());

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Invalid URL protocol");
        }
      } catch {
        return res.status(400).json({
          status: "error",
          message: "Please enter a valid Zoom meeting URL",
        });
      }
    }

    const event = await Event.create({
      title: title.trim(),
      date,
      time,
      mode,
      zoomLink: mode === "Online" ? cleanZoomLink.trim() : "",
    });

    return res.status(201).json({
      status: "ok",
      message: "Event added successfully",
      data: event,
    });
  } catch (error) {
    console.error("ADD EVENT ERROR:", error);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

/* ================= UPDATE EVENT ================= */
exports.updateEvent = async (req, res) => {
  try {
    const { title, date, time, mode, zoomLink } = req.body;
    const updates = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          status: "error",
          message: "Title cannot be empty",
        });
      }

      updates.title = title.trim();
    }

    if (mode !== undefined) {
      if (!["Online", "Offline"].includes(mode)) {
        return res.status(400).json({
          status: "error",
          message: "Mode must be Online or Offline",
        });
      }

      updates.mode = mode;

      if (mode === "Offline") {
        updates.zoomLink = "";
      }
    }

    if (date !== undefined || time !== undefined) {
      if (!date || !time || !isValidDateTime(date, time)) {
        return res.status(400).json({
          status: "error",
          message: "Valid date and time are required together",
        });
      }

      updates.date = date;
      updates.time = time;
    }

    if (zoomLink !== undefined) {
      if (typeof zoomLink !== "string") {
        return res.status(400).json({
          status: "error",
          message: "Zoom link must be a string",
        });
      }

      if ((mode || "").length > 0 && mode === "Offline") {
        updates.zoomLink = "";
      } else {
        if (zoomLink.trim()) {
          try {
            const url = new URL(zoomLink.trim());

            if (!["http:", "https:"].includes(url.protocol)) {
              throw new Error("Invalid URL protocol");
            }
          } catch {
            return res.status(400).json({
              status: "error",
              message: "Please enter a valid Zoom meeting URL",
            });
          }
        }

        updates.zoomLink = zoomLink.trim();
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No valid fields provided for update",
      });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!event) {
      return res.status(404).json({
        status: "error",
        message: "Event not found",
      });
    }

    return res.status(200).json({
      status: "ok",
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    console.error("UPDATE EVENT ERROR:", error);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

/* ================= DELETE EVENT ================= */
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        status: "error",
        message: "Event not found",
      });
    }

    return res.status(200).json({
      status: "ok",
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("DELETE EVENT ERROR:", error);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
