'use strict';

const express = require('express');
const app = express();
const game = require('./game');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');

app.use(bodyParser.json());
app.use('/games', game);

mongoose.connect(config.mongodb.uri)
  .then(() => {
    app.listen(3000, () => console.log('Example app listening on port 3000!'));
  })
  .catch((error) => {
    console.error(error);
  });

module.exports = app;



