const express = require("express");
const User = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { validateSignUp, validateLogin } = require("../middleware/validator");
const verify = require("../middleware/verify");
const CustomError = require("../helpers/customError");
const { promisify } = require("util");
const signJwt = promisify(jwt.sign);
const { jwtSecret } = require("../config");
const Post = require("../models/post");
const upload = require("../middleware/upload");
const { isAdmin } = require("../middleware/roleValidation");
// SignUp users
router.post("/", validateSignUp, async (req, res, next) => {
  try {
    const { username, age, role, password } = req.body;
    const createdUser = new User({
      username,
      age,
      role,
      password,
    });
    await createdUser.save();
    res.send(createdUser);
  } catch (error) {
    return next(error);
  }
});

//login
router.post("/login", validateLogin, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    // console.log("entered");
    const user = await User.findOne({ username });
    if (!user) {
      console.log("not found");
      throw new CustomError("invalid credentials", 400);
    }

    const isMatch = user.comparePassword(password);
    if (!isMatch) {
      throw new CustomError("invalid credentials", 400);
    }
    const payload = { id: user._id };
    const token = await signJwt(payload, jwtSecret, { expiresIn: "1h" });
    res.json({
      message: "logged in",
      token,
      user,
    });
  } catch (error) {
    return next(error);
  }
});

//get user with his posts
router.get("/", verify, async (req, res, next) => {
  // console.log(req.user._id);
  const userPosts = await Post.find({ user: req.user._id });
  if (userPosts.length == 0) {
    res.send("no posts found");
  } else {
    res.send(userPosts);
  }
});

//update
router.patch("/", verify, async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    await res.send("body is empty");
  } else {
    await User.findByIdAndUpdate(req.user._id, req.body);
    res.send("update success");
  }
});

//Admin only has authority to delete users or creators
// router.delete("/:id", verify, async (req, res, next) => {
//   //check if role == admin
//   if (req.user.role === "admin") {
//     const found = User.findById(req.params.id);
//     if (!found) {
//       res.send("no user was found with this id");
//     } else {
//       await User.findByIdAndDelete(req.params.id);
//       console.log("delete succcess");
//     }
//   } else {
//     console.log("Only admin has the permissin to delete ");
//     res.send("Only admin has the permissin to delete ");
//   }
// });
router.delete("/:id", verify, isAdmin, async (req, res, next) => {
  const found = await User.findByIdAndDelete(req.params.id);
  // console.log(found);
  if (!found) {
    res.send("no user was found with this id");
  } else {
    console.log("delete succcess");
    res.send("delete succcess");
  }
});

router.post("/uploadImg", verify, upload, async (req, res, next) => {
  try {
    var id = req.user._id.toHexString();
    var img = req.file.filename;
    var data = { img };
    await User.updateOne({ _id: id }, data);
    res.send("uploded succesfully ! ");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
