const rp =  require('request-promise')
const cheerio =  require('cheerio')
const fs = require('fs')
const sleep = async time => await new Promise( resolve => {
    setTimeout( () => {
        return resolve(console.log(`等待${time}s`))
    }, time*1000)
} )

const getComingMovie = async (uri) => {
    const options = {
        uri: uri,
        transform: body => cheerio.load(body,{decodeEntities: false})
    }

    const $ = await rp(options)
    let releaseDate = []
    $('#info span[property="v:initialReleaseDate"]').each(function () {
        releaseDate.push($(this).html())
    })
    let runtime = []
    $('#info span[property="v:runtime"]').each(function () {
        runtime.push($(this).html())
    })
    let casts = []
    $('.celebrities-list .celebrity').each(function () {
      const actor = $(this).find('.avatar').attr('style')
      const id = $(this).find('a').attr('href')
      if (actor) {
        casts.push({
          actorImg: actor.match(/background-image: url\((\S*)\)/)[1],
          id: id.match(/\/celebrity\/(\S*)\//)[1]
        })
      }
    })

    const movie = {
        releaseDate: releaseDate,
        runtime: runtime,
        postPic: $('#mainpic img').attr('src'),
        id: uri.match(/\/subject\/(\S*)\//)[1],
        actorAddMsg: casts
    }
    return movie
}
// 爬取豆瓣即将上映电影的poster、上映日期、片长
const runMovieDetail = async () => {
    const options = {
        uri: 'https://movie.douban.com/coming',
        transform: body => cheerio.load(body,{decodeEntities: false})
    }

    const $ = await rp(options)

    let comingMoviesLink = []
    let comingMovies = []
    $('.article tbody tr a').each(function (index) {
        comingMoviesLink.push($(this).attr('href'))
    })
    for(let i = 0; i < comingMoviesLink.length; i++) {
        const movie = await getComingMovie(comingMoviesLink[i])
        comingMovies.push(movie)
        console.log(`这是第${i+1}个电影，它的基本信息是${movie}`)
        await sleep(1)
    }
    fs.writeFileSync('./comingMovieUri.json', JSON.stringify(comingMoviesLink, null, 2), 'utf8')
    fs.writeFileSync('./comingMovie.json', JSON.stringify(comingMovies, null, 2), 'utf8')
}
// runMovieDetail()

/* 电影预告片列表->预告片的详细uil、封面 */
const getMovieTrailer = async (uri) => {
  const options = {
    uri: `${uri}/trailer`,
    transform: body => cheerio.load(body,{decodeEntities: false})
  }

  const $ = await rp(options)
  let trailerUri = []
  let trailerPoster = []
  $('.article a.pr-video').each(function () {
    trailerUri.push($(this).attr('href'))
    trailerPoster.push($(this).find('img').attr('src'))
  })
  const trailer = {
    trailerUri: trailerUri,
    trailerPoster: trailerPoster,
    id: uri.match(/\/subject\/(\S*)\//)[1]
  }
  return trailer
}
const runMovieTrailer = async () => {
  let comingMoviesLink = require('./comingMovieUri')
  let Trailer = []
  for(let i = 0; i < comingMoviesLink.length ; i++) {
    const trailer = await getMovieTrailer(comingMoviesLink[i])
    Trailer.push(trailer)
    console.log(`这是第${i+1}个电影的预告片`)
    await sleep(1)
  }
  fs.writeFileSync('./comingMovieTrailer.json', JSON.stringify(Trailer, null, 2), 'utf8')
}
// runMovieTrailer()
/* 电影预告详细信息获取->videolink、title、发布日期 */
const getMovieTrailerDetail = async (array) => {
  let trailerArray = await Promise.all(array.trailerUri.map(async item => {
    if (item.length !== 0) {
      const options = {
        uri: `${item}`,
        transform: body => cheerio.load(body,{decodeEntities: false})
      }
      const $ = await rp(options)
      return {
        trailerMP4: $('#movie_player source').attr('src'),
        trailerTitle: $('h1').text(),
        trailerDate: $('.trailer-info>span').html()
      }
    }
  }))
  return {
    trailerArray,
    id: array.id
  }
}
const runMovieTrailerDetail = async () => {
  let comingTrailerLink = require('./comingMovieTrailer')
  let Trailer = []
  for(let i = 0; i < comingTrailerLink.length ; i++) {
    const trailer = await getMovieTrailerDetail(comingTrailerLink[i])
    Trailer.push(trailer)
    console.log(`这是第${i+1}个电影的预告片`)
    await sleep(1)
  }
  fs.writeFileSync('./comingMovieTrailerDetail.json', JSON.stringify(Trailer, null, 2), 'utf8')
}
// runMovieTrailerDetail()

/* 获取电影的剧照、海报 */
const getMoviePhotos = async (uri) => {
  const options = {
    uri: `${uri}/all_photos`,
    transform: body => cheerio.load(body,{decodeEntities: false})
  }

  const $ = await rp(options)
  let stagePhotos = []
  $('.article .pic-col5 li a').each(function () {
    stagePhotos.push($(this).find('img').attr('src'))
  })
  const trailer = {
    stagePhotos: stagePhotos,
    id: uri.match(/\/subject\/(\S*)\//)[1]
  }
  return trailer
}
const runMoviePhoto = async () => {
  let comingMoviesLink = require('./comingMovieUri')
  let stagePhotos = []
  for(let i = 0; i < comingMoviesLink.length ; i++) {
    const photo = await getMoviePhotos(comingMoviesLink[i])
    stagePhotos.push(photo)
    console.log(`这是第${i+1}个电影的剧照`)
    await sleep(20)
  }
  fs.writeFileSync('./comingMovieStagePhotos.json', JSON.stringify(stagePhotos, null, 2), 'utf8')
}
module.exports = { runMovieDetail, runMovieTrailer, runMovieTrailerDetail, runMoviePhoto }
