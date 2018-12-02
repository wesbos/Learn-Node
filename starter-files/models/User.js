const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const crypto = require('crypto');

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
  },
  hash: String,
  salt: String,
  
});

UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
}

UserSchema.methods.validatePassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return hash === this.hash;
}

UserSchema.virtual('gravatar').get(function() {
  const hashEmail = crypto.createHash('md5').update(this.email).digest('hex');

  return `https://gravatar.com/avatar/${hashEmail}?s=200`;
});

module.exports = mongoose.model('User', UserSchema);