const mongoose = require('mongoose')
const { Schema } = mongoose

const FilmSchema = new Schema({
  title: String,
  pv: {
    type: Number,
    default: 1
  },
  comment: {
    type: Number,
    default: 0
  },
  rating: Object,
  abstract: String,
  year: String,
  images: Object,
  id: String,
  countries: Array,
  genres: [
    {
      name: String,
      source: {
        type: String,
        ref: 'Tag'
      }
    }
  ],
  casts: Array,
  original_title: String,
  summary: String,
  directors: Array,
  meta: {
    createdAt: {
      type: String
    },
    updatedAt: {
      type: String
    }
  }
})

const Film = mongoose.model('Film', FilmSchema)

module.exports = Film
