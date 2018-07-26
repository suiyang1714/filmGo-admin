require('source-map-support/register')
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 42);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

module.exports = require("mongoose");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(40);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

var mongoose = __webpack_require__(0);
var Schema = mongoose.Schema;


var FilmSchema = new Schema({
  title: String,
  pv: {
    type: Number,
    default: 1
  },
  comment: {
    type: Number,
    default: 0
  },
  abstract: String,
  year: String,
  id: String,
  countries: Array,
  genres: [{
    name: String,
    source: {
      type: String,
      ref: 'Tag'
    }
  }],
  aka: Array,
  casts: Array,
  original_title: String,
  summary: String,
  directors: Array,
  releaseDate: Array,
  runtime: String,
  postPic: String,
  trailerPoster: String,
  trailerArray: Array,
  like: String,
  filmStagePhotos: Array,
  meta: {
    createdAt: {
      type: String
    },
    updatedAt: {
      type: String
    }
  }
});

var Film = mongoose.model('Film', FilmSchema);

module.exports = Film;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

var mongoose = __webpack_require__(0);
var Schema = mongoose.Schema;


var GenreSchema = new Schema({
  name: String,
  filmArray: [{
    type: String,
    ref: 'Article'
  }],
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
});
GenreSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now();
  } else {
    this.meta.updatedAt = Date.now();
  }

  next();
});

var Genre = mongoose.model('Genre', GenreSchema);

module.exports = Genre;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {

var nodemailer = __webpack_require__(38);
var fs = __webpack_require__(5);
var path = __webpack_require__(12);
var ejs = __webpack_require__(35);

var transporter = nodemailer.createTransport({
  // host: 'smtp.ethereal.email',
  service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
  port: 465, // SMTP 端口
  secureConnection: true, // 使用了 SSL
  auth: {
    user: '171426589@qq.com',
    // 这里密码不是qq密码，是你设置的smtp授权码
    pass: 'xmzrcehbkyvbcabi'
  }
});

var sendMailFn = function sendMailFn(sendMsg) {
  var template = ejs.compile(fs.readFileSync(path.resolve(__dirname, 'email.ejs'), 'utf8'));

  var html = template({
    errorMsg: sendMsg ? sendMsg.errorMsg : '无错误信息'
  });

  var mailOptions = {
    from: '"FilmGo 定时爬虫启动" <171426589@qq.com>', // sender address
    to: 'suiyang_sun@163.com', // list of receivers
    subject: 'FilmGo 定时爬虫启动了, 预计5min更新完毕，请实时观察', // Subject line
    html: html
    // send mail with defined transport object
  };transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    // Message sent: <04ec7731-cc68-1ef6-303c-61b0f796b78f@qq.com>
  });
};

module.exports = sendMailFn;
/* WEBPACK VAR INJECTION */}.call(exports, "server\\middleware"))

/***/ },
/* 5 */
/***/ function(module, exports) {

module.exports = require("fs");

/***/ },
/* 6 */
/***/ function(module, exports) {

module.exports = require("request");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

var mongoose = __webpack_require__(0);
var bcrypt = __webpack_require__(32);

var SALT_WORK_FACTOR = 10;
var MAX_LOGIN_ATTEMPTS = 5;
var LOCK_TIME = 2 * 60 * 60 * 1000;
var Schema = mongoose.Schema;

var AdminSchema = new Schema({
  user: String,
  password: String,
  nickname: String,
  role: {
    type: String,
    default: 'user'
  },
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
});

AdminSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now();
  } else {
    this.meta.updatedAt = Date.now();
  }

  next();
});

AdminSchema.pre('save', function (next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (error, hash) {
      if (error) return next(error);

      user.password = hash;
      next();
    });
  });
});

AdminSchema.methods = {
  comparePassword: function comparePassword(_password, password) {
    return new Promise(function (resolve, reject) {
      bcrypt.compare(_password, password, function (err, isMatch) {
        if (!err) resolve(isMatch);else reject(err);
      });
    });
  },

  incLoginAttempts: function incLoginAttempts(user) {
    var that = this;

    return new Promise(function (resolve, reject) {
      if (that.lockUntil && that.lockUntil < Date.now()) {
        that.update({
          $set: {
            loginAttempts: 1
          },
          $unset: {
            lockUntil: 1
          }
        }, function (err) {
          if (!err) resolve(true);else reject(err);
        });
      }
      var updates = {
        $inc: {
          loginAttempts: 1
        }
      };
      if (that.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !that.isLocked) {
        updates.$set = {
          lockUntil: Date.now() + LOCK_TIME
        };
      }

      that.update(updates, function (err) {
        if (!err) resolve(true);else reject(err);
      });
    });
  }
};

var Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

var mongoose = __webpack_require__(0);
var Schema = mongoose.Schema;


var CategorySchema = new Schema({
  name: String,
  articleArray: [{
    type: String,
    ref: 'Article'
  }],
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
});
CategorySchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now();
  } else {
    this.meta.updatedAt = Date.now();
  }

  next();
});

var Category = mongoose.model('Category', CategorySchema);

module.exports = Category;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

var mongoose = __webpack_require__(0);
var Schema = mongoose.Schema;


var CommentSchema = new Schema({
  articleId: {
    type: String,
    ref: 'Article'
  },
  from: {
    type: String,
    ref: 'User'
  },
  reply: [{
    from: {
      type: String,
      ref: 'User'
    },
    to: {
      type: String,
      ref: 'User'
    },
    content: String,
    updateTime: String
  }],
  content: String,
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
});
CommentSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now();
  } else {
    this.meta.updatedAt = Date.now();
  }

  next();
});

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

var mongoose = __webpack_require__(0);
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  openid: String,
  avatarUrl: String,
  nickname: String,
  role: {
    type: String,
    default: 'user'
  },
  unionid: String,
  province: String,
  country: String,
  city: String,
  gender: String,
  password: {
    type: String
  },
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
});

UserSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now();
  } else {
    this.meta.updatedAt = Date.now();
  }

  next();
});

var MinaUser = mongoose.model('MinaUser', UserSchema);

module.exports = MinaUser;

/***/ },
/* 11 */
/***/ function(module, exports) {

module.exports = []

/***/ },
/* 12 */
/***/ function(module, exports) {

module.exports = require("path");

/***/ },
/* 13 */
/***/ function(module, exports) {

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'starter',
    meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }, { hid: 'description', name: 'description', content: 'Nuxt.js project' }],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
  ** Global CSS
  */
  css: ['~assets/css/main.css'],
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** Run ESLINT on save
     */
    extend: function extend(config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        });
      }
    }
  }
};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__);


var _this = this;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var movieFile = __webpack_require__(24);
var axios = __webpack_require__(31);
var doubanAPI = 'http://api.douban.com/v2/movie/';
var request = __webpack_require__(6);
var qiniuFn = __webpack_require__(25);
var nodemailer = __webpack_require__(4);

var proxy = ['180.76.188.115', '180.76.138.181', '180.76.239.106', '180.76.166.103', '180.76.181.205', '180.76.234.215', '180.76.106.163', '180.76.184.179', '180.76.244.38', '180.76.113.79', '180.76.169.176', '180.76.169.122', '180.76.106.208', '180.76.178.83', '180.76.147.196', '180.76.112.206', '180.76.233.125', '180.76.186.99', '180.76.51.74', '180.76.234.146', '180.76.153.183', '180.76.155.233', '180.76.57.252', '180.76.120.42', '180.76.103.107', '180.76.58.216', '180.76.112.24', '180.76.108.218', '180.76.98.218', '180.76.168.148', '180.76.109.38', '180.76.249.53', '180.76.59.173', '180.76.145.181', '180.76.99.7', '180.76.59.64', '180.76.51.56', '180.76.57.82', '180.76.233.53', '180.76.156.144'];
var proxyConfig = {
  port: "443",
  user: "martindu",
  password: "fy1812!!"
};

var filmDetail = __webpack_require__(26); // 电影封面、演职人员照片
var filmStagePhotos = __webpack_require__(27); // 剧照
var filmTrailerDetail = __webpack_require__(29); // 预告片

var sleep = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee(time) {
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return new Promise(function (resolve) {
              setTimeout(function () {
                return resolve(console.log('\u7B49\u5F85' + time + 's'));
              }, time * 1000);
            });

          case 2:
            return _context.abrupt('return', _context.sent);

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this);
  }));

  return function sleep(_x) {
    return _ref.apply(this, arguments);
  };
}();

var Film = __webpack_require__(2);
var Genre = __webpack_require__(3);

