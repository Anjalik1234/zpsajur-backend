const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  std: { type: Number, required: true, min: 1, max: 7 },
  img: { type: String },
  birthMonth: { type: Number, required: true },
  birthDay: { type: Number, required: true },
  academicYear: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);