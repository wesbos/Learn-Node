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
  tags: [String]
});

storeSchema.pre('save', function(next) {
  if(!this.isModified('name')) {
    next(); //skips
    return; //stops function
  }
  this.slug = slug(this.name);
  next();
  //TODO: make more resilant tso slugs are unique
});

module.exports = mongoose.model('Store', storeSchema);