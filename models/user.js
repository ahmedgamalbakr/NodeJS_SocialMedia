const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const { saltRound } = require("../config");


const userSchema = new Schema(
  {
    username: {
      type: String,
      unique:true
    },
    age: Number,
    role: {
      type: String,
      enum: ["admin", "creator", "user"],
    },
    password: {
      type: String,
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  const userDocument = this;
  if (userDocument.isModified("password")) {
    const hashedPassword = await bcrypt.hash(userDocument.password, saltRound);
    userDocument.password = hashedPassword;
  }
  next();
});
userSchema.methods.comparePassword = function (password) {
  const userDocument = this;
  return bcrypt.compare(password, userDocument.password);
};




const User = mongoose.model("user", userSchema);
module.exports = User;
