const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { jwtSecret } = require("../config");

const isAdmin = async (req, res, next) => {
  const token = req.headers.authorization;
  const { id, role } = jwt.verify(token, jwtSecret);
  //  verify role
  const user = await User.findById(id);
  if (user.role != "admin") {
    const error = new Error("unauthorized user");
    error.status = 403;
    return next(error);
  }
  console.log(user.role);
  req.user = user;
  next();
};
const isCreator = async (req, res, next) => {
  const token = req.headers.authorization;
  const { id, role } = jwt.verify(token, jwtSecret);
  //  verify role
  const user = await User.findById(id);
  if (user.role != "creator") {
    const error = new Error("unauthorized user");
    error.status = 403;
    return next(error);
  }
  console.log(user.role);
  req.user = user;
  next();
};
const isUser = async (req, res, next) => {
  const token = req.headers.authorization;
  const { id, role } = jwt.verify(token, jwtSecret);
  //  verify role
  const user = await User.findById(id);
  if (user.role != "creator") {
    const error = new Error("unauthorized user");
    error.status = 403;
    return next(error);
  }
  console.log(user.role);
  req.user = user;
  next();
};

module.exports = {
  isAdmin,isCreator,isUser
};
