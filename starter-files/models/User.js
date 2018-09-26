const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const md5 = require('md5');
const validator = require('validator');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
  email: {
    type: String,
    trim: true,
    required: "Xin vui lòng cung cấp email",
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Email không hợp lệ!"]
  },
  name: {
    type: String,
    required: "Xin vui lòng cung cấp tên đăng nhập",
    trim: true
  }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);