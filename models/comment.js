const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
    },
    post: {
        type: Schema.Types.ObjectId,
        ref:"post"
    }
});

const Comment = mongoose.model("comment", commentSchema);
module.exports = Comment;

