"use strict";

const { mongoose } = require("../configs/dbConnection");
const passwordEncrypt = require("../helpers/passwordEncrypt");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      set: (password) => {
        if (
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password)
        ) {
          return passwordEncrypt(password);
        } else {
          throw new Error("Password type is not correct.");
        }
      },
      index: true,
    },
    email: {
      type: String,
      index: true,
      trim: true,
      required: [true, "Email field must be required"],
      unique: [true, "There is this email. Email field must be unique"],
      validate: [
        (email) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email),
        "Email type is not correct.",
      ],

      validate: [
        (email) => {
          const regexEmailCheck = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          return regexEmailCheck.test(email);
        },
        "Email type is not correct.",
      ],
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isStaff: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
