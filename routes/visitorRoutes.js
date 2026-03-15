const express = require("express");
const router = express.Router();
const Visitor = require("../models/Visitor");

// Increase visit count
router.get("/visit", async (req, res) => {
  try {
    let visitor = await Visitor.findOne();

    if (!visitor) {
      visitor = new Visitor({ totalVisits: 1 });
    } else {
      visitor.totalVisits += 1;
    }

    await visitor.save();

    res.json({ count: visitor.totalVisits });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;