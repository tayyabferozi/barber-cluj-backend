const router = require("express").Router();

const { body } = require("express-validator");
const checkValidity = require("../middlewares/chack-validity");
const userControllers = require("../controllers/user-controllers");

// @route   POST /api/users/login
// @desc    To login a user
// @access  admin

router.post(
  "/login",
  [
    body("username").not().isEmpty().withMessage("Please enter your username"),
    body("password").not().isEmpty().withMessage("Please enter your password"),
  ],
  checkValidity,
  userControllers.login
);

// @route   POST /api/users/register
// @desc    To create a user
// @access  admin

router.post(
  "/register",
  [
    body("name").not().isEmpty().withMessage("Please enter a name"),
    body("username").not().isEmpty().withMessage("Please choose a username"),
    body("password").not().isEmpty().withMessage("Please choose a password"),
  ],
  checkValidity,
  userControllers.createUser
);

module.exports = router;
