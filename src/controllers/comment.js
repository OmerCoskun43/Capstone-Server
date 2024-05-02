"use strict";

const Comment = require("../models/comment");

module.exports = {
  list: async (req, res) => {
    const data = await Comment.find({}).sort({ $natural: -1 });

    res.status(200).send({
      error: false,
      message: "Comments listed successfully",
      details: await res.getModelListDetails(Comment),
      data,
    });
  },
  create: async (req, res) => {
    const data = await Comment.create(req.body);
    res.status(200).send({
      error: false,
      message: "Comment created successfully",
      data,
    });
  },

  read: async (req, res) => {
    const data = await Comment.findOne({ _id: req.params.id });
    res.status(200).send({
      error: false,
      message: "Comment listed successfully",
      data,
    });
  },

  update: async (req, res) => {
    const comment = await Comment.findOne({ _id: req.params.id });

    if (
      req.user._id.toString() == comment.userId.toString() ||
      req.user.isAdmin
    ) {
      const data = await Comment.updateOne({ _id: req.params.id }, req.body);
      res.status(data.modifiedCount ? 201 : 400).send({
        error: !data.modifiedCount,
        message: data.modifiedCount
          ? "Comment updated successfully"
          : "Comment not updated successfully",
        data: data.modifiedCount
          ? await Comment.findOne({ _id: req.params.id })
          : null,
      });
    } else {
      res.errorStatusCode = 403;
      throw new Error("You can't update this comment");
    }
  },

  delete: async (req, res) => {
    const comment = await Comment.findOne({ _id: req.params.id });
    console.log("comment ==>", comment);
    if (
      req.user._id.toString() == comment?.userId._id.toString() ||
      req.user.isAdmin
    ) {
      const data = await Comment.deleteOne({ _id: req.params.id });
      console.log("data ==>", data);
      res.status(data.deletedCount ? 202 : 400).send({
        error: !data.deletedCount,
        message: data.deletedCount
          ? "Comment deleted successfully"
          : "Comment not deleted successfully",
      });
    } else {
      res.errorStatusCode = 403;
      throw new Error("You can't delete this comment");
    }
  },

  blogComments: async (req, res) => {
    const data = await res.getModelList(
      Comment,
      { blogId: req.params.id },
      "userId"
    );
    res.status(200).send({
      error: false,
      message: "Comments listed successfully",
      details: await res.getModelListDetails(
        Comment,
        {
          blogId: req.params.id,
        },
        "userId"
      ),
      data,
    });
  },
};
