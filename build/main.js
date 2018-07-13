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

module.exports = [{"movieName":"左滩","releaseDate":["2018-07-07(中国大陆)"],"runtime":["90分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526771176.jpg","id":"30261979","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530505577.49.jpg","id":"1334538"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530505577.49.jpg","id":"1334538"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1478242794.85.jpg","id":"1353007"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1396591"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p43760.jpg","id":"1318647"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1421418443.88.jpg","id":"1329090"}],"like":"87"},{"movieName":"红盾先锋","releaseDate":["2018-07-08(中国大陆)"],"runtime":["83分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2525239221.jpg","id":"26614101","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1371632185.22.jpg","id":"1317043"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p43479.jpg","id":"1318573"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530760435.66.jpg","id":"1396604"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530761947.84.jpg","id":"1396605"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530760661.83.jpg","id":"1396606"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530760836.05.jpg","id":"1396607"}],"like":"64"},{"movieName":"格桑花开的时候","releaseDate":["2018-07-12(中国大陆)"],"runtime":["95分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2481328213.jpg","id":"27053277","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/pKitjH3YSqg8cel_avatar_uploaded1450123261.87.jpg","id":"1353450"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p6UqjsvauI4Ucel_avatar_uploaded1359094991.62.jpg","id":"1326496"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1522153949.53.jpg","id":"1314024"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1515482404.17.jpg","id":"1316331"}],"like":"64"},{"movieName":"邪不压正","releaseDate":["2018-07-13(中国大陆)"],"runtime":["137分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526297221.jpg","id":"26366496","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1517818343.94.jpg","id":"1021999"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1517818343.94.jpg","id":"1021999"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1368156632.65.jpg","id":"1013782"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1454644679.84.jpg","id":"1007401"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p12653.jpg","id":"1037851"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1485778268.65.jpg","id":"1005268"}],"like":"74877"},{"movieName":"阿修罗","releaseDate":["2018-07-13(中国大陆)"],"runtime":["141分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2525586876.jpg","id":"26746958","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1457956936.96.jpg","id":"1307141"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1513308156.39.jpg","id":"1276150"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p746.jpg","id":"1118167"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1411832447.57.jpg","id":"1036905"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1482321171.27.jpg","id":"1363975"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1466151868.26.jpg","id":"1317068"}],"like":"2922"},{"movieName":"海龙屯","releaseDate":["2018-07-13(中国大陆)"],"runtime":["81分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526781302.jpg","id":"27114204","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/pXpJ5LJKEjV8cel_avatar_uploaded1525266396.64.jpg","id":"1392260"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/pXpJ5LJKEjV8cel_avatar_uploaded1524940524.2.jpg","id":"1392204"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/pXpJ5LJKEjV8cel_avatar_uploaded1524810124.35.jpg","id":"1392109"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/pXpJ5LJKEjV8cel_avatar_uploaded1524674393.71.jpg","id":"1392027"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/pXpJ5LJKEjV8cel_avatar_uploaded1524551352.55.jpg","id":"1391896"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/pXpJ5LJKEjV8cel_avatar_uploaded1524674622.82.jpg","id":"1392028"}],"like":"282"},{"movieName":"铁笼","releaseDate":["2018-07-13(中国大陆)"],"runtime":["105分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2520206852.jpg","id":"30203509","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1524564529.09.jpg","id":"1334489"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1524564529.09.jpg","id":"1334489"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1467042391.39.jpg","id":"1356780"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1524564988.73.jpg","id":"1391855"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1524565053.17.jpg","id":"1391857"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1524571440.11.jpg","id":"1391858"}],"like":"226"},{"movieName":"美丽童年","releaseDate":["2018-07-13(中国大陆)"],"runtime":["90分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2504516292.jpg","id":"27194322","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1521622071.23.jpg","id":"1365701"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1360362613.71.jpg","id":"1318030"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1494832042.34.jpg","id":"1316038"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p18432.jpg","id":"1313513"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1361007011.88.jpg","id":"1320875"}],"like":"61"},{"movieName":"天佑之爱","releaseDate":["2018-07-13(中国大陆)"],"runtime":["95分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2525119399.jpg","id":"30249257","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530240310.04.jpg","id":"1357663"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p20155.jpg","id":"1313756"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1405675967.09.jpg","id":"1326385"}],"like":"8"},{"movieName":"小悟空","releaseDate":["2018-07-14(中国大陆)"],"runtime":["85分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2526767688.jpg","id":"30227725","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1396597"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1396598"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1051611"}],"like":"48"},{"movieName":"八只鸡","releaseDate":["2018-07-19(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2525715533.jpg","id":"30252555","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1529912784.88.jpg","id":"1396214"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1529912770.04.jpg","id":"1396215"}],"like":"217"},{"movieName":"摩天营救 Skyscraper","releaseDate":["2018-07-20(中国大陆)","2018-07-13(美国)"],"runtime":["102分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2526241189.jpg","id":"26804147","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1377869988.64.jpg","id":"1005149"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p196.jpg","id":"1044707"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p13115.jpg","id":"1027828"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p23588.jpg","id":"1036774"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1460407814.98.jpg","id":"1334238"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1417086901.1.jpg","id":"1049775"}],"like":"4850"},{"movieName":"风语咒","releaseDate":["2018-07-20(中国大陆)"],"runtime":["105分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526402162.jpg","id":"30146756","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1501141090.9.jpg","id":"1364166"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1370588849.4.jpg","id":"1329887"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1478049229.21.jpg","id":"1340811"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1522323624.45.jpg","id":"1390805"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1522323576.31.jpg","id":"1339972"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1398540567.14.jpg","id":"1334349"}],"like":"3569"},{"movieName":"北方一片苍茫","releaseDate":["2018-07-20(中国大陆)","2017-07-23(FIRST青年影展)"],"runtime":["105分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526309612.jpg","id":"27079318","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/f/movie/14960825e118267b5857fc0ae9f306ef8c74da8f/pics/movie/has_douban@2x.png","id":"1376541"},{"actorImg":"https://img3.doubanio.com/f/movie/14960825e118267b5857fc0ae9f306ef8c74da8f/pics/movie/has_douban@2x.png","id":"1377028"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1378150"}],"like":"2754"},{"movieName":"淘气大侦探 Sherlock Gnomes","releaseDate":["2018-07-20(中国大陆)","2018-03-23(美国)","2018-05-11(英国)"],"runtime":["86分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2525848479.jpg","id":"26660063","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p34350.jpg","id":"1298420"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p93.jpg","id":"1006958"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p21481.jpg","id":"1041022"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p562.jpg","id":"1054456"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p9322.jpg","id":"1010581"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p16450.jpg","id":"1014134"}],"like":"808"},{"movieName":"玛雅蜜蜂历险记 Maya the Bee Movie","releaseDate":["2018-07-20(中国大陆)","2014-09-11(德国)"],"runtime":["78分钟(法国)"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2234785674.jpg","id":"25881500","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1298221"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1354128837.83.jpg","id":"1248592"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1417086901.1.jpg","id":"1049775"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1404.jpg","id":"1013865"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33207.jpg","id":"1048191"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p21519.jpg","id":"1161151"}],"like":"626"},{"movieName":"兄弟班","releaseDate":["2018-07-20(中国大陆)","2018-07-13(香港)"],"runtime":["102分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526213923.jpg","id":"26988003","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1921.jpg","id":"1028948"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1485327861.41.jpg","id":"1275972"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1401776151.3.jpg","id":"1340458"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1416749516.7.jpg","id":"1337843"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1392320"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p35235.jpg","id":"1316133"}],"like":"308"},{"movieName":"午夜幽灵","releaseDate":["2018-07-20(中国大陆)"],"runtime":["81分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2516906655.jpg","id":"30128986","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1499243527.29.jpg","id":"1376582"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1394899519.58.jpg","id":"1275029"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1522810252.53.jpg","id":"1391102"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1522810175.11.jpg","id":"1337900"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1495528480.16.jpg","id":"1374307"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1527750676.4.jpg","id":"1349852"}],"like":"268"},{"movieName":"汪星卧底 Show Dogs","releaseDate":["2018-07-20(中国大陆)","2018-05-18(美国)"],"runtime":["92分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526399205.jpg","id":"26930056","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p5860.jpg","id":"1036533"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p7197.jpg","id":"1044709"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1373705281.63.jpg","id":"1049714"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p26071.jpg","id":"1040517"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p22552.jpg","id":"1000096"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1976.jpg","id":"1006980"}],"like":"254"},{"movieName":"深海历险记","releaseDate":["2018-07-20(中国大陆)"],"runtime":["95分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2521788585.jpg","id":"30176525","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1527581010.4.jpg","id":"1392567"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1526874160.87.jpg","id":"1340111"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1526874126.05.jpg","id":"1333856"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1526874097.46.jpg","id":"1392570"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1526874182.49.jpg","id":"1392571"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1478051011.64.jpg","id":"1325740"}],"like":"98"},{"movieName":"闺蜜的战争","releaseDate":["2018-07-20(中国大陆)"],"runtime":["93分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526892933.jpg","id":"30262110","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1381901"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1396594"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1396595"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1396596"}],"like":"9"},{"movieName":"产科男生","releaseDate":["2018-07-20(中国大陆)"],"runtime":[],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2500497339.jpg","id":"27158277","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1406089479.1.jpg","id":"1341569"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1473682330.23.jpg","id":"1334215"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1512035444.96.jpg","id":"1318068"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1493973240.99.jpg","id":"1373273"}],"like":"7"},{"movieName":"狄仁杰之四大天王","releaseDate":["2018-07-27(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526405034.jpg","id":"25882296","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1393840734.39.jpg","id":"1007152"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p30529.jpg","id":"1274608"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p36925.jpg","id":"1275721"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1398676888.79.jpg","id":"1314535"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1477464497.27.jpg","id":"1275243"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1411832447.57.jpg","id":"1036905"}],"like":"26631"},{"movieName":"西虹市首富","releaseDate":["2018-07-27(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2525046210.jpg","id":"27605698","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1437030925.47.jpg","id":"1350410"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1437031053.5.jpg","id":"1350409"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1356510694.28.jpg","id":"1325700"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1446281965.79.jpg","id":"1341903"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1413261818.41.jpg","id":"1322777"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p11764.jpg","id":"1275270"}],"like":"13530"},{"movieName":"昨日青空","releaseDate":["2018-07-27(中国大陆)"],"runtime":[],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2516062089.jpg","id":"26290410","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1501816663.13.jpg","id":"1378560"}],"like":"11783"},{"movieName":"神奇马戏团之动物饼干 Magical Circus : Animal Crackers","releaseDate":["2018-07-27(中国大陆)","2017-06-12(安锡动画电影节)"],"runtime":["94分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2524820126.jpg","id":"26253783","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1500617178.26.jpg","id":"1277815"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1500623271.8.jpg","id":"1206807"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p21481.jpg","id":"1041022"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1452855116.89.jpg","id":"1027146"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1453792417.87.jpg","id":"1054410"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p262.jpg","id":"1047996"}],"like":"2397"},{"movieName":"解剖室灵异事件之男生宿舍","releaseDate":["2018-07-27(中国大陆)"],"runtime":["85分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526907635.jpg","id":"30263334","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530671589.15.jpg","id":"1359886"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530691884.75.jpg","id":"1381517"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530691898.16.jpg","id":"1396684"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530691908.88.jpg","id":"1396685"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530691923.06.jpg","id":"1396686"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530691934.78.jpg","id":"1396687"}],"like":"15"},{"movieName":"萌学园：寻找盘古","releaseDate":["2018-08-03(中国大陆)","2016-06-24(台湾)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2351198115.jpg","id":"26754880","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1414259750.1.jpg","id":"1342627"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/pbA7b3PGSjgMcel_avatar_uploaded1405244346.25.jpg","id":"1341372"}],"like":"2429"},{"movieName":"解码游戏","releaseDate":["2018-08-03(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2523515546.jpg","id":"26767512","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1521528597.3.jpg","id":"1388759"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1519976356.71.jpg","id":"1275667"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1372773609.01.jpg","id":"1274684"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1439792310.44.jpg","id":"1314374"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p20858.jpg","id":"1000845"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1388979190.01.jpg","id":"1325650"}],"like":"730"},{"movieName":"神秘世界历险记4","releaseDate":["2018-08-03(中国大陆)"],"runtime":["85分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2524334932.jpg","id":"30208005","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1436771114.49.jpg","id":"1321732"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1528456334.7.jpg","id":"1395143"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1392959"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1526278703.48.jpg","id":"1340809"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1439298716.36.jpg","id":"1343032"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1478051011.64.jpg","id":"1325740"}],"like":"81"},{"movieName":"肆式青春 詩季織々","releaseDate":["2018-08-04(中国大陆/日本)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526429256.jpg","id":"30156898","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p41706.jpg","id":"1317854"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1470884079.3.jpg","id":"1343518"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p51585.jpg","id":"1275208"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1509958646.03.jpg","id":"1372491"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p3730.jpg","id":"1033762"}],"like":"2078"},{"movieName":"一出好戏","releaseDate":["2018-08-10(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2519710743.jpg","id":"26985127","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1656.jpg","id":"1274242"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1656.jpg","id":"1274242"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1268.jpg","id":"1138320"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1356403251.95.jpg","id":"1274388"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1421061916.72.jpg","id":"1338949"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1365451897.03.jpg","id":"1313742"}],"like":"19977"},{"movieName":"爱情公寓","releaseDate":["2018-08-10(中国大陆)"],"runtime":["115分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2521648155.jpg","id":"24852545","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1526270943.26.jpg","id":"1313918"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1420296836.46.jpg","id":"1313841"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1359911910.82.jpg","id":"1313784"},{"actorImg":"https://img3.doubanio.com/f/movie/14960825e118267b5857fc0ae9f306ef8c74da8f/pics/movie/has_douban@2x.png","id":"1274361"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1413815568.5.jpg","id":"1313842"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p32405.jpg","id":"1313030"}],"like":"11209"},{"movieName":"巨齿鲨","releaseDate":["2018-08-10(美国/中国大陆)"],"runtime":["113分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522867936.jpg","id":"26426194","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1379831737.28.jpg","id":"1022710"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p424.jpg","id":"1049484"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p37168.jpg","id":"1040990"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p9747.jpg","id":"1004593"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1437836004.32.jpg","id":"1344655"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p13912.jpg","id":"1018759"}],"like":"4561"},{"movieName":"美食大冒险之英雄烩","releaseDate":["2018-08-10(中国大陆)"],"runtime":["90分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2523685087.jpg","id":"26290398","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/pnSS497gRZs0cel_avatar_uploaded1520596328.84.jpg","id":"1389867"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1523420388.1.jpg","id":"1391413"}],"like":"220"},{"movieName":"勇者闯魔城","releaseDate":["2018-08-10(中国大陆)"],"runtime":["80分钟"],"postPic":"https://img3.doubanio.com/f/movie/30c6263b6db26d055cbbe73fe653e29014142ea3/pics/movie/movie_default_large.png","id":"30125089","actorAddMsg":[],"like":"104"},{"movieName":"大轰炸","releaseDate":["2018-08-17(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526981761.jpg","id":"26331700","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p55191.jpg","id":"1323070"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1525674287.43.jpg","id":"1000572"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p106.jpg","id":"1010509"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p58139.jpg","id":"1028283"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1409055274.95.jpg","id":"1275970"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1120.jpg","id":"1051526"}],"like":"5107"},{"movieName":"如影随心","releaseDate":["2018-08-17(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2521804753.jpg","id":"26871669","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p2187.jpg","id":"1006351"},{"actorImg":"https://img3.doubanio.com/f/movie/14960825e118267b5857fc0ae9f306ef8c74da8f/pics/movie/has_douban@2x.png","id":"1325412"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1368850348.93.jpg","id":"1323516"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1501833870.86.jpg","id":"1367682"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1376103579.93.jpg","id":"1275459"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1501058214.75.jpg","id":"1322856"}],"like":"3631"},{"movieName":"快把我哥带走","releaseDate":["2018-08-17(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2524963561.jpg","id":"30122633","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p13508.jpg","id":"1276077"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1465826349.1.jpg","id":"1274254"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1523448357.59.jpg","id":"1354775"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1450954931.7.jpg","id":"1337036"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1521533180.63.jpg","id":"1390023"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1521008071.63.jpg","id":"1390025"}],"like":"3568"},{"movieName":"未来机器城","releaseDate":["2018-08-17(中国大陆)"],"runtime":["90分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526130265.jpg","id":"27200988","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1308172"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1392324"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1381744526.75.jpg","id":"1043136"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p18124.jpg","id":"1274430"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1466089000.89.jpg","id":"1276048"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33797.jpg","id":"1049521"}],"like":"706"},{"movieName":"大师兄 大師兄","releaseDate":["2018-08-17(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2505282016.jpg","id":"27201353","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1509265076.8.jpg","id":"1360179"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p10695.jpg","id":"1025194"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1352270627.38.jpg","id":"1022095"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1410928316.73.jpg","id":"1339113"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1498315032.73.jpg","id":"1375963"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1339998"}],"like":"424"},{"movieName":"最后的棒棒","releaseDate":["2018-08-17(中国大陆)"],"runtime":["98分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2525855331.jpg","id":"30254589","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1529657375.78.jpg","id":"1396140"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1396211"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1396212"}],"like":"421"},{"movieName":"他是一只狗","releaseDate":["2018-08-17(中国大陆)"],"runtime":[],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2524690349.jpg","id":"30246086","actorAddMsg":[],"like":"63"},{"movieName":"冷恋时代","releaseDate":["2018-08-17(中国大陆)"],"runtime":["90分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2526398939.jpg","id":"24743257","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1503476493.41.jpg","id":"1322330"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p58546.jpg","id":"1318516"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p13748.jpg","id":"1276163"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1434427963.93.jpg","id":"1319717"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1414312569.2.jpg","id":"1342368"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p51762.jpg","id":"1275781"}],"like":"26"},{"movieName":"大三儿","releaseDate":["2018-08-20(中国大陆)","2018-04-08(北京电影节)"],"runtime":["102分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2524686802.jpg","id":"27119292","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1524120551.67.jpg","id":"1331818"}],"like":"1162"},{"movieName":"反贪风暴3 L風暴","releaseDate":["2018-08-24(中国大陆)"],"runtime":["100分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2523433444.jpg","id":"26996640","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1357529568.73.jpg","id":"1326068"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1421047436.79.jpg","id":"1027577"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1241.jpg","id":"1050979"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p40550.jpg","id":"1274666"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p2292.jpg","id":"1028496"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1527573820.78.jpg","id":"1384345"}],"like":"2837"},{"movieName":"七袋米 Pitong kabang palay","releaseDate":["2018-08-24(中国大陆)","2016-07(菲律宾)"],"runtime":["103分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2523428620.jpg","id":"26881698","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1394717"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1528361630.29.jpg","id":"1394718"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1528361668.38.jpg","id":"1394719"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1528361702.91.jpg","id":"1394720"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1528361720.33.jpg","id":"1394721"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1528361756.85.jpg","id":"1394722"}],"like":"406"},{"movieName":"让我怎么相信你","releaseDate":["2018-08-24(中国大陆)","2018-06-20(上海电影节)"],"runtime":["88分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2524057566.jpg","id":"30199575","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/pmdyYPIz8xBscel_avatar_uploaded1527923692.92.jpg","id":"1394911"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1528357105.88.jpg","id":"1346401"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1399.jpg","id":"1222588"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1527852100.54.jpg","id":"1313920"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1494494152.36.jpg","id":"1351426"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1420531092.61.jpg","id":"1274496"}],"like":"234"},{"movieName":"道高一丈","releaseDate":["2018-08-24(中国大陆)"],"runtime":["96分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2525075944.jpg","id":"26954268","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1464595053.55.jpg","id":"1317408"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1357005509.65.jpg","id":"1275718"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p39183.jpg","id":"1275687"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1417604913.76.jpg","id":"1274777"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1369806599.49.jpg","id":"1318978"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1406964972.04.jpg","id":"1326513"}],"like":"158"},{"movieName":"有五个姐姐的我就注定要单身了啊 有五個姊姊的我就註定要單身了啊","releaseDate":["2018-08-24(中国大陆)"],"runtime":[],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2519791239.jpg","id":"26730542","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1331670"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1522551410.18.jpg","id":"1373191"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1376227056.66.jpg","id":"1318348"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1416549123.09.jpg","id":"1341901"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1509074934.53.jpg","id":"1383284"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1458219561.78.jpg","id":"1353627"}],"like":"74"},{"movieName":"惊慌失色之诡寓","releaseDate":["2018-08-24(中国大陆)"],"runtime":["86分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2523962446.jpg","id":"30237381","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1394486"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1350835"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1528086993.26.jpg","id":"1394582"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1528086884.46.jpg","id":"1373521"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1505265692.06.jpg","id":"1350833"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1394583"}],"like":"32"},{"movieName":"天下第一镖局","releaseDate":["2018-08-24(中国大陆)"],"runtime":["90分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526984156.jpg","id":"27107604","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1384965537.89.jpg","id":"1018257"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p25114.jpg","id":"1314603"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p4821.jpg","id":"1202926"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530090433.64.jpg","id":"1396262"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1528201576.47.jpg","id":"1037706"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p40376.jpg","id":"1317555"}],"like":"27"},{"movieName":"旅行吧！井底之蛙","releaseDate":["2018-08-25(中国大陆)"],"runtime":["78分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2526253237.jpg","id":"30236775","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1522123651.83.jpg","id":"1390460"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1470558117.44.jpg","id":"1348775"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1470557893.97.jpg","id":"1360698"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1527751472.33.jpg","id":"1388593"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1527751377.68.jpg","id":"1394465"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1527751449.93.jpg","id":"1388594"}],"like":"61"},{"movieName":"蚁人2：黄蜂女现身 Ant-Man and the Wasp","releaseDate":["2018-08(中国大陆)","2018-07-06(美国)"],"runtime":["118分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2520805931.jpg","id":"26636712","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p38984.jpg","id":"1009586"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1501385708.56.jpg","id":"1002667"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p4077.jpg","id":"1021963"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p4023.jpg","id":"1053620"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1454118774.76.jpg","id":"1131634"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1519057306.8.jpg","id":"1350528"}],"like":"38848"},{"movieName":"我，花样女王 I, Tonya","releaseDate":["2018-08(中国大陆)","2017-09-08(多伦多电影节)","2017-12-08(美国)"],"runtime":["120分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2508862676.jpg","id":"26756049","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p28271.jpg","id":"1284873"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1389939796.3.jpg","id":"1272303"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1359893856.03.jpg","id":"1021985"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1411307204.54.jpg","id":"1041139"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1407320473.63.jpg","id":"1341943"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1476733537.95.jpg","id":"1340538"}],"like":"38356"},{"movieName":"碟中谍6：全面瓦解 Mission: Impossible - Fallout","releaseDate":["2018-08(中国大陆)","2018-07-27(美国)"],"runtime":["147分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522117711.jpg","id":"26336252","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p52867.jpg","id":"1276314"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p567.jpg","id":"1054435"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1371934661.95.jpg","id":"1044713"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p31209.jpg","id":"1035648"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1376924506.04.jpg","id":"1088314"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p8712.jpg","id":"1048129"}],"like":"26884"},{"movieName":"镰仓物语 DESTINY 鎌倉ものがたり","releaseDate":["2018-08(中国大陆)","2017-12-09(日本)"],"runtime":["129分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2500030418.jpg","id":"26916229","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p53321.jpg","id":"1301398"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1353675638.54.jpg","id":"1028795"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1416788895.28.jpg","id":"1330848"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p4033.jpg","id":"1151079"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1442220877.34.jpg","id":"1274350"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p3595.jpg","id":"1008191"}],"like":"24056"},{"movieName":"影","releaseDate":["2018-08(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2515014752.jpg","id":"4864908","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p568.jpg","id":"1054398"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p805.jpg","id":"1274235"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1415690807.36.jpg","id":"1004856"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1366015827.84.jpg","id":"1275564"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1445948736.67.jpg","id":"1314827"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p12560.jpg","id":"1275934"}],"like":"22177"},{"movieName":"边境杀手2：边境战士 Sicario: Day of the Soldado","releaseDate":["2018-08(中国大陆)","2018-06-29(美国)"],"runtime":["122分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2518403013.jpg","id":"26627736","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1454133807.34.jpg","id":"1046134"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1395662512.69.jpg","id":"1041005"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1413615170.39.jpg","id":"1004568"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1497256004.65.jpg","id":"1356047"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p4291.jpg","id":"1002681"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1398675502.01.jpg","id":"1044732"}],"like":"8773"},{"movieName":"营救汪星人","releaseDate":["2018-08(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2514930111.jpg","id":"26930565","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1525839636.26.jpg","id":"1323397"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1493024739.47.jpg","id":"1323398"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1477019562.2.jpg","id":"1363049"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p45672.jpg","id":"1274279"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1494494152.36.jpg","id":"1351426"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p39566.jpg","id":"1317360"}],"like":"5874"},{"movieName":"找到你","releaseDate":["2018-08(中国大陆)","2018-06-17(上海电影节)"],"runtime":["102分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2520354941.jpg","id":"27140071","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1356503267.54.jpg","id":"1274303"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1525664924.95.jpg","id":"1029395"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1415523283.1.jpg","id":"1011935"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p6464.jpg","id":"1274820"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1461753133.52.jpg","id":"1357212"},{"actorImg":"https://img3.doubanio.com/f/movie/14960825e118267b5857fc0ae9f306ef8c74da8f/pics/movie/has_douban@2x.png","id":"1350899"}],"like":"5009"},{"movieName":"断片之险途夺宝","releaseDate":["2018-08(中国大陆)"],"runtime":["114分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2410379359.jpg","id":"26882457","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/pbYO4zDByocwcel_avatar_uploaded1352024636.33.jpg","id":"1324612"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p46.jpg","id":"1000905"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p40756.jpg","id":"1317663"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p5908.jpg","id":"1016663"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p35594.jpg","id":"1041425"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33945.jpg","id":"1315866"}],"like":"3376"},{"movieName":"新乌龙院之笑闹江湖","releaseDate":["2018-08(中国大陆)"],"runtime":["90分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522238376.jpg","id":"26309969","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p11221.jpg","id":"1275412"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p45481.jpg","id":"1016771"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p22359.jpg","id":"1314167"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p7559.jpg","id":"1051995"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1528939891.56.jpg","id":"1314704"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1161.jpg","id":"1002862"}],"like":"2310"},{"movieName":"墨多多谜境冒险","releaseDate":["2018-08(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526874732.jpg","id":"26790960","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1369623581.05.jpg","id":"1274891"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p44442.jpg","id":"1274463"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p39129.jpg","id":"1312846"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1521978406.32.jpg","id":"1390572"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1511444597.51.jpg","id":"1384585"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1362390143.98.jpg","id":"1327150"}],"like":"2289"},{"movieName":"沉默的证人","releaseDate":["2018-08(中国大陆)"],"runtime":["100分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2516301647.jpg","id":"26816090","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p21181.jpg","id":"1032052"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1376548148.48.jpg","id":"1037273"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1417797081.77.jpg","id":"1314124"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1549.jpg","id":"1009888"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1412521526.46.jpg","id":"1336802"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1466151868.26.jpg","id":"1317068"}],"like":"2283"},{"movieName":"武林怪兽","releaseDate":["2018-08(中国大陆)"],"runtime":[],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2455072699.jpg","id":"26425062","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1403267018.07.jpg","id":"1106979"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1421047436.79.jpg","id":"1027577"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p36798.jpg","id":"1274224"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1379398896.7.jpg","id":"1274514"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1508145845.01.jpg","id":"1326363"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33945.jpg","id":"1315866"}],"like":"1975"},{"movieName":"真相漩涡 Spinning Man","releaseDate":["2018-08(中国大陆)","2018-04-06(美国)"],"runtime":["100分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2512974718.jpg","id":"26792540","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1406542915.18.jpg","id":"1341723"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p381.jpg","id":"1035672"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p50837.jpg","id":"1031219"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p8623.jpg","id":"1004602"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1410851175.5.jpg","id":"1325214"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1398762158.38.jpg","id":"1000083"}],"like":"1816"},{"movieName":"苏丹 Sultan","releaseDate":["2018-08(中国大陆)","2016-07-06(印度)"],"runtime":["170分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2333456991.jpg","id":"26728641","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1502246478.77.jpg","id":"1378742"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1355291691.29.jpg","id":"1017831"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1431791068.5.jpg","id":"1045145"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1423050954.69.jpg","id":"1338529"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1470195430.05.jpg","id":"1360638"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1374665647.99.jpg","id":"1159033"}],"like":"1660"},{"movieName":"跨越8年的新娘 8年越しの花嫁","releaseDate":["2018-08(中国大陆)","2017-12-16(日本)"],"runtime":["119分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2462852467.jpg","id":"26929835","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p25432.jpg","id":"1314621"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1419865642.6.jpg","id":"1227580"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1406782114.56.jpg","id":"1315335"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p41099.jpg","id":"1012650"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p35122.jpg","id":"1316095"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1437115194.03.jpg","id":"1274749"}],"like":"1569"},{"movieName":"李宗伟：败者为王 Lee Chong Wei","releaseDate":["2018-08(中国大陆)","2018-03-15(马来西亚)"],"runtime":["110分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522263011.jpg","id":"27195119","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1526456206.64.jpg","id":"1393204"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1379318065.51.jpg","id":"1329095"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p29018.jpg","id":"1315164"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1526456247.61.jpg","id":"1393209"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1526456260.4.jpg","id":"1393205"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1526456271.99.jpg","id":"1393206"}],"like":"437"},{"movieName":"黑脸大包公之西夏风云","releaseDate":["2018-08(中国大陆)"],"runtime":["86分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2504373922.jpg","id":"27192660","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1383834"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1383840"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1383841"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1500536967.48.jpg","id":"1377697"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1383842"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1383843"}],"like":"193"},{"movieName":"幸福魔咒","releaseDate":["2018-08(中国大陆)"],"runtime":[],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2510207097.jpg","id":"27661975","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1496730965.95.jpg","id":"1316775"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p5945.jpg","id":"1274683"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p36712.jpg","id":"1316540"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1405392244.19.jpg","id":"1274530"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1474121308.86.jpg","id":"1362292"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1496901561.89.jpg","id":"1315506"}],"like":"62"},{"movieName":"阿里巴巴三根金发","releaseDate":["2018-08(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2518648744.jpg","id":"30176069","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1505789251.02.jpg","id":"1361983"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1374403"}],"like":"54"},{"movieName":"纯真年代","releaseDate":["2018-08(中国大陆)"],"runtime":["96分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526941471.jpg","id":"30263969","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530698566.26.jpg","id":"1396695"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530783838.83.jpg","id":"1396714"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530783851.24.jpg","id":"1396715"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530783864.46.jpg","id":"1396716"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530783898.4.jpg","id":"1396717"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530783914.94.jpg","id":"1396718"}],"like":"7"},{"movieName":"黑暗深处之惊魂夜","releaseDate":["2018-09-07(中国大陆)"],"runtime":["90分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2527065014.jpg","id":"30259493","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530504979.28.jpg","id":"1396470"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530504990.63.jpg","id":"1396471"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530505004.77.jpg","id":"1396472"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530505016.06.jpg","id":"1389869"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530505026.31.jpg","id":"1396473"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530505037.92.jpg","id":"1395439"}],"like":"15"},{"movieName":"恩师","releaseDate":["2018-09-10(中国大陆)"],"runtime":["89分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2525580687.jpg","id":"30215191","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1440682814.43.jpg","id":"1342632"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1502082490.27.jpg","id":"1329886"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1525685444.12.jpg","id":"1392430"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1525685466.03.jpg","id":"1326947"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1342633"}],"like":"55"},{"movieName":"勇敢往事","releaseDate":["2018-09-12(中国大陆)","2018-06-18(上海电影节)"],"runtime":["91分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2524173793.jpg","id":"27191430","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/pGpynvK44y08cel_avatar_uploaded1397876393.45.jpg","id":"1339798"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p37025.jpg","id":"1316634"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1522824500.67.jpg","id":"1391127"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1522824518.67.jpg","id":"1391128"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1522824531.04.jpg","id":"1391129"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1522824542.87.jpg","id":"1391130"}],"like":"22"},{"movieName":"江湖儿女","releaseDate":["2018-09-21(中国大陆)","2018-05-11(戛纳电影节)"],"runtime":["141分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522902491.jpg","id":"26972258","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p38530.jpg","id":"1274261"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1448114660.11.jpg","id":"1005985"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1454644679.84.jpg","id":"1007401"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p43738.jpg","id":"1274297"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1391457"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p45667.jpg","id":"1274255"}],"like":"20163"},{"movieName":"一生有你","releaseDate":["2018-09-21(中国大陆)"],"runtime":[],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2525580888.jpg","id":"26263417","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1381379959.04.jpg","id":"1326070"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p35791.jpg","id":"1023236"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1447243509.27.jpg","id":"1352794"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1474118243.45.jpg","id":"1362288"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1495034924.47.jpg","id":"1350870"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1455955256.83.jpg","id":"1354821"}],"like":"718"},{"movieName":"禹神传之寻找神力","releaseDate":["2018-09-22(中国大陆)"],"runtime":["80分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2526149718.jpg","id":"30227727","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1518344540.18.jpg","id":"1359918"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1470558117.44.jpg","id":"1348775"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1470557893.97.jpg","id":"1360698"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1527751472.33.jpg","id":"1388593"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1527751449.93.jpg","id":"1388594"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1470558219.66.jpg","id":"1360699"}],"like":"15"},{"movieName":"李茶的姑妈","releaseDate":["2018-09-30(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2512975871.jpg","id":"27092785","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1519453974.12.jpg","id":"1313050"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1519453932.46.jpg","id":"1363857"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1437031126.82.jpg","id":"1350408"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1437031175.04.jpg","id":"1350407"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1501497925.32.jpg","id":"1018743"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1388864"}],"like":"2524"},{"movieName":"无双","releaseDate":["2018-09-30(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522375910.jpg","id":"26425063","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p3555.jpg","id":"1014716"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p35678.jpg","id":"1044899"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p49475.jpg","id":"1041390"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p146.jpg","id":"1016668"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1358427208.9.jpg","id":"1274268"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1407300415.4.jpg","id":"1316330"}],"like":"1606"},{"movieName":"云南虫谷","releaseDate":["2018-09-30(中国大陆)"],"runtime":[],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2522870928.jpg","id":"26744597","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1458028959.79.jpg","id":"1320824"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p43387.jpg","id":"1318565"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p38096.jpg","id":"1316959"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1477461192.41.jpg","id":"1363813"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1505111449.77.jpg","id":"1196361"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1364787307.66.jpg","id":"1327671"}],"like":"1379"},{"movieName":"胖子行动队","releaseDate":["2018-09-30(中国大陆)"],"runtime":[],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2526215398.jpg","id":"27149818","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33945.jpg","id":"1315866"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33945.jpg","id":"1315866"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p28063.jpg","id":"1011513"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1412521526.46.jpg","id":"1336802"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1518619619.57.jpg","id":"1362516"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1453177080.67.jpg","id":"1354144"}],"like":"738"},{"movieName":"山2 Dağ II","releaseDate":["2018-09(中国大陆)","2016-11-04(土耳其)"],"runtime":["135分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2448817847.jpg","id":"26911450","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/pkdBC0cV6tj8cel_avatar_uploaded1506859687.11.jpg","id":"1382097"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1507800193.01.jpg","id":"1382434"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1507701205.25.jpg","id":"1273514"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1507800335.78.jpg","id":"1382436"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1507800453.64.jpg","id":"1382438"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1507800545.89.jpg","id":"1308974"}],"like":"18700"},{"movieName":"护垫侠 Padman","releaseDate":["2018-09(中国大陆)","2018-01-26(印度)"],"runtime":["140分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2504951544.jpg","id":"27198855","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1373516277.14.jpg","id":"1311506"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p14444.jpg","id":"1049615"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1486452827.09.jpg","id":"1329473"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1402744446.01.jpg","id":"1018143"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p9190.jpg","id":"1027845"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1526445187.47.jpg","id":"1249316"}],"like":"6443"},{"movieName":"阳台上","releaseDate":["2018-09(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2519517034.jpg","id":"27135473","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p21865.jpg","id":"1314120"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p36798.jpg","id":"1274224"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1505964712.56.jpg","id":"1381513"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/pJqFKOp0wuJwcel_avatar_uploaded1404111897.49.jpg","id":"1341082"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1505269082.68.jpg","id":"1381118"}],"like":"6159"},{"movieName":"苦行僧的非凡旅程 The Extraordinary Journey of The Fakir","releaseDate":["2018-09(中国大陆)","2018-05-30(法国)"],"runtime":["92分钟"],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2516475337.jpg","id":"26715965","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p57371.jpg","id":"1323854"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1416058853.23.jpg","id":"1219536"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1355595790.83.jpg","id":"1126302"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p34849.jpg","id":"1009461"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1384941323.0.jpg","id":"1335066"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1385629339.13.jpg","id":"1170187"}],"like":"785"},{"movieName":"大闹西游","releaseDate":["2018-09(中国大陆)"],"runtime":[],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2512988248.jpg","id":"30142649","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1369032514.95.jpg","id":"1329113"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1499434683.64.jpg","id":"1349113"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1369203853.42.jpg","id":"1326543"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1471106505.38.jpg","id":"1350677"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1503366049.06.jpg","id":"1328394"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1388537"}],"like":"547"},{"movieName":"阴阳师","releaseDate":["2018-10-01(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2436898714.jpg","id":"26935283","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p19498.jpg","id":"1313669"}],"like":"6402"},{"movieName":"阿凡提之奇缘历险","releaseDate":["2018-10-01(中国大陆)"],"runtime":["85分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526210014.jpg","id":"30208004","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1349855"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1498555461.54.jpg","id":"1328393"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1498555670.36.jpg","id":"1326522"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1501515009.39.jpg","id":"1318536"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p37509.jpg","id":"1316809"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1330934"}],"like":"73"},{"movieName":"灵魂的救赎","releaseDate":["2018-10-12(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526119633.jpg","id":"27620911","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1371632185.22.jpg","id":"1317043"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1371453539.51.jpg","id":"1317139"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p35292.jpg","id":"1316146"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1519951488.42.jpg","id":"1382061"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/pWg5B9JBiCeQcel_avatar_uploaded1414614307.33.jpg","id":"1344390"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1519951547.81.jpg","id":"1333286"}],"like":"21"},{"movieName":"功夫联盟","releaseDate":["2018-10-19(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2525765766.jpg","id":"27008394","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p45374.jpg","id":"1274431"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p44857.jpg","id":"1000526"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p41268.jpg","id":"1045364"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1437726752.75.jpg","id":"1229775"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p34636.jpg","id":"1315999"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1svtif7x5Hccel_avatar_uploaded1470896151.19.jpg","id":"1360986"}],"like":"884"},{"movieName":"过往的梦","releaseDate":["2018-11-11(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2514658323.jpg","id":"27107609","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1394899519.58.jpg","id":"1275029"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1501640573.19.jpg","id":"1366630"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1453176880.94.jpg","id":"1339970"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1527234581.35.jpg","id":"1376830"}],"like":"30"},{"movieName":"银魂2 銀魂2 掟は破るためにこそある","releaseDate":["2018-11(中国大陆)","2018-08-17(日本)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2527126044.jpg","id":"27199577","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/pFKu5xNiNm4cel_avatar_uploaded1353514889.89.jpg","id":"1325118"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1387002546.12.jpg","id":"1014229"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1402644225.57.jpg","id":"1274418"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1384761261.76.jpg","id":"1322189"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1399275661.42.jpg","id":"1000910"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1452688394.85.jpg","id":"1315730"}],"like":"4325"},{"movieName":"燃点","releaseDate":["2018-11(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2519962021.jpg","id":"27663881","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530675972.76.jpg","id":"1396653"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p34536.jpg","id":"1315626"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530685934.65.jpg","id":"1396674"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530675881.22.jpg","id":"1396652"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1530685950.15.jpg","id":"1396675"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1483779080.74.jpg","id":"1366735"}],"like":"490"},{"movieName":"碟仙实录","releaseDate":["2018-12-08(中国大陆)"],"runtime":["90分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2513010136.jpg","id":"26961483","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1486356015.36.jpg","id":"1338541"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1485166628.86.jpg","id":"1338542"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/pjIjJYvA6dRkcel_avatar_uploaded1395890060.84.jpg","id":"1339425"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1435994595.87.jpg","id":"1349812"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1467122681.57.jpg","id":"1358861"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1467126083.37.jpg","id":"1349813"}],"like":"345"},{"movieName":"素人特工","releaseDate":["2018-12-21(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2520315722.jpg","id":"27155276","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1453166767.25.jpg","id":"1312751"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/pbA7b3PGSjgMcel_avatar_uploaded1404566496.8.jpg","id":"1341187"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p12665.jpg","id":"1226703"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p2431.jpg","id":"1025154"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1461493374.02.jpg","id":"1354503"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1484724639.22.jpg","id":"1367246"}],"like":"417"},{"movieName":"人间·喜剧","releaseDate":["2018-12-28(中国大陆)"],"runtime":[],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2520444307.jpg","id":"27179414","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p35187.jpg","id":"1298649"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1437031126.82.jpg","id":"1350408"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1443582361.31.jpg","id":"1321587"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p50150.jpg","id":"1321098"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p32611.jpg","id":"1275482"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p32971.jpg","id":"1031194"}],"like":"1509"},{"movieName":"阿丽塔：战斗天使 Alita: Battle Angel","releaseDate":["2018-12(中国大陆)","2018-12-21(美国)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2507205345.jpg","id":"1652592","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1378050540.89.jpg","id":"1019016"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1501911452.02.jpg","id":"1342762"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p26974.jpg","id":"1054405"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33305.jpg","id":"1016673"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1370589932.99.jpg","id":"1329130"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1424533850.33.jpg","id":"1004702"}],"like":"11531"},{"movieName":"动物特工局","releaseDate":["2018-12(中国大陆)"],"runtime":["90分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522171412.jpg","id":"30217371","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1506496734.81.jpg","id":"1329011"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1526270284.47.jpg","id":"1392926"}],"like":"597"},{"movieName":"疯狂的外星人","releaseDate":["2019-02-05(中国大陆)"],"runtime":[],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2494085798.jpg","id":"25986662","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/f/movie/14960825e118267b5857fc0ae9f306ef8c74da8f/pics/movie/has_douban@2x.png","id":"1274265"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1656.jpg","id":"1274242"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1356510694.28.jpg","id":"1325700"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1490094314.69.jpg","id":"1211775"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p21564.jpg","id":"1040498"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1501049663.64.jpg","id":"1378072"}],"like":"16064"},{"movieName":"神探蒲松龄之兰若仙踪","releaseDate":["2019-02-05(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2510966061.jpg","id":"27065898","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1454563315.64.jpg","id":"1342236"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p694.jpg","id":"1054531"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p21006.jpg","id":"1259866"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1513674760.63.jpg","id":"1357009"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1425307712.95.jpg","id":"1275324"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p11632.jpg","id":"1275739"}],"like":"1138"},{"movieName":"八仙之各显神通","releaseDate":["2019-02-05(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2359898391.jpg","id":"26277338","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p44277.jpg","id":"1318745"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/pnRg3FudltQkcel_avatar_uploaded1527556010.55.jpg","id":"1394297"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1368697548.88.jpg","id":"1005319"}],"like":"935"},{"movieName":"误入江湖","releaseDate":["2019-02-05(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2520092902.jpg","id":"30187577","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1524465782.06.jpg","id":"1323923"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1460513318.54.jpg","id":"1329637"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1403277374.05.jpg","id":"1274276"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1357290860.44.jpg","id":"1037662"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p43028.jpg","id":"1318482"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1524465841.07.jpg","id":"1366659"}],"like":"453"},{"movieName":"迦百农 كفرناحوم","releaseDate":["2019-02(中国大陆)","2018-05-17(戛纳电影节)"],"runtime":["120分钟"],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522351703.jpg","id":"30170448","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p18917.jpg","id":"1275745"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1395544"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1395545"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p18917.jpg","id":"1275745"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/pa96FEdlJe08cel_avatar_uploaded1526709219.38.jpg","id":"1393813"},{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1395542"}],"like":"3274"},{"movieName":"画皮Ⅲ","releaseDate":["2019-07(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2436898494.jpg","id":"24743117","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p42814.jpg","id":"1053618"}],"like":"5816"},{"movieName":"八仙过海","releaseDate":["2019-07(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/f/movie/30c6263b6db26d055cbbe73fe653e29014142ea3/pics/movie/movie_default_large.png","id":"30226052","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33149.jpg","id":"1274390"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1458020032.08.jpg","id":"1275626"}],"like":"15"},{"movieName":"摸金校尉之九幽将军","releaseDate":["2019-10-01(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2436898546.jpg","id":"26986120","actorAddMsg":[{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1393840734.39.jpg","id":"1007152"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p42814.jpg","id":"1053618"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1403755512.92.jpg","id":"1340983"}],"like":"13158"},{"movieName":"异界 Кома","releaseDate":["2019(中国大陆)","2019-01-24(俄罗斯)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526992740.jpg","id":"30264504","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png","id":"1396691"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/pXZEBgcm0vI4cel_avatar_uploaded1375591876.94.jpg","id":"1332438"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p42585.jpg","id":"1074703"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1486282779.93.jpg","id":"1327850"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1461199081.16.jpg","id":"1354104"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1472093757.86.jpg","id":"1356438"}],"like":"6"},{"movieName":"唐人街探案3","releaseDate":["2020-01-25(中国大陆)"],"runtime":[],"postPic":"https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2517591798.jpg","id":"27619748","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1469073193.92.jpg","id":"1274763"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1473508881.63.jpg","id":"1336305"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1356403251.95.jpg","id":"1274388"},{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1465826349.1.jpg","id":"1274254"},{"actorImg":"https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1473312809.58.jpg","id":"1037028"}],"like":"8267"},{"movieName":"黑色假面","releaseDate":["2020-10-01(中国大陆)"],"runtime":[],"postPic":"https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2437013616.jpg","id":"26986136","actorAddMsg":[{"actorImg":"https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1398689641.61.jpg","id":"1054529"}],"like":"1647"}]

/***/ },
/* 11 */
/***/ function(module, exports) {

module.exports = [{"movieName":"左滩 视频","trailerUri":[],"trailerPoster":[],"id":"30261979"},{"movieName":"红盾先锋 视频","trailerUri":["https://movie.douban.com/trailer/233222/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2526898674.jpg?1530607391"],"id":"26614101"},{"movieName":"格桑花开的时候 视频","trailerUri":[],"trailerPoster":[],"id":"27053277"},{"movieName":"邪不压正 视频","trailerUri":["https://movie.douban.com/trailer/233091/#content","https://movie.douban.com/trailer/232465/#content","https://movie.douban.com/trailer/231013/#content","https://movie.douban.com/trailer/227161/#content","https://movie.douban.com/trailer/231761/#content","https://movie.douban.com/trailer/233038/#content","https://movie.douban.com/trailer/232450/#content","https://movie.douban.com/trailer/232265/#content","https://movie.douban.com/trailer/232248/#content","https://movie.douban.com/trailer/231335/#content","https://movie.douban.com/trailer/233289/#content","https://movie.douban.com/trailer/231861/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2526489612.jpg?1530244322","https://img3.doubanio.com/img/trailer/medium/2525013534.jpg?1528992466","https://img3.doubanio.com/img/trailer/medium/2522243802.jpg?","https://img3.doubanio.com/img/trailer/medium/2512738841.jpg?","https://img3.doubanio.com/img/trailer/medium/2523696800.jpg?","https://img3.doubanio.com/img/trailer/medium/2526407382.jpg?1530242324","https://img3.doubanio.com/img/trailer/medium/2524962313.jpg?1528951170","https://img1.doubanio.com/img/trailer/medium/2524657999.jpg?","https://img3.doubanio.com/img/trailer/medium/2524609792.jpg?1528707165","https://img3.doubanio.com/img/trailer/medium/2522823603.jpg?","https://img3.doubanio.com/img/trailer/medium/2526988612.jpg?1530696697","https://img1.doubanio.com/img/trailer/medium/2523962317.jpg?"],"id":"26366496"},{"movieName":"阿修罗 视频","trailerUri":["https://movie.douban.com/trailer/232634/#content","https://movie.douban.com/trailer/231632/#content","https://movie.douban.com/trailer/228924/#content","https://movie.douban.com/trailer/226282/#content","https://movie.douban.com/trailer/233182/#content","https://movie.douban.com/trailer/233105/#content","https://movie.douban.com/trailer/232862/#content","https://movie.douban.com/trailer/232509/#content","https://movie.douban.com/trailer/230455/#content","https://movie.douban.com/trailer/228116/#content","https://movie.douban.com/trailer/233041/#content","https://movie.douban.com/trailer/232462/#content","https://movie.douban.com/trailer/225457/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2525592709.jpg?","https://img3.doubanio.com/img/trailer/medium/2523447386.jpg?","https://img1.doubanio.com/img/trailer/medium/2516928467.jpg?","https://img1.doubanio.com/img/trailer/medium/2510889309.jpg?","https://img3.doubanio.com/img/trailer/medium/2526779365.jpg?1530511845","https://img3.doubanio.com/img/trailer/medium/2526493784.jpg?1530258754","https://img3.doubanio.com/img/trailer/medium/2526150634.jpg?","https://img3.doubanio.com/img/trailer/medium/2525052874.jpg?","https://img1.doubanio.com/img/trailer/medium/2521047068.jpg?","https://img1.doubanio.com/img/trailer/medium/2515430747.jpg?","https://img1.doubanio.com/img/trailer/medium/2526407977.jpg?1530170168","https://img3.doubanio.com/img/trailer/medium/2524986642.jpg?","https://img3.doubanio.com/img/trailer/medium/2508730944.jpg?"],"id":"26746958"},{"movieName":"海龙屯 视频","trailerUri":["https://movie.douban.com/trailer/233187/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2526782268.jpg?1530514561"],"id":"27114204"},{"movieName":"铁笼 视频","trailerUri":["https://movie.douban.com/trailer/230179/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2520207116.jpg?"],"id":"30203509"},{"movieName":"美丽童年 视频","trailerUri":[],"trailerPoster":[],"id":"27194322"},{"movieName":"天佑之爱 视频","trailerUri":["https://movie.douban.com/trailer/232855/#content","https://movie.douban.com/trailer/232854/#content","https://movie.douban.com/trailer/232853/#content","https://movie.douban.com/trailer/232852/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2526146236.jpg?","https://img1.doubanio.com/img/trailer/medium/2526145227.jpg?","https://img3.doubanio.com/img/trailer/medium/2526145132.jpg?","https://img1.doubanio.com/img/trailer/medium/2526144947.jpg?1529918519"],"id":"30249257"},{"movieName":"小悟空 视频","trailerUri":[],"trailerPoster":[],"id":"30227725"},{"movieName":"八只鸡 视频","trailerUri":["https://movie.douban.com/trailer/233051/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2526427410.jpg?"],"id":"30252555"},{"movieName":"摩天营救 视频","trailerUri":["https://movie.douban.com/trailer/233219/#content","https://movie.douban.com/trailer/233019/#content","https://movie.douban.com/trailer/232978/#content","https://movie.douban.com/trailer/232339/#content","https://movie.douban.com/trailer/231885/#content","https://movie.douban.com/trailer/231474/#content","https://movie.douban.com/trailer/231427/#content","https://movie.douban.com/trailer/231426/#content","https://movie.douban.com/trailer/227160/#content","https://movie.douban.com/trailer/233113/#content","https://movie.douban.com/trailer/232696/#content","https://movie.douban.com/trailer/232471/#content","https://movie.douban.com/trailer/227127/#content","https://movie.douban.com/trailer/233149/#content","https://movie.douban.com/trailer/232871/#content","https://movie.douban.com/trailer/233282/#content","https://movie.douban.com/trailer/233196/#content","https://movie.douban.com/trailer/233163/#content","https://movie.douban.com/trailer/233101/#content","https://movie.douban.com/trailer/231760/#content","https://movie.douban.com/trailer/233324/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2526895711.jpg?1530607580","https://img1.doubanio.com/img/trailer/medium/2526382108.jpg?1530611584","https://img3.doubanio.com/img/trailer/medium/2526313250.jpg?1530076834","https://img3.doubanio.com/img/trailer/medium/2524750333.jpg?1528958544","https://img3.doubanio.com/img/trailer/medium/2523980900.jpg?","https://img3.doubanio.com/img/trailer/medium/2522972990.jpg?","https://img3.doubanio.com/img/trailer/medium/2522930690.jpg?","https://img3.doubanio.com/img/trailer/medium/2522930576.jpg?","https://img3.doubanio.com/img/trailer/medium/2512722254.jpg?","https://img1.doubanio.com/img/trailer/medium/2526510949.jpg?1530517860","https://img3.doubanio.com/img/trailer/medium/2525740613.jpg?1529554835","https://img3.doubanio.com/img/trailer/medium/2525015715.jpg?1529047084","https://img3.doubanio.com/img/trailer/medium/2512712482.jpg?","https://img3.doubanio.com/img/trailer/medium/2526564593.jpg?1530515167","https://img3.doubanio.com/img/trailer/medium/2526163516.jpg?1529989460","https://img1.doubanio.com/img/trailer/medium/2526986549.jpg?1530699121","https://img3.doubanio.com/img/trailer/medium/2526795343.jpg?1530520019","https://img3.doubanio.com/img/trailer/medium/2526690711.jpg?","https://img3.doubanio.com/img/trailer/medium/2526492715.jpg?1530260796","https://img3.doubanio.com/img/trailer/medium/2523696406.jpg?","https://img3.doubanio.com/img/trailer/medium/2527054623.jpg?1530769444"],"id":"26804147"},{"movieName":"风语咒 视频","trailerUri":["https://movie.douban.com/trailer/233215/#content","https://movie.douban.com/trailer/233050/#content","https://movie.douban.com/trailer/233049/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2526889354.jpg?1530607812","https://img3.doubanio.com/img/trailer/medium/2526426961.jpg?1530260293","https://img3.doubanio.com/img/trailer/medium/2526426921.jpg?1530260266"],"id":"30146756"},{"movieName":"北方一片苍茫 视频","trailerUri":["https://movie.douban.com/trailer/226937/#content","https://movie.douban.com/trailer/230359/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2512265734.jpg?","https://img3.doubanio.com/img/trailer/medium/2520568176.jpg?"],"id":"27079318"},{"movieName":"淘气大侦探 视频","trailerUri":["https://movie.douban.com/trailer/223574/#content","https://movie.douban.com/trailer/232837/#content","https://movie.douban.com/trailer/227921/#content","https://movie.douban.com/trailer/227922/#content","https://movie.douban.com/trailer/228762/#content","https://movie.douban.com/trailer/228312/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2504375164.jpg?","https://img3.doubanio.com/img/trailer/medium/2526136936.jpg?1529910534","https://img1.doubanio.com/img/trailer/medium/2514894909.jpg?","https://img1.doubanio.com/img/trailer/medium/2514894958.jpg?","https://img1.doubanio.com/img/trailer/medium/2516505468.jpg?","https://img3.doubanio.com/img/trailer/medium/2515703990.jpg?"],"id":"26660063"},{"movieName":"玛雅蜜蜂历险记 视频","trailerUri":["https://movie.douban.com/trailer/172324/#content","https://movie.douban.com/trailer/162001/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2230990335.jpg?","https://img3.doubanio.com/img/trailer/medium/2198023743.jpg?"],"id":"25881500"},{"movieName":"兄弟班 视频","trailerUri":["https://movie.douban.com/trailer/232918/#content","https://movie.douban.com/trailer/232602/#content","https://movie.douban.com/trailer/232317/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2526216606.jpg?1529987939","https://img3.doubanio.com/img/trailer/medium/2525526202.jpg?1529993717","https://img3.doubanio.com/img/trailer/medium/2524715061.jpg?1528795585"],"id":"26988003"},{"movieName":"午夜幽灵 视频","trailerUri":["https://movie.douban.com/trailer/228258/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2515614481.jpg?"],"id":"30128986"},{"movieName":"汪星卧底 视频","trailerUri":["https://movie.douban.com/trailer/233040/#content","https://movie.douban.com/trailer/228324/#content","https://movie.douban.com/trailer/226112/#content","https://movie.douban.com/trailer/233285/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2526407588.jpg?1530170199","https://img3.doubanio.com/img/trailer/medium/2515743422.jpg?","https://img1.doubanio.com/img/trailer/medium/2510465859.jpg?","https://img1.doubanio.com/img/trailer/medium/2526986777.jpg?1530699005"],"id":"26930056"},{"movieName":"深海历险记 视频","trailerUri":[],"trailerPoster":[],"id":"30176525"},{"movieName":"闺蜜的战争 视频","trailerUri":[],"trailerPoster":[],"id":"30262110"},{"movieName":"产科男生 视频","trailerUri":[],"trailerPoster":[],"id":"27158277"},{"movieName":"狄仁杰之四大天王 视频","trailerUri":["https://movie.douban.com/trailer/233325/#content","https://movie.douban.com/trailer/232838/#content","https://movie.douban.com/trailer/221792/#content","https://movie.douban.com/trailer/230245/#content","https://movie.douban.com/trailer/232616/#content","https://movie.douban.com/trailer/233067/#content","https://movie.douban.com/trailer/232984/#content","https://movie.douban.com/trailer/231450/#content","https://movie.douban.com/trailer/232624/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2527054753.jpg?","https://img3.doubanio.com/img/trailer/medium/2526137676.jpg?1529911031","https://img3.doubanio.com/img/trailer/medium/2499767152.jpg?","https://img1.doubanio.com/img/trailer/medium/2520334127.jpg?","https://img1.doubanio.com/img/trailer/medium/2525590378.jpg?","https://img1.doubanio.com/img/trailer/medium/2526441668.jpg?","https://img3.doubanio.com/img/trailer/medium/2526314013.jpg?","https://img3.doubanio.com/img/trailer/medium/2522954430.jpg?","https://img3.doubanio.com/img/trailer/medium/2525591834.jpg?"],"id":"25882296"},{"movieName":"西虹市首富 视频","trailerUri":["https://movie.douban.com/trailer/232859/#content","https://movie.douban.com/trailer/232030/#content","https://movie.douban.com/trailer/231173/#content","https://movie.douban.com/trailer/233327/#content","https://movie.douban.com/trailer/232506/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2526149462.jpg?1529918217","https://img1.doubanio.com/img/trailer/medium/2524221309.jpg?1528356230","https://img3.doubanio.com/img/trailer/medium/2522456574.jpg?","https://img3.doubanio.com/img/trailer/medium/2527062942.jpg?1530774020","https://img1.doubanio.com/img/trailer/medium/2525046609.jpg?"],"id":"27605698"},{"movieName":"昨日青空 视频","trailerUri":["https://movie.douban.com/trailer/231757/#content","https://movie.douban.com/trailer/220018/#content","https://movie.douban.com/trailer/233179/#content","https://movie.douban.com/trailer/233106/#content","https://movie.douban.com/trailer/231929/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2523696213.jpg?","https://img3.doubanio.com/img/trailer/medium/2494953073.jpg?","https://img3.doubanio.com/img/trailer/medium/2526778622.jpg?1530511790","https://img3.doubanio.com/img/trailer/medium/2526493695.jpg?1530257976","https://img1.doubanio.com/img/trailer/medium/2524048767.jpg?"],"id":"26290410"},{"movieName":"神奇马戏团之动物饼干 视频","trailerUri":["https://movie.douban.com/trailer/231755/#content","https://movie.douban.com/trailer/230450/#content","https://movie.douban.com/trailer/232680/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2523696073.jpg?","https://img3.doubanio.com/img/trailer/medium/2521045753.jpg?","https://img3.doubanio.com/img/trailer/medium/2525717146.jpg?1529902562"],"id":"26253783"},{"movieName":"解剖室灵异事件之男生宿舍 视频","trailerUri":[],"trailerPoster":[],"id":"30263334"},{"movieName":"萌学园：寻找盘古 视频","trailerUri":[],"trailerPoster":[],"id":"26754880"},{"movieName":"解码游戏 视频","trailerUri":["https://movie.douban.com/trailer/231669/#content","https://movie.douban.com/trailer/233284/#content","https://movie.douban.com/trailer/232981/#content","https://movie.douban.com/trailer/232683/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2523517744.jpg?","https://img1.doubanio.com/img/trailer/medium/2526986589.jpg?1530699078","https://img1.doubanio.com/img/trailer/medium/2526313658.jpg?1530076772","https://img1.doubanio.com/img/trailer/medium/2525717198.jpg?1529902495"],"id":"26767512"},{"movieName":"神秘世界历险记4 视频","trailerUri":["https://movie.douban.com/trailer/232186/#content","https://movie.douban.com/trailer/232185/#content","https://movie.douban.com/trailer/232183/#content","https://movie.douban.com/trailer/232184/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2524335499.jpg?1528456458","https://img3.doubanio.com/img/trailer/medium/2524335425.jpg?1528456487","https://img1.doubanio.com/img/trailer/medium/2524334799.jpg?1528456540","https://img3.doubanio.com/img/trailer/medium/2524335305.jpg?"],"id":"30208005"},{"movieName":"肆式青春 视频","trailerUri":["https://movie.douban.com/trailer/232715/#content","https://movie.douban.com/trailer/231622/#content","https://movie.douban.com/trailer/231517/#content","https://movie.douban.com/trailer/228991/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2525800819.jpg?","https://img1.doubanio.com/img/trailer/medium/2523441488.jpg?","https://img3.doubanio.com/img/trailer/medium/2523039223.jpg?","https://img3.doubanio.com/img/trailer/medium/2517027092.jpg?"],"id":"30156898"},{"movieName":"一出好戏 视频","trailerUri":["https://movie.douban.com/trailer/230863/#content","https://movie.douban.com/trailer/230067/#content","https://movie.douban.com/trailer/227730/#content","https://movie.douban.com/trailer/231717/#content","https://movie.douban.com/trailer/226838/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2521811714.jpg?","https://img1.doubanio.com/img/trailer/medium/2519821728.jpg?","https://img3.doubanio.com/img/trailer/medium/2514261002.jpg?","https://img3.doubanio.com/img/trailer/medium/2523607806.jpg?","https://img1.doubanio.com/img/trailer/medium/2512140439.jpg?"],"id":"26985127"},{"movieName":"爱情公寓 视频","trailerUri":["https://movie.douban.com/trailer/232102/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2524231956.jpg?1528357458"],"id":"24852545"},{"movieName":"巨齿鲨 视频","trailerUri":["https://movie.douban.com/trailer/232560/#content","https://movie.douban.com/trailer/231860/#content","https://movie.douban.com/trailer/231859/#content","https://movie.douban.com/trailer/229674/#content","https://movie.douban.com/trailer/229631/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2525296817.jpg?","https://img1.doubanio.com/img/trailer/medium/2523962188.jpg?","https://img1.doubanio.com/img/trailer/medium/2523962107.jpg?","https://img3.doubanio.com/img/trailer/medium/2518953365.jpg?","https://img3.doubanio.com/img/trailer/medium/2518855241.jpg?"],"id":"26426194"},{"movieName":"美食大冒险之英雄烩 视频","trailerUri":["https://movie.douban.com/trailer/232632/#content","https://movie.douban.com/trailer/231753/#content","https://movie.douban.com/trailer/229860/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2525592313.jpg?1529902857","https://img1.doubanio.com/img/trailer/medium/2523695739.jpg?","https://img3.doubanio.com/img/trailer/medium/2519463473.jpg?"],"id":"26290398"},{"movieName":"勇者闯魔城 视频","trailerUri":[],"trailerPoster":[],"id":"30125089"},{"movieName":"大轰炸 视频","trailerUri":["https://movie.douban.com/trailer/232626/#content","https://movie.douban.com/trailer/231094/#content","https://movie.douban.com/trailer/232633/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2525591935.jpg?1529903005","https://img3.doubanio.com/img/trailer/medium/2522332973.jpg?","https://img1.doubanio.com/img/trailer/medium/2525592869.jpg?1529902824"],"id":"26331700"},{"movieName":"如影随心 视频","trailerUri":["https://movie.douban.com/trailer/229343/#content","https://movie.douban.com/trailer/233185/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2518071792.jpg?","https://img1.doubanio.com/img/trailer/medium/2526780629.jpg?1530512588"],"id":"26871669"},{"movieName":"快把我哥带走 视频","trailerUri":["https://movie.douban.com/trailer/228408/#content","https://movie.douban.com/trailer/232449/#content","https://movie.douban.com/trailer/233175/#content","https://movie.douban.com/trailer/233174/#content","https://movie.douban.com/trailer/233097/#content","https://movie.douban.com/trailer/233037/#content","https://movie.douban.com/trailer/232552/#content","https://movie.douban.com/trailer/233288/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2516067315.jpg?","https://img3.doubanio.com/img/trailer/medium/2524962262.jpg?","https://img3.doubanio.com/img/trailer/medium/2526777801.jpg?1530512211","https://img3.doubanio.com/img/trailer/medium/2526777252.jpg?","https://img3.doubanio.com/img/trailer/medium/2526492295.jpg?1530260716","https://img3.doubanio.com/img/trailer/medium/2526407241.jpg?1530242478","https://img3.doubanio.com/img/trailer/medium/2525143961.jpg?","https://img3.doubanio.com/img/trailer/medium/2526987283.jpg?1530696817"],"id":"30122633"},{"movieName":"未来机器城 视频","trailerUri":["https://movie.douban.com/trailer/232839/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2526137673.jpg?1529910998"],"id":"27200988"},{"movieName":"大师兄 视频","trailerUri":["https://movie.douban.com/trailer/232746/#content","https://movie.douban.com/trailer/232814/#content","https://movie.douban.com/trailer/233181/#content","https://movie.douban.com/trailer/233323/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2525832878.jpg?1529923579","https://img3.doubanio.com/img/trailer/medium/2526121745.jpg?1529901332","https://img3.doubanio.com/img/trailer/medium/2526779084.jpg?1530511648","https://img3.doubanio.com/img/trailer/medium/2527053943.jpg?"],"id":"27201353"},{"movieName":"最后的棒棒 视频","trailerUri":["https://movie.douban.com/trailer/232753/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2525865391.jpg?1529667145"],"id":"30254589"},{"movieName":"他是一只狗 视频","trailerUri":[],"trailerPoster":[],"id":"30246086"},{"movieName":"冷恋时代 视频","trailerUri":[],"trailerPoster":[],"id":"24743257"},{"movieName":"大三儿 视频","trailerUri":["https://movie.douban.com/trailer/231593/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2523431559.jpg?"],"id":"27119292"},{"movieName":"反贪风暴3 视频","trailerUri":["https://movie.douban.com/trailer/231603/#content","https://movie.douban.com/trailer/233043/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2523439239.jpg?","https://img3.doubanio.com/img/trailer/medium/2526407834.jpg?1530170051"],"id":"26996640"},{"movieName":"七袋米 视频","trailerUri":["https://movie.douban.com/trailer/231602/#content","https://movie.douban.com/trailer/231600/#content","https://movie.douban.com/trailer/231601/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2523437292.jpg?","https://img1.doubanio.com/img/trailer/medium/2523437129.jpg?","https://img1.doubanio.com/img/trailer/medium/2523437007.jpg?"],"id":"26881698"},{"movieName":"让我怎么相信你 视频","trailerUri":[],"trailerPoster":[],"id":"30199575"},{"movieName":"道高一丈 视频","trailerUri":[],"trailerPoster":[],"id":"26954268"},{"movieName":"有五个姐姐的我就注定要单身了啊 视频","trailerUri":["https://movie.douban.com/trailer/233283/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2526986491.jpg?1530699098"],"id":"26730542"},{"movieName":"惊慌失色之诡寓 视频","trailerUri":[],"trailerPoster":[],"id":"30237381"},{"movieName":"天下第一镖局 视频","trailerUri":["https://movie.douban.com/trailer/233281/#content","https://movie.douban.com/trailer/231921/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2526986088.jpg?1530699144","https://img3.doubanio.com/img/trailer/medium/2524048176.jpg?"],"id":"27107604"},{"movieName":"旅行吧！井底之蛙 视频","trailerUri":[],"trailerPoster":[],"id":"30236775"},{"movieName":"蚁人2：黄蜂女现身 视频","trailerUri":["https://movie.douban.com/trailer/231244/#content","https://movie.douban.com/trailer/231243/#content","https://movie.douban.com/trailer/230391/#content","https://movie.douban.com/trailer/230390/#content","https://movie.douban.com/trailer/230388/#content","https://movie.douban.com/trailer/230384/#content","https://movie.douban.com/trailer/226958/#content","https://movie.douban.com/trailer/226876/#content","https://movie.douban.com/trailer/219971/#content","https://movie.douban.com/trailer/232762/#content","https://movie.douban.com/trailer/232096/#content","https://movie.douban.com/trailer/231888/#content","https://movie.douban.com/trailer/231774/#content","https://movie.douban.com/trailer/232608/#content","https://movie.douban.com/trailer/231380/#content","https://movie.douban.com/trailer/233195/#content","https://movie.douban.com/trailer/233197/#content","https://movie.douban.com/trailer/232566/#content","https://movie.douban.com/trailer/232567/#content","https://movie.douban.com/trailer/232460/#content","https://movie.douban.com/trailer/232048/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2522690761.jpg?","https://img1.doubanio.com/img/trailer/medium/2522690659.jpg?","https://img3.doubanio.com/img/trailer/medium/2520904160.jpg?","https://img1.doubanio.com/img/trailer/medium/2520897188.jpg?","https://img3.doubanio.com/img/trailer/medium/2520895522.jpg?","https://img3.doubanio.com/img/trailer/medium/2520829861.jpg?","https://img1.doubanio.com/img/trailer/medium/2512327887.jpg?","https://img1.doubanio.com/img/trailer/medium/2512190538.jpg?","https://img3.doubanio.com/img/trailer/medium/2494800564.jpg?","https://img3.doubanio.com/img/trailer/medium/2525870676.jpg?","https://img3.doubanio.com/img/trailer/medium/2524226591.jpg?1528366208","https://img1.doubanio.com/img/trailer/medium/2523992127.jpg?","https://img3.doubanio.com/img/trailer/medium/2523699590.jpg?","https://img3.doubanio.com/img/trailer/medium/2525548656.jpg?1529993659","https://img3.doubanio.com/img/trailer/medium/2522889172.jpg?","https://img1.doubanio.com/img/trailer/medium/2526795217.jpg?1530520165","https://img3.doubanio.com/img/trailer/medium/2526795871.jpg?1530520144","https://img1.doubanio.com/img/trailer/medium/2525357509.jpg?1529990934","https://img1.doubanio.com/img/trailer/medium/2525357787.jpg?1529990963","https://img3.doubanio.com/img/trailer/medium/2524978631.jpg?1528966183","https://img3.doubanio.com/img/trailer/medium/2524154671.jpg?1528340863"],"id":"26636712"},{"movieName":"我，花样女王 视频","trailerUri":["https://movie.douban.com/trailer/224983/#content","https://movie.douban.com/trailer/223359/#content","https://movie.douban.com/trailer/224643/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2507488558.jpg?","https://img1.doubanio.com/img/trailer/medium/2503800758.jpg?","https://img1.doubanio.com/img/trailer/medium/2506804809.jpg?"],"id":"26756049"},{"movieName":"碟中谍6：全面瓦解 视频","trailerUri":["https://movie.douban.com/trailer/231259/#content","https://movie.douban.com/trailer/231252/#content","https://movie.douban.com/trailer/231247/#content","https://movie.douban.com/trailer/231045/#content","https://movie.douban.com/trailer/227152/#content","https://movie.douban.com/trailer/232695/#content","https://movie.douban.com/trailer/232287/#content","https://movie.douban.com/trailer/232349/#content","https://movie.douban.com/trailer/227139/#content","https://movie.douban.com/trailer/233171/#content","https://movie.douban.com/trailer/233063/#content","https://movie.douban.com/trailer/231865/#content","https://movie.douban.com/trailer/227314/#content","https://movie.douban.com/trailer/226928/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2522725463.jpg?1528734001","https://img3.doubanio.com/img/trailer/medium/2522708331.jpg?","https://img3.doubanio.com/img/trailer/medium/2522708104.jpg?","https://img3.doubanio.com/img/trailer/medium/2522268915.jpg?","https://img1.doubanio.com/img/trailer/medium/2512745509.jpg?","https://img3.doubanio.com/img/trailer/medium/2525740012.jpg?1529554444","https://img1.doubanio.com/img/trailer/medium/2524688249.jpg?","https://img1.doubanio.com/img/trailer/medium/2524812967.jpg?1528959304","https://img3.doubanio.com/img/trailer/medium/2512712810.jpg?","https://img3.doubanio.com/img/trailer/medium/2526770385.jpg?1530512303","https://img3.doubanio.com/img/trailer/medium/2526438961.jpg?1530611145","https://img1.doubanio.com/img/trailer/medium/2523962699.jpg?","https://img1.doubanio.com/img/trailer/medium/2512990789.jpg?","https://img3.doubanio.com/img/trailer/medium/2512246703.jpg?"],"id":"26336252"},{"movieName":"镰仓物语 视频","trailerUri":["https://movie.douban.com/trailer/230144/#content","https://movie.douban.com/trailer/218731/#content","https://movie.douban.com/trailer/224151/#content","https://movie.douban.com/trailer/224147/#content","https://movie.douban.com/trailer/224149/#content","https://movie.douban.com/trailer/230819/#content","https://movie.douban.com/trailer/230697/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2520132966.jpg?","https://img3.doubanio.com/img/trailer/medium/2480586560.jpg?","https://img3.doubanio.com/img/trailer/medium/2505617813.jpg?","https://img3.doubanio.com/img/trailer/medium/2505617052.jpg?","https://img3.doubanio.com/img/trailer/medium/2505617406.jpg?","https://img3.doubanio.com/img/trailer/medium/2521733372.jpg?","https://img1.doubanio.com/img/trailer/medium/2521614649.jpg?"],"id":"26916229"},{"movieName":"影 视频","trailerUri":["https://movie.douban.com/trailer/231782/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2523705700.jpg?"],"id":"4864908"},{"movieName":"边境杀手2：边境战士 视频","trailerUri":["https://movie.douban.com/trailer/231509/#content","https://movie.douban.com/trailer/228839/#content","https://movie.douban.com/trailer/227424/#content","https://movie.douban.com/trailer/225252/#content","https://movie.douban.com/trailer/233085/#content","https://movie.douban.com/trailer/232439/#content","https://movie.douban.com/trailer/232443/#content","https://movie.douban.com/trailer/231996/#content","https://movie.douban.com/trailer/231792/#content","https://movie.douban.com/trailer/232713/#content","https://movie.douban.com/trailer/232425/#content","https://movie.douban.com/trailer/232410/#content","https://movie.douban.com/trailer/232411/#content","https://movie.douban.com/trailer/233012/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2523018626.jpg?","https://img3.doubanio.com/img/trailer/medium/2516829974.jpg?","https://img3.doubanio.com/img/trailer/medium/2513246682.jpg?","https://img1.doubanio.com/img/trailer/medium/2508146897.jpg?","https://img3.doubanio.com/img/trailer/medium/2526470693.jpg?1530521090","https://img1.doubanio.com/img/trailer/medium/2524960739.jpg?1528954329","https://img3.doubanio.com/img/trailer/medium/2524961022.jpg?","https://img3.doubanio.com/img/trailer/medium/2524107984.jpg?","https://img3.doubanio.com/img/trailer/medium/2523735623.jpg?","https://img3.doubanio.com/img/trailer/medium/2525801255.jpg?1529990491","https://img3.doubanio.com/img/trailer/medium/2524940124.jpg?1528956797","https://img3.doubanio.com/img/trailer/medium/2524931093.jpg?","https://img3.doubanio.com/img/trailer/medium/2524931201.jpg?1528957737","https://img3.doubanio.com/img/trailer/medium/2526381946.jpg?"],"id":"26627736"},{"movieName":"营救汪星人 视频","trailerUri":["https://movie.douban.com/trailer/231720/#content","https://movie.douban.com/trailer/230452/#content","https://movie.douban.com/trailer/226985/#content","https://movie.douban.com/trailer/224021/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2523608745.jpg?","https://img1.doubanio.com/img/trailer/medium/2521045788.jpg?","https://img3.doubanio.com/img/trailer/medium/2512353485.jpg?","https://img3.doubanio.com/img/trailer/medium/2505200235.jpg?"],"id":"26930565"},{"movieName":"找到你 视频","trailerUri":["https://movie.douban.com/trailer/231886/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2523989295.jpg?"],"id":"27140071"},{"movieName":"断片之险途夺宝 视频","trailerUri":["https://movie.douban.com/trailer/207856/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2400698056.jpg?"],"id":"26882457"},{"movieName":"新乌龙院之笑闹江湖 视频","trailerUri":["https://movie.douban.com/trailer/231098/#content","https://movie.douban.com/trailer/232099/#content","https://movie.douban.com/trailer/232682/#content","https://movie.douban.com/trailer/232362/#content","https://movie.douban.com/trailer/232170/#content","https://movie.douban.com/trailer/231599/#content","https://movie.douban.com/trailer/231486/#content","https://movie.douban.com/trailer/231341/#content","https://movie.douban.com/trailer/232818/#content","https://movie.douban.com/trailer/233102/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2522333392.jpg?","https://img3.doubanio.com/img/trailer/medium/2524231042.jpg?1528357536","https://img1.doubanio.com/img/trailer/medium/2525717177.jpg?1529902516","https://img3.doubanio.com/img/trailer/medium/2524828712.jpg?1528871154","https://img1.doubanio.com/img/trailer/medium/2524312589.jpg?1528437545","https://img1.doubanio.com/img/trailer/medium/2523436517.jpg?","https://img3.doubanio.com/img/trailer/medium/2522981766.jpg?","https://img1.doubanio.com/img/trailer/medium/2522824057.jpg?","https://img3.doubanio.com/img/trailer/medium/2526122443.jpg?1529902166","https://img3.doubanio.com/img/trailer/medium/2526492732.jpg?1530260767"],"id":"26309969"},{"movieName":"墨多多谜境冒险 视频","trailerUri":["https://movie.douban.com/trailer/227157/#content","https://movie.douban.com/trailer/232448/#content","https://movie.douban.com/trailer/231325/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2512721635.jpg?","https://img3.doubanio.com/img/trailer/medium/2524962295.jpg?1528951346","https://img1.doubanio.com/img/trailer/medium/2522822477.jpg?"],"id":"26790960"},{"movieName":"沉默的证人 视频","trailerUri":["https://movie.douban.com/trailer/228988/#content","https://movie.douban.com/trailer/228608/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2517025368.jpg?","https://img3.doubanio.com/img/trailer/medium/2516310364.jpg?"],"id":"26816090"},{"movieName":"武林怪兽 视频","trailerUri":[],"trailerPoster":[],"id":"26425062"},{"movieName":"真相漩涡 视频","trailerUri":["https://movie.douban.com/trailer/227304/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2512964688.jpg?"],"id":"26792540"},{"movieName":"苏丹 视频","trailerUri":["https://movie.douban.com/trailer/206474/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2393895989.jpg?"],"id":"26728641"},{"movieName":"跨越8年的新娘 视频","trailerUri":["https://movie.douban.com/trailer/227270/#content","https://movie.douban.com/trailer/221477/#content","https://movie.douban.com/trailer/218159/#content","https://movie.douban.com/trailer/233287/#content","https://movie.douban.com/trailer/223752/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2512894167.jpg?","https://img3.doubanio.com/img/trailer/medium/2499034181.jpg?","https://img3.doubanio.com/img/trailer/medium/2462903840.jpg?","https://img3.doubanio.com/img/trailer/medium/2526987120.jpg?","https://img3.doubanio.com/img/trailer/medium/2504782560.jpg?"],"id":"26929835"},{"movieName":"李宗伟：败者为王 视频","trailerUri":["https://movie.douban.com/trailer/231023/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2522263431.jpg?"],"id":"27195119"},{"movieName":"黑脸大包公之西夏风云 视频","trailerUri":[],"trailerPoster":[],"id":"27192660"},{"movieName":"幸福魔咒 视频","trailerUri":[],"trailerPoster":[],"id":"27661975"},{"movieName":"阿里巴巴三根金发 视频","trailerUri":["https://movie.douban.com/trailer/228917/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2516916816.jpg?"],"id":"30176069"},{"movieName":"纯真年代 视频","trailerUri":[],"trailerPoster":[],"id":"30263969"},{"movieName":"黑暗深处之惊魂夜 视频","trailerUri":[],"trailerPoster":[],"id":"30259493"},{"movieName":"恩师 视频","trailerUri":["https://movie.douban.com/trailer/232615/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2525590426.jpg?"],"id":"30215191"},{"movieName":"勇敢往事 视频","trailerUri":["https://movie.douban.com/trailer/232053/#content","https://movie.douban.com/trailer/230307/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2524174602.jpg?","https://img3.doubanio.com/img/trailer/medium/2520458605.jpg?"],"id":"27191430"},{"movieName":"江湖儿女 视频","trailerUri":["https://movie.douban.com/trailer/231448/#content","https://movie.douban.com/trailer/230586/#content","https://movie.douban.com/trailer/230578/#content","https://movie.douban.com/trailer/231401/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2522954125.jpg?","https://img3.doubanio.com/img/trailer/medium/2521476011.jpg?","https://img3.doubanio.com/img/trailer/medium/2521453294.jpg?","https://img1.doubanio.com/img/trailer/medium/2522902718.jpg?"],"id":"26972258"},{"movieName":"一生有你 视频","trailerUri":["https://movie.douban.com/trailer/232747/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2525832840.jpg?1529641379"],"id":"26263417"},{"movieName":"禹神传之寻找神力 视频","trailerUri":[],"trailerPoster":[],"id":"30227727"},{"movieName":"李茶的姑妈 视频","trailerUri":[],"trailerPoster":[],"id":"27092785"},{"movieName":"无双 视频","trailerUri":["https://movie.douban.com/trailer/231147/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2522415949.jpg?"],"id":"26425063"},{"movieName":"云南虫谷 视频","trailerUri":["https://movie.douban.com/trailer/231365/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2522871302.jpg?"],"id":"26744597"},{"movieName":"胖子行动队 视频","trailerUri":["https://movie.douban.com/trailer/232917/#content","https://movie.douban.com/trailer/221816/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2526216537.jpg?1529987861","https://img1.doubanio.com/img/trailer/medium/2499810809.jpg?"],"id":"27149818"},{"movieName":"山2 视频","trailerUri":[],"trailerPoster":[],"id":"26911450"},{"movieName":"护垫侠 视频","trailerUri":["https://movie.douban.com/trailer/225121/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2507744714.jpg?"],"id":"27198855"},{"movieName":"阳台上 视频","trailerUri":["https://movie.douban.com/trailer/230243/#content","https://movie.douban.com/trailer/230535/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2520330164.jpg?","https://img1.doubanio.com/img/trailer/medium/2521140229.jpg?"],"id":"27135473"},{"movieName":"苦行僧的非凡旅程 视频","trailerUri":["https://movie.douban.com/trailer/230573/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2521437489.jpg?"],"id":"26715965"},{"movieName":"大闹西游 视频","trailerUri":["https://movie.douban.com/trailer/227313/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2512989005.jpg?"],"id":"30142649"},{"movieName":"阴阳师 视频","trailerUri":[],"trailerPoster":[],"id":"26935283"},{"movieName":"阿凡提之奇缘历险 视频","trailerUri":["https://movie.douban.com/trailer/232914/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2526216067.jpg?"],"id":"30208004"},{"movieName":"灵魂的救赎 视频","trailerUri":[],"trailerPoster":[],"id":"27620911"},{"movieName":"功夫联盟 视频","trailerUri":[],"trailerPoster":[],"id":"27008394"},{"movieName":"过往的梦 视频","trailerUri":["https://movie.douban.com/trailer/231583/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2523425713.jpg?"],"id":"27107609"},{"movieName":"银魂2 视频","trailerUri":["https://movie.douban.com/trailer/230209/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2520260415.jpg?"],"id":"27199577"},{"movieName":"燃点 视频","trailerUri":[],"trailerPoster":[],"id":"27663881"},{"movieName":"碟仙实录 视频","trailerUri":[],"trailerPoster":[],"id":"26961483"},{"movieName":"素人特工 视频","trailerUri":[],"trailerPoster":[],"id":"27155276"},{"movieName":"人间·喜剧 视频","trailerUri":[],"trailerPoster":[],"id":"27179414"},{"movieName":"阿丽塔：战斗天使 视频","trailerUri":["https://movie.douban.com/trailer/224924/#content","https://movie.douban.com/trailer/224871/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2507372272.jpg?","https://img3.doubanio.com/img/trailer/medium/2507188313.jpg?"],"id":"1652592"},{"movieName":"动物特工局 视频","trailerUri":["https://movie.douban.com/trailer/231024/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2522264636.jpg?"],"id":"30217371"},{"movieName":"疯狂的外星人 视频","trailerUri":["https://movie.douban.com/trailer/219724/#content"],"trailerPoster":["https://img3.doubanio.com/img/trailer/medium/2494105655.jpg?"],"id":"25986662"},{"movieName":"神探蒲松龄之兰若仙踪 视频","trailerUri":[],"trailerPoster":[],"id":"27065898"},{"movieName":"八仙之各显神通 视频","trailerUri":[],"trailerPoster":[],"id":"26277338"},{"movieName":"误入江湖 视频","trailerUri":[],"trailerPoster":[],"id":"30187577"},{"movieName":"迦百农 视频","trailerUri":[],"trailerPoster":[],"id":"30170448"},{"movieName":"画皮Ⅲ 视频","trailerUri":[],"trailerPoster":[],"id":"24743117"},{"movieName":"八仙过海 视频","trailerUri":["https://movie.douban.com/trailer/231174/#content"],"trailerPoster":["https://img1.doubanio.com/img/trailer/medium/2522459307.jpg?"],"id":"30226052"},{"movieName":"摸金校尉之九幽将军 视频","trailerUri":[],"trailerPoster":[],"id":"26986120"},{"movieName":"异界 视频","trailerUri":[],"trailerPoster":[],"id":"30264504"},{"movieName":"唐人街探案3 视频","trailerUri":[],"trailerPoster":[],"id":"27619748"},{"movieName":"黑色假面 视频","trailerUri":[],"trailerPoster":[],"id":"26986136"}]

/***/ },
/* 12 */
/***/ function(module, exports) {

module.exports = [{"trailerArray":[],"id":"30261979","trailerTitle":"左滩 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111901/f1a908c1454cb9e94f3580cbe5d73614/view/movie/M/402330222.mp4","trailerTitle":"红盾先锋\n    预告片 (中文字幕)","trailerDate":"2018-07-03","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526898674.jpg?1530607391"}],"id":"26614101","trailerTitle":"红盾先锋 视频"},{"trailerArray":[],"id":"27053277","trailerTitle":"格桑花开的时候 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111901/88daf170bcb58f32d92349ce291d1290/view/movie/M/402330091.mp4","trailerTitle":"邪不压正\n    预告片1：终极版 (中文字幕)","trailerDate":"2018-06-29","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526489612.jpg?1530244322"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/af0c3aabb9747f67f9fdda11f50fdd1b/view/movie/M/402320465.mp4","trailerTitle":"邪不压正\n    预告片2：剧情版 (中文字幕)","trailerDate":"2018-06-14","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2525013534.jpg?1528992466"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/9d01daa22669aa82200653b981899d34/view/movie/M/402310013.mp4","trailerTitle":"邪不压正\n    预告片3：定档版 (中文字幕)","trailerDate":"2018-05-16","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2522243802.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/a97a8d5fe37ba694c0504f02ba8a7123/view/movie/M/302270161.mp4","trailerTitle":"邪不压正\n    先行版 (中文字幕)","trailerDate":"2018-02-05","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2512738841.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/14fb561bb50cf98280f1a1a4dc254ca9/view/movie/M/402310761.mp4","trailerTitle":"邪不压正\n    其它预告片：脚不沾地版 (中文字幕)","trailerDate":"2018-06-01","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2523696800.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/2be1b85444ee158d6a5daeb51c570e1e/view/movie/M/402330038.mp4","trailerTitle":"邪不压正\n    花絮1：京片儿小课堂特辑 (中文字幕)","trailerDate":"2018-06-28","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526407382.jpg?1530242324"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/e650dff4102ab7086bec29b1345f3aae/view/movie/M/402320450.mp4","trailerTitle":"邪不压正\n    花絮2：“廖是真有料”特辑 (中文字幕)","trailerDate":"2018-06-14","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2524962313.jpg?1528951170"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/c062ba9a23077ef39d6398f128ba088b/view/movie/M/402320265.mp4","trailerTitle":"邪不压正\n    花絮3：先生们特辑 (中文字幕)","trailerDate":"2018-06-12","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2524657999.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/261b0095e6e1da2b0340225dfcdae1af/view/movie/M/402320248.mp4","trailerTitle":"邪不压正\n    花絮4：姜文“吓哭”彭于晏 (中文字幕)","trailerDate":"2018-06-11","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2524609792.jpg?1528707165"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/aa3d0b216a9f0381d5d967a1c54fb56f/view/movie/M/402310335.mp4","trailerTitle":"邪不压正\n    花絮5 (中文字幕)","trailerDate":"2018-05-22","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2522823603.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/04270d3e328695e6a28fcc8806ea7c46/view/movie/M/402330289.mp4","trailerTitle":"邪不压正\n    其它花絮3：上海电影节特辑 (中文字幕)","trailerDate":"2018-07-04","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526988612.jpg?1530696697"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/af12b9f494ac23e59c7cb97fcdcffbdb/view/movie/M/402310861.mp4","trailerTitle":"邪不压正\n    其它花絮4：GQ特辑","trailerDate":"2018-06-04","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2523962317.jpg?"}],"id":"26366496","trailerTitle":"邪不压正 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111901/b91cc1c1fa5ebb422d7a2bf11897ce4f/view/movie/M/402320634.mp4","trailerTitle":"阿修罗\n    预告片2：对决版 (中文字幕)","trailerDate":"2018-06-20","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2525592709.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/3d3fdeb2aa6eefc9b0d464d881dd7941/view/movie/M/402310632.mp4","trailerTitle":"阿修罗\n    预告片3：正义之战版 (中文字幕)","trailerDate":"2018-05-29","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2523447386.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/f200c298d218854d8238aaf90c9911bb/view/movie/M/302280924.mp4","trailerTitle":"阿修罗\n    预告片4：救世重生版 (中文字幕)","trailerDate":"2018-03-21","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2516928467.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/f1ff502f94157b53265330df193c9b8d/view/movie/M/302260282.mp4","trailerTitle":"阿修罗\n    先行版：欲海寻人版 (中文字幕)","trailerDate":"2018-01-17","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2510889309.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/9cfca207a05c581cc3c3226ec3599a10/view/movie/M/402330182.mp4","trailerTitle":"阿修罗\n    花絮2：揭秘三头特辑 (中文字幕)","trailerDate":"2018-07-02","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526779365.jpg?1530511845"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/269a6cac96cdd07f24af84fe03b4898b/view/movie/M/402330105.mp4","trailerTitle":"阿修罗\n    花絮3 (中文字幕)","trailerDate":"2018-06-29","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526493784.jpg?1530258754"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/3a987240cb74d456f00e98d6046daf9c/view/movie/M/402320862.mp4","trailerTitle":"阿修罗\n    花絮4：服装造型师奈拉特辑 (中文字幕)","trailerDate":"2018-06-25","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526150634.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/b601361040bc23858baee6ff9db32749/view/movie/M/402320509.mp4","trailerTitle":"阿修罗\n    花絮5：幕后特辑 (中文字幕)","trailerDate":"2018-06-15","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2525052874.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/d4d5d8e530ebf82bcd1abcbbd9a2edd5/view/movie/M/402300455.mp4","trailerTitle":"阿修罗\n    花絮6：正义联盟特辑 (中文字幕)","trailerDate":"2018-05-03","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2521047068.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/e2be8463a52369908fcd0ba7462088d8/view/movie/M/302280116.mp4","trailerTitle":"阿修罗\n    花絮7：华蕊特辑 (中文字幕)","trailerDate":"2018-03-05","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2515430747.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/2bae761455ae3f19c51740cf778ebde8/view/movie/M/402330041.mp4","trailerTitle":"阿修罗\n    MV：邓紫棋献唱主题曲《爱如意》 (中文字幕)","trailerDate":"2018-06-28","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2526407977.jpg?1530170168"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/ff980f84fd829cb9c0a910f202708602/view/movie/M/402320462.mp4","trailerTitle":"阿修罗\n    其它花絮2 (中文字幕)","trailerDate":"2018-06-14","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2524986642.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/6b03afcd81aaeb3a638eb4d3a700859a/view/movie/M/302250457.mp4","trailerTitle":"阿修罗\n    其它花絮3：吴磊生日祝福特辑 (中文字幕)","trailerDate":"2017-12-26","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2508730944.jpg?"}],"id":"26746958","trailerTitle":"阿修罗 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111901/6665732b745305e6d462c2bf67c2294d/view/movie/M/402330187.mp4","trailerTitle":"海龙屯\n    预告片","trailerDate":"2018-07-02","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2526782268.jpg?1530514561"}],"id":"27114204","trailerTitle":"海龙屯 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111901/5dbcaff6efd2a7dc7d9f3633794445d1/view/movie/M/402300179.mp4","trailerTitle":"铁笼\n    预告片 (中文字幕)","trailerDate":"2018-04-24","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2520207116.jpg?"}],"id":"30203509","trailerTitle":"铁笼 视频"},{"trailerArray":[],"id":"27194322","trailerTitle":"美丽童年 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111901/0ba3e6667e247f443225c63658dbd091/view/movie/M/402320855.mp4","trailerTitle":"天佑之爱\n    预告片1 (中文字幕)","trailerDate":"2018-06-25","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526146236.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/8cb52b3ab75b5e45be7d998f88ca2b04/view/movie/M/402320854.mp4","trailerTitle":"天佑之爱\n    预告片2 (中文字幕)","trailerDate":"2018-06-25","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2526145227.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/5f874c578af67d1b847371adafc6d818/view/movie/M/402320853.mp4","trailerTitle":"天佑之爱\n    预告片3 (中文字幕)","trailerDate":"2018-06-25","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526145132.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/7956d39eb4d3fea08f127e896cc339cd/view/movie/M/402320852.mp4","trailerTitle":"天佑之爱\n    其它花絮 (中文字幕)","trailerDate":"2018-06-25","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2526144947.jpg?1529918519"}],"id":"30249257","trailerTitle":"天佑之爱 视频"},{"trailerArray":[],"id":"30227725","trailerTitle":"小悟空 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111901/1f8b6095076e658243c1bc585009bdb3/view/movie/M/402330051.mp4","trailerTitle":"八只鸡\n    预告片：残酷童年版 (中文字幕)","trailerDate":"2018-06-28","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526427410.jpg?"}],"id":"30252555","trailerTitle":"八只鸡 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111901/efd9fc5d8234d3f33ee955cada77c57b/view/movie/M/402330219.mp4","trailerTitle":"摩天营救\n    台湾预告片3 (中文字幕)","trailerDate":"2018-07-03","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526895711.jpg?1530607580"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/dd47cbc401a1b8d245c8ab0b5a808384/view/movie/M/402330019.mp4","trailerTitle":"摩天营救\n    台湾预告片4 (中文字幕)","trailerDate":"2018-06-28","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2526382108.jpg?1530611584"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/0c55bdf8e6e023d2fed04894bdf5da10/view/movie/M/402320978.mp4","trailerTitle":"摩天营救\n    中国预告片5：定档版 (中文字幕)","trailerDate":"2018-06-27","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526313250.jpg?1530076834"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/c996ad42f377d3c546460db5f767a5b0/view/movie/M/402320339.mp4","trailerTitle":"摩天营救\n    台湾预告片6 (中文字幕)","trailerDate":"2018-06-13","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2524750333.jpg?1528958544"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/2634ab3c032fafc297aaae54d606b024/view/movie/M/402310885.mp4","trailerTitle":"摩天营救\n    台湾预告片7 (中文字幕)","trailerDate":"2018-06-04","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2523980900.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/9956b1a5980e033d8949220ea25d4cff/view/movie/M/402310474.mp4","trailerTitle":"摩天营救\n    香港预告片8 (中文字幕)","trailerDate":"2018-05-24","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2522972990.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/756ab8af365f693641ed5af40e676c3e/view/movie/M/402310427.mp4","trailerTitle":"摩天营救\n    台湾预告片9 (中文字幕)","trailerDate":"2018-05-24","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2522930690.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/6e176871c539a2aa8b9fa4925a4249ec/view/movie/M/402310426.mp4","trailerTitle":"摩天营救\n    香港预告片10 (中文字幕)","trailerDate":"2018-05-24","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2522930576.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/9597a200c1ff3fd4d97a171039d23de1/view/movie/M/302270160.mp4","trailerTitle":"摩天营救\n    中国预告片11 (中文字幕)","trailerDate":"2018-02-05","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2512722254.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/92a1138b32c0c730047ce92e15c368c9/view/movie/M/402330113.mp4","trailerTitle":"摩天营救\n    电视版1 (中文字幕)","trailerDate":"2018-06-29","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2526510949.jpg?1530517860"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/33d404ff58a8072acf7f7362b2982085/view/movie/M/402320696.mp4","trailerTitle":"摩天营救\n    电视版2 (中文字幕)","trailerDate":"2018-06-21","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2525740613.jpg?1529554835"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/ee6d383730389cd587138e42bf6dcf68/view/movie/M/402320471.mp4","trailerTitle":"摩天营救\n    电视版3 (中文字幕)","trailerDate":"2018-06-15","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2525015715.jpg?1529047084"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/bb43c747f5db24f2ef678240c4342fdf/view/movie/M/302270127.mp4","trailerTitle":"摩天营救\n    电视版4：超级碗版","trailerDate":"2018-02-05","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2512712482.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/daf5c1364cfd04cc9d2a5a1aac04b823/view/movie/M/402330149.mp4","trailerTitle":"摩天营救\n    其它预告片1","trailerDate":"2018-06-30","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526564593.jpg?1530515167"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/d65f001efaba9a814ec0ffbafddc36d7/view/movie/M/402320871.mp4","trailerTitle":"摩天营救\n    其它预告片2 (中文字幕)","trailerDate":"2018-06-25","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526163516.jpg?1529989460"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/f2f03a22ff76c4f4a3bbd7eedc799fd2/view/movie/M/402330282.mp4","trailerTitle":"摩天营救\n    花絮4：珍珠塔特辑 (中文字幕)","trailerDate":"2018-07-04","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2526986549.jpg?1530699121"},{"trailerTitle":"","trailerDate":null,"trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526795343.jpg?1530520019"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/2cf6367dec466e31f1f98994b2cdb760/view/movie/M/402330163.mp4","trailerTitle":"摩天营救\n    花絮5 (中文字幕)","trailerDate":"2018-07-01","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526690711.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/2a576c4b10b158bbaf5fee1c580444df/view/movie/M/402330101.mp4","trailerTitle":"摩天营救\n    花絮6 (中文字幕)","trailerDate":"2018-06-29","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526492715.jpg?1530260796"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/0feb8c1e2fdc3ba3a046fe88e08e1e86/view/movie/M/402310760.mp4","trailerTitle":"摩天营救\n    花絮7：儿童节特辑 (中文字幕)","trailerDate":"2018-06-01","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2523696406.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/4d9cf8197a6822f087718931d287143f/view/movie/M/402330324.mp4","trailerTitle":"摩天营救\n    其它花絮3：北京首映礼特辑 (中文字幕)","trailerDate":"2018-07-05","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2527054623.jpg?1530769444"}],"id":"26804147","trailerTitle":"摩天营救 视频"},{"trailerArray":[{"trailerTitle":"","trailerDate":null,"trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526889354.jpg?1530607812"},{"trailerTitle":"","trailerDate":null,"trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526426961.jpg?1530260293"},{"trailerTitle":"","trailerDate":null,"trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526426921.jpg?1530260266"}],"id":"30146756","trailerTitle":"风语咒 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111901/377d186173c31ff7281805afcf32ba85/view/movie/M/302260937.mp4","trailerTitle":"北方一片苍茫\n    预告片3：国际版","trailerDate":"2018-01-31","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2512265734.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/9cce9e43ef6ab600b15a5906ef971656/view/movie/M/402300359.mp4","trailerTitle":"北方一片苍茫\n    预告片2：鹿特丹版","trailerDate":"2018-04-28","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2520568176.jpg?"}],"id":"27079318","trailerTitle":"北方一片苍茫 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111901/eb9678e9f0aa3f187d71a9ddab75f87d/view/movie/M/302230574.mp4","trailerTitle":"淘气大侦探\n    台湾预告片 (中文字幕)","trailerDate":"2017-11-08","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2504375164.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/449183c4cc996892003745d31bdf662b/view/movie/M/402320837.mp4","trailerTitle":"淘气大侦探\n    中国先行版 (中文字幕)","trailerDate":"2018-06-25","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526136936.jpg?1529910534"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/af9df869128c3a7eaffe5f59820deaa2/view/movie/M/302270921.mp4","trailerTitle":"淘气大侦探\n    电视版1","trailerDate":"2018-02-28","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2514894909.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/1256ab79cb45bccee8ccb94ef092be17/view/movie/M/302270922.mp4","trailerTitle":"淘气大侦探\n    电视版2","trailerDate":"2018-02-28","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2514894958.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/e22de4ce197b69f8f50e3a29047d3564/view/movie/M/302280762.mp4","trailerTitle":"淘气大侦探\n    片段","trailerDate":"2018-03-17","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2516505468.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/5405bec70ad0a5da9b4b00310ce5bd0e/view/movie/M/302280312.mp4","trailerTitle":"淘气大侦探\n    花絮：动画制作 (中文字幕)","trailerDate":"2018-03-08","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2515703990.jpg?"}],"id":"26660063","trailerTitle":"淘气大侦探 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111901/265baea631f379b6e200a80089e42f96/view/movie/M/301720324.mp4","trailerTitle":"玛雅蜜蜂历险记\n    预告片1","trailerDate":"2015-03-05","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2230990335.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/64306f1e1fbf1a3f1660b148098f3cdb/view/movie/M/301620001.mp4","trailerTitle":"玛雅蜜蜂历险记\n    德国预告片2","trailerDate":"2014-08-29","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2198023743.jpg?"}],"id":"25881500","trailerTitle":"玛雅蜜蜂历险记 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111901/69647cdda8c31554bcfd6a881f7fd4ca/view/movie/M/402320918.mp4","trailerTitle":"兄弟班\n    预告片2：前朋友版 (中文字幕)","trailerDate":"2018-06-26","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526216606.jpg?1529987939"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/42f53b770b13c54d45c1581f6a642213/view/movie/M/402320602.mp4","trailerTitle":"兄弟班\n    预告片3 (中文字幕)","trailerDate":"2018-06-19","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2525526202.jpg?1529993717"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/9a1c00a47a0c63906a2e702deeac8aad/view/movie/M/402320317.mp4","trailerTitle":"兄弟班\n    内地预告片4 (中文字幕)","trailerDate":"2018-06-12","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2524715061.jpg?1528795585"}],"id":"26988003","trailerTitle":"兄弟班 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111901/e371ddb7d53feaff86dbc80abd231e86/view/movie/M/302280258.mp4","trailerTitle":"午夜幽灵\n    先行版 (中文字幕)","trailerDate":"2018-03-07","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2515614481.jpg?"}],"id":"30128986","trailerTitle":"午夜幽灵 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111901/596f3f3f685361999040f4f5efd4e62e/view/movie/M/402330040.mp4","trailerTitle":"汪星卧底\n    中国预告片1：定档版 (中文字幕)","trailerDate":"2018-06-28","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2526407588.jpg?1530170199"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/66accae78bb1de019cca5283c69f74b0/view/movie/M/302280324.mp4","trailerTitle":"汪星卧底\n    预告片2","trailerDate":"2018-03-09","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2515743422.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/9abcccce193af5527abc24cbb98f50af/view/movie/M/302260112.mp4","trailerTitle":"汪星卧底\n    预告片3","trailerDate":"2018-01-13","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2510465859.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/92d6d95f97d9fc9e354a6d311ebc3a6f/view/movie/M/402330285.mp4","trailerTitle":"汪星卧底\n    其它花絮：采访特辑 (中文字幕)","trailerDate":"2018-07-04","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2526986777.jpg?1530699005"}],"id":"26930056","trailerTitle":"汪星卧底 视频"},{"trailerArray":[],"id":"30176525","trailerTitle":"深海历险记 视频"},{"trailerArray":[],"id":"30262110","trailerTitle":"闺蜜的战争 视频"},{"trailerArray":[],"id":"27158277","trailerTitle":"产科男生 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111901/5d30252a0b9af185c76cb193a6f44c52/view/movie/M/402330325.mp4","trailerTitle":"狄仁杰之四大天王\n    预告片1：背水一战版 (中文字幕)","trailerDate":"2018-07-05","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2527054753.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/05c56fb1f9573824f064917ae341a05b/view/movie/M/402320838.mp4","trailerTitle":"狄仁杰之四大天王\n    预告片2：天王现身版 (中文字幕)","trailerDate":"2018-06-25","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526137676.jpg?1529911031"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/a7a023db8cf59b555ca28e0f7b4dfeb6/view/movie/M/302210792.mp4","trailerTitle":"狄仁杰之四大天王\n    预告片3：真相不白版 (中文字幕)","trailerDate":"2017-09-22","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2499767152.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/0c67015a629ccc01c1f01ea3ce7001d1/view/movie/M/402300245.mp4","trailerTitle":"狄仁杰之四大天王\n    先行版 (中文字幕)","trailerDate":"2018-04-25","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2520334127.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/03f92aa92157a6ff8e14d17d98c726d5/view/movie/M/402320616.mp4","trailerTitle":"狄仁杰之四大天王\n    其它预告片：大唐神器亢龙锏 (中文字幕)","trailerDate":"2018-06-20","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2525590378.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/f6d504e1eeabf510e93e51017d95342c/view/movie/M/402330067.mp4","trailerTitle":"狄仁杰之四大天王\n    花絮3 (中文字幕)","trailerDate":"2018-06-28","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2526441668.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/f771ee48aa009af40836d494ed0b2575/view/movie/M/402320984.mp4","trailerTitle":"狄仁杰之四大天王\n    花絮4：武则天特辑 (中文字幕)","trailerDate":"2018-06-27","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526314013.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/dbb506eb7440e44c64fa7f7eea01686c/view/movie/M/402310450.mp4","trailerTitle":"狄仁杰之四大天王\n    花絮5：神探回归特辑 (中文字幕)","trailerDate":"2018-05-24","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2522954430.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/32fe838512bed870cb58ab3474bc0ae5/view/movie/M/402320624.mp4","trailerTitle":"狄仁杰之四大天王\n    其它花絮： IMAX推荐特辑 (中文字幕)","trailerDate":"2018-06-20","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2525591834.jpg?"}],"id":"25882296","trailerTitle":"狄仁杰之四大天王 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111901/e786dbb1f902e7b8c41b40b5a9ad4693/view/movie/M/402320859.mp4","trailerTitle":"西虹市首富\n    预告片2：主创推荐版 (中文字幕)","trailerDate":"2018-06-25","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526149462.jpg?1529918217"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/4d0463d46071c78355fc78ad8b12e79d/view/movie/M/402320030.mp4","trailerTitle":"西虹市首富\n    预告片3：特笑版 (中文字幕)","trailerDate":"2018-06-06","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2524221309.jpg?1528356230"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/38c25deef8fc6b966dde10dea0f77133/view/movie/M/402310173.mp4","trailerTitle":"西虹市首富\n    预告片4：特笑大片","trailerDate":"2018-05-18","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2522456574.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/bdc9a63977830ce3d131668fc3b366df/view/movie/M/402330327.mp4","trailerTitle":"西虹市首富\n    其它预告片 (中文字幕)","trailerDate":"2018-07-05","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2527062942.jpg?1530774020"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/95f583408e3e990f0e38c8df18dbe5a3/view/movie/M/402320506.mp4","trailerTitle":"西虹市首富\n    花絮：魔音特辑 (中文字幕)","trailerDate":"2018-06-15","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2525046609.jpg?"}],"id":"27605698","trailerTitle":"西虹市首富 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111901/bf9b5ba67220528a145f05477c6aa88b/view/movie/M/402310757.mp4","trailerTitle":"昨日青空\n    预告片1 (中文字幕)","trailerDate":"2018-06-01","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2523696213.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/721f213c27b4f26e0a569a5c8239809f/view/movie/M/302200018.mp4","trailerTitle":"昨日青空\n    预告片2 (中文字幕)","trailerDate":"2017-08-03","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2494953073.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/7a48afd916d0dc005eddd0deb0b99a43/view/movie/M/402330179.mp4","trailerTitle":"昨日青空\n    MV1：青春告白曲《来不及勇敢》 (中文字幕)","trailerDate":"2018-07-02","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526778622.jpg?1530511790"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/76493f1442e9380f03a4e7e558d63ffa/view/movie/M/402330106.mp4","trailerTitle":"昨日青空\n    MV2：毕业曲《再见昨天》 (中文字幕)","trailerDate":"2018-06-29","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526493695.jpg?1530257976"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/b116445c1f76dcb3b847c99b07245565/view/movie/M/402310929.mp4","trailerTitle":"昨日青空\n    MV3：青春毕业曲《再见昨天》 (中文字幕)","trailerDate":"2018-06-05","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2524048767.jpg?"}],"id":"26290410","trailerTitle":"昨日青空 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111901/348a3ad6803c9f56387ab95303fc0890/view/movie/M/402310755.mp4","trailerTitle":"神奇马戏团之动物饼干\n    中国预告片1：魔力版 (中文字幕)","trailerDate":"2018-06-01","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2523696073.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/cb05adf68b35d21c8062fc0b2bde35d5/view/movie/M/402300450.mp4","trailerTitle":"神奇马戏团之动物饼干\n    预告片2：定档版 (中文字幕)","trailerDate":"2018-05-03","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2521045753.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111901/bd537e7d6b34eb47a727e9bf5b5dedc0/view/movie/M/402320680.mp4","trailerTitle":"神奇马戏团之动物饼干\n    MV：宣传曲《嗷嗷嗷》 (中文字幕)","trailerDate":"2018-06-21","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2525717146.jpg?1529902562"}],"id":"26253783","trailerTitle":"神奇马戏团之动物饼干 视频"},{"trailerArray":[],"id":"30263334","trailerTitle":"解剖室灵异事件之男生宿舍 视频"},{"trailerArray":[],"id":"26754880","trailerTitle":"萌学园：寻找盘古 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111902/07c2155ff5b144320f0c2b2a3b5315d3/view/movie/M/402310669.mp4","trailerTitle":"解码游戏\n    预告片：大神现世版 (中文字幕)","trailerDate":"2018-05-30","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2523517744.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/cae474fa57341d4e83a006a0d6d8a726/view/movie/M/402330284.mp4","trailerTitle":"解码游戏\n    花絮2：李媛特辑 (中文字幕)","trailerDate":"2018-07-04","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2526986589.jpg?1530699078"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/4d66bf83745fa58b98e0be2662e5187f/view/movie/M/402320981.mp4","trailerTitle":"解码游戏\n    花絮3：男友力大pk特辑 (中文字幕)","trailerDate":"2018-06-27","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2526313658.jpg?1530076772"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/4271b642524b4c5bec2f1852ff7655ea/view/movie/M/402320683.mp4","trailerTitle":"解码游戏\n    MV：同名主题曲 (中文字幕)","trailerDate":"2018-06-21","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2525717198.jpg?1529902495"}],"id":"26767512","trailerTitle":"解码游戏 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111902/8890a93685236d551e15c54908a85a2b/view/movie/M/402320186.mp4","trailerTitle":"神秘世界历险记4\n    预告片1：风波将起版 (中文字幕)","trailerDate":"2018-06-08","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2524335499.jpg?1528456458"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/dfe7277c23905a0b97878bf9ff53573f/view/movie/M/402320185.mp4","trailerTitle":"神秘世界历险记4\n    预告片2：角色版 (中文字幕)","trailerDate":"2018-06-08","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2524335425.jpg?1528456487"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/2ee2fc756e1b34d1bb9bb815e8c7d77a/view/movie/M/402320183.mp4","trailerTitle":"神秘世界历险记4\n    预告片3：六一快乐版 (中文字幕)","trailerDate":"2018-06-08","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2524334799.jpg?1528456540"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/92ce3a0dc84b69826ce359350cbd0079/view/movie/M/402320184.mp4","trailerTitle":"神秘世界历险记4\n    花絮：幕后特辑 (中文字幕)","trailerDate":"2018-06-08","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2524335305.jpg?"}],"id":"30208005","trailerTitle":"神秘世界历险记4 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111902/e705729f46f67676b6f7255676f7c1d8/view/movie/M/402320715.mp4","trailerTitle":"肆式青春\n    预告片1","trailerDate":"2018-06-22","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2525800819.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/2313b66842609b53d3c8505259224662/view/movie/M/402310622.mp4","trailerTitle":"肆式青春\n    中国预告片2 (中文字幕)","trailerDate":"2018-05-29","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2523441488.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/1fcdc2893f9789c34ac82235d01b8b70/view/movie/M/402310517.mp4","trailerTitle":"肆式青春\n    预告片3","trailerDate":"2018-05-25","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2523039223.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/27b5df05a4cc81187c64af4ca9675e89/view/movie/M/402280991.mp4","trailerTitle":"肆式青春\n    预告片4 (中文字幕)","trailerDate":"2018-03-22","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2517027092.jpg?"}],"id":"30156898","trailerTitle":"肆式青春 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111902/91f9fd466170fc40ab3b3940b9e4b4bf/view/movie/M/402300863.mp4","trailerTitle":"一出好戏\n    预告片：欢迎光临版 (中文字幕)","trailerDate":"2018-05-11","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2521811714.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/8dbbcde01dea6966db8dceca4d6a3960/view/movie/M/402300067.mp4","trailerTitle":"一出好戏\n    其它预告片1：档期解锁 (中文字幕)","trailerDate":"2018-04-20","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2519821728.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/f99634059ecfade11850ef5a8b118493/view/movie/M/302270730.mp4","trailerTitle":"一出好戏\n    其它预告片2：孙红雷狗年送祝福 (中文字幕)","trailerDate":"2018-02-22","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2514261002.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/6485540778162f1c501187d4a463baca/view/movie/M/402310717.mp4","trailerTitle":"一出好戏\n    花絮：幕后特辑 (中文字幕)","trailerDate":"2018-05-31","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2523607806.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/726da7a3662463bbac78b086f46d930b/view/movie/M/302260838.mp4","trailerTitle":"一出好戏\n    其它花絮：黄渤特辑 (中文字幕)","trailerDate":"2018-01-30","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2512140439.jpg?"}],"id":"26985127","trailerTitle":"一出好戏 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111902/1ee962536d68967cdd706dddba0ae2f4/view/movie/M/402320102.mp4","trailerTitle":"爱情公寓\n    MV：主题曲《我的未来式》 (中文字幕)","trailerDate":"2018-06-07","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2524231956.jpg?1528357458"}],"id":"24852545","trailerTitle":"爱情公寓 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111902/040f61bb3125d78820b9eecff2909426/view/movie/M/402320560.mp4","trailerTitle":"巨齿鲨\n    中国预告片1：深海争锋版 (中文字幕)","trailerDate":"2018-06-18","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2525296817.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/05a4c14b40e527a4067d2fc1cb74154f/view/movie/M/402310860.mp4","trailerTitle":"巨齿鲨\n    预告片2：绝命巨鲨版","trailerDate":"2018-06-04","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2523962188.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/3415016f8460e6e3d5e12b6998935794/view/movie/M/402310859.mp4","trailerTitle":"巨齿鲨\n    预告片3：巨浪淘鲨版","trailerDate":"2018-06-04","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2523962107.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/6de194fccee44f7a56468711825fe5b9/view/movie/M/402290674.mp4","trailerTitle":"巨齿鲨\n    中国预告片4：深海降临版 (中文字幕)","trailerDate":"2018-04-11","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2518953365.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/db7a2214addc245a9f7261f8f3d9ff84/view/movie/M/402290631.mp4","trailerTitle":"巨齿鲨\n    台湾预告片5 (中文字幕)","trailerDate":"2018-04-10","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2518855241.jpg?"}],"id":"26426194","trailerTitle":"巨齿鲨 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111902/1ed8dd43cd4b136e0e90b1fb9421bbba/view/movie/M/402320632.mp4","trailerTitle":"美食大冒险之英雄烩\n    预告片2：国际版 (中文字幕)","trailerDate":"2018-06-20","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2525592313.jpg?1529902857"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/7a96ff9067db7e709dd1899d07d7c103/view/movie/M/402310753.mp4","trailerTitle":"美食大冒险之英雄烩\n    预告片3：定档版 (中文字幕)","trailerDate":"2018-06-01","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2523695739.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/611567a8bb9d442d07721f18321793f4/view/movie/M/402290860.mp4","trailerTitle":"美食大冒险之英雄烩\n    预告片4 (中文字幕)","trailerDate":"2018-04-16","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2519463473.jpg?"}],"id":"26290398","trailerTitle":"美食大冒险之英雄烩 视频"},{"trailerArray":[],"id":"30125089","trailerTitle":"勇者闯魔城 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111902/c7da4edc851a3c4d6b70501dac4c617a/view/movie/M/402320626.mp4","trailerTitle":"大轰炸\n    预告片1：对抗版 (中文字幕)","trailerDate":"2018-06-20","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2525591935.jpg?1529903005"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/fa9743694eb6587087e7454d62b49525/view/movie/M/402310094.mp4","trailerTitle":"大轰炸\n    预告片2：不屈版 (中文字幕)","trailerDate":"2018-05-17","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2522332973.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/cfdd2e034bff3d0d67be321365d127d0/view/movie/M/402320633.mp4","trailerTitle":"大轰炸\n    花絮2：品质特辑 (中文字幕)","trailerDate":"2018-06-20","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2525592869.jpg?1529902824"}],"id":"26331700","trailerTitle":"大轰炸 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111902/473dc06be22423463fe7a3daefc7d521/view/movie/M/402290343.mp4","trailerTitle":"如影随心\n    预告片 (中文字幕)","trailerDate":"2018-04-02","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2518071792.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/9c44ee1ad74031ccc58779fe2a65e4d3/view/movie/M/402330185.mp4","trailerTitle":"如影随心\n    MV：主题曲《两个人一个人》 (中文字幕)","trailerDate":"2018-07-02","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2526780629.jpg?1530512588"}],"id":"26871669","trailerTitle":"如影随心 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111902/9e95c3f11202e775edcfb216cfa50a66/view/movie/M/302280408.mp4","trailerTitle":"快把我哥带走\n    预告片1：“贱”笑版 (中文字幕)","trailerDate":"2018-03-12","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2516067315.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/c772af70e629f1fc81504ed2a684352a/view/movie/M/402320449.mp4","trailerTitle":"快把我哥带走\n    预告片2 (中文字幕)","trailerDate":"2018-06-14","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2524962262.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/330347a8b1cb389938dc28b7472bb972/view/movie/M/402330175.mp4","trailerTitle":"快把我哥带走\n    其它预告片1 (中文字幕)","trailerDate":"2018-07-02","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526777801.jpg?1530512211"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/657bd898dddb2036be6c2f7a9f2d537b/view/movie/M/402330174.mp4","trailerTitle":"快把我哥带走\n    其它预告片2 (中文字幕)","trailerDate":"2018-07-02","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526777252.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/292d866ff301df9b4e222052cb8f4402/view/movie/M/402330097.mp4","trailerTitle":"快把我哥带走\n    其它预告片3 (中文字幕)","trailerDate":"2018-06-29","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526492295.jpg?1530260716"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/de3f523dbcc01374e010817be986a3ee/view/movie/M/402330037.mp4","trailerTitle":"快把我哥带走\n    其它预告片4 (中文字幕)","trailerDate":"2018-06-28","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526407241.jpg?1530242478"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/988b638651de060677038039e0adda15/view/movie/M/402320552.mp4","trailerTitle":"快把我哥带走\n    其它预告片5：耍贱合集 (中文字幕)","trailerDate":"2018-06-16","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2525143961.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/abff17ae0dc9325e85b6b97a74d945da/view/movie/M/402330288.mp4","trailerTitle":"快把我哥带走\n    片段：游戏黑洞 (中文字幕)","trailerDate":"2018-07-04","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526987283.jpg?1530696817"}],"id":"30122633","trailerTitle":"快把我哥带走 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111902/cdec2ef9c3dfd3874f2d052bee5448b7/view/movie/M/402320839.mp4","trailerTitle":"未来机器城\n    预告片：定档版 (中文字幕)","trailerDate":"2018-06-25","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526137673.jpg?1529910998"}],"id":"27200988","trailerTitle":"未来机器城 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111902/4f79fca96789a307bd81a40384986a28/view/movie/M/402320746.mp4","trailerTitle":"大师兄\n    香港预告片 (中文字幕)","trailerDate":"2018-06-22","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2525832878.jpg?1529923579"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/cda55db77b9e5fc11861e51c23c2bd3a/view/movie/M/402320814.mp4","trailerTitle":"大师兄\n    内地先行版 (中文字幕)","trailerDate":"2018-06-25","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526121745.jpg?1529901332"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/29545fd42cea78e4f54fcf3dfba3ebab/view/movie/M/402330181.mp4","trailerTitle":"大师兄\n    其它预告片：朝阳群众有话说 (中文字幕)","trailerDate":"2018-07-02","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526779084.jpg?1530511648"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/20a402a3e0ab8aef04b35295a73b4635/view/movie/M/402330323.mp4","trailerTitle":"大师兄\n    花絮：甄子丹特辑 (中文字幕)","trailerDate":"2018-07-05","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2527053943.jpg?"}],"id":"27201353","trailerTitle":"大师兄 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111902/12d71868f6002a8d52dff472b88270a3/view/movie/M/402320753.mp4","trailerTitle":"最后的棒棒\n    先行版","trailerDate":"2018-06-22","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2525865391.jpg?1529667145"}],"id":"30254589","trailerTitle":"最后的棒棒 视频"},{"trailerArray":[],"id":"30246086","trailerTitle":"他是一只狗 视频"},{"trailerArray":[],"id":"24743257","trailerTitle":"冷恋时代 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111902/7f50ddb2c19ced1071b0d15294b85df9/view/movie/M/402310593.mp4","trailerTitle":"大三儿\n    先行版 (中文字幕)","trailerDate":"2018-05-29","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2523431559.jpg?"}],"id":"27119292","trailerTitle":"大三儿 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111902/c73de7af014a0611da958a7144bd7401/view/movie/M/402310603.mp4","trailerTitle":"反贪风暴3\n    内地先行版 (中文字幕)","trailerDate":"2018-05-29","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2523439239.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/3063b91731535cee14d674ca2361c5b7/view/movie/M/402330043.mp4","trailerTitle":"反贪风暴3\n    花絮 (中文字幕)","trailerDate":"2018-06-28","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526407834.jpg?1530170051"}],"id":"26996640","trailerTitle":"反贪风暴3 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111902/a08a03a7c73d906687d622a18c99055c/view/movie/M/402310602.mp4","trailerTitle":"七袋米\n    中国预告片1 (中文字幕)","trailerDate":"2018-05-29","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2523437292.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/883d04439b0552dae29b52c4f1f87691/view/movie/M/402310600.mp4","trailerTitle":"七袋米\n    中国预告片2：催泪版 (中文字幕)","trailerDate":"2018-05-29","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2523437129.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/2cad96bba13b5af5915af8d270900b88/view/movie/M/402310601.mp4","trailerTitle":"七袋米\n    MV：主题曲《四月》 (中文字幕)","trailerDate":"2018-05-29","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2523437007.jpg?"}],"id":"26881698","trailerTitle":"七袋米 视频"},{"trailerArray":[],"id":"30199575","trailerTitle":"让我怎么相信你 视频"},{"trailerArray":[],"id":"26954268","trailerTitle":"道高一丈 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111902/e02c616f6b2816286e653f41eca827e4/view/movie/M/402330283.mp4","trailerTitle":"有五个姐姐的我就注定要单身了啊\n    预告片：定档版 (中文字幕)","trailerDate":"2018-07-04","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526986491.jpg?1530699098"}],"id":"26730542","trailerTitle":"有五个姐姐的我就注定要单身了啊 视频"},{"trailerArray":[],"id":"30237381","trailerTitle":"惊慌失色之诡寓 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111902/106cb7ef5b8bef7fdaee4d91dbb82ef6/view/movie/M/402330281.mp4","trailerTitle":"天下第一镖局\n    预告片：定档版 (中文字幕)","trailerDate":"2018-07-04","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2526986088.jpg?1530699144"},{"trailerMP4":"http://vt1.doubanio.com/201807111902/2c7c583e5ff151e1ac49861fbdc46c39/view/movie/M/402310921.mp4","trailerTitle":"天下第一镖局\n    先行版 (中文字幕)","trailerDate":"2018-06-05","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2524048176.jpg?"}],"id":"27107604","trailerTitle":"天下第一镖局 视频"},{"trailerArray":[],"id":"30236775","trailerTitle":"旅行吧！井底之蛙 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111903/696522c4b10e862126a1d1368f12dc9a/view/movie/M/402310244.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    台湾预告片1 (中文字幕)","trailerDate":"2018-05-21","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2522690761.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/aa6756e80dcadd97b228a098d22fed58/view/movie/M/402310243.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    台湾预告片2 (中文字幕)","trailerDate":"2018-05-21","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2522690659.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/c203acf4651f30cbd915b3f8e6a434b5/view/movie/M/402300391.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    预告片3","trailerDate":"2018-05-02","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2520904160.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/c2de7a797ad4b4d701932c4859e146fc/view/movie/M/402300390.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    中国预告片4 (中文字幕)","trailerDate":"2018-05-01","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2520897188.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/121edf13db074429dbab466d7fb26f93/view/movie/M/402300388.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    台湾预告片5 (中文字幕)","trailerDate":"2018-05-01","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2520895522.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/73ba3b0aac223caed01e3cbdfd83e37d/view/movie/M/402300384.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    先行版1","trailerDate":"2018-05-01","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2520829861.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/47c84cbe1bfcd3b69c799ec7e657f857/view/movie/M/302260958.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    中国先行版2 (中文字幕)","trailerDate":"2018-02-01","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2512327887.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/3f7e859b4be8346a236e5832deae36bc/view/movie/M/302260876.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    台湾先行版3 (中文字幕)","trailerDate":"2018-01-30","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2512190538.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/53f889f08bc7a800be3064a34b2eeb99/view/movie/M/302190971.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    先行版4：Now in Production","trailerDate":"2017-08-02","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2494800564.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/3940ee8604806b4f0fa335119d196a3a/view/movie/M/402320762.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    电视版1 (中文字幕)","trailerDate":"2018-06-22","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2525870676.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/fe9412fadb26e5a00fda04fc067bf133/view/movie/M/402320096.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    电视版2 (中文字幕)","trailerDate":"2018-06-07","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2524226591.jpg?1528366208"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/7f4e444b28bb514d2b3ce89f57bebd35/view/movie/M/402310888.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    电视版3 (中文字幕)","trailerDate":"2018-06-04","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2523992127.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/9b07f59b21e23e203985b1e8ad5b2bd8/view/movie/M/402310774.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    电视版4 (中文字幕)","trailerDate":"2018-06-01","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2523699590.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/47b3237abff5a950adfccd733e1ee1dc/view/movie/M/402320608.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    其它预告片1 (中文字幕)","trailerDate":"2018-06-19","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2525548656.jpg?1529993659"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/da3bfc6f67c3b6a1469d577844b8ae3c/view/movie/M/402310380.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    其它预告片2 (中文字幕)","trailerDate":"2018-05-23","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2522889172.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/5559481ac2df27d6488c5474815ceae1/view/movie/M/402330195.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    花絮1 (中文字幕)","trailerDate":"2018-07-02","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2526795217.jpg?1530520165"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/0195faece712ccc69b7a1afc8018dce7/view/movie/M/402330197.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    花絮2 (中文字幕)","trailerDate":"2018-07-02","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526795871.jpg?1530520144"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/2266797e19ab3112329118d68eca84f7/view/movie/M/402320566.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    其它花絮1 (中文字幕)","trailerDate":"2018-06-18","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2525357509.jpg?1529990934"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/5d214acfa626deeacb5c52fa05ea6e2d/view/movie/M/402320567.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    其它花絮2 (中文字幕)","trailerDate":"2018-06-18","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2525357787.jpg?1529990963"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/d082db7cf82770974c4a20dc712b3f2a/view/movie/M/402320460.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    其它花絮3 (中文字幕)","trailerDate":"2018-06-14","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2524978631.jpg?1528966183"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/2f096f3be8da09e2387f20cfd88b2082/view/movie/M/402320048.mp4","trailerTitle":"蚁人2：黄蜂女现身\n    其它花絮4 (中文字幕)","trailerDate":"2018-06-06","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2524154671.jpg?1528340863"}],"id":"26636712","trailerTitle":"蚁人2：黄蜂女现身 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111903/78e1f18a55248521afbcb2e19ed32adb/view/movie/M/302240983.mp4","trailerTitle":"我，花样女王\n    台湾预告片1 (中文字幕)","trailerDate":"2017-12-12","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2507488558.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/406a08e213fa2c3bd7aa5280dca48b24/view/movie/M/302230359.mp4","trailerTitle":"我，花样女王\n    预告片2：限制级","trailerDate":"2017-11-02","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2503800758.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/80f0c3d327787740985b5a3682b78a4d/view/movie/M/302240643.mp4","trailerTitle":"我，花样女王\n    香港先行版 (中文字幕)","trailerDate":"2017-12-05","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2506804809.jpg?"}],"id":"26756049","trailerTitle":"我，花样女王 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111903/155d81828202cda80c067763ee1b3543/view/movie/M/402310259.mp4","trailerTitle":"碟中谍6：全面瓦解\n    香港预告片1 (中文字幕)","trailerDate":"2018-05-21","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2522725463.jpg?1528734001"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/f5e181ef8902de6bc4da22af363caa8a/view/movie/M/402310252.mp4","trailerTitle":"碟中谍6：全面瓦解\n    中国预告片2 (中文字幕)","trailerDate":"2018-05-21","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2522708331.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/2416722254646182845aa01aa9976ef4/view/movie/M/402310247.mp4","trailerTitle":"碟中谍6：全面瓦解\n    台湾预告片3 (中文字幕)","trailerDate":"2018-05-21","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2522708104.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/c9b391a6d9427929ca1920a2df3d4e0f/view/movie/M/402310045.mp4","trailerTitle":"碟中谍6：全面瓦解\n    预告片4","trailerDate":"2018-05-16","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2522268915.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/f43e61dd20bbfdff65c3e783efd37aa4/view/movie/M/302270152.mp4","trailerTitle":"碟中谍6：全面瓦解\n    中国预告片5 (中文字幕)","trailerDate":"2018-02-05","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2512745509.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/6f76c71f025c72cc9dfb23af67b65ea4/view/movie/M/402320695.mp4","trailerTitle":"碟中谍6：全面瓦解\n    电视版1 (中文字幕)","trailerDate":"2018-06-21","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2525740012.jpg?1529554444"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/046624d5519d22d3d72f2a63a089461d/view/movie/M/402320287.mp4","trailerTitle":"碟中谍6：全面瓦解\n    电视版2 (中文字幕)","trailerDate":"2018-06-12","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2524688249.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/61fa498a52c755801b176f4c62be9b65/view/movie/M/402320349.mp4","trailerTitle":"碟中谍6：全面瓦解\n    电视版3 (中文字幕)","trailerDate":"2018-06-12","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2524812967.jpg?1528959304"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/eff6b3c76630a2900c6338408941da9b/view/movie/M/302270139.mp4","trailerTitle":"碟中谍6：全面瓦解\n    电视版4：超级碗版 (中文字幕)","trailerDate":"2018-02-05","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2512712810.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/9c10c837a900def58c508a52c6b5dcdc/view/movie/M/402330171.mp4","trailerTitle":"碟中谍6：全面瓦解\n    花絮2 (中文字幕)","trailerDate":"2018-07-02","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526770385.jpg?1530512303"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/58056def8c190b878115c431fe41f39d/view/movie/M/402330063.mp4","trailerTitle":"碟中谍6：全面瓦解\n    花絮3 (中文字幕)","trailerDate":"2018-06-28","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526438961.jpg?1530611145"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/159fa0a4f383a57ff6c3668cf046dfe6/view/movie/M/402310865.mp4","trailerTitle":"碟中谍6：全面瓦解\n    花絮4 (中文字幕)","trailerDate":"2018-06-04","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2523962699.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/1fe7a2feda82e3798babda2831101eba/view/movie/M/302270314.mp4","trailerTitle":"碟中谍6：全面瓦解\n    花絮5：真刀实枪特辑 (中文字幕)","trailerDate":"2018-02-08","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2512990789.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/9c73a99063592ef4f3743737acb16937/view/movie/M/302260928.mp4","trailerTitle":"碟中谍6：全面瓦解\n    其它花絮：诺顿秀特辑 (中文字幕)","trailerDate":"2018-01-31","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2512246703.jpg?"}],"id":"26336252","trailerTitle":"碟中谍6：全面瓦解 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111903/3cbddf800baaf6df8bca7aa30457b1fc/view/movie/M/402300144.mp4","trailerTitle":"镰仓物语\n    香港预告片1 (中文字幕)","trailerDate":"2018-04-23","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2520132966.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/1229509891a63a0e8de99aaf951f6da0/view/movie/M/302180731.mp4","trailerTitle":"镰仓物语\n    日本预告片2","trailerDate":"2017-07-04","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2480586560.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/7f5f794898b005d720cec90a1cc4871f/view/movie/M/302240151.mp4","trailerTitle":"镰仓物语\n    电视版1","trailerDate":"2017-11-22","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2505617813.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/dccab365fa91d732e72b2ae533e16e9c/view/movie/M/302240147.mp4","trailerTitle":"镰仓物语\n    电视版2","trailerDate":"2017-11-22","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2505617052.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/95af18be1f44dc6198a431dcf71ce4ac/view/movie/M/302240149.mp4","trailerTitle":"镰仓物语\n    电视版3","trailerDate":"2017-11-22","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2505617406.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/bee4b2935412fbd3f2bedeb37cb5cf2d/view/movie/M/402300819.mp4","trailerTitle":"镰仓物语\n    花絮1","trailerDate":"2018-05-10","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2521733372.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/d44ae84ad3557722cdc95926d886ef97/view/movie/M/402300697.mp4","trailerTitle":"镰仓物语\n    花絮2","trailerDate":"2018-05-09","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2521614649.jpg?"}],"id":"26916229","trailerTitle":"镰仓物语 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111903/6f111dfca744911f7143b34cc008d4de/view/movie/M/402310782.mp4","trailerTitle":"影\n    预告片：当局不迷版 (中文字幕)","trailerDate":"2018-06-01","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2523705700.jpg?"}],"id":"4864908","trailerTitle":"影 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111903/a9bdda1944f849e499c37e838947314c/view/movie/M/402310509.mp4","trailerTitle":"边境杀手2：边境战士\n    预告片1","trailerDate":"2018-05-25","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2523018626.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/9907c72eb191af8319796768703a4bce/view/movie/M/302280839.mp4","trailerTitle":"边境杀手2：边境战士\n    预告片2","trailerDate":"2018-03-20","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2516829974.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/985f336769354d0fa06ddcda67b0a45d/view/movie/M/302270424.mp4","trailerTitle":"边境杀手2：边境战士\n    台湾预告片3 (中文字幕)","trailerDate":"2018-02-11","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2513246682.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/370e2554978586c63251f5a652a249a2/view/movie/M/302250252.mp4","trailerTitle":"边境杀手2：边境战士\n    先行版","trailerDate":"2017-12-20","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2508146897.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/d04b288664b96f6458eb17f44a9d1b69/view/movie/M/402330085.mp4","trailerTitle":"边境杀手2：边境战士\n    片段1","trailerDate":"2018-06-29","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526470693.jpg?1530521090"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/45f570cf6209d051e993069f17623ac6/view/movie/M/402320439.mp4","trailerTitle":"边境杀手2：边境战士\n    片段2","trailerDate":"2018-06-14","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2524960739.jpg?1528954329"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/f051c95ad5217c34c2779c26e9122dc9/view/movie/M/402320443.mp4","trailerTitle":"边境杀手2：边境战士\n    片段3","trailerDate":"2018-06-14","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2524961022.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/581ed39fb95c4f0f1a3329bbc95c5724/view/movie/M/402310996.mp4","trailerTitle":"边境杀手2：边境战士\n    片段4","trailerDate":"2018-06-06","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2524107984.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/ecf76bc40edd7549676e67002ba3678c/view/movie/M/402310792.mp4","trailerTitle":"边境杀手2：边境战士\n    片段5","trailerDate":"2018-06-02","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2523735623.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/4a5958d4cbf248da8152b1431bf541b1/view/movie/M/402320713.mp4","trailerTitle":"边境杀手2：边境战士\n    花絮1","trailerDate":"2018-06-22","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2525801255.jpg?1529990491"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/5bca54adc1ceaea3b8280e4adc190cca/view/movie/M/402320425.mp4","trailerTitle":"边境杀手2：边境战士\n    花絮2","trailerDate":"2018-06-14","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2524940124.jpg?1528956797"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/e20b390ec549b76a2cfbae94eb936efa/view/movie/M/402320410.mp4","trailerTitle":"边境杀手2：边境战士\n    花絮3","trailerDate":"2018-06-14","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2524931093.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/72d144aab3190bb53666695ab04114fa/view/movie/M/402320411.mp4","trailerTitle":"边境杀手2：边境战士\n    花絮4","trailerDate":"2018-06-14","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2524931201.jpg?1528957737"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/b8651ad4352327708d9f797fc6254855/view/movie/M/402330012.mp4","trailerTitle":"边境杀手2：边境战士\n    其它花絮","trailerDate":"2018-06-28","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526381946.jpg?"}],"id":"26627736","trailerTitle":"边境杀手2：边境战士 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111903/130d15a5a48d018f99838c5c2adbcaed/view/movie/M/402310720.mp4","trailerTitle":"营救汪星人\n    预告片1：国际版 (中文字幕)","trailerDate":"2018-05-31","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2523608745.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/b1e6d4947c1e31d1d1ef1f07755d4528/view/movie/M/402300452.mp4","trailerTitle":"营救汪星人\n    预告片2：三妹博美版 (中文字幕)","trailerDate":"2018-05-03","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2521045788.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/6c2c74c9fc79a9959db25042ebb593df/view/movie/M/302260985.mp4","trailerTitle":"营救汪星人\n    预告片3：休想上映版 (中文字幕)","trailerDate":"2018-02-01","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2512353485.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/1972cc846b0d9c5baa244987402114ee/view/movie/M/302240021.mp4","trailerTitle":"营救汪星人\n    预告片4：哈士奇版 (中文字幕)","trailerDate":"2017-11-17","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2505200235.jpg?"}],"id":"26930565","trailerTitle":"营救汪星人 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111903/397bd9bc91f2731e88d2456d930e78d0/view/movie/M/402310886.mp4","trailerTitle":"找到你\n    先行版 (中文字幕)","trailerDate":"2018-06-04","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2523989295.jpg?"}],"id":"27140071","trailerTitle":"找到你 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111903/355d88cdf424b2971b22f3b99246a712/view/movie/M/302070856.mp4","trailerTitle":"断片之险途夺宝\n    先行版 (中文字幕)","trailerDate":"2016-11-27","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2400698056.jpg?"}],"id":"26882457","trailerTitle":"断片之险途夺宝 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111903/af163358f59454cf0897515f51f37060/view/movie/M/402310098.mp4","trailerTitle":"新乌龙院之笑闹江湖\n    预告片：唤醒版 (中文字幕)","trailerDate":"2018-05-17","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2522333392.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/bf94e23158b4814ebd19ba8c92b3916e/view/movie/M/402320099.mp4","trailerTitle":"新乌龙院之笑闹江湖\n    先行版 (中文字幕)","trailerDate":"2018-06-07","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2524231042.jpg?1528357536"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/812a4d14b307edba535f4c31d76ec557/view/movie/M/402320682.mp4","trailerTitle":"新乌龙院之笑闹江湖\n    花絮1：坏人特辑 (中文字幕)","trailerDate":"2018-06-21","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2525717177.jpg?1529902516"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/941ef6dacb2f4d038fd0d6b1790c9133/view/movie/M/402320362.mp4","trailerTitle":"新乌龙院之笑闹江湖\n    花絮2 (中文字幕)","trailerDate":"2018-06-13","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2524828712.jpg?1528871154"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/231ab2eb606ca222d245b16e0473907d/view/movie/M/402320170.mp4","trailerTitle":"新乌龙院之笑闹江湖\n    花絮3：乌龙天团特辑 (中文字幕)","trailerDate":"2018-06-08","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2524312589.jpg?1528437545"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/ab9691eadc4f129121e81a3f7c28c74b/view/movie/M/402310599.mp4","trailerTitle":"新乌龙院之笑闹江湖\n    花絮4：新笑林小子特辑 (中文字幕)","trailerDate":"2018-05-29","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2523436517.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/f8fadf80cc40e9ea445df5f07cd227f3/view/movie/M/402310486.mp4","trailerTitle":"新乌龙院之笑闹江湖\n    花絮5：郝劭文回归特辑 (中文字幕)","trailerDate":"2018-05-24","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2522981766.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/722e2654eb568a35ffa9afb0aaaf186a/view/movie/M/402310341.mp4","trailerTitle":"新乌龙院之笑闹江湖\n    花絮6：催笑重聚特辑 (中文字幕)","trailerDate":"2018-05-22","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2522824057.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/74c51fe7a700719a9bf5735c76b66c43/view/movie/M/402320818.mp4","trailerTitle":"新乌龙院之笑闹江湖\n    MV：宣传曲《摆乌龙》 (中文字幕)","trailerDate":"2018-06-25","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526122443.jpg?1529902166"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/9b5aa6ebcc83c27bc97bebae4f1add30/view/movie/M/402330102.mp4","trailerTitle":"新乌龙院之笑闹江湖\n    其它花絮 (中文字幕)","trailerDate":"2018-06-29","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526492732.jpg?1530260767"}],"id":"26309969","trailerTitle":"新乌龙院之笑闹江湖 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111903/988484207b68bd9dd667b741994a7324/view/movie/M/302270157.mp4","trailerTitle":"墨多多谜境冒险\n    预告片：定档版 (中文字幕)","trailerDate":"2018-02-05","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2512721635.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/b8100d33780e471c3abfb32422499cbe/view/movie/M/402320448.mp4","trailerTitle":"墨多多谜境冒险\n    MV：主题曲《每当想起你》 (中文字幕)","trailerDate":"2018-06-14","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2524962295.jpg?1528951346"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/be1f96b9963218da96269d293b5f217c/view/movie/M/402310325.mp4","trailerTitle":"墨多多谜境冒险\n    其它花絮 (中文字幕)","trailerDate":"2018-05-22","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2522822477.jpg?"}],"id":"26790960","trailerTitle":"墨多多谜境冒险 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111903/c46ea08d1bb4121ab2a3ae4b85bfab25/view/movie/M/402280988.mp4","trailerTitle":"沉默的证人\n    先行版1 (中文字幕)","trailerDate":"2018-03-22","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2517025368.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/f07e809ff7e997f7c1f45bd7f00fe5ad/view/movie/M/302280608.mp4","trailerTitle":"沉默的证人\n    先行版2 (中文字幕)","trailerDate":"2018-03-14","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2516310364.jpg?"}],"id":"26816090","trailerTitle":"沉默的证人 视频"},{"trailerArray":[],"id":"26425062","trailerTitle":"武林怪兽 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111903/0f86e7257a207ed27d4165a02864851f/view/movie/M/302270304.mp4","trailerTitle":"真相漩涡\n    预告片","trailerDate":"2018-02-08","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2512964688.jpg?"}],"id":"26792540","trailerTitle":"真相漩涡 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111903/8b3ea0250124569a29bcdfd41ba5f18b/view/movie/M/302060474.mp4","trailerTitle":"苏丹\n    国际版预告片","trailerDate":"2016-10-31","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2393895989.jpg?"}],"id":"26728641","trailerTitle":"苏丹 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111903/636480153fb3927d97c1fe6c1cc2c6b5/view/movie/M/302270270.mp4","trailerTitle":"跨越8年的新娘\n    香港预告片1 (中文字幕)","trailerDate":"2018-02-07","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2512894167.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/4c1c3d4212b7398299ce841ebc792503/view/movie/M/302210477.mp4","trailerTitle":"跨越8年的新娘\n    日本预告片2","trailerDate":"2017-09-14","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2499034181.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/ca4956c2d6d3273e517971042ebad3f6/view/movie/M/302180159.mp4","trailerTitle":"跨越8年的新娘\n    日本先行版","trailerDate":"2017-06-15","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2462903840.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/1a1eb9ead7c0196509ec34e5dafde929/view/movie/M/402330287.mp4","trailerTitle":"跨越8年的新娘\n    其它预告片 (中文字幕)","trailerDate":"2018-07-04","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2526987120.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/e78e871eb3501fdbb699bcf2fe2e4755/view/movie/M/302230752.mp4","trailerTitle":"跨越8年的新娘\n    MV","trailerDate":"2017-11-13","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2504782560.jpg?"}],"id":"26929835","trailerTitle":"跨越8年的新娘 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111903/abec969bad1a10792583acea0a2d4bd6/view/movie/M/402310023.mp4","trailerTitle":"李宗伟：败者为王\n    预告片 (中文字幕)","trailerDate":"2018-05-16","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2522263431.jpg?"}],"id":"27195119","trailerTitle":"李宗伟：败者为王 视频"},{"trailerArray":[],"id":"27192660","trailerTitle":"黑脸大包公之西夏风云 视频"},{"trailerArray":[],"id":"27661975","trailerTitle":"幸福魔咒 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111903/d1aa5bef034beb45b81aebd4cfade56e/view/movie/M/302280917.mp4","trailerTitle":"阿里巴巴三根金发\n    先行版 (中文字幕)","trailerDate":"2018-03-21","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2516916816.jpg?"}],"id":"30176069","trailerTitle":"阿里巴巴三根金发 视频"},{"trailerArray":[],"id":"30263969","trailerTitle":"纯真年代 视频"},{"trailerArray":[],"id":"30259493","trailerTitle":"黑暗深处之惊魂夜 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111903/3e3eacd1688f3ddf59d1fc96500cb7ac/view/movie/M/402320615.mp4","trailerTitle":"恩师\n    预告片 (中文字幕)","trailerDate":"2018-06-20","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2525590426.jpg?"}],"id":"30215191","trailerTitle":"恩师 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111903/9630f6c3c98f98fe981821ce278927f0/view/movie/M/402320053.mp4","trailerTitle":"勇敢往事\n    预告片1：终极版 (中文字幕)","trailerDate":"2018-06-06","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2524174602.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/7cf5f5658a420263d36a8885def44f72/view/movie/M/402300307.mp4","trailerTitle":"勇敢往事\n    预告片2 (中文字幕)","trailerDate":"2018-04-27","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2520458605.jpg?"}],"id":"27191430","trailerTitle":"勇敢往事 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111903/53db45881a90b93b2e91d711109af110/view/movie/M/402310448.mp4","trailerTitle":"江湖儿女\n    预告片：定档版 (中文字幕)","trailerDate":"2018-05-24","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2522954125.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/32f9561f1d8616623a4bbb9ef6bce312/view/movie/M/402300586.mp4","trailerTitle":"江湖儿女\n    片段1","trailerDate":"2018-05-07","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2521476011.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/7114740ce3c1d173598a2f8d38f679e6/view/movie/M/402300578.mp4","trailerTitle":"江湖儿女\n    片段2","trailerDate":"2018-05-07","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2521453294.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111903/ce2eeca9f6b92afc528e51ecb7cce4fa/view/movie/M/402310401.mp4","trailerTitle":"江湖儿女\n    其它花絮：戛纳特辑 (中文字幕)","trailerDate":"2018-05-23","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2522902718.jpg?"}],"id":"26972258","trailerTitle":"江湖儿女 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111903/21cd328c4574477e58f34533d0701e8c/view/movie/M/402320747.mp4","trailerTitle":"一生有你\n    先行版：“一生相念”毕业季先导预告","trailerDate":"2018-06-22","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2525832840.jpg?1529641379"}],"id":"26263417","trailerTitle":"一生有你 视频"},{"trailerArray":[],"id":"30227727","trailerTitle":"禹神传之寻找神力 视频"},{"trailerArray":[],"id":"27092785","trailerTitle":"李茶的姑妈 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111904/a4f692443dadd9ecdfa0a60a540c221f/view/movie/M/402310147.mp4","trailerTitle":"无双\n    内地预告片：定档版 (中文字幕)","trailerDate":"2018-05-18","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2522415949.jpg?"}],"id":"26425063","trailerTitle":"无双 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111904/8fdebaa0219e38d2f8489567c1fa66a9/view/movie/M/402310365.mp4","trailerTitle":"云南虫谷\n    预告片：定档版 (中文字幕)","trailerDate":"2018-05-23","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2522871302.jpg?"}],"id":"26744597","trailerTitle":"云南虫谷 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111904/48d77b8f7f378dd9dc032f89b48788b6/view/movie/M/402320917.mp4","trailerTitle":"胖子行动队\n    预告片：定档版 (中文字幕)","trailerDate":"2018-06-26","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2526216537.jpg?1529987861"},{"trailerMP4":"http://vt1.doubanio.com/201807111904/52a7a6e9758a6ddf41ae785ffc1bc10a/view/movie/M/302210816.mp4","trailerTitle":"胖子行动队\n    其它花絮：包贝尔作品混剪 (中文字幕)","trailerDate":"2017-09-22","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2499810809.jpg?"}],"id":"27149818","trailerTitle":"胖子行动队 视频"},{"trailerArray":[],"id":"26911450","trailerTitle":"山2 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111904/29850550f435c4eee7da7c63371ccbb1/view/movie/M/302250121.mp4","trailerTitle":"护垫侠\n    印度预告片","trailerDate":"2017-12-15","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2507744714.jpg?"}],"id":"27198855","trailerTitle":"护垫侠 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111904/884863d69bd866cabaaf7f4a1cfa7213/view/movie/M/402300243.mp4","trailerTitle":"阳台上\n    预告片：“侬叫啥”版 (中文字幕)","trailerDate":"2018-04-25","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2520330164.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111904/56ae0e46d65350406396dbf9202ae247/view/movie/M/402300535.mp4","trailerTitle":"阳台上\n    花絮：张猛导演特辑 (中文字幕)","trailerDate":"2018-05-04","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2521140229.jpg?"}],"id":"27135473","trailerTitle":"阳台上 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111904/79f075a59edd97e7ec796f5b7f25c872/view/movie/M/402300573.mp4","trailerTitle":"苦行僧的非凡旅程\n    台湾预告片 (中文字幕)","trailerDate":"2018-05-07","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2521437489.jpg?"}],"id":"26715965","trailerTitle":"苦行僧的非凡旅程 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111904/1efc3de4128c0814c82b0c36b59d0a6d/view/movie/M/302270313.mp4","trailerTitle":"大闹西游\n    先行版 (中文字幕)","trailerDate":"2018-02-08","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2512989005.jpg?"}],"id":"30142649","trailerTitle":"大闹西游 视频"},{"trailerArray":[],"id":"26935283","trailerTitle":"阴阳师 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111904/2b00ed739959e94890c6a5eefd3a4c4a/view/movie/M/402320914.mp4","trailerTitle":"阿凡提之奇缘历险\n    其它花絮 (中文字幕)","trailerDate":"2018-06-26","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2526216067.jpg?"}],"id":"30208004","trailerTitle":"阿凡提之奇缘历险 视频"},{"trailerArray":[],"id":"27620911","trailerTitle":"灵魂的救赎 视频"},{"trailerArray":[],"id":"27008394","trailerTitle":"功夫联盟 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111904/05d06426b3a425282151190dffbb9db7/view/movie/M/402310583.mp4","trailerTitle":"过往的梦\n    预告片 (中文字幕)","trailerDate":"2018-05-29","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2523425713.jpg?"}],"id":"27107609","trailerTitle":"过往的梦 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111904/d45aa90564bdbf4f2aa400d488d62f64/view/movie/M/402300209.mp4","trailerTitle":"银魂2\n    电视版","trailerDate":"2018-04-25","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2520260415.jpg?"}],"id":"27199577","trailerTitle":"银魂2 视频"},{"trailerArray":[],"id":"27663881","trailerTitle":"燃点 视频"},{"trailerArray":[],"id":"26961483","trailerTitle":"碟仙实录 视频"},{"trailerArray":[],"id":"27155276","trailerTitle":"素人特工 视频"},{"trailerArray":[],"id":"27179414","trailerTitle":"人间·喜剧 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111904/619a242c61ce74d0ff84a712acc10866/view/movie/M/302240924.mp4","trailerTitle":"阿丽塔：战斗天使\n    中国先行版1 (中文字幕)","trailerDate":"2017-12-11","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2507372272.jpg?"},{"trailerMP4":"http://vt1.doubanio.com/201807111904/aad19c22614ffb9baee0864e12fe27d8/view/movie/M/302240871.mp4","trailerTitle":"阿丽塔：战斗天使\n    香港先行版2 (中文字幕)","trailerDate":"2017-12-09","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2507188313.jpg?"}],"id":"1652592","trailerTitle":"阿丽塔：战斗天使 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111904/2a43436eab3d10340484168974a29ad7/view/movie/M/402310024.mp4","trailerTitle":"动物特工局\n    预告片 (中文字幕)","trailerDate":"2018-05-16","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2522264636.jpg?"}],"id":"30217371","trailerTitle":"动物特工局 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111904/8a1983a84e0e26de7d6912f9549b54c5/view/movie/M/302190724.mp4","trailerTitle":"疯狂的外星人\n    其它花絮：宁浩“疯狂”混剪 (中文字幕)","trailerDate":"2017-07-26","trailerPoster":"https://img3.doubanio.com/img/trailer/medium/2494105655.jpg?"}],"id":"25986662","trailerTitle":"疯狂的外星人 视频"},{"trailerArray":[],"id":"27065898","trailerTitle":"神探蒲松龄之兰若仙踪 视频"},{"trailerArray":[],"id":"26277338","trailerTitle":"八仙之各显神通 视频"},{"trailerArray":[],"id":"30187577","trailerTitle":"误入江湖 视频"},{"trailerArray":[],"id":"30170448","trailerTitle":"迦百农 视频"},{"trailerArray":[],"id":"24743117","trailerTitle":"画皮Ⅲ 视频"},{"trailerArray":[{"trailerMP4":"http://vt1.doubanio.com/201807111905/0db8684167e3bd60b114a4f89b5bfafb/view/movie/M/402310174.mp4","trailerTitle":"八仙过海\n    先行版","trailerDate":"2018-05-18","trailerPoster":"https://img1.doubanio.com/img/trailer/medium/2522459307.jpg?"}],"id":"30226052","trailerTitle":"八仙过海 视频"},{"trailerArray":[],"id":"26986120","trailerTitle":"摸金校尉之九幽将军 视频"},{"trailerArray":[],"id":"30264504","trailerTitle":"异界 视频"},{"trailerArray":[],"id":"27619748","trailerTitle":"唐人街探案3 视频"},{"trailerArray":[],"id":"26986136","trailerTitle":"黑色假面 视频"}]

