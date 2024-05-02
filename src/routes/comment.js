"use strict";

const express = require("express");
const router = express.Router();

const {
  list,
  create,
  read,
  update,
  delete: _delete,
  blogComments,
} = require("../controllers/comment");

const { isLogin } = require("../middlewares/permissions");

router.use(isLogin);
router.route("/").get(list).post(create);
router.route("/:id").get(read).put(update).patch(update).delete(_delete);

router.route("/blog/:id").get(blogComments);

module.exports = router;
