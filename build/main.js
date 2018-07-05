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
/******/ 	return __webpack_require__(__webpack_require__.s = 40);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

module.exports = require("mongoose");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(38);


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
  aka: Array,
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
  like: String,
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
/***/ function(module, exports) {

module.exports = require("fs");

/***/ },
/* 5 */
/***/ function(module, exports) {

module.exports = require("request");

/***/ },
/* 6 */
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
/* 7 */
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
/* 8 */
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
/* 9 */
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
/* 10 */
/***/ function(module, exports) {

module.exports = [{"movieName":"我不是药神 视频","trailerUri":["https://movie.douban.com/trailer/232621/#content","https://movie.douban.com/trailer/231611/#content","https://movie.douban.com/trailer/229865/#content","https://movie.douban.com/trailer/232610/#content","https://movie.douban.com/trailer/232249/#content","https://movie.douban.com/trailer/231334/#content","https://movie.douban.com/trailer/231102/#content","https://movie.douban.com/trailer/218236/#content","https://movie.douban.com/trailer/232553/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2525591538.jpg?1530506481","https://img3.doubanio.com/img/trailer/medium/2523440146.jpg?","https://img3.doubanio.com/img/trailer/medium/2519463951.jpg?","https://img1.doubanio.com/img/trailer/medium/2525676257.jpg?","https://img1.doubanio.com/img/trailer/medium/2524610107.jpg?1528707122","https://img3.doubanio.com/img/trailer/medium/2522823904.jpg?","https://img3.doubanio.com/img/trailer/medium/2522334233.jpg?","https://img1.doubanio.com/img/trailer/medium/2463626967.jpg?","https://img3.doubanio.com/img/trailer/medium/2525145196.jpg?1529141985"],"id":"26752088"},{"movieName":"新大头儿子和小头爸爸3：俄罗斯奇遇记 视频","trailerUri":["https://movie.douban.com/trailer/233039/#content","https://movie.douban.com/trailer/231715/#content","https://movie.douban.com/trailer/231333/#content","https://movie.douban.com/trailer/232166/#content","https://movie.douban.com/trailer/232915/#content","https://movie.douban.com/trailer/232353/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2526407421.jpg?1530260954","https://img3.doubanio.com/img/trailer/medium/2523608101.jpg?","https://img1.doubanio.com/img/trailer/medium/2522823229.jpg?","https://img1.doubanio.com/img/trailer/medium/2524311587.jpg?1528436921","https://img3.doubanio.com/img/trailer/medium/2526216572.jpg?","https://img3.doubanio.com/img/trailer/medium/2524826081.jpg?1528871835"],"id":"30198729"},{"movieName":"只能活一个 视频","trailerUri":["https://movie.douban.com/trailer/233221/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2526898362.jpg?1530607205"],"id":"27195126"},{"movieName":"您一定不要错过 视频","trailerUri":["https://movie.douban.com/trailer/233220/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2526897275.jpg?1530607013"],"id":"30255216"},{"movieName":"细思极恐 视频","trailerUri":["https://movie.douban.com/trailer/232973/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2526312781.jpg?1530076921"],"id":"30235134"},{"movieName":"左滩 视频","trailerUri":[],"trailerPoster":[],"id":"30261979"},{"movieName":"红盾先锋 视频","trailerUri":["https://movie.douban.com/trailer/233222/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2526898674.jpg?1530607391"],"id":"26614101"},{"movieName":"格桑花开的时候 视频","trailerUri":[],"trailerPoster":[],"id":"27053277"},{"movieName":"邪不压正 视频","trailerUri":["https://movie.douban.com/trailer/233091/#content","https://movie.douban.com/trailer/232465/#content","https://movie.douban.com/trailer/231013/#content","https://movie.douban.com/trailer/227161/#content","https://movie.douban.com/trailer/231761/#content","https://movie.douban.com/trailer/233038/#content","https://movie.douban.com/trailer/232450/#content","https://movie.douban.com/trailer/232265/#content","https://movie.douban.com/trailer/232248/#content","https://movie.douban.com/trailer/231335/#content","https://movie.douban.com/trailer/231861/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2526489612.jpg?1530244322","https://img3.doubanio.com/img/trailer/medium/2525013534.jpg?1528992466","https://img3.doubanio.com/img/trailer/medium/2522243802.jpg?","https://img3.doubanio.com/img/trailer/medium/2512738841.jpg?","https://img3.doubanio.com/img/trailer/medium/2523696800.jpg?","https://img3.doubanio.com/img/trailer/medium/2526407382.jpg?1530242324","https://img3.doubanio.com/img/trailer/medium/2524962313.jpg?1528951170","https://img1.doubanio.com/img/trailer/medium/2524657999.jpg?","https://img3.doubanio.com/img/trailer/medium/2524609792.jpg?1528707165","https://img3.doubanio.com/img/trailer/medium/2522823603.jpg?","https://img1.doubanio.com/img/trailer/medium/2523962317.jpg?1528096196"],"id":"26366496"},{"movieName":"阿修罗 视频","trailerUri":["https://movie.douban.com/trailer/232634/#content","https://movie.douban.com/trailer/231632/#content","https://movie.douban.com/trailer/228924/#content","https://movie.douban.com/trailer/226282/#content","https://movie.douban.com/trailer/233182/#content","https://movie.douban.com/trailer/233105/#content","https://movie.douban.com/trailer/232862/#content","https://movie.douban.com/trailer/232509/#content","https://movie.douban.com/trailer/230455/#content","https://movie.douban.com/trailer/228116/#content","https://movie.douban.com/trailer/233041/#content","https://movie.douban.com/trailer/232462/#content","https://movie.douban.com/trailer/225457/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2525592709.jpg?","https://img3.doubanio.com/img/trailer/medium/2523447386.jpg?","https://img1.doubanio.com/img/trailer/medium/2516928467.jpg?","https://img1.doubanio.com/img/trailer/medium/2510889309.jpg?","https://img3.doubanio.com/img/trailer/medium/2526779365.jpg?1530511845","https://img3.doubanio.com/img/trailer/medium/2526493784.jpg?1530258754","https://img3.doubanio.com/img/trailer/medium/2526150634.jpg?","https://img3.doubanio.com/img/trailer/medium/2525052874.jpg?","https://img1.doubanio.com/img/trailer/medium/2521047068.jpg?","https://img1.doubanio.com/img/trailer/medium/2515430747.jpg?","https://img1.doubanio.com/img/trailer/medium/2526407977.jpg?1530170168","https://img3.doubanio.com/img/trailer/medium/2524986642.jpg?","https://img3.doubanio.com/img/trailer/medium/2508730944.jpg?"],"id":"26746958"},{"movieName":"新乌龙院之笑闹江湖 视频","trailerUri":["https://movie.douban.com/trailer/231098/#content","https://movie.douban.com/trailer/232099/#content","https://movie.douban.com/trailer/232682/#content","https://movie.douban.com/trailer/232362/#content","https://movie.douban.com/trailer/232170/#content","https://movie.douban.com/trailer/231599/#content","https://movie.douban.com/trailer/231486/#content","https://movie.douban.com/trailer/231341/#content","https://movie.douban.com/trailer/232818/#content","https://movie.douban.com/trailer/233102/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2522333392.jpg?","https://img3.doubanio.com/img/trailer/medium/2524231042.jpg?1528357536","https://img1.doubanio.com/img/trailer/medium/2525717177.jpg?1529902516","https://img3.doubanio.com/img/trailer/medium/2524828712.jpg?1528871154","https://img1.doubanio.com/img/trailer/medium/2524312589.jpg?1528437545","https://img1.doubanio.com/img/trailer/medium/2523436517.jpg?","https://img3.doubanio.com/img/trailer/medium/2522981766.jpg?","https://img1.doubanio.com/img/trailer/medium/2522824057.jpg?","https://img3.doubanio.com/img/trailer/medium/2526122443.jpg?1529902166","https://img3.doubanio.com/img/trailer/medium/2526492732.jpg?1530260767"],"id":"26309969"},{"movieName":"铁笼 视频","trailerUri":["https://movie.douban.com/trailer/230179/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2520207116.jpg?"],"id":"30203509"},{"movieName":"海龙屯 视频","trailerUri":["https://movie.douban.com/trailer/233187/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2526782268.jpg?1530514561"],"id":"27114204"},{"movieName":"美丽童年 视频","trailerUri":[],"trailerPoster":[],"id":"27194322"},{"movieName":"小悟空 视频","trailerUri":[],"trailerPoster":[],"id":"30227725"},{"movieName":"八只鸡 视频","trailerUri":["https://movie.douban.com/trailer/233051/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2526427410.jpg?"],"id":"30252555"},{"movieName":"摩天营救 视频","trailerUri":["https://movie.douban.com/trailer/233219/#content","https://movie.douban.com/trailer/233019/#content","https://movie.douban.com/trailer/232978/#content","https://movie.douban.com/trailer/232339/#content","https://movie.douban.com/trailer/231885/#content","https://movie.douban.com/trailer/231474/#content","https://movie.douban.com/trailer/231427/#content","https://movie.douban.com/trailer/231426/#content","https://movie.douban.com/trailer/227160/#content","https://movie.douban.com/trailer/233113/#content","https://movie.douban.com/trailer/232696/#content","https://movie.douban.com/trailer/232471/#content","https://movie.douban.com/trailer/227127/#content","https://movie.douban.com/trailer/233149/#content","https://movie.douban.com/trailer/232871/#content","https://movie.douban.com/trailer/233196/#content","https://movie.douban.com/trailer/233163/#content","https://movie.douban.com/trailer/233101/#content","https://movie.douban.com/trailer/231760/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2526895711.jpg?1530607580","https://img1.doubanio.com/img/trailer/medium/2526382108.jpg?1530611584","https://img3.doubanio.com/img/trailer/medium/2526313250.jpg?1530076834","https://img3.doubanio.com/img/trailer/medium/2524750333.jpg?1528958544","https://img3.doubanio.com/img/trailer/medium/2523980900.jpg?1528100066","https://img3.doubanio.com/img/trailer/medium/2522972990.jpg?","https://img3.doubanio.com/img/trailer/medium/2522930690.jpg?","https://img3.doubanio.com/img/trailer/medium/2522930576.jpg?","https://img3.doubanio.com/img/trailer/medium/2512722254.jpg?","https://img1.doubanio.com/img/trailer/medium/2526510949.jpg?1530517860","https://img3.doubanio.com/img/trailer/medium/2525740613.jpg?1529554835","https://img3.doubanio.com/img/trailer/medium/2525015715.jpg?1529047084","https://img3.doubanio.com/img/trailer/medium/2512712482.jpg?","https://img3.doubanio.com/img/trailer/medium/2526564593.jpg?1530515167","https://img3.doubanio.com/img/trailer/medium/2526163516.jpg?1529989460","https://img3.doubanio.com/img/trailer/medium/2526795343.jpg?1530520019","https://img3.doubanio.com/img/trailer/medium/2526690711.jpg?","https://img3.doubanio.com/img/trailer/medium/2526492715.jpg?1530260796","https://img3.doubanio.com/img/trailer/medium/2523696406.jpg?"],"id":"26804147"},{"movieName":"风语咒 视频","trailerUri":["https://movie.douban.com/trailer/233215/#content","https://movie.douban.com/trailer/233050/#content","https://movie.douban.com/trailer/233049/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2526889354.jpg?1530607812","https://img3.doubanio.com/img/trailer/medium/2526426961.jpg?1530260293","https://img3.doubanio.com/img/trailer/medium/2526426921.jpg?1530260266"],"id":"30146756"},{"movieName":"北方一片苍茫 视频","trailerUri":["https://movie.douban.com/trailer/226937/#content","https://movie.douban.com/trailer/230359/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2512265734.jpg?","https://img3.doubanio.com/img/trailer/medium/2520568176.jpg?"],"id":"27079318"},{"movieName":"淘气大侦探 视频","trailerUri":["https://movie.douban.com/trailer/223574/#content","https://movie.douban.com/trailer/232837/#content","https://movie.douban.com/trailer/227921/#content","https://movie.douban.com/trailer/227922/#content","https://movie.douban.com/trailer/228762/#content","https://movie.douban.com/trailer/228312/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2504375164.jpg?","https://img3.doubanio.com/img/trailer/medium/2526136936.jpg?1529910534","https://img1.doubanio.com/img/trailer/medium/2514894909.jpg?","https://img1.doubanio.com/img/trailer/medium/2514894958.jpg?","https://img1.doubanio.com/img/trailer/medium/2516505468.jpg?","https://img3.doubanio.com/img/trailer/medium/2515703990.jpg?"],"id":"26660063"},{"movieName":"玛雅蜜蜂历险记 视频","trailerUri":["https://movie.douban.com/trailer/172324/#content","https://movie.douban.com/trailer/162001/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2230990335.jpg?","https://img3.doubanio.com/img/trailer/medium/2198023743.jpg?"],"id":"25881500"},{"movieName":"兄弟班 视频","trailerUri":["https://movie.douban.com/trailer/232918/#content","https://movie.douban.com/trailer/232602/#content","https://movie.douban.com/trailer/232317/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2526216606.jpg?1529987939","https://img3.doubanio.com/img/trailer/medium/2525526202.jpg?1529993717","https://img3.doubanio.com/img/trailer/medium/2524715061.jpg?1528795585"],"id":"26988003"},{"movieName":"午夜幽灵 视频","trailerUri":["https://movie.douban.com/trailer/228258/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2515614481.jpg?"],"id":"30128986"},{"movieName":"汪星卧底 视频","trailerUri":["https://movie.douban.com/trailer/233040/#content","https://movie.douban.com/trailer/228324/#content","https://movie.douban.com/trailer/226112/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2526407588.jpg?1530170199","https://img3.doubanio.com/img/trailer/medium/2515743422.jpg?","https://img1.doubanio.com/img/trailer/medium/2510465859.jpg?"],"id":"26930056"},{"movieName":"深海历险记 视频","trailerUri":[],"trailerPoster":[],"id":"30176525"},{"movieName":"闺蜜的战争 视频","trailerUri":[],"trailerPoster":[],"id":"30262110"},{"movieName":"狄仁杰之四大天王 视频","trailerUri":["https://movie.douban.com/trailer/232838/#content","https://movie.douban.com/trailer/221792/#content","https://movie.douban.com/trailer/230245/#content","https://movie.douban.com/trailer/232616/#content","https://movie.douban.com/trailer/233067/#content","https://movie.douban.com/trailer/232984/#content","https://movie.douban.com/trailer/231450/#content","https://movie.douban.com/trailer/232624/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2526137676.jpg?1529911031","https://img3.doubanio.com/img/trailer/medium/2499767152.jpg?","https://img1.doubanio.com/img/trailer/medium/2520334127.jpg?","https://img1.doubanio.com/img/trailer/medium/2525590378.jpg?","https://img1.doubanio.com/img/trailer/medium/2526441668.jpg?","https://img3.doubanio.com/img/trailer/medium/2526314013.jpg?","https://img3.doubanio.com/img/trailer/medium/2522954430.jpg?","https://img3.doubanio.com/img/trailer/medium/2525591834.jpg?"],"id":"25882296"},{"movieName":"西虹市首富 视频","trailerUri":["https://movie.douban.com/trailer/232859/#content","https://movie.douban.com/trailer/232030/#content","https://movie.douban.com/trailer/231173/#content","https://movie.douban.com/trailer/232506/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2526149462.jpg?1529918217","https://img1.doubanio.com/img/trailer/medium/2524221309.jpg?1528356230","https://img3.doubanio.com/img/trailer/medium/2522456574.jpg?","https://img1.doubanio.com/img/trailer/medium/2525046609.jpg?"],"id":"27605698"},{"movieName":"昨日青空 视频","trailerUri":["https://movie.douban.com/trailer/231757/#content","https://movie.douban.com/trailer/220018/#content","https://movie.douban.com/trailer/233179/#content","https://movie.douban.com/trailer/233106/#content","https://movie.douban.com/trailer/231929/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2523696213.jpg?","https://img3.doubanio.com/img/trailer/medium/2494953073.jpg?","https://img3.doubanio.com/img/trailer/medium/2526778622.jpg?1530511790","https://img3.doubanio.com/img/trailer/medium/2526493695.jpg?1530257976","https://img1.doubanio.com/img/trailer/medium/2524048767.jpg?"],"id":"26290410"},{"movieName":"神奇马戏团之动物饼干 视频","trailerUri":["https://movie.douban.com/trailer/231755/#content","https://movie.douban.com/trailer/230450/#content","https://movie.douban.com/trailer/232680/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2523696073.jpg?","https://img3.doubanio.com/img/trailer/medium/2521045753.jpg?","https://img3.doubanio.com/img/trailer/medium/2525717146.jpg?1529902562"],"id":"26253783"},{"movieName":"男生宿舍 视频","trailerUri":[],"trailerPoster":[],"id":"30263334"},{"movieName":"解码游戏 视频","trailerUri":["https://movie.douban.com/trailer/231669/#content","https://movie.douban.com/trailer/232981/#content","https://movie.douban.com/trailer/232683/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2523517744.jpg?","https://img1.doubanio.com/img/trailer/medium/2526313658.jpg?1530076772","https://img1.doubanio.com/img/trailer/medium/2525717198.jpg?1529902495"],"id":"26767512"},{"movieName":"神秘世界历险记4 视频","trailerUri":["https://movie.douban.com/trailer/232186/#content","https://movie.douban.com/trailer/232185/#content","https://movie.douban.com/trailer/232183/#content","https://movie.douban.com/trailer/232184/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2524335499.jpg?1528456458","https://img3.doubanio.com/img/trailer/medium/2524335425.jpg?1528456487","https://img1.doubanio.com/img/trailer/medium/2524334799.jpg?1528456540","https://img3.doubanio.com/img/trailer/medium/2524335305.jpg?"],"id":"30208005"},{"movieName":"肆式青春 视频","trailerUri":["https://movie.douban.com/trailer/232715/#content","https://movie.douban.com/trailer/231622/#content","https://movie.douban.com/trailer/231517/#content","https://movie.douban.com/trailer/228991/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2525800819.jpg?","https://img1.doubanio.com/img/trailer/medium/2523441488.jpg?","https://img3.doubanio.com/img/trailer/medium/2523039223.jpg?","https://img3.doubanio.com/img/trailer/medium/2517027092.jpg?"],"id":"30156898"},{"movieName":"一出好戏 视频","trailerUri":["https://movie.douban.com/trailer/230863/#content","https://movie.douban.com/trailer/230067/#content","https://movie.douban.com/trailer/227730/#content","https://movie.douban.com/trailer/231717/#content","https://movie.douban.com/trailer/226838/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2521811714.jpg?","https://img1.doubanio.com/img/trailer/medium/2519821728.jpg?","https://img3.doubanio.com/img/trailer/medium/2514261002.jpg?","https://img3.doubanio.com/img/trailer/medium/2523607806.jpg?","https://img1.doubanio.com/img/trailer/medium/2512140439.jpg?"],"id":"26985127"},{"movieName":"爱情公寓 视频","trailerUri":["https://movie.douban.com/trailer/232102/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2524231956.jpg?1528357458"],"id":"24852545"},{"movieName":"巨齿鲨 视频","trailerUri":["https://movie.douban.com/trailer/232560/#content","https://movie.douban.com/trailer/231860/#content","https://movie.douban.com/trailer/231859/#content","https://movie.douban.com/trailer/229674/#content","https://movie.douban.com/trailer/229631/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2525296817.jpg?","https://img1.doubanio.com/img/trailer/medium/2523962188.jpg?1528096359","https://img1.doubanio.com/img/trailer/medium/2523962107.jpg?1528096418","https://img3.doubanio.com/img/trailer/medium/2518953365.jpg?","https://img3.doubanio.com/img/trailer/medium/2518855241.jpg?"],"id":"26426194"},{"movieName":"美食大冒险之英雄烩 视频","trailerUri":["https://movie.douban.com/trailer/232632/#content","https://movie.douban.com/trailer/231753/#content","https://movie.douban.com/trailer/229860/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2525592313.jpg?1529902857","https://img1.doubanio.com/img/trailer/medium/2523695739.jpg?","https://img3.doubanio.com/img/trailer/medium/2519463473.jpg?"],"id":"26290398"},{"movieName":"勇者闯魔城 视频","trailerUri":[],"trailerPoster":[],"id":"30125089"},{"movieName":"大轰炸 视频","trailerUri":["https://movie.douban.com/trailer/232626/#content","https://movie.douban.com/trailer/231094/#content","https://movie.douban.com/trailer/232633/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2525591935.jpg?1529903005","https://img3.doubanio.com/img/trailer/medium/2522332973.jpg?","https://img1.doubanio.com/img/trailer/medium/2525592869.jpg?1529902824"],"id":"26331700"},{"movieName":"如影随心 视频","trailerUri":["https://movie.douban.com/trailer/229343/#content","https://movie.douban.com/trailer/233185/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2518071792.jpg?","https://img1.doubanio.com/img/trailer/medium/2526780629.jpg?1530512588"],"id":"26871669"},{"movieName":"快把我哥带走 视频","trailerUri":["https://movie.douban.com/trailer/228408/#content","https://movie.douban.com/trailer/232449/#content","https://movie.douban.com/trailer/233175/#content","https://movie.douban.com/trailer/233174/#content","https://movie.douban.com/trailer/233097/#content","https://movie.douban.com/trailer/233037/#content","https://movie.douban.com/trailer/232552/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2516067315.jpg?","https://img3.doubanio.com/img/trailer/medium/2524962262.jpg?","https://img3.doubanio.com/img/trailer/medium/2526777801.jpg?1530512211","https://img3.doubanio.com/img/trailer/medium/2526777252.jpg?","https://img3.doubanio.com/img/trailer/medium/2526492295.jpg?1530260716","https://img3.doubanio.com/img/trailer/medium/2526407241.jpg?1530242478","https://img3.doubanio.com/img/trailer/medium/2525143961.jpg?"],"id":"30122633"},{"movieName":"未来机器城 视频","trailerUri":["https://movie.douban.com/trailer/232839/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2526137673.jpg?1529910998"],"id":"27200988"},{"movieName":"大师兄 视频","trailerUri":["https://movie.douban.com/trailer/232746/#content","https://movie.douban.com/trailer/232814/#content","https://movie.douban.com/trailer/233181/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2525832878.jpg?1529923579","https://img3.doubanio.com/img/trailer/medium/2526121745.jpg?1529901332","https://img3.doubanio.com/img/trailer/medium/2526779084.jpg?1530511648"],"id":"27201353"},{"movieName":"最后的棒棒 视频","trailerUri":["https://movie.douban.com/trailer/232753/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2525865391.jpg?1529667145"],"id":"30254589"},{"movieName":"他是一只狗 视频","trailerUri":[],"trailerPoster":[],"id":"30246086"},{"movieName":"冷恋时代 视频","trailerUri":[],"trailerPoster":[],"id":"24743257"},{"movieName":"大三儿 视频","trailerUri":["https://movie.douban.com/trailer/231593/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2523431559.jpg?"],"id":"27119292"},{"movieName":"反贪风暴3 视频","trailerUri":["https://movie.douban.com/trailer/231603/#content","https://movie.douban.com/trailer/233043/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2523439239.jpg?","https://img3.doubanio.com/img/trailer/medium/2526407834.jpg?1530170051"],"id":"26996640"},{"movieName":"七袋米 视频","trailerUri":["https://movie.douban.com/trailer/231602/#content","https://movie.douban.com/trailer/231600/#content","https://movie.douban.com/trailer/231601/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2523437292.jpg?","https://img1.doubanio.com/img/trailer/medium/2523437129.jpg?","https://img1.doubanio.com/img/trailer/medium/2523437007.jpg?"],"id":"26881698"},{"movieName":"让我怎么相信你 视频","trailerUri":[],"trailerPoster":[],"id":"30199575"},{"movieName":"道高一丈 视频","trailerUri":[],"trailerPoster":[],"id":"26954268"},{"movieName":"惊慌失色之诡寓 视频","trailerUri":[],"trailerPoster":[],"id":"30237381"},{"movieName":"旅行吧！井底之蛙 视频","trailerUri":[],"trailerPoster":[],"id":"30236775"},{"movieName":"我，花样女王 视频","trailerUri":["https://movie.douban.com/trailer/224983/#content","https://movie.douban.com/trailer/223359/#content","https://movie.douban.com/trailer/224643/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2507488558.jpg?","https://img1.doubanio.com/img/trailer/medium/2503800758.jpg?","https://img1.doubanio.com/img/trailer/medium/2506804809.jpg?"],"id":"26756049"},{"movieName":"蚁人2：黄蜂女现身 视频","trailerUri":["https://movie.douban.com/trailer/231244/#content","https://movie.douban.com/trailer/231243/#content","https://movie.douban.com/trailer/230391/#content","https://movie.douban.com/trailer/230390/#content","https://movie.douban.com/trailer/230388/#content","https://movie.douban.com/trailer/230384/#content","https://movie.douban.com/trailer/226958/#content","https://movie.douban.com/trailer/226876/#content","https://movie.douban.com/trailer/219971/#content","https://movie.douban.com/trailer/232762/#content","https://movie.douban.com/trailer/232096/#content","https://movie.douban.com/trailer/231888/#content","https://movie.douban.com/trailer/231774/#content","https://movie.douban.com/trailer/232608/#content","https://movie.douban.com/trailer/231380/#content","https://movie.douban.com/trailer/233195/#content","https://movie.douban.com/trailer/233197/#content","https://movie.douban.com/trailer/232566/#content","https://movie.douban.com/trailer/232567/#content","https://movie.douban.com/trailer/232460/#content","https://movie.douban.com/trailer/232048/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2522690761.jpg?","https://img1.doubanio.com/img/trailer/medium/2522690659.jpg?","https://img3.doubanio.com/img/trailer/medium/2520904160.jpg?","https://img1.doubanio.com/img/trailer/medium/2520897188.jpg?","https://img3.doubanio.com/img/trailer/medium/2520895522.jpg?","https://img3.doubanio.com/img/trailer/medium/2520829861.jpg?","https://img1.doubanio.com/img/trailer/medium/2512327887.jpg?","https://img1.doubanio.com/img/trailer/medium/2512190538.jpg?","https://img3.doubanio.com/img/trailer/medium/2494800564.jpg?","https://img3.doubanio.com/img/trailer/medium/2525870676.jpg?","https://img3.doubanio.com/img/trailer/medium/2524226591.jpg?1528366208","https://img1.doubanio.com/img/trailer/medium/2523992127.jpg?1528108751","https://img3.doubanio.com/img/trailer/medium/2523699590.jpg?","https://img3.doubanio.com/img/trailer/medium/2525548656.jpg?1529993659","https://img3.doubanio.com/img/trailer/medium/2522889172.jpg?","https://img1.doubanio.com/img/trailer/medium/2526795217.jpg?1530520165","https://img3.doubanio.com/img/trailer/medium/2526795871.jpg?1530520144","https://img1.doubanio.com/img/trailer/medium/2525357509.jpg?1529990934","https://img1.doubanio.com/img/trailer/medium/2525357787.jpg?1529990963","https://img3.doubanio.com/img/trailer/medium/2524978631.jpg?1528966183","https://img3.doubanio.com/img/trailer/medium/2524154671.jpg?1528340863"],"id":"26636712"},{"movieName":"碟中谍6：全面瓦解 视频","trailerUri":["https://movie.douban.com/trailer/231259/#content","https://movie.douban.com/trailer/231252/#content","https://movie.douban.com/trailer/231247/#content","https://movie.douban.com/trailer/231045/#content","https://movie.douban.com/trailer/227152/#content","https://movie.douban.com/trailer/232695/#content","https://movie.douban.com/trailer/232287/#content","https://movie.douban.com/trailer/232349/#content","https://movie.douban.com/trailer/227139/#content","https://movie.douban.com/trailer/233171/#content","https://movie.douban.com/trailer/233063/#content","https://movie.douban.com/trailer/231865/#content","https://movie.douban.com/trailer/227314/#content","https://movie.douban.com/trailer/226928/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2522725463.jpg?1528734001","https://img3.doubanio.com/img/trailer/medium/2522708331.jpg?","https://img3.doubanio.com/img/trailer/medium/2522708104.jpg?","https://img3.doubanio.com/img/trailer/medium/2522268915.jpg?","https://img1.doubanio.com/img/trailer/medium/2512745509.jpg?","https://img3.doubanio.com/img/trailer/medium/2525740012.jpg?1529554444","https://img1.doubanio.com/img/trailer/medium/2524688249.jpg?","https://img1.doubanio.com/img/trailer/medium/2524812967.jpg?1528959304","https://img3.doubanio.com/img/trailer/medium/2512712810.jpg?","https://img3.doubanio.com/img/trailer/medium/2526770385.jpg?1530512303","https://img3.doubanio.com/img/trailer/medium/2526438961.jpg?1530611145","https://img1.doubanio.com/img/trailer/medium/2523962699.jpg?1528095788","https://img1.doubanio.com/img/trailer/medium/2512990789.jpg?","https://img3.doubanio.com/img/trailer/medium/2512246703.jpg?"],"id":"26336252"},{"movieName":"镰仓物语 视频","trailerUri":["https://movie.douban.com/trailer/230144/#content","https://movie.douban.com/trailer/218731/#content","https://movie.douban.com/trailer/224151/#content","https://movie.douban.com/trailer/224147/#content","https://movie.douban.com/trailer/224149/#content","https://movie.douban.com/trailer/230819/#content","https://movie.douban.com/trailer/230697/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2520132966.jpg?","https://img3.doubanio.com/img/trailer/medium/2480586560.jpg?","https://img3.doubanio.com/img/trailer/medium/2505617813.jpg?","https://img3.doubanio.com/img/trailer/medium/2505617052.jpg?","https://img3.doubanio.com/img/trailer/medium/2505617406.jpg?","https://img3.doubanio.com/img/trailer/medium/2521733372.jpg?","https://img1.doubanio.com/img/trailer/medium/2521614649.jpg?"],"id":"26916229"},{"movieName":"影 视频","trailerUri":["https://movie.douban.com/trailer/231782/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2523705700.jpg?"],"id":"4864908"},{"movieName":"边境杀手2：边境战士 视频","trailerUri":["https://movie.douban.com/trailer/231509/#content","https://movie.douban.com/trailer/228839/#content","https://movie.douban.com/trailer/227424/#content","https://movie.douban.com/trailer/225252/#content","https://movie.douban.com/trailer/233085/#content","https://movie.douban.com/trailer/232439/#content","https://movie.douban.com/trailer/232443/#content","https://movie.douban.com/trailer/231996/#content","https://movie.douban.com/trailer/231792/#content","https://movie.douban.com/trailer/232713/#content","https://movie.douban.com/trailer/232425/#content","https://movie.douban.com/trailer/232410/#content","https://movie.douban.com/trailer/232411/#content","https://movie.douban.com/trailer/233012/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2523018626.jpg?","https://img3.doubanio.com/img/trailer/medium/2516829974.jpg?","https://img3.doubanio.com/img/trailer/medium/2513246682.jpg?","https://img1.doubanio.com/img/trailer/medium/2508146897.jpg?","https://img3.doubanio.com/img/trailer/medium/2526470693.jpg?1530521090","https://img1.doubanio.com/img/trailer/medium/2524960739.jpg?1528954329","https://img3.doubanio.com/img/trailer/medium/2524961022.jpg?","https://img3.doubanio.com/img/trailer/medium/2524107984.jpg?","https://img3.doubanio.com/img/trailer/medium/2523735623.jpg?1528100797","https://img3.doubanio.com/img/trailer/medium/2525801255.jpg?1529990491","https://img3.doubanio.com/img/trailer/medium/2524940124.jpg?1528956797","https://img3.doubanio.com/img/trailer/medium/2524931093.jpg?","https://img3.doubanio.com/img/trailer/medium/2524931201.jpg?1528957737","https://img3.doubanio.com/img/trailer/medium/2526381946.jpg?"],"id":"26627736"},{"movieName":"营救汪星人 视频","trailerUri":["https://movie.douban.com/trailer/231720/#content","https://movie.douban.com/trailer/230452/#content","https://movie.douban.com/trailer/226985/#content","https://movie.douban.com/trailer/224021/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2523608745.jpg?","https://img1.doubanio.com/img/trailer/medium/2521045788.jpg?","https://img3.doubanio.com/img/trailer/medium/2512353485.jpg?","https://img3.doubanio.com/img/trailer/medium/2505200235.jpg?"],"id":"26930565"},{"movieName":"找到你 视频","trailerUri":["https://movie.douban.com/trailer/231886/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2523989295.jpg?"],"id":"27140071"},{"movieName":"断片之险途夺宝 视频","trailerUri":["https://movie.douban.com/trailer/207856/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2400698056.jpg?"],"id":"26882457"},{"movieName":"墨多多谜境冒险 视频","trailerUri":["https://movie.douban.com/trailer/227157/#content","https://movie.douban.com/trailer/232448/#content","https://movie.douban.com/trailer/231325/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2512721635.jpg?","https://img3.doubanio.com/img/trailer/medium/2524962295.jpg?1528951346","https://img1.doubanio.com/img/trailer/medium/2522822477.jpg?"],"id":"26790960"},{"movieName":"沉默的证人 视频","trailerUri":["https://movie.douban.com/trailer/228988/#content","https://movie.douban.com/trailer/228608/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2517025368.jpg?","https://img3.doubanio.com/img/trailer/medium/2516310364.jpg?"],"id":"26816090"},{"movieName":"武林怪兽 视频","trailerUri":[],"trailerPoster":[],"id":"26425062"},{"movieName":"真相漩涡 视频","trailerUri":["https://movie.douban.com/trailer/227304/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2512964688.jpg?"],"id":"26792540"},{"movieName":"摔跤手苏丹 视频","trailerUri":["https://movie.douban.com/trailer/206474/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2393895989.jpg?"],"id":"26728641"},{"movieName":"跨越8年的新娘 视频","trailerUri":["https://movie.douban.com/trailer/227270/#content","https://movie.douban.com/trailer/221477/#content","https://movie.douban.com/trailer/218159/#content","https://movie.douban.com/trailer/223752/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2512894167.jpg?","https://img3.doubanio.com/img/trailer/medium/2499034181.jpg?","https://img3.doubanio.com/img/trailer/medium/2462903840.jpg?","https://img3.doubanio.com/img/trailer/medium/2504782560.jpg?"],"id":"26929835"},{"movieName":"大闹西游 视频","trailerUri":["https://movie.douban.com/trailer/227313/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2512989005.jpg?"],"id":"30142649"},{"movieName":"李宗伟：败者为王 视频","trailerUri":["https://movie.douban.com/trailer/231023/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2522263431.jpg?"],"id":"27195119"},{"movieName":"黑脸大包公之西夏风云 视频","trailerUri":[],"trailerPoster":[],"id":"27192660"},{"movieName":"幸福魔咒 视频","trailerUri":[],"trailerPoster":[],"id":"27661975"},{"movieName":"阿里巴巴三根金发 视频","trailerUri":["https://movie.douban.com/trailer/228917/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2516916816.jpg?"],"id":"30176069"},{"movieName":"黑暗深处之惊魂夜 视频","trailerUri":[],"trailerPoster":[],"id":"30259493"},{"movieName":"恩师 视频","trailerUri":["https://movie.douban.com/trailer/232615/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2525590426.jpg?"],"id":"30215191"},{"movieName":"勇敢往事 视频","trailerUri":["https://movie.douban.com/trailer/232053/#content","https://movie.douban.com/trailer/230307/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2524174602.jpg?","https://img3.doubanio.com/img/trailer/medium/2520458605.jpg?"],"id":"27191430"},{"movieName":"江湖儿女 视频","trailerUri":["https://movie.douban.com/trailer/231448/#content","https://movie.douban.com/trailer/230586/#content","https://movie.douban.com/trailer/230578/#content","https://movie.douban.com/trailer/231401/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2522954125.jpg?","https://img3.doubanio.com/img/trailer/medium/2521476011.jpg?","https://img3.doubanio.com/img/trailer/medium/2521453294.jpg?","https://img1.doubanio.com/img/trailer/medium/2522902718.jpg?"],"id":"26972258"},{"movieName":"一生有你 视频","trailerUri":["https://movie.douban.com/trailer/232747/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2525832840.jpg?1529641379"],"id":"26263417"},{"movieName":"禹神传之寻找神力 视频","trailerUri":[],"trailerPoster":[],"id":"30227727"},{"movieName":"李茶的姑妈 视频","trailerUri":[],"trailerPoster":[],"id":"27092785"},{"movieName":"无双 视频","trailerUri":["https://movie.douban.com/trailer/231147/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2522415949.jpg?"],"id":"26425063"},{"movieName":"云南虫谷 视频","trailerUri":["https://movie.douban.com/trailer/231365/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2522871302.jpg?"],"id":"26744597"},{"movieName":"胖子行动队 视频","trailerUri":["https://movie.douban.com/trailer/232917/#content","https://movie.douban.com/trailer/221816/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2526216537.jpg?1529987861","https://img1.doubanio.com/img/trailer/medium/2499810809.jpg?"],"id":"27149818"},{"movieName":"山2 视频","trailerUri":[],"trailerPoster":[],"id":"26911450"},{"movieName":"护垫侠 视频","trailerUri":["https://movie.douban.com/trailer/225121/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2507744714.jpg?"],"id":"27198855"},{"movieName":"阳台上 视频","trailerUri":["https://movie.douban.com/trailer/230243/#content","https://movie.douban.com/trailer/230535/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2520330164.jpg?","https://img1.doubanio.com/img/trailer/medium/2521140229.jpg?"],"id":"27135473"},{"movieName":"苦行僧的非凡旅程 视频","trailerUri":["https://movie.douban.com/trailer/230573/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2521437489.jpg?"],"id":"26715965"},{"movieName":"阴阳师 视频","trailerUri":[],"trailerPoster":[],"id":"26935283"},{"movieName":"阿凡提之奇缘历险 视频","trailerUri":["https://movie.douban.com/trailer/232914/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2526216067.jpg?"],"id":"30208004"},{"movieName":"灵魂的救赎 视频","trailerUri":[],"trailerPoster":[],"id":"27620911"},{"movieName":"功夫联盟 视频","trailerUri":[],"trailerPoster":[],"id":"27008394"},{"movieName":"过往的梦 视频","trailerUri":["https://movie.douban.com/trailer/231583/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2523425713.jpg?"],"id":"27107609"},{"movieName":"银魂2 视频","trailerUri":["https://movie.douban.com/trailer/230209/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2520260415.jpg?"],"id":"27199577"},{"movieName":"碟仙实录 视频","trailerUri":[],"trailerPoster":[],"id":"26961483"},{"movieName":"素人特工 视频","trailerUri":[],"trailerPoster":[],"id":"27155276"},{"movieName":"人间·喜剧 视频","trailerUri":[],"trailerPoster":[],"id":"27179414"},{"movieName":"阿丽塔：战斗天使 视频","trailerUri":["https://movie.douban.com/trailer/224924/#content","https://movie.douban.com/trailer/224871/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2507372272.jpg?","https://img3.doubanio.com/img/trailer/medium/2507188313.jpg?"],"id":"1652592"},{"movieName":"动物特工局 视频","trailerUri":["https://movie.douban.com/trailer/231024/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2522264636.jpg?"],"id":"30217371"},{"movieName":"疯狂的外星人 视频","trailerUri":["https://movie.douban.com/trailer/219724/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2494105655.jpg?"],"id":"25986662"},{"movieName":"神探蒲松龄之兰若仙踪 视频","trailerUri":[],"trailerPoster":[],"id":"27065898"},{"movieName":"八仙之各显神通 视频","trailerUri":[],"trailerPoster":[],"id":"26277338"},{"movieName":"误入江湖 视频","trailerUri":[],"trailerPoster":[],"id":"30187577"},{"movieName":"迦百农 视频","trailerUri":[],"trailerPoster":[],"id":"30170448"},{"movieName":"画皮Ⅲ 视频","trailerUri":[],"trailerPoster":[],"id":"24743117"},{"movieName":"八仙过海 视频","trailerUri":["https://movie.douban.com/trailer/231174/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2522459307.jpg?"],"id":"30226052"},{"movieName":"摸金校尉之九幽将军 视频","trailerUri":[],"trailerPoster":[],"id":"26986120"},{"movieName":"唐人街探案3 视频","trailerUri":[],"trailerPoster":[],"id":"27619748"},{"movieName":"黑色假面 视频","trailerUri":[],"trailerPoster":[],"id":"26986136"}]

/***/ },
/* 11 */
/***/ function(module, exports) {

module.exports = [{"url":"https://movie.douban.com/subject/30198729/","title":"新大头儿子和小头爸爸3：俄罗","like":"611"},{"url":"https://movie.douban.com/subject/30255216/","title":"您一定不要错过","like":"536"},{"url":"https://movie.douban.com/subject/27195126/","title":"只能活一个","like":"497"},{"url":"https://movie.douban.com/subject/30235134/","title":"细思极恐","like":"226"},{"url":"https://movie.douban.com/subject/30261979/","title":"左滩","like":"40"},{"url":"https://movie.douban.com/subject/26614101/","title":"红盾先锋","like":"51"},{"url":"https://movie.douban.com/subject/27053277/","title":"格桑花开的时候","like":"25"},{"url":"https://movie.douban.com/subject/26366496/","title":"邪不压正","like":"72834"},{"url":"https://movie.douban.com/subject/26746958/","title":"阿修罗","like":"2784"},{"url":"https://movie.douban.com/subject/26309969/","title":"新乌龙院之笑闹江湖","like":"2251"},{"url":"https://movie.douban.com/subject/27114204/","title":"海龙屯","like":"222"},{"url":"https://movie.douban.com/subject/30203509/","title":"铁笼","like":"215"},{"url":"https://movie.douban.com/subject/27194322/","title":"美丽童年","like":"52"},{"url":"https://movie.douban.com/subject/30249257/","title":"天佑之爱","like":"5"},{"url":"https://movie.douban.com/subject/30227725/","title":"小悟空","like":"31"},{"url":"https://movie.douban.com/subject/30252555/","title":"八只鸡","like":"190"},{"url":"https://movie.douban.com/subject/26804147/","title":"摩天营救","like":"4722"},{"url":"https://movie.douban.com/subject/30146756/","title":"风语咒","like":"3348"},{"url":"https://movie.douban.com/subject/27079318/","title":"北方一片苍茫","like":"2550"},{"url":"https://movie.douban.com/subject/26660063/","title":"淘气大侦探","like":"792"},{"url":"https://movie.douban.com/subject/25881500/","title":"玛雅蜜蜂历险记","like":"623"},{"url":"https://movie.douban.com/subject/26988003/","title":"兄弟班","like":"302"},{"url":"https://movie.douban.com/subject/30128986/","title":"午夜幽灵","like":"264"},{"url":"https://movie.douban.com/subject/26930056/","title":"汪星卧底","like":"239"},{"url":"https://movie.douban.com/subject/30176525/","title":"深海历险记","like":"96"},{"url":"https://movie.douban.com/subject/30262110/","title":"闺蜜的战争","like":"7"},{"url":"https://movie.douban.com/subject/27158277/","title":"产科男生","like":"4"},{"url":"https://movie.douban.com/subject/25882296/","title":"狄仁杰之四大天王","like":"26321"},{"url":"https://movie.douban.com/subject/27605698/","title":"西虹市首富","like":"12902"},{"url":"https://movie.douban.com/subject/26290410/","title":"昨日青空","like":"11530"},{"url":"https://movie.douban.com/subject/26253783/","title":"神奇马戏团之动物饼干","like":"2347"},{"url":"https://movie.douban.com/subject/30263334/","title":"解剖室灵异事件之男生宿舍","like":"10"},{"url":"https://movie.douban.com/subject/26767512/","title":"解码游戏","like":"709"},{"url":"https://movie.douban.com/subject/30208005/","title":"神秘世界历险记4","like":"78"},{"url":"https://movie.douban.com/subject/30156898/","title":"肆式青春","like":"1941"},{"url":"https://movie.douban.com/subject/26985127/","title":"一出好戏","like":"19170"},{"url":"https://movie.douban.com/subject/24852545/","title":"爱情公寓","like":"10812"},{"url":"https://movie.douban.com/subject/26426194/","title":"巨齿鲨","like":"4497"},{"url":"https://movie.douban.com/subject/26290398/","title":"美食大冒险之英雄烩","like":"208"},{"url":"https://movie.douban.com/subject/30125089/","title":"勇者闯魔城","like":"103"},{"url":"https://movie.douban.com/subject/26331700/","title":"大轰炸","like":"5016"},{"url":"https://movie.douban.com/subject/26871669/","title":"如影随心","like":"3580"},{"url":"https://movie.douban.com/subject/30122633/","title":"快把我哥带走","like":"3408"},{"url":"https://movie.douban.com/subject/27200988/","title":"未来机器城","like":"682"},{"url":"https://movie.douban.com/subject/27201353/","title":"大师兄","like":"391"},{"url":"https://movie.douban.com/subject/30254589/","title":"最后的棒棒","like":"377"},{"url":"https://movie.douban.com/subject/30246086/","title":"他是一只狗","like":"57"},{"url":"https://movie.douban.com/subject/24743257/","title":"冷恋时代","like":"22"},{"url":"https://movie.douban.com/subject/27119292/","title":"大三儿","like":"1126"},{"url":"https://movie.douban.com/subject/26996640/","title":"反贪风暴3","like":"2757"},{"url":"https://movie.douban.com/subject/26881698/","title":"七袋米","like":"389"},{"url":"https://movie.douban.com/subject/30199575/","title":"让我怎么相信你","like":"232"},{"url":"https://movie.douban.com/subject/26954268/","title":"道高一丈","like":"150"},{"url":"https://movie.douban.com/subject/26730542/","title":"有五个姐姐的我就注定要单身了","like":"58"},{"url":"https://movie.douban.com/subject/30237381/","title":"惊慌失色之诡寓","like":"30"},{"url":"https://movie.douban.com/subject/27107604/","title":"天下第一镖局","like":"21"},{"url":"https://movie.douban.com/subject/30236775/","title":"旅行吧！井底之蛙","like":"58"},{"url":"https://movie.douban.com/subject/26636712/","title":"蚁人2：黄蜂女现身","like":"38277"},{"url":"https://movie.douban.com/subject/26756049/","title":"我，花样女王","like":"38215"},{"url":"https://movie.douban.com/subject/26336252/","title":"碟中谍6：全面瓦解","like":"26611"},{"url":"https://movie.douban.com/subject/26916229/","title":"镰仓物语","like":"23784"},{"url":"https://movie.douban.com/subject/4864908/","title":"影","like":"21940"},{"url":"https://movie.douban.com/subject/26627736/","title":"边境杀手2：边境战士","like":"8672"},{"url":"https://movie.douban.com/subject/26930565/","title":"营救汪星人","like":"5870"},{"url":"https://movie.douban.com/subject/27140071/","title":"找到你","like":"4918"},{"url":"https://movie.douban.com/subject/26882457/","title":"断片之险途夺宝","like":"3366"},{"url":"https://movie.douban.com/subject/26790960/","title":"墨多多谜境冒险","like":"2268"},{"url":"https://movie.douban.com/subject/26816090/","title":"沉默的证人","like":"2238"},{"url":"https://movie.douban.com/subject/26425062/","title":"武林怪兽","like":"1954"},{"url":"https://movie.douban.com/subject/26792540/","title":"真相漩涡","like":"1810"},{"url":"https://movie.douban.com/subject/26728641/","title":"苏丹","like":"1645"},{"url":"https://movie.douban.com/subject/26929835/","title":"跨越8年的新娘","like":"1552"},{"url":"https://movie.douban.com/subject/27195119/","title":"李宗伟：败者为王","like":"412"},{"url":"https://movie.douban.com/subject/27192660/","title":"黑脸大包公之西夏风云","like":"193"},{"url":"https://movie.douban.com/subject/27661975/","title":"幸福魔咒","like":"61"},{"url":"https://movie.douban.com/subject/30176069/","title":"阿里巴巴三根金发","like":"54"},{"url":"https://movie.douban.com/subject/30259493/","title":"黑暗深处之惊魂夜","like":"13"},{"url":"https://movie.douban.com/subject/30215191/","title":"恩师","like":"54"},{"url":"https://movie.douban.com/subject/27191430/","title":"勇敢往事","like":"22"},{"url":"https://movie.douban.com/subject/26972258/","title":"江湖儿女","like":"19908"},{"url":"https://movie.douban.com/subject/26263417/","title":"一生有你","like":"715"},{"url":"https://movie.douban.com/subject/30227727/","title":"禹神传之寻找神力","like":"15"},{"url":"https://movie.douban.com/subject/27092785/","title":"李茶的姑妈","like":"2486"},{"url":"https://movie.douban.com/subject/26425063/","title":"无双","like":"1567"},{"url":"https://movie.douban.com/subject/26744597/","title":"云南虫谷","like":"1353"},{"url":"https://movie.douban.com/subject/27149818/","title":"胖子行动队","like":"717"},{"url":"https://movie.douban.com/subject/26911450/","title":"山2","like":"18664"},{"url":"https://movie.douban.com/subject/27198855/","title":"护垫侠","like":"6374"},{"url":"https://movie.douban.com/subject/27135473/","title":"阳台上","like":"6117"},{"url":"https://movie.douban.com/subject/26715965/","title":"苦行僧的非凡旅程","like":"774"},{"url":"https://movie.douban.com/subject/30142649/","title":"大闹西游","like":"545"},{"url":"https://movie.douban.com/subject/26935283/","title":"阴阳师","like":"6391"},{"url":"https://movie.douban.com/subject/30208004/","title":"阿凡提之奇缘历险","like":"67"},{"url":"https://movie.douban.com/subject/27620911/","title":"灵魂的救赎","like":"20"},{"url":"https://movie.douban.com/subject/27008394/","title":"功夫联盟","like":"878"},{"url":"https://movie.douban.com/subject/27107609/","title":"过往的梦","like":"29"},{"url":"https://movie.douban.com/subject/27199577/","title":"银魂2","like":"4258"},{"url":"https://movie.douban.com/subject/27663881/","title":"燃点","like":"448"},{"url":"https://movie.douban.com/subject/26961483/","title":"碟仙实录","like":"345"},{"url":"https://movie.douban.com/subject/27155276/","title":"素人特工","like":"415"},{"url":"https://movie.douban.com/subject/27179414/","title":"人间·喜剧","like":"1477"},{"url":"https://movie.douban.com/subject/1652592/","title":"阿丽塔：战斗天使","like":"11483"},{"url":"https://movie.douban.com/subject/30217371/","title":"动物特工局","like":"587"},{"url":"https://movie.douban.com/subject/25986662/","title":"疯狂的外星人","like":"15965"},{"url":"https://movie.douban.com/subject/27065898/","title":"神探蒲松龄之兰若仙踪","like":"1129"},{"url":"https://movie.douban.com/subject/26277338/","title":"八仙之各显神通","like":"933"},{"url":"https://movie.douban.com/subject/30187577/","title":"误入江湖","like":"453"},{"url":"https://movie.douban.com/subject/30170448/","title":"迦百农","like":"3228"},{"url":"https://movie.douban.com/subject/24743117/","title":"画皮Ⅲ","like":"5788"},{"url":"https://movie.douban.com/subject/30226052/","title":"八仙过海","like":"13"},{"url":"https://movie.douban.com/subject/26986120/","title":"摸金校尉之九幽将军","like":"13079"},{"url":"https://movie.douban.com/subject/30264504/","title":"异界","like":"0"},{"url":"https://movie.douban.com/subject/27619748/","title":"唐人街探案3","like":"8151"},{"url":"https://movie.douban.com/subject/26986136/","title":"黑色假面","like":"1643"}]

/***/ },
/* 12 */
/***/ function(module, exports) {

module.exports = require("iconv-lite");

/***/ },
/* 13 */
/***/ function(module, exports) {

module.exports = require("path");

/***/ },
/* 14 */
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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__);