var fetchSingleFilm = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee2(filmId) {
    var options, random, film;
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            options = {
              method: 'GET',
              uri: doubanAPI + 'subject/' + filmId
              // 代理地址
            };
            random = Math.floor(Math.random() * proxy.length);
            // console.log(`随机数为${random}`)

            options.proxy = 'http://' + proxyConfig.user + ':' + proxyConfig.password + '@' + proxy[random] + ':' + proxyConfig.port;

            // const film = request(options)
            _context2.next = 5;
            return new Promise(function (resolve) {
              request(options, function (error, response, body) {
                try {
                  if (error) throw error;

                  resolve(JSON.parse(body));
                } catch (e) {
                  console.log('\u5355\u4E2A\u7535\u5F71 API \u8BF7\u6C42\u5931\u8D25\uFF0C\u51C6\u5907\u91CD\u65B0\u8BF7\u6C42ing');
                  fetchSingleFilm(filmId);
                  // console.log(e)
                  nodemailer(e);
                }
              });
            });

          case 5:
            film = _context2.sent;
            return _context2.abrupt('return', film);

          case 7:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, _this);
  }));

  return function fetchSingleFilm(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var fetchFilms = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee5() {
    var films, options, random, _loop, i;

    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            films = void 0;
            _context5.prev = 1;
            options = {
              method: 'GET',
              uri: doubanAPI + 'coming_soon?count=' + filmDetail.length
              // uri: `${doubanAPI}coming_soon?count=100`
              // uri: `${doubanAPI}coming_soon?count=5`

              // 代理地址
            };
            random = Math.floor(Math.random() * proxy.length);
            // console.log(`随机数为${random}`)

            options.proxy = 'http://' + proxyConfig.user + ':' + proxyConfig.password + '@' + proxy[random] + ':' + proxyConfig.port;

            _context5.next = 7;
            return new Promise(function (resolve) {
              request(options, function (error, response, body) {
                // console.log(body)
                resolve(JSON.parse(body));
              });
            });

          case 7:
            films = _context5.sent;
            _context5.next = 15;
            break;

          case 10:
            _context5.prev = 10;
            _context5.t0 = _context5['catch'](1);

            console.log('\u5373\u5C06\u4E0A\u6620\u7535\u5F71\u5217\u8868API\uFF0C\u8BF7\u6C42\u5931\u8D25\uFF0C\u51C6\u5907\u91CD\u65B0\u8BF7\u6C42ing');
            fetchFilms();
            // console.log(e)
            nodemailer(_context5.t0);

          case 15:
            _loop = /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee4(i) {
              var filmData, film, filmObject, _film, _filmObject;

              return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      _context4.next = 2;
                      return Film.findOne({ id: films.subjects[i].id }).exec();

                    case 2:
                      filmData = _context4.sent;

                      if (filmData) {
                        _context4.next = 18;
                        break;
                      }

                      _context4.next = 6;
                      return fetchSingleFilm(films.subjects[i].id);

                    case 6:
                      film = _context4.sent;
                      filmObject = film;

                      console.log('\u7B2C' + (i + 1) + '\u4E2A\u7535\u5F71:"' + film.title + '"');
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
                      });

                      // 查询该标签：有 => 返回 tagId || 无 => 新建该标签，返回 tagId
                      _context4.next = 12;
                      return Promise.all(film.genres.map(function () {
                        var _ref4 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee3(item, index) {
                          var genreId;
                          return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee3$(_context3) {
                            while (1) {
                              switch (_context3.prev = _context3.next) {
                                case 0:
                                  _context3.next = 2;
                                  return fetchGenre(item, filmData._id);

                                case 2:
                                  genreId = _context3.sent;

                                  filmData.genres[index] = {
                                    name: item,
                                    source: genreId
                                  };
                                  return _context3.abrupt('return', genreId);

                                case 5:
                                case 'end':
                                  return _context3.stop();
                              }
                            }
                          }, _callee3, _this);
                        }));

                        return function (_x3, _x4) {
                          return _ref4.apply(this, arguments);
                        };
                      }()));

                    case 12:
                      _context4.next = 14;
                      return filmData.save();

                    case 14:
                      _context4.next = 16;
                      return sleep(2);

                    case 16:
                      _context4.next = 37;
                      break;

                    case 18:
                      _context4.next = 20;
                      return fetchSingleFilm(films.subjects[i].id);

                    case 20:
                      _film = _context4.sent;
                      _filmObject = _film;


                      filmData.title = _filmObject.title;
                      filmData.rating = _filmObject.rating;
                      filmData.year = _filmObject.year;
                      filmData.id = _filmObject.id;
                      filmData.summary = _filmObject.summary;
                      filmData.casts = _filmObject.casts, filmData.original_title = _filmObject.original_title;
                      filmData.directors = _filmObject.directors;
                      filmData.images = _filmObject.images;
                      filmData.countries = _filmObject.countries;
                      filmData.aka = _filmObject.aka;

                      _context4.next = 34;
                      return filmData.save();

                    case 34:
                      console.log('\u7B2C' + (i + 1) + '\u4E2A\u7535\u5F71:"' + _film.title + '"\u66F4\u65B0\u5B8C\u6BD5');
                      _context4.next = 37;
                      return sleep(2);

                    case 37:
                    case 'end':
                      return _context4.stop();
                  }
                }
              }, _callee4, _this);
            });
            i = 0;

          case 17:
            if (!(i < films.subjects.length)) {
              _context5.next = 22;
              break;
            }

            return _context5.delegateYield(_loop(i), 't1', 19);

          case 19:
            i++;
            _context5.next = 17;
            break;

          case 22:
            console.log('\u7535\u5F71\u66F4\u65B0\u5B8C\u6BD5');

          case 23:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, _this, [[1, 10]]);
  }));

  return function fetchFilms() {
    return _ref3.apply(this, arguments);
  };
}();
// 查询类型方法
var fetchGenre = function fetchGenre(genre, filmId) {
  return new Promise(function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee6(resolve) {
      var genreMsg;
      return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return Genre.findOne({ name: genre }).exec();

            case 2:
              genreMsg = _context6.sent;

              if (genreMsg) {
                _context6.next = 13;
                break;
              }

              _context6.next = 6;
              return new Genre({
                name: genre
              });

            case 6:
              genreMsg = _context6.sent;


              genreMsg.filmArray.push(filmId);
              _context6.next = 10;
              return genreMsg.save();

            case 10:
              resolve(genreMsg._id);
              _context6.next = 18;
              break;

            case 13:
              if (!(genreMsg.filmArray.indexOf(filmId) === -1)) {
                _context6.next = 17;
                break;
              }

              // 检测该标签内是否含有该电影的 _id ,按道理说这一步是多余的，先保留看看。
              genreMsg.filmArray.push(filmId);
              _context6.next = 17;
              return genreMsg.save();

            case 17:
              resolve(genreMsg._id);

            case 18:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, _this);
    }));

    return function (_x5) {
      return _ref5.apply(this, arguments);
    };
  }());
};

