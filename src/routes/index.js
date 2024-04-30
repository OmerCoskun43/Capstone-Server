"use strict";

const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/tokens", require("./token"));
router.use("/users", require("./user"));
router.use("/categories", require("./category"));
router.use("/blogs", require("./blog"));
router.use("/comments", require("./comment"));

module.exports = router;
