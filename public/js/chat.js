const socket = io();

const messageForm = document.querySelector('#chat-form');
const messageFormInput = document.querySelector('#msg');
const messageFormButton = document.querySelector('#submit');

const locationButton = document.querySelector('#send-loc');

const messages = document.querySelector('#messages');
const sidebar = document.querySelector('#sidebar');

//! Templates
const chatTemplate = document.querySelector('#chat-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//! Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoScroll = () => {
  const newMessage = messages.lastElementChild;

  //? Height of the new message
  const newMessageStyles = getComputedStyle(newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

  //? Visible height
  const visibleHeight = messages.offsetHeight;

  //? Height of messages container
  const containerHeight = messages.scrollHeight;

  //? How far have I scrolled?
  const scrollOffset = messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    messages.scrollTop = messages.scrollHeight;
  }
};

socket.on('message', (message) => {
  const html = Mustache.render(chatTemplate, {
    username: message.username,
    message: message.text,
  });
  messages.insertAdjacentHTML('beforeend', html);
  autoScroll();
});

socket.on('locationMessage', (message) => {
  const html = Mustache.render(locationTemplate, {
    username: message.username,
    url: message.url,
  });
  messages.insertAdjacentHTML('beforeend', html);
  autoScroll();
});

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    users,
    room,
  });
  sidebar.innerHTML = html;
});

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  messageFormButton.setAttribute('disabled', 'disabled');

  const message = messageFormInput.value;

  socket.emit('sendMsg', message, (msg) => {
    messageFormButton.removeAttribute('disabled');
    messageFormInput.value = '';
    messageFormInput.focus();
  });
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
      () => {
        locationButton.removeAttribute('disabled', 'disabled');
      }
    );
  });
});

socket.emit(
  'join',
  {
    username,
    room,
  },
  (error) => {
    if (error) {
      alert(error);
      location.href = '/';
    }
  }
);
