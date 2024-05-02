"use strict";

const Blog = require("../models/blog");

module.exports = {
  list: async (req, res) => {
    const data = await res.getModelList(Blog, {}, "categoryId");
    res.status(200).send({
      error: false,
      message: "Blogs listed successfully",
      details: await res.getModelListDetails(Blog),
      data,
    });
  },
  create: async (req, res) => {
    const data = await Blog.create(req.body);
    res.status(200).send({
      error: false,
      message: "Blog created successfully",
      data,
    });
  },

  read: async (req, res) => {
    let blog = await Blog.findOne({ _id: req.params.id }).populate(
      "categoryId"
    );
    if (!blog) {
      res.errorStatusCode = 404;
      throw new Error("Blog not found");
    }

    const VisitorBlog = blog.countOfVisitors.includes(req.user._id);

    if (!VisitorBlog) {
      await Blog.updateOne(
        { _id: req.params.id },
        {
          $addToSet: { countOfVisitors: req.user._id }, // $addToSet kullanarak tekrar eklemeyi önler
        }
        // Güncellenmiş belgeyi döndürmek için
      );
      res.status(201).send({
        error: false,
        data: blog,
        message: "Blog visitor increased successfully",
      });
    } else {
      res.status(201).send({
        error: false,
        message: "You have already visited this blog",
        data: blog,
      });
    }
  },

  update: async (req, res) => {
    const blog = await Blog.findOne({ _id: req.params.id });

    if (
      req.user?._id.toString() == blog.userId.toString() ||
      req.user?.isAdmin
    ) {
      const data = await Blog.updateOne({ _id: req.params.id }, req.body);
      res.status(data.modifiedCount ? 201 : 400).send({
        error: !data.modifiedCount,
        message: data.modifiedCount
          ? "Blog updated successfully"
          : "Blog not updated successfully",
        data: data.modifiedCount
          ? await Blog.findOne({ _id: req.params.id })
          : null,
      });
    } else {
      res.errorStatusCode = 403;
      throw new Error("You can't update this blog");
    }
  },

  delete: async (req, res) => {
    const blog = await Blog.findOne({ _id: req.params.id });

    if (req.user._id.toString() == blog.userId.toString() || req.user.isAdmin) {
      const data = await Blog.deleteOne({ _id: req.params.id });
      res.status(data.deletedCount ? 202 : 400).send({
        error: !data.deletedCount,
        message: data.deletedCount
          ? "Blog deleted successfully"
          : "Blog not deleted successfully",
      });
    } else {
      res.errorStatusCode = 403;
      throw new Error("You can't delete this blog");
    }
  },

  like: async (req, res) => {
    let blog = await Blog.findOne({ _id: req.params.id });

    if (!blog) {
      res.errorStatusCode = 404;
      throw new Error("Blog not found");
    }

    const userLikesBlog = blog.likes.includes(req.user._id);

    if (!userLikesBlog) {
      await Blog.updateOne(
        { _id: req.params.id },
        {
          $addToSet: { likes: req.user._id }, // $addToSet kullanarak tekrar eklemeyi önler
        }
        // Güncellenmiş belgeyi döndürmek için
      );
      res.status(201).send({
        error: false,
        message: "Blog liked successfully",
      });
    } else {
      await Blog.updateOne(
        { _id: req.params.id },
        {
          $pull: { likes: req.user._id }, // Belirli bir kullanıcının beğenisini kaldırır
        }
      );

      res.status(201).send({
        error: false,
        message: "Blog unliked successfully",
      });
    }
  },
};
