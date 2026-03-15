const express = require("express");
const router = express.Router();
const Teacher = require("../models/Teacher");
const verifyToken = require("../middleware/authMiddleware");
const {uploadTeacher} = require("../middleware/upload");


// PUBLIC - Get teachers
router.get("/", async (req, res) => {

  try {

    const teachers = await Teacher.find();

    res.status(200).json(teachers);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching teachers",
      error: error.message
    });

  }

});


// ADMIN - Add teacher
router.post(
  "/",
  verifyToken,
  uploadTeacher.single("photo"),
  async (req, res) => {

    try {

      const teacher = new Teacher({
        ...req.body,
        photo: req.file ? req.file.path : ""
      });

      const saved = await teacher.save();

      res.status(201).json(saved);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: "Error adding teacher",
        error: error.message
      });

    }

  }
);


// ADMIN - Update
router.put("/:id", verifyToken, async (req, res) => {

  try {

    const updated = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (error) {

    res.status(400).json({
      message: "Error updating teacher"
    });

  }

});


// ADMIN - Delete
router.delete("/:id", verifyToken, async (req, res) => {

  try {

    await Teacher.findByIdAndDelete(req.params.id);

    res.json({
      message: "Teacher deleted"
    });

  } catch (error) {

    res.status(500).json({
      message: "Error deleting teacher"
    });

  }

});

module.exports = router;