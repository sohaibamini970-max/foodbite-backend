const mongoose = require("mongoose");
const getGridFSBucket = require("../utils/gridfs");

exports.getImage = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid image ID",
      });
    }

    const fileId = new mongoose.Types.ObjectId(id);

    const bucket = getGridFSBucket();

    const files = await bucket.find({
      _id: fileId,
    }).toArray();

    if (!files.length) {
      return res.status(404).json({
        message: "Image not found",
      });
    }

    const file = files[0];

    res.set("Content-Type", file.contentType || "image/jpeg");

    res.set(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );

    const downloadStream = bucket.openDownloadStream(fileId);

    downloadStream.on("error", next);

    downloadStream.pipe(res);

  } catch (err) {
    next(err);
  }
};