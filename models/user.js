var monogoose = require('mongoose');

var userScheme = new monogoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
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