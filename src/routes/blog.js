"use strict";

const express = require("express");
const router = express.Router();

const {
  list,
  create,
  read,
  update,
  delete: _delete,
  like,
} = require("../controllers/blog");

const { isLogin } = require("../middlewares/permissions");

router.route("/").get(list).post(isLogin, create);

router.use(isLogin);
router.route("/:id").get(read).put(update).patch(update).delete(_delete);

router.route("/:id/like").get(like);

module.exports = router;
