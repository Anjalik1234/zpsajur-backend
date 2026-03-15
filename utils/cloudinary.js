const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const studentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "students",
    allowed_formats: ["jpg", "png", "jpeg"]
  }
});

// Storage for Teachers
const teacherStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "teachers",
    allowed_formats: ["jpg", "png", "jpeg"]
  }
});

// Storage for QR Codes
const qrStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "schoolQR",
    allowed_formats: ["jpg", "png", "jpeg"]
  }
});

module.exports = {
  cloudinary,
  studentStorage,
  teacherStorage,
  qrStorage
};