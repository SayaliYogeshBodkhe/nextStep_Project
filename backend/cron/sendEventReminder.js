const cron = require("node-cron");

const Registration = require("../models/registration");
const Event = require("../models/event");

const { transporter } = require("../controllers/mailController");

/* RUN DAILY AT 8 AM */
cron.schedule("0 8 * * *", async () => {
  try {
    const today = new Date()
      .toISOString()
      .split("T")[0];

    /* FIND TODAY EVENTS */
    const todayEvents = await Event.find({
      date: today,
    });

    for (const event of todayEvents) {

      /* FIND REGISTERED STUDENTS */
      const students =
        await Registration.find({
          eventId: event._id,
        });

      for (const student of students) {

        await transporter.sendMail({
          from:
            process.env.EMAIL_USER,

          to: student.email,

          subject:
            `Reminder: ${event.title} is Today 🚀`,

          html: `
            <h2>Hello ${student.name}</h2>

            <p>This is a reminder that your registered event is today.</p>

            <h3>${event.title}</h3>

            <p>📅 Date: ${event.date}</p>
            <p>⏰ Time: ${event.time}</p>
            <p>📍 Mode: ${event.mode}</p>

            <br/>

            <p>See you there 🎉</p>
          `,
        });
      }
    }

    console.log(
      "Reminder mails sent"
    );

  } catch (err) {
    console.log(err);
  }
});