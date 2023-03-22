const express = require("express");
const Post = require("../models/post");
const router = express.Router();
const verify = require("../middleware/verify");
const Comment = require("../models/comment");
const Review = require("../models/review");

router.post("/", verify, async (req, res, next) => {
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

router.get("/", verify, async (req, res, next) => {
    const posts = await Post.find({ user: req.user._id })
  res.send(posts);
});
// get post comments and reviews 
router.get("/:postid", verify, async (req, res, next) => {
    const comments = await Comment.find({ post: req.params.postid });
    const reviews = await Review.find({ post: req.params.postid });
    // const b = "Comments [" + comments+"]"+"\nReviews [" + reviews+"]"
    // console.log(b)
  res.send("Comments \n [" + comments + "]" + "\n Reviews \n [" + reviews + "]");
});
//update Post
router.patch("/:postid", verify, async (req, res, next) => {
  await Post.findByIdAndUpdate(req.params.postid, req.body);
  console.log("update success");
});

//delete Post
router.delete("/:postid", verify, async (req, res, next) => {
  await Post.findByIdAndDelete(req.params.postid);
  console.log("delete succcess");
});

module.exports = router;