var _this = this;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var movieFile = __webpack_require__(26);
var axios = __webpack_require__(31);
var doubanAPI = 'http://api.douban.com/v2/movie/';
var request = __webpack_require__(5);

var proxy = ['180.76.188.115', '180.76.138.181', '180.76.239.106', '180.76.166.103', '180.76.181.205', '180.76.234.215', '180.76.106.163', '180.76.184.179', '180.76.244.38', '180.76.113.79', '180.76.169.176', '180.76.169.122', '180.76.106.208', '180.76.178.83', '180.76.147.196', '180.76.112.206', '180.76.233.125', '180.76.186.99', '180.76.51.74', '180.76.234.146', '180.76.153.183', '180.76.155.233', '180.76.57.252', '180.76.120.42', '180.76.103.107', '180.76.58.216', '180.76.112.24', '180.76.108.218', '180.76.98.218', '180.76.168.148', '180.76.109.38', '180.76.249.53', '180.76.59.173', '180.76.145.181', '180.76.99.7', '180.76.59.64', '180.76.51.56', '180.76.57.82', '180.76.233.53', '180.76.156.144'];
var proxyConfig = {
  port: "443",
  user: "martindu",
  password: "fy1812!!"
};

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
              uri: doubanAPI + 'subject/' + filmId,
              timeout: 4000
              // 代理地址
            };
            random = Math.floor(Math.random() * proxy.length);

            console.log('\u968F\u673A\u6570\u4E3A' + random);
            options.proxy = 'http://' + proxyConfig.user + ':' + proxyConfig.password + '@' + proxy[random] + ':' + proxyConfig.port;

            // const film = request(options)
            _context2.next = 6;
            return new Promise(function (resolve) {
              request(options, function (error, response, body) {
                try {
                  if (error) throw error;

                  resolve(JSON.parse(body));
                } catch (e) {
                  console.log('\u5355\u4E2A\u7535\u5F71 API \u8BF7\u6C42\u5931\u8D25\uFF0C\u51C6\u5907\u91CD\u65B0\u8BF7\u6C42ing');
                  fetchSingleFilm(filmId);
                  // console.log(e)
                }
              });
            });

          case 6:
            film = _context2.sent;
            return _context2.abrupt('return', film);

          case 8:
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
              uri: doubanAPI + 'coming_soon?count=100'
              // 代理地址
            };
            random = Math.floor(Math.random() * proxy.length);

            console.log('\u968F\u673A\u6570\u4E3A' + random);
            options.proxy = 'http://' + proxyConfig.user + ':' + proxyConfig.password + '@' + proxy[random] + ':' + proxyConfig.port;

            _context5.next = 8;
            return new Promise(function (resolve) {
              request(options, function (error, response, body) {
                resolve(JSON.parse(body));
              });
            });

          case 8:
            films = _context5.sent;
            _context5.next = 15;
            break;

          case 11:
            _context5.prev = 11;
            _context5.t0 = _context5['catch'](1);

            console.log('\u5373\u5C06\u4E0A\u6620\u7535\u5F71\u5217\u8868API\uFF0C\u8BF7\u6C42\u5931\u8D25\uFF0C\u51C6\u5907\u91CD\u65B0\u8BF7\u6C42ing');
            fetchFilms();
            // console.log(e)

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
            if (!(i < films.length)) {
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
    }, _callee5, _this, [[1, 11]]);
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
    var filmDetail, filmTrailer, filmTrailerDetail;
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            filmDetail = __webpack_require__(28);
            filmTrailer = __webpack_require__(10);
            filmTrailerDetail = __webpack_require__(29);

            // 添加爬取的上映日期、播放时长、电影封面

            _context10.next = 5;
            return new Promise(function () {
              var _ref7 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee7(resolve, reject) {
                var i, film, j, k, item, l, _item;

                return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        i = 0;

                      case 1:
                        if (!(i < filmDetail.length)) {
                          _context7.next = 15;
                          break;
                        }

                        _context7.next = 4;
                        return Film.findOne({ id: filmDetail[i].id }).exec();

                      case 4:
                        film = _context7.sent;

                        if (!film) {
                          _context7.next = 12;
                          break;
                        }

                        film.releaseDate = filmDetail[i].releaseDate; // 更新上时间
                        film.runtime = filmDetail[i].runtime; // 更新电影时长
                        film.postPic = filmDetail[i].postPic; // 更新电影poster


                        // 更新导演、主演照片
                        for (j = 0; j < filmDetail[i].actorAddMsg.length; j++) {
                          for (k = 0; k < film.directors.length; k++) {
                            if (film.directors[k].id === filmDetail[i].actorAddMsg[j].id) {
                              item = film.directors[k];

                              item.avatars = filmDetail[i].actorAddMsg[j].actorImg;
                              film.directors.splice(k, 1, item);
                            }
                          }
                          for (l = 0; l < film.casts.length; l++) {
                            if (film.casts[l].id === filmDetail[i].actorAddMsg[j].id) {
                              _item = film.casts[l];

                              _item.avatars = filmDetail[i].actorAddMsg[j].actorImg;
                              film.casts.splice(l, 1, _item);
                            }
                          }
                        }

                        _context7.next = 12;
                        return film.save();

                      case 12:
                        i++;
                        _context7.next = 1;
                        break;

                      case 15:
                        console.log('\u7535\u5F71\u7F3A\u5931\u4E0A\u6620\u65E5\u671F\u3001\u64AD\u653E\u65F6\u957F\u3001\u7535\u5F71\u5C01\u9762\u4FE1\u606F\u8865\u5145\u5B8C\u6BD5');
                        return _context7.abrupt('return', resolve());

                      case 17:
                      case 'end':
                        return _context7.stop();
                    }
                  }
                }, _callee7, _this);
              }));

              return function (_x8, _x9) {
                return _ref7.apply(this, arguments);
              };
            }());

          case 5:
            _context10.next = 7;
            return new Promise(function () {
              var _ref8 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee8(resolve, reject) {
                var i, film;
                return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        i = 0;

                      case 1:
                        if (!(i < filmTrailer.length)) {
                          _context8.next = 9;
                          break;
                        }

                        _context8.next = 4;
                        return Film.findOne({ id: filmTrailer[i].id }).exec();

                      case 4:
                        film = _context8.sent;


                        if (film) {
                          film.trailerPoster = filmTrailer[i].trailerPoster;
                          film.save();
                        }

                      case 6:
                        i++;
                        _context8.next = 1;
                        break;

                      case 9:
                        return _context8.abrupt('return', resolve());

                      case 10:
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

          case 7:
            _context10.next = 9;
            return new Promise(function () {
              var _ref9 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee9(resolve, reject) {
                var i, film;
                return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        i = 0;

                      case 1:
                        if (!(i < filmTrailerDetail.length)) {
                          _context9.next = 9;
                          break;
                        }

                        _context9.next = 4;
                        return Film.findOne({ id: filmTrailerDetail[i].id }).exec();

                      case 4:
                        film = _context9.sent;


                        if (film) {
                          film.trailerArray = filmTrailerDetail[i].trailerArray;
                          film.save();
                        }

                      case 6:
                        i++;
                        _context9.next = 1;
                        break;

                      case 9:
                        return _context9.abrupt('return', resolve());

                      case 10:
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

          case 9:
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
/* 定时更新内容 */
var updateMovie = function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee11() {
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return movieFile.runMovieDetail();

          case 2:
            _context11.next = 4;
            return movieFile.runMovieTrailer();

          case 4:
            _context11.next = 6;
            return movieFile.runMovieTrailerDetail();

          case 6:
            _context11.next = 8;
            return movieFile.runMoviePhoto();

          case 8:
            _context11.next = 10;
            return fetchFilms();

          case 10:
            _context11.next = 12;
            return crawlerDetail();

          case 12:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, _this);
  }));

  return function updateMovie() {
    return _ref10.apply(this, arguments);
  };
}();
module.exports = updateMovie;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__);


var _this = this;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fs = __webpack_require__(4);
var resolve = __webpack_require__(13).resolve;
var mongoose = __webpack_require__(0);
var config = __webpack_require__(25);

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
/* 17 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {

var nodemailer = __webpack_require__(37);
var fs = __webpack_require__(4);
var path = __webpack_require__(13);
var ejs = __webpack_require__(35);

var transporter = nodemailer.createTransport({
  // host: 'smtp.ethereal.email',
  service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
  port: 465, // SMTP 端口
  secureConnection: true, // 使用了 SSL
  auth: {
    user: '171426589@qq.com',
    // 这里密码不是qq密码，是你设置的smtp授权码
    pass: 'bbtfthdkvixkbibi'
  }
});

var sendMailFn = function sendMailFn(sendMsg) {
  var template = ejs.compile(fs.readFileSync(path.resolve(__dirname, 'email.ejs'), 'utf8'));

  var mailOptions = {
    from: '"FilmGo 定时爬虫启动" <171426589@qq.com>', // sender address
    to: 'suiyang_sun@163.com', // list of receivers
    subject: 'FilmGo 定时爬虫启动了, 预计5min更新完毕，请实时观察' // Subject line

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
/* 18 */
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
    var id, errMsg, film;
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            id = ctx.query.id;

            if (!id) {
              errMsg = {
                localhost: ctx.url,
                errorMsg: 'id \u4E3A\u7A7A'
              };

              ctx.error(10000, errMsg);
            }
            _context3.next = 4;
            return Film.findOne({ id: id }, '').exec();

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
/* 19 */
/***/ function(module, exports) {

module.exports = require("koa");

/***/ },
/* 20 */
/***/ function(module, exports) {

module.exports = require("koa-bodyparser");

/***/ },
/* 21 */
/***/ function(module, exports) {

module.exports = require("koa-session");

/***/ },
/* 22 */
/***/ function(module, exports) {

module.exports = require("koa2-cors");

/***/ },
/* 23 */
/***/ function(module, exports) {

module.exports = require("node-schedule");

/***/ },
/* 24 */
/***/ function(module, exports) {

module.exports = require("nuxt");

/***/ },
/* 25 */
/***/ function(module, exports) {

var config = {
  db: 'mongodb://127.0.0.1/filmgo'
};

module.exports = config;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__);


var _this = this;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var rp = __webpack_require__(39);
var cheerio = __webpack_require__(34);
var fs = __webpack_require__(4);
var iconv = __webpack_require__(12);
var request = __webpack_require__(5);
var proxyIP = __webpack_require__(27);
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
};

