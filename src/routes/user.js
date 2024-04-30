"use strict";

const express = require("express");
const router = express.Router();

const {
  list,
  create,
  read,
  update,
  delete: _delete,
} = require("../controllers/user");

const { isAdmin, isLogin } = require("../middlewares/permissions");

router.route("/").get(isAdmin, list).post(create);

router.use(isLogin);
router.route("/:id").get(read).put(update).patch(update).delete(_delete);

module.exports = router;