// 读取本地爬取电影详细信息添加到数据空中
var crawlerDetail = function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee10(ctx, next) {
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return new Promise(function () {
              var _ref7 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee7(resolve, reject) {
                var i, film, j, k, item, l, _item;

                return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        _context7.prev = 0;
                        i = 0;

                      case 2:
                        if (!(i < filmDetail.length)) {
                          _context7.next = 17;
                          break;
                        }

                        _context7.next = 5;
                        return Film.findOne({ id: filmDetail[i].id }).exec();

                      case 5:
                        film = _context7.sent;

                        if (!film) {
                          _context7.next = 14;
                          break;
                        }

                        film.releaseDate = filmDetail[i].releaseDate; // 更新上时间
                        film.runtime = filmDetail[i].runtime; // 更新电影时长
                        film.postPic = filmDetail[i].movieName + '封面图'; // 更新电影poster
                        if (!film.like) film.like = filmDetail[i].like;
                        // 更新导演、主演照片

                        for (j = 0; j < filmDetail[i].actorAddMsg.length; j++) {
                          for (k = 0; k < film.directors.length; k++) {
                            if (film.directors[k].id === filmDetail[i].actorAddMsg[j].id) {
                              item = film.directors[k];

                              item.avatars = filmDetail[i].actorAddMsg[j].id + 'castImg.jpg';
                              film.directors.splice(k, 1, item);
                            }
                          }
                          for (l = 0; l < film.casts.length; l++) {
                            if (film.casts[l].id === filmDetail[i].actorAddMsg[j].id) {
                              _item = film.casts[l];

                              _item.avatars = filmDetail[i].actorAddMsg[j].id + 'castImg.jpg';
                              film.casts.splice(l, 1, _item);
                            }
                          }
                        }

                        _context7.next = 14;
                        return film.save();

                      case 14:
                        i++;
                        _context7.next = 2;
                        break;

                      case 17:
                        _context7.next = 23;
                        break;

                      case 19:
                        _context7.prev = 19;
                        _context7.t0 = _context7['catch'](0);

                        console.log(_context7.t0);
                        nodemailer(_context7.t0);

                      case 23:
                        console.log('\u7535\u5F71\u7F3A\u5931\u4E0A\u6620\u65E5\u671F\u3001\u64AD\u653E\u65F6\u957F\u3001\u7535\u5F71\u5C01\u9762\u4FE1\u606F\u8865\u5145\u5B8C\u6BD5');
                        return _context7.abrupt('return', resolve());

                      case 25:
                      case 'end':
                        return _context7.stop();
                    }
                  }
                }, _callee7, _this, [[0, 19]]);
              }));

              return function (_x8, _x9) {
                return _ref7.apply(this, arguments);
              };
            }());

          case 2:
            _context10.next = 4;
            return new Promise(function () {
              var _ref8 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee8(resolve, reject) {
                var i, film, j;
                return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        i = 0;

                      case 1:
                        if (!(i < filmStagePhotos.length)) {
                          _context8.next = 12;
                          break;
                        }

                        _context8.next = 4;
                        return Film.findOne({ id: filmStagePhotos[i].id }).exec();

                      case 4:
                        film = _context8.sent;

                        if (!film) {
                          _context8.next = 9;
                          break;
                        }

                        for (j = 0; j < filmStagePhotos[i].stagePhotos.length; j++) {
                          film.filmStagePhotos.push('' + filmStagePhotos[i].id + j + 'stagePhotoImg.jpg');
                        }
                        _context8.next = 9;
                        return film.save();

                      case 9:
                        i++;
                        _context8.next = 1;
                        break;

                      case 12:

                        console.log('\u7535\u5F71\u5267\u7167\u8865\u5145\u5B8C\u6BD5');
                        return _context8.abrupt('return', resolve());

                      case 14:
                      case 'end':
                        return _context8.stop();
                    }
                  }
                }, _callee8, _this);
              }));

              return function (_x10, _x11) {
                return _ref8.apply(this, arguments);
              };
            }());

          case 4:
            _context10.next = 6;
            return new Promise(function () {
              var _ref9 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee9(resolve, reject) {
                var i, film, j;
                return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        i = 0;

                      case 1:
                        if (!(i < filmTrailerDetail.length)) {
                          _context9.next = 12;
                          break;
                        }

                        _context9.next = 4;
                        return Film.findOne({ id: filmTrailerDetail[i].id }).exec();

                      case 4:
                        film = _context9.sent;

                        if (!film) {
                          _context9.next = 9;
                          break;
                        }

                        try {
                          for (j = 0; j < filmTrailerDetail[i].trailerArray.length; j++) {
                            film.trailerArray.push({
                              trailerMP4: filmTrailerDetail[i].trailerArray[j].trailerId + '\u89C6\u9891',
                              trailerTitle: '' + filmTrailerDetail[i].trailerArray[j].trailerTitle,
                              trailerDate: '' + filmTrailerDetail[i].trailerArray[j].trailerDate,
                              trailerPoster: filmTrailerDetail[i].trailerArray[j].trailerId + '\u5C01\u9762\u56FE',
                              trailerId: filmTrailerDetail[i].trailerArray[j].trailerId
                            });
                          }
                        } catch (e) {
                          console.log(e);
                          nodemailer(e);
                        }
                        _context9.next = 9;
                        return film.save();

                      case 9:
                        i++;
                        _context9.next = 1;
                        break;

                      case 12:

                        console.log('\u7535\u5F71\u9884\u544A\u7247\u8BE6\u60C5\u8865\u5145\u5B8C\u6BD5');
                        return _context9.abrupt('return', resolve());

                      case 14:
                      case 'end':
                        return _context9.stop();
                    }
                  }
                }, _callee9, _this);
              }));

              return function (_x12, _x13) {
                return _ref9.apply(this, arguments);
              };
            }());

          case 6:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, _this);
  }));

  return function crawlerDetail(_x6, _x7) {
    return _ref6.apply(this, arguments);
  };
}();

var uploadQiniuFile = function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee11() {
    var i, j, _i, _j, _i2, _j2;

    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            for (i = 0; i < filmDetail.length; i++) {
              // 上传电影封面照
              qiniuFn.uploadQiniuFile(filmDetail[i].postPic, filmDetail[i].movieName + '\u5C01\u9762\u56FE');
              for (j = 0; j < filmDetail[i].actorAddMsg.length; j++) {
                // 上传电影主演照片
                qiniuFn.uploadQiniuFile(filmDetail[i].actorAddMsg[j].actorImg, filmDetail[i].actorAddMsg[j].id + 'castImg.jpg');
              }
            }

            _i = 0;

          case 2:
            if (!(_i < filmStagePhotos.length)) {
              _context11.next = 22;
              break;
            }

            _context11.prev = 3;
            _j = 0;

          case 5:
            if (!(_j < filmStagePhotos[_i].stagePhotos.length)) {
              _context11.next = 13;
              break;
            }

            _context11.next = 8;
            return qiniuFn.uploadQiniuFile(filmStagePhotos[_i].stagePhotos[_j], '' + filmStagePhotos[_i].id + _j + 'stagePhotoImg.jpg');

          case 8:
            _context11.next = 10;
            return qiniuFn.uploadQiniuFile(filmStagePhotos[_i].stagePhotos[_j].replace(/sqxs/, 'l'), '' + filmStagePhotos[_i].id + _j + 'stagePhotoImgBig.jpg');

          case 10:
            _j++;
            _context11.next = 5;
            break;

          case 13:
            _context11.next = 19;
            break;

          case 15:
            _context11.prev = 15;
            _context11.t0 = _context11['catch'](3);

            nodemailer(_context11.t0);
            console.log(_context11.t0);

          case 19:
            _i++;
            _context11.next = 2;
            break;

          case 22:
            _i2 = 0;

          case 23:
            if (!(_i2 < filmTrailerDetail.length)) {
              _context11.next = 43;
              break;
            }

            _context11.prev = 24;
            _j2 = 0;

          case 26:
            if (!(_j2 < filmTrailerDetail[_i2].trailerArray.length)) {
              _context11.next = 34;
              break;
            }

            _context11.next = 29;
            return qiniuFn.uploadQiniuFile(filmTrailerDetail[_i2].trailerArray[_j2].trailerPoster, '' + filmTrailerDetail[_i2].trailerArray[_j2].trailerId + _j2 + '\u5C01\u9762\u56FE');

          case 29:
            _context11.next = 31;
            return qiniuFn.uploadQiniuFile(filmTrailerDetail[_i2].trailerArray[_j2].trailerMP4, '' + filmTrailerDetail[_i2].trailerArray[_j2].trailerId + _j2 + '\u89C6\u9891');

          case 31:
            _j2++;
            _context11.next = 26;
            break;

          case 34:
            _context11.next = 40;
            break;

          case 36:
            _context11.prev = 36;
            _context11.t1 = _context11['catch'](24);

            nodemailer(_context11.t1);
            console.log(_context11.t1);

          case 40:
            _i2++;
            _context11.next = 23;
            break;

          case 43:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, _this, [[3, 15], [24, 36]]);
  }));

  return function uploadQiniuFile() {
    return _ref10.apply(this, arguments);
  };
}();
/* 定时更新内容 */
var updateMovie = function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee12() {
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            console.time("sort");
            _context12.next = 3;
            return movieFile.runMovieDetail();

          case 3:
            _context12.next = 5;
            return movieFile.runMovieTrailer();

          case 5:
            _context12.next = 7;
            return movieFile.runMovieTrailerDetail();

          case 7:
            _context12.next = 9;
            return movieFile.runMoviePhotos();

          case 9:
            _context12.next = 11;
            return fetchFilms();

          case 11:
            _context12.next = 13;
            return crawlerDetail();

          case 13:
            _context12.next = 15;
            return uploadQiniuFile();

          case 15:
            console.timeEnd("sort");

          case 16:
          case 'end':
            return _context12.stop();
        }
      }
    }, _callee12, _this);
  }));

  return function updateMovie() {
    return _ref11.apply(this, arguments);
  };
}();
module.exports = updateMovie;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__);


var _this = this;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fs = __webpack_require__(5);
var resolve = __webpack_require__(12).resolve;
var mongoose = __webpack_require__(0);
var config = __webpack_require__(23);

/*const models = resolve(__dirname, './schema')
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*js$/))
  .forEach(file => require(resolve(models, file)))*/