var getComingMovie = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee3(movieUri) {
    var options, random, movieMsg;
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            options = {
              method: 'GET',
              uri: movieUri.uri,
              encoding: "utf-8"
              // 代理地址
            };
            random = Math.floor(Math.random() * proxy.length);

            console.log('\u968F\u673A\u6570\u4E3A' + random);
            options.proxy = 'http://' + proxyConfig.user + ':' + proxyConfig.password + '@' + proxy[random] + ':' + proxyConfig.port;

            // request 请求
            _context3.next = 6;
            return new Promise(function (resolve) {
              request(options, function () {
                var _ref3 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee2(error, response, body) {
                  var $, releaseDate, runtime, casts, _movie, _movie2;

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
                          _context2.next = 10;
                          break;

                        case 7:
                          _context2.prev = 7;
                          _context2.t0 = _context2['catch'](1);

                          console.error(_context2.t0);

                        case 10:
                          if (!$) {
                            _context2.next = 21;
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

                          _movie = {
                            movieName: $('span[property="v:itemreviewed"]').text(),
                            releaseDate: releaseDate,
                            runtime: runtime,
                            postPic: $('#mainpic img').attr('src'),
                            id: uri.match(/\/subject\/(\S*)\//)[1],
                            actorAddMsg: casts,
                            like: movieUri.like
                          };


                          resolve(_movie);
                          _context2.next = 27;
                          break;

                        case 21:
                          console.log(uri + '\u7535\u5F71\u722C\u53D6\u5931\u8D25\uFF0C\u91CD\u65B0\u722C\u53D6');
                          _context2.next = 24;
                          return getComingMovie(uri);

                        case 24:
                          _movie2 = _context2.sent;

                          console.log('\u7535\u5F71 \u300A' + _movie2.movieName + '\u300B \u91CD\u65B0\u722C\u53D6\u6210\u529F');
                          resolve(_movie2);

                        case 27:
                        case 'end':
                          return _context2.stop();
                      }
                    }
                  }, _callee2, this, [[1, 7]]);
                }));

                return function (_x3, _x4, _x5) {
                  return _ref3.apply(this, arguments);
                };
              }());
            });

          case 6:
            movieMsg = _context3.sent;
            return _context3.abrupt('return', movieMsg);

          case 8:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, _this);
  }));

  return function getComingMovie(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
// 爬取豆瓣即将上映电影的poster、上映日期、片长
var runMovieDetail = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee4() {
    var options, $, comingMoviesLink, comingMovies;
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            options = {
              uri: 'https://movie.douban.com/coming',
              transform: function transform(body) {
                return cheerio.load(body, { decodeEntities: false });
              }
            };
            _context4.next = 3;
            return rp(options);

          case 3:
            $ = _context4.sent;
            comingMoviesLink = [];
            comingMovies = [];

            $('.article tbody tr').each(function (index) {
              comingMoviesLink.push({
                url: $(this).find("a").attr('href'),
                title: $(this).find("a").html().trim(),
                like: $(this).find("td").eq(4).html().trim().match(/^[0-9]*/)[0]
              });
            });

            // 更新当前新电影列表 url 到本地
            fs.writeFileSync('./comingMovieUri.json', JSON.stringify(comingMoviesLink, null, 2), 'utf8');

            /*for(let i = 0; i < comingMoviesLink.length; i++) {
              const movie = await getComingMovie(comingMoviesLink[i])
              comingMovies.push(movie)
              console.log(`这是第${i+1}个电影，《${movie.movieName}》`)
              await sleep(1)
              // 爬取豆瓣即将上映电影的poster、上映日期、片长
              fs.writeFileSync('./comingMovie.json', JSON.stringify(comingMovies, null, 2), 'utf8')
            }*/

          case 8:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, _this);
  }));

  return function runMovieDetail() {
    return _ref4.apply(this, arguments);
  };
}();
runMovieDetail();

/* 电影预告片列表->预告片的详细uil、封面 */
var getMovieTrailer = function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee6(uri) {
    var options, random, movieMsg;
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            options = {
              method: 'GET',
              uri: uri + 'trailer',
              encoding: "utf-8"
              // 代理地址
            };
            random = Math.floor(Math.random() * proxy.length);

            console.log('\u968F\u673A\u6570\u4E3A' + random);
            options.proxy = 'http://' + proxyConfig.user + ':' + proxyConfig.password + '@' + proxy[random] + ':' + proxyConfig.port;
            // request 请求
            _context6.next = 6;
            return new Promise(function (resolve) {
              request(options, function () {
                var _ref6 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee5(error, response, body) {
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

                          _context5.next = 10;
                          break;

                        case 7:
                          _context5.prev = 7;
                          _context5.t0 = _context5['catch'](1);

                          console.error(_context5.t0);

                        case 10:
                          if (!$) {
                            _context5.next = 18;
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
                            id: uri.match(/\/subject\/(\S*)\//)[1]
                          };

                          resolve(trailer);
                          _context5.next = 24;
                          break;

                        case 18:
                          console.log(uri + ' \u7535\u5F71\u9884\u544A\u7247\u722C\u53D6\u5931\u8D25\uFF0C\u91CD\u65B0\u722C\u53D6');
                          _context5.next = 21;
                          return getComingMovie(uri);

                        case 21:
                          _trailer = _context5.sent;

                          console.log('\u7535\u5F71 \u300A' + movie.movieName + '\u300B \u9884\u544A\u7247\u91CD\u65B0\u722C\u53D6\u6210\u529F');
                          resolve(_trailer);

                        case 24:
                        case 'end':
                          return _context5.stop();
                      }
                    }
                  }, _callee5, this, [[1, 7]]);
                }));

                return function (_x7, _x8, _x9) {
                  return _ref6.apply(this, arguments);
                };
              }());
            });

          case 6:
            movieMsg = _context6.sent;
            return _context6.abrupt('return', movieMsg);

          case 8:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, _this);
  }));

  return function getMovieTrailer(_x6) {
    return _ref5.apply(this, arguments);
  };
}();
var runMovieTrailer = function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee7() {
    var comingMoviesLink, Trailer, i, trailer;
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            comingMoviesLink = __webpack_require__(11);
            Trailer = [];
            i = 0;

          case 3:
            if (!(i < comingMoviesLink.length)) {
              _context7.next = 14;
              break;
            }

            _context7.next = 6;
            return getMovieTrailer(comingMoviesLink[i]);

          case 6:
            trailer = _context7.sent;

            Trailer.push(trailer);
            console.log('\u8FD9\u662F\u7B2C' + (i + 1) + '\u4E2A\u7535\u5F71\u7684\u9884\u544A\u7247\u5217\u8868, ' + trailer.movieName);
            _context7.next = 11;
            return sleep(1);

          case 11:
            i++;
            _context7.next = 3;
            break;

          case 14:
            fs.writeFileSync('./comingMovieTrailer.json', JSON.stringify(Trailer, null, 2), 'utf8');

          case 15:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, _this);
  }));

  return function runMovieTrailer() {
    return _ref7.apply(this, arguments);
  };
}();

