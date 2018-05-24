const mongoose = require('mongoose')
const { Schema } = mongoose

const CategorySchema = new Schema({
  name: String,
  articleArray: [
    {
      type: String,
      ref: 'Article'
    }
  ],
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})
CategorySchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }

  next()
})

const Category = mongoose.model('Category', CategorySchema)

module.exports = Category
