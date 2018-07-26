const movieFile = require('./crawlerAPI')
const axios = require('axios')
const doubanAPI = 'http://api.douban.com/v2/movie/'
const request = require('request')
const qiniuFn = require('../middleware/qiniu')
const nodemailer = require('../middleware/nodemail')

const proxy = ['180.76.188.115','180.76.138.181','180.76.239.106','180.76.166.103','180.76.181.205','180.76.234.215','180.76.106.163','180.76.184.179','180.76.244.38','180.76.113.79','180.76.169.176','180.76.169.122','180.76.106.208','180.76.178.83','180.76.147.196','180.76.112.206',
  '180.76.233.125','180.76.186.99','180.76.51.74','180.76.234.146','180.76.153.183','180.76.155.233','180.76.57.252','180.76.120.42','180.76.103.107','180.76.58.216','180.76.112.24','180.76.108.218','180.76.98.218','180.76.168.148','180.76.109.38','180.76.249.53',
  '180.76.59.173','180.76.145.181','180.76.99.7','180.76.59.64','180.76.51.56','180.76.57.82','180.76.233.53','180.76.156.144']
const proxyConfig = {
  port: "443",
  user: "martindu",
  password: "fy1812!!"
}

const sleep = async time => await new Promise( resolve => {
  setTimeout( () => {
    return resolve(console.log(`等待${time}s`))
  }, time*1000)
} )

const Film = require('../database/schema/flim')
const Genre = require('../database/schema/genre')

const fetchSingleFilm = async (filmId) => {
  const options = {
    method: 'GET',
    uri: `${doubanAPI}subject/${filmId}`
  }
  // 代理地址
  const random = Math.floor(Math.random() * proxy.length)
  // console.log(`随机数为${random}`)
  options.proxy = `http://${proxyConfig.user}:${proxyConfig.password}@${proxy[random]}:${proxyConfig.port}`;

  // const film = request(options)
  const film = await new Promise(resolve => {
    request(options, (error, response, body) => {
      try {
        if (error) throw error

        resolve(JSON.parse(body))
      } catch (e) {
        console.log(`单个电影 API 请求失败，准备重新请求ing`)
        fetchSingleFilm(filmId)
        // console.log(e)
        nodemailer(e)
      }
    })
  })

  return film
}

const fetchFilms = async () => {
  let films
  try {
    const options = {
      method: 'GET',
      uri: `${doubanAPI}coming_soon?count=100`
      // uri: `${doubanAPI}coming_soon?count=5`
    }
    // 代理地址
    const random = Math.floor(Math.random() * proxy.length)
    // console.log(`随机数为${random}`)
    options.proxy = `http://${proxyConfig.user}:${proxyConfig.password}@${proxy[random]}:${proxyConfig.port}`;

    films = await new Promise(resolve => {
      request(options, (error, response, body) => {
        console.log(body)
        resolve(JSON.parse(body))
      })
    })
  } catch (e) {
    console.log(`即将上映电影列表API，请求失败，准备重新请求ing`)
    fetchFilms()
    // console.log(e)
    nodemailer(e)
  }

  for(let i = 0 ; i < films.subjects.length ; i++) {
    let filmData = await Film
      .findOne({id: films.subjects[i].id})
      .exec()
    if (!filmData) {
      // 请求电影信息
      const film = await fetchSingleFilm(films.subjects[i].id)

      const filmObject = film
      console.log(`第${i+1}个电影:"${film.title}"`)
      filmData = new Film({
        title: filmObject.title,
        rating: filmObject.rating,
        year: filmObject.year,
        id: filmObject.id,
        summary: filmObject.summary,
        casts: filmObject.casts,
        original_title: filmObject.original_title,
        directors: filmObject.directors,
        images: filmObject.images,
        countries: filmObject.countries,
        aka: filmObject.aka
      })

      // 查询该标签：有 => 返回 tagId || 无 => 新建该标签，返回 tagId
      await Promise.all(film.genres.map(async (item, index) => {
        const genreId = await fetchGenre(item, filmData._id)
        filmData.genres[index] = {
          name: item,
          source: genreId
        }
        return genreId
      }))
      await filmData.save()
      await sleep(2) // 间歇 2s

    } else {
      // 请求电影信息
      const film = await fetchSingleFilm(films.subjects[i].id)

      const filmObject = film

      filmData.title = filmObject.title
      filmData.rating = filmObject.rating
      filmData.year = filmObject.year
      filmData.id = filmObject.id
      filmData.summary = filmObject.summary
      filmData.casts = filmObject.casts,
      filmData.original_title = filmObject.original_title
      filmData.directors = filmObject.directors
      filmData.images = filmObject.images
      filmData.countries = filmObject.countries
      filmData.aka = filmObject.aka

      await filmData.save()
      console.log(`第${i+1}个电影:"${film.title}"更新完毕`)
      await sleep(2) // 间歇 2s
    }
  }
  console.log(`电影更新完毕`)
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
  const filmStagePhotos = require('../../comingMovieStagePhotos.json')
  const filmTrailerDetail = require('../../comingMovieTrailerDetail.json')

  // 添加爬取的上映日期、播放时长、电影封面
  await new Promise(async (resolve, reject) => {
    try {
      for(let i = 0 ; i < filmDetail.length ; i++) {
        let film = await Film
          .findOne({id: filmDetail[i].id})
          .exec()

        if (film) {
          film.releaseDate = filmDetail[i].releaseDate // 更新上时间
          film.runtime = filmDetail[i].runtime  // 更新电影时长
          film.postPic = filmDetail[i].movieName+'封面图'  // 更新电影poster
          if (!film.like) film.like = filmDetail[i].like
          // 更新导演、主演照片

          for(let j= 0 ; j < filmDetail[i].actorAddMsg.length ; j++) {
            for(let k= 0 ; k < film.directors.length ; k++) {
              if (film.directors[k].id === filmDetail[i].actorAddMsg[j].id) {
                let item = film.directors[k]
                item.avatars = filmDetail[i].actorAddMsg[j].id+'castImg.jpg'
                film.directors.splice(k, 1, item)
              }
            }
            for(let l= 0 ; l < film.casts.length ; l++) {
              if (film.casts[l].id === filmDetail[i].actorAddMsg[j].id) {
                let item = film.casts[l]
                item.avatars = filmDetail[i].actorAddMsg[j].id+'castImg.jpg'
                film.casts.splice(l, 1, item)
              }
            }
          }

          await film.save()
        }
      }
    } catch (e) {
      console.log(e)
      nodemailer(e)
    }
    console.log(`电影缺失上映日期、播放时长、电影封面信息补充完毕`)
    return resolve()
  })
  // 添加爬取的电影剧照
  await new Promise(async (resolve, reject) => {
    for(let i = 0 ; i < filmStagePhotos.length ; i++) {
      const film = await Film
        .findOne({id: filmStagePhotos[i].id})
        .exec()

      if (film) {
        for( let j = 0 ; j < filmStagePhotos[i].stagePhotos.length ; j++) {
          film.filmStagePhotos.push(`${filmStagePhotos[i].id}${j}stagePhotoImg.jpg`)
        }
        await film.save()
      }
    }

    console.log(`电影剧照补充完毕`)
    return resolve()
  })

  // 预告片详情
  await new Promise(async (resolve, reject) => {

    for(let i = 0 ; i < filmTrailerDetail.length ; i++) {
      const film = await Film
        .findOne({id: filmTrailerDetail[i].id})
        .exec()

      if (film) {
        try {
          for (let j = 0; j < filmTrailerDetail[i].trailerArray.length; j++) {
            film.trailerArray.push({
              trailerMP4: `${filmTrailerDetail[i].trailerArray[j].trailerId}视频`,
              trailerTitle: `${filmTrailerDetail[i].trailerArray[j].trailerTitle}`,
              trailerDate: `${filmTrailerDetail[i].trailerArray[j].trailerDate}`,
              trailerPoster: `${filmTrailerDetail[i].trailerArray[j].trailerId}封面图`,
              trailerId: filmTrailerDetail[i].trailerArray[j].trailerId
            })
          }
        } catch (e) {
          console.log(e)
          nodemailer(e)
        }
        await film.save()
      }
    }

    console.log(`电影预告片详情补充完毕`)
    return resolve()
  })
}