var models = resolve(__dirname, '../database/schema');
fs.readdirSync(models).filter(function (file) {
  return ~file.search(/^[^\.].*js$/);
}).forEach(function (file) {
  __webpack_require__(30)("./" + file);
  // require(resolve(models,file))
});

var database = function database() {

  mongoose.set('debug', true);

  mongoose.Promise = global.Promise;

  mongoose.connect(config.db);

  mongoose.connection.on('disconnected', function () {
    mongoose.connect(config.db);
  });
  mongoose.connection.on('error', function (err) {
    console.error(err);
  });

  mongoose.connection.on('open', _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee() {
    var Admin, user;
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:

            console.log('Connected to MongoDB ', config.db);

            Admin = mongoose.model('Admin');
            _context.next = 4;
            return Admin.findOne({
              user: 'admin'
            });

          case 4:
            user = _context.sent;

            if (user) {
              _context.next = 10;
              break;
            }

            console.log('写入管理员数据');

            user = new Admin({
              user: 'admin',
              password: '123456',
              role: 'superAdmin',
              nickname: 'Aditya Sui'
            });

            _context.next = 10;
            return user.save();

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this);
  })));
};

module.exports = database;
/* WEBPACK VAR INJECTION */}.call(exports, "server\\database"))

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__);


var _this = this;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var router = __webpack_require__(36)();

var Film = __webpack_require__(2);
var Genre = __webpack_require__(3);

router.get('/api/film/comingsoon', function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee(ctx, next) {
    var films, errMsg;
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return Film.find().exec();

          case 3:
            films = _context.sent;

            ctx.body = {
              success: true,
              data: films
            };
            _context.next = 11;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context['catch'](0);
            errMsg = {
              localhost: ctx.url,
              errorMsg: _context.t0
            };


            ctx.error(10001, errMsg);

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this, [[0, 7]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
router.get('/api/film/id', function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee2(ctx, next) {
    var id, errMsg, film;
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            id = ctx.query.id;

            if (!id) {
              errMsg = {
                localhost: ctx.url,
                errorMsg: 'id\u4E3A\u7A7A'
              };

              ctx.error(10000, errMsg);
            }
            _context2.next = 4;
            return Film.findOne({ id: id }).exec();

          case 4:
            film = _context2.sent;

            ctx.body = {
              success: true,
              data: film
            };

          case 6:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, _this);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
router.get('/api/film/poster/id', function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee3(ctx, next) {
    var filmId, errMsg, film;
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            filmId = ctx.query.filmId;

            if (!filmId) {
              errMsg = {
                localhost: ctx.url,
                errorMsg: 'filmId \u4E3A\u7A7A'
              };

              ctx.error(10000, errMsg);
            }
            _context3.next = 4;
            return Film.findOne({ id: filmId }, 'title releaseDate trailerArray like id').exec();

          case 4:
            film = _context3.sent;


            ctx.body = {
              success: true,
              data: film
            };

          case 6:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, _this);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());

module.exports = router;

/***/ },
/* 17 */
/***/ function(module, exports) {

module.exports = require("koa");

/***/ },
/* 18 */
/***/ function(module, exports) {

module.exports = require("koa-bodyparser");

/***/ },
/* 19 */
/***/ function(module, exports) {

module.exports = require("koa-session");

/***/ },
/* 20 */
/***/ function(module, exports) {

module.exports = require("koa2-cors");

/***/ },
/* 21 */
/***/ function(module, exports) {

module.exports = require("node-schedule");

/***/ },
/* 22 */
/***/ function(module, exports) {

module.exports = require("nuxt");

/***/ },
/* 23 */
/***/ function(module, exports) {

var config = {
  db: 'mongodb://127.0.0.1/filmgo'
};

module.exports = config;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__);


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _this = this;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var rp = __webpack_require__(41);
var cheerio = __webpack_require__(33); // Node.js版本的jquery
var fs = __webpack_require__(5);
// const iconv = require('iconv-lite') // 文件编码转换
var request = __webpack_require__(6);
// const proxyIP = require('../middleware/request')
var uuid = __webpack_require__(37);
var nodemailer = __webpack_require__(4);

var sleep = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee(time) {
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return new Promise(function (resolve) {
              setTimeout(function () {
                return resolve(console.log('\u7B49\u5F85' + time + 's'));
              }, time * 1000);
            });

          case 2:
            return _context.abrupt('return', _context.sent);

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this);
  }));

  return function sleep(_x) {
    return _ref.apply(this, arguments);
  };
}();

