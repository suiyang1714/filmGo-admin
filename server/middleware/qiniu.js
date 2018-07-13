const qiniu = require('qiniu')
const request = require('request')
const crypto = require('crypto')

const accessKey = 'LIWJTwQKsmsTvBrNLD0k-nu62diiEFKw34NfWj9P';
const secretKey = 'R88bNThcj1GjiIY7D8BOANGUzCRJ6bTaC6DVE2t1';
/*const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

const spaceName = 'filmgo'

const options = {
  scope: spaceName,
  expires: 7200
};
const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);


const config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z0 // 华东



const localFile = "./user.jpg";
const formUploader = new qiniu.form_up.FormUploader(config);
const putExtra = new qiniu.form_up.PutExtra();
const key='test.png';
// 文件上传
formUploader.putFile(uploadToken, key, localFile, putExtra, function(respErr,respBody, respInfo) {
  if (respErr) {
    throw respErr;
  }
  if (respInfo.statusCode == 200) {
    console.log(respBody);
  } else {
    console.log(respInfo.statusCode);
    console.log(respBody);
  }

})*/


//需要填写你的 Access Key 和 Secret Key
/*qiniu.conf.ACCESS_KEY = accessKey
qiniu.conf.SECRET_KEY = secretKey*/

/*
* URL安全的Base64编码
*
* URL安全的Base64编码适用于以URL方式传递Base64编码结果的场景。
* 该编码方式的基本过程是先将内容以Base64格式编码为字符串，然后检查该结果字符串，将字符串中的加号+换成中划线-，并且将斜杠/换成下划线_。
*
* */
function safe64(base64) {

  base64 = base64.replace(/\+/g, "-");
  base64 = base64.replace(/\//g, "_");
  return base64;
}

/*
* base64ToUrlSafe
* urlSafeToBase64
* urlsafeBase64Encode
* urlSafeBase64Decode
* hmacSha1
* */


const uploadQiniuFile = (fileUrl, fileName) => {
  // 管理凭证
  function genManageToken(accessKey, secretKey, pathAndQuery, body) {
    const data = `${pathAndQuery}\n${body}`
    let hash = qiniu.util.hmacSha1(data, secretKey);
    hash = qiniu.util.base64ToUrlSafe(hash);
    return accessKey+ ":" +hash
  }

  // let picUrl = 'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2517591798.jpg'
  fileUrl = qiniu.util.urlsafeBase64Encode(fileUrl)
  let bucket = 'filmgo'
  // let key = 'p2517591798.png'
  let key = fileName
  bucket = qiniu.util.encodedEntry(bucket, key)

  const path = "/fetch/" + fileUrl + "/to/" + bucket;
  const fetchUrl = "http://iovip.qbox.me" + path;

  const targetOptions = {
    method: 'POST',
    url: fetchUrl,
    headers: {
      'Authorization': "QBox " + genManageToken(accessKey, secretKey, path, ""),
      'Content-Type': 'application/json',
    }
  }

  return new Promise((resolve, reject) => {
    request(targetOptions, function (error, response, body) {
      try {

        if (error) throw error;
        console.log(body)
        resolve(body)

      } catch (e) {
        reject(e)
      }
    })
  })
}

module.exports = { uploadQiniuFile }
