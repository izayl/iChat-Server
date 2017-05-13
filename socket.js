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

  socket.on('sendToUser', function ({ content, toUser, fromUser }) {
    console.log(fromUser + 'send to ', toUser)
    socket.to(ids[toUser]).emit('receiveFromUser', {
      content, toUser, fromUser,
      time: +new Date()
    })
  })
})

module.exports = io;