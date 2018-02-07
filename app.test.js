'use strict';

const request = require('supertest');
const app = require('./index');
const mockFactory = require('./game/mock-factory');
const {Game} = require('./game/game.model');
const mongoose = require('mongoose');

expect.extend({
  shipsToNotHaveCellsReturned(game) {
    let pass = true;
    game.ships.every(s => {
      pass = !s.cells;
      return pass;
    });

    if (!pass) {
      return {
        message: () => `expect ship to not return cells.`,
        pass: false,
      };
    }

    return {
      pass: true
    }
  },
});

describe('Games', () => {

  let validGame = null;
  beforeEach(() => {
    validGame = mockFactory.game.createGameWithValidBoard();
    return Game.remove({}).then(() => {
      return Game.create(validGame);
    });
  });

  describe('when call GET /games', () => {
    test('should respond all games', (done) => {
      return request(app)
        .get('/games')
        .then((response) => {
          expect(response.statusCode).toBe(200);
          expect(response.body.length).toBe(1);
          done();
        });
    });

    test('should not return ship cells', (done) => {
      return request(app)
        .get('/games')
        .then((response) => {
          expect(response.statusCode).toBe(200);
          const games = response.body;
          games.forEach(g => {
            expect(g).shipsToNotHaveCellsReturned();
          });
          done();
        });
    });
  });

  describe('when call GET /games/:id', () => {
    test('should respond game with matched id', (done) => {
      return request(app)
        .get(`/games/${validGame._id.toString()}`)
        .then((response) => {
          expect(response.statusCode).toBe(200);
          expect(response.body._id).toBe(validGame._id.toString());
          done();
        });
    });

    test('should not return ship cells', (done) => {
      return request(app)
        .get(`/games/${validGame._id.toString()}`)
        .then((response) => {
          expect(response.statusCode).toBe(200);
          expect(response.body).shipsToNotHaveCellsReturned();
          done();
        });
    });

    test('should 404 when game id not found', (done) => {
      return request(app)
        .get(`/games/${mongoose.Types.ObjectId().toString()}`)
        .then((response) => {
          expect(response.statusCode).toBe(404);
          done();
        });
    });
  });

  describe('when call POST /games/:id', () => {
    test('should create new game', (done) => {
      const playerName = 'John Doe';
      return request(app)
        .post(`/games`)
        .send({playerName})
        .then((response) => {
          const game = response.body;
          expect(response.statusCode).toBe(201);
          expect(game._id).toBeDefined();
          expect(game.playerName).toBe(playerName);
          expect(game).shipsToNotHaveCellsReturned();
          done();
        });
    });
  });

  describe('when call POST /games/:id/moves', () => {
    test('should create new move and return message', (done) => {
      const input = {rowNumber: 0, columnNumber: 0};
      return request(app)
        .post(`/games/${validGame._id.toString()}/moves`)
        .send(input)
        .then((response) => {
          const move = response.body;
          expect(response.statusCode).toBe(201);
          expect(move._id).toBeDefined();
          expect(move.rowNumber).toBe(input.rowNumber);
          expect(move.columnNumber).toBe(input.columnNumber);
          expect(move.message).toBeDefined();
          done();
        });
    });

    test('should return error when game is not exists', (done) => {
      const input = {rowNumber: 0, columnNumber: 0};
      return request(app)
        .post(`/games/${mongoose.Types.ObjectId().toString()}/moves`)
        .send(input)
        .then((response) => {
          expect(response.statusCode).toBe(404);
          done();
        });
    });

    test('should return error when place duplicate moves', (done) => {
      const input = {rowNumber: 0, columnNumber: 0};
      let agent = request(app);
      const exec = () => {
        return agent
          .post(`/games/${validGame._id.toString()}/moves`)
          .send(input);
      };
      return exec().then((response) => {
        const move = response.body;
        expect(response.statusCode).toBe(201);
        expect(move._id).toBeDefined();
        expect(move.rowNumber).toBe(input.rowNumber);
        expect(move.columnNumber).toBe(input.columnNumber);
        expect(move.message).toBeDefined();
        return exec();
      }).then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBeDefined();
        done();
      });
    });

    test('should able to place move until game end', (done) => {

      let moves = mockFactory.move.createMovesToEndGame();
      let agent = request(app);

      const tasksForExecution = moves.map((m) => {
        return () => {
          return agent
            .post(`/games/${validGame._id.toString()}/moves`)
            .send(m);
        }
      });

      const serializedPromise = tasksForExecution.reduce((p, task) => {
        return p.then(() => {
          return task();
        })
      }, Promise.resolve());

      return serializedPromise.then((response) => {
        expect(response.body.message).toBe(`Win ! You completed the game in ${moves.length} moves`);
        done();
      });
    })
  });
});