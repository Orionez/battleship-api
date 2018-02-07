'use strict';

const mongoose = require('mongoose');

const cellSchema = mongoose.Schema({
  rowNumber: Number,
  columnNumber: Number,
  isAttacked: {type: Boolean, default: false},
});

const ShipSchema = mongoose.Schema({
  type: String,
  health: Number,
  cells: [cellSchema]
});


ShipSchema.virtual('isSunk').get(function () {
  return this.health === this.cells.filter(c => c.isAttacked).length;
});

ShipSchema.options.toJSON = {
  virtuals: true,
  transform: function (doc, result, options) {
    delete result.cells;
    return result
  }
};

const modelName = 'Ship';
let Ship = mongoose.models[modelName];
if (!Ship) {
  Ship = mongoose.model(modelName, ShipSchema);
}

module.exports = {Ship, ShipSchema};