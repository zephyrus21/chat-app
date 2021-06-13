const socket = io();

socket.on('message', (message) => {
  console.log(message);
});

document.querySelector('#chat-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const message = document.querySelector('#msg').value;

  socket.emit('sendMsg', message);
});
