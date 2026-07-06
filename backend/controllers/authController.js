const bcrypt = require("bcryptjs");

const User = require("../models/user");

const { transporter } = require("./mailController");
/* OTP STORE */
let otpStore = {};

/* ================= SIGNUP ================= */
exports.signup = async (req, res) => {
  try {
    const {
      userType,
      secretKey,
      name,
      phone,
      email,
      gender,
      password,
    } = req.body;

    const cleanEmail =
      email.trim().toLowerCase();

    const oldUser =
      await User.findOne({
        email: cleanEmail,
      });

    if (oldUser) {
      return res.json({
        status: "error",
        message:
          "User already exists",
      });
    }

    if (
      userType === "Admin" &&
      secretKey !== "admin123"
    ) {
      return res.json({
        status: "error",
        message:
          "Wrong Admin Secret Key",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    await transporter.sendMail({
      from:
        process.env.EMAIL_USER,

      to: cleanEmail,

      subject:
        "Welcome To NextStep 🎉",

      html: `
        <h2>Hello ${name}</h2>

        <p>Your account created successfully.</p>
      `,
    });

    await User.create({
      userType,
      name,
      phone,
      email:
        cleanEmail,
      gender,
      password:
        hashedPassword,
    });

    res.json({
      status: "ok",
      message:
        "Signup Successful",
    });

  } catch (error) {
    console.log(error);

    res.json({
      status: "error",
      message:
        "Signup Failed",
    });
  }
};

/* ================= SEND OTP ================= */
exports.sendOtp = async (req, res) => {
  try {
    const { email } =
      req.body;

    const cleanEmail =
      email.trim().toLowerCase();

    const oldUser =
      await User.findOne({
        email: cleanEmail,
      });

    if (oldUser) {
      return res.json({
        status: "error",
        message:
          "User already exists",
      });
    }

    const otp =
      Math.floor(
        100000 +
          Math.random() *
            900000
      );

    otpStore[
      cleanEmail
    ] = otp;

    await transporter.sendMail({
      from:
        process.env.EMAIL_USER,

      to: cleanEmail,

      subject:
        "Your OTP Code",

      html: `
        <h2>NextStep OTP Verification</h2>

        <p>Your OTP is:</p>

        <h1 style="color:#607597">
          ${otp}
        </h1>
      `,
    });

    res.json({
      status: "ok",
      message:
        "OTP Sent Successfully",
    });

  } catch (error) {
    console.log(error);

    res.json({
      status: "error",
      message:
        "OTP Send Failed",
    });
  }
};

/* ================= VERIFY OTP ================= */
exports.verifyOtpSignup =
  async (req, res) => {
    try {
      const {
        userType,
        secretKey,
        name,
        phone,
        email,
        gender,
        password,
        otp,
      } = req.body;

      const cleanEmail =
        email
          .trim()
          .toLowerCase();

      if (
        otpStore[
          cleanEmail
        ] != otp
      ) {
        return res.json({
          status: "error",
          message:
            "Invalid OTP",
        });
      }

      if (
        userType ===
          "Admin" &&
        secretKey !==
          "admin123"
      ) {
        return res.json({
          status: "error",
          message:
            "Wrong Admin Secret Key",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      await User.create({
        userType,
        name,
        phone,
        email:
          cleanEmail,
        gender,
        password:
          hashedPassword,
      });

      delete otpStore[
        cleanEmail
      ];

      res.json({
        status: "ok",
        message:
          "Signup Successful",
      });

    } catch (error) {
      console.log(error);

      res.json({
        status: "error",
        message:
          "Signup Failed",
      });
    }
  };

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      return res.json({
        status: "error",
        message:
          "User not found",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.json({
        status: "error",
        message:
          "Wrong password",
      });
    }

    res.json({
      status: "ok",
      userType:
        user.userType,
    });

  } catch {
    res.json({
      status: "error",
    });
  }
};