const rp =  require('request-promise')
const cheerio =  require('cheerio') // Node.js版本的jquery
const fs = require('fs')
// const iconv = require('iconv-lite') // 文件编码转换
const request = require("request")
// const proxyIP = require('../middleware/request')
const uuid = require('node-uuid')
const nodemailer = require('../middleware/nodemail')

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
* 1. 即将上映电影 url 爬取 runMovieDetail
* 2. 即将上映电影缺失信息爬取 getComingMovie
* 根据 url 爬取电影的 poster、上映日期、片长、制作国家等信息
* */
const getComingMovie = async ({movieUrl, restartCount = 0} = {}) => {
  const options = {
    method: 'GET',
    uri: movieUrl.url,
    encoding: "utf-8"
  }
  // 代理地址
  const random = Math.floor(Math.random() * proxy.length)
  // console.log(`随机数为${random}`)
  options.proxy = `http://${proxyConfig.user}:${proxyConfig.password}@${proxy[random]}:${proxyConfig.port}`;

  // request 请求
  const movieMsg =  await new Promise( resolve => {
    request(options, async function (error, response, body) {
      let $
      try {
        if (error) throw error;
         $ = cheerio.load(body,{decodeEntities: false})
      } catch (e) {
        nodemailer(e)
        console.log(`爬取《${movieUrl.title}》失败，准备重新开始爬取\n错误日志${e}\n重启次数为${restartCount}`)
        // console.error(e);
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
          id: movieUrl.url.match(/\/subject\/(\S*)\//)[1],
          actorAddMsg: casts,
          like: movieUrl.like
        }

        resolve(movie)
      } else {
        /*
        *  需要限制重启次数，目前只能重启 4 次
        *  超过 4 次将发送邮件通知
        * */
        restartCount++
        if (restartCount < 5) {
          await sleep(2) // 重新请求间歇 2s
          const movie = await getComingMovie({movieUrl: movieUrl, restartCount: restartCount})
          resolve(movie)
        } else {
          console.log(`目前重启次数为${restartCount}, 重复次数过多，不可抗拒因素，将发起邮件通知`)
          resolve(`爬取失败，重启次数为${restartCount}`)
        }
      }
    })
  })
  if (typeof movieMsg === "object") console.log(`电影 《${movieMsg.movieName}》 爬取成功`)
  return movieMsg
}
const runMovieDetail = async ({restartCount = 0} = {}) => {
  let $
  let comingMoviesLink = []
  let comingMovies = []

  const options = {
      uri: 'https://movie.douban.com/coming',
      transform: body => cheerio.load(body, {decodeEntities: false})
  }

  $ = await rp(options)
  try {
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
    return
  }

  $('.article tbody tr').each(function (index) {
    comingMoviesLink.push({
      url: $(this).find("a").attr('href'),
      title: $(this).find("a").html().trim(),
      like: $(this).find("td").eq(4).html().trim().match(/^[0-9]*/)[0]
    })
  })

  console.log(`总共爬取了 ${comingMoviesLink.length} 个电影 url`)
  // 更新当前新电影列表 url 到本地
  fs.writeFileSync('./comingMovieUri.json', JSON.stringify(comingMoviesLink, null, 2), 'utf8')

  // 爬取豆瓣即将上映电影的poster、上映日期、片长
  for(let i = 0; i < comingMoviesLink.length; i++) {
  // for(let i = 0; i < 5; i++) {
    const movie = await getComingMovie({movieUrl: comingMoviesLink[i]})
    comingMovies.push(movie)
    console.log(`这是第${i+1}个电影，《${movie.movieName}》`)

    // 更新即将上映电影的 poster、上映日期、片长 到本地
    fs.writeFileSync('./comingMovie.json', JSON.stringify(comingMovies, null, 2), 'utf8')

    await sleep(2) // 间歇 2s
  }

  console.log(`电影基本信息全部爬取成功, 共计${comingMoviesLink.length}`)
}

