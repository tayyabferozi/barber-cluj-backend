const User = require("../modals/User");

const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

exports.ensureHasAuthentication = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      errors: ["Please make sure your request has an 'Authorization' header"],
    });
  } else {
    next();
  }
};

exports.extractAuthentication = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(400).json({
            success: false,
            errors: ["Session timed out, please login again"],
          });
        } else {
          return res.status(400).json({
            success: false,
            errors: [
              "It seems like the token is not valid, please try signing in again",
            ],
          });
        }
      }

      User.findById(decoded._id)
        .then((foundUser) => {
          if (!foundUser) {
            return res.status(404).json({
              success: false,
              errors: ["User not found, please login again."],
            });
          }
          req.user = foundUser;
          next();
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            success: false,
            errors: ["Something went wrong, please try again later"],
          });
        });
    });
  } else {
    next();
  }
};

exports.ensureAuthenticated = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      errors: ["Please make sure your request has an 'Authorization' header"],
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, secret, (err, decoded) => {
    if (err || !decoded) {
      if (err.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          errors: ["Session timed out, please login again"],
        });
      } else {
        return res.status(400).json({
          success: false,
          errors: [
            "It seems like the token is not valid, please try signing in again",
          ],
        });
      }
    }

    User.findById(decoded._id)
      .then((foundUser) => {
        if (!foundUser) {
          return res.status(404).json({
            success: false,
            errors: ["User not found, please login again."],
          });
        }
        req.user = foundUser;
        next();
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          success: false,
          errors: ["Something went wrong, please try again later"],
        });
      });
  });
};
