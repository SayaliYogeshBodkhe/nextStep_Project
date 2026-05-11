const Registration = require("../models/registration");
const Event = require("../models/event");

const { transporter } = require("./mailController");

/* REGISTER EVENT */
exports.registerEvent =
  async (req, res) => {
    try {
      const {
        eventId,
        eventTitle,
        name,
        email,
        phone,
      } = req.body;

      await Registration.create({
        eventId,
        eventTitle,
        name,
        email,
        phone,
      });

      await transporter.sendMail({
        from:
          process.env.EMAIL_USER,

        to: email,

        subject:
          "Event Registration Successful 🎉",

        html: `
        <h2>Hello ${name}</h2>

        <p>You are registered for:</p>

        <h3>${eventTitle}</h3>
      `,
      });

      res.json({
        status: "ok",
      });

    } catch (err) {
      console.log(err);

      res.json({
        status: "error",
      });
    }
  };

/* GET ALL */
exports.getRegistrations =
  async (req, res) => {
    try {
      const data =
        await Registration.find();

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

/* EVENT STUDENTS */
exports.getEventStudents =
  async (req, res) => {
    try {
      const data =
        await Registration.find({
          eventId:
            req.params.eventId,
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

/* DELETE */
exports.deleteRegistration =
  async (req, res) => {
    try {
      await Registration.findByIdAndDelete(
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