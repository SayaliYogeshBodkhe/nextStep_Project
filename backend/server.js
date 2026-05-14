require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");


require("./auth/google");
require("./cron/deleteExpiredEvents");
require("./cron/sendEventReminder");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const notificationRoutes =
  require(
    "./routes/notificationRoutes"
  );
const alumniRoutes = require("./routes/alumniRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const mailRoutes = require("./routes/mailRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const resourceRoutes = require(
  "./routes/resourceRoutes"
);

const app = express();

/* MIDDLEWARE */
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      "mysecret",

    resave: false,

    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(notificationRoutes);

/* STATIC */
app.use(
  "/uploads",
  express.static("uploads")
);

/* DATABASE */
connectDB();

/* ROUTES */
app.use(authRoutes);

app.use(alumniRoutes);

app.use(eventRoutes);

app.use(registrationRoutes);

app.use(mailRoutes);
app.use("/", roadmapRoutes);
app.use("/", resourceRoutes);

/* SERVER */
const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );
});