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
/******/ 	return __webpack_require__(__webpack_require__.s = 27);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

module.exports = require("mongoose");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(25);


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
  rating: Object,
  abstract: String,
  year: String,
  images: Object,
  id: String,
  countries: Array,
  genres: [{
    name: String,
    source: {
      type: String,
      ref: 'Tag'
    }
  }],
  casts: Array,
  original_title: String,
  summary: String,
  directors: Array,
  releaseDate: Array,
  runtime: String,
  postPic: String,
  trailerPoster: String,
  trailerUri: Array,
  trailerArray: Array,
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

var mongoose = __webpack_require__(0);
var bcrypt = __webpack_require__(22);

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
/* 5 */
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
/* 6 */
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
/* 7 */
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
/* 8 */
/***/ function(module, exports) {

module.exports = require("fs");

/***/ },
/* 9 */
/***/ function(module, exports) {

module.exports = require("path");

/***/ },
/* 10 */
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__);


var _this = this;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fs = __webpack_require__(8);
var resolve = __webpack_require__(9).resolve;
var mongoose = __webpack_require__(0);
var config = __webpack_require__(18);

/*const models = resolve(__dirname, './schema')
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*js$/))
  .forEach(file => require(resolve(models, file)))*/
var models = resolve(__dirname, '../database/schema');
fs.readdirSync(models).filter(function (file) {
  return ~file.search(/^[^\.].*js$/);
}).forEach(function (file) {
  __webpack_require__(20)("./" + file);
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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__);


var _this = this;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var router = __webpack_require__(24)();
var axios = __webpack_require__(21);
var rp = __webpack_require__(26);
var cheerio = __webpack_require__(23);
var doubanAPI = 'http://api.douban.com/v2/movie/';
var fs = __webpack_require__(8);
var path = __webpack_require__(9);

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

var fetchFilms = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee4() {
    var films, _loop, i;

    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return axios.get(doubanAPI + 'coming_soon?count=100');

          case 2:
            films = _context4.sent;
            _loop = /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee3(i) {
              var film, filmObject, filmData;
              return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      _context3.next = 2;
                      return axios.get(doubanAPI + 'subject/' + films.data.subjects[i].id);

                    case 2:
                      film = _context3.sent;
                      filmObject = film.data;

                      console.log('\u7B2C' + (i + 1) + '\u4E2A\u7535\u5F71:"' + film.data.title + '"');
                      _context3.next = 7;
                      return Film.findOne({ id: film.data.id }).exec();

                    case 7:
                      filmData = _context3.sent;

                      if (filmData) {
                        _context3.next = 17;
                        break;
                      }

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
                        countries: film.data.countries
                      });
                      // 查询该标签：有 => 返回 tagId || 无 => 新建该标签，返回 tagId
                      _context3.next = 12;
                      return Promise.all(film.data.genres.map(function () {
                        var _ref3 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee2(item, index) {
                          var genreId;
                          return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee2$(_context2) {
                            while (1) {
                              switch (_context2.prev = _context2.next) {
                                case 0:
                                  _context2.next = 2;
                                  return fetchGenre(item, filmData._id);

                                case 2:
                                  genreId = _context2.sent;

                                  filmData.genres[index] = {
                                    name: item,
                                    source: genreId
                                  };
                                  return _context2.abrupt('return', genreId);

                                case 5:
                                case 'end':
                                  return _context2.stop();
                              }
                            }
                          }, _callee2, _this);
                        }));

                        return function (_x2, _x3) {
                          return _ref3.apply(this, arguments);
                        };
                      }()));

                    case 12:
                      filmData.save();
                      _context3.next = 15;
                      return sleep(2);

                    case 15:
                      _context3.next = 18;
                      break;

                    case 17:
                      console.log('该电影已存在');

                    case 18:
                    case 'end':
                      return _context3.stop();
                  }
                }
              }, _callee3, _this);
            });
            i = 0;

          case 5:
            if (!(i < films.data.subjects.length)) {
              _context4.next = 10;
              break;
            }

            return _context4.delegateYield(_loop(i), 't0', 7);

          case 7:
            i++;
            _context4.next = 5;
            break;

          case 10:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, _this);
  }));

  return function fetchFilms() {
    return _ref2.apply(this, arguments);
  };
}();
// 查询类型方法
var fetchGenre = function fetchGenre(genre, filmId) {
  return new Promise(function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee5(resolve) {
      var genreMsg;
      return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return Genre.findOne({ name: genre }).exec();

            case 2:
              genreMsg = _context5.sent;

              if (genreMsg) {
                _context5.next = 13;
                break;
              }

              _context5.next = 6;
              return new Genre({
                name: genre
              });

            case 6:
              genreMsg = _context5.sent;


              genreMsg.filmArray.push(filmId);
              _context5.next = 10;
              return genreMsg.save();

            case 10:
              resolve(genreMsg._id);
              _context5.next = 18;
              break;

            case 13:
              if (!(genreMsg.filmArray.indexOf(filmId) === -1)) {
                _context5.next = 17;
                break;
              }

              // 检测该标签内是否含有该电影的 _id ,按道理说这一步是多余的，先保留看看。
              genreMsg.filmArray.push(filmId);
              _context5.next = 17;
              return genreMsg.save();

            case 17:
              resolve(genreMsg._id);

            case 18:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, _this);
    }));

    return function (_x4) {
      return _ref4.apply(this, arguments);
    };
  }());
};
router.get('/api/film/comingsoon', function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee6(ctx, next) {
    var films;
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            fetchFilms();

            _context6.next = 3;
            return Film.find().exec();

          case 3:
            films = _context6.sent;

            ctx.body = {
              success: true,
              data: films
            };

          case 5:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, _this);
  }));

  return function (_x5, _x6) {
    return _ref5.apply(this, arguments);
  };
}());
// 读取本地爬取电影详细信息添加到数据空中
router.get('/api/coming', function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee8(ctx, next) {
    var filmDetail, filmTrailer, filmTrailerDetail;
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            filmDetail = __webpack_require__(19);
            filmTrailer = __webpack_require__(28);
            filmTrailerDetail = __webpack_require__(29);

            /*filmDetail.forEach(async (item) => {
              const film = await Film
                .findOne({id: item.id})
                .exec()
              if (film) {
                film.releaseDate = item.releaseDate
                film.runtime = item.runtime
                film.postPic = item.postPic
                film.save()
              }
            })*/
            /*filmTrailer.forEach(async (item) => {
              const film = await Film
                .findOne({id: item.id})
                .exec()
              if (film) {
                film.trailerUri = item.trailerUri
                film.trailerPoster = item.trailerPoster
                film.save()
              }
            })*/

            filmTrailerDetail.forEach(function () {
              var _ref7 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee7(item) {
                var film;
                return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        _context7.next = 2;
                        return Film.findOne({ id: item.id }).exec();

                      case 2:
                        film = _context7.sent;

                        if (film) {
                          film.trailerArray = item.trailerArray;
                          film.save();
                        }

                      case 4:
                      case 'end':
                        return _context7.stop();
                    }
                  }
                }, _callee7, _this);
              }));

              return function (_x9) {
                return _ref7.apply(this, arguments);
              };
            }());
            ctx.body = filmTrailerDetail;

          case 5:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, _this);
  }));

  return function (_x7, _x8) {
    return _ref6.apply(this, arguments);
  };
}());

