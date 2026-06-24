const cron = require("node-cron");
const Event = require("../models/event");
const Registration = require("../models/registration");
const { transporter } = require("../controllers/mailController");

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const events = await Event.find();

    for (let event of events) {
      const meetingStart = new Date(`${event.date}T${event.time}`);
      const meetingEnd = new Date(meetingStart);
      meetingEnd.setHours(meetingEnd.getHours() + 1);

      // 🔴 LIVE START
      if (
        now >= meetingStart &&
        now < meetingEnd &&
        !event.meetingLive &&
        !event.liveMailSent
      ) {
        event.meetingLive = true;
        await event.save();

        const students = await Registration.find({
          eventId: event._id,
        });

        for (let s of students) {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: s.email,
            subject: `🔴 LIVE NOW: ${event.title}`,
            html: `
              <h2>${event.title} is LIVE 🚀</h2>
              <p>Join below:</p>
              <a href="${event.zoomLink}" target="_blank"
                 style="padding:10px 15px;background:green;color:white;text-decoration:none;">
                 Join Zoom Meeting
              </a>
            `,
          });
        }

        event.liveMailSent = true;
        await event.save();

        console.log(`${event.title} LIVE + emails sent`);
      }

      // ✅ COMPLETED
      if (
        now >= meetingEnd &&
        !event.meetingCompleted
      ) {
        event.meetingLive = false;
        event.meetingCompleted = true;
        await event.save();

        console.log(`${event.title} completed`);
      }
    }
  } catch (err) {
    console.log("Cron Error:", err);
  }
});