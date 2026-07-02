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
router.put("/updateAlumni/:id", upload.single("photo"), async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      email: req.body.email,
      company: req.body.company,
      position: req.body.position,
      year: req.body.year,
    };

    if (req.file) {
      updateData.photo = req.file.filename;
    }

    await Alumni.findByIdAndUpdate(req.params.id, updateData);

    res.json({ status: "ok" });
  } catch (err) {
    res.json({ status: "error", error: err.message });
  }
});

/* DELETE */
router.delete(
  "/deleteAlumni/:id",
  deleteAlumni
);

module.exports = router;