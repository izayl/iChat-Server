var io = require('socket.io')();
var logger = require('debug')('iChat:socket');
var ids = {};

io.on('connection', function (socket) {
  logger('a user ' + socket.id + ' connected');
  // TODO： save socket id

  socket.on('disconnect', function () {
    logger('a user disconnect');

  })

  socket.on('record', function (userId) {
    ids[userId] = socket.id
    logger(ids)
  })

  socket.on('sendToUser', function (data) {
    console.log(data.fromUser + 'send to ', data.toUser)
    data = Object.assign({}, data, {
      time: +new Date()
    })
    socket.to(ids[data.toUser]).emit('receiveFromUser', data)
  })

  socket.on('send', function (data) {
    socket.broadcast.emit('message', data)
  })
})

module.exports = io;