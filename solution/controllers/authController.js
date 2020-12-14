const passport = require("passport");
const mongoose = require("mongoose");
const crypto = require("crypto");
const promisify = require("es6-promisify");

const User = mongoose.model("User");
exports.loginUser = passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: "Failed login",
  successRedirect: "/",
  successFlash: "You are now logged in",
});

exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "You are now logged out! 👋");
  res.redirect("/");
};

exports.isLoggedIn = (req, res, next) => {
  // is authenticated
  if (req.isAuthenticated()) {
    return next(); // logged in
  }

  req.flash("error", "You must be logged in.");
  res.redirect("/login");
};

exports.forgot = async (req, res) => {
  // 1. check if user exists
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    req.flash("error", "No account for this email");
    return res.redirect("/login");
  }

  // 2. set reset token and expiration date
  user.passwordResetToken = crypto.randomBytes(20).toString("hex");
  // expire in 60 min (by 60 sec, by 1000 ms)
  user.passwordResetExpirationDate = Date.now() + 60 * 60 * 1000;
  await user.save();

  // 3. send email with link
  const resetUrl = `http://${req.headers.host}/account/reset/${user.passwordResetToken}`;
  // 4. redirect to /login
  req.flash(
    "success",
    `You have been emailed a password reset link. ${resetUrl}`
  );
  res.redirect("/login");
};

exports.reset = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpirationDate: { $gt: Date.now() },
  });

  if (!user) {
    req.flash("error", "Password token is invalid or expired");
    return res.redirect("/login");
  }
  // show pass reset form
  res.render("reset", { title: "Reset your password" });
};
exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body["password-confirm"]) {
    return next();
  }
  req.flash("error", "Passwords do not match.");
  res.redirect("back");
};

exports.update = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpirationDate: { $gt: Date.now() },
  });

  if (!user) {
    req.flash("error", "Password token is invalid or expired");
    return res.redirect("/login");
  }
  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);
  user.passwordResetToken = undefined;
  user.passwordResetExpirationDate = undefined;
  const updatedUser = await user.save();
  await req.login(updatedUser);

  req.flash(
    "success",
    "🕺 Nice! Your password has been reset! You are now logged in!"
  );
  res.redirect("/");
};
