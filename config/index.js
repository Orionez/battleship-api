'use strict';


let defaultConfig = {};

const env = process.env.NODE_ENV || 'development';

module.exports = Object.assign(
  defaultConfig,
  require(`./${env}.js`));