const mongoose = require('mongoose');

exports.loginForm = (request, response) => {
  response.render('login', {title: 'Login'});
}
exports.registerForm = (request, response) => {
  response.render('register', {title: 'Register'});
}

exports.validateRegister = (request, response, next) => {
  request.sanitizeBody('name'); // comes from expressValidator package
  request.checkBody('name', 'You must supply a name').notEmpty();
  request.checkBody('email', 'That email is not valid!').isEmail();
  request.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  request.checkBody('password', 'Password cannot be blank!').notEmpty();
  request.checkBody('password-confirm', 'Confirmed password cannot be blank!').notEmpty();
  request.checkBody('password-confirm', 'Passwords much match!').equals(request.body.password);
  const errors = request.validationErrors();
  if (errors) {
    request.flash('error', errors.map(error => error.msg));
    response.render('register', {title: 'Register', body: request.body, flashes: request.flash() });
    return;
  }
  next();
};
