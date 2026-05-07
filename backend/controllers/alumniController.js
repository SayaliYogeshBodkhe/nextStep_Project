const Alumni = require("../models/alumni");

/* GET ALUMNI */
exports.getAlumni = async (
  req,
  res
) => {
  try {
    const data =
      await Alumni.find();

    res.json({
      status: "ok",
      data,
    });
  } catch {
    res.json({
      status: "error",
    });
  }
};

/* ADD ALUMNI */
exports.addAlumni = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      company,
      position,
      year,
    } = req.body;

    await Alumni.create({
      name,
      email,
      company,
      position,
      year,

      photo: req.file
        ? req.file.filename
        : "",
    });

    res.json({
      status: "ok",
    });

  } catch {
    res.json({
      status: "error",
    });
  }
};

/* UPDATE ALUMNI */
exports.updateAlumni =
  async (req, res) => {
    try {
      const updateData = {
        name: req.body.name,

        email:
          req.body.email,

        company:
          req.body.company,

        position:
          req.body.position,

        year:
          req.body.year,
      };

      if (req.file) {
        updateData.photo =
          req.file.filename;
      }

      await Alumni.findByIdAndUpdate(
        req.params.id,
        updateData
      );

      res.json({
        status: "ok",
      });

    } catch {
      res.json({
        status: "error",
      });
    }
  };

/* DELETE ALUMNI */
exports.deleteAlumni =
  async (req, res) => {
    try {
      await Alumni.findByIdAndDelete(
        req.params.id
      );

      res.json({
        status: "ok",
      });

    } catch {
      res.json({
        status: "error",
      });
    }
  };