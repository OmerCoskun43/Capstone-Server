"use strict";
const mongoose = require("mongoose");

module.exports = {
  mongoose,
  dbConnection: () => {
    mongoose
      .connect(process.env.MONGODB)
      .then(() => {
        console.log("MongoDB Connected");
      })
      .catch(() => console.log("MongoDB Connection Failed"));
  },
};
