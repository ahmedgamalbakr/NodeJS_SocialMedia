const express = require("express");
const router = express.Router();
const verify = require("../middleware/verify");
const Review = require("../models/review");

router.post("/:postid", verify, async (req, res, next) => {
  try {
    console.log(req.user._id);
    const review = await Review.create({
      content: req.body.content,
      stars: req.body.stars,
      post: req.params.postid,
      user: req.user._id,
    });
    res.send(review);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
