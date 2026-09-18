const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

let bucket = null;

function getGridFSBucket() {
  if (bucket) {
    return bucket;
  }

  const db = mongoose.connection.db;

  if (!db) {
    throw new Error("MongoDB database connection is not ready");
  }

  bucket = new GridFSBucket(db, {
    bucketName: "foodbite_images",
  });

  return bucket;
}

module.exports = getGridFSBucket;