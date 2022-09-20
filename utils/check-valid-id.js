const mongoose = require("mongoose");
const isEmpty = require("../utils/is-empty");

module.exports = checkValidId = (value) => {
  if (isEmpty(value)) {
    throw new Error("Id should not be empty");
  }
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error("Invalid Id");
  }
  return true;
};