/***/ },
/* 13 */
/***/ function(module, exports) {

module.exports = [{"url":"https://movie.douban.com/subject/27053277/","title":"格桑花开的时候","like":"331"},{"url":"https://movie.douban.com/subject/26366496/","title":"邪不压正","like":"87438"},{"url":"https://movie.douban.com/subject/26746958/","title":"阿修罗","like":"4012"},{"url":"https://movie.douban.com/subject/27114204/","title":"海龙屯","like":"704"},{"url":"https://movie.douban.com/subject/30203509/","title":"铁笼","like":"317"},{"url":"https://movie.douban.com/subject/27194322/","title":"美丽童年","like":"136"},{"url":"https://movie.douban.com/subject/30249257/","title":"天佑之爱","like":"54"},{"url":"https://movie.douban.com/subject/30227725/","title":"小悟空","like":"120"},{"url":"https://movie.douban.com/subject/30252555/","title":"八只鸡","like":"359"},{"url":"https://movie.douban.com/subject/26804147/","title":"摩天营救","like":"5493"},{"url":"https://movie.douban.com/subject/27079318/","title":"北方一片苍茫","like":"3117"},{"url":"https://movie.douban.com/subject/26660063/","title":"淘气大侦探","like":"885"},{"url":"https://movie.douban.com/subject/25881500/","title":"玛雅蜜蜂历险记","like":"653"},{"url":"https://movie.douban.com/subject/26988003/","title":"兄弟班","like":"349"},{"url":"https://movie.douban.com/subject/26930056/","title":"汪星卧底","like":"334"},{"url":"https://movie.douban.com/subject/30128986/","title":"午夜幽灵","like":"289"},{"url":"https://movie.douban.com/subject/30262110/","title":"闺蜜的战争","like":"23"},{"url":"https://movie.douban.com/subject/27158277/","title":"产科男生","like":"22"},{"url":"https://movie.douban.com/subject/25882296/","title":"狄仁杰之四大天王","like":"27925"},{"url":"https://movie.douban.com/subject/27605698/","title":"西虹市首富","like":"16305"},{"url":"https://movie.douban.com/subject/26290410/","title":"昨日青空","like":"12770"},{"url":"https://movie.douban.com/subject/26253783/","title":"神奇马戏团之动物饼干","like":"2508"},{"url":"https://movie.douban.com/subject/30263334/","title":"解剖室灵异事件之男生宿舍","like":"41"},{"url":"https://movie.douban.com/subject/30146756/","title":"风语咒","like":"4680"},{"url":"https://movie.douban.com/subject/26754880/","title":"萌学园：寻找盘古","like":"2475"},{"url":"https://movie.douban.com/subject/26767512/","title":"解码游戏","like":"796"},{"url":"https://movie.douban.com/subject/30208005/","title":"神秘世界历险记4","like":"99"},{"url":"https://movie.douban.com/subject/30156898/","title":"肆式青春","like":"2649"},{"url":"https://movie.douban.com/subject/26985127/","title":"一出好戏","like":"22696"},{"url":"https://movie.douban.com/subject/24852545/","title":"爱情公寓","like":"12826"},{"url":"https://movie.douban.com/subject/26426194/","title":"巨齿鲨","like":"4821"},{"url":"https://movie.douban.com/subject/26290398/","title":"美食大冒险之英雄烩","like":"258"},{"url":"https://movie.douban.com/subject/30125089/","title":"勇者闯魔城","like":"111"},{"url":"https://movie.douban.com/subject/26331700/","title":"大轰炸","like":"5412"},{"url":"https://movie.douban.com/subject/30122633/","title":"快把我哥带走","like":"4149"},{"url":"https://movie.douban.com/subject/26871669/","title":"如影随心","like":"3826"},{"url":"https://movie.douban.com/subject/27200988/","title":"未来机器城","like":"801"},{"url":"https://movie.douban.com/subject/30254589/","title":"最后的棒棒","like":"674"},{"url":"https://movie.douban.com/subject/27201353/","title":"大师兄","like":"532"},{"url":"https://movie.douban.com/subject/26311974/","title":"下一站：前任","like":"155"},{"url":"https://movie.douban.com/subject/30176525/","title":"深海历险记","like":"111"},{"url":"https://movie.douban.com/subject/30246086/","title":"他是一只狗","like":"77"},{"url":"https://movie.douban.com/subject/24743257/","title":"冷恋时代","like":"41"},{"url":"https://movie.douban.com/subject/27119292/","title":"大三儿","like":"1290"},{"url":"https://movie.douban.com/subject/26996640/","title":"反贪风暴3","like":"3150"},{"url":"https://movie.douban.com/subject/26881698/","title":"七袋米","like":"482"},{"url":"https://movie.douban.com/subject/30199575/","title":"让我怎么相信你","like":"245"},{"url":"https://movie.douban.com/subject/26954268/","title":"道高一丈","like":"206"},{"url":"https://movie.douban.com/subject/26730542/","title":"有五个姐姐的我就注定要单身了","like":"103"},{"url":"https://movie.douban.com/subject/27107604/","title":"天下第一镖局","like":"51"},{"url":"https://movie.douban.com/subject/30237381/","title":"惊慌失色之诡寓","like":"34"},{"url":"https://movie.douban.com/subject/30236775/","title":"旅行吧！井底之蛙","like":"73"},{"url":"https://movie.douban.com/subject/27622447/","title":"小偷家族","like":"55782"},{"url":"https://movie.douban.com/subject/26636712/","title":"蚁人2：黄蜂女现身","like":"40879"},{"url":"https://movie.douban.com/subject/26756049/","title":"我，花样女王","like":"38998"},{"url":"https://movie.douban.com/subject/26336252/","title":"碟中谍6：全面瓦解","like":"27988"},{"url":"https://movie.douban.com/subject/26916229/","title":"镰仓物语","like":"25017"},{"url":"https://movie.douban.com/subject/4864908/","title":"影","like":"23343"},{"url":"https://movie.douban.com/subject/26627736/","title":"边境杀手2：边境战士","like":"9061"},{"url":"https://movie.douban.com/subject/26930565/","title":"营救汪星人","like":"5890"},{"url":"https://movie.douban.com/subject/27140071/","title":"找到你","like":"5649"},{"url":"https://movie.douban.com/subject/26882457/","title":"断片之险途夺宝","like":"3427"},{"url":"https://movie.douban.com/subject/26309969/","title":"新乌龙院之笑闹江湖","like":"2420"},{"url":"https://movie.douban.com/subject/26816090/","title":"沉默的证人","like":"2411"},{"url":"https://movie.douban.com/subject/26790960/","title":"墨多多谜境冒险","like":"2371"},{"url":"https://movie.douban.com/subject/26425062/","title":"武林怪兽","like":"2044"},{"url":"https://movie.douban.com/subject/26792540/","title":"真相漩涡","like":"1855"},{"url":"https://movie.douban.com/subject/26728641/","title":"苏丹","like":"1732"},{"url":"https://movie.douban.com/subject/26929835/","title":"跨越8年的新娘","like":"1670"},{"url":"https://movie.douban.com/subject/27195119/","title":"李宗伟：败者为王","like":"517"},{"url":"https://movie.douban.com/subject/27192660/","title":"黑脸大包公之西夏风云","like":"193"},{"url":"https://movie.douban.com/subject/30176069/","title":"阿里巴巴三根金发","like":"63"},{"url":"https://movie.douban.com/subject/27661975/","title":"幸福魔咒","like":"62"},{"url":"https://movie.douban.com/subject/30263969/","title":"纯真年代","like":"19"},{"url":"https://movie.douban.com/subject/30259493/","title":"黑暗深处之惊魂夜","like":"21"},{"url":"https://movie.douban.com/subject/30215191/","title":"恩师","like":"58"},{"url":"https://movie.douban.com/subject/27191430/","title":"勇敢往事","like":"26"},{"url":"https://movie.douban.com/subject/26972258/","title":"江湖儿女","like":"21294"},{"url":"https://movie.douban.com/subject/26263417/","title":"一生有你","like":"740"},{"url":"https://movie.douban.com/subject/30227727/","title":"禹神传之寻找神力","like":"21"},{"url":"https://movie.douban.com/subject/27092785/","title":"李茶的姑妈","like":"2638"},{"url":"https://movie.douban.com/subject/26425063/","title":"无双","like":"1747"},{"url":"https://movie.douban.com/subject/26744597/","title":"云南虫谷","like":"1492"},{"url":"https://movie.douban.com/subject/27149818/","title":"胖子行动队","like":"793"},{"url":"https://movie.douban.com/subject/26911450/","title":"山2","like":"18836"},{"url":"https://movie.douban.com/subject/27198855/","title":"护垫侠","like":"6714"},{"url":"https://movie.douban.com/subject/27135473/","title":"阳台上","like":"6312"},{"url":"https://movie.douban.com/subject/26715965/","title":"苦行僧的非凡旅程","like":"825"},{"url":"https://movie.douban.com/subject/30142649/","title":"大闹西游","like":"570"},{"url":"https://movie.douban.com/subject/30269510/","title":"相亲时代","like":"3"},{"url":"https://movie.douban.com/subject/26935283/","title":"阴阳师","like":"6466"},{"url":"https://movie.douban.com/subject/30208004/","title":"阿凡提之奇缘历险","like":"97"},{"url":"https://movie.douban.com/subject/27620911/","title":"灵魂的救赎","like":"29"},{"url":"https://movie.douban.com/subject/27008394/","title":"功夫联盟","like":"914"},{"url":"https://movie.douban.com/subject/27107609/","title":"过往的梦","like":"35"},{"url":"https://movie.douban.com/subject/27199577/","title":"银魂2","like":"4564"},{"url":"https://movie.douban.com/subject/27663881/","title":"燃点","like":"549"},{"url":"https://movie.douban.com/subject/26961483/","title":"碟仙实录","like":"349"},{"url":"https://movie.douban.com/subject/27155276/","title":"素人特工","like":"439"},{"url":"https://movie.douban.com/subject/27179414/","title":"人间·喜剧","like":"1620"},{"url":"https://movie.douban.com/subject/1652592/","title":"阿丽塔：战斗天使","like":"11699"},{"url":"https://movie.douban.com/subject/30217371/","title":"动物特工局","like":"640"},{"url":"https://movie.douban.com/subject/25986662/","title":"疯狂的外星人","like":"16598"},{"url":"https://movie.douban.com/subject/27065898/","title":"神探蒲松龄之兰若仙踪","like":"1192"},{"url":"https://movie.douban.com/subject/26277338/","title":"八仙之各显神通","like":"945"},{"url":"https://movie.douban.com/subject/30187577/","title":"误入江湖","like":"462"},{"url":"https://movie.douban.com/subject/30170448/","title":"迦百农","like":"3402"},{"url":"https://movie.douban.com/subject/24743117/","title":"画皮Ⅲ","like":"5913"},{"url":"https://movie.douban.com/subject/30226052/","title":"八仙过海","like":"22"},{"url":"https://movie.douban.com/subject/26986120/","title":"摸金校尉之九幽将军","like":"13410"},{"url":"https://movie.douban.com/subject/30264504/","title":"异界","like":"8"},{"url":"https://movie.douban.com/subject/27619748/","title":"唐人街探案3","like":"8686"},{"url":"https://movie.douban.com/subject/26986136/","title":"黑色假面","like":"1669"}]

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
              uri: doubanAPI + 'coming_soon?count=100'
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
  var _ref6 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee8(ctx, next) {
    var filmDetail, filmTrailer, filmTrailerDetail;
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            filmDetail = __webpack_require__(10);
            filmTrailer = __webpack_require__(11);
            filmTrailerDetail = __webpack_require__(12);

            // 添加爬取的上映日期、播放时长、电影封面
            /*await new Promise(async (resolve, reject) => {
              for(let i = 0 ; i < filmDetail.length ; i++) {
                let film = await Film
                  .findOne({id: filmDetail[i].id})
                  .exec()
                 if (film) {
                  film.releaseDate = filmDetail[i].releaseDate // 更新上时间
                  film.runtime = filmDetail[i].runtime  // 更新电影时长
                  film.postPic = filmDetail[i].movieName+'封面图'  // 更新电影poster
                  if (!film.like) film.like = filmDetail[i].like
                  // 更新导演、主演照片
                   for(let j= 0 ; j < filmDetail[i].actorAddMsg.length ; j++) {
                    for(let k= 0 ; k < film.directors.length ; k++) {
                      if (film.directors[k].id === filmDetail[i].actorAddMsg[j].id) {
                        let item = film.directors[k]
                        item.avatars = filmDetail[i].actorAddMsg[j].id+'castImg.jpg'
                        film.directors.splice(k, 1, item)
                      }
                    }
                    for(let l= 0 ; l < film.casts.length ; l++) {
                      if (film.casts[l].id === filmDetail[i].actorAddMsg[j].id) {
                        let item = film.casts[l]
                        item.avatars = filmDetail[i].actorAddMsg[j].id+'castImg.jpg'
                        film.casts.splice(l, 1, item)
                      }
                    }
                  }
                   await film.save()
                }
              }
              console.log(`电影缺失上映日期、播放时长、电影封面信息补充完毕`)
              return resolve()
            })*/
            // 添加爬取的预告片封面
            /*await new Promise(async (resolve, reject) => {
              for(let i = 0 ; i < filmTrailer.length ; i++) {
                const film = await Film
                  .findOne({id: filmTrailer[i].id})
                  .exec()
                 if (film) {
                  film.trailerPoster = filmTrailer[i].trailerPoster
                  film.save()
                }
              }
               console.log(`电影封面补充完毕`)
              return resolve()
            })*/

            // 预告片详情

            _context8.next = 5;
            return new Promise(function () {
              var _ref7 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee7(resolve, reject) {
                var i, film, j;
                return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        i = 0;

                      case 1:
                        if (!(i < filmTrailerDetail.length)) {
                          _context7.next = 9;
                          break;
                        }

                        _context7.next = 4;
                        return Film.findOne({ id: filmTrailerDetail[i].id }).exec();

                      case 4:
                        film = _context7.sent;


                        if (film) {
                          for (j = 0; j < filmTrailerDetail[i].trailerArray.length; j++) {
                            film.trailerArray.push({
                              trailerMP4: '' + filmTrailerDetail[i].id + j + '\u89C6\u9891',
                              trailerTitle: '' + filmTrailerDetail[i].trailerArray[j].trailerTitle,
                              trailerDate: '' + filmTrailerDetail[i].trailerArray[j].trailerDate,
                              trailerPoster: '' + filmTrailerDetail[i].id + j + '\u5C01\u9762\u56FE'
                            });
                          }

                          film.save();
                        }

                      case 6:
                        i++;
                        _context7.next = 1;
                        break;

                      case 9:

                        console.log('\u7535\u5F71\u9884\u544A\u7247\u8BE6\u60C5\u8865\u5145\u5B8C\u6BD5');
                        return _context7.abrupt('return', resolve());

                      case 11:
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
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, _this);
  }));

  return function crawlerDetail(_x6, _x7) {
    return _ref6.apply(this, arguments);
  };
}();