/* 电影预告详细信息获取->videolink、title、发布日期 */
var getMovieTrailerDetail = function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee10(array) {
    var trailerArray;
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return Promise.all(array.trailerUri.map(function () {
              var _ref9 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee9(item) {
                var options, random, movieMsg;
                return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        if (!(item.length !== 0)) {
                          _context9.next = 9;
                          break;
                        }

                        options = {
                          method: 'GET',
                          uri: '' + item,
                          encoding: "utf-8"
                          // 代理地址
                        };
                        random = Math.floor(Math.random() * proxy.length);

                        console.log('\u968F\u673A\u6570\u4E3A' + random);
                        options.proxy = 'http://' + proxyConfig.user + ':' + proxyConfig.password + '@' + proxy[random] + ':' + proxyConfig.port;

                        // request 请求
                        _context9.next = 7;
                        return new Promise(function (resolve) {
                          request(options, function () {
                            var _ref10 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee8(error, response, body) {
                              var $, trailer;
                              return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee8$(_context8) {
                                while (1) {
                                  switch (_context8.prev = _context8.next) {
                                    case 0:
                                      $ = void 0;
                                      _context8.prev = 1;

                                      if (!error) {
                                        _context8.next = 4;
                                        break;
                                      }

                                      throw error;

                                    case 4:
                                      $ = cheerio.load(body, { decodeEntities: false });

                                      _context8.next = 10;
                                      break;

                                    case 7:
                                      _context8.prev = 7;
                                      _context8.t0 = _context8['catch'](1);

                                      console.error(_context8.t0);

                                    case 10:
                                      if (!$) {
                                        _context8.next = 14;
                                        break;
                                      }

                                      resolve({
                                        trailerMP4: $('#movie_player source').attr('src'),
                                        trailerTitle: $('h1').text(),
                                        trailerDate: $('.trailer-info>span').html()
                                      });
                                      _context8.next = 20;
                                      break;

                                    case 14:
                                      console.log(uri + ' \u7535\u5F71\u9884\u544A\u8BE6\u7EC6\u4FE1\u606F\u722C\u53D6\u5931\u8D25\uFF0C\u91CD\u65B0\u722C\u53D6');
                                      _context8.next = 17;
                                      return getComingMovie(uri);

                                    case 17:
                                      trailer = _context8.sent;

                                      console.log('\u7535\u5F71 \u300A' + trailer.trailerTitle + '\u300B \u8BE6\u7EC6\u4FE1\u606F\u91CD\u65B0\u722C\u53D6\u6210\u529F');
                                      resolve(trailer);

                                    case 20:
                                    case 'end':
                                      return _context8.stop();
                                  }
                                }
                              }, _callee8, this, [[1, 7]]);
                            }));

                            return function (_x12, _x13, _x14) {
                              return _ref10.apply(this, arguments);
                            };
                          }());
                        });

                      case 7:
                        movieMsg = _context9.sent;
                        return _context9.abrupt('return', movieMsg);

                      case 9:
                      case 'end':
                        return _context9.stop();
                    }
                  }
                }, _callee9, _this);
              }));

              return function (_x11) {
                return _ref9.apply(this, arguments);
              };
            }()));

          case 2:
            trailerArray = _context10.sent;
            return _context10.abrupt('return', {
              trailerArray: trailerArray,
              id: array.id
            });

          case 4:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, _this);
  }));

  return function getMovieTrailerDetail(_x10) {
    return _ref8.apply(this, arguments);
  };
}();
var runMovieTrailerDetail = function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee11() {
    var comingTrailerLink, Trailer, i, trailer;
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            comingTrailerLink = __webpack_require__(10);
            Trailer = [];
            i = 0;

          case 3:
            if (!(i < comingTrailerLink.length)) {
              _context11.next = 15;
              break;
            }

            _context11.next = 6;
            return getMovieTrailerDetail(comingTrailerLink[i]);

          case 6:
            trailer = _context11.sent;

            Trailer.push(trailer);
            console.log('\u8FD9\u662F\u7B2C' + (i + 1) + '\u4E2A\u7535\u5F71\u7684\u9884\u544A\u8BE6\u7EC6\u4FE1\u606F, ' + trailer.trailerTitle);
            _context11.next = 11;
            return sleep(1);

          case 11:
            fs.writeFileSync('./comingMovieTrailerDetail.json', JSON.stringify(Trailer, null, 2), 'utf8');

          case 12:
            i++;
            _context11.next = 3;
            break;

          case 15:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, _this);
  }));

  return function runMovieTrailerDetail() {
    return _ref11.apply(this, arguments);
  };
}();
// runMovieTrailerDetail()

/* 获取电影的剧照、海报 */
var getMoviePhotos = function () {
  var _ref12 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee13(uri) {
    var options, random, movieMsg;
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            options = {
              method: 'GET',
              uri: uri + '/all_photos',
              encoding: "utf-8"
              // 代理地址
            };
            random = Math.floor(Math.random() * proxy.length);

            console.log('\u968F\u673A\u6570\u4E3A' + random);
            options.proxy = 'http://' + proxyConfig.user + ':' + proxyConfig.password + '@' + proxy[random] + ':' + proxyConfig.port;

            // request 请求
            _context13.next = 6;
            return new Promise(function (resolve) {
              request(options, function () {
                var _ref13 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee12(error, response, body) {
                  var $, stagePhotos, trailer;
                  return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee12$(_context12) {
                    while (1) {
                      switch (_context12.prev = _context12.next) {
                        case 0:
                          $ = void 0;
                          _context12.prev = 1;

                          if (!error) {
                            _context12.next = 4;
                            break;
                          }

                          throw error;

                        case 4:
                          $ = cheerio.load(body, { decodeEntities: false });

                          _context12.next = 10;
                          break;

                        case 7:
                          _context12.prev = 7;
                          _context12.t0 = _context12['catch'](1);

                          console.error(_context12.t0);

                        case 10:
                          if (!$) {
                            _context12.next = 16;
                            break;
                          }

                          stagePhotos = [];

                          $('.article .pic-col5 li a').each(function () {
                            stagePhotos.push($(this).find('img').attr('src'));
                          });

                          resolve({
                            movieName: $("#content>h1").text(),
                            stagePhotos: stagePhotos,
                            id: uri.match(/\/subject\/(\S*)\//)[1]
                          });
                          _context12.next = 22;
                          break;

                        case 16:
                          console.log(uri + ' \u7535\u5F71\u5267\u7167\u722C\u53D6\u5931\u8D25\uFF0C\u91CD\u65B0\u722C\u53D6');
                          _context12.next = 19;
                          return getComingMovie(uri);

                        case 19:
                          trailer = _context12.sent;

                          console.log('\u7535\u5F71 \u300A' + trailer.movieName + '\u300B \u8BE6\u7EC6\u4FE1\u606F\u91CD\u65B0\u722C\u53D6\u6210\u529F');
                          resolve(trailer);

                        case 22:
                        case 'end':
                          return _context12.stop();
                      }
                    }
                  }, _callee12, this, [[1, 7]]);
                }));

                return function (_x16, _x17, _x18) {
                  return _ref13.apply(this, arguments);
                };
              }());
            });

          case 6:
            movieMsg = _context13.sent;
            return _context13.abrupt('return', movieMsg);

          case 8:
          case 'end':
            return _context13.stop();
        }
      }
    }, _callee13, _this);
  }));

  return function getMoviePhotos(_x15) {
    return _ref12.apply(this, arguments);
  };
}();
var runMoviePhoto = function () {
  var _ref14 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee14() {
    var comingMoviesLink, stagePhotos, i, photo;
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            comingMoviesLink = __webpack_require__(11);
            stagePhotos = [];
            i = 0;

          case 3:
            if (!(i < comingMoviesLink.length)) {
              _context14.next = 15;
              break;
            }

            _context14.next = 6;
            return getMoviePhotos(comingMoviesLink[i]);

          case 6:
            photo = _context14.sent;

            stagePhotos.push(photo);
            console.log('\u8FD9\u662F\u7B2C' + (i + 1) + '\u4E2A\u7535\u5F71\u7684\u5267\u7167, ' + photo.movieName);
            _context14.next = 11;
            return sleep(1);

          case 11:
            fs.writeFileSync('./comingMovieStagePhotos.json', JSON.stringify(stagePhotos, null, 2), 'utf8');

          case 12:
            i++;
            _context14.next = 3;
            break;

          case 15:
          case 'end':
            return _context14.stop();
        }
      }
    }, _callee14, _this);
  }));

  return function runMoviePhoto() {
    return _ref14.apply(this, arguments);
  };
}();
module.exports = { runMovieDetail: runMovieDetail, runMovieTrailer: runMovieTrailer, runMovieTrailerDetail: runMovieTrailerDetail, runMoviePhoto: runMoviePhoto };

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

var request = __webpack_require__(5);
var iconv = __webpack_require__(12);
var Promise = __webpack_require__(33);
var fs = __webpack_require__(4);

// 获取代理列表
var getProxyList = function getProxyList() {
  var apiURL = 'http://www.66ip.cn/mo.php?sxb=&tqsl=100&port=&export=&ktip=&sxa=&submit=%CC%E1++%C8%A1&textarea=http%3A%2F%2Fwww.66ip.cn%2F%3Fsxb%3D%26tqsl%3D100%26ports%255B%255D2%3D%26ktip%3D%26sxa%3D%26radio%3Dradio%26submit%3D%25CC%25E1%2B%2B%25C8%25A1';

  return new Promise(function (resolve, reject) {
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
      }

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
  });
};

module.exports = getProxyList;

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

