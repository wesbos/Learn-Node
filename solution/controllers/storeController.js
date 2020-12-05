const mongoose = require("mongoose");
const Store = mongoose.model("Store");
exports.homePage = (req, res) => {
  console.log(req.name);
  res.render("index");
};

exports.addStore = (req, res) => {
  res.render("editStore", { title: "Add store" });
};

exports.createStore = async (req, res) => {
  const store = new Store(req.body);
  const result = await store.save();
  res.redirect("/");
};
