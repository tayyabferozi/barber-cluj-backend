const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

const isEmpty = require("../utils/is-empty");

// Error formatter
const { errorFormatter } = require("../config/config");

module.exports = checkValidity = (req, res, next) => {
  const errors = validationResult(req).formatWith(errorFormatter);

  if (!errors.isEmpty()) {
    if (!isEmpty(req.files)) {
      // Delete the saved files
      req.files.forEach((file) => {
        try {
          fs.unlinkSync(path.resolve("images", file.filename));
        } catch (err) {
          console.log(err);
        }
      });
    }
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  next();
};
