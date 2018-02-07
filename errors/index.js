'use strict';

function InvalidBoardError(message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
}

function DuplicateMoveError(message = 'Move have already been placed.') {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.statusCode = 400;
}

module.exports = {
  InvalidBoardError,
  DuplicateMoveError
};