var proxy = ['180.76.188.115', '180.76.138.181', '180.76.239.106', '180.76.166.103', '180.76.181.205', '180.76.234.215', '180.76.106.163', '180.76.184.179', '180.76.244.38', '180.76.113.79', '180.76.169.176', '180.76.169.122', '180.76.106.208', '180.76.178.83', '180.76.147.196', '180.76.112.206', '180.76.233.125', '180.76.186.99', '180.76.51.74', '180.76.234.146', '180.76.153.183', '180.76.155.233', '180.76.57.252', '180.76.120.42', '180.76.103.107', '180.76.58.216', '180.76.112.24', '180.76.108.218', '180.76.98.218', '180.76.168.148', '180.76.109.38', '180.76.249.53', '180.76.59.173', '180.76.145.181', '180.76.99.7', '180.76.59.64', '180.76.51.56', '180.76.57.82', '180.76.233.53', '180.76.156.144'];
var proxyConfig = {
  port: "443",
  user: "martindu",
  password: "fy1812!!"

  /*
  * 1. 即将上映电影 url 爬取 runMovieDetail
  * 2. 即将上映电影缺失信息爬取 getComingMovie
  * 根据 url 爬取电影的 poster、上映日期、片长、制作国家等信息
  * */
};var getComingMovie = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee3() {
    var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        movieUrl = _ref3.movieUrl,
        _ref3$restartCount = _ref3.restartCount,
        restartCount = _ref3$restartCount === undefined ? 0 : _ref3$restartCount;

    var options, random, movieMsg;
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            options = {
              method: 'GET',
              uri: movieUrl.url,
              encoding: "utf-8"
              // 代理地址
            };
            random = Math.floor(Math.random() * proxy.length);
            // console.log(`随机数为${random}`)

            options.proxy = 'http://' + proxyConfig.user + ':' + proxyConfig.password + '@' + proxy[random] + ':' + proxyConfig.port;

            // request 请求
            _context3.next = 5;
            return new Promise(function (resolve) {
              request(options, function () {
                var _ref4 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee2(error, response, body) {
                  var $, releaseDate, runtime, casts, movie, _movie;

                  return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          $ = void 0;
                          _context2.prev = 1;

                          if (!error) {
                            _context2.next = 4;
                            break;
                          }

                          throw error;

                        case 4:
                          $ = cheerio.load(body, { decodeEntities: false });
                          _context2.next = 11;
                          break;

                        case 7:
                          _context2.prev = 7;
                          _context2.t0 = _context2['catch'](1);

                          nodemailer(_context2.t0);
                          console.log('\u722C\u53D6\u300A' + movieUrl.title + '\u300B\u5931\u8D25\uFF0C\u51C6\u5907\u91CD\u65B0\u5F00\u59CB\u722C\u53D6\n\u9519\u8BEF\u65E5\u5FD7' + _context2.t0 + '\n\u91CD\u542F\u6B21\u6570\u4E3A' + restartCount);
                          // console.error(e);

                        case 11:
                          if (!$) {
                            _context2.next = 22;
                            break;
                          }

                          releaseDate = [];

                          $('#info span[property="v:initialReleaseDate"]').each(function () {
                            releaseDate.push($(this).html());
                          });
                          runtime = [];

                          $('#info span[property="v:runtime"]').each(function () {
                            runtime.push($(this).html());
                          });
                          casts = [];

                          $('.celebrities-list .celebrity').each(function () {
                            var actor = $(this).find('.avatar').attr('style');
                            var id = $(this).find('a').attr('href');
                            if (actor) {
                              casts.push({
                                actorImg: actor.match(/background-image: url\((\S*)\)/)[1],
                                id: id.match(/\/celebrity\/(\S*)\//)[1]
                              });
                            }
                          });

                          movie = {
                            movieName: $('span[property="v:itemreviewed"]').text(),
                            releaseDate: releaseDate,
                            runtime: runtime,
                            postPic: $('#mainpic img').attr('src'),
                            id: movieUrl.url.match(/\/subject\/(\S*)\//)[1],
                            actorAddMsg: casts,
                            like: movieUrl.like
                          };


                          resolve(movie);
                          _context2.next = 34;
                          break;

                        case 22:
                          /*
                          *  需要限制重启次数，目前只能重启 4 次
                          *  超过 4 次将发送邮件通知
                          * */
                          restartCount++;

                          if (!(restartCount < 5)) {
                            _context2.next = 32;
                            break;
                          }

                          _context2.next = 26;
                          return sleep(2);

                        case 26:
                          _context2.next = 28;
                          return getComingMovie({ movieUrl: movieUrl, restartCount: restartCount });

                        case 28:
                          _movie = _context2.sent;

                          resolve(_movie);
                          _context2.next = 34;
                          break;

                        case 32:
                          console.log('\u76EE\u524D\u91CD\u542F\u6B21\u6570\u4E3A' + restartCount + ', \u91CD\u590D\u6B21\u6570\u8FC7\u591A\uFF0C\u4E0D\u53EF\u6297\u62D2\u56E0\u7D20\uFF0C\u5C06\u53D1\u8D77\u90AE\u4EF6\u901A\u77E5');
                          resolve('\u722C\u53D6\u5931\u8D25\uFF0C\u91CD\u542F\u6B21\u6570\u4E3A' + restartCount);

                        case 34:
                        case 'end':
                          return _context2.stop();
                      }
                    }
                  }, _callee2, this, [[1, 7]]);
                }));

                return function (_x3, _x4, _x5) {
                  return _ref4.apply(this, arguments);
                };
              }());
            });

          case 5:
            movieMsg = _context3.sent;

            if ((typeof movieMsg === 'undefined' ? 'undefined' : _typeof(movieMsg)) === "object") console.log('\u7535\u5F71 \u300A' + movieMsg.movieName + '\u300B \u722C\u53D6\u6210\u529F');
            return _context3.abrupt('return', movieMsg);

          case 8:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, _this);
  }));

  return function getComingMovie() {
    return _ref2.apply(this, arguments);
  };
}();
var runMovieDetail = function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee4() {
    var _ref6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref6$restartCount = _ref6.restartCount,
        restartCount = _ref6$restartCount === undefined ? 0 : _ref6$restartCount;

    var $, comingMoviesLink, comingMovies, options, i, movie;
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            $ = void 0;
            comingMoviesLink = [];
            comingMovies = [];
            options = {
              uri: 'https://movie.douban.com/coming',
              transform: function transform(body) {
                return cheerio.load(body, { decodeEntities: false });
              }
            };
            _context4.next = 6;
            return rp(options);

          case 6:
            $ = _context4.sent;
            _context4.prev = 7;
            _context4.next = 16;
            break;

          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4['catch'](7);

            console.log('\u722C\u53D6 https://movie.douban.com/coming \u7F51\u7AD9\u5931\u8D25\uFF0C\u51C6\u5907\u91CD\u65B0\u5F00\u59CB\u722C\u53D6 = \u3002=\\n\u5177\u4F53\u9519\u8BEF\u4FE1\u606F' + _context4.t0);
            /*
            *  需要限制重启次数，目前只能重启 4 次
            *  超过 4 次将发送邮件通知
            * */
            restartCount++;
            if (restartCount < 5) {
              console.log('\u76EE\u524D\u91CD\u542F\u6B21\u6570\u4E3A' + restartCount);
              runMovieDetail(restartCount);
            } else {
              console.log('\u76EE\u524D\u91CD\u542F\u6B21\u6570\u4E3A' + restartCount + ', \u91CD\u590D\u6B21\u6570\u8FC7\u591A\uFF0C\u4E0D\u53EF\u6297\u62D2\u56E0\u7D20\uFF0C\u5C06\u53D1\u8D77\u90AE\u4EF6\u901A\u77E5');
            }
            return _context4.abrupt('return');

          case 16:

            $('.article tbody tr').each(function (index) {
              comingMoviesLink.push({
                url: $(this).find("a").attr('href'),
                title: $(this).find("a").html().trim(),
                like: $(this).find("td").eq(4).html().trim().match(/^[0-9]*/)[0]
              });
            });

            console.log('\u603B\u5171\u722C\u53D6\u4E86 ' + comingMoviesLink.length + ' \u4E2A\u7535\u5F71 url');
            // 更新当前新电影列表 url 到本地
            fs.writeFileSync('./comingMovieUri.json', JSON.stringify(comingMoviesLink, null, 2), 'utf8');

            // 爬取豆瓣即将上映电影的poster、上映日期、片长
            i = 0;

          case 20:
            if (!(i < comingMoviesLink.length)) {
              _context4.next = 32;
              break;
            }

            _context4.next = 23;
            return getComingMovie({ movieUrl: comingMoviesLink[i] });

          case 23:
            movie = _context4.sent;

            comingMovies.push(movie);
            console.log('\u8FD9\u662F\u7B2C' + (i + 1) + '\u4E2A\u7535\u5F71\uFF0C\u300A' + movie.movieName + '\u300B');

            // 更新即将上映电影的 poster、上映日期、片长 到本地
            fs.writeFileSync('./comingMovie.json', JSON.stringify(comingMovies, null, 2), 'utf8');

            _context4.next = 29;
            return sleep(2);

          case 29:
            i++;
            _context4.next = 20;
            break;

          case 32:

            console.log('\u7535\u5F71\u57FA\u672C\u4FE1\u606F\u5168\u90E8\u722C\u53D6\u6210\u529F, \u5171\u8BA1' + comingMoviesLink.length);

          case 33:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, _this, [[7, 10]]);
  }));

  return function runMovieDetail() {
    return _ref5.apply(this, arguments);
  };
}();

/*
* 1.电影预告片列表 runMovieTrailer()
* 2.预告片的详细uil、封面 getMovieTrailer()
* */
var getMovieTrailer = function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee6() {
    var _ref8 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        movieUrl = _ref8.movieUrl,
        _ref8$restartCount = _ref8.restartCount,
        restartCount = _ref8$restartCount === undefined ? 0 : _ref8$restartCount;

    var options, random, movieMsg;
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            options = {
              method: 'GET',
              uri: movieUrl.url + 'trailer',
              encoding: "utf-8"

              // 代理地址
            };
            random = Math.floor(Math.random() * proxy.length);
            // console.log(`随机数为${random}`)

            options.proxy = 'http://' + proxyConfig.user + ':' + proxyConfig.password + '@' + proxy[random] + ':' + proxyConfig.port;

            // request 请求
            _context6.next = 5;
            return new Promise(function (resolve) {
              request(options, function () {
                var _ref9 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee5(error, response, body) {
                  var $, trailerUri, trailerPoster, trailer, _trailer;

                  return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee5$(_context5) {
                    while (1) {
                      switch (_context5.prev = _context5.next) {
                        case 0:
                          $ = void 0;
                          _context5.prev = 1;

                          if (!error) {
                            _context5.next = 4;
                            break;
                          }

                          throw error;

                        case 4:
                          $ = cheerio.load(body, { decodeEntities: false });

                          _context5.next = 12;
                          break;

                        case 7:
                          _context5.prev = 7;
                          _context5.t0 = _context5['catch'](1);

                          nodemailer(_context5.t0);
                          console.log('\u722C\u53D6\u300A' + movieUrl.title + '\u300B\u5931\u8D25\uFF0C\u51C6\u5907\u91CD\u65B0\u5F00\u59CB\u722C\u53D6\n\u9519\u8BEF\u65E5\u5FD7' + _context5.t0 + '\n\u91CD\u542F\u6B21\u6570\u4E3A' + restartCount);
                          console.error(_context5.t0);

                        case 12:
                          if (!$) {
                            _context5.next = 20;
                            break;
                          }

                          trailerUri = [];
                          trailerPoster = [];

                          $('.article a.pr-video').each(function () {
                            trailerUri.push($(this).attr('href'));
                            trailerPoster.push($(this).find('img').attr('src'));
                          });
                          trailer = {
                            movieName: $("#content>h1").text(),
                            trailerUri: trailerUri,
                            trailerPoster: trailerPoster,
                            id: movieUrl.url.match(/\/subject\/(\S*)\//)[1]
                          };

                          resolve(trailer);
                          _context5.next = 32;
                          break;

                        case 20:
                          /*
                          *  需要限制重启次数，目前只能重启 4 次
                          *  超过 4 次将发送邮件通知
                          * */
                          restartCount++;

                          if (!(restartCount < 5)) {
                            _context5.next = 30;
                            break;
                          }

                          _context5.next = 24;
                          return sleep(2);

                        case 24:
                          _context5.next = 26;
                          return getMovieTrailer({ movieUrl: movieUrl, restartCount: restartCount });

                        case 26:
                          _trailer = _context5.sent;

                          resolve(_trailer);
                          _context5.next = 32;
                          break;

                        case 30:
                          console.log('\u76EE\u524D\u91CD\u542F\u6B21\u6570\u4E3A' + restartCount + ', \u91CD\u590D\u6B21\u6570\u8FC7\u591A\uFF0C\u4E0D\u53EF\u6297\u62D2\u56E0\u7D20\uFF0C\u5C06\u53D1\u8D77\u90AE\u4EF6\u901A\u77E5');
                          resolve('\u722C\u53D6\u5931\u8D25\uFF0C\u91CD\u542F\u6B21\u6570\u4E3A' + restartCount);

                        case 32:
                        case 'end':
                          return _context5.stop();
                      }
                    }
                  }, _callee5, this, [[1, 7]]);
                }));

                return function (_x8, _x9, _x10) {
                  return _ref9.apply(this, arguments);
                };
              }());
            });

          case 5:
            movieMsg = _context6.sent;

            if ((typeof movieMsg === 'undefined' ? 'undefined' : _typeof(movieMsg)) === "object") console.log('\u7535\u5F71 \u300A' + movieMsg.movieName + '\u300B \u722C\u53D6\u6210\u529F');
            return _context6.abrupt('return', movieMsg);

          case 8:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, _this);
  }));

  return function getMovieTrailer() {
    return _ref7.apply(this, arguments);
  };
}();
var runMovieTrailer = function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee7() {
    var comingMoviesLink, Trailer, i, trailer;
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            comingMoviesLink = __webpack_require__(11); // 全部电影的 url

            Trailer = [];

            console.log(comingMoviesLink.length);
            i = 0;

          case 4:
            if (!(i < comingMoviesLink.length)) {
              _context7.next = 16;
              break;
            }

            _context7.next = 7;
            return getMovieTrailer({ movieUrl: comingMoviesLink[i] });

          case 7:
            trailer = _context7.sent;

            Trailer.push(trailer);
            console.log('\u8FD9\u662F\u7B2C' + (i + 1) + '\u4E2A\u7535\u5F71\u7684\u9884\u544A\u7247\u5217\u8868, ' + trailer.movieName);

            fs.writeFileSync('./comingMovieTrailer.json', JSON.stringify(Trailer, null, 2), 'utf8');
            _context7.next = 13;
            return sleep(2);

          case 13:
            i++;
            _context7.next = 4;
            break;

          case 16:
            console.log('\u7535\u5F71\u9884\u544A\u7247\u5217\u8868\u5168\u90E8\u722C\u53D6\u6210\u529F, \u5171\u8BA1' + comingMoviesLink.length);

          case 17:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, _this);
  }));

  return function runMovieTrailer() {
    return _ref10.apply(this, arguments);
  };
}();

