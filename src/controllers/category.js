"use strict";

const Category = require("../models/category");

module.exports = {
  list: async (req, res) => {
    const data = await res.getModelList(Category);
    res.status(200).send({
      error: false,
      message: "Categorys listed successfully",
      details: await res.getModelListDetails(Category),
      data,
    });
  },
  create: async (req, res) => {
    const data = await Category.create(req.body);
    res.status(200).send({
      error: false,
      message: "Category created successfully",
      data,
    });
  },

  read: async (req, res) => {
    const data = await Category.findOne({ _id: req.params.id });
    res.status(200).send({
      error: false,
      message: "Category listed successfully",
      data,
    });
  },

  update: async (req, res) => {
    const data = await Category.updateOne({ _id: req.params.id }, req.body);
    res.status(data.modifiedCount ? 201 : 400).send({
      error: !data.modifiedCount,
      message: data.modifiedCount
        ? "Category updated successfully"
        : "Category not updated successfully",
      data: data.modifiedCount
        ? await Category.findOne({ _id: req.params.id })
        : null,
    });
  },

  delete: async (req, res) => {
    const data = await Category.deleteOne({ _id: req.params.id });
    res.status(data.deletedCount ? 202 : 400).send({
      error: !data.deletedCount,
      message: data.deletedCount
        ? "Category deleted successfully"
        : "Category not deleted successfully",
    });
  },
};
