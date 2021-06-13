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
});

server.listen(port, () => {
  console.log('Hello at:', port);
});