/*
* 1.电影预告详细信息获取 runMovieTrailerDetail
* 2.videolink、title、发布日期 getMovieTrailerDetail
* 3.请求失败重新请求 toRequest
* */
var toRequest = function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee9() {
    var _ref12 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        trailerUrl = _ref12.trailerUrl,
        trailerPoster = _ref12.trailerPoster,
        _ref12$restartCount = _ref12.restartCount,
        restartCount = _ref12$restartCount === undefined ? 1 : _ref12$restartCount;

    var options, random, movieMsg;
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            options = {
              method: 'GET',
              uri: '' + trailerUrl,
              encoding: "utf-8"
              // 代理地址
            };
            random = Math.floor(Math.random() * proxy.length);
            // console.log(`随机数为${random}`)

            options.proxy = 'http://' + proxyConfig.user + ':' + proxyConfig.password + '@' + proxy[random] + ':' + proxyConfig.port;

            // request 请求
            _context9.next = 5;
            return new Promise(function (resolve) {
              request(options, function () {
                var _ref13 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee8(error, response, body) {
                  var $, trailer;
                  return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee8$(_context8) {
                    while (1) {
                      switch (_context8.prev = _context8.next) {
                        case 0:
                          $ = void 0;

                          try {
                            $ = cheerio.load(body, { decodeEntities: false });
                          } catch (e) {
                            nodemailer(e);
                            console.log('\u722C\u53D6\u300A' + trailerUrl + '\u300B\u5931\u8D25\uFF0C\u51C6\u5907\u91CD\u65B0\u5F00\u59CB\u722C\u53D6\n\u9519\u8BEF\u65E5\u5FD7' + e + '\n\u91CD\u542F\u6B21\u6570\u4E3A' + restartCount);
                            // console.error(e);
                          }

                          if (!$) {
                            _context8.next = 7;
                            break;
                          }

                          console.log('\u7535\u5F71 \u300A' + trailerUrl + '\u300B \u91CD\u65B0\u722C\u53D6\u6210\u529F,\u91CD\u542F\u6B21\u6570\u4E3A' + restartCount);

                          resolve({
                            trailerMP4: $('#movie_player source').attr('src'),
                            trailerTitle: $('h1').text(),
                            trailerDate: $('.trailer-info>span').html(),
                            trailerPoster: trailerPoster,
                            trailerId: uuid.v1().replace(/-/g, "")
                          });
                          _context8.next = 19;
                          break;

                        case 7:
                          /*
                          *  需要限制重启次数，目前只能重启 4 次
                          *  超过 4 次将发送邮件通知
                          * */
                          restartCount++;

                          if (!(restartCount < 5)) {
                            _context8.next = 17;
                            break;
                          }

                          _context8.next = 11;
                          return sleep(2);

                        case 11:
                          _context8.next = 13;
                          return toRequest({ trailerUrl: trailerUrl, restartCount: restartCount });

                        case 13:
                          trailer = _context8.sent;

                          resolve(trailer);
                          _context8.next = 19;
                          break;

                        case 17:
                          console.log('\u76EE\u524D\u91CD\u542F\u6B21\u6570\u4E3A' + (restartCount - 1) + ', \u91CD\u590D\u6B21\u6570\u8FC7\u591A\uFF0C\u4E0D\u53EF\u6297\u62D2\u56E0\u7D20\uFF0C\u5C06\u53D1\u8D77\u90AE\u4EF6\u901A\u77E5');
                          resolve('\u722C\u53D6\u5931\u8D25\uFF0C\u91CD\u542F\u6B21\u6570\u4E3A' + restartCount);

                        case 19:
                        case 'end':
                          return _context8.stop();
                      }
                    }
                  }, _callee8, this);
                }));

                return function (_x12, _x13, _x14) {
                  return _ref13.apply(this, arguments);
                };
              }());
            });

          case 5:
            movieMsg = _context9.sent;

            if ((typeof movieMsg === 'undefined' ? 'undefined' : _typeof(movieMsg)) === "object") console.log('\u7535\u5F71 \u300A' + trailerUrl + '\u300B \u91CD\u65B0\u722C\u53D6\u6210\u529F,\u91CD\u542F\u6B21\u6570\u4E3A' + restartCount + '\u3002');
            return _context9.abrupt('return', movieMsg);

          case 8:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, _this);
  }));

  return function toRequest() {
    return _ref11.apply(this, arguments);
  };
}();

