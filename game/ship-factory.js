'use strict';

const {Ship} = require('./ship.model');

function createBattleship() {
  return new Ship({type: 'Battleship', health: 4});
}

function createCruiser() {
  return new Ship({type: 'Cruiser', health: 3});
}

function createDestroyer() {
  return new Ship({type: 'Destroyer', health: 2});
}

function createSubmarine() {
  return new Ship({type: 'Submarine', health: 1});
}

function createNewFleet() {
  return [
    createBattleship(),
    createCruiser(),
    createCruiser(),
    createDestroyer(),
    createDestroyer(),
    createDestroyer(),
    createSubmarine(),
    createSubmarine(),
    createSubmarine(),
    createSubmarine()
  ]
}

module.exports = {
  createBattleship,
  createCruiser,
  createDestroyer,
  createSubmarine,
  createNewFleet
};