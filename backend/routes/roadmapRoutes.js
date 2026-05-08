const express = require("express");
const router = express.Router();

const Roadmap = require("../models/roadmap");

/* ================= GET ALL ROADMAPS ================= */
router.get("/getRoadmaps", async (req, res) => {
  try {
    const data = await Roadmap.find();

    res.json({
      status: "ok",
      data,
    });
  } catch (err) {
    res.json({ status: "error", error: err.message });
  }
});

/* ================= GET SINGLE ROADMAP ================= */
router.get("/getRoadmap/:id", async (req, res) => {
  try {
    const { id } = req.params;

    

    const roadmap = await Roadmap.findById(id);

    if (!roadmap) {
      return res.json({
        status: "error",
        message: "Roadmap not found",
      });
    }

    res.json({
      status: "ok",
      data: roadmap,
    });
  } catch (err) {
    res.json({
      status: "error",
      error: err.message,
    });
  }
});

/* ================= ADD ROADMAP ================= */
/* ADD */
router.post("/addRoadmap", async (req, res) => {
  try {

    const roadmap = await Roadmap.create({
      role: req.body.role,
      category: req.body.category,
      icon: req.body.icon,
      company: req.body.company,
      location: req.body.location,
      year: req.body.year,

      description: req.body.description,
      duration: req.body.duration,
      salary: req.body.salary,
      tools: req.body.tools,
      projects: req.body.projects,

      skills: req.body.skills,
      
      resources: req.body.resources,

      steps: req.body.steps,
    });

    res.json({
      status: "ok",
      data: roadmap,
    });

  } catch (err) {
    console.log(err);

    res.json({
      status: "error",
      error: err.message,
    });
  }
});
/* ================= DELETE ROADMAP ================= */

router.delete("/deleteRoadmap/:id", async (req, res) => {
  try {
    await Roadmap.findByIdAndDelete(req.params.id);

    res.json({
      status: "ok",
      message: "Roadmap Deleted",
    });

  } catch (err) {
    res.json({
      status: "error",
      error: err.message,
    });
  }
});

module.exports = router;