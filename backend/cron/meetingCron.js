const cron = require("node-cron");
const Event = require("../models/event");

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const events = await Event.find();

    for (let event of events) {
      const meetingStart = new Date(
        `${event.date}T${event.time}`
      );

      const meetingEnd = new Date(meetingStart);
      meetingEnd.setHours(
        meetingEnd.getHours() + 1
      );

      // Meeting started
      if (
        now >= meetingStart &&
        now < meetingEnd &&
        !event.meetingLive
      ) {
        event.meetingLive = true;
        await event.save();

        console.log(
          `${event.title} is LIVE now`
        );
      }

      // Meeting completed
      if (
        now >= meetingEnd &&
        !event.meetingCompleted
      ) {
        event.meetingLive = false;
        event.meetingCompleted = true;
        await event.save();

        console.log(
          `${event.title} completed`
        );
      }
    }
  } catch (err) {
    console.log("Cron Error:", err);
  }
});