const socket = io();

const messageForm = document.querySelector('#chat-form');
const messageFormInput = document.querySelector('#msg');
const messageFormButton = document.querySelector('#submit');

const locationButton = document.querySelector('#send-loc');

const messages = document.querySelector('#messages');

//! Templates
const chatTemplate = document.querySelector('#chat-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;

socket.on('message', (message) => {
  const html = Mustache.render(chatTemplate, {
    message,
  });
  messages.insertAdjacentHTML('beforeend', html);
});

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  messageFormButton.setAttribute('disabled', 'disabled');

  const message = messageFormInput.value;

  socket.emit('sendMsg', message, (msg) => {
    messageFormButton.removeAttribute('disabled', 'disabled');
    messageFormInput.value = '';
    messageFormInput.focus();

    console.log(msg);
  });
});

socket.on('locationMessage', (url) => {
  const html = Mustache.render(locationTemplate, {
    url,
  });
  messages.insertAdjacentHTML('beforeend', html);
});

locationButton.addEventListener('click', () => {
  locationButton.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      'sendLocation',
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      (msg) => {
        locationButton.removeAttribute('disabled', 'disabled');

        console.log(msg);
      }
    );
  });
});
