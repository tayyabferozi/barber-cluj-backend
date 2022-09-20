const User = require("../models/user-model");
const bcrypt = require("bcryptjs");

const { createToken } = require("../auth/auth");

exports.login = (req, res) => {
  let { username, password } = req.body;
  User.findOne({ username })
    .select("+password")
    .then((foundUser) => {
      if (!foundUser) {
        return res.status(400).json({
          success: false,
          errors: ["User does not exist, consider registring instead"],
        });
      }

      bcrypt.compare(password, foundUser.password).then((isMatch) => {
        if (isMatch) {
          foundUser.password = undefined;
          let payload = {
            user: foundUser,
          };

          let token = createToken(payload);
          res.status(200).json({ success: true, user: foundUser, token });
        } else {
          res
            .status(401)
            .json({ success: false, errors: ["Password incorrect"] });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        errors: ["Something went wrong, please try again later"],
      });
    });
};

exports.createUser = (req, res) => {
  const { username, password, name } = req.body;
  User.findOne({ username })
    .then((foundUser) => {
      if (foundUser) {
        return res.status(400).json({
          success: false,
          errors: ["That username is already taken, please try another one"],
        });
      }

      const newUser = new User({
        name,
        username,
        password,
      });

      // Check if password is correct

      bcrypt
        .hash(password, bcrypt.genSaltSync(12))
        .then((hash) => {
          newUser.password = hash;
          newUser
            .save()
            .then((createdUser) => {
              newUser.password = undefined;
              let payload = {
                user: newUser,
              };

              let token = createToken(payload);
              res.status(200).json({
                success: true,
                msg: "Account registered successfully",
                user: createdUser,
                token,
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                success: false,
                errors: ["Something went wrong, please try again later"],
              });
            });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            success: false,
            errors: ["Something went wrong, please try again later"],
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        errors: ["Something went wrong, please try again later"],
      });
    });
};