var uploadQiniuFile = function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee9() {
    var filmDetail, filmTrailerDetail, i, j, _i, _j;

    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
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
                qiniuFn.uploadQiniuFile(filmTrailerDetail[_i].trailerArray[_j].trailerPoster, '' + filmTrailerDetail[_i].id + _j + '\u5C01\u9762\u56FE');
                // qiniuFn.uploadQiniuFile(filmTrailerDetail[i].trailerArray[j].trailerMP4, `${filmTrailerDetail[i].id}${j}视频`)
              }
            }

          case 4:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, _this);
  }));

  return function uploadQiniuFile() {
    return _ref8.apply(this, arguments);
  };
}();

/* 定时更新内容 */
var updateMovie = function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.mark(function _callee10() {
    return __WEBPACK_IMPORTED_MODULE_0_E_filmGo_filmGoAdmin_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            console.time("sort");
            _context10.next = 3;
            return movieFile.runMovieDetail();

          case 3:
            _context10.next = 5;
            return movieFile.runMovieTrailer();

          case 5:
            _context10.next = 7;
            return movieFile.runMovieTrailerDetail();

          case 7:
            _context10.next = 9;
            return movieFile.runMoviePhotos();

          case 9:
            _context10.next = 11;
            return fetchFilms();

          case 11:
            _context10.next = 13;
            return crawlerDetail();

          case 13:
            _context10.next = 15;
            return uploadQiniuFile();

          case 15:
            console.timeEnd("sort");

          case 16:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, _this);
  }));

  return function updateMovie() {
    return _ref9.apply(this, arguments);
  };
}();
uploadQiniuFile();
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

var nodemailer = __webpack_require__(36);
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

var rp = __webpack_require__(39);
var cheerio = __webpack_require__(32); // Node.js版本的jquery
var fs = __webpack_require__(4);
// const iconv = require('iconv-lite') // 文件编码转换
var request = __webpack_require__(5);
// const proxyIP = require('../middleware/request')
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
            i = 0;

          case 3:
            if (!(i < comingMoviesLink.length)) {
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
                            trailerPoster: trailerPoster
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
                                        trailerPoster: trailer.trailerPoster[index]
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
/* 28 */
/***/ function(module, exports, __webpack_require__) {

var qiniu = __webpack_require__(37);
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

module.exports = require("nodemailer");

/***/ },
/* 37 */
/***/ function(module, exports) {

module.exports = require("qiniu");

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