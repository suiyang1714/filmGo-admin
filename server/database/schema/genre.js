const mongoose = require('mongoose')
const { Schema } = mongoose

const GenreSchema = new Schema({
  name: String,
  filmArray: [
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
GenreSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }

  next()
})

const Genre = mongoose.model('Genre', GenreSchema)

module.exports = Genre
