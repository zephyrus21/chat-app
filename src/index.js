const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
const { generateMessage, generateLocationMessage } = require('./messages');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, '../public');

app.use(express.static(publicDir));

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join', ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) return callback(error);

    socket.join(user.room);

    //? This will emit to all the connections
    socket.emit('message', generateMessage('Admin', 'Welcome to the chat!'));

    //? This will emit to all but the particular connection
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        generateMessage('Admin', `${user.username} has joined the chat`)
      );
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on('sendMsg', (message, callback) => {
    const user = getUser(socket.id);

    //? This will emit to all the connections but with realtime render
    io.to(user.room).emit('message', generateMessage(user.username, message));

    //? This will send a acknowledgement to the client
    callback('Delivered ✔');
  });

  socket.on('sendLocation', ({ latitude, longitude }, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit(
      'locationMessage',
      generateLocationMessage(
        user.username,
        `https://www.google.com/maps?q=${latitude},${longitude}`
      )
    );

    callback('Location shared ✔');
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    console.log(user);

    if (user) {
      io.to(user.room).emit(
        'message',
        generateMessage('Admin', `${user.username} left the chat.`)
      );
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(port, () => {
  console.log('Hello at:', port);
});
