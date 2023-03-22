const express = require("express");
const User = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { validateSignUp, validateLogin } = require("../middleware/validator");
const verify = require("../middleware/verify");
const CustomError = require("../helpers/customError");
const {promisify} = require('util');
const signJwt = promisify(jwt.sign);
const {jwtSecret} = require("../config");
const Post = require("../models/post");

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
    console.log("after token");
    res.json({
      message: "logged in",
      token,
      user,
    });
  } catch (error) {
    return next(error)
  }
});


//get user with his posts 
router.get('/',verify,async(req,res,next)=>{
   
  // console.log(req.user._id);
   const userPosts=await Post.find({user:req.user._id});
   res.send(userPosts);

})


//update
router.patch("/", verify, async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, req.body);
  console.log("update success");
});


//Admin only has authority to delete users or creators
router.delete("/:id", verify, async (req, res, next) => {
  //check if role == admin
  if (req.user.role === "admin") {
    await User.findByIdAndDelete(req.params.id);
    console.log("delete succcess");
  } else {
    console.log("Only admin has the permissin to delete ");
    res.send("Only admin has the permissin to delete ")
  }
});

module.exports = router;
