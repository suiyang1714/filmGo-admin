const rp =  require('request-promise')
const cheerio =  require('cheerio')
const fs = require('fs')
const iconv = require('iconv-lite')
const request = require("request");
const proxyIP = require('../middleware/request')
const sleep = async time => await new Promise( resolve => {
    setTimeout( () => {
        return resolve(console.log(`等待${time}s`))
    }, time*1000)
} )

const proxy = ['180.76.188.115','180.76.138.181','180.76.239.106','180.76.166.103','180.76.181.205','180.76.234.215','180.76.106.163','180.76.184.179','180.76.244.38','180.76.113.79','180.76.169.176','180.76.169.122','180.76.106.208','180.76.178.83','180.76.147.196','180.76.112.206',
  '180.76.233.125','180.76.186.99','180.76.51.74','180.76.234.146','180.76.153.183','180.76.155.233','180.76.57.252','180.76.120.42','180.76.103.107','180.76.58.216','180.76.112.24','180.76.108.218','180.76.98.218','180.76.168.148','180.76.109.38','180.76.249.53',
  '180.76.59.173','180.76.145.181','180.76.99.7','180.76.59.64','180.76.51.56','180.76.57.82','180.76.233.53','180.76.156.144']
const proxyConfig = {
  port: "443",
  user: "martindu",
  password: "fy1812!!"
}

/*
* getComingMovie
*
* 根据 url 爬取电影的 poster、上映日期、片长、制作国家等信息
* */
const getComingMovie = async ({movieUri, restartCount = 0} = {}) => {
  const options = {
    method: 'GET',
    uri: movieUri.uri,
    encoding: "utf-8"
  }
  // 代理地址
  const random = Math.floor(Math.random() * proxy.length)
  console.log(`随机数为${random}`)
  options.proxy = `http://${proxyConfig.user}:${proxyConfig.password}@${proxy[random]}:${proxyConfig.port}`;

  // request 请求
  const movieMsg =  await new Promise( resolve => {
    request(options, async function (error, response, body) {
      let $
      try {
        if (error) throw error;
         $ = cheerio.load(body,{decodeEntities: false})
      } catch (e) {
        console.error(e);
      }
      if ($) {
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
          movieName: $('span[property="v:itemreviewed"]').text(),
          releaseDate: releaseDate,
          runtime: runtime,
          postPic: $('#mainpic img').attr('src'),
          id: uri.match(/\/subject\/(\S*)\//)[1],
          actorAddMsg: casts,
          like: movieUri.like
        }

        resolve(movie)
      } else {
        console.log(`《${movieUri.title}》电影爬取失败，重新爬取`)
        restartCount++
        const movie = await getComingMovie({movieUri: movieUri, restartCount: restartCount})
        console.log(`电影 《${movie.movieName}》 重新爬取成功`)
        resolve(movie)
      }
    })
  })
  return movieMsg
}
/*
* runMovieDetail
*
* 爬取豆瓣即将上映电影的poster、上映日期、片长、制作国家等信息
* */
const runMovieDetail = async ({restartCount = 0} = {}) => {
  let $
  let comingMoviesLink = []
  let comingMovies = []

  const options = {
      uri: 'https://movie.douban.com/coming',
      transform: body => cheerio.load(body,{decodeEntities: false})
  }

  try {
    $ = await rp(options)
  } catch (e) {
    console.log(`爬取 https://movie.douban.com/coming 网站失败，准备重新开始爬取 = 。=\\n具体错误信息${e}`)
    /*
    *  需要限制重启次数，目前只能重启 4 次
    *  超过 4 次将发送邮件通知
    * */
    restartCount++
    if (restartCount <5) {
      console.log(`目前重启次数为${restartCount}`)
      runMovieDetail(restartCount)
    } else {
      console.log(`目前重启次数为${restartCount}, 重复次数过多，不可抗拒因素，将发起邮件通知`)
    }
  }

  $('.article tbody tr').each(function (index) {
      comingMoviesLink.push({
        url: $(this).find("a").attr('href'),
        title: $(this).find("a").html().trim(),
        like: $(this).find("td").eq(4).html().trim().match(/^[0-9]*/)[0]
      })
  })

  // 更新当前新电影列表 url 到本地
  fs.writeFileSync('./comingMovieUri.json', JSON.stringify(comingMoviesLink, null, 2), 'utf8')

  // 爬取豆瓣即将上映电影的poster、上映日期、片长
  for(let i = 0; i < comingMoviesLink.length; i++) {
    const movie = await getComingMovie({movieUri: comingMoviesLink[i]})
    comingMovies.push(movie)
    console.log(`这是第${i+1}个电影，《${movie.movieName}》`)

    await sleep(2) // 间歇 2s

    // 更新即将上映电影的 poster、上映日期、片长 到本地
    fs.writeFileSync('./comingMovie.json', JSON.stringify(comingMovies, null, 2), 'utf8')
  }
}


