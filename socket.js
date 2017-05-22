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
    logger('ids: ' + JSON.stringify(ids))
  })

  socket.on('sendToUser', function (data) {
    console.log(data.fromUser + 'send to ', data.toUser)
    logger('sendToUser: ' + ids[data.toUser])

    // TODO: if(!ids[data.toUser]) emit('not online')
    data = Object.assign({}, data, {
      time: +new Date()
    })
    logger('send data ', data)
    socket.to(ids[data.toUser]).emit('receiveFromUser', data)
  })

  socket.on('message', function (data) {
    logger('Client said: ', data);
    socket.broadcast.emit('message', data)
  })

  socket.on('call', function (data) {
    logger('call' + JSON.stringify(data))
    socket.to(ids[data.callee]).emit('called', data)
  })

  socket.on('cancel', function (id) {
    logger("cancel video by " + id)
    socket.to(ids[id]).emit('cancel')
  })

  socket.on('accept', function (id) {
    logger("accept video by " + id)
    socket.to(ids[id]).emit('accept')
  })

  socket.on('closeRTC', function (room) {
    logger('Client ID ' + socket.id + ' leaved room ' + room);
    socket.leave(room)
  })

  // signaling server
  socket.on('ready', function (room) {
    io.sockets.in(room).emit('ready', room);
  })
  socket.on('create or join', function (room) {
    // var room = ids[id]
    var clientsInRoom = io.nsps['/'].adapter.rooms[room];
    var numClients = clientsInRoom === undefined ? 0 : Object.keys(clientsInRoom.sockets).length;
    // clientNums = clientNums ? clientNums.length : 1
    logger('numClients' + numClients)

    if (numClients === 0) {
      socket.join(room)
      socket.emit('created', room, socket.id)
      logger('Client ID ' + socket.id + ' created room ' + room);
    } else if (numClients === 1) {
      socket.join(room)
      socket.emit('joined', room, socket.id)
      // io.sockets.in(room).emit('ready', room);
      logger('Client ID ' + socket.id + ' joined room ' + room);
    } else {
      socket.emit('full', room, socket.id)
      logger('room ' + room + ' is full');
    }
  })
})

module.exports = io;