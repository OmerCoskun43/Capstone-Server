"use strict";
const express = require("express");
const app = express();
const cors = require("cors");

//! Dotenv
require("dotenv").config();

//! ENV Variables
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || "127.0.0.1";

//! Cross Origin Resource Sharing
app.use(cors());

//! Body Parser
app.use(express.json());

//! asyncErrors to errorHandler:
require("express-async-errors");

//! DB Connection
const { dbConnection } = require("./src/configs/dbConnection");
dbConnection();

//! FindSearchSortPagination
app.use(require("./src/middlewares/findSearchSortPage"));

//! Authentication
app.use(require("./src/middlewares/authentication"));

//! Routes
app.all("/", (req, res) => {
  res.send({
    error: false,
    message: "Capstone Blog App",
    author: "Ömer Coşkun",
    user: req.user,
  });
});

//! Routes
app.use(require("./src/routes"));

//! Error Handler
app.use(require("./src/middlewares/errorHandler"));

//! Server Listening
app.listen(PORT, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
