const nodemailer = require("nodemailer");

const transporter =
  nodemailer.createTransport({
    host: "smtp.gmail.com",

    port: 587,

    secure: false,

    auth: {
      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_PASS,
    },
  });

/* SEND CONNECTION MAIL */
const sendConnectionMail =
  async (req, res) => {
    try {
      const {
        toEmail,
        alumniName,
        message,
      } = req.body;

      await transporter.sendMail({
        from:
          process.env.EMAIL_USER,

        to: toEmail,

        subject:
          "New Connection Request - NextStep",

        html: `
        <h2>Hello ${alumniName}</h2>

        <p>You received a connection request from a student on NextStep.</p>

        <h3>Message:</h3>

        <p>${message}</p>
      `,
      });

      res.json({
        status: "ok",
        message:
          "Mail Sent",
      });

    } catch (err) {
      console.log(err);

      res.json({
        status: "error",
        message:
          "Failed to send mail",
      });
    }
  };

module.exports = {
  transporter,
  sendConnectionMail,
};