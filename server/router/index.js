const router = require('koa-router')()

const Film = require('../database/schema/flim')
const Genre = require('../database/schema/genre')

router.get('/api/film/comingsoon', async (ctx, next) => {
  try {
    let films = await Film
      .find()
      .exec()
    ctx.body = {
      success: true,
      data: films
    }
  } catch (e) {
    let errMsg = {
      localhost: ctx.url,
      errorMsg: e
    }

    ctx.error(10001, errMsg)
  }
})
router.get('/api/film/id', async (ctx, next) => {
  const id = ctx.query.id
  if (!id) {
    let errMsg = {
      localhost: ctx.url,
      errorMsg: `id为空`
    }
    ctx.error(10000, errMsg)
  }
  const film = await Film
    .findOne({id: id})
    .exec()
  ctx.body = {
    success: true,
    data: film
  }
})
router.get('/api/film/poster/id', async (ctx, next) => {
  const { filmId } = ctx.query
  if (!filmId) {
    let errMsg = {
      localhost: ctx.url,
      errorMsg: `filmId 为空`
    }
    ctx.error(10000, errMsg)
  }
  const film = await Film
    .findOne({id: filmId}, 'title releaseDate trailerArray like')
    .exec()

  ctx.body = {
    success: true,
    data: film
  }
})

module.exports = router
