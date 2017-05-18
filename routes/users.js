var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var formatJson = require('../lib/formatJson');
var User = require('../models/user');
var formatJson = require('../lib/formatJson');

passport.use(new LocalStrategy(function (username, password, done) {
  User.getUserByUsername(username, function (err, user) {
    console.log('getUserByUsername');
    if (err) throw err;
    if (!user) return done(null, false, { message: "Unknown User" });
    User.comparePassword(password, user.password, function (err, isMatch) {
      if (err) throw err;
      if (isMatch) {
        console.log('valid')
        return done(null, user);
      } else {
        console.log('invalid')
        console.trace()
        return done(null, false, { message: "Invalid Password" })
      }
    })
  })
}))

passport.serializeUser(function (user, done) {
  console.log('getUserById');
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  console.log('deserializeUser');
  User.getUserById(id, function (err, user) {
    done(err, user);
  });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      res.json(formatJson('error', 401, info.message));
    } else {
      res.cookie('_id', user._id)
      res.json(formatJson({
        userId: user._id,
        avatar: user.avatar
      }));
    }
  })(req, res, next);
});

router.post('/register', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  if (!username || !password) {
    res.json(formatJson('error', 'Invalid Params', 400));
  } else {
    // TODO: 重名检测
    var newUser = new User({
      username: username,
      password: password,
      avatar: Math.floor(Math.random() * 45)
    });
    newUser.save(function () {
      console.log('saved');
      res.json(formatJson('success'));
    });
  }
})

router.post('/search', function (req, res, next) {
  var username = req.body.username;
  var userId = req.body.id;
  if (!username) {
    res.json(formatJson('error', 'empty payload', 400))
  } else {
    // TODO: 模糊搜索
    User.getUserByUsername(username, function (err, user) {
      console.log(user)
      if (err) return res.json(formatJson('error', 'an error find in search', 500))
      if (!user || userId == user._id) return res.json(formatJson({
        title: "查询结果为空"
      }))
      res.json(formatJson({
        title: user.username,
        userId: user._id,
        username: user.username,
        desc: user.desc,
        avatar: user.avatar
      }))
    })
  }
})

router.post('/addFriend', function (req, res, next) {
  var friendId = req.body.friendId;
  var myId = req.body.myId;
  if (!friendId || !myId) {
    res.json(formatJson('error', 'empty payload', 400))
  } else {
    User.addFriend(friendId, myId, function (err) {
      if (err) {
        return res.json(formatJson('error', err, 500))
      } else {
        return res.json(formatJson())
      }
    })
  }
})

module.exports = router;
