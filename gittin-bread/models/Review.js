const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const reviewSchema = new Schema({
  author: { // BIG LEARNING MOMENT JUST NOW. was sending an author as the 'user' here, but it needs to be user or change in the schema to be author
    type: Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  created: {
    type: Date,
    default: Date.now
  },
  store: {
    type: Schema.ObjectId,
    ref: 'Store',
    required: 'You must supply a store'
  },
  text: {
    type: String,
    required: 'You must leave a review',
  }
})

function autopopulate(next) {
  this.populate('author');
  next()
}

reviewSchema.pre('find', autopopulate);
reviewSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Review', reviewSchema);