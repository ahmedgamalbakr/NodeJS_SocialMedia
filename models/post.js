const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  content: {
    type: String,
    required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref:"user"
    }
});

const Post = mongoose.model("post", postSchema);
module.exports = Post;

