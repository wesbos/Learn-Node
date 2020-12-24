const mongoose = require("mongoose");
const slug = require("slugs");

mongoose.Promise = global.Promise;
const storeSchema = new mongoose.Schema(
  {
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
    photo: String,
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: "You must supply an author",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

storeSchema.index({
  name: "text",
  description: "text",
});

storeSchema.index({ location: "2dsphere" });

storeSchema.pre("save", async function (next) {
  if (!this.isModified()) {
    next();
    return;
  }
  this.slug = slug(this.name);
  // find other stores that have similar string
  const slugRe = new RegExp(`^(${this.slug})(-\\d+)?$`, "i");
  const storesWithSlug = await this.constructor.find({ slug: slugRe });
  if (storesWithSlug.length) {
    // get last store slug
    const lastSlug = storesWithSlug.reduce((largestSlug, store) => {
      const incr = store.slug.split("-")[1];
      if (!incr || largestSlug > parseInt(incr)) {
        return largestSlug;
      }
      return parseInt(incr);
    }, 0);
    this.slug = `${this.slug}-${lastSlug + 1}`;
  }
  this.updatedAt = Date.now();
  next();
});

storeSchema.statics.getTagsList = function () {
  return this.aggregate([
    { $unwind: "$tags" },
    { $group: { _id: "$tags", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $sort: { _id: 1 } },
  ]);
};
storeSchema.statics.getTopStores = function () {
  return this.aggregate([
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "store",
        as: "reviews",
      },
    },
    { $match: { "reviews.1": { $exists: true } } },
    {
      $project: {
        photo: "$$ROOT.photo",
        name: "$$ROOT.name",
        reviews: "$$ROOT.reviews",
        slug: "$$ROOT.slug",
        averageRating: { $avg: "$reviews.rating" },
      },
    },
    { $sort: { averageRating: -1 } },
    { $limit: 10 },
  ]);
};

function autopopulate(next) {
  this.populate("reviews");
  next();
}

storeSchema.pre("find", autopopulate);
storeSchema.pre("findOne", autopopulate);

storeSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "store",
});
module.exports = mongoose.model("Store", storeSchema);
