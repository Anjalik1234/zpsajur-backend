const cron = require("node-cron");
const Student = require("../models/Student");

const getNextAcademicYear = () => {
  const year = new Date().getFullYear();
  return `${year}-${String(year + 1).slice(2)}`;
};

const startPromotionJob = () => {
  cron.schedule("0 1 1 6 *", async () => {
    console.log("Running Academic Promotion...");

    try {
      const newYear = getNextAcademicYear();

      // 1️⃣ Deactivate 7th std students
      await Student.updateMany(
        { std: 7, isActive: true },
        { isActive: false }
      );

      // 2️⃣ Promote 1–6 students
      await Student.updateMany(
        { std: { $lt: 7 }, isActive: true },
        { $inc: { std: 1 } }
      );

      // 3️⃣ Update academic year
      await Student.updateMany(
        { isActive: true },
        { academicYear: newYear }
      );

      console.log("Promotion Completed Successfully");
    } catch (err) {
      console.error(err);
    }
  });
};

module.exports = startPromotionJob;