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
/******/ 	return __webpack_require__(__webpack_require__.s = 41);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

module.exports = require("mongoose");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(39);


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
var bcrypt = __webpack_require__(31);

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

module.exports = [{"movieName":"小悟空","releaseDate":["2018-07-14(中国大陆)"],"runtime":["85分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2526767688.jpg","id":"30227725","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1396597"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1396598"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1051611"}],"like":"160"},{"movieName":"八只鸡","releaseDate":["2018-07-19(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2525715533.jpg","id":"30252555","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1529912784.88.jpg","id":"1396214"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1529912770.04.jpg","id":"1396215"}],"like":"424"},{"movieName":"摩天营救 Skyscraper","releaseDate":["2018-07-20(中国大陆)","2018-07-13(美国)"],"runtime":["102分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2527484082.jpg","id":"26804147","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1377869988.64.jpg","id":"1005149"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p196.jpg","id":"1044707"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p13115.jpg","id":"1027828"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1377231469.53.jpg","id":"1045049"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1417086901.1.jpg","id":"1049775"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1393148"}],"like":"5850"},{"movieName":"北方一片苍茫","releaseDate":["2018-07-20(中国大陆)","2017-07-23(FIRST青年影展)"],"runtime":["105分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2527454845.jpg","id":"27079318","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/f/movie/14960825e118267b5857fc0ae9f306ef8c74da8f/pics/movie/has_douban@2x.png","id":"1376541"},{"actorImg":"https://img3.doubanio.com/f/movie/14960825e118267b5857fc0ae9f306ef8c74da8f/pics/movie/has_douban@2x.png","id":"1377028"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1396941"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1378150"}],"like":"3219"},{"movieName":"淘气大侦探 Sherlock Gnomes","releaseDate":["2018-07-20(中国大陆)","2018-03-23(美国)","2018-05-11(英国)"],"runtime":["86分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2527551382.jpg","id":"26660063","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p34350.jpg","id":"1298420"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p93.jpg","id":"1006958"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p21481.jpg","id":"1041022"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p562.jpg","id":"1054456"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p9322.jpg","id":"1010581"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p16450.jpg","id":"1014134"}],"like":"923"},{"movieName":"玛雅蜜蜂历险记 Maya the Bee Movie","releaseDate":["2018-07-20(中国大陆)","2014-09-11(德国)"],"runtime":["78分钟(法国)"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2234785674.jpg","id":"25881500","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1298221"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1354128837.83.jpg","id":"1248592"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1417086901.1.jpg","id":"1049775"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1404.jpg","id":"1013865"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33207.jpg","id":"1048191"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p21519.jpg","id":"1161151"}],"like":"665"},{"movieName":"汪星卧底 Show Dogs","releaseDate":["2018-07-20(中国大陆)","2018-05-18(美国)"],"runtime":["92分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526399205.jpg","id":"26930056","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p5860.jpg","id":"1036533"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p7197.jpg","id":"1044709"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1373705281.63.jpg","id":"1049714"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p26071.jpg","id":"1040517"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p22552.jpg","id":"1000096"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1976.jpg","id":"1006980"}],"like":"368"},{"movieName":"兄弟班","releaseDate":["2018-07-20(中国大陆)","2018-07-19(香港)"],"runtime":["102分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2527543528.jpg","id":"26988003","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1921.jpg","id":"1028948"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1485327861.41.jpg","id":"1275972"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1401776151.3.jpg","id":"1340458"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1416749516.7.jpg","id":"1337843"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1392320"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p35235.jpg","id":"1316133"}],"like":"360"},{"movieName":"午夜幽灵","releaseDate":["2018-07-20(中国大陆)"],"runtime":["81分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2516906655.jpg","id":"30128986","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1499243527.29.jpg","id":"1376582"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1394899519.58.jpg","id":"1275029"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1522810252.53.jpg","id":"1391102"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1522810175.11.jpg","id":"1337900"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1495528480.16.jpg","id":"1374307"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1527750676.4.jpg","id":"1349852"}],"like":"300"},{"movieName":"闺蜜的战争","releaseDate":["2018-07-20(中国大陆)"],"runtime":["93分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526892933.jpg","id":"30262110","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1381901"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1396594"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1396595"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1396596"}],"like":"27"}]

/***/ },
/* 11 */
/***/ function(module, exports) {

module.exports = [{"movieName":"小悟空 视频","trailerUri":["https://movie.douban.com/trailer/233378/#content","https://movie.douban.com/trailer/233436/#content","https://movie.douban.com/trailer/233661/#content","https://movie.douban.com/trailer/233523/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2527165369.jpg?1530867333","https://img3.doubanio.com/img/trailer/medium/2527466865.jpg?1531127965","https://img3.doubanio.com/img/trailer/medium/2527813610.jpg?1531456758","https://img3.doubanio.com/img/trailer/medium/2527640782.jpg?1531295366"],"id":"30227725"},{"movieName":"八只鸡 视频","trailerUri":["https://movie.douban.com/trailer/233654/#content","https://movie.douban.com/trailer/233051/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2527812922.jpg?1531457156","https://img3.doubanio.com/img/trailer/medium/2526427410.jpg?"],"id":"30252555"},{"movieName":"摩天营救 视频","trailerUri":["https://movie.douban.com/trailer/233464/#content","https://movie.douban.com/trailer/233438/#content","https://movie.douban.com/trailer/233219/#content","https://movie.douban.com/trailer/233019/#content","https://movie.douban.com/trailer/232978/#content","https://movie.douban.com/trailer/232339/#content","https://movie.douban.com/trailer/231885/#content","https://movie.douban.com/trailer/231474/#content","https://movie.douban.com/trailer/231427/#content","https://movie.douban.com/trailer/231426/#content","https://movie.douban.com/trailer/227160/#content","https://movie.douban.com/trailer/233113/#content","https://movie.douban.com/trailer/232696/#content","https://movie.douban.com/trailer/232471/#content","https://movie.douban.com/trailer/227127/#content","https://movie.douban.com/trailer/233149/#content","https://movie.douban.com/trailer/232871/#content","https://movie.douban.com/trailer/233657/#content","https://movie.douban.com/trailer/233522/#content","https://movie.douban.com/trailer/233435/#content","https://movie.douban.com/trailer/233360/#content","https://movie.douban.com/trailer/233282/#content","https://movie.douban.com/trailer/233163/#content","https://movie.douban.com/trailer/233101/#content","https://movie.douban.com/trailer/231760/#content","https://movie.douban.com/trailer/233535/#content","https://movie.douban.com/trailer/233505/#content","https://movie.douban.com/trailer/233324/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2527544359.jpg?1531203302","https://img3.doubanio.com/img/trailer/medium/2527466982.jpg?1531127783","https://img3.doubanio.com/img/trailer/medium/2526895711.jpg?1530607580","https://img1.doubanio.com/img/trailer/medium/2526382108.jpg?1530611584","https://img3.doubanio.com/img/trailer/medium/2526313250.jpg?1530076834","https://img3.doubanio.com/img/trailer/medium/2524750333.jpg?1528958544","https://img3.doubanio.com/img/trailer/medium/2523980900.jpg?","https://img3.doubanio.com/img/trailer/medium/2522972990.jpg?","https://img3.doubanio.com/img/trailer/medium/2522930690.jpg?","https://img3.doubanio.com/img/trailer/medium/2522930576.jpg?","https://img3.doubanio.com/img/trailer/medium/2512722254.jpg?","https://img1.doubanio.com/img/trailer/medium/2526510949.jpg?1530517860","https://img3.doubanio.com/img/trailer/medium/2525740613.jpg?1529554835","https://img3.doubanio.com/img/trailer/medium/2525015715.jpg?1529047084","https://img3.doubanio.com/img/trailer/medium/2512712482.jpg?","https://img3.doubanio.com/img/trailer/medium/2526564593.jpg?1530515167","https://img3.doubanio.com/img/trailer/medium/2526163516.jpg?1529989460","https://img3.doubanio.com/img/trailer/medium/2527813412.jpg?1531457069","https://img1.doubanio.com/img/trailer/medium/2527640678.jpg?1531295705","https://img3.doubanio.com/img/trailer/medium/2527466733.jpg?1531127997","https://img3.doubanio.com/img/trailer/medium/2527141796.jpg?1530855477","https://img1.doubanio.com/img/trailer/medium/2526986549.jpg?1530699121","https://img3.doubanio.com/img/trailer/medium/2526690711.jpg?","https://img3.doubanio.com/img/trailer/medium/2526492715.jpg?1530260796","https://img3.doubanio.com/img/trailer/medium/2523696406.jpg?","https://img1.doubanio.com/img/trailer/medium/2527648927.jpg?1531298883","https://img3.doubanio.com/img/trailer/medium/2527602883.jpg?1531301035","https://img3.doubanio.com/img/trailer/medium/2527054623.jpg?1530769444"],"id":"26804147"},{"movieName":"北方一片苍茫 视频","trailerUri":["https://movie.douban.com/trailer/233434/#content","https://movie.douban.com/trailer/230359/#content","https://movie.douban.com/trailer/226937/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2527466658.jpg?1531128076","https://img3.doubanio.com/img/trailer/medium/2520568176.jpg?","https://img3.doubanio.com/img/trailer/medium/2512265734.jpg?"],"id":"27079318"},{"movieName":"淘气大侦探 视频","trailerUri":["https://movie.douban.com/trailer/223574/#content","https://movie.douban.com/trailer/232837/#content","https://movie.douban.com/trailer/227921/#content","https://movie.douban.com/trailer/227922/#content","https://movie.douban.com/trailer/228762/#content","https://movie.douban.com/trailer/228312/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2504375164.jpg?","https://img3.doubanio.com/img/trailer/medium/2526136936.jpg?1529910534","https://img1.doubanio.com/img/trailer/medium/2514894909.jpg?","https://img1.doubanio.com/img/trailer/medium/2514894958.jpg?","https://img1.doubanio.com/img/trailer/medium/2516505468.jpg?","https://img3.doubanio.com/img/trailer/medium/2515703990.jpg?"],"id":"26660063"},{"movieName":"玛雅蜜蜂历险记 视频","trailerUri":["https://movie.douban.com/trailer/172324/#content","https://movie.douban.com/trailer/162001/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2230990335.jpg?","https://img3.doubanio.com/img/trailer/medium/2198023743.jpg?"],"id":"25881500"},{"movieName":"汪星卧底 视频","trailerUri":["https://movie.douban.com/trailer/233040/#content","https://movie.douban.com/trailer/228324/#content","https://movie.douban.com/trailer/226112/#content","https://movie.douban.com/trailer/233285/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2526407588.jpg?1530170199","https://img3.doubanio.com/img/trailer/medium/2515743422.jpg?","https://img1.doubanio.com/img/trailer/medium/2510465859.jpg?","https://img1.doubanio.com/img/trailer/medium/2526986777.jpg?1530699005"],"id":"26930056"},{"movieName":"兄弟班 视频","trailerUri":["https://movie.douban.com/trailer/233466/#content","https://movie.douban.com/trailer/232918/#content","https://movie.douban.com/trailer/232602/#content","https://movie.douban.com/trailer/232317/#content","https://movie.douban.com/trailer/233366/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2527544581.jpg?1531203245","https://img3.doubanio.com/img/trailer/medium/2526216606.jpg?1529987939","https://img3.doubanio.com/img/trailer/medium/2525526202.jpg?1529993717","https://img3.doubanio.com/img/trailer/medium/2524715061.jpg?","https://img3.doubanio.com/img/trailer/medium/2527142402.jpg?1530853640"],"id":"26988003"},{"movieName":"午夜幽灵 视频","trailerUri":["https://movie.douban.com/trailer/228258/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2515614481.jpg?"],"id":"30128986"},{"movieName":"闺蜜的战争 视频","trailerUri":[],"trailerPoster":[],"id":"30262110"}]

/***/ },
/* 12 */
/***/ function(module, exports) {

module.exports = [{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807131351/ba21eb5b6bdb259b3dc355b0e3f8d763/view/movie/M/402330378.mp4","trailerTitle":"小悟空\n    预告片：终极版 (中文字幕)","trailerDate":"2018-07-06","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2527165369.jpg?1530867333","trailerId":"b9a2b270866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/1449877425c68b05919f13d7ff046368/view/movie/M/402330436.mp4","trailerTitle":"小悟空\n    先行版 (中文字幕)","trailerDate":"2018-07-09","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2527466865.jpg?1531127965","trailerId":"b99df780866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/91010616508e36f8377d04475358243f/view/movie/M/402330661.mp4","trailerTitle":"小悟空\n    片段1 (中文字幕)","trailerDate":"2018-07-13","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2527813610.jpg?1531456758","trailerId":"b99d0d20866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/19662c4c183b43cb727d04b50ac5fa4c/view/movie/M/402330523.mp4","trailerTitle":"小悟空\n    片段2 (中文字幕)","trailerDate":"2018-07-11","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2527640782.jpg?1531295366","trailerId":"b9a04170866011e890bd731ab430f780"}],"id":"30227725","trailerTitle":"小悟空 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807131351/dbd000a6a3f93c115841b0dc3aa9f4eb/view/movie/M/402330654.mp4","trailerTitle":"八只鸡\n    预告片1：温情版 (中文字幕)","trailerDate":"2018-07-13","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2527812922.jpg?1531457156","trailerId":"baf54a20866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/bd1c41b072e7efc8fdc80185e36665e2/view/movie/M/402330051.mp4","trailerTitle":"八只鸡\n    预告片2：残酷童年版 (中文字幕)","trailerDate":"2018-06-28","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526427410.jpg?","trailerId":"bafbd9d0866011e890bd731ab430f780"}],"id":"30252555","trailerTitle":"八只鸡 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807131351/ff727643d46af7e2abf5f871846bb28f/view/movie/M/402330464.mp4","trailerTitle":"摩天营救\n    中国预告片1：终极版 (中文字幕)","trailerDate":"2018-07-10","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2527544359.jpg?1531203302","trailerId":"bc8c64e0866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/c2cc896d9a3388a2a7fd34d2569f1032/view/movie/M/402330438.mp4","trailerTitle":"摩天营救\n    中国预告片2：赴汤蹈火版 (中文字幕)","trailerDate":"2018-07-09","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2527466982.jpg?1531127783","trailerId":"bca2d310866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/cce72489ca060889481a84f3298d4050/view/movie/M/402330219.mp4","trailerTitle":"摩天营救\n    台湾预告片3 (中文字幕)","trailerDate":"2018-07-03","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526895711.jpg?1530607580","trailerId":"bcab3780866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/f7a31f4880876d4519a73a1e51deac5e/view/movie/M/402330019.mp4","trailerTitle":"摩天营救\n    台湾预告片4 (中文字幕)","trailerDate":"2018-06-28","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2526382108.jpg?1530611584","trailerId":"bc8dc470866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/627ff9c015a95cf57864c5ea953ebaf2/view/movie/M/402320978.mp4","trailerTitle":"摩天营救\n    中国预告片5：定档版 (中文字幕)","trailerDate":"2018-06-27","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526313250.jpg?1530076834","trailerId":"bcac9710866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/f126d09e8609c931a3d03103bba35f20/view/movie/M/402320339.mp4","trailerTitle":"摩天营救\n    台湾预告片6 (中文字幕)","trailerDate":"2018-06-13","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2524750333.jpg?1528958544","trailerId":"bca7dc20866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/2cc343d86019e475b91c282b8ab71463/view/movie/M/402310885.mp4","trailerTitle":"摩天营救\n    台湾预告片7 (中文字幕)","trailerDate":"2018-06-04","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2523980900.jpg?","trailerId":"bc867170866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/2e6ec532996be75777d5f35d45359a1d/view/movie/M/402310474.mp4","trailerTitle":"摩天营救\n    香港预告片8 (中文字幕)","trailerDate":"2018-05-24","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2522972990.jpg?","trailerId":"bca914a0866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/2fc050b5128fd07f5aed2311e73e6b0d/view/movie/M/402310427.mp4","trailerTitle":"摩天营救\n    台湾预告片9 (中文字幕)","trailerDate":"2018-05-24","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2522930690.jpg?","trailerId":"bcad8170866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/70de3986d2731028ea5d24ef4d976d51/view/movie/M/402310426.mp4","trailerTitle":"摩天营救\n    香港预告片10 (中文字幕)","trailerDate":"2018-05-24","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2522930576.jpg?","trailerId":"bc884630866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/5e6846ca09753520f2feb2258c38ad29/view/movie/M/302270160.mp4","trailerTitle":"摩天营救\n    中国预告片11 (中文字幕)","trailerDate":"2018-02-05","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2512722254.jpg?","trailerId":"bcb34dd0866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/16408f3c8d50fcae137595574947067d/view/movie/M/402330113.mp4","trailerTitle":"摩天营救\n    电视版1 (中文字幕)","trailerDate":"2018-06-29","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2526510949.jpg?1530517860","trailerId":"bc831610866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/c8a3b573d4ce320eee170eab436d5954/view/movie/M/402320696.mp4","trailerTitle":"摩天营救\n    电视版2 (中文字幕)","trailerDate":"2018-06-21","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2525740613.jpg?1529554835","trailerId":"bc8eaed0866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/5fbcea5bdb8deaad589ca5e11f0ad015/view/movie/M/402320471.mp4","trailerTitle":"摩天营救\n    电视版3 (中文字幕)","trailerDate":"2018-06-15","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2525015715.jpg?1529047084","trailerId":"bc856000866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/56be10035560eb6366c98425f094faeb/view/movie/M/302270127.mp4","trailerTitle":"摩天营救\n    电视版4：超级碗版","trailerDate":"2018-02-05","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2512712482.jpg?","trailerId":"bca3bd70866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/a255615e832a0c4a26288d0ffc3b9968/view/movie/M/402330149.mp4","trailerTitle":"摩天营救\n    其它预告片1","trailerDate":"2018-06-30","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526564593.jpg?1530515167","trailerId":"bc976160866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/01b9c83b7f8412bbcba802059621b8dc/view/movie/M/402320871.mp4","trailerTitle":"摩天营救\n    其它预告片2 (中文字幕)","trailerDate":"2018-06-25","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526163516.jpg?1529989460","trailerId":"bca6a3a0866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/c4c57934009f729cf00b6b78131b0b41/view/movie/M/402330657.mp4","trailerTitle":"摩天营救\n    花絮1：制作特辑 (中文字幕)","trailerDate":"2018-07-13","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2527813412.jpg?1531457069","trailerId":"bca4a7d0866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/5ee58f44d23e6acc8204020e4414de49/view/movie/M/402330522.mp4","trailerTitle":"摩天营救\n    花絮2：内芙·坎贝尔特辑 (中文字幕)","trailerDate":"2018-07-11","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2527640678.jpg?1531295705","trailerId":"bc956590866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/25ae249de66a66f362642f6556f43dce/view/movie/M/402330435.mp4","trailerTitle":"摩天营救\n    花絮3：昆凌特辑 (中文字幕)","trailerDate":"2018-07-09","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2527466733.jpg?1531127997","trailerId":"bd0369a0866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/21cd47221dae50a677b4ce969c053dd7/view/movie/M/402330360.mp4","trailerTitle":"摩天营救\n    花絮4：英雄逆袭特辑 (中文字幕)","trailerDate":"2018-07-06","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2527141796.jpg?1530855477","trailerId":"bc9df110866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/465b5068f4108ffd616d9deb11cb6c47/view/movie/M/402330282.mp4","trailerTitle":"摩天营救\n    花絮5：珍珠塔特辑 (中文字幕)","trailerDate":"2018-07-04","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2526986549.jpg?1530699121","trailerId":"bc98c0f0866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/e848c809d2915e3aa9c94a186587ab05/view/movie/M/402330163.mp4","trailerTitle":"摩天营救\n    花絮6 (中文字幕)","trailerDate":"2018-07-01","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526690711.jpg?","trailerId":"bc92f490866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/72b4f4b27d76ef82b9af8d2ed11789d5/view/movie/M/402330101.mp4","trailerTitle":"摩天营救\n    花絮7 (中文字幕)","trailerDate":"2018-06-29","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526492715.jpg?1530260796","trailerId":"bca1e8b0866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/8a059b05f05e56af25e82b88361de313/view/movie/M/402310760.mp4","trailerTitle":"摩天营救\n    花絮8：儿童节特辑 (中文字幕)","trailerDate":"2018-06-01","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2523696406.jpg?","trailerId":"bc9c6a70866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/d03bd51f71da22dc8bcf1abbef804b29/view/movie/M/402330535.mp4","trailerTitle":"摩天营救\n    其它花絮1 (中文字幕)","trailerDate":"2018-07-11","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2527648927.jpg?1531298883","trailerId":"bc9f77b0866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/b6eb64b73d3a32082fc0724a73d95928/view/movie/M/402330505.mp4","trailerTitle":"摩天营救\n    其它花絮2 (中文字幕)","trailerDate":"2018-07-11","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2527602883.jpg?1531301035","trailerId":"bc8a4200866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/7ecfbbc5fd5d4970f00251153bbbc7ac/view/movie/M/402330324.mp4","trailerTitle":"摩天营救\n    其它花絮3：北京首映礼特辑 (中文字幕)","trailerDate":"2018-07-05","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2527054623.jpg?1530769444","trailerId":"bc90f8c0866011e890bd731ab430f780"}],"id":"26804147","trailerTitle":"摩天营救 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807131351/f196610aa9164c395f97446be2d82a4e/view/movie/M/402330434.mp4","trailerTitle":"北方一片苍茫\n    预告片1：终极版 (中文字幕)","trailerDate":"2018-07-09","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2527466658.jpg?1531128076","trailerId":"be58e780866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/041b1ba14c978b6afefd27174166b1c2/view/movie/M/402300359.mp4","trailerTitle":"北方一片苍茫\n    预告片2：鹿特丹版","trailerDate":"2018-04-28","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2520568176.jpg?","trailerId":"be553e00866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/2395f5a56b7162e4a62ae86c1b87587f/view/movie/M/302260937.mp4","trailerTitle":"北方一片苍茫\n    预告片3：国际版","trailerDate":"2018-01-31","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2512265734.jpg?","trailerId":"be5e8cd0866011e890bd731ab430f780"}],"id":"27079318","trailerTitle":"北方一片苍茫 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807131351/9193c6404ecd4950321fbfcc74ba1240/view/movie/M/302230574.mp4","trailerTitle":"淘气大侦探\n    台湾预告片 (中文字幕)","trailerDate":"2017-11-08","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2504375164.jpg?","trailerId":"bfc03fb0866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/73dd74a27764ac1635e8d5f6e853681b/view/movie/M/402320837.mp4","trailerTitle":"淘气大侦探\n    中国先行版 (中文字幕)","trailerDate":"2018-06-25","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526136936.jpg?1529910534","trailerId":"bfbb5db0866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/5581a285ce7fea011a3f03841ab1bd0d/view/movie/M/302270921.mp4","trailerTitle":"淘气大侦探\n    电视版1","trailerDate":"2018-02-28","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2514894909.jpg?","trailerId":"bfdb8fe0866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/f0d0feb837465bb024d585965ea96531/view/movie/M/302270922.mp4","trailerTitle":"淘气大侦探\n    电视版2","trailerDate":"2018-02-28","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2514894958.jpg?","trailerId":"bfb62d90866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/a013542c7004cbf37fa1deeebc3a085a/view/movie/M/302280762.mp4","trailerTitle":"淘气大侦探\n    片段","trailerDate":"2018-03-17","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2516505468.jpg?","trailerId":"bfbf7c60866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/28c18461aa12adc41b979e660b958e6d/view/movie/M/302280312.mp4","trailerTitle":"淘气大侦探\n    花絮：动画制作 (中文字幕)","trailerDate":"2018-03-08","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2515703990.jpg?","trailerId":"bfba7350866011e890bd731ab430f780"}],"id":"26660063","trailerTitle":"淘气大侦探 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807131351/530c2e9b15b00334f49e098819842482/view/movie/M/301720324.mp4","trailerTitle":"玛雅蜜蜂历险记\n    预告片1","trailerDate":"2015-03-05","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2230990335.jpg?","trailerId":"c1329460866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/716e42394c65725974cd56f1210f6dfb/view/movie/M/301620001.mp4","trailerTitle":"玛雅蜜蜂历险记\n    德国预告片2","trailerDate":"2014-08-29","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2198023743.jpg?","trailerId":"c13664f0866011e890bd731ab430f780"}],"id":"25881500","trailerTitle":"玛雅蜜蜂历险记 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807131351/dd9f830229bfb666bda3065823af5e2f/view/movie/M/402330040.mp4","trailerTitle":"汪星卧底\n    中国预告片1：定档版 (中文字幕)","trailerDate":"2018-06-28","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2526407588.jpg?1530170199","trailerId":"c28d9080866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/99f9ca5af20dca153548e95fcad87d6d/view/movie/M/302280324.mp4","trailerTitle":"汪星卧底\n    预告片2","trailerDate":"2018-03-09","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2515743422.jpg?","trailerId":"c297c9b0866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/6c0188b2420caf727bb04b47acd0de9f/view/movie/M/302260112.mp4","trailerTitle":"汪星卧底\n    预告片3","trailerDate":"2018-01-13","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2510465859.jpg?","trailerId":"c28e2cc0866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/dc4fbfa9bca7e1f9b2aaadd4508a43af/view/movie/M/402330285.mp4","trailerTitle":"汪星卧底\n    其它花絮：采访特辑 (中文字幕)","trailerDate":"2018-07-04","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2526986777.jpg?1530699005","trailerId":"c2888770866011e890bd731ab430f780"}],"id":"26930056","trailerTitle":"汪星卧底 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807131351/4cee39a93cfe6ff6917a133ced8ed7e6/view/movie/M/402330466.mp4","trailerTitle":"兄弟班\n    预告片1：终极版 (中文字幕)","trailerDate":"2018-07-10","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2527544581.jpg?1531203245","trailerId":"c3eece30866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/73560ff9e44efa469bb751655a59c944/view/movie/M/402320918.mp4","trailerTitle":"兄弟班\n    预告片2：前朋友版 (中文字幕)","trailerDate":"2018-06-26","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526216606.jpg?1529987939","trailerId":"c3efb890866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/d0f61e51926890a5fc7b1cd78f0570d2/view/movie/M/402320602.mp4","trailerTitle":"兄弟班\n    预告片3 (中文字幕)","trailerDate":"2018-06-19","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2525526202.jpg?1529993717","trailerId":"c3e77b30866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/191b14d292510a3ea0e7ae2ee0f312fa/view/movie/M/402320317.mp4","trailerTitle":"兄弟班\n    内地预告片4 (中文字幕)","trailerDate":"2018-06-12","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2524715061.jpg?","trailerId":"c3f33b00866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/f57047281c4633d584094d653d7e61a3/view/movie/M/402330366.mp4","trailerTitle":"兄弟班\n    MV：推广曲《千载不变》 (中文字幕)","trailerDate":"2018-07-06","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2527142402.jpg?1530853640","trailerId":"c3f3fe50866011e890bd731ab430f780"}],"id":"26988003","trailerTitle":"兄弟班 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807131351/33294c904c633721dcffe918798ff006/view/movie/M/302280258.mp4","trailerTitle":"午夜幽灵\n    先行版 (中文字幕)","trailerDate":"2018-03-07","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2515614481.jpg?","trailerId":"c549ca50866011e890bd731ab430f780"}],"id":"30128986","trailerTitle":"午夜幽灵 视频"},{"trailerArray":[],"id":"30262110","trailerTitle":"闺蜜的战争 视频"},{"trailerArray":[],"id":"27158277","trailerTitle":"产科男生 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807131351/9d4264b73e8603ba69b8e1f4be549e64/view/movie/M/402310755.mp4","trailerTitle":"神奇马戏团之动物饼干\n    中国预告片1：魔力版 (中文字幕)","trailerDate":"2018-06-01","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2523696073.jpg?","trailerId":"c90e7370866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/4e0a687b2818e5cbeb40d0418e3baa7d/view/movie/M/402300450.mp4","trailerTitle":"神奇马戏团之动物饼干\n    预告片2：定档版 (中文字幕)","trailerDate":"2018-05-03","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2521045753.jpg?","trailerId":"c90a54c0866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/51950fcf465de4909ef47d564872bf52/view/movie/M/402330524.mp4","trailerTitle":"神奇马戏团之动物饼干\n    花絮：配音特辑 (中文字幕)","trailerDate":"2018-07-11","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2527641056.jpg?1531292460","trailerId":"c90599d0866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/cca3e37e1b3e48f4e8eb87fb81b878b7/view/movie/M/402330662.mp4","trailerTitle":"神奇马戏团之动物饼干\n    MV1：周笔畅献唱中文主题曲《闪亮的魔法》 (中文字幕)","trailerDate":"2018-07-13","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2527814211.jpg?1531456833","trailerId":"c90c9eb0866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/b8d83ce05e72d01afe77ca679130e2c3/view/movie/M/402320680.mp4","trailerTitle":"神奇马戏团之动物饼干\n    MV2：宣传曲《嗷嗷嗷》 (中文字幕)","trailerDate":"2018-06-21","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2525717146.jpg?1529902562","trailerId":"c90831e0866011e890bd731ab430f780"}],"id":"26253783","trailerTitle":"神奇马戏团之动物饼干 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807131351/ec6feb26813a5fd1f62aede56a8bf19d/view/movie/M/402330325.mp4","trailerTitle":"狄仁杰之四大天王\n    预告片1：背水一战版 (中文字幕)","trailerDate":"2018-07-05","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2527054753.jpg?","trailerId":"ca8c87f0866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/fe06833df792b7ceb9cf0022dbc191af/view/movie/M/402320838.mp4","trailerTitle":"狄仁杰之四大天王\n    预告片2：天王现身版 (中文字幕)","trailerDate":"2018-06-25","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526137676.jpg?1529911031","trailerId":"ca7d6cc0866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/205b387b262a00fdee686c403ccef43f/view/movie/M/302210792.mp4","trailerTitle":"狄仁杰之四大天王\n    预告片3：真相不白版 (中文字幕)","trailerDate":"2017-09-22","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2499767152.jpg?","trailerId":"cad79ab0866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/587ec732e618ff30edd3b303124f0a5b/view/movie/M/402300245.mp4","trailerTitle":"狄仁杰之四大天王\n    先行版 (中文字幕)","trailerDate":"2018-04-25","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2520334127.jpg?","trailerId":"ca897ab0866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/ecac20b5d1288c7b924d9a2c95d2dcba/view/movie/M/402320616.mp4","trailerTitle":"狄仁杰之四大天王\n    其它预告片：大唐神器亢龙锏 (中文字幕)","trailerDate":"2018-06-20","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2525590378.jpg?","trailerId":"ca79ea50866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/5be99a3447c6e5e72a6d52f72db094a7/view/movie/M/402330597.mp4","trailerTitle":"狄仁杰之四大天王\n    花絮1 (中文字幕)","trailerDate":"2018-07-12","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2527752127.jpg?1531392242","trailerId":"ca6e5190866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/784cf78c787de3b8d8b97c54f0e470a8/view/movie/M/402330527.mp4","trailerTitle":"狄仁杰之四大天王\n    花絮2：九亿少女的梦特辑 (中文字幕)","trailerDate":"2018-07-11","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2527641751.jpg?1531291872","trailerId":"ca6fd830866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/a7f933a03bb33e09245a959682e5d3b8/view/movie/M/402330362.mp4","trailerTitle":"狄仁杰之四大天王\n    花絮3：争气朋克少女特辑 (中文字幕)","trailerDate":"2018-07-06","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2527141912.jpg?","trailerId":"ca755670866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/eda2a55ed1449ba71b659cd9acf81b14/view/movie/M/402330067.mp4","trailerTitle":"狄仁杰之四大天王\n    花絮4 (中文字幕)","trailerDate":"2018-06-28","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2526441668.jpg?","trailerId":"ca772b30866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/815c6ee74608f0d530408fd04c896465/view/movie/M/402320984.mp4","trailerTitle":"狄仁杰之四大天王\n    花絮5：武则天特辑 (中文字幕)","trailerDate":"2018-06-27","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526314013.jpg?","trailerId":"ca72e570866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/a06555a9b2ca70b3169cc5ad3935e3fc/view/movie/M/402310450.mp4","trailerTitle":"狄仁杰之四大天王\n    花絮6：神探回归特辑 (中文字幕)","trailerDate":"2018-05-24","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2522954430.jpg?","trailerId":"ca811640866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/5c22f8c4331f2b71f790ea0713048d97/view/movie/M/402320624.mp4","trailerTitle":"狄仁杰之四大天王\n    其它花絮： IMAX推荐特辑 (中文字幕)","trailerDate":"2018-06-20","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2525591834.jpg?","trailerId":"ca7185e0866011e890bd731ab430f780"}],"id":"25882296","trailerTitle":"狄仁杰之四大天王 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807131351/d3fea5ce8eb9120c5f93ee3279edb759/view/movie/M/402330361.mp4","trailerTitle":"西虹市首富\n    预告片1：百变首富版 (中文字幕)","trailerDate":"2018-07-06","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2527141847.jpg?","trailerId":"cc424e40866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/307da36d7260a9d5d4ad43b6f7940403/view/movie/M/402320859.mp4","trailerTitle":"西虹市首富\n    预告片2：主创推荐版 (中文字幕)","trailerDate":"2018-06-25","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526149462.jpg?1529918217","trailerId":"cc453470866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/19cbf12b0dffbb7e2087102a920bcf06/view/movie/M/402320030.mp4","trailerTitle":"西虹市首富\n    预告片3：特笑版 (中文字幕)","trailerDate":"2018-06-06","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2524221309.jpg?","trailerId":"cc5a9130866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/9cdcde4a7b4da4f76aa79f1a8ad302eb/view/movie/M/402310173.mp4","trailerTitle":"西虹市首富\n    预告片4：特笑大片","trailerDate":"2018-05-18","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2522456574.jpg?","trailerId":"cc586e50866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/3f3449e8d5d14c970e510daa4dd2af8e/view/movie/M/402330327.mp4","trailerTitle":"西虹市首富\n    其它预告片 (中文字幕)","trailerDate":"2018-07-05","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2527062942.jpg?1530774020","trailerId":"cc4338a0866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/5188c570694893f1dd9d599553b04f4c/view/movie/M/402320506.mp4","trailerTitle":"西虹市首富\n    花絮：魔音特辑 (中文字幕)","trailerDate":"2018-06-15","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2525046609.jpg?","trailerId":"cc442300866011e890bd731ab430f780"}],"id":"27605698","trailerTitle":"西虹市首富 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807131351/a896ed448ca394fceeecf9a3f2728b36/view/movie/M/402310757.mp4","trailerTitle":"昨日青空\n    预告片1 (中文字幕)","trailerDate":"2018-06-01","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2523696213.jpg?","trailerId":"cdc3be20866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/0746a5e42af6442906b595098ed7517c/view/movie/M/302200018.mp4","trailerTitle":"昨日青空\n    预告片2 (中文字幕)","trailerDate":"2017-08-03","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2494953073.jpg?","trailerId":"cdbc4410866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/523d21711d63a0b21d842d03f4272afc/view/movie/M/402330179.mp4","trailerTitle":"昨日青空\n    MV1：青春告白曲《来不及勇敢》 (中文字幕)","trailerDate":"2018-07-02","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526778622.jpg?1530511790","trailerId":"cdb42dc0866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/059c77958ab6d12f3b4d69c73c7e09b3/view/movie/M/402330106.mp4","trailerTitle":"昨日青空\n    MV2：毕业曲《再见昨天》 (中文字幕)","trailerDate":"2018-06-29","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526493695.jpg?1530257976","trailerId":"cdb6ece0866011e890bd731ab430f780"},{"trailerMP4":"http://vt1.doubanio.com/201807131351/298ddff9223cfdf3d746355e5c058bb7/view/movie/M/402310929.mp4","trailerTitle":"昨日青空\n    MV3：青春毕业曲《再见昨天》 (中文字幕)","trailerDate":"2018-06-05","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2524048767.jpg?","trailerId":"cdaf4bc0866011e890bd731ab430f780"}],"id":"26290410","trailerTitle":"昨日青空 视频"}]

/***/ },
/* 13 */
/***/ function(module, exports) {

module.exports = [{"url":"https://movie.douban.com/subject/30227725/","title":"小悟空","like":"160"},{"url":"https://movie.douban.com/subject/30252555/","title":"八只鸡","like":"424"},{"url":"https://movie.douban.com/subject/26804147/","title":"摩天营救","like":"5850"},{"url":"https://movie.douban.com/subject/27079318/","title":"北方一片苍茫","like":"3219"},{"url":"https://movie.douban.com/subject/26660063/","title":"淘气大侦探","like":"923"},{"url":"https://movie.douban.com/subject/25881500/","title":"玛雅蜜蜂历险记","like":"665"},{"url":"https://movie.douban.com/subject/26930056/","title":"汪星卧底","like":"368"},{"url":"https://movie.douban.com/subject/26988003/","title":"兄弟班","like":"360"},{"url":"https://movie.douban.com/subject/30128986/","title":"午夜幽灵","like":"300"},{"url":"https://movie.douban.com/subject/30262110/","title":"闺蜜的战争","like":"27"},{"url":"https://movie.douban.com/subject/27158277/","title":"产科男生","like":"24"},{"url":"https://movie.douban.com/subject/26253783/","title":"神奇马戏团之动物饼干","like":"2554"},{"url":"https://movie.douban.com/subject/25882296/","title":"狄仁杰之四大天王","like":"28448"},{"url":"https://movie.douban.com/subject/27605698/","title":"西虹市首富","like":"17320"},{"url":"https://movie.douban.com/subject/26290410/","title":"昨日青空","like":"13171"},{"url":"https://movie.douban.com/subject/30263334/","title":"解剖室灵异事件之男生宿舍","like":"54"},{"url":"https://movie.douban.com/subject/30146756/","title":"风语咒","like":"4947"},{"url":"https://movie.douban.com/subject/26754880/","title":"萌学园：寻找盘古","like":"2490"},{"url":"https://movie.douban.com/subject/27615564/","title":"的士速递5","like":"1737"},{"url":"https://movie.douban.com/subject/26767512/","title":"解码游戏","like":"840"},{"url":"https://movie.douban.com/subject/30208005/","title":"神秘世界历险记4","like":"105"},{"url":"https://movie.douban.com/subject/30156898/","title":"肆式青春","like":"2857"},{"url":"https://movie.douban.com/subject/26985127/","title":"一出好戏","like":"23629"},{"url":"https://movie.douban.com/subject/24852545/","title":"爱情公寓","like":"13306"},{"url":"https://movie.douban.com/subject/26426194/","title":"巨齿鲨","like":"4901"},{"url":"https://movie.douban.com/subject/26290398/","title":"美食大冒险之英雄烩","like":"276"},{"url":"https://movie.douban.com/subject/30125089/","title":"勇者闯魔城","like":"114"},{"url":"https://movie.douban.com/subject/26331700/","title":"大轰炸","like":"5512"},{"url":"https://movie.douban.com/subject/30122633/","title":"快把我哥带走","like":"4317"},{"url":"https://movie.douban.com/subject/26871669/","title":"如影随心","like":"3892"},{"url":"https://movie.douban.com/subject/27200988/","title":"未来机器城","like":"847"},{"url":"https://movie.douban.com/subject/30254589/","title":"最后的棒棒","like":"754"},{"url":"https://movie.douban.com/subject/27201353/","title":"大师兄","like":"567"},{"url":"https://movie.douban.com/subject/26311974/","title":"下一站：前任","like":"182"},{"url":"https://movie.douban.com/subject/30176525/","title":"深海历险记","like":"115"},{"url":"https://movie.douban.com/subject/30246086/","title":"他是一只狗","like":"81"},{"url":"https://movie.douban.com/subject/24743257/","title":"冷恋时代","like":"46"},{"url":"https://movie.douban.com/subject/27119292/","title":"大三儿","like":"1319"},{"url":"https://movie.douban.com/subject/26996640/","title":"反贪风暴3","like":"3248"},{"url":"https://movie.douban.com/subject/26881698/","title":"七袋米","like":"505"},{"url":"https://movie.douban.com/subject/30199575/","title":"让我怎么相信你","like":"250"},{"url":"https://movie.douban.com/subject/26954268/","title":"道高一丈","like":"222"},{"url":"https://movie.douban.com/subject/26730542/","title":"有五个姐姐的我就注定要单身了","like":"113"},{"url":"https://movie.douban.com/subject/27107604/","title":"天下第一镖局","like":"58"},{"url":"https://movie.douban.com/subject/30237381/","title":"惊慌失色之诡寓","like":"35"},{"url":"https://movie.douban.com/subject/30236775/","title":"旅行吧！井底之蛙","like":"77"},{"url":"https://movie.douban.com/subject/27622447/","title":"小偷家族","like":"56539"},{"url":"https://movie.douban.com/subject/26636712/","title":"蚁人2：黄蜂女现身","like":"41451"},{"url":"https://movie.douban.com/subject/26756049/","title":"我，花样女王","like":"39229"},{"url":"https://movie.douban.com/subject/26336252/","title":"碟中谍6：全面瓦解","like":"28461"},{"url":"https://movie.douban.com/subject/26916229/","title":"镰仓物语","like":"25278"},{"url":"https://movie.douban.com/subject/4864908/","title":"影","like":"23817"},{"url":"https://movie.douban.com/subject/26627736/","title":"边境杀手2：边境战士","like":"9137"},{"url":"https://movie.douban.com/subject/27140071/","title":"找到你","like":"5902"},{"url":"https://movie.douban.com/subject/26930565/","title":"营救汪星人","like":"5895"},{"url":"https://movie.douban.com/subject/26630714/","title":"精灵旅社3：疯狂假期","like":"3559"},{"url":"https://movie.douban.com/subject/26882457/","title":"断片之险途夺宝","like":"3441"},{"url":"https://movie.douban.com/subject/26309969/","title":"新乌龙院之笑闹江湖","like":"2463"},{"url":"https://movie.douban.com/subject/26816090/","title":"沉默的证人","like":"2455"},{"url":"https://movie.douban.com/subject/26790960/","title":"墨多多谜境冒险","like":"2400"},{"url":"https://movie.douban.com/subject/26425062/","title":"武林怪兽","like":"2068"},{"url":"https://movie.douban.com/subject/26792540/","title":"真相漩涡","like":"1861"},{"url":"https://movie.douban.com/subject/26728641/","title":"苏丹","like":"1745"},{"url":"https://movie.douban.com/subject/26929835/","title":"跨越8年的新娘","like":"1696"},{"url":"https://movie.douban.com/subject/27195119/","title":"李宗伟：败者为王","like":"541"},{"url":"https://movie.douban.com/subject/27662353/","title":"忠犬大营救","like":"297"},{"url":"https://movie.douban.com/subject/27192660/","title":"黑脸大包公之西夏风云","like":"193"},{"url":"https://movie.douban.com/subject/30176069/","title":"阿里巴巴三根金发","like":"64"},{"url":"https://movie.douban.com/subject/27661975/","title":"幸福魔咒","like":"62"},{"url":"https://movie.douban.com/subject/30263969/","title":"纯真年代","like":"25"},{"url":"https://movie.douban.com/subject/30259493/","title":"黑暗深处之惊魂夜","like":"24"},{"url":"https://movie.douban.com/subject/30215191/","title":"恩师","like":"58"},{"url":"https://movie.douban.com/subject/27191430/","title":"勇敢往事","like":"27"},{"url":"https://movie.douban.com/subject/26972258/","title":"江湖儿女","like":"21723"},{"url":"https://movie.douban.com/subject/26263417/","title":"一生有你","like":"745"},{"url":"https://movie.douban.com/subject/30227727/","title":"禹神传之寻找神力","like":"21"},{"url":"https://movie.douban.com/subject/27092785/","title":"李茶的姑妈","like":"2676"},{"url":"https://movie.douban.com/subject/26425063/","title":"无双","like":"1799"},{"url":"https://movie.douban.com/subject/26744597/","title":"云南虫谷","like":"1531"},{"url":"https://movie.douban.com/subject/27149818/","title":"胖子行动队","like":"806"},{"url":"https://movie.douban.com/subject/26911450/","title":"山2","like":"18869"},{"url":"https://movie.douban.com/subject/27198855/","title":"护垫侠","like":"6809"},{"url":"https://movie.douban.com/subject/27135473/","title":"阳台上","like":"6354"},{"url":"https://movie.douban.com/subject/26715965/","title":"苦行僧的非凡旅程","like":"836"},{"url":"https://movie.douban.com/subject/30142649/","title":"大闹西游","like":"575"},{"url":"https://movie.douban.com/subject/30269510/","title":"相亲时代","like":"5"},{"url":"https://movie.douban.com/subject/26935283/","title":"阴阳师","like":"6488"},{"url":"https://movie.douban.com/subject/30208004/","title":"阿凡提之奇缘历险","like":"99"},{"url":"https://movie.douban.com/subject/27620911/","title":"灵魂的救赎","like":"32"},{"url":"https://movie.douban.com/subject/27008394/","title":"功夫联盟","like":"922"},{"url":"https://movie.douban.com/subject/27663881/","title":"燃点","like":"568"},{"url":"https://movie.douban.com/subject/27107609/","title":"过往的梦","like":"37"},{"url":"https://movie.douban.com/subject/27199577/","title":"银魂2","like":"4650"},{"url":"https://movie.douban.com/subject/26961483/","title":"碟仙实录","like":"349"},{"url":"https://movie.douban.com/subject/27155276/","title":"素人特工","like":"441"},{"url":"https://movie.douban.com/subject/27179414/","title":"人间·喜剧","like":"1663"},{"url":"https://movie.douban.com/subject/1652592/","title":"阿丽塔：战斗天使","like":"11751"},{"url":"https://movie.douban.com/subject/30217371/","title":"动物特工局","like":"648"},{"url":"https://movie.douban.com/subject/25986662/","title":"疯狂的外星人","like":"16727"},{"url":"https://movie.douban.com/subject/27065898/","title":"神探蒲松龄之兰若仙踪","like":"1212"},{"url":"https://movie.douban.com/subject/26277338/","title":"八仙之各显神通","like":"944"},{"url":"https://movie.douban.com/subject/30187577/","title":"误入江湖","like":"463"},{"url":"https://movie.douban.com/subject/30170448/","title":"迦百农","like":"3429"},{"url":"https://movie.douban.com/subject/24743117/","title":"画皮Ⅲ","like":"5946"},{"url":"https://movie.douban.com/subject/30226052/","title":"八仙过海","like":"22"},{"url":"https://movie.douban.com/subject/26986120/","title":"摸金校尉之九幽将军","like":"13486"},{"url":"https://movie.douban.com/subject/30264504/","title":"异界","like":"9"},{"url":"https://movie.douban.com/subject/27619748/","title":"唐人街探案3","like":"8813"},{"url":"https://movie.douban.com/subject/26986136/","title":"黑色假面","like":"1676"}]

/***/ },
/* 14 */
/***/ function(module, exports) {

module.exports = require("path");

/***/ },
/* 15 */
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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__);


var _this = this;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var movieFile = __webpack_require__(27);
var axios = __webpack_require__(30);
var doubanAPI = 'http://api.douban.com/v2/movie/';
var request = __webpack_require__(5);
var qiniuFn = __webpack_require__(28);

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
              // uri: `${doubanAPI}coming_soon?count=100`
              uri: doubanAPI + 'coming_soon?count=10'
              // 代理地址
            };
            random = Math.floor(Math.random() * proxy.length);
            // console.log(`随机数为${random}`)

            options.proxy = 'http://' + proxyConfig.user + ':' + proxyConfig.password + '@' + proxy[random] + ':' + proxyConfig.port;

            _context5.next = 7;
            return new Promise(function (resolve) {
              request(options, function (error, response, body) {
                console.log(body);
                resolve(JSON.parse(body));
              });
            });

          case 7:
            films = _context5.sent;
            _context5.next = 14;
            break;

          case 10:
            _context5.prev = 10;
            _context5.t0 = _context5['catch'](1);

            console.log('\u5373\u5C06\u4E0A\u6620\u7535\u5F71\u5217\u8868API\uFF0C\u8BF7\u6C42\u5931\u8D25\uFF0C\u51C6\u5907\u91CD\u65B0\u8BF7\u6C42ing');
            fetchFilms();
            // console.log(e)

          case 14:
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

          case 16:
            if (!(i < films.subjects.length)) {
              _context5.next = 21;
              break;
            }

            return _context5.delegateYield(_loop(i), 't1', 18);

          case 18:
            i++;
            _context5.next = 16;
            break;

          case 21:
            console.log('\u7535\u5F71\u66F4\u65B0\u5B8C\u6BD5');

          case 22:
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
  var _ref6 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee9(ctx, next) {
    var filmDetail, filmTrailer, filmTrailerDetail;
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            filmDetail = __webpack_require__(10);
            filmTrailer = __webpack_require__(11);
            filmTrailerDetail = __webpack_require__(12);

            // 添加爬取的上映日期、播放时长、电影封面

            _context9.next = 5;
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
                          _context7.next = 16;
                          break;
                        }

                        _context7.next = 4;
                        return Film.findOne({ id: filmDetail[i].id }).exec();

                      case 4:
                        film = _context7.sent;

                        if (!film) {
                          _context7.next = 13;
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

                        _context7.next = 13;
                        return film.save();

                      case 13:
                        i++;
                        _context7.next = 1;
                        break;

                      case 16:
                        console.log('\u7535\u5F71\u7F3A\u5931\u4E0A\u6620\u65E5\u671F\u3001\u64AD\u653E\u65F6\u957F\u3001\u7535\u5F71\u5C01\u9762\u4FE1\u606F\u8865\u5145\u5B8C\u6BD5');
                        return _context7.abrupt('return', resolve());

                      case 18:
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
            _context9.next = 7;
            return new Promise(function () {
              var _ref8 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee8(resolve, reject) {
                var i, film, j;
                return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        i = 0;

                      case 1:
                        if (!(i < filmTrailerDetail.length)) {
                          _context8.next = 9;
                          break;
                        }

                        _context8.next = 4;
                        return Film.findOne({ id: filmTrailerDetail[i].id }).exec();

                      case 4:
                        film = _context8.sent;


                        if (film) {
                          for (j = 0; j < filmTrailerDetail[i].trailerArray.length; j++) {
                            film.trailerArray.push({
                              trailerMP4: filmTrailerDetail[i].trailerArray[j].trailerId + '\u89C6\u9891',
                              trailerTitle: '' + filmTrailerDetail[i].trailerArray[j].trailerTitle,
                              trailerDate: '' + filmTrailerDetail[i].trailerArray[j].trailerDate,
                              trailerPoster: filmTrailerDetail[i].trailerArray[j].trailerId + '\u5C01\u9762\u56FE',
                              trailerId: filmTrailerDetail[i].trailerArray[j].trailerId
                            });
                          }

                          film.save();
                        }

                      case 6:
                        i++;
                        _context8.next = 1;
                        break;

                      case 9:

                        console.log('\u7535\u5F71\u9884\u544A\u7247\u8BE6\u60C5\u8865\u5145\u5B8C\u6BD5');
                        return _context8.abrupt('return', resolve());

                      case 11:
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
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, _this);
  }));

  return function crawlerDetail(_x6, _x7) {
    return _ref6.apply(this, arguments);
  };
}();

