var monogoose = require('mongoose');

var userScheme = new monogoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: false,
    default: '这个人很懒，没有写下什么'
  },
  avatar: {
    type: Number,
    required: false,
    default: Math.floor(Math.random() * 45)
  },
  friends: {
    type: [monogoose.Schema.Types.Mixed]
  }
});

var User = module.exports = monogoose.model('User', userScheme);

module.exports.getUserByUsername = function (username, callback) {
  var query = {username: username};

  User.findOne(query, callback);
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
  if (candidatePassword === hash) {
    callback(null, true);
  } else {
    callback(null, false);
  }
}

module.exports.getUserById = function (id, callback) {
  User.findById(id, callback);
}

module.exports.addFriend = function (id, myId, callback) {
  User.findById(myId, function (err, user) {
    if (err) {
      callback(err)
      return
    }
    if (user) {
      User.findById(id, function (err, friend) {
        if (err) {
          callback(err)
          return
        }
        if (friend) {
          user.friends.push({
            id: friend._id,
            name: friend.username
          })
          callback()
        } else {

        }
      })
    } else {
      callback('invalid User Id')
    }
  })
}