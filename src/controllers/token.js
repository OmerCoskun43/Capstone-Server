"use strict";

const Token = require("../models/token");

module.exports = {
  list: async (req, res) => {
    const data = await res.getModelList(Token);
    res.status(200).send({
      error: false,
      message: "Tokens listed successfully",
      details: await res.getModelListDetails(Token),
      data,
    });
  },
  create: async (req, res) => {
    req.body.isAdmin = false;
    req.body.isStaff = false;

    const data = await Token.create(req.body);
    res.status(200).send({
      error: false,
      message: "Token created successfully",
      data,
    });
  },

  read: async (req, res) => {
    const data = await Token.findOne({ _id: req.params.id });
    res.status(200).send({
      error: false,
      message: "Token listed successfully",
      data,
    });
  },

  update: async (req, res) => {
    delete req.body.isAdmin;
    delete req.body.isStaff;
    const data = await Token.updateOne({ _id: req.params.id }, req.body);

    res.status(data.modifiedCount ? 201 : 400).send({
      error: !data.modifiedCount,
      message: data.modifiedCount
        ? "Token updated successfully"
        : "Token not updated successfully",
      data: data.modifiedCount
        ? await Token.findOne({ _id: req.params.id })
        : null,
    });
  },

  delete: async (req, res) => {
    // const Token = await Token.findOne({ _id: req.params.id });
    const data = await Token.deleteOne({ _id: req.params.id });
    res.status(data.deletedCount ? 202 : 400).send({
      error: !data.deletedCount,
      message: data.deletedCount
        ? "Token deleted successfully"
        : "Token not deleted successfully",
    });
  },
};
