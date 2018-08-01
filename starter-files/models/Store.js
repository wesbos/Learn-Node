const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const slug = require('slugs')

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Xin vui lòng cung cấp tên'
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [{
      type: Number,
      required: 'Xin vui lòng cung cấp tọa độ'
    }],
    address: {
      type: String,
      required: 'Xin vui lòng cung cấp địa chỉ'
    }
  },
  photo: String
})

storeSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.updated = Date.now()
    next()
    return
  }
  this.slug = slug(this.name)
  next()
})

module.exports = mongoose.model('Store', storeSchema)