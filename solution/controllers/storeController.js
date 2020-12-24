const mongoose = require("mongoose");
const Store = mongoose.model("Store");
const User = mongoose.model("User");
const multer = require("multer");
const jimp = require("jimp");
const uuid = require("uuid");

const multerOptions = {
  store: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith("image/");
    if (isPhoto) {
      next(null, true);
      return;
    }
    next({ message: "That file type isn't allowed" }, false);
  },
};

exports.getStores = async (req, res) => {
  const { page } = req.params || 1;
  const limit = 4;
  const skip = (page - 1) * limit;
  // query db for all stores
  const getStoresPromise = Store.find()
    .skip(skip)
    .limit(limit)
    .sort({ created: -1 });
  const countPromise = Store.count({});
  const [stores, count] = await Promise.all([getStoresPromise, countPromise]);
  const pages = Math.ceil(count / limit);

  if (stores.length === 0 && skip) {
    req.flash(
      "info",
      `Hey! You asked for page ${page}. But that doesn't exist, so I put you on page ${pages}`
    );
    res.redirect(`/stores/page/${pages}`);
    return;
  }
  res.render("stores", { title: "Stores", stores, page, count, pages });
};

exports.homePage = (req, res) => {
  res.render("index");
};

exports.addStore = (req, res) => {
  res.render("editStore", { title: "Add store" });
};

exports.upload = multer(multerOptions).single("photo");
exports.resize = async (req, res, next) => {
  // check for images
  if (!req.file) {
    return next(); // skip to next middleware
  }
  console.log(req.file);
  const ext = req.file.mimetype.split("/")[1];
  req.body.photo = `${uuid.v4()}.${ext}`;
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  next();
};

exports.createStore = async (req, res) => {
  req.body.author = req.user._id;
  const store = new Store(req.body);
  const result = await store.save();
  req.flash(
    "success",
    `Successfully created ${result.name}. Care to leave a review`
  );
  res.redirect(`/stores/${result.slug}`);
};

exports.updateStore = async (req, res) => {
  const { storeId } = req.params;
  const store = await Store.findById(storeId);
  Object.keys(req.body).forEach((key) => {
    store[key] = req.body[key];
  });
  console.log("about to update", storeId);
  store.location.type = "Point";
  const result = await store.save();
  // const result = await Store.findOneAndUpdate({ _id: storeId }, req.body, {
  //   new: true, // return updated store
  //   runValidators: true,
  // }).exec();
  req.flash(
    "success",
    `Successfully updated <strong>${result.name}</strong>. <a href="/stores/${result.slug}">View store -></a>`
  );
  res.redirect(`/stores/${result.id}/edit`);
};

const confirmOwner = (store, user) => {
  if (!store.author || !store.author.equals(user._id)) {
    throw Error("You must own a store in order to edit it!");
  }
};
exports.editStore = async (req, res) => {
  const { storeId } = req.params;
  const store = await Store.findById(storeId);
  //! must be owner
  confirmOwner(store, req.user);
  res.render("editStore", { title: `Edit ${store.name}`, store });
};

exports.showStore = async (req, res, next) => {
  const store = await Store.findOne({ slug: req.params.slug }).populate(
    "author reviews"
  );
  if (!store) {
    return next();
  }
  res.render("showStore", { title: store.name, store });
};

exports.getStoresByTag = async (req, res) => {
  const tag = req.params.tag;
  const tagsPromise = Store.getTagsList();
  let filter = { tags: { $exists: true } };
  if (tag) {
    filter.tags = tag;
  }
  const storesPromise = Store.find(filter);
  const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);
  res.render("tags", { tags, title: "Tags", tag: tag || null, stores });
};

exports.searchStores = async (req, res) => {
  const { q } = req.query;
  const stores = await Store.find(
    {
      $text: {
        $search: q,
      },
    },
    {
      score: {
        $meta: "textScore",
      },
    }
  )
    .sort({ score: { $meta: "textScore" } })
    .limit(5);
  res.json(stores);
};

exports.mapPage = (req, res) => {
  res.render("map", { title: "Map" });
};

exports.mapStores = async (req, res) => {
  const coords = [req.query.lng, req.query.lat].map(parseFloat);
  const q = {
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: coords,
        },
        $maxDistance: 10000, // 10km
      },
    },
  };
  const stores = await Store.find(q)
    .select("slug name description location photo")
    .limit(10);
  res.json(stores);
};

exports.heartStore = async (req, res) => {
  const hearts = req.user.hearts.map((obj) => obj.toString());
  const id = req.params.id;
  const operator = hearts.includes(id) ? "$pull" : "$addToSet";
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      [operator]: { hearts: id },
    },
    { new: true }
  );
  res.json(user);
};

exports.heartPage = async (req, res) => {
  const hearts = req.user.hearts || [];
  const stores = await Store.find({
    _id: { $in: hearts },
  });
  res.render("stores", { title: "Hearted Stores", stores });
};

exports.topStores = async (req, res) => {
  const stores = await Store.getTopStores();
  res.render("topStores", { stores, title: "⭐ Top Stores!" });
};
