const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const multerOptions = {
   storage: multer.memoryStorage(),
   fileFilter: (req, file, next) => {
     const isPhoto = file.mimetype.startsWith('image/');
     if(isPhoto) {
       next(null, true);
     } else {
       next({message: 'that filetype isn\'t allowed!'}, false);
     }
   }
};
const jimp = require('jimp');
const uuid = require('uuid');


exports.homePage = (request, response) => {
  response.render('index');
};

exports.addStore = (request, response) => {
  response.render('editStore', { title: 'Add Store' });
};

exports.upload = multer(multerOptions).single('photo');
exports.resize = async(req, res, next) => {
  // check if there is no new file to resize
  if (!req.file) {
    next(); // skip to next middleware
    return;
  }

  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  // now we resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  // once we have written photo to filesystem, keep going!
  next();
}

exports.createStore = async (request, response) => {
  const store = await (new Store(request.body)).save();
  request.flash('success', `Successfully created ${store.name}. Care to leave a review?`);
  // below will not execute until the function awaited completes with a successful promise
  response.redirect(`/store/${store.slug}`);
}

exports.getStores = async (request, response) => {
  // query database for list of store
  const stores = await Store.find();
  console.log(stores);
  response.render('stores', { title: 'Stores', stores });
}

// creates the view for editing a store
exports.editStore = async (request, response) => {
  // Find store given the ID
  const store = await Store.findOne({ _id: request.params.id })
  // Confirm they are owner of the store
  // Render out the edit form so the user can update their store
  response.render('editStore', { title: `Edit ${store.name}`, store });
  // response.render('editStore', { title: 'Edit Store' });
};

// receives a POST and updates a store on DB
exports.updateStore = async (request, response) => {
  // set location data to be a point
  request.body.location.type = 'Point';

  // find and update store
  const store = await Store.findOneAndUpdate({ _id: request.params.id }, request.body, {
    new: true, // return the new store instead of the old one
    runValidators: true // forces model to run validators
  }).exec();
  // redirect to store and flash a success
  request.flash('success', `Successfully update ${store.name}. <a href="/stores/${store.slug}">View store</a>`);
  // below will not execute until the function awaited completes with a successful promise
  response.redirect(`/stores/${store.slug}/edit`);
}

exports.getStoreBySlug = async (request, response, next) => {
  const store = await Store.findOne({ slug: request.params.slug });
  if(!store) {
    return next();
  }

  response.render('store', {store, title: store.name});
}

exports.getStoresbyTag = async(request, response) => {
  const tag = request.params.tag;
  const tagQuery = tag || { $exists: true };
  const tagsPromise = Store.getTagsList();
  const storesPromise = Store.find({ tags: tagQuery });
  const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);
  response.render('tag', { tags, tag, stores, title: 'Tags' });
}
