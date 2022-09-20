require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

const app = express();

app.use(morgan("dev"));

const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI_LOCAL)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server started on port " + port);
    });
  })
  .catch((err) => {
    console.log(err);
  });
