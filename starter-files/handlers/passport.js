const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local');
const User = mongoose.model('User');

passport.use(new LocalStrategy(
  {usernameField: 'email', session: false},
  async (email, password, done) => {
    try {
      const user = await User.findOne({email});
      if(!user) return done(null, false, { message: 'Sai tên người dùng hoặc mật khẩu.'});
      if(!user.validatePassword(password)) return done(null, false, {message: 'Sai mật khẩu.'});
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log('run deserializeUser');
  User.findById(id, function(err, user) {
    done(err, user);
  });
});