require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

/* ROUTES */
const authRoutes = require("./routes/authRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const alumniRoutes = require("./routes/alumniRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const mailRoutes = require("./routes/mailRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const resourceRoutes = require("./routes/resourceRoutes");

/* APP + SERVER */
const app = express();
const server = http.createServer(app);

/* SOCKET.IO */
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);

/* SOCKET CONNECTION */
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

/* DB */
const connectDB = require("./config/db");
connectDB();

/* MIDDLEWARE (IMPORTANT ORDER) */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://your-frontend-vercel-url.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

/* STATIC FILES */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ROUTES */
app.get("/current-user", (req, res) => {
  res.json({ user: req.user || null });
});
app.get("/", (req, res) => {
  res.send("Backend LIVE 🚀");
});
app.use(authRoutes);
app.use(notificationRoutes);
app.use(alumniRoutes);
app.use(eventRoutes);
app.use(registrationRoutes);
app.use(mailRoutes);
app.use(roadmapRoutes);
app.use(resourceRoutes);

/* START SERVER */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});