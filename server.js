const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const startPromotionJob = require("./utils/promotionJob");

const adminRoutes = require("./routes/adminRoutes");
const visitorRoutes = require("./routes/visitorRoutes");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const contributionRoutes = require("./routes/contributionRoutes");
const qrRoutes = require("./routes/qrRoutes");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://zpsajur.in",
      "https://www.zpsajur.in"
    ],
  })
);

app.use(express.json());

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api", visitorRoutes);
app.use("/api/contributions", contributionRoutes);
app.use("/api/qr", qrRoutes);

app.get("/", (req, res) => {
  res.send("School admin backend running");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("School MongoDB connected");

    startPromotionJob();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });