const users = [];

//! to store user data
const addUser = ({ id, username, room }) => {
  //? clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //? validate the data
  if (!username || !room)
    return {
      error: 'Username and room required',
    };

  //? check for existing user
  const existingUser = users.find(
    (user) => user.room === room && user.username === username
  );

  //? validate existing user
  if (existingUser)
    return {
      error: 'Username already in use.',
    };

  //? store username
  const user = { id, username, room };
  users.push(user);
  return { user };
};

//! to delete user data
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) return users.splice(index, 1);
};

//! to get user
const getUser = (id) => {
  return users.find((user) => user.id === id);
};

//! to get users in the Room
const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
