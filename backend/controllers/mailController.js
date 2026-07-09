const nodemailer = require("nodemailer");

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log(
  "EMAIL_PASS available:",
  process.env.EMAIL_PASS ? "YES" : "NO"
);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("Mail Error:", error);
  } else {
    console.log("✅ Mail Server Ready");
  }
});

/* SEND CONNECTION MAIL */
const sendConnectionMail = async (req, res) => {
  try {
    const { toEmail, alumniName, message } = req.body;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: "New Connection Request - NextStep",
      html: `
        <h2>Hello ${alumniName}</h2>
        <p>You received a connection request from a student on NextStep.</p>
        <h3>Message:</h3>
        <p>${message}</p>
      `,
    });

    res.json({
      status: "ok",
      message: "Mail Sent",
    });
  } catch (err) {
    console.error(err);

    res.json({
      status: "error",
      message: "Failed to send mail",
    });
  }
};

module.exports = {
  transporter,
  sendConnectionMail,
};