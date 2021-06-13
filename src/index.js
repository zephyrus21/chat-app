const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = 3000;
const publicDir = path.join(__dirname, '../public');

app.use(express.static(publicDir));

io.on('connection', (socket) => {
  console.log('a user connected');

  //? This will emit to all the connections
  socket.emit('message', 'Welcome to the chat!');

  //? This will emit to all but the particular connection
  socket.broadcast.emit('message', 'A new user connected');

  socket.on('sendMsg', (message, callback) => {
    //? This will emit to all the connections but with realtime render
    io.emit('message', message);

    //? This will send a acknowledgement to the client
    callback('Delivered ✔');
  });

  socket.on('sendLocation', ({ latitude, longitude }, callback) => {
    io.emit(
      'message',
      `https://www.google.com/maps?q=${latitude},${longitude}`
    );

    callback('Location shared ✔');
  });

  socket.on('disconnect', () => {
    io.emit('message', 'A user disconnected');
  });
});

server.listen(port, () => {
  console.log('Hello at:', port);
});
