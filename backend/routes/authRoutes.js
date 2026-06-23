const express = require("express");
const router = express.Router();
const User = require("../models/User");

const {
  signup,
  login,
  sendOtp,
  verifyOtpSignup,
} = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/sendOtp", sendOtp);
router.post("/verifyOtpSignup", verifyOtpSignup);

router.get("/current-user", (req, res) => {
  if (req.user) {
    return res.json(req.user);
  }

  return res.status(401).json({
    message: "No user logged in",
  });
});

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