const express = require("express");
const router = express.Router();
const verify = require("../middleware/verify");
const Comment = require("../models/comment");
const {
  isUser,
  isAdmin,
  isAdminOrUser,
} = require("../middleware/roleValidation");


// add comment to post
router.post("/:postid", verify,isUser, async (req, res, next) => {
  try {
    console.log(req.user._id);
    console.log(req.params.postid);
    const comment = await Comment.create({
      content: req.body.content,
      post: req.params.postid,
      user: req.user._id,
    });
    res.send(comment);
  } catch (error) {
    return next(error);
  }
});

// get comment
router.get("/:commentid", verify, isUser, async (req, res, next) => {
  const isFound = await Comment.findById(req.params.commentid);
  if (!isFound) {
    res.send("comment not found");
  } else {
    const comment = await Comment.find({ post: req.params.commentid });
    res.send(comment);
  }
});

//update Comment
router.patch("/:commentid", verify, isUser, async (req, res, next) => {
  const isFound = await Comment.findById(req.params.commentid);
  if (!isFound) {
    res.send("comment not found");
  } else {
    await Comment.findByIdAndUpdate(req.params.commentid, req.body);
    console.log("update success");
  }
});

//delete comment
router.delete("/:commentid", verify, isAdminOrUser, async (req, res, next) => {
  const isFound = await Comment.findById(req.params.commentid);
  if (!isFound) {
    res.send("comment not found");
  } else {
    await Comment.findByIdAndDelete(req.params.commentid);
    res.send("delete success");
  }
});

module.exports = router;
