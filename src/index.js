const path = require('path');
const express = require('express');

const app = express();

const port = 3000;
const publicDir = path.join(__dirname, '../public');

app.use(express.static(publicDir));

// app.get('/', (req, res) => {
//   res.send();
// });

app.listen(port, () => {
  console.log('Hello at:', port);
});
