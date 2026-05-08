const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {
  getAlumni,
  addAlumni,
  updateAlumni,
  deleteAlumni,
} = require("../controllers/alumniController");

/* GET */
router.get(
  "/getAlumni",
  getAlumni
);

/* ADD */
router.post(
  "/addAlumni",
  upload.single("photo"),
  addAlumni
);

/* UPDATE */
router.put(
  "/updateAlumni/:id",
  upload.single("photo"),
  updateAlumni
);

/* DELETE */
router.delete(
  "/deleteAlumni/:id",
  deleteAlumni
);

module.exports = router;