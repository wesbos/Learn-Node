const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
const slug = require("slugs");
const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "Please enter a store name",
  },
  slug: String,
  description: {
    type: String,
    trim: true,
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  location: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: [
      {
        type: Number,
        required: "You must supply a coordinates!",
      },
    ],
    address: {
      type: String,
      required: "You must supply an address",
    },
  },
  photo: String
});

storeSchema.pre("save", function (next) {
  if (!this.isModified()) {
    next();
    return;
  }
  // TODO: make sure slug is unique
  this.slug = slug(this.name);
  this.updatedAt = Date.now();
  next();
});
module.exports = mongoose.model("Store", storeSchema);
