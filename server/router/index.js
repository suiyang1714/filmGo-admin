const router = require('koa-router')()

const Film = require('../database/schema/flim')
const Genre = require('../database/schema/genre')

router.get('/api/film/comingsoon', async (ctx, next) => {
  let films = await Film
    .find()
    .exec()
  ctx.body = {
    success: true,
    data: films
  }
})
router.get('/api/film/id', async (ctx, next) => {
  const id = ctx.query.id
  const film = await Film
    .findOne({id: id})
    .exec()
  ctx.body = {
    success: true,
    data: film

  }
})

module.exports = router
