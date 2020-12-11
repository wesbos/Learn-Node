const mongoose = require("mongoose");
const md5 = require("md5");
const validator = require("validator");
const mongoDbErrorHandler = require("mongoose-mongodb-errors");
var passport = require("passport-local-mongoose");

mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, "Invalid email address"],
    required: "Please enter an email address",
  },
  name: {
    type: String,
    trim: true,
    required: "Please enter a name",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  photo: String,
});

userSchema.plugin(passport, { usernameField: "email" });
userSchema.plugin(mongoDbErrorHandler);

module.exports = mongoose.model("User", userSchema);