var uploadQiniuFile = function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee10() {
    var filmDetail, filmTrailerDetail, i, j, _i, _j;

    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            filmDetail = __webpack_require__(10);
            filmTrailerDetail = __webpack_require__(12);


            for (i = 0; i < filmDetail.length; i++) {
              // 上传电影封面照
              qiniuFn.uploadQiniuFile(filmDetail[i].postPic, filmDetail[i].movieName + '\u5C01\u9762\u56FE');
              for (j = 0; j < filmDetail[i].actorAddMsg.length; j++) {
                // 上传电影主演照片
                qiniuFn.uploadQiniuFile(filmDetail[i].actorAddMsg[j].actorImg, filmDetail[i].actorAddMsg[j].id + 'castImg.jpg');
              }
            }

            for (_i = 0; _i < filmTrailerDetail.length; _i++) {
              for (_j = 0; _j < filmTrailerDetail[_i].trailerArray.length; _j++) {
                qiniuFn.uploadQiniuFile(filmTrailerDetail[_i].trailerArray[_j].trailerPoster, filmTrailerDetail[_i].trailerArray[_j].trailerId + '\u5C01\u9762\u56FE');
                qiniuFn.uploadQiniuFile(filmTrailerDetail[_i].trailerArray[_j].trailerMP4, filmTrailerDetail[_i].trailerArray[_j].trailerId + '\u89C6\u9891');
              }
            }

          case 4:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, _this);
  }));

  return function uploadQiniuFile() {
    return _ref9.apply(this, arguments);
  };
}();

