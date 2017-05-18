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
    type: String,
    required: false,
    enum: ["&#xe722;", "&#xe723;", "&#xe724;", "&#xe725;", "&#xe726;", "&#xe727;", "&#xe728;", "&#xe729;", "&#xe72a;", "&#xe72b;", "&#xe72c;", "&#xe72d;", "&#xe72e;", "&#xe72f;", "&#xe730;", "&#xe732;", "&#xe733;", "&#xe734;", "&#xe735;", "&#xe736;", "&#xe737;", "&#xe738;", "&#xe739;", "&#xe73a;", "&#xe73b;", "&#xe660;", "&#xe661;", "&#xe663;", "&#xe664;", "&#xe665;", "&#xe666;", "&#xe667;", "&#xe668;", "&#xe669;", "&#xe66a;", "&#xe66b;", "&#xe66c;", "&#xe66d;", "&#xe66e;", "&#xe66f;", "&#xe670;", "&#xe671;", "&#xe672;", "&#xe674;", "&#xe678;", "&#xe6df;"],
    default: "&#xe722;"
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