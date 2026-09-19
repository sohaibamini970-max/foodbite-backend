const multer = require("multer");
const path = require("path");

const fileFilter = (req, file, cb) => {
  const mimeOk = /^image\//i.test(file.mimetype || "");
  const extOk = /\.(jpe?g|png|webp|gif|heic|heif|bmp)$/i.test(
    path.extname(file.originalname || "")
  );

  if (mimeOk || extOk) {
    cb(null, true);
  } else {
    // Log so we can see exactly what the app sent
    console.warn("Rejected upload:", {
      originalname: file.originalname,
      mimetype: file.mimetype,
      fieldname: file.fieldname,
    });
    cb(new Error(`Unsupported file type: ${file.mimetype || "unknown"}`));
  }
};

module.exports = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB — bumped up from 5MB for phone cameras
  },
});