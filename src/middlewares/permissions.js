"use strict";

module.exports = {
  isLogin: (req, res, next) => {
    // return next();
    if (req.user && req.user.isActive) {
      next();
    } else {
      res.errorStatusCode = 401;
      throw new Error("You Should be Login First");
    }
  },

  isStaffOrAdmin: (req, res, next) => {
    // return next();
    if (
      req.user &&
      req.user.isActive &&
      (req.user.isStaff || req.user.isAdmin)
    ) {
      next();
    } else {
      res.errorStatusCode = 401;
      throw new Error("You Should be Staff or Admin");
    }
  },

  isAdmin: (req, res, next) => {
    // return next();
    if (req.user && req.user.isActive && req.user.isAdmin) {
      next();
    } else {
      res.errorStatusCode = 401;
      throw new Error("You Should be Admin ");
    }
  },
};
