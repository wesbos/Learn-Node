const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter: (req, file, next) => {
    const isPhoto = file.mimetype.startsWith('image/')
    if (isPhoto) {
      next(null, true)
    } else {
      next({message: 'That filetype isnt\' allowed!'}, false)
    }
  }
}

const upload = multer(multerOptions)

exports.homePage = (req, res) => {
  res.render('index')
}

exports.upload = upload.single('photo')

exports.resize = async (req, res, next) => {
  if (!req.file) {
    next()
    return
  }

  // Add photo to request to user next
  const extension = req.file.mimetype.split('/')[1]
  req.body.photo = `${uuid.v4()}.${extension}`

  // handle image, resize it and save to upload folder
  let photo = await jimp.read(req.file.buffer)
  photo.resize(500, jimp.AUTO)
  photo.write(`./public/uploads/${req.body.photo}`)

  next()
}

exports.addStore = (req, res) => {
  console.log(req.isAuthenticated());
  res.render('editStore', {title: 'Add Store'})
}

exports.createStore = async (req, res) => {
  const store = await (new Store(req.body)).save()

  // res.redirect(`/store/${store.slug}`)
  res.redirect('/')
}

exports.getStore = async (req, res, next) => {
  const {slug} = req.params
  const store = await Store.findOne({slug})

  if (!store) return next()

  res.render('store', {title: `${store.name}`, store})
}

exports.getStores = async (req, res) => {
  const stores = await Store.find();
  
  res.render('stores', {title: 'Stores', stores})
}

exports.editStore = async (req, res) => {
  const {slug} = req.params
  const store = await Store.findOne({slug})

  res.render('editStore', {title: `Edit Store ${store.name}`, store})
}

exports.updateStore = async (req, res, next) => {
  const {slug} = req.params
  const {name, description, tags, location, photo} = req.body
  let store = await Store.findOne({slug})

  if (!store) { // if no store was found
    next()
    return
  }

  Object.assign(store, {name, description, tags, location, photo})
  store.location.type = 'Point'
  await store.save()

  req.flash(
    'success', 
    `Successfully updated ${store.name}. <a href="/stores/${store.slug}">View store</a>`)
  res.redirect('/')
}

exports.getPostByTag = async (req, res, next) => {
  const currentTag = req.params.tag
  const tagsPromise = Store.getTagsList()
  const storesPromise = currentTag ? Store.find({tags: currentTag}) : Store.find()
  const [tags, stores] = await Promise.all([tagsPromise, storesPromise])
  res.render('tags', {tags, title: 'Tags', currentTag, stores})
}