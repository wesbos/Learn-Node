const passport = require('passport');
const crypto = require('crypto')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const promisify = require('es6-promisify');
const mail = require('../handlers/mail');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login',
  successRedirect: '/',
  successFlash: 'You are now logged in'
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'You are now logged out');
  res.redirect('/')
};

exports.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    next();
    return;
  }
  req.flash('error', 'You must be logged in')
  res.redirect('/login');
}

exports.forgot = async (req, res) => {
  //check if user exists via email
  const user = await User.findOne({ email: req.body.email })
  //set reset token and expiration on their account
  if(!user) {
    req.flash('error', 'No account with that email')
    return res.redirect('/login')
  }
  //send user the email with token
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex')
  user.resetPasswordExpires = Date.now() + 3600000
  await user.save()
  //redirect to login page
  const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`
  await mail.send({
    user,
    filename: 'password-reset',
    subject: 'Password Reset',
    resetURL
  });
  req.flash('success', `You have been emailed a password reset link.`);
  res.redirect('/login')
}

exports.reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  })
  // console.log(user) // NOT WORKING PROPERLY AT THE MOMENT
  if(!user) {
    req.flash('error', 'Password reset did not work')
    return res.redirect('/login')
  }
  res.render('reset', { title: 'Reset your password' })
}

exports.confirmedPasswords = async (req, res, next) => {
  if(req.body.password === req.body['password-confirm']) {
    next();
    return;
  }
  req.flash('error', 'Passwords do not match');
  res.redirect('back')
}

exports.update = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  })

  if(!user) {
    req.flash('error', 'Password reset did not work')
    return res.redirect('/login')
  }

  const setPassword = promisify(user.setPassword, user)
  await setPassword(req.body.password)
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updatedUser = await user.save();
  await req.login(updatedUser)
  req.flash('success', 'Your password has been reset! You are now logged in.');
  res.redirect('/')
}