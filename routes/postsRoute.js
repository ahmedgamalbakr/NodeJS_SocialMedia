const express = require("express");
const Post = require("../models/post");
const router = express.Router();
const verify = require("../middleware/verify");
const Comment = require("../models/comment");
const Review = require("../models/review");
const {isCreator,isAdmin} = require("../middleware/roleValidation")


router.post("/",isCreator, verify, async (req, res, next) => {
  try {
    console.log(req.user._id);
    const post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });
    res.send(post);
  } catch (error) {
    return next(error);
  }
});

router.get("/", verify,isCreator, async (req, res, next) => {
  const posts = await Post.find({ user: req.user._id });
  if (posts.length == 0) {
    console.log("no posts found");
  } else {
    res.send(posts);
  }
});

// get post comments and reviews
router.get("/:postid",isCreator, verify, async (req, res, next) => {
  const isFound = await Post.findById(req.params.postid);
  if (!isFound) {
    res.send("post not found");
  } else {
    const comments = await Comment.find({ post: req.params.postid });
    const reviews = await Review.find({ post: req.params.postid });
    
    res.send(
      "Comments \n [" + comments + "]" + "\n Reviews \n [" + reviews + "]"
    );
  }
});
//update Post
router.patch("/:postid",isCreator, verify, async (req, res, next) => {
  const isFound = await Post.findById(req.params.postid);
  if (!isFound) {
    res.send("post not found");
  } else {
    await Post.findByIdAndUpdate(req.params.postid, req.body);
    console.log("update success");
  }
});

//delete Post
router.delete("/:postid",isAdmin, verify, async (req, res, next) => {
  const isFound = await Post.findById(req.params.postid);
  if (!isFound) {
    res.send("post not found");
  } else {
    await Post.findByIdAndDelete(req.params.postid);
    console.log("delete succcess");
  }
});

module.exports = router;