/* 电影预告片列表->预告片的详细uil、封面 */
const getMovieTrailer = async (uri) => {
  const options = {
    method: 'GET',
    uri: `${uri}trailer`,
    encoding: "utf-8"
  }
  // 代理地址
  const random = Math.floor(Math.random() * proxy.length)
  console.log(`随机数为${random}`)
  options.proxy = `http://${proxyConfig.user}:${proxyConfig.password}@${proxy[random]}:${proxyConfig.port}`;
  // request 请求
  const movieMsg = await new Promise( resolve => {
    request(options, async function (error, response, body) {
      let $
      try {
        if (error) throw error;
        $ = cheerio.load(body, {decodeEntities: false})

      } catch (e) {
        console.error(e);
      }

      if ($) {
        let trailerUri = []
        let trailerPoster = []
        $('.article a.pr-video').each(function () {
          trailerUri.push($(this).attr('href'))
          trailerPoster.push($(this).find('img').attr('src'))
        })
        const trailer = {
          movieName: $("#content>h1").text(),
          trailerUri: trailerUri,
          trailerPoster: trailerPoster,
          id: uri.match(/\/subject\/(\S*)\//)[1]
        }
        resolve(trailer)
      } else {
        console.log(`${uri} 电影预告片爬取失败，重新爬取`)
        const trailer = await getComingMovie(uri)
        console.log(`电影 《${movie.movieName}》 预告片重新爬取成功`)
        resolve(trailer)
      }
    })
  })
  return movieMsg
}
const runMovieTrailer = async () => {
  let comingMoviesLink = require('./comingMovieUri')
  let Trailer = []
  for(let i = 0; i < comingMoviesLink.length ; i++) {
    const trailer = await getMovieTrailer(comingMoviesLink[i])
    Trailer.push(trailer)
    console.log(`这是第${i+1}个电影的预告片列表, ${trailer.movieName}`)
    await sleep(1)
  }
  fs.writeFileSync('./comingMovieTrailer.json', JSON.stringify(Trailer, null, 2), 'utf8')
}

/* 电影预告详细信息获取->videolink、title、发布日期 */
const getMovieTrailerDetail = async (array) => {
  let trailerArray = await Promise.all(array.trailerUri.map(async item => {
    if (item.length !== 0) {
      const options = {
        method: 'GET',
        uri: `${item}`,
        encoding: "utf-8"
      }
      // 代理地址
      const random = Math.floor(Math.random() * proxy.length)
      console.log(`随机数为${random}`)
      options.proxy = `http://${proxyConfig.user}:${proxyConfig.password}@${proxy[random]}:${proxyConfig.port}`;

      // request 请求
      const movieMsg =  await new Promise( resolve => {
        request(options, async function (error, response, body) {
          let $
          try {
            if (error) throw error;
            $ = cheerio.load(body,{decodeEntities: false})

          } catch (e) {
            console.error(e);
          }

          if ($) {
            resolve({
              trailerMP4: $('#movie_player source').attr('src'),
              trailerTitle: $('h1').text(),
              trailerDate: $('.trailer-info>span').html()
            })
          } else {
            console.log(`${uri} 电影预告详细信息爬取失败，重新爬取`)
            const trailer = await getComingMovie(uri)
            console.log(`电影 《${trailer.trailerTitle}》 详细信息重新爬取成功`)
            resolve(trailer)
          }
        })
      })
      return movieMsg
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
    console.log(`这是第${i+1}个电影的预告详细信息, ${trailer.trailerTitle}`)
    await sleep(1)
    fs.writeFileSync('./comingMovieTrailerDetail.json', JSON.stringify(Trailer, null, 2), 'utf8')
  }
}
// runMovieTrailerDetail()

/* 获取电影的剧照、海报 */
const getMoviePhotos = async (uri) => {
  const options = {
    method: 'GET',
    uri: `${uri}/all_photos`,
    encoding: "utf-8"
  }
  // 代理地址
  const random = Math.floor(Math.random() * proxy.length)
  console.log(`随机数为${random}`)
  options.proxy = `http://${proxyConfig.user}:${proxyConfig.password}@${proxy[random]}:${proxyConfig.port}`;

  // request 请求
  const movieMsg =  await new Promise( resolve => {
    request(options, async function (error, response, body) {
      let $
      try {
        if (error) throw error;
        $ = cheerio.load(body,{decodeEntities: false})

      } catch (e) {
        console.error(e);
      }
      if ($) {
        let stagePhotos = []
        $('.article .pic-col5 li a').each(function () {
          stagePhotos.push($(this).find('img').attr('src'))
        })

        resolve({
          movieName: $("#content>h1").text(),
          stagePhotos: stagePhotos,
          id: uri.match(/\/subject\/(\S*)\//)[1]
        })
      } else {
        console.log(`${uri} 电影剧照爬取失败，重新爬取`)
        const trailer = await getComingMovie(uri)
        console.log(`电影 《${trailer.movieName}》 详细信息重新爬取成功`)
        resolve(trailer)
      }
    })
  })
  return movieMsg
}
const runMoviePhoto = async () => {
  let comingMoviesLink = require('./comingMovieUri')
  let stagePhotos = []
  for(let i = 0; i < comingMoviesLink.length ; i++) {
    const photo = await getMoviePhotos(comingMoviesLink[i])
    stagePhotos.push(photo)
    console.log(`这是第${i+1}个电影的剧照, ${photo.movieName}`)
    await sleep(1)
    fs.writeFileSync('./comingMovieStagePhotos.json', JSON.stringify(stagePhotos, null, 2), 'utf8')
  }
}
module.exports = { runMovieDetail, runMovieTrailer, runMovieTrailerDetail, runMoviePhoto }
