const fs = require("fs");
const path = require("path");

exports.deleteLocalFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Failed to delete local file:", filePath, err);
    } else {
      console.log("Successfully deleted local file:", filePath);
    }
  });
};
