const express = require("express");
const router = express.Router();
const Contribution = require("../models/Contribution");
const verifyToken = require("../middleware/authMiddleware");

// ADD CONTRIBUTION
router.post("/add", async (req, res) => {
  try {

    const newContribution = new Contribution(req.body);

    await newContribution.save();

    res.status(200).json({
      message: "Contribution saved successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }
});


// GET ALL CONTRIBUTIONS (ADMIN)
router.get("/all", verifyToken, async (req, res) => {

  try {

    const contributions = await Contribution.find().sort({createdAt:-1});

    res.json(contributions);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching contributions"
    });

  }

});

module.exports = router;