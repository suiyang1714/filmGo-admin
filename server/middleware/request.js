const request = require("request");
const iconv = require('iconv-lite');
const Promise = require("bluebird");
const fs = require('fs')

// 获取代理列表
const getProxyList = () => {
  var apiURL = 'http://www.66ip.cn/mo.php?sxb=&tqsl=100&port=&export=&ktip=&sxa=&submit=%CC%E1++%C8%A1&textarea=http%3A%2F%2Fwww.66ip.cn%2F%3Fsxb%3D%26tqsl%3D100%26ports%255B%255D2%3D%26ktip%3D%26sxa%3D%26radio%3Dradio%26submit%3D%25CC%25E1%2B%2B%25C8%25A1';

  return new Promise((resolve, reject) => {
    var options = {
      method: 'GET',
      url: apiURL,
      gzip: true,
      encoding: null,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
        'User-Agent': 'Mozilla/8.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
        'referer': 'http://www.66ip.cn/'
      },

    };

    request(options, function (error, response, body) {


      try {

        if (error) throw error;

        if (/meta.*charset=gb2312/.test(body)) {
          body = iconv.decode(body, 'gbk');
        }

        var ret = body.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,4}/g);


        resolve(ret);

      } catch (e) {
        return reject(e);
      }


    });
  })
}

module.exports = getProxyList

// demo
/*
getProxyList().then(function (proxyList) {

  var targetOptions = {
    method: 'GET',
    // url: 'https://blog.adityasui.com',
    // url: 'http://ip.chinaz.com/getip.aspx',
    timeout: 8000,
    encoding: null,
  };
  //这里修改一下，变成你要访问的目标网站

  targetOptions.proxy = 'http://' + proxyList[0];
  let movieUri = fs.readFileSync("../crawler/comingMovieUri.json", "utf-8")
  movieUri = JSON.parse(movieUri)
  console.log(movieUri)
  movieUri.forEach( item => {
    targetOptions.url = item
    request(targetOptions, function (error, response, body) {
      try {
        if (error) throw error;


        body = body.toString();

        console.log(body);
        console.log(`验证成功==>>`)
        eval(`var ret = ${body}`);


        if (ret) {
          // console.log(`验证成功==>> ${ret.address}`);
          // console.log(`验证成功==>>`)
        }
      } catch (e) {
        // console.error(e);
      }


    });
  })

  /!*proxyList.forEach(function (proxyurl) {

    console.log(`testing ${proxyurl}`);

    targetOptions.proxy = 'http://' + proxyurl;
    request(targetOptions, function (error, response, body) {
      try {
        if (error) throw error;


        body = body.toString();

        // console.log(body);
        console.log(`验证成功==>>`)
        eval(`var ret = ${body}`);


        if (ret) {
          // console.log(`验证成功==>> ${ret.address}`);
          // console.log(`验证成功==>>`)
        }
      } catch (e) {
        // console.error(e);
      }


    });

  });*!/
}).catch(e => {
  console.log(e);
})
*/
