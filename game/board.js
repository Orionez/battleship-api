'use strict';

const {InvalidBoardError} = require('../errors');
const Board = function (fieldSize, ships) {
  this.ships = ships;
  let invalid = true;
  do {
    try {
      this.generateRowsAndColumns(fieldSize, ships);
      invalid = false;
    } catch (error) {
      if (error.name !== InvalidBoardError.name) {
        throw error;
      }
    }
  } while (invalid)
};

Board.prototype = {
  generateRowsAndColumns(fieldSize, ships) {
    this.rows = [];
    const rows = this.rows;
    for (let rowNumber = 0; rowNumber < fieldSize; rowNumber++) {
      const row = [];
      for (let columnNumber = 0; columnNumber < fieldSize; columnNumber++) {
        row.push({rowNumber, columnNumber, hasShip: false});
      }
      rows.push(row);
    }
    let shipFieldCount = ships.reduce((count, ship) => {
      return ship.health + count;
    }, 0);

    while (shipFieldCount > 0) {
      const randomRow = Math.floor(Math.random() * fieldSize);
      const randomCol = Math.floor(Math.random() * fieldSize);
      const field = rows[randomRow][randomCol];
      if (!field.hasShip && !this.hasShipInDiagonalColumn(randomRow, randomCol)) {
        field.hasShip = true;
        shipFieldCount--;
      }
    }
    this.validateAndSetShipLocation();
  },
  hasShipInDiagonalColumn(rowNumber, columnNumber) {
    const left = columnNumber - 1;
    const right = columnNumber + 1;
    const up = rowNumber + 1;
    const down = rowNumber - 1;
    const upperLeft = this.rows[up] ? this.rows[up][left] : undefined;
    const upperRight = this.rows[up] ? this.rows[up][right] : undefined;
    const lowerLeft = this.rows[down] ? this.rows[down][left] : undefined;
    const lowerRight = this.rows[down] ? this.rows[down][right] : undefined;

    return (!!upperLeft && upperLeft.hasShip) || (!!upperRight && upperRight.hasShip) || (!!lowerLeft && lowerLeft.hasShip) || (!!lowerRight && lowerRight.hasShip);
  },
  validateAndSetShipLocation() {
    this.ships.forEach((s) => s.cells = []);
    const rows = JSON.parse(JSON.stringify(this.rows));

    rows.forEach(row => {
      row.forEach(column => {
        if (column.hasShip && !column.alreadyChecked) {
          let left = column.columnNumber - 1;
          let right = column.columnNumber + 1;
          let up = column.rowNumber - 1;
          let down = column.rowNumber + 1;

          let consecutiveColumns = [column];
          while (left > -1 && row[left].hasShip) {
            consecutiveColumns.push(row[left]);
            left--;
          }

          while (right < row.length && row[right].hasShip) {
            consecutiveColumns.push(row[right]);
            right++;
          }

          while (up > -1 && rows[up][column.columnNumber].hasShip) {
            consecutiveColumns.push(rows[up][column.columnNumber]);
            up--;
          }

          while (down < rows.length && rows[down][column.columnNumber].hasShip) {
            consecutiveColumns.push(rows[down][column.columnNumber]);
            down++;
          }

          let ship = this.ships.find((s) => s.health === consecutiveColumns.length && s.cells.length !== s.health);
          if (!ship) {
            throw new InvalidBoardError('Invalid Board');
          }

          ship.cells = JSON.parse(JSON.stringify(consecutiveColumns));
          consecutiveColumns.forEach((c) => c.alreadyChecked = true);
        }
      });
    });
  }
};

module.exports = {Board};
