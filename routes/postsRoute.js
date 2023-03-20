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


module.exports = router