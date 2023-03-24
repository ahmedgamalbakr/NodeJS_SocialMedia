const express = require("express");
const router = express.Router();
const verify = require("../middleware/verify");
const Review = require("../models/review");
const Post = require("../models/post");
const {
  isUser,
  isAdmin,
  isAdminOrUser,
} = require("../middleware/roleValidation");

// add review
router.post("/:postid", verify, isUser, async (req, res, next) => {
  try {
    const isFound = await Post.findById(req.params.postid);
    // console.log(isFound);
    if (!isFound) {
      res.send("post not found");
    } else {
      console.log(req.user._id);
      const review = await Review.create({
        content: req.body.content,
        stars: req.body.stars,
        post: req.params.postid,
        user: req.user._id,
      });
      res.send(review);
    }
  } catch (error) {
    return next(error);
  }
});
// get specific review
router.get("/:reviewid", verify, isUser, async (req, res, next) => {
  const review = await Review.findById(req.params.reviewid);
  // console.log(review);
  if (!review) {
    res.send("comment not found");
  } else {
    res.send(review);
  }
});

// update review
router.patch("/:reviewid", verify, isUser, async (req, res, next) => {
  const review = await Review.findById(req.params.reviewid);
  if (!review) {
    res.send("Review not found");
  } else {
    await Review.findByIdAndUpdate(req.params.reviewid, req.body);
    res.send("update success");
  }
});
// delete review
router.delete("/:reviewid", verify, isAdminOrUser, async (req, res, next) => {
  const review = await Review.findById(req.params.reviewid);
  if (!review) {
    res.send("Review not found");
  } else {
    await Review.findByIdAndDelete(req.params.reviewid);
    res.send("Delete done");
  }
});

module.exports = router;
