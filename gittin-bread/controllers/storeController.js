const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const User = mongoose.model('User');
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
  req.body.author = req.user._id;
  const store = await (new Store(req.body).save());
  await store.save()
  
  req.flash('success', `Successfully created ${store.name}. Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);
}

exports.getStores = async (req, res) => {
  //query db for all stores

  const page = req.params.page || 1;
  const limit = 4;
  const skip = page * limit - limit;
  const storesPromise = Store
    .find()
    .skip(skip)
    .limit(limit)
    .sort({ created: 'desc' })

  const countPromise = Store.count();
  const [stores, count] = await Promise.all([storesPromise, countPromise]);
  const pages = Math.ceil(count / limit);
  if(!stores.length && skip) {
    req.flash('info', `You asked for page ${page} but it doesn't exist! So you are now on page ${pages}`);
    res.redirect(`/stores/page/${pages}`);
    return;
  }
  res.render('stores', {title: 'Stores', stores, count, page, pages})
}

const confirmOwner = (store, user) => {
  if(!store.author.equals(user._id)) {
    throw Error('You must own a store to edit it')
  }
}
exports.editStore = async (req, res) => {
  // find store based on the pased in ID
  // confirm they are the owner of the store
  // render the edit form so user can update their store
  const store = await Store.findOne({_id: req.params.id});
  confirmOwner(store, req.user)
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
  const store = await Store.findOne({slug: req.params.slug}).populate('author reviews');
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

exports.searchStores = async (req, res) => {
  const stores = await Store.find({
    $text: {
      $search: req.query.q,
    }
  }, {
    score: { $meta: 'textScore' }
  }).sort({
    score: { $meta: 'textScore'}
  })
  //limit to only 5
  .limit(5)
  res.json(stores)
}

exports.mapStores = async (req, res) => {
  const coords = [req.query.lng, req.query.lat].map(parseFloat)
  const q = {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coords
        },
        $maxDistance: 10000 // meters
      }
    }
  }

  const stores = await Store.find(q).select('slug description location photo name').limit(10)
  res.json(stores)
}

exports.mapPage = async (req, res) => {
  res.render('map', {title: 'Map'})
}

exports.heartStore = async (req, res) => {
  const hearts = req.user.hearts.map(obj =>obj.toString());
  const operator = hearts.includes(req.params.id) ? '$pull': '$addToSet';
  const user = await User.findByIdAndUpdate(req.user._id, {
    [operator]: { hearts: req.params.id }
  }, { new: true })
  res.json(user)
}

exports.getHearts = async (req, res) => {
  const stores = await Store.find({
    _id: { $in: req.user.hearts } // this is looking up an id in an array, where ID is in the hearts array
  });
  res.render('stores', {title: 'Liked Stores', stores})
}

exports.getTopStores = async (req, res) => {
  const stores = await Store.getTopStores();
  res.render('topStores', { title: 'Top Stores', stores })
}