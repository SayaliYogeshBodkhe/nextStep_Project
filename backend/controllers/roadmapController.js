const Roadmap = require("../models/roadmap");

/* ================= GET ALL ROADMAPS ================= */
exports.getRoadmaps = async (req, res) => {
  try {
    const data = await Roadmap.find();

    res.json({
      status: "ok",
      data,
    });
  } catch (err) {
    res.json({
      status: "error",
      error: err.message,
    });
  }
};

/* ================= GET SINGLE ROADMAP ================= */
exports.getRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);

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
};

/* ================= ADD ROADMAP ================= */
exports.addRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.create(req.body);

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
};

/* ================= UPDATE ROADMAP ================= */
exports.updateRoadmap = async (req, res) => {
  try {
    const updated = await Roadmap.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      status: "ok",
      data: updated,
    });
  } catch (err) {
    console.log(err);
    res.json({
      status: "error",
      error: err.message,
    });
  }
};

/* ================= DELETE ROADMAP ================= */
exports.deleteRoadmap = async (req, res) => {
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
};