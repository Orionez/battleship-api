'use strict';

const {Game} = require('./game.model');
const shipFactory = require('./ship-factory');
const mockFactory = require('./mock-factory');
const {DuplicateMoveError} = require('../errors');

describe('Game Model', () => {


  describe('when create new Game', () => {
    const playerName = 'Test Player';
    test('should set ships with correct count for each type', () => {
      const game = Game.createNewGame(playerName);

      expect(game.ships).toBeDefined();
      expect(game.ships.filter(s => s.type === shipFactory.createBattleship().type).length).toBe(1);
      expect(game.ships.filter(s => s.type === shipFactory.createCruiser().type).length).toBe(2);
      expect(game.ships.filter(s => s.type === shipFactory.createDestroyer().type).length).toBe(3);
      expect(game.ships.filter(s => s.type === shipFactory.createSubmarine().type).length).toBe(4);
    });

    test('should call create new board and get ships with location from the board', () => {
      const game = Game.createNewGame(playerName);
      game.ships.forEach((s) => {
        expect(s.cells.length).toBe(s.health);
      });
    });
  });

  describe('when place move', () => {

    let game = null;
    let saveStub = null;
    beforeEach(() => {
      game = mockFactory.game.createGameWithValidBoard();
      saveStub = jest.spyOn(game, 'save');
      saveStub.mockReturnValue(Promise.resolve(game));
    });

    afterEach(() => {
      saveStub.mockRestore();
    });

    test('should throw error if move already been placed', () => {
      const inputMove = {rowNumber: 0, columnNumber: 0};
      game.moves.push(inputMove);
      return expect(game.placeMove(inputMove)).rejects.toThrow(DuplicateMoveError);
    });

    test('should put move into move list.', () => {
      return game.placeMove({rowNumber: 0, columnNumber: 0})
        .then(() => {
          expect(game.moves.length).toBe(1);
        });
    });

    describe('when place a move on sea area', () => {
      test(`should response with message 'Miss'.`, () => {
        const inputMove = {rowNumber: 0, columnNumber: 5};
        return game.placeMove(inputMove)
          .then(() => {
            expect(inputMove.message).toBe('Miss');
          });
      });
    });

    describe('when place a move on ship area', () => {
      test(`should response with message 'Hit' when ship has remaining Hp left.`, () => {
        const inputMove = {rowNumber: 0, columnNumber: 3};
        return game.placeMove(inputMove)
          .then(() => {
            expect(inputMove.message).toBe('Hit');
          });
      });

      test(`should response message successfully sunk ship when ship has no remaining Hp left.`, () => {
        const moves = mockFactory.move.createBattleShipHitMoves();
        const lastMove = moves[moves.length - 1];

        return moves.reduce((p, move) => {
          return p.then(() => game.placeMove(move));
        }, Promise.resolve())
          .then(() => {
            expect(lastMove.message).toBe('You just sank the Battleship');
          });
      });

      test(`should response win message when all ship is sunk.`, () => {
        const moves = mockFactory.move.createMovesToEndGame();
        const expectedMoveCount = moves.length;
        const lastMove = moves[moves.length - 1];

        return moves.reduce((p, move) => {
          return p.then(() => game.placeMove(move));
        }, Promise.resolve())
          .then(() => {
            expect(lastMove.message).toBe(`Win ! You completed the game in ${expectedMoveCount} moves`);
          });
      });
    });
  });

});