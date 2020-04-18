const mongoose = require('mongoose');
const Store = mongoose.model('Store');
exports.homePage = (req, res) => {
  res.render('index');
}

exports.addStore = (req, res) => {
  res.render('editStore', {title: 'Add Store'});
}

exports.createStore = async (req, res) => { 
  const store = new Store(req.body);
  await store.save()
  console.log('worked')
  res.redirect('/');
}