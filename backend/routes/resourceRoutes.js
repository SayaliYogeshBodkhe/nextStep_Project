const express = require("express");

const router = express.Router();

const Resource = require("../models/resource");

/* GET ALL */
router.get("/getResources", async (req, res) => {
  try {
    const data = await Resource.find();

    res.json({
      status: "ok",
      data,
    });
  } catch (err) {
    res.json({
      status: "error",
    });
  }
});

/* ADD */
router.post("/addResource", async (req, res) => {
  try {
    await Resource.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      type: req.body.type,
      difficulty: req.body.difficulty,
      link: req.body.link,
      thumbnail: req.body.thumbnail,
      tags: req.body.tags,
    });

    res.json({
      status: "ok",
    });
  } catch (err) {
    res.json({
      status: "error",
    });
  }
});
/* Update */
router.put("/updateResource/:id", async (req, res) => {
  try {
    const updated = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ status: "ok", data: updated });
  } catch (err) {
    res.json({ status: "error", error: err.message });
  }
});
/* DELETE */
router.delete(
  "/deleteResource/:id",
  async (req, res) => {
    try {
      await Resource.findByIdAndDelete(
        req.params.id
      );

      res.json({
        status: "ok",
      });
    } catch (err) {
      res.json({
        status: "error",
      });
    }
  }
);

module.exports = router;