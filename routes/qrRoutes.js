const express = require("express");
const router = express.Router();
const QRCode = require("../models/QRCode");
const verifyToken = require("../middleware/authMiddleware");
const {uploadQR} = require("../middleware/upload");


// Get latest QR
router.get("/", async (req, res) => {

  const qr = await QRCode.findOne().sort({ updatedAt: -1 });

  res.json(qr);

});


// Update QR (Admin only)
router.post(
  "/update",
  verifyToken,
  uploadQR.single("qr"),
  async (req, res) => {

    try {

      const newQR = new QRCode({
        imageUrl: req.file.path,
        public_id: req.file.filename
      });

      await newQR.save();

      res.json({
        message: "QR Updated Successfully",
        qr: newQR
      });

    } catch (error) {

      res.status(500).json({
        message: "QR upload failed"
      });

    }

  }
);

module.exports = router;