/*
* 1.电影预告片列表 runMovieTrailer()
* 2.预告片的详细uil、封面 getMovieTrailer()
* */
const getMovieTrailer = async ({movieUrl, restartCount = 0} = {}) => {
  const options = {
    method: 'GET',
    uri: `${movieUrl.url}trailer`,
    encoding: "utf-8"
  }

  // 代理地址
  const random = Math.floor(Math.random() * proxy.length)
  // console.log(`随机数为${random}`)
  options.proxy = `http://${proxyConfig.user}:${proxyConfig.password}@${proxy[random]}:${proxyConfig.port}`

  // request 请求
  const movieMsg = await new Promise( resolve => {
    request(options, async function (error, response, body) {
      let $
      try {
        if (error) throw error;
        $ = cheerio.load(body, {decodeEntities: false})

      } catch (e) {
        nodemailer(e)
        console.log(`爬取《${movieUrl.title}》失败，准备重新开始爬取\n错误日志${e}\n重启次数为${restartCount}`)
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
          id: movieUrl.url.match(/\/subject\/(\S*)\//)[1]
        }
        resolve(trailer)
      } else {
        /*
        *  需要限制重启次数，目前只能重启 4 次
        *  超过 4 次将发送邮件通知
        * */
        restartCount++
        if (restartCount < 5) {
          await sleep(2) // 重新请求间歇 2s
          const trailer = await getMovieTrailer({movieUrl: movieUrl, restartCount: restartCount})
          resolve(trailer)
        } else {
          console.log(`目前重启次数为${restartCount}, 重复次数过多，不可抗拒因素，将发起邮件通知`)
          resolve(`爬取失败，重启次数为${restartCount}`)
        }
      }
    })
  })
  if (typeof movieMsg === "object") console.log(`电影 《${movieMsg.movieName}》 爬取成功`)
  return movieMsg
}
const runMovieTrailer = async () => {
  let comingMoviesLink = require('../../comingMovieUri') // 全部电影的 url
  let Trailer = []
  console.log(comingMoviesLink.length)
  for(let i = 0; i < comingMoviesLink.length ; i++) {
    const trailer = await getMovieTrailer({movieUrl: comingMoviesLink[i]})
    Trailer.push(trailer)
    console.log(`这是第${i+1}个电影的预告片列表, ${trailer.movieName}`)

    fs.writeFileSync('./comingMovieTrailer.json', JSON.stringify(Trailer, null, 2), 'utf8')
    await sleep(2) // 间歇 2s
  }
  console.log(`电影预告片列表全部爬取成功, 共计${comingMoviesLink.length}`)
}

/*
* 1.电影预告详细信息获取 runMovieTrailerDetail
* 2.videolink、title、发布日期 getMovieTrailerDetail
* 3.请求失败重新请求 toRequest
* */
const toRequest = async ({trailerUrl, trailerPoster, restartCount = 1} = {}) => {
  const options = {
    method: 'GET',
    uri: `${trailerUrl}`,
    encoding: "utf-8"
  }
  // 代理地址
  const random = Math.floor(Math.random() * proxy.length)
  // console.log(`随机数为${random}`)
  options.proxy = `http://${proxyConfig.user}:${proxyConfig.password}@${proxy[random]}:${proxyConfig.port}`;

  // request 请求
  const movieMsg =  await new Promise( resolve => {
    request(options, async function (error, response, body) {
      let $
      try {
        $ = cheerio.load(body,{decodeEntities: false})

      } catch (e) {
        nodemailer(e)
        console.log(`爬取《${trailerUrl}》失败，准备重新开始爬取\n错误日志${e}\n重启次数为${restartCount}`)
        // console.error(e);
      }

      if ($) {
        console.log(`电影 《${trailerUrl}》 重新爬取成功,重启次数为${restartCount}`)

        resolve({
          trailerMP4: $('#movie_player source').attr('src'),
          trailerTitle: $('h1').text(),
          trailerDate: $('.trailer-info>span').html(),
          trailerPoster: trailerPoster,
          trailerId: uuid.v1().replace(/-/g, "")
        })
      } else {
        /*
        *  需要限制重启次数，目前只能重启 4 次
        *  超过 4 次将发送邮件通知
        * */
        restartCount++
        if (restartCount < 5) {
          await sleep(2) // 重新请求间歇 2s
          const trailer = await toRequest({trailerUrl: trailerUrl, restartCount: restartCount})
          resolve(trailer)
        } else {
          console.log(`目前重启次数为${restartCount-1}, 重复次数过多，不可抗拒因素，将发起邮件通知`)
          resolve(`爬取失败，重启次数为${restartCount}`)
        }
      }
    })
  })
  if (typeof movieMsg === "object") console.log(`电影 《${trailerUrl}》 重新爬取成功,重启次数为${restartCount}。`)
  return movieMsg
}

