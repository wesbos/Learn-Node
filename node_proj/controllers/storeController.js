const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req,res) => {
  res.render('index');
};

exports.addStore = (req,res) => {
  res.render('editStore',{title:'Add Store'});
};

exports.createStore = async (req,res) => {
  const store = await (new Store(req.body)).save();
  req.flash('success',`Successfully Created ${store.name}. Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);
};

exports.getStores =  async (req,res) => {
  //1. query the database for a list of all stores
  const stores = await (Store.find());
  // console.log(stores);
  res.render('stores',{title:'Stores',stores:stores});
};

exports.editStore = async (req,res) => {
  //find the store given the ID
  const store = await Store.findOne({ _id:req.params.id });
  //confirm they are the owner
  //TODO
  //render out hte edit form
  res.render('editStore',{title:`Edit ${store.name}`,store});
};

exports.updateStore = async (req,res) => {
  //find and update the store
  const store = await Store.findOneAndUpdate({_id:req.params.id},req.body,{
    new:true, //return new store instead of the old one
    runValidators:true, //force to adhere to the store model
  }).exec();
  req.flash('success',`Successfully updated <strong>${store.name}</strong>
  <a href="/stores/${store.slug}">View Store ->`);
  res.redirect(`/stores/${store._id}/edit`);
  //redirect them to the store, tell them it worked
}
