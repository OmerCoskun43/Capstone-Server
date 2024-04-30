"use strict";

const User = require("../models/user");
const passwordEncrypt = require("../helpers/passwordEncrypt");
const Token = require("../models/token");

module.exports = {
  login: async (req, res) => {
    if ((req.body.username || req.body.email) && req.body.password) {
      const user = await User.findOne({
        $or: [{ username: req.body.username }, { email: req.body.email }],
      });

      if (user) {
        if (
          user.isActive &&
          user.password == passwordEncrypt(req.body.password)
        ) {
          let tokenDB = await Token.findOne({ userId: user._id });

          if (!tokenDB) {
            const tokenData = passwordEncrypt(Date.now() + user._id);
            tokenDB = await Token.create({
              userId: user._id,
              token: tokenData,
            });
          }

          res.status(200).send({
            error: false,
            message: "User logged in successfully",
            token: tokenDB.token,
            user,
          });
        } else {
          res.errorStatusCode = 400;
          throw new Error("Password not correct");
        }
      } else {
        res.errorStatusCode = 400;
        throw new Error("Email or Username and Password not found in DB");
      }
    } else {
      res.errorStatusCode = 400;
      throw new Error("Email or Username and Password are required");
    }
  },

  logout: async (req, res) => {
    const auth = req?.headers.authorization || null;
    const tokenKey = auth ? auth?.split(" ") : null;

    const data = await Token.deleteOne({ token: tokenKey[1] });
    res.status(data.deletedCount ? 202 : 400).send({
      error: !data.deletedCount,
      message: data.deletedCount ? "Logout successful" : "Logout failed ",
      data,
    });
  },
};