var getMovieTrailerDetail = function () {
  var _ref14 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee12(trailer) {
    var trailerArray;
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            // 判断有无预告片
            trailerArray = [];

            if (!(trailer.length !== 0)) {
              _context12.next = 5;
              break;
            }

            _context12.next = 4;
            return Promise.all(trailer.trailerUri.map(function () {
              var _ref15 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee11(item, index) {
                var options, random, movieMsg;
                return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee11$(_context11) {
                  while (1) {
                    switch (_context11.prev = _context11.next) {
                      case 0:
                        options = {
                          method: 'GET',
                          uri: '' + item,
                          encoding: "utf-8"
                          // 代理地址
                        };
                        random = Math.floor(Math.random() * proxy.length);
                        // console.log(`随机数为${random}`)

                        options.proxy = 'http://' + proxyConfig.user + ':' + proxyConfig.password + '@' + proxy[random] + ':' + proxyConfig.port;

                        // request 请求
                        _context11.next = 5;
                        return new Promise(function (resolve) {
                          request(options, function () {
                            var _ref16 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee10(error, response, body) {
                              var $, _trailer2;

                              return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee10$(_context10) {
                                while (1) {
                                  switch (_context10.prev = _context10.next) {
                                    case 0:
                                      $ = void 0;

                                      try {
                                        $ = cheerio.load(body, { decodeEntities: false });
                                      } catch (e) {
                                        nodemailer(e);
                                        console.log('\u722C\u53D6\u300A' + trailer.movieName + '\u300B\u5931\u8D25\uFF0C\u51C6\u5907\u91CD\u65B0\u5F00\u59CB\u722C\u53D6\n\u9519\u8BEF\u65E5\u5FD7' + e);
                                        // console.error(e);
                                      }

                                      if (!$) {
                                        _context10.next = 6;
                                        break;
                                      }

                                      resolve({
                                        trailerMP4: $('#movie_player source').attr('src'),
                                        trailerTitle: $('h1').text(),
                                        trailerDate: $('.trailer-info>span').html(),
                                        trailerPoster: trailer.trailerPoster[index],
                                        // trailerId: uuid.v1().replace(/-/g, "")
                                        trailerId: trailer.id
                                      });
                                      _context10.next = 12;
                                      break;

                                    case 6:
                                      _context10.next = 8;
                                      return sleep(2);

                                    case 8:
                                      _context10.next = 10;
                                      return toRequest({ trailerUrl: item, trailerPoster: _trailer2.trailerPoster[index] });

                                    case 10:
                                      _trailer2 = _context10.sent;

                                      resolve(_trailer2);

                                    case 12:
                                    case 'end':
                                      return _context10.stop();
                                  }
                                }
                              }, _callee10, this);
                            }));

                            return function (_x18, _x19, _x20) {
                              return _ref16.apply(this, arguments);
                            };
                          }());
                        });

                      case 5:
                        movieMsg = _context11.sent;
                        return _context11.abrupt('return', movieMsg);

                      case 7:
                      case 'end':
                        return _context11.stop();
                    }
                  }
                }, _callee11, _this);
              }));

              return function (_x16, _x17) {
                return _ref15.apply(this, arguments);
              };
            }()));

          case 4:
            trailerArray = _context12.sent;

          case 5:
            return _context12.abrupt('return', {
              trailerArray: trailerArray,
              id: trailer.id,
              trailerTitle: trailer.movieName
            });

          case 6:
          case 'end':
            return _context12.stop();
        }
      }
    }, _callee12, _this);
  }));

  return function getMovieTrailerDetail(_x15) {
    return _ref14.apply(this, arguments);
  };
}();
var runMovieTrailerDetail = function () {
  var _ref17 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee13() {
    var comingTrailerLink, Trailer, i, trailer;
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            comingTrailerLink = __webpack_require__(28);
            Trailer = [];
            _context13.prev = 2;
            i = 0;

          case 4:
            if (!(i < comingTrailerLink.length)) {
              _context13.next = 16;
              break;
            }

            _context13.next = 7;
            return getMovieTrailerDetail(comingTrailerLink[i]);

          case 7:
            trailer = _context13.sent;

            Trailer.push(trailer);

            console.log('\u8FD9\u662F\u7B2C' + (i + 1) + '\u4E2A\u7535\u5F71\u7684\u9884\u544A\u8BE6\u7EC6\u4FE1\u606F, \u300A' + trailer.trailerTitle + '\u300B');

            fs.writeFileSync('./comingMovieTrailerDetail.json', JSON.stringify(Trailer, null, 2), 'utf8');
            _context13.next = 13;
            return sleep(2);

          case 13:
            i++;
            _context13.next = 4;
            break;

          case 16:
            _context13.next = 22;
            break;

          case 18:
            _context13.prev = 18;
            _context13.t0 = _context13['catch'](2);

            nodemailer(_context13.t0);
            console.log(_context13.t0);

          case 22:
            console.log('\u7535\u5F71\u9884\u544A\u8BE6\u7EC6\u5168\u90E8\u722C\u53D6\u6210\u529F, \u5171\u8BA1' + comingTrailerLink.length);

          case 23:
          case 'end':
            return _context13.stop();
        }
      }
    }, _callee13, _this, [[2, 18]]);
  }));

  return function runMovieTrailerDetail() {
    return _ref17.apply(this, arguments);
  };
}();

/*
* 获取电影的剧照、海报
* runMoviePhotos
* getMoviePhotos
* */
var getMoviePhotos = function () {
  var _ref18 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee15() {
    var _ref19 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        movieUrl = _ref19.movieUrl,
        _ref19$restartCount = _ref19.restartCount,
        restartCount = _ref19$restartCount === undefined ? 0 : _ref19$restartCount;

    var options, random, movieMsg;
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            options = {
              method: 'GET',
              uri: movieUrl.url + '/all_photos',
              encoding: "utf-8"
              // 代理地址
            };
            random = Math.floor(Math.random() * proxy.length);
            // console.log(`随机数为${random}`)

            options.proxy = 'http://' + proxyConfig.user + ':' + proxyConfig.password + '@' + proxy[random] + ':' + proxyConfig.port;

            // request 请求
            _context15.next = 5;
            return new Promise(function (resolve) {
              request(options, function () {
                var _ref20 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee14(error, response, body) {
                  var $, stagePhotos, photo;
                  return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee14$(_context14) {
                    while (1) {
                      switch (_context14.prev = _context14.next) {
                        case 0:
                          $ = void 0;
                          _context14.prev = 1;

                          if (!error) {
                            _context14.next = 4;
                            break;
                          }

                          throw error;

                        case 4:
                          $ = cheerio.load(body, { decodeEntities: false });

                          _context14.next = 11;
                          break;

                        case 7:
                          _context14.prev = 7;
                          _context14.t0 = _context14['catch'](1);

                          console.log('\u722C\u53D6\u300A' + movieUrl.title + '\u300B\u5931\u8D25\uFF0C\u51C6\u5907\u91CD\u65B0\u5F00\u59CB\u722C\u53D6\n\u9519\u8BEF\u65E5\u5FD7' + _context14.t0);
                          nodemailer(_context14.t0);
                          // console.error(e);

                        case 11:
                          if (!$) {
                            _context14.next = 17;
                            break;
                          }

                          stagePhotos = [];

                          $('.article .pic-col5 li a').each(function () {
                            stagePhotos.push($(this).find('img').attr('src'));
                          });

                          resolve({
                            movieName: $("#content>h1").text(),
                            stagePhotos: stagePhotos,
                            id: movieUrl.url.match(/\/subject\/(\S*)\//)[1]
                          });
                          _context14.next = 29;
                          break;

                        case 17:
                          /*
                          *  需要限制重启次数，目前只能重启 4 次
                          *  超过 4 次将发送邮件通知
                          * */
                          restartCount++;

                          if (!(restartCount < 5)) {
                            _context14.next = 27;
                            break;
                          }

                          _context14.next = 21;
                          return sleep(2);

                        case 21:
                          _context14.next = 23;
                          return getMoviePhotos({ movieUrl: movieUrl, restartCount: restartCount });

                        case 23:
                          photo = _context14.sent;

                          resolve(photo);
                          _context14.next = 29;
                          break;

                        case 27:
                          console.log('\u76EE\u524D\u91CD\u542F\u6B21\u6570\u4E3A' + (restartCount - 1) + ', \u91CD\u590D\u6B21\u6570\u8FC7\u591A\uFF0C\u4E0D\u53EF\u6297\u62D2\u56E0\u7D20\uFF0C\u5C06\u53D1\u8D77\u90AE\u4EF6\u901A\u77E5');
                          resolve('\u722C\u53D6\u5931\u8D25\uFF0C\u91CD\u542F\u6B21\u6570\u4E3A' + (restartCount - 1));

                        case 29:
                        case 'end':
                          return _context14.stop();
                      }
                    }
                  }, _callee14, this, [[1, 7]]);
                }));

                return function (_x22, _x23, _x24) {
                  return _ref20.apply(this, arguments);
                };
              }());
            });

          case 5:
            movieMsg = _context15.sent;

            if ((typeof movieMsg === 'undefined' ? 'undefined' : _typeof(movieMsg)) === "object") console.log('\u7535\u5F71 \u300A' + movieUrl.title + '\u300B \u91CD\u65B0\u722C\u53D6\u6210\u529F,\u91CD\u542F\u6B21\u6570\u4E3A' + restartCount + '\u3002');
            return _context15.abrupt('return', movieMsg);

          case 8:
          case 'end':
            return _context15.stop();
        }
      }
    }, _callee15, _this);
  }));

  return function getMoviePhotos() {
    return _ref18.apply(this, arguments);
  };
}();
var runMoviePhotos = function () {
  var _ref21 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee16() {
    var comingMoviesLink, stagePhotos, i, photo;
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            comingMoviesLink = __webpack_require__(11);
            stagePhotos = [];
            i = 0;

          case 3:
            if (!(i < comingMoviesLink.length)) {
              _context16.next = 13;
              break;
            }

            _context16.next = 6;
            return getMoviePhotos({ movieUrl: comingMoviesLink[i] });

          case 6:
            photo = _context16.sent;

            stagePhotos.push(photo);

            console.log('\u8FD9\u662F\u7B2C' + (i + 1) + '\u4E2A\u7535\u5F71\u7684\u5267\u7167, ' + photo.movieName);
            fs.writeFileSync('./comingMovieStagePhotos.json', JSON.stringify(stagePhotos, null, 2), 'utf8');
            // await sleep(2) // 间歇 2s

          case 10:
            i++;
            _context16.next = 3;
            break;

          case 13:
            console.log('\u7535\u5F71\u5267\u7167\u5168\u90E8\u722C\u53D6\u5B8C\u6210, \u5171\u8BA1' + comingMoviesLink.length);

          case 14:
          case 'end':
            return _context16.stop();
        }
      }
    }, _callee16, _this);
  }));

  return function runMoviePhotos() {
    return _ref21.apply(this, arguments);
  };
}();
module.exports = { runMovieDetail: runMovieDetail, runMovieTrailer: runMovieTrailer, runMovieTrailerDetail: runMovieTrailerDetail, runMoviePhotos: runMoviePhotos };

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

