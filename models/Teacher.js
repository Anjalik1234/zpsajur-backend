const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({

  name: {
    mr: { type: String, required: true },
    en: { type: String, required: true }
  },

  position: {
    mr: { type: String, required: true },
    en: { type: String, required: true }
  },

  education: {
    type: String,
    required: false
  },

  photo: {
    type: String,
    required: true
  },

  category: {
    type: String,
    enum: ["teacher", "special"],
    default: "teacher"
  },

  order: {
    type: Number,
    default: 0
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Teacher", teacherSchema);