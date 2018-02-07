'use strict';

const {Board} = require('./board');
const {Game} = require('./Game.model');
const shipFactory = require('./ship-factory');

function buildCell(rowNumber, columnNumber) {
  return {rowNumber, columnNumber, isAttacked: false};
}


function createMockBoardWithNoShip() {
  const board = new Board(10, shipFactory.createNewFleet());
  board.rows.forEach(row => {
    row.forEach(col => {
      col.hasShip = false;
    });
  });
  board.ships.forEach(s => {
    s.cells = [];
  });
  return board;
}

function createBattleShipHitMoves() {
  return [
    buildCell(0, 0), buildCell(0, 1), buildCell(0, 2), buildCell(0, 3)
  ];
}

function createCruiserHitMoves() {
  return [
    buildCell(2, 0), buildCell(2, 1), buildCell(2, 2),
    buildCell(2, 4), buildCell(2, 5), buildCell(2, 6)
  ];
}

function createDestroyerHitMoves() {
  return [
    buildCell(2, 8), buildCell(2, 9),
    buildCell(4, 4), buildCell(5, 4),
    buildCell(7, 0), buildCell(8, 0),
  ];
}

function createSubmarineHitMoves() {
  return [
    buildCell(0, 6),
    buildCell(5, 7),
    buildCell(7, 4),
    buildCell(9, 9)
  ];
}

function createOnlyHitMoves() {
  let battleships = createBattleShipHitMoves();
  let cruisers = createCruiserHitMoves();
  let destroyers = createDestroyerHitMoves();
  let submarines = createSubmarineHitMoves();
  return battleships.concat(cruisers, destroyers, submarines);
}

function createMovesToEndGame() {
  return [buildCell(3, 3), buildCell(5, 5), buildCell(7, 7), buildCell(8, 8)].concat(createOnlyHitMoves());
}

function createValidBoard() {
  const validBoard = createValidBoardWithoutShipCells();
  let battleshipMoves = createBattleShipHitMoves();
  let cruiserMoves = createCruiserHitMoves();
  let destroyerMoves = createDestroyerHitMoves();
  let submarineMoves = createSubmarineHitMoves();

  validBoard.ships.filter(s => s.type === shipFactory.createBattleship().type)
    .forEach((s) => {
      s.cells = battleshipMoves.splice(0, s.health);
    });
  validBoard.ships.filter(s => s.type === shipFactory.createCruiser().type)
    .forEach((s) => {
      s.cells = cruiserMoves.splice(0, s.health);
    });
  validBoard.ships.filter(s => s.type === shipFactory.createDestroyer().type)
    .forEach((s) => {
      s.cells = destroyerMoves.splice(0, s.health);
    });
  validBoard.ships.filter(s => s.type === shipFactory.createSubmarine().type)
    .forEach((s) => {
      s.cells = submarineMoves.splice(0, s.health);
    });
  return validBoard;
}

function createValidBoardWithoutShipCells() {
  const validBoard = createMockBoardWithNoShip();
  createOnlyHitMoves().forEach((move) => {
    validBoard.rows[move.rowNumber][move.columnNumber].hasShip = true;
  });
  return validBoard;
}

function createGameWithValidBoard() {
  const game = new Game({playerName: 'Test Player'});
  let board = createValidBoard();
  game.ships = board.ships;
  return game;
}

module.exports = {
  board: {
    createValidBoard,
    createMockBoardWithNoShip,
    createValidBoardWithoutShipCells
  },
  game: {
    createGameWithValidBoard
  },
  move: {
    createBattleShipHitMoves,
    createOnlyHitMoves,
    createMovesToEndGame
  }
};