/***/ },
/* 28 */
/***/ function(module, exports) {

module.exports = [{"movieName":"我不是药神","releaseDate":["2018-07-06(中国大陆)"],"runtime":["117分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2519070834.jpg","id":"26752088","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1529658740.26.jpg","id":"1349765"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p43738.jpg","id":"1274297"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1496577458.38.jpg","id":"1313837"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530515420.42.jpg","id":"1312976"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1529426479.83.jpg","id":"1322072"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p11184.jpg","id":"1275510"}]},{"movieName":"新大头儿子和小头爸爸3：俄罗斯奇遇记","releaseDate":["2018-07-06(中国大陆)"],"runtime":["80分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522820714.jpg","id":"30198729","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1469705072.9.jpg","id":"1342907"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p44177.jpg","id":"1318433"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p44180.jpg","id":"1318435"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1494778054.15.jpg","id":"1274251"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1456036213.77.jpg","id":"1342904"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1469704999.82.jpg","id":"1342905"}]},{"movieName":"只能活一个","releaseDate":["2018-07-06(中国大陆)"],"runtime":["88分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2524300287.jpg","id":"27195126","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1394054"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p20374.jpg","id":"1002998"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1495272189.28.jpg","id":"1356410"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1500536910.66.jpg","id":"1275965"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1500366548.01.jpg","id":"1377550"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1324676"}]},{"movieName":"您一定不要错过","releaseDate":["2018-07-06(中国大陆)"],"runtime":["99分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2525923740.jpg","id":"30255216","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1372142956.93.jpg","id":"1290135"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1524126104.69.jpg","id":"1315258"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33449.jpg","id":"1163063"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p20607.jpg","id":"1017754"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1448182337.96.jpg","id":"1332913"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1524024240.83.jpg","id":"1274429"}]},{"movieName":"细思极恐","releaseDate":["2018-07-06(中国大陆)"],"runtime":["92分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2523632181.jpg","id":"30235134","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1527746059.06.jpg","id":"1394332"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p21430.jpg","id":"1178533"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1527647410.08.jpg","id":"1364829"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1527658154.64.jpg","id":"1394380"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1527658188.61.jpg","id":"1394381"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1495089433.73.jpg","id":"1358119"}]},{"movieName":"左滩","releaseDate":["2018-07-07(中国大陆)"],"runtime":["90分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526771176.jpg","id":"30261979","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530505577.49.jpg","id":"1334538"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530505577.49.jpg","id":"1334538"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1478242794.85.jpg","id":"1353007"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1396591"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p43760.jpg","id":"1318647"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1421418443.88.jpg","id":"1329090"}]},{"movieName":"红盾先锋","releaseDate":["2018-07-08(中国大陆)"],"runtime":["83分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2525891590.jpg","id":"26614101","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1371632185.22.jpg","id":"1317043"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p43479.jpg","id":"1318573"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1396604"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1396605"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1396606"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1396607"}]},{"movieName":"格桑花开的时候","releaseDate":["2018-07-12(中国大陆)"],"runtime":["95分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2481328213.jpg","id":"27053277","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/pKitjH3YSqg8cel_avatar_uploaded1450123261.87.jpg","id":"1353450"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p6UqjsvauI4Ucel_avatar_uploaded1359094991.62.jpg","id":"1326496"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1522153949.53.jpg","id":"1314024"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1515482404.17.jpg","id":"1316331"}]},{"movieName":"邪不压正","releaseDate":["2018-07-13(中国大陆)"],"runtime":["137分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526297221.jpg","id":"26366496","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1517818343.94.jpg","id":"1021999"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1517818343.94.jpg","id":"1021999"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1368156632.65.jpg","id":"1013782"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1454644679.84.jpg","id":"1007401"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p12653.jpg","id":"1037851"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1485778268.65.jpg","id":"1005268"}]},{"movieName":"阿修罗","releaseDate":["2018-07-13(中国大陆)"],"runtime":["141分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2525586876.jpg","id":"26746958","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1457956936.96.jpg","id":"1307141"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1513308156.39.jpg","id":"1276150"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p746.jpg","id":"1118167"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1411832447.57.jpg","id":"1036905"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1482321171.27.jpg","id":"1363975"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1466151868.26.jpg","id":"1317068"}]},{"movieName":"新乌龙院之笑闹江湖","releaseDate":["2018-07-13(中国大陆)"],"runtime":["90分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522238376.jpg","id":"26309969","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p11221.jpg","id":"1275412"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p45481.jpg","id":"1016771"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p22359.jpg","id":"1314167"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p7559.jpg","id":"1051995"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1528939891.56.jpg","id":"1314704"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1161.jpg","id":"1002862"}]},{"movieName":"铁笼","releaseDate":["2018-07-13(中国大陆)"],"runtime":["105分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2520206852.jpg","id":"30203509","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1524564529.09.jpg","id":"1334489"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1524564529.09.jpg","id":"1334489"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1467042391.39.jpg","id":"1356780"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1524564988.73.jpg","id":"1391855"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1524565053.17.jpg","id":"1391857"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1524571440.11.jpg","id":"1391858"}]},{"movieName":"海龙屯","releaseDate":["2018-07-13(中国大陆)"],"runtime":["81分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526781302.jpg","id":"27114204","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/pXpJ5LJKEjV8cel_avatar_uploaded1525266396.64.jpg","id":"1392260"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/pXpJ5LJKEjV8cel_avatar_uploaded1524940524.2.jpg","id":"1392204"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/pXpJ5LJKEjV8cel_avatar_uploaded1524810124.35.jpg","id":"1392109"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/pXpJ5LJKEjV8cel_avatar_uploaded1524674393.71.jpg","id":"1392027"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/pXpJ5LJKEjV8cel_avatar_uploaded1524551352.55.jpg","id":"1391896"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/pXpJ5LJKEjV8cel_avatar_uploaded1524674622.82.jpg","id":"1392028"}]},{"movieName":"美丽童年","releaseDate":["2018-07-13(中国大陆)"],"runtime":["90分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2504516292.jpg","id":"27194322","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1521622071.23.jpg","id":"1365701"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1360362613.71.jpg","id":"1318030"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1494832042.34.jpg","id":"1316038"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p18432.jpg","id":"1313513"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1361007011.88.jpg","id":"1320875"}]},{"movieName":"小悟空","releaseDate":["2018-07-14(中国大陆)"],"runtime":["85分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2526767688.jpg","id":"30227725","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1396597"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1396598"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1051611"}]},{"movieName":"八只鸡","releaseDate":["2018-07-19(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2525715533.jpg","id":"30252555","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1529912784.88.jpg","id":"1396214"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1529912770.04.jpg","id":"1396215"}]},{"movieName":"摩天营救 Skyscraper","releaseDate":["2018-07-20(中国大陆)","2018-07-13(美国)"],"runtime":["102分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2526485489.jpg","id":"26804147","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1377869988.64.jpg","id":"1005149"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p196.jpg","id":"1044707"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p13115.jpg","id":"1027828"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p23588.jpg","id":"1036774"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1460407814.98.jpg","id":"1334238"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1417086901.1.jpg","id":"1049775"}]},{"movieName":"风语咒","releaseDate":["2018-07-20(中国大陆)"],"runtime":["105分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526402162.jpg","id":"30146756","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1501141090.9.jpg","id":"1364166"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1370588849.4.jpg","id":"1329887"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1478049229.21.jpg","id":"1340811"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1522323624.45.jpg","id":"1390805"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1522323576.31.jpg","id":"1339972"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1398540567.14.jpg","id":"1334349"}]},{"movieName":"北方一片苍茫","releaseDate":["2018-07-20(中国大陆)","2017-07-23(FIRST青年影展)"],"runtime":["105分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526309612.jpg","id":"27079318","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/f/movie/14960825e118267b5857fc0ae9f306ef8c74da8f/pics/movie/has_douban@2x.png","id":"1376541"},{"actorImg":"https://img3.doubanio.com/f/movie/14960825e118267b5857fc0ae9f306ef8c74da8f/pics/movie/has_douban@2x.png","id":"1377028"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1378150"}]},{"movieName":"淘气大侦探 Sherlock Gnomes","releaseDate":["2018-07-20(中国大陆)","2018-03-23(美国)","2018-05-11(英国)"],"runtime":["86分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2525848479.jpg","id":"26660063","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p34350.jpg","id":"1298420"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p93.jpg","id":"1006958"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p21481.jpg","id":"1041022"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p562.jpg","id":"1054456"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p9322.jpg","id":"1010581"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p16450.jpg","id":"1014134"}]},{"movieName":"玛雅蜜蜂历险记 Maya the Bee Movie","releaseDate":["2018-07-20(中国大陆)","2014-09-11(德国)"],"runtime":["78分钟(法国)"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2234785674.jpg","id":"25881500","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1298221"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1354128837.83.jpg","id":"1248592"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1417086901.1.jpg","id":"1049775"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1404.jpg","id":"1013865"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33207.jpg","id":"1048191"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p21519.jpg","id":"1161151"}]},{"movieName":"兄弟班","releaseDate":["2018-07-20(中国大陆)","2018-07-13(香港)"],"runtime":["102分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526213923.jpg","id":"26988003","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1921.jpg","id":"1028948"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1485327861.41.jpg","id":"1275972"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1401776151.3.jpg","id":"1340458"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1416749516.7.jpg","id":"1337843"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1392320"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p35235.jpg","id":"1316133"}]},{"movieName":"午夜幽灵","releaseDate":["2018-07-20(中国大陆)"],"runtime":["81分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2516906655.jpg","id":"30128986","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1499243527.29.jpg","id":"1376582"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1394899519.58.jpg","id":"1275029"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1522810252.53.jpg","id":"1391102"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1522810175.11.jpg","id":"1337900"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1495528480.16.jpg","id":"1374307"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1527750676.4.jpg","id":"1349852"}]},{"movieName":"汪星卧底 Show Dogs","releaseDate":["2018-07-20(中国大陆)","2018-05-18(美国)"],"runtime":["92分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526399205.jpg","id":"26930056","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p5860.jpg","id":"1036533"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p7197.jpg","id":"1044709"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1373705281.63.jpg","id":"1049714"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p26071.jpg","id":"1040517"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p22552.jpg","id":"1000096"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1976.jpg","id":"1006980"}]},{"movieName":"深海历险记","releaseDate":["2018-07-20(中国大陆)"],"runtime":["95分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2521788585.jpg","id":"30176525","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1527581010.4.jpg","id":"1392567"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1526874160.87.jpg","id":"1340111"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1526874126.05.jpg","id":"1333856"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1526874097.46.jpg","id":"1392570"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1526874182.49.jpg","id":"1392571"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1478051011.64.jpg","id":"1325740"}]},{"movieName":"闺蜜的战争","releaseDate":["2018-07-20(中国大陆)"],"runtime":["93分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526892933.jpg","id":"30262110","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1381901"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1396594"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1396595"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1396596"}]},{"movieName":"狄仁杰之四大天王","releaseDate":["2018-07-27(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526405034.jpg","id":"25882296","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1393840734.39.jpg","id":"1007152"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p30529.jpg","id":"1274608"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p36925.jpg","id":"1275721"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1398676888.79.jpg","id":"1314535"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1477464497.27.jpg","id":"1275243"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1411832447.57.jpg","id":"1036905"}]},{"movieName":"西虹市首富","releaseDate":["2018-07-27(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2525046210.jpg","id":"27605698","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1437030925.47.jpg","id":"1350410"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1437031053.5.jpg","id":"1350409"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1356510694.28.jpg","id":"1325700"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1446281965.79.jpg","id":"1341903"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1413261818.41.jpg","id":"1322777"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p11764.jpg","id":"1275270"}]},{"movieName":"昨日青空","releaseDate":["2018-07-27(中国大陆)"],"runtime":[],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2516062089.jpg","id":"26290410","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1501816663.13.jpg","id":"1378560"}]},{"movieName":"神奇马戏团之动物饼干 Magical Circus : Animal Crackers","releaseDate":["2018-07-27(中国大陆)","2017-06-12(安锡动画电影节)"],"runtime":["94分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2524820126.jpg","id":"26253783","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1500617178.26.jpg","id":"1277815"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1500623271.8.jpg","id":"1206807"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p21481.jpg","id":"1041022"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1452855116.89.jpg","id":"1027146"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1453792417.87.jpg","id":"1054410"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p262.jpg","id":"1047996"}]},{"movieName":"男生宿舍","releaseDate":["2018-07-27(中国大陆)"],"runtime":["85分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526907635.jpg","id":"30263334","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1359886"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/pFufJA31l8ewcel_avatar_uploaded1505805364.1.jpg","id":"1381517"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1359885"}]},{"movieName":"解码游戏","releaseDate":["2018-08-03(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2523515546.jpg","id":"26767512","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1521528597.3.jpg","id":"1388759"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1519976356.71.jpg","id":"1275667"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1372773609.01.jpg","id":"1274684"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1439792310.44.jpg","id":"1314374"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p20858.jpg","id":"1000845"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1388979190.01.jpg","id":"1325650"}]},{"movieName":"神秘世界历险记4","releaseDate":["2018-08-03(中国大陆)"],"runtime":["85分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2524334932.jpg","id":"30208005","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1436771114.49.jpg","id":"1321732"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1528456334.7.jpg","id":"1395143"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1392959"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1526278703.48.jpg","id":"1340809"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1439298716.36.jpg","id":"1343032"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1478051011.64.jpg","id":"1325740"}]},{"movieName":"肆式青春 詩季織々","releaseDate":["2018-08-04(中国大陆/日本)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526429256.jpg","id":"30156898","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p41706.jpg","id":"1317854"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1470884079.3.jpg","id":"1343518"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p51585.jpg","id":"1275208"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1509958646.03.jpg","id":"1372491"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p3730.jpg","id":"1033762"}]},{"movieName":"一出好戏","releaseDate":["2018-08-10(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2519710743.jpg","id":"26985127","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1656.jpg","id":"1274242"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1656.jpg","id":"1274242"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1268.jpg","id":"1138320"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1356403251.95.jpg","id":"1274388"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1421061916.72.jpg","id":"1338949"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1365451897.03.jpg","id":"1313742"}]},{"movieName":"爱情公寓","releaseDate":["2018-08-10(中国大陆)"],"runtime":["115分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2521648155.jpg","id":"24852545","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1526270943.26.jpg","id":"1313918"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1420296836.46.jpg","id":"1313841"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1359911910.82.jpg","id":"1313784"},{"actorImg":"https://img3.doubanio.com/f/movie/14960825e118267b5857fc0ae9f306ef8c74da8f/pics/movie/has_douban@2x.png","id":"1274361"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1413815568.5.jpg","id":"1313842"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p32405.jpg","id":"1313030"}]},{"movieName":"巨齿鲨","releaseDate":["2018-08-10(美国/中国大陆)"],"runtime":["113分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522867936.jpg","id":"26426194","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1379831737.28.jpg","id":"1022710"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p424.jpg","id":"1049484"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p37168.jpg","id":"1040990"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p9747.jpg","id":"1004593"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1437836004.32.jpg","id":"1344655"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p13912.jpg","id":"1018759"}]},{"movieName":"美食大冒险之英雄烩","releaseDate":["2018-08-10(中国大陆)"],"runtime":["90分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2523685087.jpg","id":"26290398","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/pnSS497gRZs0cel_avatar_uploaded1520596328.84.jpg","id":"1389867"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1523420388.1.jpg","id":"1391413"}]},{"movieName":"勇者闯魔城","releaseDate":["2018-08-10(中国大陆)"],"runtime":["80分钟"],"postPic":"https://img3.doubanio.com/f/movie/30c6263b6db26d055cbbe73fe653e29014142ea3/pics/movie/movie_default_large.png","id":"30125089","actorAddMsg":[]},{"movieName":"大轰炸","releaseDate":["2018-08-17(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526886166.jpg","id":"26331700","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p55191.jpg","id":"1323070"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1525674287.43.jpg","id":"1000572"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p106.jpg","id":"1010509"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p58139.jpg","id":"1028283"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1409055274.95.jpg","id":"1275970"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1120.jpg","id":"1051526"}]},{"movieName":"如影随心","releaseDate":["2018-08-17(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2521804753.jpg","id":"26871669","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p2187.jpg","id":"1006351"},{"actorImg":"https://img3.doubanio.com/f/movie/14960825e118267b5857fc0ae9f306ef8c74da8f/pics/movie/has_douban@2x.png","id":"1325412"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1368850348.93.jpg","id":"1323516"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1501833870.86.jpg","id":"1367682"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1376103579.93.jpg","id":"1275459"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1501058214.75.jpg","id":"1322856"}]},{"movieName":"快把我哥带走","releaseDate":["2018-08-17(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2524963561.jpg","id":"30122633","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p13508.jpg","id":"1276077"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1465826349.1.jpg","id":"1274254"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1523448357.59.jpg","id":"1354775"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1450954931.7.jpg","id":"1337036"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1521533180.63.jpg","id":"1390023"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1521008071.63.jpg","id":"1390025"}]},{"movieName":"未来机器城","releaseDate":["2018-08-17(中国大陆)"],"runtime":["90分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526130265.jpg","id":"27200988","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1308172"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1392324"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1381744526.75.jpg","id":"1043136"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p18124.jpg","id":"1274430"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1466089000.89.jpg","id":"1276048"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33797.jpg","id":"1049521"}]},{"movieName":"大师兄 大師兄","releaseDate":["2018-08-17(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2505282016.jpg","id":"27201353","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1509265076.8.jpg","id":"1360179"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p10695.jpg","id":"1025194"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1352270627.38.jpg","id":"1022095"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1410928316.73.jpg","id":"1339113"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1498315032.73.jpg","id":"1375963"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1339998"}]},{"movieName":"最后的棒棒","releaseDate":["2018-08-17(中国大陆)"],"runtime":["98分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2525855331.jpg","id":"30254589","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1529657375.78.jpg","id":"1396140"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1396211"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1396212"}]},{"movieName":"他是一只狗","releaseDate":["2018-08-17(中国大陆)"],"runtime":[],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2524690349.jpg","id":"30246086","actorAddMsg":[]},{"movieName":"冷恋时代","releaseDate":["2018-08-17(中国大陆)"],"runtime":["90分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2526398939.jpg","id":"24743257","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1503476493.41.jpg","id":"1322330"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p58546.jpg","id":"1318516"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p13748.jpg","id":"1276163"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1434427963.93.jpg","id":"1319717"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1414312569.2.jpg","id":"1342368"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p51762.jpg","id":"1275781"}]},{"movieName":"大三儿","releaseDate":["2018-08-20(中国大陆)","2018-04-08(北京电影节)"],"runtime":["102分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2524686802.jpg","id":"27119292","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1524120551.67.jpg","id":"1331818"}]},{"movieName":"反贪风暴3 L風暴","releaseDate":["2018-08-24(中国大陆)"],"runtime":["100分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2523433444.jpg","id":"26996640","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1357529568.73.jpg","id":"1326068"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1421047436.79.jpg","id":"1027577"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1241.jpg","id":"1050979"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p40550.jpg","id":"1274666"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p2292.jpg","id":"1028496"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1527573820.78.jpg","id":"1384345"}]},{"movieName":"七袋米 Pitong kabang palay","releaseDate":["2018-08-24(中国大陆)","2016-07(菲律宾)"],"runtime":["103分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2523428620.jpg","id":"26881698","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1394717"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1528361630.29.jpg","id":"1394718"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1528361668.38.jpg","id":"1394719"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1528361702.91.jpg","id":"1394720"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1528361720.33.jpg","id":"1394721"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1528361756.85.jpg","id":"1394722"}]},{"movieName":"让我怎么相信你","releaseDate":["2018-08-24(中国大陆)","2018-06-20(上海电影节)"],"runtime":["88分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2524057566.jpg","id":"30199575","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/pmdyYPIz8xBscel_avatar_uploaded1527923692.92.jpg","id":"1394911"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1528357105.88.jpg","id":"1346401"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1399.jpg","id":"1222588"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1527852100.54.jpg","id":"1313920"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1494494152.36.jpg","id":"1351426"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1420531092.61.jpg","id":"1274496"}]},{"movieName":"道高一丈","releaseDate":["2018-08-24(中国大陆)"],"runtime":["96分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2525075944.jpg","id":"26954268","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1464595053.55.jpg","id":"1317408"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1357005509.65.jpg","id":"1275718"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p39183.jpg","id":"1275687"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1417604913.76.jpg","id":"1274777"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1369806599.49.jpg","id":"1318978"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1406964972.04.jpg","id":"1326513"}]},{"movieName":"惊慌失色之诡寓","releaseDate":["2018-08-24(中国大陆)"],"runtime":["86分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2523962446.jpg","id":"30237381","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1394486"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1350835"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1528086993.26.jpg","id":"1394582"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1528086884.46.jpg","id":"1373521"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1505265692.06.jpg","id":"1350833"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1394583"}]},{"movieName":"旅行吧！井底之蛙","releaseDate":["2018-08-25(中国大陆)"],"runtime":["78分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2526253237.jpg","id":"30236775","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1522123651.83.jpg","id":"1390460"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1470558117.44.jpg","id":"1348775"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1470557893.97.jpg","id":"1360698"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1527751472.33.jpg","id":"1388593"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1527751377.68.jpg","id":"1394465"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1527751449.93.jpg","id":"1388594"}]},{"movieName":"我，花样女王 I, Tonya","releaseDate":["2018-08(中国大陆)","2017-09-08(多伦多电影节)","2017-12-08(美国)"],"runtime":["120分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2508862676.jpg","id":"26756049","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p28271.jpg","id":"1284873"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1389939796.3.jpg","id":"1272303"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1359893856.03.jpg","id":"1021985"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1411307204.54.jpg","id":"1041139"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1407320473.63.jpg","id":"1341943"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1476733537.95.jpg","id":"1340538"}]},{"movieName":"蚁人2：黄蜂女现身 Ant-Man and the Wasp","releaseDate":["2018-08(中国大陆)","2018-07-06(美国)"],"runtime":["118分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2520805931.jpg","id":"26636712","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p38984.jpg","id":"1009586"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1501385708.56.jpg","id":"1002667"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p4077.jpg","id":"1021963"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p4023.jpg","id":"1053620"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1454118774.76.jpg","id":"1131634"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1519057306.8.jpg","id":"1350528"}]},{"movieName":"碟中谍6：全面瓦解 Mission: Impossible - Fallout","releaseDate":["2018-08(中国大陆)","2018-07-27(美国)"],"runtime":["147分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522117711.jpg","id":"26336252","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p52867.jpg","id":"1276314"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p567.jpg","id":"1054435"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1371934661.95.jpg","id":"1044713"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p31209.jpg","id":"1035648"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1376924506.04.jpg","id":"1088314"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p8712.jpg","id":"1048129"}]},{"movieName":"镰仓物语 DESTINY 鎌倉ものがたり","releaseDate":["2018-08(中国大陆)","2017-12-09(日本)"],"runtime":["129分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2500030418.jpg","id":"26916229","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p53321.jpg","id":"1301398"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1353675638.54.jpg","id":"1028795"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1416788895.28.jpg","id":"1330848"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p4033.jpg","id":"1151079"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1442220877.34.jpg","id":"1274350"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p3595.jpg","id":"1008191"}]},{"movieName":"影","releaseDate":["2018-08(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2515014752.jpg","id":"4864908","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p568.jpg","id":"1054398"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p805.jpg","id":"1274235"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1415690807.36.jpg","id":"1004856"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1366015827.84.jpg","id":"1275564"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1445948736.67.jpg","id":"1314827"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p12560.jpg","id":"1275934"}]},{"movieName":"边境杀手2：边境战士 Sicario: Day of the Soldado","releaseDate":["2018-08(中国大陆)","2018-06-29(美国)"],"runtime":["122分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2518403013.jpg","id":"26627736","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1454133807.34.jpg","id":"1046134"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1395662512.69.jpg","id":"1041005"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1413615170.39.jpg","id":"1004568"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1497256004.65.jpg","id":"1356047"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p4291.jpg","id":"1002681"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1398675502.01.jpg","id":"1044732"}]},{"movieName":"营救汪星人","releaseDate":["2018-08(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2514930111.jpg","id":"26930565","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1525839636.26.jpg","id":"1323397"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1493024739.47.jpg","id":"1323398"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1477019562.2.jpg","id":"1363049"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p45672.jpg","id":"1274279"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1494494152.36.jpg","id":"1351426"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p39566.jpg","id":"1317360"}]},{"movieName":"找到你","releaseDate":["2018-08(中国大陆)","2018-06-17(上海电影节)"],"runtime":["102分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2520354941.jpg","id":"27140071","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1356503267.54.jpg","id":"1274303"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1525664924.95.jpg","id":"1029395"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1415523283.1.jpg","id":"1011935"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p6464.jpg","id":"1274820"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1461753133.52.jpg","id":"1357212"},{"actorImg":"https://img3.doubanio.com/f/movie/14960825e118267b5857fc0ae9f306ef8c74da8f/pics/movie/has_douban@2x.png","id":"1350899"}]},{"movieName":"断片之险途夺宝","releaseDate":["2018-08(中国大陆)"],"runtime":["114分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2410379359.jpg","id":"26882457","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/pbYO4zDByocwcel_avatar_uploaded1352024636.33.jpg","id":"1324612"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p46.jpg","id":"1000905"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p40756.jpg","id":"1317663"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p5908.jpg","id":"1016663"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p35594.jpg","id":"1041425"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33945.jpg","id":"1315866"}]},{"movieName":"墨多多谜境冒险","releaseDate":["2018-08(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526874732.jpg","id":"26790960","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1369623581.05.jpg","id":"1274891"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p44442.jpg","id":"1274463"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p39129.jpg","id":"1312846"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1521978406.32.jpg","id":"1390572"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1511444597.51.jpg","id":"1384585"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1362390143.98.jpg","id":"1327150"}]},{"movieName":"沉默的证人","releaseDate":["2018-08(中国大陆)"],"runtime":["100分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2516301647.jpg","id":"26816090","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p21181.jpg","id":"1032052"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1376548148.48.jpg","id":"1037273"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1417797081.77.jpg","id":"1314124"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1549.jpg","id":"1009888"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1412521526.46.jpg","id":"1336802"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1466151868.26.jpg","id":"1317068"}]},{"movieName":"武林怪兽","releaseDate":["2018-08(中国大陆)"],"runtime":[],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2455072699.jpg","id":"26425062","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1403267018.07.jpg","id":"1106979"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1421047436.79.jpg","id":"1027577"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p36798.jpg","id":"1274224"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1379398896.7.jpg","id":"1274514"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1508145845.01.jpg","id":"1326363"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33945.jpg","id":"1315866"}]},{"movieName":"真相漩涡 Spinning Man","releaseDate":["2018-08(中国大陆)","2018-04-06(美国)"],"runtime":["100分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2512974718.jpg","id":"26792540","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1406542915.18.jpg","id":"1341723"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p381.jpg","id":"1035672"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p50837.jpg","id":"1031219"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p8623.jpg","id":"1004602"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1410851175.5.jpg","id":"1325214"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1398762158.38.jpg","id":"1000083"}]},{"movieName":"摔跤手苏丹 Sultan","releaseDate":["2018-08(中国大陆)","2016-07-06(印度)"],"runtime":["170分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2333456991.jpg","id":"26728641","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1502246478.77.jpg","id":"1378742"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1355291691.29.jpg","id":"1017831"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1431791068.5.jpg","id":"1045145"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p42919.jpg","id":"1018111"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1354238291.21.jpg","id":"1325358"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1470195430.05.jpg","id":"1360638"}]},{"movieName":"跨越8年的新娘 8年越しの花嫁","releaseDate":["2018-08(中国大陆)","2017-12-16(日本)"],"runtime":["119分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2462852467.jpg","id":"26929835","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p25432.jpg","id":"1314621"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1419865642.6.jpg","id":"1227580"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1406782114.56.jpg","id":"1315335"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p41099.jpg","id":"1012650"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p35122.jpg","id":"1316095"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1437115194.03.jpg","id":"1274749"}]},{"movieName":"大闹西游","releaseDate":["2018-08(中国大陆)"],"runtime":[],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2512988248.jpg","id":"30142649","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1369032514.95.jpg","id":"1329113"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1388536"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1388537"}]},{"movieName":"李宗伟：败者为王 Lee Chong Wei","releaseDate":["2018-08(中国大陆)","2018-03-15(马来西亚)"],"runtime":["110分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522263011.jpg","id":"27195119","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1526456206.64.jpg","id":"1393204"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1379318065.51.jpg","id":"1329095"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p29018.jpg","id":"1315164"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1526456247.61.jpg","id":"1393209"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1526456260.4.jpg","id":"1393205"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1526456271.99.jpg","id":"1393206"}]},{"movieName":"黑脸大包公之西夏风云","releaseDate":["2018-08(中国大陆)"],"runtime":["86分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2504373922.jpg","id":"27192660","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1383834"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1383840"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1383841"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1500536967.48.jpg","id":"1377697"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1383842"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1383843"}]},{"movieName":"幸福魔咒","releaseDate":["2018-08(中国大陆)"],"runtime":[],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2510207097.jpg","id":"27661975","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1496730965.95.jpg","id":"1316775"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p5945.jpg","id":"1274683"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p36712.jpg","id":"1316540"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1405392244.19.jpg","id":"1274530"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1474121308.86.jpg","id":"1362292"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1496901561.89.jpg","id":"1315506"}]},{"movieName":"阿里巴巴三根金发","releaseDate":["2018-08(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2518648744.jpg","id":"30176069","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1505789251.02.jpg","id":"1361983"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1374403"}]},{"movieName":"黑暗深处之惊魂夜","releaseDate":["2018-09-07(中国大陆)"],"runtime":["90分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526509193.jpg","id":"30259493","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530504979.28.jpg","id":"1396470"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530504990.63.jpg","id":"1396471"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530505004.77.jpg","id":"1396472"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530505016.06.jpg","id":"1389869"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530505026.31.jpg","id":"1396473"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530505037.92.jpg","id":"1395439"}]},{"movieName":"恩师","releaseDate":["2018-09-10(中国大陆)"],"runtime":["89分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2525580687.jpg","id":"30215191","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1440682814.43.jpg","id":"1342632"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1502082490.27.jpg","id":"1329886"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1525685444.12.jpg","id":"1392430"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1525685466.03.jpg","id":"1326947"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1342633"}]},{"movieName":"勇敢往事","releaseDate":["2018-09-12(中国大陆)","2018-06-18(上海电影节)"],"runtime":["91分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2524173793.jpg","id":"27191430","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/pGpynvK44y08cel_avatar_uploaded1397876393.45.jpg","id":"1339798"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p37025.jpg","id":"1316634"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1522824500.67.jpg","id":"1391127"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1522824518.67.jpg","id":"1391128"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1522824531.04.jpg","id":"1391129"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1522824542.87.jpg","id":"1391130"}]},{"movieName":"江湖儿女","releaseDate":["2018-09-21(中国大陆)","2018-05-11(戛纳电影节)"],"runtime":["141分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522902491.jpg","id":"26972258","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p38530.jpg","id":"1274261"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1448114660.11.jpg","id":"1005985"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1454644679.84.jpg","id":"1007401"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p43738.jpg","id":"1274297"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1391457"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p45667.jpg","id":"1274255"}]},{"movieName":"一生有你","releaseDate":["2018-09-21(中国大陆)"],"runtime":[],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2525580888.jpg","id":"26263417","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1381379959.04.jpg","id":"1326070"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p35791.jpg","id":"1023236"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1447243509.27.jpg","id":"1352794"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1474118243.45.jpg","id":"1362288"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1495034924.47.jpg","id":"1350870"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1455955256.83.jpg","id":"1354821"}]},{"movieName":"禹神传之寻找神力","releaseDate":["2018-09-22(中国大陆)"],"runtime":["80分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2526149718.jpg","id":"30227727","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1518344540.18.jpg","id":"1359918"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1470558117.44.jpg","id":"1348775"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1470557893.97.jpg","id":"1360698"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1527751472.33.jpg","id":"1388593"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1527751449.93.jpg","id":"1388594"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1470558219.66.jpg","id":"1360699"}]},{"movieName":"李茶的姑妈","releaseDate":["2018-09-30(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2512975871.jpg","id":"27092785","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1519453974.12.jpg","id":"1313050"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1519453932.46.jpg","id":"1363857"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1437031126.82.jpg","id":"1350408"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1437031175.04.jpg","id":"1350407"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1501497925.32.jpg","id":"1018743"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1388864"}]},{"movieName":"无双","releaseDate":["2018-09-30(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522375910.jpg","id":"26425063","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p3555.jpg","id":"1014716"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p35678.jpg","id":"1044899"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p49475.jpg","id":"1041390"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p146.jpg","id":"1016668"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1358427208.9.jpg","id":"1274268"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1407300415.4.jpg","id":"1316330"}]},{"movieName":"云南虫谷","releaseDate":["2018-09-30(中国大陆)"],"runtime":[],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2522870928.jpg","id":"26744597","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1458028959.79.jpg","id":"1320824"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p43387.jpg","id":"1318565"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p38096.jpg","id":"1316959"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1477461192.41.jpg","id":"1363813"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1505111449.77.jpg","id":"1196361"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1364787307.66.jpg","id":"1327671"}]},{"movieName":"胖子行动队","releaseDate":["2018-09-30(中国大陆)"],"runtime":[],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2526215398.jpg","id":"27149818","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33945.jpg","id":"1315866"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33945.jpg","id":"1315866"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p28063.jpg","id":"1011513"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1412521526.46.jpg","id":"1336802"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1518619619.57.jpg","id":"1362516"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1453177080.67.jpg","id":"1354144"}]},{"movieName":"山2 Dağ II","releaseDate":["2018-09(中国大陆)","2016-11-04(土耳其)"],"runtime":["135分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2448817847.jpg","id":"26911450","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/pkdBC0cV6tj8cel_avatar_uploaded1506859687.11.jpg","id":"1382097"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1507800193.01.jpg","id":"1382434"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1507701205.25.jpg","id":"1273514"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1507800335.78.jpg","id":"1382436"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1507800453.64.jpg","id":"1382438"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1507800545.89.jpg","id":"1308974"}]},{"movieName":"护垫侠 Padman","releaseDate":["2018-09(中国大陆)","2018-01-26(印度)"],"runtime":["140分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2504951544.jpg","id":"27198855","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1373516277.14.jpg","id":"1311506"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p14444.jpg","id":"1049615"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1486452827.09.jpg","id":"1329473"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1402744446.01.jpg","id":"1018143"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p9190.jpg","id":"1027845"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1526445187.47.jpg","id":"1249316"}]},{"movieName":"阳台上","releaseDate":["2018-09(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2519517034.jpg","id":"27135473","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p21865.jpg","id":"1314120"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p36798.jpg","id":"1274224"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1505964712.56.jpg","id":"1381513"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/pJqFKOp0wuJwcel_avatar_uploaded1404111897.49.jpg","id":"1341082"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1505269082.68.jpg","id":"1381118"}]},{"movieName":"苦行僧的非凡旅程 The Extraordinary Journey of The Fakir","releaseDate":["2018-09(中国大陆)","2018-05-30(法国)"],"runtime":["92分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2516475337.jpg","id":"26715965","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p57371.jpg","id":"1323854"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1416058853.23.jpg","id":"1219536"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1355595790.83.jpg","id":"1126302"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p34849.jpg","id":"1009461"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1384941323.0.jpg","id":"1335066"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1385629339.13.jpg","id":"1170187"}]},{"movieName":"阴阳师","releaseDate":["2018-10-01(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2436898714.jpg","id":"26935283","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p19498.jpg","id":"1313669"}]},{"movieName":"阿凡提之奇缘历险","releaseDate":["2018-10-01(中国大陆)"],"runtime":["85分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526210014.jpg","id":"30208004","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1349855"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1498555461.54.jpg","id":"1328393"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1498555670.36.jpg","id":"1326522"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1501515009.39.jpg","id":"1318536"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p37509.jpg","id":"1316809"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1330934"}]},{"movieName":"灵魂的救赎","releaseDate":["2018-10-12(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526119633.jpg","id":"27620911","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1371632185.22.jpg","id":"1317043"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1371453539.51.jpg","id":"1317139"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p35292.jpg","id":"1316146"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1519951488.42.jpg","id":"1382061"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/pWg5B9JBiCeQcel_avatar_uploaded1414614307.33.jpg","id":"1344390"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1519951547.81.jpg","id":"1333286"}]},{"movieName":"功夫联盟","releaseDate":["2018-10-19(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2525765766.jpg","id":"27008394","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p45374.jpg","id":"1274431"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p44857.jpg","id":"1000526"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p41268.jpg","id":"1045364"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1437726752.75.jpg","id":"1229775"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p34636.jpg","id":"1315999"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1svtif7x5Hccel_avatar_uploaded1470896151.19.jpg","id":"1360986"}]},{"movieName":"过往的梦","releaseDate":["2018-11-11(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2514658323.jpg","id":"27107609","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1394899519.58.jpg","id":"1275029"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1501640573.19.jpg","id":"1366630"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1453176880.94.jpg","id":"1339970"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1527234581.35.jpg","id":"1376830"}]},{"movieName":"银魂2 銀魂2 掟は破るためにこそある","releaseDate":["2018-11(中国大陆)","2018-08-17(日本)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2523155593.jpg","id":"27199577","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/pFKu5xNiNm4cel_avatar_uploaded1353514889.89.jpg","id":"1325118"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1387002546.12.jpg","id":"1014229"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1402644225.57.jpg","id":"1274418"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1384761261.76.jpg","id":"1322189"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1399275661.42.jpg","id":"1000910"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1452688394.85.jpg","id":"1315730"}]},{"movieName":"碟仙实录","releaseDate":["2018-12-08(中国大陆)"],"runtime":["90分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2513010136.jpg","id":"26961483","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1486356015.36.jpg","id":"1338541"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1485166628.86.jpg","id":"1338542"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/pjIjJYvA6dRkcel_avatar_uploaded1395890060.84.jpg","id":"1339425"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1435994595.87.jpg","id":"1349812"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1467122681.57.jpg","id":"1358861"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1467126083.37.jpg","id":"1349813"}]},{"movieName":"素人特工","releaseDate":["2018-12-21(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2520315722.jpg","id":"27155276","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1453166767.25.jpg","id":"1312751"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/pbA7b3PGSjgMcel_avatar_uploaded1404566496.8.jpg","id":"1341187"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p12665.jpg","id":"1226703"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p2431.jpg","id":"1025154"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1461493374.02.jpg","id":"1354503"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1484724639.22.jpg","id":"1367246"}]},{"movieName":"人间·喜剧","releaseDate":["2018-12-28(中国大陆)"],"runtime":[],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2520444307.jpg","id":"27179414","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p35187.jpg","id":"1298649"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1437031126.82.jpg","id":"1350408"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1443582361.31.jpg","id":"1321587"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p50150.jpg","id":"1321098"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p32611.jpg","id":"1275482"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p32971.jpg","id":"1031194"}]},{"movieName":"阿丽塔：战斗天使 Alita: Battle Angel","releaseDate":["2018-12(中国大陆)","2018-12-21(美国)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2507205345.jpg","id":"1652592","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1378050540.89.jpg","id":"1019016"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1501911452.02.jpg","id":"1342762"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p26974.jpg","id":"1054405"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33305.jpg","id":"1016673"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1370589932.99.jpg","id":"1329130"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1424533850.33.jpg","id":"1004702"}]},{"movieName":"动物特工局","releaseDate":["2018-12(中国大陆)"],"runtime":["90分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522171412.jpg","id":"30217371","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1506496734.81.jpg","id":"1329011"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1526270284.47.jpg","id":"1392926"}]},{"movieName":"疯狂的外星人","releaseDate":["2019-02-05(中国大陆)"],"runtime":[],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2494085798.jpg","id":"25986662","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/f/movie/14960825e118267b5857fc0ae9f306ef8c74da8f/pics/movie/has_douban@2x.png","id":"1274265"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1656.jpg","id":"1274242"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1356510694.28.jpg","id":"1325700"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1490094314.69.jpg","id":"1211775"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p21564.jpg","id":"1040498"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1501049663.64.jpg","id":"1378072"}]},{"movieName":"神探蒲松龄之兰若仙踪","releaseDate":["2019-02-05(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2510966061.jpg","id":"27065898","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1454563315.64.jpg","id":"1342236"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p694.jpg","id":"1054531"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p21006.jpg","id":"1259866"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1513674760.63.jpg","id":"1357009"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1425307712.95.jpg","id":"1275324"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p11632.jpg","id":"1275739"}]},{"movieName":"八仙之各显神通","releaseDate":["2019-02-05(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2359898391.jpg","id":"26277338","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p44277.jpg","id":"1318745"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/pnRg3FudltQkcel_avatar_uploaded1527556010.55.jpg","id":"1394297"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1368697548.88.jpg","id":"1005319"}]},{"movieName":"误入江湖","releaseDate":["2019-02-05(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2520092902.jpg","id":"30187577","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1524465782.06.jpg","id":"1323923"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1460513318.54.jpg","id":"1329637"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1403277374.05.jpg","id":"1274276"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1357290860.44.jpg","id":"1037662"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p43028.jpg","id":"1318482"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1524465841.07.jpg","id":"1366659"}]},{"movieName":"迦百农 كفرناحوم","releaseDate":["2019-02(中国大陆)","2018-05-17(戛纳电影节)"],"runtime":["120分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522351703.jpg","id":"30170448","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p18917.jpg","id":"1275745"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1395544"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1395545"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p18917.jpg","id":"1275745"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/pa96FEdlJe08cel_avatar_uploaded1526709219.38.jpg","id":"1393813"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1395542"}]},{"movieName":"画皮Ⅲ","releaseDate":["2019-07(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2436898494.jpg","id":"24743117","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p42814.jpg","id":"1053618"}]},{"movieName":"八仙过海","releaseDate":["2019-07(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/f/movie/30c6263b6db26d055cbbe73fe653e29014142ea3/pics/movie/movie_default_large.png","id":"30226052","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33149.jpg","id":"1274390"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1458020032.08.jpg","id":"1275626"}]},{"movieName":"摸金校尉之九幽将军","releaseDate":["2019-10-01(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2436898546.jpg","id":"26986120","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1393840734.39.jpg","id":"1007152"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p42814.jpg","id":"1053618"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1403755512.92.jpg","id":"1340983"}]},{"movieName":"唐人街探案3","releaseDate":["2020-01-25(中国大陆)"],"runtime":[],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2517591798.jpg","id":"27619748","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1469073193.92.jpg","id":"1274763"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1473508881.63.jpg","id":"1336305"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1356403251.95.jpg","id":"1274388"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1465826349.1.jpg","id":"1274254"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1473312809.58.jpg","id":"1037028"}]},{"movieName":"黑色假面","releaseDate":["2020-10-01(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2437013616.jpg","id":"26986136","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1398689641.61.jpg","id":"1054529"}]}]

/***/ },
/* 29 */
/***/ function(module, exports) {

module.exports = [{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031908/4b65cfd59ecda0edf6277b1b41d74e8e/view/movie/M/402320621.mp4","trailerTitle":"我不是药神\n    预告片1：国际版 (中文字幕)","trailerDate":"2018-06-20"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/1e359ea59f01f47758da14b7f1da823f/view/movie/M/402310611.mp4","trailerTitle":"我不是药神\n    预告片2：治愈小队集结版 (中文字幕)","trailerDate":"2018-05-29"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/b22d3118a653e03a35c977fc0f8c267a/view/movie/M/402290865.mp4","trailerTitle":"我不是药神\n    先行版 (中文字幕)","trailerDate":"2018-04-16"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/85865cc68e9356ba300fb070931e636c/view/movie/M/402320610.mp4","trailerTitle":"我不是药神\n    花絮1：观影会客厅 | 36变的电影市场，72变的影人宁浩","trailerDate":"2018-06-19"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/0e420d7c835d4e96f0b65c2c3bea78a6/view/movie/M/402320249.mp4","trailerTitle":"我不是药神\n    花絮2：“两弹一新”导演特辑 (中文字幕)","trailerDate":"2018-06-11"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/fea002a3a4882d8686c58c60e59cb442/view/movie/M/402310334.mp4","trailerTitle":"我不是药神\n    花絮3：徐峥特辑 (中文字幕)","trailerDate":"2018-05-22"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/0b4a73f39664974b9cf0c6762dfbdd0e/view/movie/M/402310102.mp4","trailerTitle":"我不是药神\n    花絮4：治愈小队特辑 (中文字幕)","trailerDate":"2018-05-17"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/3bfb63858a0ac58772c59905e6bdfa70/view/movie/M/302180236.mp4","trailerTitle":"我不是药神\n    花絮5：导演文牧野特辑 (中文字幕)","trailerDate":"2017-06-18"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/cb6a91176b145b68918159b20ad5f3d1/view/movie/M/402320553.mp4","trailerTitle":"我不是药神\n    MV：主题曲《生如夏花》 (中文字幕)","trailerDate":"2018-06-16"}],"id":"26752088"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031908/2f7150435bcc5e9085b8ea2312d2b855/view/movie/M/402330039.mp4","trailerTitle":"新大头儿子和小头爸爸3：俄罗斯奇遇记\n    预告片1：终极版 (中文字幕)","trailerDate":"2018-06-28"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/5c6418e12bc1f9f69f70aebef092afea/view/movie/M/402310715.mp4","trailerTitle":"新大头儿子和小头爸爸3：俄罗斯奇遇记\n    预告片2：配音版 (中文字幕)","trailerDate":"2018-05-31"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/dc999f755411de62fac70bb1ff0dd898/view/movie/M/402310333.mp4","trailerTitle":"新大头儿子和小头爸爸3：俄罗斯奇遇记\n    预告片3：剧情版 (中文字幕)","trailerDate":"2018-05-22"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/b81eee623aab2a5c0ce608e54d5d9544/view/movie/M/402320166.mp4","trailerTitle":"新大头儿子和小头爸爸3：俄罗斯奇遇记\n    其它预告片：消防视频 (中文字幕)","trailerDate":"2018-06-08"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/0ed983c1cfa2c55f6dc3a0119d22acc6/view/movie/M/402320915.mp4","trailerTitle":"新大头儿子和小头爸爸3：俄罗斯奇遇记\n    MV1：黄晓明献唱同名主题曲 (中文字幕)","trailerDate":"2018-06-26"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/e2b67bcc75811efaec5f9150e681ea95/view/movie/M/402320353.mp4","trailerTitle":"新大头儿子和小头爸爸3：俄罗斯奇遇记\n    MV2：主题曲《一颗童心》 (中文字幕)","trailerDate":"2018-06-13"}],"id":"30198729"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031908/9a762af1f72a99a0b9fee52a218a10e5/view/movie/M/402330221.mp4","trailerTitle":"只能活一个\n    预告片 (中文字幕)","trailerDate":"2018-07-03"}],"id":"27195126"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031908/967ccdff7ce12bda8a9e43c1be09f947/view/movie/M/402330220.mp4","trailerTitle":"您一定不要错过\n    预告片 (中文字幕)","trailerDate":"2018-07-03"}],"id":"30255216"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031908/574c9c1b859ed193a342f18abe863666/view/movie/M/402320973.mp4","trailerTitle":"细思极恐\n    预告片 (中文字幕)","trailerDate":"2018-06-27"}],"id":"30235134"},{"trailerArray":[],"id":"30261979"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031908/d194e637ef7a307cdda94e00d5de1715/view/movie/M/402330222.mp4","trailerTitle":"红盾先锋\n    预告片 (中文字幕)","trailerDate":"2018-07-03"}],"id":"26614101"},{"trailerArray":[],"id":"27053277"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031908/78455e4e60ea7b08b92978d68e4b9e1d/view/movie/M/402330091.mp4","trailerTitle":"邪不压正\n    预告片1：终极版 (中文字幕)","trailerDate":"2018-06-29"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/7f73bf3aaab14db9e76d90bd572b151c/view/movie/M/402320465.mp4","trailerTitle":"邪不压正\n    预告片2：剧情版 (中文字幕)","trailerDate":"2018-06-14"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/62c4ac0415e7aba49b84ade53cdba31a/view/movie/M/402310013.mp4","trailerTitle":"邪不压正\n    预告片3：定档版 (中文字幕)","trailerDate":"2018-05-16"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/49ec79e7e65b04439ca817d69f022c57/view/movie/M/302270161.mp4","trailerTitle":"邪不压正\n    先行版 (中文字幕)","trailerDate":"2018-02-05"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/b76addca40dd6acb75b02c904d10180d/view/movie/M/402310761.mp4","trailerTitle":"邪不压正\n    其它预告片：脚不沾地版 (中文字幕)","trailerDate":"2018-06-01"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/6e3263a33b7e8b717bf7a1b3129e0ea0/view/movie/M/402330038.mp4","trailerTitle":"邪不压正\n    花絮1：京片儿小课堂特辑 (中文字幕)","trailerDate":"2018-06-28"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/d1145e1accb1f1fb8626f8d15e11afd5/view/movie/M/402320450.mp4","trailerTitle":"邪不压正\n    花絮2：“廖是真有料”特辑 (中文字幕)","trailerDate":"2018-06-14"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/5c4423ac6fdc408e10fdee0a1c4fa4d7/view/movie/M/402320265.mp4","trailerTitle":"邪不压正\n    花絮3：先生们特辑 (中文字幕)","trailerDate":"2018-06-12"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/651156acd0fc40016f64cc429e277658/view/movie/M/402320248.mp4","trailerTitle":"邪不压正\n    花絮4：姜文“吓哭”彭于晏 (中文字幕)","trailerDate":"2018-06-11"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/de39cceac6e987199826bbb8495a43d6/view/movie/M/402310335.mp4","trailerTitle":"邪不压正\n    花絮5 (中文字幕)","trailerDate":"2018-05-22"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/63ed7679f27c47517d2a4d410456cb87/view/movie/M/402310861.mp4","trailerTitle":"邪不压正\n    其它花絮：GQ特辑","trailerDate":"2018-06-04"}],"id":"26366496"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031908/2a74dcef31fba17cceb425c54dfe5752/view/movie/M/402320634.mp4","trailerTitle":"阿修罗\n    预告片1：对决版 (中文字幕)","trailerDate":"2018-06-20"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/3c8819061e6126459d0d8a54a10f63b5/view/movie/M/402310632.mp4","trailerTitle":"阿修罗\n    预告片2：正义之战版 (中文字幕)","trailerDate":"2018-05-29"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/6acd69f75c111092c3845b71499e3dc5/view/movie/M/302280924.mp4","trailerTitle":"阿修罗\n    预告片3：救世重生版 (中文字幕)","trailerDate":"2018-03-21"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/fa5f5217342a088a369667da3c388391/view/movie/M/302260282.mp4","trailerTitle":"阿修罗\n    先行版：欲海寻人版 (中文字幕)","trailerDate":"2018-01-17"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/f9c037d0336c0265d74ef8565651300f/view/movie/M/402330182.mp4","trailerTitle":"阿修罗\n    花絮1：揭秘三头特辑 (中文字幕)","trailerDate":"2018-07-02"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/242fc0c4bd77edcc0756600ab00e8f6a/view/movie/M/402330105.mp4","trailerTitle":"阿修罗\n    花絮2 (中文字幕)","trailerDate":"2018-06-29"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/a126e737fe4dc77fdba7fbe6fa553016/view/movie/M/402320862.mp4","trailerTitle":"阿修罗\n    花絮3：服装造型师奈拉特辑 (中文字幕)","trailerDate":"2018-06-25"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/b6e333b580c343527fae0ff7753ae606/view/movie/M/402320509.mp4","trailerTitle":"阿修罗\n    花絮4：幕后特辑 (中文字幕)","trailerDate":"2018-06-15"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/81295b50f517f35218cc8b8afdb73194/view/movie/M/402300455.mp4","trailerTitle":"阿修罗\n    花絮5：正义联盟特辑 (中文字幕)","trailerDate":"2018-05-03"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/75575342bd9454a964d4fd8fe3b4c4a4/view/movie/M/302280116.mp4","trailerTitle":"阿修罗\n    花絮6：华蕊特辑 (中文字幕)","trailerDate":"2018-03-05"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/0afa44cc8fcaa7b74cda4240ee12c2fc/view/movie/M/402330041.mp4","trailerTitle":"阿修罗\n    MV：邓紫棋献唱主题曲《爱如意》 (中文字幕)","trailerDate":"2018-06-28"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/93cb495dbcd6912f71281dcc29bf646e/view/movie/M/402320462.mp4","trailerTitle":"阿修罗\n    其它花絮1 (中文字幕)","trailerDate":"2018-06-14"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/f7bde4618520b625e17ce95e28633d3a/view/movie/M/302250457.mp4","trailerTitle":"阿修罗\n    其它花絮2：吴磊生日祝福特辑 (中文字幕)","trailerDate":"2017-12-26"}],"id":"26746958"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031908/acf2befbf3a17f8c9cec3e1c5cd8b57b/view/movie/M/402310098.mp4","trailerTitle":"新乌龙院之笑闹江湖\n    预告片：唤醒版 (中文字幕)","trailerDate":"2018-05-17"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/132e560e966826dd9d019a5440a1ee0b/view/movie/M/402320099.mp4","trailerTitle":"新乌龙院之笑闹江湖\n    先行版 (中文字幕)","trailerDate":"2018-06-07"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/9870694f890ec3aa3b99bc18a1ee4748/view/movie/M/402320682.mp4","trailerTitle":"新乌龙院之笑闹江湖\n    花絮1：坏人特辑 (中文字幕)","trailerDate":"2018-06-21"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/3eaf03d90ad920ee3fac310cab82f216/view/movie/M/402320362.mp4","trailerTitle":"新乌龙院之笑闹江湖\n    花絮2 (中文字幕)","trailerDate":"2018-06-13"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/6644c053ff9a850da1d5cddbb62c7e1c/view/movie/M/402320170.mp4","trailerTitle":"新乌龙院之笑闹江湖\n    花絮3：乌龙天团特辑 (中文字幕)","trailerDate":"2018-06-08"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/54c14028d352dbf4d28b712fdaa8d1db/view/movie/M/402310599.mp4","trailerTitle":"新乌龙院之笑闹江湖\n    花絮4：新笑林小子特辑 (中文字幕)","trailerDate":"2018-05-29"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/3ecd039cad38603395c8079a7098436a/view/movie/M/402310486.mp4","trailerTitle":"新乌龙院之笑闹江湖\n    花絮5：郝劭文回归特辑 (中文字幕)","trailerDate":"2018-05-24"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/1a10be3e862c3eba40595f766c3b9191/view/movie/M/402310341.mp4","trailerTitle":"新乌龙院之笑闹江湖\n    花絮6：催笑重聚特辑 (中文字幕)","trailerDate":"2018-05-22"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/9b303911dfc706e99e6ec3b239fb67dc/view/movie/M/402320818.mp4","trailerTitle":"新乌龙院之笑闹江湖\n    MV：宣传曲《摆乌龙》 (中文字幕)","trailerDate":"2018-06-25"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/675a27d9d2de69119dccfe5f54f40516/view/movie/M/402330102.mp4","trailerTitle":"新乌龙院之笑闹江湖\n    其它花絮 (中文字幕)","trailerDate":"2018-06-29"}],"id":"26309969"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031908/cecbbb9e980bf0ba51dc990557467637/view/movie/M/402300179.mp4","trailerTitle":"铁笼\n    预告片 (中文字幕)","trailerDate":"2018-04-24"}],"id":"30203509"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031908/1027156a5c8aa84aec706f5f8ac0cc8c/view/movie/M/402330187.mp4","trailerTitle":"海龙屯\n    预告片","trailerDate":"2018-07-02"}],"id":"27114204"},{"trailerArray":[],"id":"27194322"},{"trailerArray":[],"id":"30227725"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031908/e345b4d26fce8e9e14eaeda19742a5a9/view/movie/M/402330051.mp4","trailerTitle":"八只鸡\n    预告片：残酷童年版 (中文字幕)","trailerDate":"2018-06-28"}],"id":"30252555"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031908/56c76ba1c382e8fb652f09489812315a/view/movie/M/402330219.mp4","trailerTitle":"摩天营救\n    台湾预告片1 (中文字幕)","trailerDate":"2018-07-03"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/1dd4a254e43d22993054048453506267/view/movie/M/402330019.mp4","trailerTitle":"摩天营救\n    台湾预告片2 (中文字幕)","trailerDate":"2018-06-28"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/1fa896c594ce4c3fe6816bacb6059503/view/movie/M/402320978.mp4","trailerTitle":"摩天营救\n    中国预告片3：定档版 (中文字幕)","trailerDate":"2018-06-27"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/9d9515ea69d4ca22ade7c232dc5f8972/view/movie/M/402320339.mp4","trailerTitle":"摩天营救\n    台湾预告片4 (中文字幕)","trailerDate":"2018-06-13"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/dfd730ca8047af026eeff45de70a4335/view/movie/M/402310885.mp4","trailerTitle":"摩天营救\n    台湾预告片5 (中文字幕)","trailerDate":"2018-06-04"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/10f98f071b1751929d6caf44284ef2a8/view/movie/M/402310474.mp4","trailerTitle":"摩天营救\n    香港预告片6 (中文字幕)","trailerDate":"2018-05-24"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/01b872bfa81ff724f8c8ff084f31f4a5/view/movie/M/402310427.mp4","trailerTitle":"摩天营救\n    台湾预告片7 (中文字幕)","trailerDate":"2018-05-24"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/a17043fcc142313ac1464ed1c1e975d1/view/movie/M/402310426.mp4","trailerTitle":"摩天营救\n    香港预告片8 (中文字幕)","trailerDate":"2018-05-24"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/46b08eb1e8165b6fea02fae49e2933bd/view/movie/M/302270160.mp4","trailerTitle":"摩天营救\n    中国预告片9 (中文字幕)","trailerDate":"2018-02-05"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/e31a606402653de5c3f16ada76116212/view/movie/M/402330113.mp4","trailerTitle":"摩天营救\n    电视版1 (中文字幕)","trailerDate":"2018-06-29"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/99c2c9287d673ed0070ce13ebe0768c8/view/movie/M/402320696.mp4","trailerTitle":"摩天营救\n    电视版2 (中文字幕)","trailerDate":"2018-06-21"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/4961353b532a3a88d3fa9f1512abeccf/view/movie/M/402320471.mp4","trailerTitle":"摩天营救\n    电视版3 (中文字幕)","trailerDate":"2018-06-15"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/dcb5f7b93445a2538ed1ac126446256a/view/movie/M/302270127.mp4","trailerTitle":"摩天营救\n    电视版4：超级碗版","trailerDate":"2018-02-05"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/37e17faa8a258aca2396de490aa37588/view/movie/M/402330149.mp4","trailerTitle":"摩天营救\n    其它预告片1","trailerDate":"2018-06-30"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/2ddd654e0a50d9239435a6e8bad0ccff/view/movie/M/402320871.mp4","trailerTitle":"摩天营救\n    其它预告片2 (中文字幕)","trailerDate":"2018-06-25"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/5536b8f5d6a34246b091941e212206ec/view/movie/M/402330196.mp4","trailerTitle":"摩天营救\n    花絮1 (中文字幕)","trailerDate":"2018-07-02"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/51d9c030edc5f55168a28a71ac3bff3b/view/movie/M/402330163.mp4","trailerTitle":"摩天营救\n    花絮2 (中文字幕)","trailerDate":"2018-07-01"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/d6b07b41a1a0133452a438fb16ede192/view/movie/M/402330101.mp4","trailerTitle":"摩天营救\n    花絮3 (中文字幕)","trailerDate":"2018-06-29"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/911bdab4a869fe1f8cc4f92246845a84/view/movie/M/402310760.mp4","trailerTitle":"摩天营救\n    花絮4：儿童节特辑 (中文字幕)","trailerDate":"2018-06-01"}],"id":"26804147"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031908/f88219ecdc6905f14b365591c1ec2953/view/movie/M/402330215.mp4","trailerTitle":"风语咒\n    预告片1：终极版 (中文字幕)","trailerDate":"2018-07-03"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/bcf4561183300bb0ac95796d5d4a49c1/view/movie/M/402330050.mp4","trailerTitle":"风语咒\n    预告片2：崛起版 (中文字幕)","trailerDate":"2018-06-28"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/c89b5e2ab01fb143827df5ec79b8924c/view/movie/M/402330049.mp4","trailerTitle":"风语咒\n    预告片3：定档版 (中文字幕)","trailerDate":"2018-06-28"}],"id":"30146756"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031908/064ed9d88574d239a7585946de398112/view/movie/M/302260937.mp4","trailerTitle":"北方一片苍茫\n    预告片1：国际版","trailerDate":"2018-01-31"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/9f79d6e02b3b87ca5b1fbc6ed71578af/view/movie/M/402300359.mp4","trailerTitle":"北方一片苍茫\n    预告片2：鹿特丹版","trailerDate":"2018-04-28"}],"id":"27079318"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031908/e252950d5e34459f7664425054e84329/view/movie/M/302230574.mp4","trailerTitle":"淘气大侦探\n    台湾预告片 (中文字幕)","trailerDate":"2017-11-08"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/c5b5ba92a5a9607a02d89a59fdefe564/view/movie/M/402320837.mp4","trailerTitle":"淘气大侦探\n    中国先行版 (中文字幕)","trailerDate":"2018-06-25"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/f478042e6a8d0a50003a74395565d91d/view/movie/M/302270921.mp4","trailerTitle":"淘气大侦探\n    电视版1","trailerDate":"2018-02-28"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/a0d6285ef87f9be3dacebf60a330044a/view/movie/M/302270922.mp4","trailerTitle":"淘气大侦探\n    电视版2","trailerDate":"2018-02-28"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/c701a055365475bb4c48eafeca80024b/view/movie/M/302280762.mp4","trailerTitle":"淘气大侦探\n    片段","trailerDate":"2018-03-17"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/59cde6831cfe2e7df4363332e344de68/view/movie/M/302280312.mp4","trailerTitle":"淘气大侦探\n    花絮：动画制作 (中文字幕)","trailerDate":"2018-03-08"}],"id":"26660063"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031908/edc499682fd4e4ac6f81b02b7fd47e23/view/movie/M/301720324.mp4","trailerTitle":"玛雅蜜蜂历险记\n    预告片1","trailerDate":"2015-03-05"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/bde66f99ff15f9c9b4cc706ec1a3adaf/view/movie/M/301620001.mp4","trailerTitle":"玛雅蜜蜂历险记\n    德国预告片2","trailerDate":"2014-08-29"}],"id":"25881500"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031908/7b19f908081db91fd18a88822cb87778/view/movie/M/402320918.mp4","trailerTitle":"兄弟班\n    预告片1：前朋友版 (中文字幕)","trailerDate":"2018-06-26"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/0d2c24d22fd2e5240e97535c880d7289/view/movie/M/402320602.mp4","trailerTitle":"兄弟班\n    预告片2 (中文字幕)","trailerDate":"2018-06-19"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/b4469c3f038199e21a34e9a59dab27df/view/movie/M/402320317.mp4","trailerTitle":"兄弟班\n    内地预告片3 (中文字幕)","trailerDate":"2018-06-12"}],"id":"26988003"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031908/5b662b176d4b581ba5a626a8ad9e30b3/view/movie/M/302280258.mp4","trailerTitle":"午夜幽灵\n    先行版 (中文字幕)","trailerDate":"2018-03-07"}],"id":"30128986"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031908/b5ddd508f0359114cb3502214f103d38/view/movie/M/402330040.mp4","trailerTitle":"汪星卧底\n    中国预告片1：定档版 (中文字幕)","trailerDate":"2018-06-28"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/e2f6e66e77a5b5d380c21eaa126340fa/view/movie/M/302280324.mp4","trailerTitle":"汪星卧底\n    预告片2","trailerDate":"2018-03-09"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/acdeb094693d1e069f3306179ae555c7/view/movie/M/302260112.mp4","trailerTitle":"汪星卧底\n    预告片3","trailerDate":"2018-01-13"}],"id":"26930056"},{"trailerArray":[],"id":"30176525"},{"trailerArray":[],"id":"30262110"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031908/f3f658e5f40ae026eaaad11f38ba6834/view/movie/M/402320838.mp4","trailerTitle":"狄仁杰之四大天王\n    预告片1：天王现身版 (中文字幕)","trailerDate":"2018-06-25"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/82d65aefd4035bef98e7b09c65187644/view/movie/M/302210792.mp4","trailerTitle":"狄仁杰之四大天王\n    预告片2：真相不白版 (中文字幕)","trailerDate":"2017-09-22"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/2b440e65b336def00fce4ee56bd402f4/view/movie/M/402300245.mp4","trailerTitle":"狄仁杰之四大天王\n    先行版 (中文字幕)","trailerDate":"2018-04-25"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/6e394877bdc9aba15f7c734302c601c8/view/movie/M/402320616.mp4","trailerTitle":"狄仁杰之四大天王\n    其它预告片：大唐神器亢龙锏 (中文字幕)","trailerDate":"2018-06-20"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/34247f59434c23e5433f6ef90b0bf282/view/movie/M/402330067.mp4","trailerTitle":"狄仁杰之四大天王\n    花絮1 (中文字幕)","trailerDate":"2018-06-28"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/55647f86a235b5c11ab9fd707b900097/view/movie/M/402320984.mp4","trailerTitle":"狄仁杰之四大天王\n    花絮2：武则天特辑 (中文字幕)","trailerDate":"2018-06-27"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/4a1a3275f96041c8de8697931bad839a/view/movie/M/402310450.mp4","trailerTitle":"狄仁杰之四大天王\n    花絮3：神探回归特辑 (中文字幕)","trailerDate":"2018-05-24"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/5dd26fde4c93076201930305df2dd0bd/view/movie/M/402320624.mp4","trailerTitle":"狄仁杰之四大天王\n    其它花絮： IMAX推荐特辑 (中文字幕)","trailerDate":"2018-06-20"}],"id":"25882296"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031908/94e087eb689c46cdca6f0c034b94cc9d/view/movie/M/402320859.mp4","trailerTitle":"西虹市首富\n    预告片1：主创推荐版 (中文字幕)","trailerDate":"2018-06-25"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/2e95abc60be5d159591a919c5b8a6df5/view/movie/M/402320030.mp4","trailerTitle":"西虹市首富\n    预告片2：特笑版 (中文字幕)","trailerDate":"2018-06-06"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/e7a8389d8d746964997637f1f5dff13f/view/movie/M/402310173.mp4","trailerTitle":"西虹市首富\n    预告片3：特笑大片","trailerDate":"2018-05-18"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/f50e68d5d2e38ae8a9f204c6eb526e09/view/movie/M/402320506.mp4","trailerTitle":"西虹市首富\n    花絮：魔音特辑 (中文字幕)","trailerDate":"2018-06-15"}],"id":"27605698"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031908/54a1c21f848db545251d50e390172f60/view/movie/M/402310757.mp4","trailerTitle":"昨日青空\n    预告片1 (中文字幕)","trailerDate":"2018-06-01"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/167f9491f6d830b7dc0f0828618eae6b/view/movie/M/302200018.mp4","trailerTitle":"昨日青空\n    预告片2 (中文字幕)","trailerDate":"2017-08-03"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/56ee360d7bb835aa210c57e71394884e/view/movie/M/402330179.mp4","trailerTitle":"昨日青空\n    MV1：青春告白曲《来不及勇敢》 (中文字幕)","trailerDate":"2018-07-02"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/078938b894f71da870ca31e0c2f3ffbc/view/movie/M/402330106.mp4","trailerTitle":"昨日青空\n    MV2：毕业曲《再见昨天》 (中文字幕)","trailerDate":"2018-06-29"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/ff813e72b4b5016be2d0ef3790df64d9/view/movie/M/402310929.mp4","trailerTitle":"昨日青空\n    MV3：青春毕业曲《再见昨天》 (中文字幕)","trailerDate":"2018-06-05"}],"id":"26290410"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031908/2be43f4091b80a1da19bda5f70b14e4b/view/movie/M/402310755.mp4","trailerTitle":"神奇马戏团之动物饼干\n    中国预告片1：魔力版 (中文字幕)","trailerDate":"2018-06-01"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/d6e1f1d09faee49b888ccf6e79fb7a4e/view/movie/M/402300450.mp4","trailerTitle":"神奇马戏团之动物饼干\n    预告片2：定档版 (中文字幕)","trailerDate":"2018-05-03"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/187958e9588f7e2d1cf93da5b9dea63f/view/movie/M/402320680.mp4","trailerTitle":"神奇马戏团之动物饼干\n    MV：宣传曲《嗷嗷嗷》 (中文字幕)","trailerDate":"2018-06-21"}],"id":"26253783"},{"trailerArray":[],"id":"30263334"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031908/68c62d1dea8a5bc635e5ad3bee7fa281/view/movie/M/402310669.mp4","trailerTitle":"解码游戏\n    预告片：大神现世版 (中文字幕)","trailerDate":"2018-05-30"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/73d85328825af3f3b8bec873f3b2fe85/view/movie/M/402320981.mp4","trailerTitle":"解码游戏\n    花絮：男友力大pk特辑 (中文字幕)","trailerDate":"2018-06-27"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/977263345a5d0fdbc46164f60ed81b09/view/movie/M/402320683.mp4","trailerTitle":"解码游戏\n    MV：同名主题曲 (中文字幕)","trailerDate":"2018-06-21"}],"id":"26767512"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031908/3e185858a12555b1b742d834375590a3/view/movie/M/402320186.mp4","trailerTitle":"神秘世界历险记4\n    预告片1：风波将起版 (中文字幕)","trailerDate":"2018-06-08"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/19297a48ef6c0e59674aa0d69660401e/view/movie/M/402320185.mp4","trailerTitle":"神秘世界历险记4\n    预告片2：角色版 (中文字幕)","trailerDate":"2018-06-08"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/00999c6984e3848a61e2c9b16053c786/view/movie/M/402320183.mp4","trailerTitle":"神秘世界历险记4\n    预告片3：六一快乐版 (中文字幕)","trailerDate":"2018-06-08"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/c2a9c580e9e36619ab2bdd8e8bbd3717/view/movie/M/402320184.mp4","trailerTitle":"神秘世界历险记4\n    花絮：幕后特辑 (中文字幕)","trailerDate":"2018-06-08"}],"id":"30208005"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031908/7e70bf880c362311103f7c39e5bbfe91/view/movie/M/402320715.mp4","trailerTitle":"肆式青春\n    预告片1","trailerDate":"2018-06-22"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/447fa8653b3a80a0ddecc7d64135df58/view/movie/M/402310622.mp4","trailerTitle":"肆式青春\n    中国预告片2 (中文字幕)","trailerDate":"2018-05-29"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/7898e8ad049b34818a683c34a56d7911/view/movie/M/402310517.mp4","trailerTitle":"肆式青春\n    预告片3","trailerDate":"2018-05-25"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/617d789fd714229c69f15fe22b02c07b/view/movie/M/402280991.mp4","trailerTitle":"肆式青春\n    预告片4 (中文字幕)","trailerDate":"2018-03-22"}],"id":"30156898"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031908/c2e6d4b0d42430cdcdf87cc11f95f304/view/movie/M/402300863.mp4","trailerTitle":"一出好戏\n    预告片：欢迎光临版 (中文字幕)","trailerDate":"2018-05-11"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/d2f029f42251a0eb95db15acc6798f01/view/movie/M/402300067.mp4","trailerTitle":"一出好戏\n    其它预告片1：档期解锁 (中文字幕)","trailerDate":"2018-04-20"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/acd498cb72bd939dbc3d407bcea70c56/view/movie/M/302270730.mp4","trailerTitle":"一出好戏\n    其它预告片2：孙红雷狗年送祝福 (中文字幕)","trailerDate":"2018-02-22"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/a00fb2d6e904c42009e13d84336cd03e/view/movie/M/402310717.mp4","trailerTitle":"一出好戏\n    花絮：幕后特辑 (中文字幕)","trailerDate":"2018-05-31"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/d922ffb4e9391452eb5eb8bc69f6329b/view/movie/M/302260838.mp4","trailerTitle":"一出好戏\n    其它花絮：黄渤特辑 (中文字幕)","trailerDate":"2018-01-30"}],"id":"26985127"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031908/4849c7cc69ee85dcaed805cd11f16f2f/view/movie/M/402320102.mp4","trailerTitle":"爱情公寓\n    MV：主题曲《我的未来式》 (中文字幕)","trailerDate":"2018-06-07"}],"id":"24852545"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031908/4968b21d04a04047195b331e133f8433/view/movie/M/402320560.mp4","trailerTitle":"巨齿鲨\n    中国预告片1：深海争锋版 (中文字幕)","trailerDate":"2018-06-18"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/fba05c9b14889861067b45fd1fc2a61e/view/movie/M/402310860.mp4","trailerTitle":"巨齿鲨\n    预告片2：绝命巨鲨版","trailerDate":"2018-06-04"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/1d4828c757304e254cf6d27d95844ab9/view/movie/M/402310859.mp4","trailerTitle":"巨齿鲨\n    预告片3：巨浪淘鲨版","trailerDate":"2018-06-04"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/e2d54cc0c803fb51b740707a99ff8910/view/movie/M/402290674.mp4","trailerTitle":"巨齿鲨\n    中国预告片4：深海降临版 (中文字幕)","trailerDate":"2018-04-11"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/92341ca0bd6597d3ac88b6bd6a7cc073/view/movie/M/402290631.mp4","trailerTitle":"巨齿鲨\n    台湾预告片5 (中文字幕)","trailerDate":"2018-04-10"}],"id":"26426194"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031908/5cd740dd48138997233c78494c41e723/view/movie/M/402320632.mp4","trailerTitle":"美食大冒险之英雄烩\n    预告片1：国际版 (中文字幕)","trailerDate":"2018-06-20"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/b562961366a124e9a27f9ba3d3dac189/view/movie/M/402310753.mp4","trailerTitle":"美食大冒险之英雄烩\n    预告片2：定档版 (中文字幕)","trailerDate":"2018-06-01"},{"trailerMP4":"http://vt1.doubanio.com/201807031908/33f7ce8b7de32f106979d6288dc646d6/view/movie/M/402290860.mp4","trailerTitle":"美食大冒险之英雄烩\n    预告片3 (中文字幕)","trailerDate":"2018-04-16"}],"id":"26290398"},{"trailerArray":[],"id":"30125089"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/2284cc96964d13f0d32a17a99fccb3bf/view/movie/M/402320626.mp4","trailerTitle":"大轰炸\n    预告片1：对抗版 (中文字幕)","trailerDate":"2018-06-20"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/eb8ee7f964d004a6eb89dec7bfe6af0d/view/movie/M/402310094.mp4","trailerTitle":"大轰炸\n    预告片2：不屈版 (中文字幕)","trailerDate":"2018-05-17"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/656753cae722ffaa16c7daee3dd50aeb/view/movie/M/402320633.mp4","trailerTitle":"大轰炸\n    花絮：品质特辑 (中文字幕)","trailerDate":"2018-06-20"}],"id":"26331700"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/d275f9ebcabaedfbfd9d95da753220f3/view/movie/M/402290343.mp4","trailerTitle":"如影随心\n    预告片 (中文字幕)","trailerDate":"2018-04-02"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/b731ddb1a3261a673c69bc2a52c17935/view/movie/M/402330185.mp4","trailerTitle":"如影随心\n    MV：主题曲《两个人一个人》 (中文字幕)","trailerDate":"2018-07-02"}],"id":"26871669"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/46100051098e0217128da43214496e2d/view/movie/M/302280408.mp4","trailerTitle":"快把我哥带走\n    预告片1：“贱”笑版 (中文字幕)","trailerDate":"2018-03-12"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/db641f44900d54ad3ca08444aa26f3e6/view/movie/M/402320449.mp4","trailerTitle":"快把我哥带走\n    预告片2 (中文字幕)","trailerDate":"2018-06-14"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/01a40fae136deb72693669f23158ff26/view/movie/M/402330175.mp4","trailerTitle":"快把我哥带走\n    其它预告片1 (中文字幕)","trailerDate":"2018-07-02"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/ed7217e2113b2f45f5b8541f78a347ea/view/movie/M/402330174.mp4","trailerTitle":"快把我哥带走\n    其它预告片2 (中文字幕)","trailerDate":"2018-07-02"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/02a463f7845f3d1c10de46f1dce833af/view/movie/M/402330097.mp4","trailerTitle":"快把我哥带走\n    其它预告片3 (中文字幕)","trailerDate":"2018-06-29"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/5e4b3b8fb4212ea2049069610700887e/view/movie/M/402330037.mp4","trailerTitle":"快把我哥带走\n    其它预告片4 (中文字幕)","trailerDate":"2018-06-28"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/10d900ab1e1e71a5f81ac879ab1f7ce4/view/movie/M/402320552.mp4","trailerTitle":"快把我哥带走\n    其它预告片5：耍贱合集 (中文字幕)","trailerDate":"2018-06-16"}],"id":"30122633"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/4f6526d12f1c495093f8be0545cca13e/view/movie/M/402320839.mp4","trailerTitle":"未来机器城\n    预告片：定档版 (中文字幕)","trailerDate":"2018-06-25"}],"id":"27200988"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/19bf59cbb076adae89fbc57593fc8a10/view/movie/M/402320746.mp4","trailerTitle":"大师兄\n    香港预告片 (中文字幕)","trailerDate":"2018-06-22"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/7341b737c68b1ec17b40a3eb738d8328/view/movie/M/402320814.mp4","trailerTitle":"大师兄\n    内地先行版 (中文字幕)","trailerDate":"2018-06-25"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/5536ee367c7f3df38c1e1bea67a78105/view/movie/M/402330181.mp4","trailerTitle":"大师兄\n    其它预告片：朝阳群众有话说 (中文字幕)","trailerDate":"2018-07-02"}],"id":"27201353"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/d830eb6be2506b88c37d91144cd0e088/view/movie/M/402320753.mp4","trailerTitle":"最后的棒棒\n    先行版","trailerDate":"2018-06-22"}],"id":"30254589"},{"trailerArray":[],"id":"30246086"},{"trailerArray":[],"id":"24743257"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/0554fc63be13b26bc3f8d342ad3ddd20/view/movie/M/402310593.mp4","trailerTitle":"大三儿\n    先行版 (中文字幕)","trailerDate":"2018-05-29"}],"id":"27119292"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/d14bd33dc3e03ca95fa8c7a1be010f55/view/movie/M/402310603.mp4","trailerTitle":"反贪风暴3\n    内地先行版 (中文字幕)","trailerDate":"2018-05-29"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/bcfb70256c5097a0beb8fce80bb3ae98/view/movie/M/402330043.mp4","trailerTitle":"反贪风暴3\n    花絮 (中文字幕)","trailerDate":"2018-06-28"}],"id":"26996640"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/097fa254f11f530678c01e35e46330ad/view/movie/M/402310602.mp4","trailerTitle":"七袋米\n    中国预告片1 (中文字幕)","trailerDate":"2018-05-29"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/9b1dc1a3cc3e9760e8754a58c0a3f2ea/view/movie/M/402310600.mp4","trailerTitle":"七袋米\n    中国预告片2：催泪版 (中文字幕)","trailerDate":"2018-05-29"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/9f41199e8625876c93cf251cfb95c131/view/movie/M/402310601.mp4","trailerTitle":"七袋米\n    MV：主题曲《四月》 (中文字幕)","trailerDate":"2018-05-29"}],"id":"26881698"},{"trailerArray":[],"id":"30199575"},{"trailerArray":[],"id":"26954268"},{"trailerArray":[],"id":"30237381"},{"trailerArray":[],"id":"30236775"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/3d7683c0cf205cab10a52a994abb2ac9/view/movie/M/302240983.mp4","trailerTitle":"我，花样女王\n    台湾预告片1 (中文字幕)","trailerDate":"2017-12-12"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/5023af2148f9b3eada02b05c4ef50033/view/movie/M/302230359.mp4","trailerTitle":"我，花样女王\n    预告片2：限制级","trailerDate":"2017-11-02"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/27d048cb83ba601f14c24c718e7155a8/view/movie/M/302240643.mp4","trailerTitle":"我，花样女王\n    香港先行版 (中文字幕)","trailerDate":"2017-12-05"}],"id":"26756049"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/30946e7d0b597b4d01933a9bb97f96cc/view/movie/M/402310244.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    台湾预告片1 (中文字幕)","trailerDate":"2018-05-21"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/9351204b0d9c9e9c4aad94adafaeca26/view/movie/M/402310243.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    台湾预告片2 (中文字幕)","trailerDate":"2018-05-21"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/1a24652f5879b592c3c99b7ad7307e7f/view/movie/M/402300391.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    预告片3","trailerDate":"2018-05-02"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/8233f3c19cf545b50190cc234303bfff/view/movie/M/402300390.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    中国预告片4 (中文字幕)","trailerDate":"2018-05-01"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/b70f978824540d534d0c64f296f4a02e/view/movie/M/402300388.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    台湾预告片5 (中文字幕)","trailerDate":"2018-05-01"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/57eb7fb7e46b392afb35b962fa552269/view/movie/M/402300384.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    先行版1","trailerDate":"2018-05-01"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/39f60e6ba24edf2d7b223a37d52da8ff/view/movie/M/302260958.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    中国先行版2 (中文字幕)","trailerDate":"2018-02-01"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/0c64a09676bd10c656cd15aab25f190c/view/movie/M/302260876.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    台湾先行版3 (中文字幕)","trailerDate":"2018-01-30"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/712afa4ee634803f207b52865b86176f/view/movie/M/302190971.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    先行版4：Now in Production","trailerDate":"2017-08-02"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/1e891d8dd734ee894c95a97030a57db4/view/movie/M/402320762.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    电视版1 (中文字幕)","trailerDate":"2018-06-22"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/fa1894a99b45274d95adc70b275a561d/view/movie/M/402320096.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    电视版2 (中文字幕)","trailerDate":"2018-06-07"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/cff25af9e62b224dc66f77110856c48f/view/movie/M/402310888.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    电视版3 (中文字幕)","trailerDate":"2018-06-04"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/9d7036c580dc2879f3cd082037d880cf/view/movie/M/402310774.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    电视版4 (中文字幕)","trailerDate":"2018-06-01"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/8d46e51ff80a03aa444e01ed27e804c3/view/movie/M/402320608.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    其它预告片1 (中文字幕)","trailerDate":"2018-06-19"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/e88d24187045acb87a1c0e596cafc65a/view/movie/M/402310380.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    其它预告片2 (中文字幕)","trailerDate":"2018-05-23"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/41183b3f8e4d9880b5ab09cafb97ac36/view/movie/M/402330195.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    花絮1 (中文字幕)","trailerDate":"2018-07-02"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/b4703d567086534e72f7beac6666adce/view/movie/M/402330197.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    花絮2 (中文字幕)","trailerDate":"2018-07-02"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/4d06ba90eadf7919fd26e00f784b064c/view/movie/M/402320566.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    其它花絮1 (中文字幕)","trailerDate":"2018-06-18"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/1d28b428ae6927c4c2e2e954e598ff5d/view/movie/M/402320567.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    其它花絮2 (中文字幕)","trailerDate":"2018-06-18"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/d79084eec956dbacf9b1eeca71607bfa/view/movie/M/402320460.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    其它花絮3 (中文字幕)","trailerDate":"2018-06-14"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/6a2d120530fc7deb12cc9df7cb3f5b11/view/movie/M/402320048.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    其它花絮4 (中文字幕)","trailerDate":"2018-06-06"}],"id":"26636712"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/3d3f23ec8431ed8962e38f6a80670609/view/movie/M/402310259.mp4","trailerTitle":"碟中谍6：全面瓦解\n    香港预告片1 (中文字幕)","trailerDate":"2018-05-21"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/07b4c2ba08a4e53de43116103abca44d/view/movie/M/402310252.mp4","trailerTitle":"碟中谍6：全面瓦解\n    中国预告片2 (中文字幕)","trailerDate":"2018-05-21"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/b0b265cd15197cb9ded6e36a85b2c54f/view/movie/M/402310247.mp4","trailerTitle":"碟中谍6：全面瓦解\n    台湾预告片3 (中文字幕)","trailerDate":"2018-05-21"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/2ab4eb66cd80b1041ab190d3336bf730/view/movie/M/402310045.mp4","trailerTitle":"碟中谍6：全面瓦解\n    预告片4","trailerDate":"2018-05-16"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/dc9109114882bc2a9922e16a921c3ad9/view/movie/M/302270152.mp4","trailerTitle":"碟中谍6：全面瓦解\n    中国预告片5 (中文字幕)","trailerDate":"2018-02-05"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/1f742b975a0c7ab62b4784c3dbe655b5/view/movie/M/402320695.mp4","trailerTitle":"碟中谍6：全面瓦解\n    电视版1 (中文字幕)","trailerDate":"2018-06-21"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/0e17861fb30dd1cc36a552d1745dbcbc/view/movie/M/402320287.mp4","trailerTitle":"碟中谍6：全面瓦解\n    电视版2 (中文字幕)","trailerDate":"2018-06-12"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/193f993ca119d79e4658ce1a78c9b763/view/movie/M/402320349.mp4","trailerTitle":"碟中谍6：全面瓦解\n    电视版3 (中文字幕)","trailerDate":"2018-06-12"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/697581e75410f52a9ce8e6df33e1cf24/view/movie/M/302270139.mp4","trailerTitle":"碟中谍6：全面瓦解\n    电视版4：超级碗版 (中文字幕)","trailerDate":"2018-02-05"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/df0855587d09ffeade401b15ae0edd66/view/movie/M/402330171.mp4","trailerTitle":"碟中谍6：全面瓦解\n    花絮1 (中文字幕)","trailerDate":"2018-07-02"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/1fe6174d55fc01963ed3f91d60f9db78/view/movie/M/402330063.mp4","trailerTitle":"碟中谍6：全面瓦解\n    花絮2 (中文字幕)","trailerDate":"2018-06-28"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/34258080c4a8d6a5acec65612b703750/view/movie/M/402310865.mp4","trailerTitle":"碟中谍6：全面瓦解\n    花絮3 (中文字幕)","trailerDate":"2018-06-04"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/af4f5da945396207fc13b2d851b1f1e1/view/movie/M/302270314.mp4","trailerTitle":"碟中谍6：全面瓦解\n    花絮4：真刀实枪特辑 (中文字幕)","trailerDate":"2018-02-08"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/c50ed3f0178c8219aeaba63a3719bb07/view/movie/M/302260928.mp4","trailerTitle":"碟中谍6：全面瓦解\n    其它花絮：诺顿秀特辑 (中文字幕)","trailerDate":"2018-01-31"}],"id":"26336252"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/c5e675555c66f32926fe4b4f0bdead15/view/movie/M/402300144.mp4","trailerTitle":"镰仓物语\n    香港预告片1 (中文字幕)","trailerDate":"2018-04-23"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/b8adc46e1a6aeebd45cd377df09b826e/view/movie/M/302180731.mp4","trailerTitle":"镰仓物语\n    日本预告片2","trailerDate":"2017-07-04"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/6fceb1fc453ae59c457b1505c35fd0f4/view/movie/M/302240151.mp4","trailerTitle":"镰仓物语\n    电视版1","trailerDate":"2017-11-22"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/0a11f77ac865483b397d51c6136c0c05/view/movie/M/302240147.mp4","trailerTitle":"镰仓物语\n    电视版2","trailerDate":"2017-11-22"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/9fe6c14beda6053e436215f7c89c63ae/view/movie/M/302240149.mp4","trailerTitle":"镰仓物语\n    电视版3","trailerDate":"2017-11-22"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/adf7320ebab0b392675d54f4bb4648e0/view/movie/M/402300819.mp4","trailerTitle":"镰仓物语\n    花絮1","trailerDate":"2018-05-10"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/54ca1e4d27b2b668c827a116d84f27f3/view/movie/M/402300697.mp4","trailerTitle":"镰仓物语\n    花絮2","trailerDate":"2018-05-09"}],"id":"26916229"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/323884db7f1f03400419f4dfc8f3b69c/view/movie/M/402310782.mp4","trailerTitle":"影\n    预告片：当局不迷版 (中文字幕)","trailerDate":"2018-06-01"}],"id":"4864908"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/60fde90de7540ddfd2745e02b511c806/view/movie/M/402310509.mp4","trailerTitle":"边境杀手2：边境战士\n    预告片1","trailerDate":"2018-05-25"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/8fe8b2e7dadc9d3d2cac78ae43fd059e/view/movie/M/302280839.mp4","trailerTitle":"边境杀手2：边境战士\n    预告片2","trailerDate":"2018-03-20"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/970cdea62e3bba902f3f0b4a9165225d/view/movie/M/302270424.mp4","trailerTitle":"边境杀手2：边境战士\n    台湾预告片3 (中文字幕)","trailerDate":"2018-02-11"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/f1ca34748711f3375987686771a4c858/view/movie/M/302250252.mp4","trailerTitle":"边境杀手2：边境战士\n    先行版","trailerDate":"2017-12-20"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/8c8f238d35ad8e667d26c813042ad00e/view/movie/M/402330085.mp4","trailerTitle":"边境杀手2：边境战士\n    片段1","trailerDate":"2018-06-29"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/e924e43a534fc752f6c20ed195077129/view/movie/M/402320439.mp4","trailerTitle":"边境杀手2：边境战士\n    片段2","trailerDate":"2018-06-14"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/6ab278c7732ff461aec19d0bfe5a81aa/view/movie/M/402320443.mp4","trailerTitle":"边境杀手2：边境战士\n    片段3","trailerDate":"2018-06-14"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/4265ce50496c541767b08ea4e20d11f8/view/movie/M/402310996.mp4","trailerTitle":"边境杀手2：边境战士\n    片段4","trailerDate":"2018-06-06"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/847b5dca78740be6a957aa2556062c1f/view/movie/M/402310792.mp4","trailerTitle":"边境杀手2：边境战士\n    片段5","trailerDate":"2018-06-02"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/34c42bc6c8ae7c34d42ef5c621e35a5a/view/movie/M/402320713.mp4","trailerTitle":"边境杀手2：边境战士\n    花絮1","trailerDate":"2018-06-22"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/09636e572ff20b6af5e2e8ea7aaeebef/view/movie/M/402320425.mp4","trailerTitle":"边境杀手2：边境战士\n    花絮2","trailerDate":"2018-06-14"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/0e31cdd1bc838b977911c4390a87d3d7/view/movie/M/402320410.mp4","trailerTitle":"边境杀手2：边境战士\n    花絮3","trailerDate":"2018-06-14"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/10585a28c36e35a4337450cac69cf266/view/movie/M/402320411.mp4","trailerTitle":"边境杀手2：边境战士\n    花絮4","trailerDate":"2018-06-14"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/700d2ed188397e1fafadae914c5c33f4/view/movie/M/402330012.mp4","trailerTitle":"边境杀手2：边境战士\n    其它花絮","trailerDate":"2018-06-28"}],"id":"26627736"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/693ccb9aad984ae502e36cbbd35c8865/view/movie/M/402310720.mp4","trailerTitle":"营救汪星人\n    预告片1：国际版 (中文字幕)","trailerDate":"2018-05-31"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/12dd4ba622ac1977ca2ac876c5637329/view/movie/M/402300452.mp4","trailerTitle":"营救汪星人\n    预告片2：三妹博美版 (中文字幕)","trailerDate":"2018-05-03"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/dabe5f8426944a369c693492c5cf848a/view/movie/M/302260985.mp4","trailerTitle":"营救汪星人\n    预告片3：休想上映版 (中文字幕)","trailerDate":"2018-02-01"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/35220c01400680ea7bd0688b35373930/view/movie/M/302240021.mp4","trailerTitle":"营救汪星人\n    预告片4：哈士奇版 (中文字幕)","trailerDate":"2017-11-17"}],"id":"26930565"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/7c424f229388d505a3e4db27c9a49724/view/movie/M/402310886.mp4","trailerTitle":"找到你\n    先行版 (中文字幕)","trailerDate":"2018-06-04"}],"id":"27140071"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/626f16fb993cd857311ee53f850e5e8f/view/movie/M/302070856.mp4","trailerTitle":"断片之险途夺宝\n    先行版 (中文字幕)","trailerDate":"2016-11-27"}],"id":"26882457"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/02f7b0a6e0f991ca0af80f0a6541e7ac/view/movie/M/302270157.mp4","trailerTitle":"墨多多谜境冒险\n    预告片：定档版 (中文字幕)","trailerDate":"2018-02-05"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/859480f7cefe7a3d3895940445448740/view/movie/M/402320448.mp4","trailerTitle":"墨多多谜境冒险\n    MV：主题曲《每当想起你》 (中文字幕)","trailerDate":"2018-06-14"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/4c90d8c112dc37887ac60abcba7a494f/view/movie/M/402310325.mp4","trailerTitle":"墨多多谜境冒险\n    其它花絮 (中文字幕)","trailerDate":"2018-05-22"}],"id":"26790960"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/43709f29caf0da5a950381692e48db45/view/movie/M/402280988.mp4","trailerTitle":"沉默的证人\n    先行版1 (中文字幕)","trailerDate":"2018-03-22"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/84a0800fabe45e6c1f9226799e0013d1/view/movie/M/302280608.mp4","trailerTitle":"沉默的证人\n    先行版2 (中文字幕)","trailerDate":"2018-03-14"}],"id":"26816090"},{"trailerArray":[],"id":"26425062"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/8e6de528fdb9a7191358ab5f34699806/view/movie/M/302270304.mp4","trailerTitle":"真相漩涡\n    预告片","trailerDate":"2018-02-08"}],"id":"26792540"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/a7cbee8fce91c2726b76e57d69f6cc90/view/movie/M/302060474.mp4","trailerTitle":"摔跤手苏丹\n    国际版预告片","trailerDate":"2016-10-31"}],"id":"26728641"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/335e54994dea2e51083b88b3fae2e249/view/movie/M/302270270.mp4","trailerTitle":"跨越8年的新娘\n    香港预告片1 (中文字幕)","trailerDate":"2018-02-07"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/57e6188653a42f459bdc021c4200b53d/view/movie/M/302210477.mp4","trailerTitle":"跨越8年的新娘\n    日本预告片2","trailerDate":"2017-09-14"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/3555ba5de2eb70fd13717b60978c3a60/view/movie/M/302180159.mp4","trailerTitle":"跨越8年的新娘\n    日本先行版","trailerDate":"2017-06-15"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/0797b21a08dbe4e506e97a5e6ed472b9/view/movie/M/302230752.mp4","trailerTitle":"跨越8年的新娘\n    MV","trailerDate":"2017-11-13"}],"id":"26929835"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/7ca75b05a8fae569751995172166100a/view/movie/M/302270313.mp4","trailerTitle":"大闹西游\n    先行版 (中文字幕)","trailerDate":"2018-02-08"}],"id":"30142649"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/26bf6e0f24c2cfd2cfd5a8c43d936242/view/movie/M/402310023.mp4","trailerTitle":"李宗伟：败者为王\n    预告片 (中文字幕)","trailerDate":"2018-05-16"}],"id":"27195119"},{"trailerArray":[],"id":"27192660"},{"trailerArray":[],"id":"27661975"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/709772a2e2f9ee6a643d1f3ba8f9d0f1/view/movie/M/302280917.mp4","trailerTitle":"阿里巴巴三根金发\n    先行版 (中文字幕)","trailerDate":"2018-03-21"}],"id":"30176069"},{"trailerArray":[],"id":"30259493"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/19a49047ec61fb68310de9aefae85b72/view/movie/M/402320615.mp4","trailerTitle":"恩师\n    预告片 (中文字幕)","trailerDate":"2018-06-20"}],"id":"30215191"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/d9cc6a74d9319a5dffaa5d1af11a2b49/view/movie/M/402320053.mp4","trailerTitle":"勇敢往事\n    预告片1：终极版 (中文字幕)","trailerDate":"2018-06-06"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/814b26dbf693a562b63103d03ab2ead4/view/movie/M/402300307.mp4","trailerTitle":"勇敢往事\n    预告片2 (中文字幕)","trailerDate":"2018-04-27"}],"id":"27191430"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/1d337b37b05216a24fc62b68afed3b07/view/movie/M/402310448.mp4","trailerTitle":"江湖儿女\n    预告片：定档版 (中文字幕)","trailerDate":"2018-05-24"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/9ccf151a77c91fed539b29460617ad3b/view/movie/M/402300586.mp4","trailerTitle":"江湖儿女\n    片段1","trailerDate":"2018-05-07"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/25fb7062e5b852bfeea0d62fb99e3c9e/view/movie/M/402300578.mp4","trailerTitle":"江湖儿女\n    片段2","trailerDate":"2018-05-07"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/2ce6785b8ee73ca64e16e57d268c66e7/view/movie/M/402310401.mp4","trailerTitle":"江湖儿女\n    其它花絮：戛纳特辑 (中文字幕)","trailerDate":"2018-05-23"}],"id":"26972258"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/108efff6337e17ae1446924c415b5956/view/movie/M/402320747.mp4","trailerTitle":"一生有你\n    先行版：“一生相念”毕业季先导预告","trailerDate":"2018-06-22"}],"id":"26263417"},{"trailerArray":[],"id":"30227727"},{"trailerArray":[],"id":"27092785"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/d638792f72f0958d85fd015577708e94/view/movie/M/402310147.mp4","trailerTitle":"无双\n    内地预告片：定档版 (中文字幕)","trailerDate":"2018-05-18"}],"id":"26425063"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/444d6ec144292d63368a752af7efc67c/view/movie/M/402310365.mp4","trailerTitle":"云南虫谷\n    预告片：定档版 (中文字幕)","trailerDate":"2018-05-23"}],"id":"26744597"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/9808730809dca883b4a2c5bbd1ebc337/view/movie/M/402320917.mp4","trailerTitle":"胖子行动队\n    预告片：定档版 (中文字幕)","trailerDate":"2018-06-26"},{"trailerMP4":"http://vt1.doubanio.com/201807031909/749a3141581e782dc3e9592c5db8f30c/view/movie/M/302210816.mp4","trailerTitle":"胖子行动队\n    其它花絮：包贝尔作品混剪 (中文字幕)","trailerDate":"2017-09-22"}],"id":"27149818"},{"trailerArray":[],"id":"26911450"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031909/8a13fd403144c4e56deaefd96efc0126/view/movie/M/302250121.mp4","trailerTitle":"护垫侠\n    印度预告片","trailerDate":"2017-12-15"}],"id":"27198855"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031910/3e79b193973d38071ea838df437c331f/view/movie/M/402300243.mp4","trailerTitle":"阳台上\n    预告片：“侬叫啥”版 (中文字幕)","trailerDate":"2018-04-25"},{"trailerMP4":"http://vt1.doubanio.com/201807031910/8693018758b29d98a9fea0fbf3678a6b/view/movie/M/402300535.mp4","trailerTitle":"阳台上\n    花絮：张猛导演特辑 (中文字幕)","trailerDate":"2018-05-04"}],"id":"27135473"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031910/4a375dfaa2f1a3a058b4bde6921963bb/view/movie/M/402300573.mp4","trailerTitle":"苦行僧的非凡旅程\n    台湾预告片 (中文字幕)","trailerDate":"2018-05-07"}],"id":"26715965"},{"trailerArray":[],"id":"26935283"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031910/29c2e754aba9a943e2438c5e641b16da/view/movie/M/402320914.mp4","trailerTitle":"阿凡提之奇缘历险\n    其它花絮 (中文字幕)","trailerDate":"2018-06-26"}],"id":"30208004"},{"trailerArray":[],"id":"27620911"},{"trailerArray":[],"id":"27008394"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031910/a9c331812d42ffaf32f8e9c46ab4ff0b/view/movie/M/402310583.mp4","trailerTitle":"过往的梦\n    预告片 (中文字幕)","trailerDate":"2018-05-29"}],"id":"27107609"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031910/5bd6601397bf0b6998d07eec8886e06e/view/movie/M/402300209.mp4","trailerTitle":"银魂2\n    电视版","trailerDate":"2018-04-25"}],"id":"27199577"},{"trailerArray":[],"id":"26961483"},{"trailerArray":[],"id":"27155276"},{"trailerArray":[],"id":"27179414"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031910/b08e1be373b22bafd43da43205a3192d/view/movie/M/302240924.mp4","trailerTitle":"阿丽塔：战斗天使\n    中国先行版1 (中文字幕)","trailerDate":"2017-12-11"},{"trailerMP4":"http://vt1.doubanio.com/201807031910/ff76486d4308a0a2809ee44f1280a18a/view/movie/M/302240871.mp4","trailerTitle":"阿丽塔：战斗天使\n    香港先行版2 (中文字幕)","trailerDate":"2017-12-09"}],"id":"1652592"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031910/4a686d89e084a58cada951f9cb8cee72/view/movie/M/402310024.mp4","trailerTitle":"动物特工局\n    预告片 (中文字幕)","trailerDate":"2018-05-16"}],"id":"30217371"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031910/9ff8963cff7f75b5f4f3ce37e156a7dd/view/movie/M/302190724.mp4","trailerTitle":"疯狂的外星人\n    其它花絮：宁浩“疯狂”混剪 (中文字幕)","trailerDate":"2017-07-26"}],"id":"25986662"},{"trailerArray":[],"id":"27065898"},{"trailerArray":[],"id":"26277338"},{"trailerArray":[],"id":"30187577"},{"trailerArray":[],"id":"30170448"},{"trailerArray":[],"id":"24743117"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807031910/bc7bd256067b90f67c8c3148776a79c9/view/movie/M/402310174.mp4","trailerTitle":"八仙过海\n    先行版","trailerDate":"2018-05-18"}],"id":"30226052"},{"trailerArray":[],"id":"26986120"},{"trailerArray":[],"id":"27619748"},{"trailerArray":[],"id":"26986136"}]

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

