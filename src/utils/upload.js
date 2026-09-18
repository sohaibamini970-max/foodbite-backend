const multer = require("multer");

const fileFilter = (req, file, cb) => {
  if (/^image\/(jpeg|jpg|png|webp)$/.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files allowed"));
  }
};

module.exports = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});