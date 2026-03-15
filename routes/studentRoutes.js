const express = require("express");
const Student = require("../models/Student");
const getCurrentAcademicYear = require("../utils/academicYear");
const verifyToken = require("../middleware/authMiddleware");
const { uploadStudent } = require("../middleware/upload");

const router = express.Router();

// GET Active Students
router.get("/active", async (req, res) => {
  try {
    const students = await Student.find({
      isActive: true,
      academicYear: getCurrentAcademicYear()
    });

    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET Today's Birthday Students
router.get("/today-birthday", async (req, res) => {
  try {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const students = await Student.find({
      birthMonth: month,
      birthDay: day,
      isActive: true,
      academicYear: getCurrentAcademicYear()
    });

    res.json(students);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD STUDENT (Admin)
router.post("/add", verifyToken, uploadStudent.single("image"), async (req, res) => {
  try {
    const {
      name,
      std,
      birthMonth,
      birthDay,
      academicYear
    } = req.body;

    const imageUrl = req.file ? req.file.path : "";

    const newStudent = new Student({
      name,
      std,
      img: imageUrl,
      birthMonth,
      birthDay,
      academicYear,
      isActive: true
    });

    await newStudent.save();

    res.status(201).json({ message: "Student added successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL STUDENTS (Admin Dashboard)
router.get("/all", verifyToken, async (req, res) => {
  try {

    const students = await Student.find({
      academicYear: getCurrentAcademicYear()
    }).sort({ std: 1 });

    res.json(students);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE STUDENT
router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {

    await Student.findByIdAndDelete(req.params.id);

    res.json({ message: "Student deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE STUDENT
router.put("/update/:id", verifyToken, uploadStudent.single("image"), async (req, res) => {
  try {

    const updateData = {
      name: req.body.name,
      std: req.body.std,
      birthMonth: req.body.birthMonth,
      birthDay: req.body.birthDay
    };

    if (req.file) {
      updateData.img = req.file.path;
    }

    await Student.findByIdAndUpdate(req.params.id, updateData);

    res.json({ message: "Student updated successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;