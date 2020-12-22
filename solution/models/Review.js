const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const reviewSchema = new Schema({
  created: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: Schema.ObjectId,
    ref: "User",
    required: "You must supply an author",
  },
  store: {
    type: Schema.ObjectId,
    ref: "User",
    required: "You must supply a store",
  },
  text: {
    type: String,
    required: "Your review must have a text",
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
});

module.exports = mongoose.model("Review", reviewSchema);
