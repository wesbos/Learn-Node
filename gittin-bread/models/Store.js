const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name',
  },
  slug: String,
  description: {
    type: String,
    trim: true,
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: [{
      type: Number,
      required: 'You must supply coordinates'
    }],
    address: {
      type: String,
      require: 'You must supply an address',
    }
  },
  photo: String,
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author'
  }
}, { /*  THIS IS FOR ADDING THE VIRTUAL SCHEMA PROPERTIES TO THE ACTUAL SHAPE OF THE DATA, CAN BE SEEN BY pre= h.dump(<data>) */
  toJSON: { virtuals: true },
  toObject: {virtuals: true } 
});

//define indexes
storeSchema.index({
  name: 'text',
  description: 'text'
})

storeSchema.index({location: '2dsphere'})

storeSchema.pre('save', async function(next) {
  if(!this.isModified('name')) {
    next(); //skips
    return; //stops function
  }
  this.slug = slug(this.name);
  //find other stores that have a slug of similar names
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const storesWithSlug = await this.constructor.find({slug: slugRegEx});
  if(storesWithSlug.length) {
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`
  }
  next();
  //TODO: make more resilant tso slugs are unique
});

storeSchema.statics.getTagsList = function() {
  return this.aggregate([
    {$unwind: '$tags'},
    {$group: {_id: '$tags', count: {$sum: 1}}},
    {$sort: {count: -1}}
  ]);
}
  // find reviews where the store id === reviews store property
storeSchema.virtual('reviews', {
  ref: 'Review', // model to link
  localField: '_id', // field on the store 
  foreignField: 'store' //  field on the review
})
module.exports = mongoose.model('Store', storeSchema);