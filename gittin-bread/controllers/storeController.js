const mongoose = require('mongoose');
const Store = mongoose.model('Store');
exports.homePage = (req, res) => {
  res.render('index');
}

exports.addStore = (req, res) => {
  res.render('editStore', {title: 'Add Store'});
}

exports.createStore = async (req, res) => { 
  const store = await (new Store(req.body).save());
  await store.save()
  
  req.flash('success', `Successfully created ${store.name}. Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);
}

exports.getStores = async (req, res) => {
  //query db for all stores
  const stores = await Store.find();
  res.render('stores', {title: 'Stores', stores})
}

exports.editStore = async (req, res) => {
  // find store based on the pased in ID
  // confirm they are the owner of the store
  // render the edit form so user can update their store
  const store = await Store.findOne({_id: req.params.id});
  res.render('editStore', {title: `Edit ${store.name}`, store});
}

exports.updateStore = async (req, res) => {
  // find and update store
  // redirect user to store and tell them it worked

  const store = await Store.findOneAndUpdate({_id: req.params.id}, req.body, {
    new: true, //returns new store instead of old one
    runValidators: true,
  }).exec();
  req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store -> </a>`);
  res.redirect(`/stores/${store._id}/edit`)
}