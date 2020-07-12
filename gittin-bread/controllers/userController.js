const mongoose = require('mongoose');

exports.loginForm = (req, res) => {
  res.render('login', {title: 'Login'}); 
}

exports.registerForm = async (req, res) => {
  res.render('register', {title: 'Register'})
}

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name')
  req.checkBody('name', 'You must suply a name').notEmpty();
  req.checkBody('email', 'That email is not valid').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false,
  })
  req.checkBody('password', 'Passwork cannot be empty').notEmpty()
  req.checkBody('password-confirm', 'Confirm Password cannot be empty').notEmpty();
  req.checkBody('password-confirm', 'Passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();
  if(errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('register', {
      title: 'Register',
      body: req.body,
      flashes: req.flash()
    });
    return;
  }
  next();
}