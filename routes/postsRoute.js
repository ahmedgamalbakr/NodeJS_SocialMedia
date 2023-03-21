const express = require("express");
const Post = require("../models/post");
const router = express.Router();
const verify = require("../middleware/verify");

router.post("/",verify, async (req, res, next) => {
    try {
        console.log(req.user._id);
        const post = await Post.create({
            content: req.body.content,
            user:req.user._id
        })
        res.send(post)
    } catch (error) {
        return next(error)
    }
})

router.get("/", verify, async (req, res, next) => {
    const posts = await Post.find({ user: req.user._id }).populate("user")
    res.send(posts)
})


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
  


module.exports = router