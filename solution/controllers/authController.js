const passport = require("passport");

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
    next(); // logged in
  }

  req.flash("error", "You must be logged in.");
  res.redirect("/login");
};
