'use strict'

const nodemailer = require('nodemailer')
const fs = require('fs')
const path = require('path')
const ejs = require('ejs')

let transporter = nodemailer.createTransport({
  // host: 'smtp.ethereal.email',
  service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
  port: 465, // SMTP 端口
  secureConnection: true, // 使用了 SSL
  auth: {
    user: '171426589@qq.com',
    // 这里密码不是qq密码，是你设置的smtp授权码
    pass: 'xmzrcehbkyvbcabi'
  }
})

const sendMailFn = (sendMsg) => {
  const template = ejs.compile(fs.readFileSync(path.resolve(__dirname, 'email.ejs'), 'utf8'))

  const html = template({
    errorMsg: sendMsg ? sendMsg.errorMsg : '无错误信息'
  })

  let mailOptions = {
    from: '"FilmGo 定时爬虫启动" <171426589@qq.com>', // sender address
    to: 'suiyang_sun@163.com', // list of receivers
    subject: 'FilmGo 定时爬虫启动了, 预计5min更新完毕，请实时观察', // Subject line
    html: html
  }
  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    }
    console.log('Message sent: %s', info.messageId)
    // Message sent: <04ec7731-cc68-1ef6-303c-61b0f796b78f@qq.com>
  })
}

module.exports = sendMailFn