module.exports = router;

/***/ },
/* 13 */
/***/ function(module, exports) {

module.exports = require("koa");

/***/ },
/* 14 */
/***/ function(module, exports) {

module.exports = require("koa-bodyparser");

/***/ },
/* 15 */
/***/ function(module, exports) {

module.exports = require("koa-session");

/***/ },
/* 16 */
/***/ function(module, exports) {

module.exports = require("koa2-cors");

/***/ },
/* 17 */
/***/ function(module, exports) {

module.exports = require("nuxt");

/***/ },
/* 18 */
/***/ function(module, exports) {

var config = {
  db: 'mongodb://127.0.0.1/filmgo'
};

module.exports = config;

/***/ },
/* 19 */
/***/ function(module, exports) {

module.exports = [{"releaseDate":["2018-05-26(中国大陆)"],"runtime":["115分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2522949767.jpg","id":"30212356"},{"releaseDate":["2018-05-29(中国大陆)"],"runtime":["98分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2521030550.jpg","id":"26931155"},{"releaseDate":["2018-05-29(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522423565.jpg","id":"30206391"},{"releaseDate":["2018-05-31(中国大陆)","2017-04-22(澳大利亚)"],"runtime":["96分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522418974.jpg","id":"27043980"},{"releaseDate":["2018-06-01(中国大陆)","2018-03-03(日本)"],"runtime":["109分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522814546.jpg","id":"27069070"},{"releaseDate":["2018-06-01(中国大陆)"],"runtime":["77分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522880124.jpg","id":"30166791"},{"releaseDate":["2018-06-01(中国大陆)"],"runtime":["75分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522417650.jpg","id":"30146980"},{"releaseDate":["2018-06-01(中国大陆)"],"runtime":["86分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2520957706.jpg","id":"30210411"},{"releaseDate":["2017-10-04(中国大陆)","2018-06-01(中国大陆重映)"],"runtime":["96分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2500310362.jpg","id":"27155186"},{"releaseDate":["2018-06-01(中国大陆)"],"runtime":["86分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2521787362.jpg","id":"30215891"},{"releaseDate":["2018-06-04(中国大陆)"],"runtime":["87分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522261261.jpg","id":"30215189"},{"releaseDate":["2018-06-06(中国大陆)"],"runtime":["90分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2521623353.jpg","id":"27157647"},{"releaseDate":["2018-06-08(中国大陆)","2017-10-30(法国)"],"runtime":["91分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2504312398.jpg","id":"26878103"},{"releaseDate":["2018-06-08(中国大陆)","2018-05-25(德国)"],"runtime":["90分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2521514516.jpg","id":"26949264"},{"releaseDate":["2018-06-08(中国大陆)"],"runtime":["90分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2521058735.jpg","id":"30211728"},{"releaseDate":["2018-06-08(中国大陆)"],"runtime":["91分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2521514148.jpg","id":"26813286"},{"releaseDate":["2018-06-08(中国大陆)","2017-04-29(美国)"],"runtime":["93分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2455179254.jpg","id":"26864182"},{"releaseDate":["2018-06-08(中国大陆)"],"runtime":["90分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2520319061.jpg","id":"30205398"},{"releaseDate":["2018-06-08(中国大陆)"],"runtime":["90分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2521135070.jpg","id":"30212351"},{"releaseDate":["2018-06-08(中国大陆贾丽)"],"runtime":["92分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2521615397.jpg","id":"30217368"},{"releaseDate":["2018-06-08(中国大陆)"],"runtime":["91分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522790480.jpg","id":"27098062"},{"releaseDate":["2018-06-08(中国大陆)"],"runtime":["95分钟"],"postPic":"https://img3.doubanio.com/f/movie/30c6263b6db26d055cbbe73fe653e29014142ea3/pics/movie/movie_default_large.png","id":"30230515"},{"releaseDate":["2018-06-15(中国大陆)","2018-06-22(美国)"],"runtime":["129分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522069454.jpg","id":"26416062"},{"releaseDate":["2018-06-15(中国大陆)"],"runtime":["99分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2522868749.jpg","id":"26888820"},{"releaseDate":["2018-06-15(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2516830381.jpg","id":"26818314"},{"releaseDate":["2018-06-15(中国大陆)"],"runtime":["100分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522804951.jpg","id":"26425435"},{"releaseDate":["2018-06-15(中国大陆)"],"runtime":["98分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2519541142.jpg","id":"30198241"},{"releaseDate":["2018-06-15(中国大陆)"],"runtime":["90分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522896473.jpg","id":"28022648"},{"releaseDate":["2018-06-15(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2520456341.jpg","id":"30199575"},{"releaseDate":["2018-06-15(中国大陆)"],"runtime":["90分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2516351522.jpg","id":"30133750"},{"releaseDate":["2018-06-16(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522682953.jpg","id":"26791910"},{"releaseDate":["2018-06-16(中国大陆)","2014-09-25(德国)"],"runtime":["84分钟(中国大陆)"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2522252598.jpg","id":"25971649"},{"releaseDate":["2018-06-16(中国大陆)"],"runtime":["87分钟"],"postPic":"https://img3.doubanio.com/f/movie/30c6263b6db26d055cbbe73fe653e29014142ea3/pics/movie/movie_default_large.png","id":"30224724"},{"releaseDate":["2018-06-22(中国大陆)","2018-06-15(美国)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522880251.jpg","id":"25849049"},{"releaseDate":["2018-06-22(中国大陆)"],"runtime":[],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2522070768.jpg","id":"26992383"},{"releaseDate":["2018-06-22(中国大陆)","2018-06-29(美国)"],"runtime":[],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2522417037.jpg","id":"26905469"},{"releaseDate":["2018-06-22(中国大陆)"],"runtime":["100分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2522778567.jpg","id":"27195080"},{"releaseDate":["2018-06-22(中国大陆)","2017-04-21(美国)"],"runtime":["87分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2441169754.jpg","id":"26990268"},{"releaseDate":["2018-06-22(中国大陆)"],"runtime":["98分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2520248029.jpg","id":"27622690"},{"releaseDate":["2018-06-22(中国大陆)"],"runtime":[],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2522338178.jpg","id":"26677141"},{"releaseDate":["2018-06-22(中国大陆)"],"runtime":["88分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522983382.jpg","id":"30230633"},{"releaseDate":["2018-06-26(中国大陆)"],"runtime":["91分钟"],"postPic":"https://img3.doubanio.com/f/movie/30c6263b6db26d055cbbe73fe653e29014142ea3/pics/movie/movie_default_large.png","id":"30224593"},{"releaseDate":["2018-06-29(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2518144226.jpg","id":"26925317"},{"releaseDate":["2018-06-29(中国大陆)"],"runtime":["120分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2516223720.jpg","id":"27045333"},{"releaseDate":["2018-06-30(中国大陆)"],"runtime":["90分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2521694269.jpg","id":"26775743"},{"releaseDate":["2018-06(中国大陆)","2016-07-23(FIRST青年影展)"],"runtime":["110分钟(FIRST电影节版)"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2517482882.jpg","id":"26820833"},{"releaseDate":["2018-06(中国大陆)","2017-12-09(日本)"],"runtime":["129分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2500030418.jpg","id":"26916229"},{"releaseDate":["2018-06(中国大陆)","2018-06-29(美国)"],"runtime":["122分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2516825833.jpg","id":"26627736"},{"releaseDate":["2018-06(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2514930111.jpg","id":"26930565"},{"releaseDate":["2018-06(中国大陆)","2014-09-11(德国)"],"runtime":["78分钟(法国)"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2234785674.jpg","id":"25881500"}]

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

var map = {
	"./admin": 4,
	"./admin.js": 4,
	"./category": 5,
	"./category.js": 5,
	"./comment": 6,
	"./comment.js": 6,
	"./flim": 2,
	"./flim.js": 2,
	"./genre": 3,
	"./genre.js": 3,
	"./user": 7,
	"./user.js": 7
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
webpackContext.id = 20;


/***/ },
/* 21 */
/***/ function(module, exports) {

module.exports = require("axios");

/***/ },
/* 22 */
/***/ function(module, exports) {

module.exports = require("bcryptjs");

/***/ },
/* 23 */
/***/ function(module, exports) {

module.exports = require("cheerio");

/***/ },
/* 24 */
/***/ function(module, exports) {

module.exports = require("koa-router");

/***/ },
/* 25 */
/***/ function(module, exports) {

module.exports = require("regenerator-runtime");

/***/ },
/* 26 */
/***/ function(module, exports) {

module.exports = require("request-promise");

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_koa__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_koa___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_koa__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_nuxt__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_nuxt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_nuxt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_koa_session__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_koa_session___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_koa_session__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_koa2_cors__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_koa2_cors___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_koa2_cors__);


var start = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee2() {
    var _this = this;

    var app, host, port, config, nuxt, builder, CONFIG;
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            app = new __WEBPACK_IMPORTED_MODULE_1_koa___default.a();
            host = process.env.HOST || '127.0.0.1';
            port = process.env.PORT || 5000;

            // Import and Set Nuxt.js options

            config = __webpack_require__(10);

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
            app.use(__WEBPACK_IMPORTED_MODULE_4_koa2_cors___default()({
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

            app.use(__WEBPACK_IMPORTED_MODULE_3_koa_session___default()(CONFIG, app));

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

          case 20:
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





var filmApi = __webpack_require__(12);
var mongodb = __webpack_require__(11);
var bodyParser = __webpack_require__(14);

start();

/***/ },
/* 28 */
/***/ function(module, exports) {

module.exports = [{"trailerUri":[],"id":"30212356"},{"trailerUri":["https://movie.douban.com/trailer/230988/#content","https://movie.douban.com/trailer/230734/#content","https://movie.douban.com/trailer/231031/#content"],"trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2522264979.jpg?","id":"26931155"},{"trailerUri":["https://movie.douban.com/trailer/231480/#content","https://movie.douban.com/trailer/231025/#content"],"trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2522264178.jpg?1526467545","id":"30206391"},{"trailerUri":["https://movie.douban.com/trailer/231483/#content","https://movie.douban.com/trailer/231338/#content","https://movie.douban.com/trailer/231231/#content","https://movie.douban.com/trailer/230439/#content"],"trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2521024553.jpg?","id":"27043980"},{"trailerUri":["https://movie.douban.com/trailer/225912/#content","https://movie.douban.com/trailer/218923/#content","https://movie.douban.com/trailer/224486/#content"],"trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2506389589.jpg?","id":"27069070"},{"trailerUri":["https://movie.douban.com/trailer/230355/#content"],"trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2520555566.jpg?","id":"30166791"},{"trailerUri":["https://movie.douban.com/trailer/231482/#content","https://movie.douban.com/trailer/231034/#content","https://movie.douban.com/trailer/230309/#content"],"trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2520459241.jpg?1524821709","id":"30146980"},{"trailerUri":[],"id":"30210411"},{"trailerUri":[],"id":"27155186"},{"trailerUri":["https://movie.douban.com/trailer/231047/#content"],"trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2522276623.jpg?1526475685","id":"30215891"},{"trailerUri":[],"id":"30215189"},{"trailerUri":["https://movie.douban.com/trailer/230728/#content"],"trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2521624765.jpg?","id":"27157647"},{"trailerUri":["https://movie.douban.com/trailer/221757/#content","https://movie.douban.com/trailer/223464/#content","https://movie.douban.com/trailer/220752/#content"],"trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2497217139.jpg?","id":"26878103"},{"trailerUri":["https://movie.douban.com/trailer/231035/#content","https://movie.douban.com/trailer/230732/#content"],"trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2521629827.jpg?","id":"26949264"},{"trailerUri":["https://movie.douban.com/trailer/230736/#content","https://movie.douban.com/trailer/231371/#content"],"trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2522871996.jpg?1527060918","id":"30211728"},{"trailerUri":["https://movie.douban.com/trailer/230989/#content"],"trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2522161643.jpg?1526365231","id":"26813286"},{"trailerUri":[],"id":"26864182"},{"trailerUri":["https://movie.douban.com/trailer/230242/#content","https://movie.douban.com/trailer/230241/#content"],"trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2520319743.jpg?","id":"30205398"},{"trailerUri":["https://movie.douban.com/trailer/230524/#content"],"trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2521137672.jpg?","id":"30212351"},{"trailerUri":["https://movie.douban.com/trailer/230812/#content"],"trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2521727470.jpg?","id":"30217368"},{"trailerUri":[],"id":"27098062"},{"trailerUri":[],"id":"30230515"},{"trailerUri":["https://movie.douban.com/trailer/231272/#content","https://movie.douban.com/trailer/231195/#content","https://movie.douban.com/trailer/231170/#content","https://movie.douban.com/trailer/231135/#content","https://movie.douban.com/trailer/231005/#content","https://movie.douban.com/trailer/230873/#content","https://movie.douban.com/trailer/230831/#content","https://movie.douban.com/trailer/230675/#content","https://movie.douban.com/trailer/230185/#content","https://movie.douban.com/trailer/229980/#content","https://movie.douban.com/trailer/227159/#content","https://movie.douban.com/trailer/229807/#content","https://movie.douban.com/trailer/224840/#content","https://movie.douban.com/trailer/224788/#content","https://movie.douban.com/trailer/224661/#content","https://movie.douban.com/trailer/224605/#content","https://movie.douban.com/trailer/231454/#content","https://movie.douban.com/trailer/231346/#content","https://movie.douban.com/trailer/231169/#content","https://movie.douban.com/trailer/231055/#content","https://movie.douban.com/trailer/230765/#content","https://movie.douban.com/trailer/231006/#content","https://movie.douban.com/trailer/224713/#content","https://movie.douban.com/trailer/224475/#content","https://movie.douban.com/trailer/231194/#content","https://movie.douban.com/trailer/231131/#content","https://movie.douban.com/trailer/231116/#content","https://movie.douban.com/trailer/230508/#content","https://movie.douban.com/trailer/230509/#content","https://movie.douban.com/trailer/224794/#content","https://movie.douban.com/trailer/224760/#content","https://movie.douban.com/trailer/231320/#content","https://movie.douban.com/trailer/231323/#content","https://movie.douban.com/trailer/231321/#content","https://movie.douban.com/trailer/229854/#content"],"trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2519462866.jpg?","id":"26416062"},{"trailerUri":[],"id":"26888820"},{"trailerUri":["https://movie.douban.com/trailer/230806/#content","https://movie.douban.com/trailer/230456/#content","https://movie.douban.com/trailer/228858/#content","https://movie.douban.com/trailer/230192/#content","https://movie.douban.com/trailer/231479/#content","https://movie.douban.com/trailer/231367/#content","https://movie.douban.com/trailer/231330/#content","https://movie.douban.com/trailer/231268/#content","https://movie.douban.com/trailer/231235/#content","https://movie.douban.com/trailer/231096/#content","https://movie.douban.com/trailer/231029/#content","https://movie.douban.com/trailer/231028/#content","https://movie.douban.com/trailer/230308/#content"],"trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2520458785.jpg?1524821744","id":"26818314"},{"trailerUri":["https://movie.douban.com/trailer/230810/#content","https://movie.douban.com/trailer/215828/#content","https://movie.douban.com/trailer/231329/#content","https://movie.douban.com/trailer/230258/#content","https://movie.douban.com/trailer/231331/#content","https://movie.douban.com/trailer/215829/#content","https://movie.douban.com/trailer/209537/#content"],"trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2408099657.jpg?","id":"26425435"},{"trailerUri":[],"id":"30198241"},{"trailerUri":[],"id":"28022648"},{"trailerUri":[],"id":"30199575"},{"trailerUri":[],"id":"30133750"},{"trailerUri":["https://movie.douban.com/trailer/229235/#content","https://movie.douban.com/trailer/206952/#content","https://movie.douban.com/trailer/231237/#content"],"trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2522689818.jpg?1526958322","id":"26791910"},{"trailerUri":[],"id":"25971649"},{"trailerUri":[],"id":"30224724"},{"trailerUri":["https://movie.douban.com/trailer/231374/#content","https://movie.douban.com/trailer/230941/#content","https://movie.douban.com/trailer/230942/#content","https://movie.douban.com/trailer/230911/#content","https://movie.douban.com/trailer/230907/#content","https://movie.douban.com/trailer/229791/#content","https://movie.douban.com/trailer/227567/#content","https://movie.douban.com/trailer/224048/#content","https://movie.douban.com/trailer/231319/#content","https://movie.douban.com/trailer/229532/#content","https://movie.douban.com/trailer/219230/#content"],"trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2493091000.jpg?","id":"25849049"},{"trailerUri":["https://movie.douban.com/trailer/230811/#content","https://movie.douban.com/trailer/222704/#content"],"trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2502327204.jpg?","id":"26992383"},{"trailerUri":["https://movie.douban.com/trailer/230977/#content","https://movie.douban.com/trailer/215555/#content"],"trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2455162806.jpg?","id":"26905469"},{"trailerUri":["https://movie.douban.com/trailer/231344/#content","https://movie.douban.com/trailer/228824/#content","https://movie.douban.com/trailer/231485/#content"],"trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2522981707.jpg?1527156018","id":"27195080"},{"trailerUri":["https://movie.douban.com/trailer/215177/#content"],"trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2453940424.jpg?","id":"26990268"},{"trailerUri":["https://movie.douban.com/trailer/231027/#content","https://movie.douban.com/trailer/231030/#content","https://movie.douban.com/trailer/231022/#content"],"trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2522261858.jpg?1526467664","id":"27622690"},{"trailerUri":["https://movie.douban.com/trailer/231332/#content"],"trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2522823068.jpg?1527045953","id":"26677141"},{"trailerUri":[],"id":"30230633"},{"trailerUri":[],"id":"30224593"},{"trailerUri":["https://movie.douban.com/trailer/230746/#content","https://movie.douban.com/trailer/229595/#content","https://movie.douban.com/trailer/226828/#content","https://movie.douban.com/trailer/221750/#content","https://movie.douban.com/trailer/231451/#content","https://movie.douban.com/trailer/230270/#content","https://movie.douban.com/trailer/221810/#content"],"trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2499809036.jpg?","id":"26925317"},{"trailerUri":[],"id":"27045333"},{"trailerUri":[],"id":"26775743"},{"trailerUri":["https://movie.douban.com/trailer/228974/#content","https://movie.douban.com/trailer/229192/#content","https://movie.douban.com/trailer/228661/#content"],"trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2516363063.jpg?","id":"26820833"},{"trailerUri":["https://movie.douban.com/trailer/230144/#content","https://movie.douban.com/trailer/218731/#content","https://movie.douban.com/trailer/224151/#content","https://movie.douban.com/trailer/224147/#content","https://movie.douban.com/trailer/224149/#content","https://movie.douban.com/trailer/230819/#content","https://movie.douban.com/trailer/230697/#content"],"trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2521614649.jpg?1525861663","id":"26916229"},{"trailerUri":["https://movie.douban.com/trailer/228839/#content","https://movie.douban.com/trailer/227424/#content","https://movie.douban.com/trailer/225252/#content"],"trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2508146897.jpg?","id":"26627736"},{"trailerUri":[],"id":"26930565"},{"trailerUri":["https://movie.douban.com/trailer/172324/#content","https://movie.douban.com/trailer/162001/#content"],"trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2198023743.jpg?","id":"25881500"}]

/***/ },
/* 29 */
/***/ function(module, exports) {

module.exports = [{"trailerArray":[],"id":"30212356"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201805251156/6efab80e5192d2050f673d012466cad8/view/movie/M/402300988.mp4","trailerTitle":"给19岁的我自己\n    预告片 (中文字幕)","trailerDate":"2018-05-15"},{"trailerMP4":"http://vt1.doubanio.com/201805251156/439d276cf0cab0cf3e5e02c6724c722f/view/movie/M/402300734.mp4","trailerTitle":"给19岁的我自己\n    花絮：撩妹特辑 (中文字幕)","trailerDate":"2018-05-09"},{"trailerMP4":"http://vt1.doubanio.com/201805251156/2469b4c9f13163a2eebff0ec43bcc333/view/movie/M/402310031.mp4","trailerTitle":"给19岁的我自己\n    MV：主题曲《我的星星 我的亲亲》 (中文字幕)","trailerDate":"2018-05-16"}],"id":"26931155"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201805251156/fea92c6fbd44bf76ca4d958b9da5cf06/view/movie/M/402310480.mp4","trailerTitle":"爱是永恒\n    预告片1：青春永存版 (中文字幕)","trailerDate":"2018-05-24"},{"trailerMP4":"http://vt1.doubanio.com/201805251156/c025ad0dc055ba404a613a78af09b594/view/movie/M/402310025.mp4","trailerTitle":"爱是永恒\n    预告片2：再见青春版 (中文字幕)","trailerDate":"2018-05-16"}],"id":"30206391"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201805251156/16c0539503712683a7e7d2852c654ce0/view/movie/M/402310483.mp4","trailerTitle":"我的宠物恐龙\n    预告片1：猛龙来袭版 (中文字幕)","trailerDate":"2018-05-24"},{"trailerMP4":"http://vt1.doubanio.com/201805251156/df88ddc69f1e5711c0974006888f5c56/view/movie/M/402310338.mp4","trailerTitle":"我的宠物恐龙\n    预告片2","trailerDate":"2018-05-22"},{"trailerMP4":"http://vt1.doubanio.com/201805251156/93cb95d49d07eddc39ee592af498255c/view/movie/M/402310231.mp4","trailerTitle":"我的宠物恐龙\n    预告片3：彩蛋版 (中文字幕)","trailerDate":"2018-05-21"},{"trailerMP4":"http://vt1.doubanio.com/201805251156/c08ed6e8c5998710a873927ceec4cdd1/view/movie/M/402300439.mp4","trailerTitle":"我的宠物恐龙\n    中国先行版 (中文字幕)","trailerDate":"2018-05-03"}],"id":"27043980"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201805251156/827e28de9215e99107e12a3c63612848/view/movie/M/302250912.mp4","trailerTitle":"哆啦A梦：大雄的金银岛\n    日本预告片1","trailerDate":"2018-01-09"},{"trailerMP4":"http://vt1.doubanio.com/201805251156/965360b8c59c020d610a43c8846da191/view/movie/M/302180923.mp4","trailerTitle":"哆啦A梦：大雄的金银岛\n    预告片2","trailerDate":"2017-07-07"},{"trailerMP4":"http://vt1.doubanio.com/201805251156/6ba2dda76db6e1cee37ae44275b18d0a/view/movie/M/302240486.mp4","trailerTitle":"哆啦A梦：大雄的金银岛\n    电视版","trailerDate":"2017-12-01"}],"id":"27069070"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201805251156/0ffc43a4c1dcc975f3d8a8b4070a29e3/view/movie/M/402300355.mp4","trailerTitle":"魔镜奇缘2\n    预告片","trailerDate":"2018-04-28"}],"id":"30166791"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201805251156/7f02cf3895cb98bd89a6e160844051a5/view/movie/M/402310482.mp4","trailerTitle":"潜艇总动员：海底两万里\n    预告片1：终极版 (中文字幕)","trailerDate":"2018-05-24"},{"trailerMP4":"http://vt1.doubanio.com/201805251156/4e8c5cd35a39ebcb45814ccc767b2a26/view/movie/M/402310034.mp4","trailerTitle":"潜艇总动员：海底两万里\n    预告片2 (中文字幕)","trailerDate":"2018-05-16"},{"trailerMP4":"http://vt1.doubanio.com/201805251156/f12cc8d329baa225c53e66b52e562a24/view/movie/M/402300309.mp4","trailerTitle":"潜艇总动员：海底两万里\n    先行版 (中文字幕)","trailerDate":"2018-04-27"}],"id":"30146980"},{"trailerArray":[],"id":"30210411"},{"trailerArray":[],"id":"27155186"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201805251156/4528b16b917423ec672e0ae5e8cbb9a4/view/movie/M/402310047.mp4","trailerTitle":"寻找雪山\n    预告片 (中文字幕)","trailerDate":"2018-05-16"}],"id":"30215891"},{"trailerArray":[],"id":"30215189"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201805251156/241a82f7151af08823f6dd7303b0b7ae/view/movie/M/402300728.mp4","trailerTitle":"暗夜良人\n    预告片 (中文字幕)","trailerDate":"2018-05-09"}],"id":"27157647"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201805251156/acfae612b70b2fb7bbe5dd5ebed7a735/view/movie/M/302210757.mp4","trailerTitle":"暮光·巴黎\n    中国预告片：LOVE版 (中文字幕)","trailerDate":"2017-09-21"},{"trailerMP4":"http://vt1.doubanio.com/201805251156/fdea2c5d182ea038c6d766bb2a85523c/view/movie/M/302230464.mp4","trailerTitle":"暮光·巴黎\n    MV1：插曲《The Perfect Day》 (中文字幕)","trailerDate":"2017-11-04"},{"trailerMP4":"http://vt1.doubanio.com/201805251156/5bfd85df19038938ec6ca136ae970350/view/movie/M/302200752.mp4","trailerTitle":"暮光·巴黎\n    MV2：丁可献唱主题曲《晴歌》 (中文字幕)","trailerDate":"2017-08-25"}],"id":"26878103"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201805251156/83f9c1182d6f556090e265c5e682f6cd/view/movie/M/402310035.mp4","trailerTitle":"深海越狱\n    中国预告片：剧情版 (中文字幕)","trailerDate":"2018-05-16"},{"trailerMP4":"http://vt1.doubanio.com/201805251156/6bd6d3638bc48b87fa27bf991d694e26/view/movie/M/402300732.mp4","trailerTitle":"深海越狱\n    中国先行版 (中文字幕)","trailerDate":"2018-05-09"}],"id":"26949264"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201805251156/ad51e3fc99eaed33d9349fdf9655b2a6/view/movie/M/402300736.mp4","trailerTitle":"一个人的江湖\n    预告片 (中文字幕)","trailerDate":"2018-05-09"},{"trailerMP4":"http://vt1.doubanio.com/201805251156/1a4f290dfbc801861f7fa9440c2a37f8/view/movie/M/402310371.mp4","trailerTitle":"一个人的江湖\n    MV：主题曲《跨越》 (中文字幕)","trailerDate":"2018-05-23"}],"id":"30211728"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201805251156/e51881060c4ae911d9f5ca39f21f3da1/view/movie/M/402300989.mp4","trailerTitle":"幸福马上来\n    预告片 (中文字幕)","trailerDate":"2018-05-15"}],"id":"26813286"},{"trailerArray":[],"id":"26864182"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201805251156/b7fa5a34a4ac32450d241d5e1c987eb7/view/movie/M/402300242.mp4","trailerTitle":"因果启示录\n    预告片1 (中文字幕)","trailerDate":"2018-04-25"},{"trailerMP4":"http://vt1.doubanio.com/201805251156/489cbce73c0dfe201fd20c73cec3064b/view/movie/M/402300241.mp4","trailerTitle":"因果启示录\n    预告片2 (中文字幕)","trailerDate":"2018-04-25"}],"id":"30205398"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201805251157/e68a3a474b095744d9452c1936017724/view/movie/M/402300524.mp4","trailerTitle":"恐怖浴室\n    先行版 (中文字幕)","trailerDate":"2018-05-04"}],"id":"30212351"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201805251157/6cb85f886e511e481e1522cd3dc48ab6/view/movie/M/402300812.mp4","trailerTitle":"盯上小偷的贼\n    预告片 (中文字幕)","trailerDate":"2018-05-10"}],"id":"30217368"},{"trailerArray":[],"id":"27098062"},{"trailerArray":[],"id":"30230515"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201805251157/c56ba0f2989bd0b682283fea461e7de8/view/movie/M/402310272.mp4","trailerTitle":"侏罗纪世界2\n    预告片1","trailerDate":"2018-05-22"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/6ed532b9047b1790d0c93dec893f501c/view/movie/M/402310195.mp4","trailerTitle":"侏罗纪世界2\n    预告片2","trailerDate":"2018-05-20"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/92ff77ea487bf08ba4e965543738b5f1/view/movie/M/402310170.mp4","trailerTitle":"侏罗纪世界2\n    台湾预告片3 (中文字幕)","trailerDate":"2018-05-18"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/bc82990258cde24bb8fc4d8d6f7aa9e7/view/movie/M/402310135.mp4","trailerTitle":"侏罗纪世界2\n    预告片4","trailerDate":"2018-05-18"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/6748be345e01606a4c1186b5bde7a782/view/movie/M/402310005.mp4","trailerTitle":"侏罗纪世界2\n    预告片5","trailerDate":"2018-05-16"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/9a4d3c626de8b7030bf088a8c8f4cf6d/view/movie/M/402300873.mp4","trailerTitle":"侏罗纪世界2\n    中国预告片6：入侵版 (中文字幕)","trailerDate":"2018-05-11"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/0222bf71f38e6e7ae1faf06aff2a70ff/view/movie/M/402300831.mp4","trailerTitle":"侏罗纪世界2\n    预告片7","trailerDate":"2018-05-11"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/9f9439669622c7b466ee4a0c663973f4/view/movie/M/402300675.mp4","trailerTitle":"侏罗纪世界2\n    台湾预告片8 (中文字幕)","trailerDate":"2018-05-08"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/793ecfcc71bf5c9d6688094bfceed974/view/movie/M/402300185.mp4","trailerTitle":"侏罗纪世界2\n    中国预告片9：定档版 (中文字幕)","trailerDate":"2018-04-24"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/69b4e3dfb230717f18a5aeada94fd26a/view/movie/M/402290980.mp4","trailerTitle":"侏罗纪世界2\n    台湾预告片10 (中文字幕)","trailerDate":"2018-04-19"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/dda982a271b14c1b26f54b95ecff76c6/view/movie/M/302270159.mp4","trailerTitle":"侏罗纪世界2\n    中国预告片11：超级碗版 (中文字幕)","trailerDate":"2018-02-05"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/135b5d8bae8124247599d9207bf95645/view/movie/M/402290807.mp4","trailerTitle":"侏罗纪世界2\n    先行版1","trailerDate":"2018-04-13"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/e5423ff846e3b0cf6213e32b14154348/view/movie/M/302240840.mp4","trailerTitle":"侏罗纪世界2\n    中国先行版2 (中文字幕)","trailerDate":"2017-12-08"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/857105f31a1e793e8a93b8b2c925fee8/view/movie/M/302240788.mp4","trailerTitle":"侏罗纪世界2\n    台湾先行版3 (中文字幕)","trailerDate":"2017-12-07"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/42f2242212c4d3163d0bcf982c365a4a/view/movie/M/302240661.mp4","trailerTitle":"侏罗纪世界2\n    台湾先行版4 (中文字幕)","trailerDate":"2017-12-05"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/2f1432c30f27b2414fb84db6311e67d6/view/movie/M/302240605.mp4","trailerTitle":"侏罗纪世界2\n    台湾先行版5 (中文字幕)","trailerDate":"2017-12-04"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/52d3b93d48a14853c3cc3a5908299865/view/movie/M/402310454.mp4","trailerTitle":"侏罗纪世界2\n    电视版1 (中文字幕)","trailerDate":"2018-05-24"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/099e20310fa02b0f2e1ae09af78ea6f1/view/movie/M/402310346.mp4","trailerTitle":"侏罗纪世界2\n    电视版2","trailerDate":"2018-05-23"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/5defb7499ded9dbc98a13fc82337b1b9/view/movie/M/402310169.mp4","trailerTitle":"侏罗纪世界2\n    电视版3 (中文字幕)","trailerDate":"2018-05-18"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/299bcf3cc503402463c72adbc7af9bf9/view/movie/M/402310055.mp4","trailerTitle":"侏罗纪世界2\n    电视版4","trailerDate":"2018-05-17"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/b81c6222493f5de01c23ee15af41c01a/view/movie/M/402300765.mp4","trailerTitle":"侏罗纪世界2\n    电视版5","trailerDate":"2018-05-10"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/f2009a78d54f5d88057f5b19fad08954/view/movie/M/402310006.mp4","trailerTitle":"侏罗纪世界2\n    其它预告片1","trailerDate":"2018-05-16"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/b144baef1391ea4cbff4f19fe2b0093e/view/movie/M/302240713.mp4","trailerTitle":"侏罗纪世界2\n    其它预告片2：趣味病毒短片","trailerDate":"2017-12-06"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/1f755ab23a805f864e012154006d17d2/view/movie/M/302240475.mp4","trailerTitle":"侏罗纪世界2\n    片段","trailerDate":"2017-11-30"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/486183e5154337cc60c7d8aeded0366a/view/movie/M/402310194.mp4","trailerTitle":"侏罗纪世界2\n    花絮1 (中文字幕)","trailerDate":"2018-05-19"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/5eb961df7e71939f5014fb37b8207cb0/view/movie/M/402310131.mp4","trailerTitle":"侏罗纪世界2\n    花絮2","trailerDate":"2018-05-18"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/ed04d6e6609ac85a9843c4b9e8409534/view/movie/M/402310116.mp4","trailerTitle":"侏罗纪世界2\n    花絮3 (中文字幕)","trailerDate":"2018-05-17"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/eae9272529ef73becc315719f12a4f23/view/movie/M/402300508.mp4","trailerTitle":"侏罗纪世界2\n    花絮4","trailerDate":"2018-05-04"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/3c849272d16b25040b6dd4732ee6e4ff/view/movie/M/402300509.mp4","trailerTitle":"侏罗纪世界2\n    花絮5","trailerDate":"2018-05-04"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/b811750fbaf1d395790d44927bdb8946/view/movie/M/302240794.mp4","trailerTitle":"侏罗纪世界2\n    花絮6：制作特辑 (中文字幕)","trailerDate":"2017-12-07"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/cf672a9b1442ff1cfc41305c3be79859/view/movie/M/302240760.mp4","trailerTitle":"侏罗纪世界2\n    花絮7：制作特辑 (中文字幕)","trailerDate":"2017-12-07"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/85da1710039f6195e51d7acc28341821/view/movie/M/402310320.mp4","trailerTitle":"侏罗纪世界2\n    其它花絮1 (中文字幕)","trailerDate":"2018-05-22"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/5596633129607efd2c9055ade62580f0/view/movie/M/402310323.mp4","trailerTitle":"侏罗纪世界2\n    其它花絮2 (中文字幕)","trailerDate":"2018-05-22"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/57349759fd07c108682e785286f3913a/view/movie/M/402310321.mp4","trailerTitle":"侏罗纪世界2\n    其它花絮3 (中文字幕)","trailerDate":"2018-05-22"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/21963787e5b4578062ea2ea8a6366b3a/view/movie/M/402290854.mp4","trailerTitle":"侏罗纪世界2\n    其它花絮4：北影节问候 (中文字幕)","trailerDate":"2018-04-16"}],"id":"26416062"},{"trailerArray":[],"id":"26888820"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201805251157/047ba612a367bbc301e9739bd2ae055f/view/movie/M/402300806.mp4","trailerTitle":"猛虫过江\n    预告片1：千足金版 (中文字幕)","trailerDate":"2018-05-10"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/c1d34210b3e10498f9f7255b47c7af11/view/movie/M/402300456.mp4","trailerTitle":"猛虫过江\n    预告片2：致敬教父版 (中文字幕)","trailerDate":"2018-05-03"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/e654154700605ca5b039575ca51985fa/view/movie/M/302280858.mp4","trailerTitle":"猛虫过江\n    先行版 (中文字幕)","trailerDate":"2018-03-20"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/08bebadc34da056e50ba1655b6fee2f9/view/movie/M/402300192.mp4","trailerTitle":"猛虫过江\n    花絮：导演的诞生特辑 (中文字幕)","trailerDate":"2018-04-24"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/bb60bc73984efc7bda282370d21f238d/view/movie/M/402310479.mp4","trailerTitle":"猛虫过江\n    其它花絮1 (中文字幕)","trailerDate":"2018-05-24"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/ac6993ea147077fa23b734e210bf1929/view/movie/M/402310367.mp4","trailerTitle":"猛虫过江\n    其它花絮2 (中文字幕)","trailerDate":"2018-05-23"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/2d93cfc8bbe8cf5cd6216172ac6622d6/view/movie/M/402310330.mp4","trailerTitle":"猛虫过江\n    其它花絮3 (中文字幕)","trailerDate":"2018-05-22"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/fb86808f7a6448d42307005349063030/view/movie/M/402310268.mp4","trailerTitle":"猛虫过江\n    其它花絮4 (中文字幕)","trailerDate":"2018-05-21"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/8212dffec24ed12d3f14e23e872878f3/view/movie/M/402310235.mp4","trailerTitle":"猛虫过江\n    其它花絮5 (中文字幕)","trailerDate":"2018-05-21"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/1cfc61ad0ed5552097a1394f90738ede/view/movie/M/402310096.mp4","trailerTitle":"猛虫过江\n    其它花絮6 (中文字幕)","trailerDate":"2018-05-17"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/a502a8c8ebb4d986a9f15997a559d22f/view/movie/M/402310029.mp4","trailerTitle":"猛虫过江\n    其它花絮7 (中文字幕)","trailerDate":"2018-05-16"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/9df3729fa59d4071ea1a9560dbc57e09/view/movie/M/402310028.mp4","trailerTitle":"猛虫过江\n    其它花絮8 (中文字幕)","trailerDate":"2018-05-16"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/d9e6ad71ace42b3bdf8959321196abaa/view/movie/M/402300308.mp4","trailerTitle":"猛虫过江\n    其它花絮9","trailerDate":"2018-04-27"}],"id":"26818314"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201805251157/2502ea076cfef2e5b67179b85abe6bda/view/movie/M/402300810.mp4","trailerTitle":"泡菜爱上小龙虾\n    预告片：泡菜匠心版 (中文字幕)","trailerDate":"2018-05-10"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/61dd43642b6e7f8cdd686edfe5f2c0df/view/movie/M/302150828.mp4","trailerTitle":"泡菜爱上小龙虾\n    先行版：小龙王传奇版 (中文字幕)","trailerDate":"2017-04-19"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/1c9e10d121109327bceb51e30ffaa3d4/view/movie/M/402310329.mp4","trailerTitle":"泡菜爱上小龙虾\n    片段1 (中文字幕)","trailerDate":"2018-05-22"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/cdb7cd962e3210e4f1c5561bed24c1ab/view/movie/M/402300258.mp4","trailerTitle":"泡菜爱上小龙虾\n    片段2 (中文字幕)","trailerDate":"2018-04-26"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/fa6a4d12aba38c048d7549ab9a8732ce/view/movie/M/402310331.mp4","trailerTitle":"泡菜爱上小龙虾\n    MV1：同名主题曲 (中文字幕)","trailerDate":"2018-05-22"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/5d7084b52a5e64b82dd6635dd5a3b1b3/view/movie/M/302150829.mp4","trailerTitle":"泡菜爱上小龙虾\n    MV2：乌兰图雅演唱主题曲《世界那么大》 (中文字幕)","trailerDate":"2017-04-19"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/b3d7ec14914472652d4113c969fe4e2a/view/movie/M/302090537.mp4","trailerTitle":"泡菜爱上小龙虾\n    MV3：主题曲《世界那么大》 (中文字幕)","trailerDate":"2016-12-25"}],"id":"26425435"},{"trailerArray":[],"id":"30198241"},{"trailerArray":[],"id":"28022648"},{"trailerArray":[],"id":"30199575"},{"trailerArray":[],"id":"30133750"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201805251157/ffa0bb1a711979722bc13247a7ab843d/view/movie/M/402290235.mp4","trailerTitle":"吃货宇宙\n    预告片1：定档版 (中文字幕)","trailerDate":"2018-03-29"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/2e2273dec5218e4d318921a98016789a/view/movie/M/302060952.mp4","trailerTitle":"吃货宇宙\n    预告片2：国际版 (中文字幕)","trailerDate":"2016-11-09"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/ff73f36426fe951e38aa4369ac3013ca/view/movie/M/402310237.mp4","trailerTitle":"吃货宇宙\n    MV：主题曲《不一样》 (中文字幕)","trailerDate":"2018-05-21"}],"id":"26791910"},{"trailerArray":[],"id":"25971649"},{"trailerArray":[],"id":"30224724"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201805251157/e6c03cd9607493f8b922e9875394c16a/view/movie/M/402310374.mp4","trailerTitle":"超人总动员2\n    中国预告片1 (中文字幕)","trailerDate":"2018-05-23"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/41e45439f7e344a753eabb77c2622e48/view/movie/M/402300941.mp4","trailerTitle":"超人总动员2\n    台湾预告片2 (中文字幕)","trailerDate":"2018-05-14"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/dab455813eb0a13e9710d4a4b2dbf744/view/movie/M/402300942.mp4","trailerTitle":"超人总动员2\n    台湾预告片3 (中文字幕)","trailerDate":"2018-05-14"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/c78ea0805a56ceadfacef43a8817ee42/view/movie/M/402300911.mp4","trailerTitle":"超人总动员2\n    预告片4","trailerDate":"2018-05-12"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/60d94d041c136c9f871d03fe5204bdf8/view/movie/M/402300907.mp4","trailerTitle":"超人总动员2\n    预告片5","trailerDate":"2018-05-12"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/46a39629749f18da4ba0642a90468b0f/view/movie/M/402290791.mp4","trailerTitle":"超人总动员2\n    台湾预告片6 (中文字幕)","trailerDate":"2018-04-13"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/bf56307a8410af807ff1c016914c114c/view/movie/M/302270567.mp4","trailerTitle":"超人总动员2\n    台湾预告片7 (中文字幕)","trailerDate":"2018-02-15"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/7a250f39323d85152c31c2a0de12d18d/view/movie/M/302240048.mp4","trailerTitle":"超人总动员2\n    先行版","trailerDate":"2017-11-19"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/6ed08ae0b17afd61f6af791b12170293/view/movie/M/402310319.mp4","trailerTitle":"超人总动员2\n    其它预告片1 (中文字幕)","trailerDate":"2018-05-22"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/224ba46064ebb06bc2bb08b45a9114e5/view/movie/M/402290532.mp4","trailerTitle":"超人总动员2\n    其它预告片2","trailerDate":"2018-04-07"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/9f277734eedb19815ea14ad9ab335995/view/movie/M/302190230.mp4","trailerTitle":"超人总动员2\n    其它预告片3：病毒短片之衣夫人","trailerDate":"2017-07-16"}],"id":"25849049"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201805251157/2a64408bdddfe1b801bb03a545d338cf/view/movie/M/402300811.mp4","trailerTitle":"龙虾刑警\n    预告片：食破天机版 (中文字幕)","trailerDate":"2018-05-10"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/6c08e73a07c272dfc04962759047dcc8/view/movie/M/302220704.mp4","trailerTitle":"龙虾刑警\n    先行版 (中文字幕)","trailerDate":"2017-10-17"}],"id":"26992383"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201805251157/40b3fbde93c9eae83aa99c45f98a5441/view/movie/M/402300977.mp4","trailerTitle":"金蝉脱壳2\n    预告片","trailerDate":"2018-05-15"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/beda7acdfbe7e3a060fae362727758e4/view/movie/M/302150555.mp4","trailerTitle":"金蝉脱壳2\n    中国先行版 (中文字幕)","trailerDate":"2017-04-13"}],"id":"26905469"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201805251157/46e6cfbb9f52831e7aa8b431b429e2dc/view/movie/M/402310344.mp4","trailerTitle":"泄密者\n    内地预告片1：定档版 (中文字幕)","trailerDate":"2018-05-22"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/e0b73d8a040d29d8424a4b92d572542d/view/movie/M/302280824.mp4","trailerTitle":"泄密者\n    内地预告片2：见微知著版 (中文字幕)","trailerDate":"2018-03-20"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/3eaa670cf99ce7c3e0774eb0adab1547/view/movie/M/402310485.mp4","trailerTitle":"泄密者\n    其它花絮：港片情怀特辑 (中文字幕)","trailerDate":"2018-05-24"}],"id":"27195080"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201805251157/fa50b2d9e638120abbf02f5839735f29/view/movie/M/302150177.mp4","trailerTitle":"凤凰城遗忘录\n    预告片","trailerDate":"2017-04-05"}],"id":"26990268"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201805251157/9deac023ae4beb89396de708cf9dccc0/view/movie/M/402310027.mp4","trailerTitle":"青春不留白\n    花絮 (中文字幕)","trailerDate":"2018-05-16"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/7d896b3a320babf84d260753e8d1c25a/view/movie/M/402310030.mp4","trailerTitle":"青春不留白\n    其它花絮1 (中文字幕)","trailerDate":"2018-05-16"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/910a1e1ffe23b118451d8e1397d4dc4f/view/movie/M/402310022.mp4","trailerTitle":"青春不留白\n    其它花絮2 (中文字幕)","trailerDate":"2018-05-16"}],"id":"27622690"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201805251157/431d90e2cf4c7c2784eb15c059337d0a/view/movie/M/402310332.mp4","trailerTitle":"伊阿索密码\n    先行版 (中文字幕)","trailerDate":"2018-05-22"}],"id":"26677141"},{"trailerArray":[],"id":"30230633"},{"trailerArray":[],"id":"30224593"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201805251157/2fdf01b8d18a90e1089fa224474b8001/view/movie/M/402300746.mp4","trailerTitle":"动物世界\n    预告片1：开挂版 (中文字幕)","trailerDate":"2018-05-09"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/8789d323ef250cfa5a877858fc30a4f8/view/movie/M/402290595.mp4","trailerTitle":"动物世界\n    预告片2：剪刀石头布版 (中文字幕)","trailerDate":"2018-04-09"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/7f61227164ab44018a25be49f44b58c0/view/movie/M/302260828.mp4","trailerTitle":"动物世界\n    预告片3：定档版 (中文字幕)","trailerDate":"2018-01-30"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/857bc1b442273f86f74652a0664f3f2b/view/movie/M/302210750.mp4","trailerTitle":"动物世界\n    先行版 (中文字幕)","trailerDate":"2017-09-21"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/851879cc5205bc87213814593ef4006b/view/movie/M/402310451.mp4","trailerTitle":"动物世界\n    花絮1：“为什么叫动物世界”特辑 (中文字幕)","trailerDate":"2018-05-24"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/8729faa64a837fc0dd1bffe7b7188a48/view/movie/M/402300270.mp4","trailerTitle":"动物世界\n    花絮2：命运号特辑 (中文字幕)","trailerDate":"2018-04-26"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/dff72e452ce337928f6f8eab2c4c0436/view/movie/M/302210810.mp4","trailerTitle":"动物世界\n    花絮3：李易峰变身小丑 (中文字幕)","trailerDate":"2017-09-22"}],"id":"26925317"},{"trailerArray":[],"id":"27045333"},{"trailerArray":[],"id":"26775743"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201805251157/f2c2f9c2f7f126268683f6e4d2359869/view/movie/M/402280974.mp4","trailerTitle":"中邪\n    先行版 (中文字幕)","trailerDate":"2018-03-22"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/21217af54eceff9a3fbf51b5860cc6a1/view/movie/M/402290192.mp4","trailerTitle":"中邪\n    其它预告片1：观影实录版 (中文字幕)","trailerDate":"2018-03-28"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/93ee9458bed7deadf3b8fc75c2c370c1/view/movie/M/302280661.mp4","trailerTitle":"中邪\n    其它预告片2：民间中邪录 (中文字幕)","trailerDate":"2018-03-15"}],"id":"26820833"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201805251157/4b5479c22154c542a59c2872a3e359da/view/movie/M/402300144.mp4","trailerTitle":"镰仓物语\n    香港预告片1 (中文字幕)","trailerDate":"2018-04-23"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/c07ca47ce73031e2dc3d83fb13f53915/view/movie/M/302180731.mp4","trailerTitle":"镰仓物语\n    日本预告片2","trailerDate":"2017-07-04"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/149be1d872d99f17a4b29aa1701d6f06/view/movie/M/302240151.mp4","trailerTitle":"镰仓物语\n    电视版1","trailerDate":"2017-11-22"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/ea8f6ce8f7b415afc4e7153f34aa1628/view/movie/M/302240147.mp4","trailerTitle":"镰仓物语\n    电视版2","trailerDate":"2017-11-22"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/c051f45f1f556cd4a0889a41bd6df169/view/movie/M/302240149.mp4","trailerTitle":"镰仓物语\n    电视版3","trailerDate":"2017-11-22"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/916f5a5e412421b93d12030d72e87cc7/view/movie/M/402300819.mp4","trailerTitle":"镰仓物语\n    花絮1","trailerDate":"2018-05-10"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/e46ae7d3d3fb143f1ff21fe429d7d64c/view/movie/M/402300697.mp4","trailerTitle":"镰仓物语\n    花絮2","trailerDate":"2018-05-09"}],"id":"26916229"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201805251157/40010a9209fe67b57a6337389b376ddd/view/movie/M/302280839.mp4","trailerTitle":"边境杀手2：边境战士\n    预告片1","trailerDate":"2018-03-20"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/15672efa10852e329f7c781e70e9bda4/view/movie/M/302270424.mp4","trailerTitle":"边境杀手2：边境战士\n    台湾预告片2 (中文字幕)","trailerDate":"2018-02-11"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/17bca8f69d452f053c13f9f2f647ac75/view/movie/M/302250252.mp4","trailerTitle":"边境杀手2：边境战士\n    先行版","trailerDate":"2017-12-20"}],"id":"26627736"},{"trailerArray":[],"id":"26930565"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201805251157/eefae0d7cae46f62570ee19613d3f47f/view/movie/M/301720324.mp4","trailerTitle":"玛雅蜜蜂历险记\n    预告片1","trailerDate":"2015-03-05"},{"trailerMP4":"http://vt1.doubanio.com/201805251157/72d897d203f36d2420f40bac4b2a2b3c/view/movie/M/301620001.mp4","trailerTitle":"玛雅蜜蜂历险记\n    德国预告片2","trailerDate":"2014-08-29"}],"id":"25881500"}]

/***/ }
/******/ ]);
//# sourceMappingURL=main.map