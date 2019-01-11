const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    slug: String,
    description: {
        type: String,
        trim: true
    },
    tags: [ String ]
});

// sluggify the Store's name prior to anytime a Store is being saved, but only if the name has been changed
storeSchema.pre('save', function(next) {
    if (!this.isModified('name')) {
        next();
    } else {
        this.slug = slug(this.name)
        next();
        // TODO make more resilient so slugs are unique
    }
})

module.exports = mongoose.model('Store', storeSchema);