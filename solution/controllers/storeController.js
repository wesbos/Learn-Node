const mongoose = require("mongoose");
const Store = mongoose.model("Store");

exports.getStores = async (req, res) => {
  // query db for all stores
  const stores = await Store.find();
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
    `Successfully created ${result.name}. Care to leave a review`
  );
  res.redirect(`/store/${result.slug}`);
};

exports.updateStore = async (req, res) => {
  const { storeId } = req.params;
  console.log("about to update", storeId);
  const result = await Store.findOneAndUpdate({ _id: storeId }, req.body, {
    new: true, // return updated store
    runValidators: true,
  }).exec();
  req.flash(
    "success",
    `Successfully updated <strong>${result.name}</strong>. <a href="/store/${result.slug}">View store -></a>`
  );
  res.redirect(`/stores/${result.id}/edit`);
};

exports.editStore = async (req, res) => {
  const { storeId } = req.params;
  const store = await Store.findById(storeId);
  // todo confirm rights to edit store
  res.render("editStore", { title: `Edit ${store.name}`, store });
};
