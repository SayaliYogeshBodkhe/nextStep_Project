const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI ||
        "mongodb://127.0.0.1:27017/nextstep"
    );

    console.log(
      "✅ MongoDB Connected"
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;