const Registration = require("../models/registration");
const { transporter } = require("./mailController");

/* REGISTER EVENT */
exports.registerEvent = async (req, res) => {
  try {
    const {
      eventId,
      eventTitle,
      date,
      time,
      zoomLink,
      name,
      email,
      phone,
    } = req.body;

    console.log("REQ BODY:", req.body);

    // Save registration
    await Registration.create({
      eventId,
      eventTitle,
      date,
      time,
      zoomLink,
      name,
      email,
      phone,
    });

    // Send confirmation email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Event Registration Successful 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6;">
          <h2>Hello ${name},</h2>

          <p>You have successfully registered for the event:</p>

          <h3>${eventTitle}</h3>

          <p><b>📅 Date:</b> ${date}</p>
          <p><b>⏰ Time:</b> ${time}</p>

          ${
            zoomLink
              ? `
                <p><b>🔗 Join Event:</b></p>
                <a href="${zoomLink}" target="_blank"
                   style="display:inline-block;padding:10px 15px;background:#4CAF50;color:#fff;text-decoration:none;border-radius:5px;">
                  Join Zoom Meeting
                </a>
              `
              : `<p><b>Link:</b> Will be shared soon</p>`
          }

          <br/>
          <p>We look forward to seeing you!</p>
          <p>Thank you,<br/>Team</p>
        </div>
      `,
    });

    res.json({ status: "ok" });
  } catch (err) {
    console.log("REGISTER EVENT ERROR:", err);
    res.json({ status: "error" });
  }
};

/* GET ALL */
exports.getRegistrations = async (req, res) => {
  try {
    const data = await Registration.find();
    res.json({
      status: "ok",
      data,
    });
  } catch (err) {
    console.log(err);
    res.json({ status: "error" });
  }
};

/* EVENT STUDENTS */
exports.getEventStudents = async (req, res) => {
  try {
    const data = await Registration.find({
      eventId: req.params.eventId,
    });

    res.json({
      status: "ok",
      data,
    });
  } catch (err) {
    console.log(err);
    res.json({ status: "error" });
  }
};

/* DELETE */
exports.deleteRegistration = async (req, res) => {
  try {
    await Registration.findByIdAndDelete(req.params.id);
    res.json({ status: "ok" });
  } catch (err) {
    console.log(err);
    res.json({ status: "error" });
  }
};