'use strict';

const {Board} = require('./board');
const {createMockBoardWithNoShip, createValidBoardWithoutShipCells} = require('./mock-factory').board;
const shipFactory = require('./ship-factory');
const {InvalidBoardError} = require('../errors');

describe('Board Test', () => {
  describe('when create new Board.', () => {
    let board = null;
    const expectedRowAndColumnCount = 10;
    const ships = shipFactory.createNewFleet();
    let spyValidateAndSetShipLocation = null;

    beforeEach(() => {
      board = new Board(expectedRowAndColumnCount, ships);
      spyValidateAndSetShipLocation = jest.spyOn(Board.prototype, 'validateAndSetShipLocation');
    });

    afterEach(() => {
      spyValidateAndSetShipLocation.mockRestore();
    });

    test('should return rows and columns equals to fieldSize.', () => {
      expect(board.rows.length).toBe(expectedRowAndColumnCount);
      board.rows.forEach((row) => {
        expect(row.length).toBe(expectedRowAndColumnCount);
      });
    });

    test('should return count of ship cell equals to total of ship health from input.', () => {
      const totalOfShipHealth = 20;
      let countShipFields = 0;
      board.rows.forEach((row) => {
        row.forEach((col) => {
          if (col.hasShip) {
            countShipFields++;
          }
        })
      });

      expect(countShipFields).toBe(totalOfShipHealth);
    });

    test('should check board validity and check diagonal placement', () => {
      let spyValidateAndSetShipLocation = jest.spyOn(Board.prototype, 'validateAndSetShipLocation');
      let spyHasShipInDiagonalColumn = jest.spyOn(Board.prototype, 'hasShipInDiagonalColumn');

      const board = new Board(expectedRowAndColumnCount, ships);

      expect(spyValidateAndSetShipLocation).toHaveBeenCalled();
      expect(spyHasShipInDiagonalColumn).toHaveBeenCalled();
    });

    test('should retry until board is valid', () => {
      const expectedCallCount = 3;
      let count = 0;
      spyValidateAndSetShipLocation.mockImplementation(() => {
        count++;
        if (count < expectedCallCount) {
          throw new InvalidBoardError();
        }
      });

      const board = new Board(expectedRowAndColumnCount, ships);

      expect(spyValidateAndSetShipLocation).toHaveBeenCalledTimes(expectedCallCount);
    });

  });

  describe('when check for ship in diagonal columns.', () => {
    test('should return true when ship is in diagonal area.', () => {
      const lowerRight = createMockBoardWithNoShip();
      lowerRight.rows[0][1].hasShip = true;
      lowerRight.rows[1][2].hasShip = true;
      expect(lowerRight.hasShipInDiagonalColumn(0, 1)).toBe(true);

      const lowerLeft = createMockBoardWithNoShip();
      lowerLeft.rows[0][1].hasShip = true;
      lowerLeft.rows[1][0].hasShip = true;
      expect(lowerLeft.hasShipInDiagonalColumn(0, 1)).toBe(true);

      const upperRight = createMockBoardWithNoShip();
      upperRight.rows[2][2].hasShip = true;
      upperRight.rows[1][3].hasShip = true;
      expect(upperRight.hasShipInDiagonalColumn(2, 2)).toBe(true);

      const upperLeft = createMockBoardWithNoShip();
      upperLeft.rows[2][2].hasShip = true;
      upperLeft.rows[1][1].hasShip = true;
      expect(upperLeft.hasShipInDiagonalColumn(2, 2)).toBe(true);
    });

    test('should return false when ship is in diagonal area', () => {
      const mock = createMockBoardWithNoShip();
      expect(mock.hasShipInDiagonalColumn(0, 1)).toBe(false);
      expect(mock.hasShipInDiagonalColumn(2, 2)).toBe(false);
      expect(mock.hasShipInDiagonalColumn(4, 3)).toBe(false);
    });
  });

  describe('when call getShipsWithLocation.', () => {

    test('should throw exception Invalid Board when ship count is invalid.', () => {
      //place 5 submarines
      const invalidSubmarineCount = createMockBoardWithNoShip();
      let exec = (board) => {
        return () => board.validateAndSetShipLocation();
      };
      invalidSubmarineCount.rows[0][1].hasShip = true;
      invalidSubmarineCount.rows[2][2].hasShip = true;
      invalidSubmarineCount.rows[4][4].hasShip = true;
      invalidSubmarineCount.rows[6][6].hasShip = true;
      invalidSubmarineCount.rows[9][9].hasShip = true;

      expect(exec(invalidSubmarineCount)).toThrowError(InvalidBoardError);

      //place 4 Destroyers
      const invalidDestroyerCount = createMockBoardWithNoShip();
      //Destroyer#1
      invalidDestroyerCount.rows[0][1].hasShip = true;
      invalidDestroyerCount.rows[0][2].hasShip = true;

      //Destroyer#2
      invalidDestroyerCount.rows[4][1].hasShip = true;
      invalidDestroyerCount.rows[3][1].hasShip = true;

      //Destroyer#3
      invalidDestroyerCount.rows[5][4].hasShip = true;
      invalidDestroyerCount.rows[6][4].hasShip = true;

      //Destroyer#4
      invalidDestroyerCount.rows[9][8].hasShip = true;
      invalidDestroyerCount.rows[9][9].hasShip = true;

      expect(exec(invalidDestroyerCount)).toThrowError(InvalidBoardError);

      //place 3 Cruisers
      const invalidCruiserCount = createMockBoardWithNoShip();
      //Cruiser#1
      invalidCruiserCount.rows[0][1].hasShip = true;
      invalidCruiserCount.rows[0][2].hasShip = true;
      invalidCruiserCount.rows[0][3].hasShip = true;

      //Cruiser#2
      invalidCruiserCount.rows[2][1].hasShip = true;
      invalidCruiserCount.rows[3][1].hasShip = true;
      invalidCruiserCount.rows[4][1].hasShip = true;

      //Cruiser#3
      invalidCruiserCount.rows[7][8].hasShip = true;
      invalidCruiserCount.rows[8][8].hasShip = true;
      invalidCruiserCount.rows[9][8].hasShip = true;

      expect(exec(invalidCruiserCount)).toThrowError(InvalidBoardError);

      //place 2 Battleships
      const invalidBattleshipCount = createMockBoardWithNoShip();
      //Battleship#1
      invalidBattleshipCount.rows[0][1].hasShip = true;
      invalidBattleshipCount.rows[0][2].hasShip = true;
      invalidBattleshipCount.rows[0][3].hasShip = true;
      invalidBattleshipCount.rows[0][4].hasShip = true;

      //Battleship#2
      invalidBattleshipCount.rows[6][4].hasShip = true;
      invalidBattleshipCount.rows[7][4].hasShip = true;
      invalidBattleshipCount.rows[8][4].hasShip = true;
      invalidBattleshipCount.rows[9][4].hasShip = true;

      expect(exec(invalidBattleshipCount)).toThrowError(InvalidBoardError);
    });

    test('should set ships location when ship placement is valid.', () => {
      const validBoard = createValidBoardWithoutShipCells();
      validBoard.validateAndSetShipLocation();
      validBoard.ships.forEach((s) => {
        expect(s.cells).toBeDefined();
        expect(s.cells.length).toBe(s.health);
      });
    });
  });
});