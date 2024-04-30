"use strict";

const Token = require("../models/token");
module.exports = async (req, res, next) => {
  const auth = req?.headers.authorization || null;

  const TokenKey = auth ? auth.split(" ") : null;

  if (TokenKey) {
    if (TokenKey[0] == "Token") {
      const tokenData = TokenKey[1];
      const tokenDB = await Token.findOne({ token: tokenData }).populate(
        "userId"
      );

      if (tokenDB) {
        req.user = tokenDB.userId || undefined;
      }
    }
  }

  next();
};
