'use strict';

const mongoose = require('mongoose');
const {ShipSchema} = require('./ship.model');
const {Board} = require('./board');
const shipFactory = require('./ship-factory');
const {DuplicateMoveError} = require('../errors');
const fieldSize = 10;

const moveSchema = mongoose.Schema({
  rowNumber: Number,
  columnNumber: Number,
  message: String
});

const gameSchema = mongoose.Schema({
  playerName: String,
  fieldSize: {type: Number, default: fieldSize},
  moves: [moveSchema],
  ships: [ShipSchema]
});

gameSchema.options.toJSON = {
  virtuals: true,
  virtual: true,
  transform: function (doc, result, options) {
    result.ships.forEach((s) => {
      delete s.cells;
    });
    return result
  }
};

gameSchema.statics.createNewGame = function (playerName) {
  const game = new Game({playerName});
  const board = new Board(fieldSize, shipFactory.createNewFleet());
  game.ships = board.ships;
  return game;
};

gameSchema.methods.placeMove = function (move) {

  const moveExists = !!this.moves.find(m => m.rowNumber === move.rowNumber && m.columnNumber === move.columnNumber);
  if (moveExists) {
    return Promise.reject(new DuplicateMoveError());
  }

  let ship;
  for (let i = 0; i < this.ships.length; i++) {
    const tempShip = this.ships[i];
    for (let j = 0; j < tempShip.cells.length; j++) {
      const cell = tempShip.cells[j];
      const isHit = cell.rowNumber === move.rowNumber && cell.columnNumber === move.columnNumber;
      if (isHit) {
        ship = tempShip;
        cell.isAttacked = true;
        break;
      }
    }
  }

  if (ship) {
    move.message = 'Hit';
    if (ship.isSunk) {
      move.message = `You just sank the ${ship.type}`;
    }

    const isEnd = this.ships.length === this.ships.filter(s => s.isSunk).length;
    if (isEnd) {
      move.message = `Win ! You completed the game in ${this.moves.length + 1} moves`;
    }
  } else {
    move.message = 'Miss';
  }

  this.moves.push(move);
  return this.save().then((result) => {
    return result.moves.slice(-1)[0];
  });
};

const gameModelName = 'Game';
let Game = mongoose.models[gameModelName];
if (!Game) {
  Game = mongoose.model(gameModelName, gameSchema);
}

module.exports = {Game};