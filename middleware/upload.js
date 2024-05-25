const multer = require("multer");

// Storage Engine
const storageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads"); // directory
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/svg+xml"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only PNG, JPG, JPEG, and SVG are allowed."),
      false
    );
  }
};

const uploadMiddleware = multer({
  storage: storageEngine,
  fileFilter: fileFilter,
  limits: { fileSize: 2000000 }, // 2MB
}).single("image");

module.exports = uploadMiddleware;
