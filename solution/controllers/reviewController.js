const mongoose = require("mongoose");
const Review = mongoose.model("Review");

exports.addReview = async (req, res) => {
  const review = req.body;
  const author = req.user._id;
  const store = req.params.id;
  review.author = author;
  review.store = store;
  const newReview = new Review(review);
  await newReview.save();
  req.flash("success", "Review Saved!");
  res.redirect("back");
};
