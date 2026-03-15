const multer = require("multer");
const { studentStorage, teacherStorage, qrStorage } = require("../utils/cloudinary");

const uploadStudent = multer({
  storage: studentStorage
});

const uploadTeacher = multer({
  storage: teacherStorage
});

const uploadQR = multer({
  storage: qrStorage
});

module.exports = { uploadStudent, uploadTeacher, uploadQR };