const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: String,
    password: String,
    email: String,
    role: {
        type: String,
        default: "admin"
    }
});

module.exports = mongoose.model("Admin", adminSchema);