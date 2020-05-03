const express = require('express');
const bodyParser = require('body-parser');

const app = express();


app.get('/', (req, res) => {
  res.send('hello');
});

app.use(bodyParser.json());

module.exports = app;
