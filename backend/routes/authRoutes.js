const express = require("express");
const router = express.Router();

const User = require("../models/user");
const {
  signup,
  login,
  sendOtp,
  verifyOtpSignup,
} = require("../controllers/authController");

/* ================= AUTH ================= */
router.post("/signup", signup);
router.post("/login", login);
router.post("/sendOtp", sendOtp);
router.post("/verifyOtpSignup", verifyOtpSignup);

/* ================= CURRENT USER ================= */
router.get("/current-user", (req, res) => {
  try {
    res.json({
      status: "ok",
      user: {
        name: "Demo User",
        userType: "User",   // ⚠️ IMPORTANT (frontend expects userType)
      },
    });
  } catch (err) {
    res.json({ status: "error" });
  }
});

/* ================= GET USERS ================= */
router.get("/getUsers", async (req, res) => {
  try {
    const users = await User.find();

    res.json({
      status: "ok",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = router;