require("dotenv").config();

const express = require("express");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

/* MODELS */
const User = require("./models/user");
const Alumni = require("./models/alumni");
const Event = require("./models/event");
const Registration = require("./models/registration");

require("./auth/google");

const app = express();

/* =========================================
   EMAIL CONFIG
========================================= */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* =========================================
   MIDDLEWARE
========================================= */
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

/* =========================================
   FILE UPLOAD
========================================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));

/* =========================================
   DATABASE
========================================= */
mongoose
  .connect(
    process.env.MONGO_URI ||
      "mongodb://127.0.0.1:27017/nextstep"
  )
  .then(() =>
    console.log("✅ MongoDB Connected")
  )
  .catch((err) => console.log(err));

/* =========================================
   GOOGLE AUTH
========================================= */
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect:
      "http://localhost:3000/login",
  }),
  (req, res) => {
    res.redirect("http://localhost:3000");
  }
);

app.get("/current-user", (req, res) => {
  res.json(req.user || null);
});

/* =========================================
   USER APIs
========================================= */

/* SIGNUP */
/* ================= SIGNUP ================= */
app.post("/signup", async (req, res) => {
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

    const cleanEmail = email.trim().toLowerCase();

    const oldUser = await User.findOne({
      email: cleanEmail,
    });

    if (oldUser) {
      return res.json({
        status: "error",
        message: "User already exists",
      });
    }

    if (
      userType === "Admin" &&
      secretKey !== "admin123"
    ) {
      return res.json({
        status: "error",
        message: "Wrong Admin Secret Key",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: cleanEmail,
      subject: "Welcome To NextStep 🎉",
      html: `
        <h2>Hello ${name}</h2>
        <p>Your account created successfully.</p>
      `,
    });

    await User.create({
      userType,
      name,
      phone,
      email: cleanEmail,
      gender,
      password: hashedPassword,
    });

    res.json({
      status: "ok",
      message: "Signup Successful",
    });

  } catch (error) {
    console.log(error);

    res.json({
      status: "error",
      message: "Signup Failed",
    });
  }
});/* =========================================
            OTP VALIDATION CODE
   Add in server.js
========================================= */

let otpStore = {};

/* SEND OTP */
app.post("/sendOtp", async (req, res) => {
  try {
    const { email } = req.body;

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

    otpStore[cleanEmail] = otp;

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

        <p>Valid for signup only.</p>
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
});

/* VERIFY OTP + SIGNUP */
app.post("/verifyOtpSignup", async (req, res) => {
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
      email.trim().toLowerCase();

    /* CHECK OTP */
    if (
      otpStore[cleanEmail] != otp
    ) {
      return res.json({
        status: "error",
        message:
          "Invalid OTP",
      });
    }

    /* ADMIN KEY */
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
});

/* LOGIN */
app.post("/login", async (req, res) => {
  try {
    const { email, password } =
      req.body;

    const user =
      await User.findOne({ email });

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
});

/* GET USERS */
app.get("/getUsers", async (req, res) => {
  try {
    const data = await User.find();

    res.json({
      status: "ok",
      data,
    });
  } catch {
    res.json({
      status: "error",
    });
  }
});

/* UPDATE USER */
app.put(
  "/updateUser/:id",
  async (req, res) => {
    try {
      await User.findByIdAndUpdate(
        req.params.id,
        req.body
      );

      res.json({
        status: "ok",
      });
    } catch {
      res.json({
        status: "error",
      });
    }
  }
);

/* DELETE USER */
app.delete(
  "/deleteUser/:id",
  async (req, res) => {
    try {
      await User.findByIdAndDelete(
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
  }
);

/* =========================================
   ALUMNI APIs
========================================= */

/* GET */
app.get(
  "/getAlumni",
  async (req, res) => {
    try {
      const data =
        await Alumni.find();

      res.json({
        status: "ok",
        data,
      });
    } catch {
      res.json({
        status: "error",
      });
    }
  }
);

/* ADD */
app.post(
  "/addAlumni",
  upload.single("photo"),
  async (req, res) => {
    try {
      const {
        name,
        email,
        company,
        position,
        year,
      } = req.body;

      await Alumni.create({
        name,
        email,
        company,
        position,
        year,
        photo: req.file
          ? req.file.filename
          : "",
      });

      res.json({
        status: "ok",
      });
    } catch {
      res.json({
        status: "error",
      });
    }
  }
);

/* UPDATE */
app.put(
  "/updateAlumni/:id",
  upload.single("photo"),
  async (req, res) => {
    try {
      const updateData = {
        name: req.body.name,
        email: req.body.email,
        company:
          req.body.company,
        position:
          req.body.position,
        year: req.body.year,
      };

      if (req.file) {
        updateData.photo =
          req.file.filename;
      }

      await Alumni.findByIdAndUpdate(
        req.params.id,
        updateData
      );

      res.json({
        status: "ok",
      });
    } catch {
      res.json({
        status: "error",
      });
    }
  }
);

/* DELETE */
app.delete(
  "/deleteAlumni/:id",
  async (req, res) => {
    try {
      await Alumni.findByIdAndDelete(
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
  }
);

/* =========================================
   EVENT APIs
========================================= */

/* GET EVENTS */
app.get("/getEvents", async (req, res) => {
  try {
    const data =
      await Event.find().sort({
        date: 1,
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
});

/* ADD EVENT */
app.post("/addEvent", async (req, res) => {
  try {
    const {
      title,
      date,
      time,
      mode,
    } = req.body;

    await Event.create({
      title,
      date,
      time,
      mode,
    });

    res.json({
      status: "ok",
    });
  } catch {
    res.json({
      status: "error",
    });
  }
});

/* UPDATE EVENT */
app.put(
  "/updateEvent/:id",
  async (req, res) => {
    try {
      await Event.findByIdAndUpdate(
        req.params.id,
        req.body
      );

      res.json({
        status: "ok",
      });
    } catch {
      res.json({
        status: "error",
      });
    }
  }
);

/* DELETE EVENT */
app.delete(
  "/deleteEvent/:id",
  async (req, res) => {
    try {
      await Event.findByIdAndDelete(
        req.params.id
      );

      await Registration.deleteMany({
        eventId:
          req.params.id,
      });

      res.json({
        status: "ok",
      });
    } catch {
      res.json({
        status: "error",
      });
    }
  }
);

/* =========================================
   EVENT REGISTRATION APIs
========================================= */

/* REGISTER EVENT */
app.post(
  "/registerEvent",
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
        <div style="font-family:Arial;padding:20px">
          <h2>Hello ${name}</h2>
          <p>You are successfully registered for:</p>
          <h3 style="color:#607597">${eventTitle}</h3>
          <p>Thank you for joining our event.</p>
          <p><b>Phone:</b> ${phone}</p>
          <br/>
          <p>NextStep Team</p>
        </div>
      `,
      });

      res.json({
        status: "ok",
        message:
          "Registered + Email Sent",
      });
    } catch (error) {
      console.log(error);

      res.json({
        status: "error",
        message:
          "Registration Failed",
      });
    }
  }
);

/* ALL REGISTRATIONS */
app.get(
  "/getRegistrations",
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
  }
);

/* EVENT STUDENTS */
app.get(
  "/getEventStudents/:eventId",
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
  }
);

/* DELETE REGISTRATION */
app.delete(
  "/deleteRegistration/:id",
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
  }
);

/* =========================================
   SERVER
========================================= */
const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );
});