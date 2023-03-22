const express = require("express");
const router = express.Router();
const verify = require("../middleware/verify");
const Comment = require("../models/comment");

// add comment to post
router.post("/:postid", verify, async (req, res, next) => {
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

//get comments related to specific post
// router.get("/:postid", verify, async (req, res, next) => {
//     const comments = await Comment.find({ post: req.params.postid })
//     res.send(comments)
// })

//update Comment
router.patch("/:commentid", verify, async (req, res, next) => {
  await Comment.findByIdAndUpdate(req.params.commentid, req.body);
  console.log("update success");
});

//delete comment
router.delete("/:commentid", verify, async (req, res, next) => {
  await Comment.findByIdAndDelete(req.params.commentid);
  console.log("delete succcess");
});

module.exports = router;
