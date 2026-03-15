const mongoose = require("mongoose");

const qrSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  public_id: {
    type: String
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("QRCode", qrSchema);