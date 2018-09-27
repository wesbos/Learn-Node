const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.loginPage = function(req, res) {
  res.render('login', {title: 'Login Page'});
}

exports.registerPage = function(req, res) {
  res.render('register', {title: 'Register Page'});
}

exports.registerValidation = [
  body('email')
    .isEmail().withMessage('Email không hợp lệ!')
    .normalizeEmail(),
  body('name')
    .not().isEmpty().withMessage('Vui lòng điền tên của bạn')
    .isLength({ min: 5 }).withMessage('Tên ít nhất 5 ký tự')
    .trim().escape(),
  body('password')
    .not().isEmpty().withMessage('Vui lòng điền mật khẩu')
    .isLength({ min: 5 }).withMessage('Mật khẩu phải ít nhất 5 ký tự'),
  body('re-password').custom((value, {req}) => {
    if (value !== req.body.password) throw new Error('Xác nhận password không trùng khớp với password!');
    else return true;
  }),
  sanitizeBody('email').normalizeEmail({
    gmail_remove_dots: false,
    gmail_remove_subaddress: false
  }),
  (req, res, next) => {
    const error = validationResult(req);

    if(!error.isEmpty()) {
      req.flash('error', error.array().map(error => error.msg));
      res.render('register', { title: 'Regsiter', body: req.body, flashes: req.flash() });
      return;
    }
  }
]