var map = {
	"./admin": 6,
	"./admin.js": 6,
	"./category": 7,
	"./category.js": 7,
	"./comment": 8,
	"./comment.js": 8,
	"./flim": 2,
	"./flim.js": 2,
	"./genre": 3,
	"./genre.js": 3,
	"./user": 9,
	"./user.js": 9
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

module.exports = require("bluebird");

/***/ },
/* 34 */
/***/ function(module, exports) {

module.exports = require("cheerio");

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

module.exports = require("nodemailer");

/***/ },
/* 38 */
/***/ function(module, exports) {

module.exports = require("regenerator-runtime");

/***/ },
/* 39 */
/***/ function(module, exports) {

module.exports = require("request-promise");

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_koa__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_koa___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_koa__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_nuxt__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_nuxt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_nuxt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_node_schedule__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_node_schedule___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_node_schedule__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_koa_session__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_koa_session___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_koa_session__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_koa2_cors__ = __webpack_require__(22);
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

            config = __webpack_require__(14);

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
              // rule.dayOfWeek = 2;
              // rule.month = 3;
              // rule.dayOfMonth = 1;
              // rule.hour = 1;
              // rule.minute = 42;
              // rule.second = 0;
              rule.hour = 1;

              __WEBPACK_IMPORTED_MODULE_3_node_schedule___default.a.scheduleJob(rule, function () {
                nodemailer();
                console.log('scheduleRecurrenceRule:' + new Date());
                crawler();
              });
            };

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

          case 22:
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





var filmApi = __webpack_require__(18);
var mongodb = __webpack_require__(16);
var bodyParser = __webpack_require__(20);

var crawler = __webpack_require__(15);
var nodemailer = __webpack_require__(17);

start();

/***/ }
/******/ ]);
//# sourceMappingURL=main.map