/* 定时更新内容 */
var updateMovie = function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee11() {
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            console.time("sort");
            _context11.next = 3;
            return movieFile.runMovieDetail();

          case 3:
            _context11.next = 5;
            return movieFile.runMovieTrailer();

          case 5:
            _context11.next = 7;
            return movieFile.runMovieTrailerDetail();

          case 7:
            _context11.next = 9;
            return movieFile.runMoviePhotos();

          case 9:
            _context11.next = 11;
            return fetchFilms();

          case 11:
            _context11.next = 13;
            return crawlerDetail();

          case 13:
            _context11.next = 15;
            return uploadQiniuFile();

          case 15:
            console.timeEnd("sort");

          case 16:
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
/* 17 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__);


var _this = this;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fs = __webpack_require__(4);
var resolve = __webpack_require__(14).resolve;
var mongoose = __webpack_require__(0);
var config = __webpack_require__(26);

/*const models = resolve(__dirname, './schema')
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*js$/))
  .forEach(file => require(resolve(models, file)))*/
var models = resolve(__dirname, '../database/schema');
fs.readdirSync(models).filter(function (file) {
  return ~file.search(/^[^\.].*js$/);
}).forEach(function (file) {
  __webpack_require__(29)("./" + file);
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
/* 18 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {

var nodemailer = __webpack_require__(37);
var fs = __webpack_require__(4);
var path = __webpack_require__(14);
var ejs = __webpack_require__(34);

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
/* 19 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__);


var _this = this;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var router = __webpack_require__(35)();

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
            return Film.findOne({ id: filmId }, 'title releaseDate trailerArray like').exec();

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
/* 20 */
/***/ function(module, exports) {

module.exports = require("koa");

/***/ },
/* 21 */
/***/ function(module, exports) {

module.exports = require("koa-bodyparser");

/***/ },
/* 22 */
/***/ function(module, exports) {

module.exports = require("koa-session");

/***/ },
/* 23 */
/***/ function(module, exports) {

module.exports = require("koa2-cors");

/***/ },
/* 24 */
/***/ function(module, exports) {

module.exports = require("node-schedule");

/***/ },
/* 25 */
/***/ function(module, exports) {

module.exports = require("nuxt");

/***/ },
/* 26 */
/***/ function(module, exports) {

var config = {
  db: 'mongodb://127.0.0.1/filmgo'
};

module.exports = config;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__);


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _this = this;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var rp = __webpack_require__(40);
var cheerio = __webpack_require__(32); // Node.js版本的jquery
var fs = __webpack_require__(4);
// const iconv = require('iconv-lite') // 文件编码转换
var request = __webpack_require__(5);
// const proxyIP = require('../middleware/request')
var uuid = __webpack_require__(36);

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
                          _context2.next = 10;
                          break;

                        case 7:
                          _context2.prev = 7;
                          _context2.t0 = _context2['catch'](1);

                          console.log('\u722C\u53D6\u300A' + movieUrl.title + '\u300B\u5931\u8D25\uFF0C\u51C6\u5907\u91CD\u65B0\u5F00\u59CB\u722C\u53D6\n\u9519\u8BEF\u65E5\u5FD7' + _context2.t0 + '\n\u91CD\u542F\u6B21\u6570\u4E3A' + restartCount);
                          // console.error(e);

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
                          _context2.next = 33;
                          break;

                        case 21:
                          /*
                          *  需要限制重启次数，目前只能重启 4 次
                          *  超过 4 次将发送邮件通知
                          * */
                          restartCount++;

                          if (!(restartCount < 5)) {
                            _context2.next = 31;
                            break;
                          }

                          _context2.next = 25;
                          return sleep(2);

                        case 25:
                          _context2.next = 27;
                          return getComingMovie({ movieUrl: movieUrl, restartCount: restartCount });

                        case 27:
                          _movie = _context2.sent;

                          resolve(_movie);
                          _context2.next = 33;
                          break;

                        case 31:
                          console.log('\u76EE\u524D\u91CD\u542F\u6B21\u6570\u4E3A' + restartCount + ', \u91CD\u590D\u6B21\u6570\u8FC7\u591A\uFF0C\u4E0D\u53EF\u6297\u62D2\u56E0\u7D20\uFF0C\u5C06\u53D1\u8D77\u90AE\u4EF6\u901A\u77E5');
                          resolve('\u722C\u53D6\u5931\u8D25\uFF0C\u91CD\u542F\u6B21\u6570\u4E3A' + restartCount);

                        case 33:
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
            // for(let i = 0; i < comingMoviesLink.length; i++) {
            i = 0;

          case 20:
            if (!(i < 10)) {
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

                          _context5.next = 11;
                          break;

                        case 7:
                          _context5.prev = 7;
                          _context5.t0 = _context5['catch'](1);

                          console.log('\u722C\u53D6\u300A' + movieUrl.title + '\u300B\u5931\u8D25\uFF0C\u51C6\u5907\u91CD\u65B0\u5F00\u59CB\u722C\u53D6\n\u9519\u8BEF\u65E5\u5FD7' + _context5.t0 + '\n\u91CD\u542F\u6B21\u6570\u4E3A' + restartCount);
                          console.error(_context5.t0);

                        case 11:
                          if (!$) {
                            _context5.next = 19;
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
                          _context5.next = 31;
                          break;

                        case 19:
                          /*
                          *  需要限制重启次数，目前只能重启 4 次
                          *  超过 4 次将发送邮件通知
                          * */
                          restartCount++;

                          if (!(restartCount < 5)) {
                            _context5.next = 29;
                            break;
                          }

                          _context5.next = 23;
                          return sleep(2);

                        case 23:
                          _context5.next = 25;
                          return getMovieTrailer({ movieUrl: movieUrl, restartCount: restartCount });

                        case 25:
                          _trailer = _context5.sent;

                          resolve(_trailer);
                          _context5.next = 31;
                          break;

                        case 29:
                          console.log('\u76EE\u524D\u91CD\u542F\u6B21\u6570\u4E3A' + restartCount + ', \u91CD\u590D\u6B21\u6570\u8FC7\u591A\uFF0C\u4E0D\u53EF\u6297\u62D2\u56E0\u7D20\uFF0C\u5C06\u53D1\u8D77\u90AE\u4EF6\u901A\u77E5');
                          resolve('\u722C\u53D6\u5931\u8D25\uFF0C\u91CD\u542F\u6B21\u6570\u4E3A' + restartCount);

                        case 31:
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
            comingMoviesLink = __webpack_require__(13); // 全部电影的 url

            Trailer = [];

            // for(let i = 0; i < comingMoviesLink.length ; i++) {

            i = 0;

          case 3:
            if (!(i < 10)) {
              _context7.next = 15;
              break;
            }

            _context7.next = 6;
            return getMovieTrailer({ movieUrl: comingMoviesLink[i] });

          case 6:
            trailer = _context7.sent;

            Trailer.push(trailer);
            console.log('\u8FD9\u662F\u7B2C' + (i + 1) + '\u4E2A\u7535\u5F71\u7684\u9884\u544A\u7247\u5217\u8868, ' + trailer.movieName);

            _context7.next = 11;
            return sleep(2);

          case 11:
            // 间歇 2s
            fs.writeFileSync('./comingMovieTrailer.json', JSON.stringify(Trailer, null, 2), 'utf8');

          case 12:
            i++;
            _context7.next = 3;
            break;

          case 15:
            console.log('\u7535\u5F71\u9884\u544A\u7247\u5217\u8868\u5168\u90E8\u722C\u53D6\u6210\u529F, \u5171\u8BA1' + comingMoviesLink.length);

          case 16:
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
                                        trailerId: uuid.v1().replace(/-/g, "")
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
            comingTrailerLink = __webpack_require__(11);
            Trailer = [];
            i = 0;

          case 3:
            if (!(i < comingTrailerLink.length)) {
              _context13.next = 15;
              break;
            }

            _context13.next = 6;
            return getMovieTrailerDetail(comingTrailerLink[i]);

          case 6:
            trailer = _context13.sent;

            Trailer.push(trailer);

            console.log('\u8FD9\u662F\u7B2C' + (i + 1) + '\u4E2A\u7535\u5F71\u7684\u9884\u544A\u8BE6\u7EC6\u4FE1\u606F, \u300A' + trailer.trailerTitle + '\u300B');

            fs.writeFileSync('./comingMovieTrailerDetail.json', JSON.stringify(Trailer, null, 2), 'utf8');
            _context13.next = 12;
            return sleep(2);

          case 12:
            i++;
            _context13.next = 3;
            break;

          case 15:
            console.log('\u7535\u5F71\u9884\u544A\u8BE6\u7EC6\u5168\u90E8\u722C\u53D6\u6210\u529F, \u5171\u8BA1' + comingTrailerLink.length);

          case 16:
          case 'end':
            return _context13.stop();
        }
      }
    }, _callee13, _this);
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

                          _context14.next = 10;
                          break;

                        case 7:
                          _context14.prev = 7;
                          _context14.t0 = _context14['catch'](1);

                          console.log('\u722C\u53D6\u300A' + movieUrl.title + '\u300B\u5931\u8D25\uFF0C\u51C6\u5907\u91CD\u65B0\u5F00\u59CB\u722C\u53D6\n\u9519\u8BEF\u65E5\u5FD7' + _context14.t0);
                          // console.error(e);

                        case 10:
                          if (!$) {
                            _context14.next = 16;
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
                          _context14.next = 28;
                          break;

                        case 16:
                          /*
                          *  需要限制重启次数，目前只能重启 4 次
                          *  超过 4 次将发送邮件通知
                          * */
                          restartCount++;

                          if (!(restartCount < 5)) {
                            _context14.next = 26;
                            break;
                          }

                          _context14.next = 20;
                          return sleep(2);

                        case 20:
                          _context14.next = 22;
                          return getMoviePhotos({ movieUrl: movieUrl, restartCount: restartCount });

                        case 22:
                          photo = _context14.sent;

                          resolve(photo);
                          _context14.next = 28;
                          break;

                        case 26:
                          console.log('\u76EE\u524D\u91CD\u542F\u6B21\u6570\u4E3A' + (restartCount - 1) + ', \u91CD\u590D\u6B21\u6570\u8FC7\u591A\uFF0C\u4E0D\u53EF\u6297\u62D2\u56E0\u7D20\uFF0C\u5C06\u53D1\u8D77\u90AE\u4EF6\u901A\u77E5');
                          resolve('\u722C\u53D6\u5931\u8D25\uFF0C\u91CD\u542F\u6B21\u6570\u4E3A' + (restartCount - 1));

                        case 28:
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
            comingMoviesLink = __webpack_require__(13);
            stagePhotos = [];

            // for(let i = 0; i < comingMoviesLink.length ; i++) {

            i = 0;

          case 3:
            if (!(i < 10)) {
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
/* 28 */
/***/ function(module, exports, __webpack_require__) {

var qiniu = __webpack_require__(38);
var request = __webpack_require__(5);
var crypto = __webpack_require__(33);

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
/* 29 */
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
webpackContext.id = 29;


/***/ },
/* 30 */
/***/ function(module, exports) {

module.exports = require("axios");

/***/ },
/* 31 */
/***/ function(module, exports) {

module.exports = require("bcryptjs");

/***/ },
/* 32 */
/***/ function(module, exports) {

module.exports = require("cheerio");

/***/ },
/* 33 */
/***/ function(module, exports) {

module.exports = require("crypto");

/***/ },
/* 34 */
/***/ function(module, exports) {

module.exports = require("ejs");

/***/ },
/* 35 */
/***/ function(module, exports) {

module.exports = require("koa-router");

/***/ },
/* 36 */
/***/ function(module, exports) {

module.exports = require("node-uuid");

/***/ },
/* 37 */
/***/ function(module, exports) {

module.exports = require("nodemailer");

/***/ },
/* 38 */
/***/ function(module, exports) {

module.exports = require("qiniu");

/***/ },
/* 39 */
/***/ function(module, exports) {

module.exports = require("regenerator-runtime");

/***/ },
/* 40 */
/***/ function(module, exports) {

module.exports = require("request-promise");

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_koa__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_koa___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_koa__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_nuxt__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_nuxt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_nuxt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_node_schedule__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_node_schedule___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_node_schedule__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_koa_session__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_koa_session___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_koa_session__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_koa2_cors__ = __webpack_require__(23);
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

            config = __webpack_require__(15);

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
              rule.minute = 1;
              rule.second = 1;

              __WEBPACK_IMPORTED_MODULE_3_node_schedule___default.a.scheduleJob(rule, function () {
                nodemailer();
                console.log('scheduleRecurrenceRule:' + new Date());
                crawler();
              });
            };
            // crawler()


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





var filmApi = __webpack_require__(19);
var mongodb = __webpack_require__(17);
var bodyParser = __webpack_require__(21);

var crawler = __webpack_require__(16);
var nodemailer = __webpack_require__(18);

start();

/***/ }
/******/ ]);
//# sourceMappingURL=main.map