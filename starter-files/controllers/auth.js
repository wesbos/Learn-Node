const mongoose = require('mongoose');

exports.login = async (req, res, next) => {

}

exports.register = async function(req, res) {
  const newUser = new User({
    email: req.body.email,
    name: req.body.name
  });

  newUser.setPassword(req.body.password);
  newUser.save();

  res.json({
    result: 'success',
    body: newUser
  });
}

exports.logout = async function(req, res) {
  if(req.isAuthenticated()) {
    req.logout();
  }
  res.redirect('/');
}