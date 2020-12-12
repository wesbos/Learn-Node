const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const md5 = require("md5");
const validator = require("validator");
const mongoDbErrorHandler = require("mongoose-mongodb-errors");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    index: true,
    unique: true,
    validate: [validator.isEmail, "Invalid email address"],
    required: "Please enter an email address",
  },
  name: {
    type: String,
    trim: true,
    required: "Please enter a name",
  },
});
userSchema.set("autoIndex", false);
userSchema.plugin(passportLocalMongoose, { usernameField: "email" });
userSchema.plugin(mongoDbErrorHandler);

module.exports = mongoose.model("User", userSchema);
