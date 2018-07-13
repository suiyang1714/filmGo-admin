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
  abstract: String,
  year: String,
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
  aka: Array,
  casts: Array,
  original_title: String,
  summary: String,
  directors: Array,
  releaseDate: Array,
  runtime: String,
  postPic: String,
  trailerPoster: String,
  trailerArray: Array,
  like: String,
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