const getMovieTrailerDetail = async (trailer) => {
  // 判断有无预告片
  let trailerArray = []
  if(trailer.length !== 0) {
    trailerArray = await Promise.all(trailer.trailerUri.map(async (item, index) => {
      const options = {
        method: 'GET',
        uri: `${item}`,
        encoding: "utf-8"
      }
      // 代理地址
      const random = Math.floor(Math.random() * proxy.length)
      // console.log(`随机数为${random}`)
      options.proxy = `http://${proxyConfig.user}:${proxyConfig.password}@${proxy[random]}:${proxyConfig.port}`;

      // request 请求
      const movieMsg =  await new Promise( resolve => {
        request(options, async function (error, response, body) {
          let $
          try {
            $ = cheerio.load(body,{decodeEntities: false})

          } catch (e) {
            nodemailer(e)
            console.log(`爬取《${trailer.movieName}》失败，准备重新开始爬取\n错误日志${e}`)
            // console.error(e);
          }

          if ($) {
            resolve({
              trailerMP4: $('#movie_player source').attr('src'),
              trailerTitle: $('h1').text(),
              trailerDate: $('.trailer-info>span').html(),
              trailerPoster: trailer.trailerPoster[index],
              // trailerId: uuid.v1().replace(/-/g, "")
              trailerId: trailer.id
            })
          } else {
            /*
            *  需要限制重启次数，目前只能重启 4 次
            *  超过 4 次将发送邮件通知
            * */
            await sleep(2) // 重新请求间歇 2s
            const trailer = await toRequest({trailerUrl: item, trailerPoster: trailer.trailerPoster[index]})
            resolve(trailer)
          }
        })
      })
      return movieMsg
    }))
  }
  return {
    trailerArray,
    id: trailer.id,
    trailerTitle: trailer.movieName
  }
}
const runMovieTrailerDetail = async () => {
  let comingTrailerLink = require('../../comingMovieTrailer')
  let Trailer = []

  try {
    for(let i = 0; i < comingTrailerLink.length ; i++) {
      const trailer = await getMovieTrailerDetail(comingTrailerLink[i])
      Trailer.push(trailer)

      console.log(`这是第${i+1}个电影的预告详细信息, 《${trailer.trailerTitle}》`)

      fs.writeFileSync('./comingMovieTrailerDetail.json', JSON.stringify(Trailer, null, 2), 'utf8')
      await sleep(2) // 间歇 2s
    }
  } catch (e) {
    nodemailer(e)
    console.log(e)
  }
  console.log(`电影预告详细全部爬取成功, 共计${comingTrailerLink.length}`)
}

/*
* 获取电影的剧照、海报
* runMoviePhotos
* getMoviePhotos
* */
const getMoviePhotos = async ({ movieUrl, restartCount = 0} = {}) => {
  const options = {
    method: 'GET',
    uri: `${movieUrl.url}/all_photos`,
    encoding: "utf-8"
  }
  // 代理地址
  const random = Math.floor(Math.random() * proxy.length)
  // console.log(`随机数为${random}`)
  options.proxy = `http://${proxyConfig.user}:${proxyConfig.password}@${proxy[random]}:${proxyConfig.port}`;

  // request 请求
  const movieMsg =  await new Promise( resolve => {
    request(options, async function (error, response, body) {
      let $
      try {
        if (error) throw error;
        $ = cheerio.load(body,{decodeEntities: false})

      } catch (e) {
        console.log(`爬取《${movieUrl.title}》失败，准备重新开始爬取\n错误日志${e}`)
        nodemailer(e)
        // console.error(e);
      }
      if ($) {
        let stagePhotos = []
        $('.article .pic-col5 li a').each(function () {
          stagePhotos.push($(this).find('img').attr('src'))
        })

        resolve({
          movieName: $("#content>h1").text(),
          stagePhotos: stagePhotos,
          id: movieUrl.url.match(/\/subject\/(\S*)\//)[1]
        })
      } else {
        /*
        *  需要限制重启次数，目前只能重启 4 次
        *  超过 4 次将发送邮件通知
        * */
        restartCount++
        if (restartCount < 5) {
          await sleep(2) // 间歇 2s
          const photo = await getMoviePhotos({movieUrl: movieUrl, restartCount: restartCount})
          resolve(photo)
        } else {
          console.log(`目前重启次数为${restartCount-1}, 重复次数过多，不可抗拒因素，将发起邮件通知`)
          resolve(`爬取失败，重启次数为${restartCount-1}`)
        }
      }
    })
  })
  if (typeof movieMsg === "object") console.log(`电影 《${movieUrl.title}》 重新爬取成功,重启次数为${restartCount}。`)
  return movieMsg
}
const runMoviePhotos = async () => {
  let comingMoviesLink = require('../../comingMovieUri')
  let stagePhotos = []

  for(let i = 0; i < comingMoviesLink.length ; i++) {
  // for(let i = 0; i < 10 ; i++) {
    const photo = await getMoviePhotos({movieUrl: comingMoviesLink[i]})
    stagePhotos.push(photo)

    console.log(`这是第${i+1}个电影的剧照, ${photo.movieName}`)
    fs.writeFileSync('./comingMovieStagePhotos.json', JSON.stringify(stagePhotos, null, 2), 'utf8')
    // await sleep(2) // 间歇 2s
  }
  console.log(`电影剧照全部爬取完成, 共计${comingMoviesLink.length}`)
}
module.exports = { runMovieDetail, runMovieTrailer, runMovieTrailerDetail, runMoviePhotos }
