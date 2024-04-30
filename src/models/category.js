"use strict";

const { mongoose } = require("../configs/dbConnection");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "categories",
  }
);

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
