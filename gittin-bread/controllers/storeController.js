const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if(isPhoto) {
      next(null, true);
    } else {
      next({message: 'That filetype is not allowed'}, false);
    }
  }
}

exports.homePage = (req, res) => {
  res.render('index');
}

exports.addStore = (req, res) => {
  res.render('editStore', {title: 'Add Store'});
}

exports.upload = multer(multerOptions).single('photo');
exports.resize = async (req, res, next) => {
  if(!req.file) {
    next();
    return; 
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;

  //resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  //once photo has been written to filesystem, move forward
  next();
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
  //set location data to be a point
  req.body.location.type = 'Point';

  // find and update store
  // redirect user to store and tell them it worked

  const store = await Store.findOneAndUpdate({_id: req.params.id}, req.body, {
    new: true, //returns new store instead of old one
    runValidators: true,
  }).exec();
  req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store -> </a>`);
  res.redirect(`/stores/${store._id}/edit`)
}

exports.getStoreBySlug = async (req, res, next) => {
  // res.json(req.params);
  const store = await Store.findOne({slug: req.params.slug});
  if(!store) return next();
  res.render('store', {store, title: store.name})
}

exports.getStoresByTag = async (req, res) => {
  const tag = req.params.tag;
  const tagQuery = tag || {$exists: true}
  const tagsPromise = Store.getTagsList();
  const storesPromise = Store.find({tags: tagQuery});
  const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);

  res.render('tag', {tags, title: 'Tags', tag, stores});
}