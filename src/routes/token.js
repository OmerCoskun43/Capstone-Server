"use strict";

const express = require("express");
const router = express.Router();

const {
  list,
  create,
  read,
  update,
  delete: _delete,
} = require("../controllers/token");

router.route("/").get(list).post(create);
router.route("/:id").get(read).put(update).patch(update).delete(_delete);

module.exports = router;
