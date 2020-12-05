const mongoose = require("mongoose");
const Store = mongoose.model("Store");
exports.homePage = (req, res) => {
  res.render("index");
};

exports.addStore = (req, res) => {
  res.render("editStore", { title: "Add store" });
};

exports.createStore = async (req, res) => {
  const store = new Store(req.body);
  const result = await store.save();
  req.flash(
    "success",
    `Successfully created ${result.name}. Care to     leave a review`
  );
  res.redirect(`/store/${result.slug}`);
};
