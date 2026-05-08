const express = require("express");

const router = express.Router();

const {
  signup,
  login,
  sendOtp,
  verifyOtpSignup,
} = require("../controllers/authController");

router.post(
  "/signup",
  signup
);

router.post(
  "/login",
  login
);

router.post(
  "/sendOtp",
  sendOtp
);

router.post(
  "/verifyOtpSignup",
  verifyOtpSignup
);

module.exports = router;