var qiniu = __webpack_require__(39);
var request = __webpack_require__(6);
var crypto = __webpack_require__(34);

var accessKey = 'LIWJTwQKsmsTvBrNLD0k-nu62diiEFKw34NfWj9P';
var secretKey = 'R88bNThcj1GjiIY7D8BOANGUzCRJ6bTaC6DVE2t1';
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

var uploadQiniuFile = function uploadQiniuFile(fileUrl, fileName) {
  // 管理凭证
  function genManageToken(accessKey, secretKey, pathAndQuery, body) {
    var data = pathAndQuery + '\n' + body;
    var hash = qiniu.util.hmacSha1(data, secretKey);
    hash = qiniu.util.base64ToUrlSafe(hash);
    return accessKey + ":" + hash;
  }

  // let picUrl = 'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2517591798.jpg'
  fileUrl = qiniu.util.urlsafeBase64Encode(fileUrl);
  var bucket = 'filmgo';
  // let key = 'p2517591798.png'
  var key = fileName;
  bucket = qiniu.util.encodedEntry(bucket, key);

  var path = "/fetch/" + fileUrl + "/to/" + bucket;
  var fetchUrl = "http://iovip.qbox.me" + path;

  var targetOptions = {
    method: 'POST',
    url: fetchUrl,
    headers: {
      'Authorization': "QBox " + genManageToken(accessKey, secretKey, path, ""),
      'Content-Type': 'application/json'
    }
  };

  return new Promise(function (resolve, reject) {
    request(targetOptions, function (error, response, body) {
      try {

        if (error) throw error;
        console.log(body);
        resolve(body);
      } catch (e) {
        reject(e);
      }
    });
  });
};

module.exports = { uploadQiniuFile: uploadQiniuFile };

/***/ },
/* 26 */
/***/ function(module, exports) {

module.exports = []

/***/ },
/* 27 */
/***/ function(module, exports) {

module.exports = []

/***/ },
/* 28 */
/***/ function(module, exports) {

module.exports = []

/***/ },
/* 29 */
/***/ function(module, exports) {

module.exports = []

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

var map = {
	"./admin": 7,
	"./admin.js": 7,
	"./category": 8,
	"./category.js": 8,
	"./comment": 9,
	"./comment.js": 9,
	"./flim": 2,
	"./flim.js": 2,
	"./genre": 3,
	"./genre.js": 3,
	"./user": 10,
	"./user.js": 10
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 30;


/***/ },
/* 31 */
/***/ function(module, exports) {

module.exports = require("axios");

/***/ },
/* 32 */
/***/ function(module, exports) {

module.exports = require("bcryptjs");

/***/ },
/* 33 */
/***/ function(module, exports) {

module.exports = require("cheerio");

/***/ },
/* 34 */
/***/ function(module, exports) {

module.exports = require("crypto");

/***/ },
/* 35 */
/***/ function(module, exports) {

module.exports = require("ejs");

/***/ },
/* 36 */
/***/ function(module, exports) {

module.exports = require("koa-router");

/***/ },
/* 37 */
/***/ function(module, exports) {

module.exports = require("node-uuid");

/***/ },
/* 38 */
/***/ function(module, exports) {

module.exports = require("nodemailer");

/***/ },
/* 39 */
/***/ function(module, exports) {

module.exports = require("qiniu");

/***/ },
/* 40 */
/***/ function(module, exports) {

module.exports = require("regenerator-runtime");

/***/ },
/* 41 */
/***/ function(module, exports) {

module.exports = require("request-promise");

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_koa__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_koa___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_koa__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_nuxt__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_nuxt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_nuxt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_node_schedule__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_node_schedule___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_node_schedule__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_koa_session__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_koa_session___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_koa_session__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_koa2_cors__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_koa2_cors___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_koa2_cors__);


var start = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee2() {
    var _this = this;

    var app, host, port, config, nuxt, builder, CONFIG, scheduleRecurrenceRule;
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            app = new __WEBPACK_IMPORTED_MODULE_1_koa___default.a();
            host = process.env.HOST || '127.0.0.1';
            port = process.env.PORT || 5000;

            // Import and Set Nuxt.js options

            config = __webpack_require__(13);

            config.dev = !(app.env === 'production');

            // Instantiate nuxt.js
            nuxt = new __WEBPACK_IMPORTED_MODULE_2_nuxt__["Nuxt"](config);

            // Build in development

            if (!config.dev) {
              _context2.next = 10;
              break;
            }

            builder = new __WEBPACK_IMPORTED_MODULE_2_nuxt__["Builder"](nuxt);
            _context2.next = 10;
            return builder.build();

          case 10:
            app.use(__WEBPACK_IMPORTED_MODULE_5_koa2_cors___default()({
              origin: function origin(ctx) {
                return 'http://localhost:7998';
              },
              exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
              maxAge: 5,
              credentials: true,
              allowMethods: ['GET', 'POST', 'DELETE'],
              allowHeaders: ['Content-Type', 'Authorization', 'Accept']
            }));
            // body-parser
            app.use(bodyParser());

            // mongodb
            mongodb();

            // session
            app.keys = ['some session'];

            CONFIG = {
              key: 'SESSION', /** (string) cookie key (default is koa:sess) */
              /** (number || 'session') maxAge in ms (default is 1 days) */
              /** 'session' will result in a cookie that expires when session/browser is closed */
              /** Warning: If a session cookie is stolen, this cookie will never expire */
              maxAge: 86400000,
              overwrite: true, /** (boolean) can overwrite or not (default true) */
              httpOnly: true, /** (boolean) httpOnly or not (default true) */
              signed: true, /** (boolean) signed or not (default true) */
              rolling: false /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
            };

            app.use(__WEBPACK_IMPORTED_MODULE_4_koa_session___default()(CONFIG, app));

            // 定时爬虫

            scheduleRecurrenceRule = function scheduleRecurrenceRule() {

              var rule = new __WEBPACK_IMPORTED_MODULE_3_node_schedule___default.a.RecurrenceRule();
              rule.hour = 15;
              rule.minute = 15;
              rule.second = 0;

              __WEBPACK_IMPORTED_MODULE_3_node_schedule___default.a.scheduleJob(rule, function () {
                nodemailer();
                console.log('scheduleRecurrenceRule:' + new Date());
                crawler();
              });
            };

            crawler();
            scheduleRecurrenceRule();
            // routes
            app.use(filmApi.routes(), filmApi.allowedMethods());

            app.use(function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee(ctx, next) {
                return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return next();

                      case 2:
                        ctx.status = 200; // koa defaults to 404 when it sees that status is unset
                        ctx.req.session = ctx.session;
                        return _context.abrupt('return', new Promise(function (resolve, reject) {
                          ctx.res.on('close', resolve);
                          ctx.res.on('finish', resolve);
                          nuxt.render(ctx.req, ctx.res, function (promise) {
                            // nuxt.render passes a rejected promise into callback on error.
                            promise.then(resolve).catch(reject);
                          });
                        }));

                      case 5:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, _this);
              }));

              return function (_x, _x2) {
                return _ref2.apply(this, arguments);
              };
            }());

            app.listen(port, host);
            console.log('Server listening on ' + host + ':' + port); // eslint-disable-line no-console

          case 23:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function start() {
    return _ref.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }




// after end





var filmApi = __webpack_require__(16);
var mongodb = __webpack_require__(15);
var bodyParser = __webpack_require__(18);

var crawler = __webpack_require__(14);
var nodemailer = __webpack_require__(4);

start();

/***/ }
/******/ ]);
//# sourceMappingURL=main.map