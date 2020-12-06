const mongoose = require("mongoose");
const Store = mongoose.model("Store");

exports.getStores = async (req, res) => {
  // query db for all stores
  const stores = await Store.find();
  console.log(stores);
  res.render("stores", { title: "Stores", stores });
};

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
