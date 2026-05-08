const express = require("express");

const router = express.Router();

const {
  sendConnectionMail,
} = require("../controllers/mailController");

router.post(
  "/sendConnectionMail",
  sendConnectionMail
);

module.exports = router;