const uploadQiniuFile = async () => {
  const filmDetail = require('../../comingMovie.json')  // 电影封面、演职人员照片
  const filmStagePhotos = require('../../comingMovieStagePhotos.json') // 剧照
  const filmTrailerDetail = require('../../comingMovieTrailerDetail.json') // 预告片

  for(let i = 0 ; i < filmDetail.length ; i++) {
    // 上传电影封面照
    qiniuFn.uploadQiniuFile(filmDetail[i].postPic, `${filmDetail[i].movieName}封面图`)
    for (let j = 0; j < filmDetail[i].actorAddMsg.length; j++) {
      // 上传电影主演照片
      qiniuFn.uploadQiniuFile(filmDetail[i].actorAddMsg[j].actorImg, `${filmDetail[i].actorAddMsg[j].id}castImg.jpg`)
    }
  }

  for(let i = 0 ; i < filmStagePhotos.length ; i++) {
    // 剧照
    try {
      for (let j = 0; j < filmStagePhotos[i].stagePhotos.length; j++) {
        await qiniuFn.uploadQiniuFile(filmStagePhotos[i].stagePhotos[j], `${filmStagePhotos[i].id}${j}stagePhotoImg.jpg`) // 缩略图
        await qiniuFn.uploadQiniuFile(filmStagePhotos[i].stagePhotos[j].replace(/sqxs/, 'l'), `${filmStagePhotos[i].id}${j}stagePhotoImgBig.jpg`) // 大图
      }
    } catch (e) {
      nodemailer(e)
      console.log(e)
    }
  }


  for(let i = 0 ; i < filmTrailerDetail.length ; i++) {
    try {
      for (let j = 0; j < filmTrailerDetail[i].trailerArray.length; j++) {
        await qiniuFn.uploadQiniuFile(filmTrailerDetail[i].trailerArray[j].trailerPoster, `${filmTrailerDetail[i].trailerArray[j].trailerId}封面图`)
        await qiniuFn.uploadQiniuFile(filmTrailerDetail[i].trailerArray[j].trailerMP4, `${filmTrailerDetail[i].trailerArray[j].trailerId}视频`)
      }
    } catch (e) {
      nodemailer(e)
      console.log(e)
    }
  }
}
/* 定时更新内容 */
const updateMovie = async () => {
  console.time("sort");
  // await movieFile.runMovieDetail()
  // await movieFile.runMovieTrailer()
  // await movieFile.runMovieTrailerDetail()
  // await movieFile.runMoviePhotos()
  await fetchFilms()
  await crawlerDetail()
  // await uploadQiniuFile()
  console.timeEnd("sort");
}
module.exports = updateMovie
