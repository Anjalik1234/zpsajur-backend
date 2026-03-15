const mongoose = require("mongoose");

const contributionSchema = new mongoose.Schema({

  name: {
    type: String,
    default: ""
  },

  phone: {
    type: String,
    default: ""
  },

  address: {
    type: String,
    default: ""
  },

  amount: {
    type: Number,
    required: true
  },

  transactionID: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Contribution", contributionSchema);