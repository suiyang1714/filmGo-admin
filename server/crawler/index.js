const movieFile = require('./crawlerAPI')
const axios = require('axios')
const doubanAPI = 'http://api.douban.com/v2/movie/'

const sleep = async time => await new Promise( resolve => {
  setTimeout( () => {
    return resolve(console.log(`等待${time}s`))
  }, time*1000)
} )

const Film = require('../database/schema/flim')
const Genre = require('../database/schema/genre')

const fetchFilms = async () => {
  let films = await axios.get(`${doubanAPI}coming_soon?count=100`)

  for(let i = 0 ; i < films.data.subjects.length ; i++) {
    let filmData = await Film
      .findOne({id: films.data.subjects[i].id})
      .exec()
    if (!filmData) {
      const film = await axios.get(`${doubanAPI}subject/${films.data.subjects[i].id}`)
      const filmObject = film.data
      console.log(`第${i+1}个电影:"${film.data.title}"`)
      filmData = new Film({
        title: film.data.title,
        rating: film.data.rating,
        year: film.data.year,
        id: film.data.id,
        summary: film.data.summary,
        casts: film.data.casts,
        original_title: film.data.original_title,
        directors: film.data.directors,
        images: film.data.images,
        countries: film.data.countries,
        aka: film.aka
      })
      // 查询该标签：有 => 返回 tagId || 无 => 新建该标签，返回 tagId
      await Promise.all(film.data.genres.map(async (item, index) => {
        const genreId = await fetchGenre(item, filmData._id)
        filmData.genres[index] = {
          name: item,
          source: genreId
        }
        return genreId
      }))
      filmData.save()
      // await sleep(2)
    } else {
      console.log('该电影已存在')
    }
  }
}
// 查询类型方法
const fetchGenre = (genre, filmId) => {
  return new Promise(async resolve => {
    let genreMsg = await Genre
      .findOne({name: genre})
      .exec()

    if (!genreMsg) {
      genreMsg = await new Genre({
        name: genre
      })

      genreMsg.filmArray.push(filmId)
      await genreMsg.save()
      resolve(genreMsg._id)
    } else {
      if (genreMsg.filmArray.indexOf(filmId) === -1) {  // 检测该标签内是否含有该电影的 _id ,按道理说这一步是多余的，先保留看看。
        genreMsg.filmArray.push(filmId)
        await genreMsg.save()
      }
      resolve(genreMsg._id)
    }
  })
}

// 读取本地爬取电影详细信息添加到数据空中
const crawlerDetail = async (ctx, next) => {
  const filmDetail = require('../../comingMovie.json')
  const filmTrailer = require('../../comingMovieTrailer.json')
  const filmTrailerDetail = require('../../comingMovieTrailerDetail.json')

  // 添加爬取的上映日期、播放时长、电影封面
  await Promise((resolve, reject) => {
    filmDetail.forEach(async (item) => {
      const film = await Film
        .findOne({id: item.id})
        .exec()
      if (film) {
        film.releaseDate = item.releaseDate
        film.runtime = item.runtime
        film.postPic = item.postPic
        item.actorAddMsg.forEach(itemI => {
          film.casts.forEach(itemV => {
            if (itemI.id === itemV.id) {
              itemV.avatars = itemI.actorImg
            }
          })
        })
        film.save()
      }
    })

    return resolve()
  })
  // 添加爬取的预告片封面
  await Promise((resolve, reject) => {
    filmTrailer.forEach(async (item) => {
      const film = await Film
        .findOne({id: item.id})
        .exec()
      if (film) {
        // film.trailerUri = item.trailerUri
        film.trailerPoster = item.trailerPoster
        film.save()
      }
    })

    return resolve()
  })
  await Promise((resolve, reject) => {
    filmTrailerDetail.forEach(async (item) => {
      const film = await Film
        .findOne({id: item.id})
        .exec()
      if (film) {
        film.trailerArray = item.trailerArray
        film.save()
      }
    })

    return resolve()
  })
}
/* 定时更新内容 */
const updateMovie = async () => {
  // await movieFile.runMovieDetail()
  // await movieFile.runMovieTrailer()
  // await sleep(600000)
  // await movieFile.runMovieTrailerDetail()
  // await movieFile.runMoviePhoto()
  // await fetchFilms()
  // await crawlerDetail()
}
updateMovie()
