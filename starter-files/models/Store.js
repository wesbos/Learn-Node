const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const slug = require('slugs')
const {findSlugNumber} = require('../utilities')

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

storeSchema.pre('save', async function(next) {
  if (!this.isNew) {
    this.updated = Date.now()
    next()
    return
  }

  this.slug = slug(this.name)
  const slugReg = new RegExp(`^(${this.slug})((-[0-9])?)$`, 'i')
  const storeWithSlug = await this.constructor.find({slug: slugReg})

  if (storeWithSlug.length) {
    const slugNumbers = storeWithSlug.map((store) => {
      if (store.slug === this.slug) return 0
      return +store.slug.slice(store.slug.lastIndexOf('-') + 1)
    })

    this.slug += `-${findSlugNumber(slugNumbers)}`
    next()
    return
  }

  this.slug = slug(this.name)
  next()
})

storeSchema.statics.getTagsList = function() {
  return this.aggregate([
    { $unwind: '$tags'},
    { $group: { _id: '$tags', count: { $sum: 1 }}},
    { $sort: { count: -1 }}
  ])
}

module.exports = mongoose.model('Store', storeSchema)