const cron = require("node-cron");

const Event = require("../models/event");

/* RUN EVERY DAY AT 12 AM */
cron.schedule("0 0 * * *", async () => {
  try {
    const today = new Date();

    await Event.deleteMany({
      date: { $lt: today.toISOString().split("T")[0] },
    });

    console.log("Expired events deleted");
  } catch (err) {
    console.log(err);
  }
});