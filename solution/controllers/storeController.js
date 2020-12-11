const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  store: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
      return;
    }
    next({message: 'That file type isn\'t allowed'}, false);
  }
};

exports.getStores = async (req, res) => {
  // query db for all stores
  const stores = await Store.find();
  res.render('stores', {title: 'Stores', stores});
};

exports.homePage = (req, res) => {
  res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', {title: 'Add store'});
};

exports.upload = multer(multerOptions).single('photo');
exports.resize = async (req, res, next) => {
  // check for images
  if (!req.file) {
    return next(); // skip to next middleware
  }
  console.log(req.file);
  const ext = req.file.mimetype.split('/')[1];
  req.body.photo = `${ uuid.v4() }.${ ext }`;
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${ req.body.photo }`);
  next();
};

exports.createStore = async (req, res) => {
  const store = new Store(req.body);
  const result = await store.save();
  req.flash(
    'success',
    `Successfully created ${ result.name }. Care to leave a review`
  );
  res.redirect(`/stores/${ result.slug }`);
};

exports.updateStore = async (req, res) => {
  const {storeId} = req.params;
  const store = await Store.findById(storeId);
  Object.keys(req.body).forEach(key => {
    store[key] = req.body[key];
  });
  console.log('about to update', storeId);
  store.location.type = 'Point';
  const result = await store.save();
  // const result = await Store.findOneAndUpdate({ _id: storeId }, req.body, {
  //   new: true, // return updated store
  //   runValidators: true,
  // }).exec();
  req.flash(
    'success',
    `Successfully updated <strong>${ result.name }</strong>. <a href="/stores/${ result.slug }">View store -></a>`
  );
  res.redirect(`/stores/${ result.id }/edit`);
};

exports.editStore = async (req, res) => {
  const {storeId} = req.params;
  const store = await Store.findById(storeId);
  // todo confirm rights to edit store
  res.render('editStore', {title: `Edit ${ store.name }`, store});
};

exports.showStore = async (req, res, next) => {
  const store = await Store.findOne({slug: req.params.slug});
  if (!store) {
    return next();
  }
  res.render('showStore', {title: store.name, store});
};

exports.getStoresByTag = async (req, res) => {
  const tag = req.params.tag;
  const tagsPromise = Store.getTagsList();
  let filter = {tags: {$exists: true}};
  if (tag) {
    filter.tags = tag;
  }
  const storesPromise = Store.find(filter);
  const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);
  res.render('tags', {tags, title: 'Tags', tag: tag || null, stores});
};
