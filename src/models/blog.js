"use strict";

const { mongoose } = require("../configs/dbConnection");

const BlogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },

    isPublish: {
      type: Boolean,
      default: Math.floor(Math.random() * 100) % 2 == 0 ? true : false,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
      },
    ],
    countOfVisitors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
      },
    ],
  },

  {
    timestamps: true,
    collection: "blogs",
  }
);

const Blog = mongoose.model("Blog", BlogSchema);
module.exports = Blog;
