const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema({
  role: String,
  category: String,
  icon: String,
  company: String,
  location: String,
  year: String,

  description: String,
  duration: String,
  salary: String,
  difficulty: String,

  skills: [String],
  tools: [String],
  projects: [String],
  resources: [String],

  steps: [String],
});

module.exports = mongoose.model(
  "Roadmap",
  roadmapSchema
);