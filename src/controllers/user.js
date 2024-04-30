"use strict";

const User = require("../models/user");
const SendMail = require("../helpers/sendMail");

module.exports = {
  list: async (req, res) => {
    const data = await res.getModelList(User);
    res.status(200).send({
      error: false,
      message: "Users listed successfully",
      details: await res.getModelListDetails(User),
      data,
    });
  },
  create: async (req, res) => {
    if (req.user?.isAdmin) {
      req.body.isAdmin = false;
      const data = await User.create(req.body);
      SendMail(
        data.email,
        "User Registration created succesfully",
        "Welcome to Capstone Blog App"
      );
      res.status(200).send({
        error: false,
        message: "User created successfully",
        data,
      });
    } else {
      req.body.isAdmin = false;
      req.body.isStaff = false;
      const data = await User.create(req.body);
      SendMail(data.email, "User Registration", "Welcome to Capstone Blog App");
      res.status(200).send({
        error: false,
        message: "User created successfully",
        data,
      });
    }
  },

  read: async (req, res) => {
    const customFilter = req.user.isAdmin
      ? { _id: req.params.id }
      : { _id: req.user._id };

    const data = await User.findOne(customFilter);
    res.status(200).send({
      error: false,
      message: "User listed successfully",
      data,
    });
  },

  update: async (req, res) => {
    if (req.user.isAdmin) {
      delete req.body.isAdmin;
      const data = await User.updateOne({ _id: req.params.id }, req.body, {
        runValidators: true,
      });

      SendMail(
        req.body.email,
        "User Profile Updated ",
        "Your account has been updated"
      );

      res.status(data.modifiedCount ? 201 : 400).send({
        error: !data.modifiedCount,
        message: data.modifiedCount
          ? "User updated successfully"
          : "User not updated successfully",
        data: data.modifiedCount
          ? await User.findOne({ _id: req.params.id })
          : null,
      });
    } else if (req.user._id == req.params.id) {
      delete req.body.isAdmin;
      delete req.body.isStaff;
      const data = await User.updateOne({ _id: req.params.id }, req.body, {
        runValidators: true,
      });

      SendMail(
        req.body.email,
        "User Profile Updated ",
        "Your account has been updated"
      );
      res.status(data.modifiedCount ? 201 : 400).send({
        error: !data.modifiedCount,
        message: data.modifiedCount
          ? "User updated successfully"
          : "User not updated successfully",
        data: data.modifiedCount
          ? await User.findOne({ _id: req.params.id })
          : null,
      });
    } else {
      res.errorStatusCode = 400;
      throw new Error("You can only update your own profile");
    }
  },

  delete: async (req, res) => {
    const user = await User.findOne({ _id: req.params.id });

    if (req.user.isAdmin) {
      const data = await User.deleteOne({ _id: req.params.id });
      SendMail(
        user.email,
        "User Profile Deleted",
        "Your account has been deleted"
      );
      res.status(data.deletedCount ? 202 : 400).send({
        error: !data.deletedCount,
        message: data.deletedCount
          ? "User deleted successfully"
          : "User not deleted successfully",
        deleted_user: data.deletedCount ? user : null,
      });
    } else if (req.user._id == req.params.id) {
      const data = await User.deleteOne({ _id: req.params.id });
      SendMail(
        user.email,
        "User Profile Deleted",
        "Your account has been deleted"
      );
      res.status(data.deletedCount ? 202 : 400).send({
        error: !data.deletedCount,
        message: data.deletedCount
          ? "User deleted successfully"
          : "User not deleted successfully",
        deleted_user: data.deletedCount ? user : null,
      });
    } else {
      res.errorStatusCode = 400;
      throw new Error("You can only delete your own profile");
    }
  },
};
