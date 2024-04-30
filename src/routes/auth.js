"use strict";

const express = require("express");
const router = express.Router();

const { login, logout } = require("../controllers/auth");

router.route("/login").post(login);
router.route("/logout").all(logout);

module.exports = router;
