'use strict';

const {Game} = require('./game.model');

function findAll(req, res) {
  Game.find().exec().then((games) => {
    res.send(games).end();
  });
}

function findById(req, res) {
  const id = req.params.id;
  Game.findById(id).exec()
    .then((game) => {
      if (!game) {
        res.sendStatus(404);
      } else {
        res.send(game).end();
      }
    });
}

function create(req, res) {
  const game = Game.createNewGame(req.body.playerName);
  game.save()
    .then(() => {
      res.status(201).send(game).end();
    });
}

function placeMove(req, res) {
  const id = req.params.id;
  Game.findById(id).exec()
    .then((game) => {
      if (!game) {
        res.sendStatus(404);
      } else {
        return game.placeMove(req.body);
      }
    })
    .then((move) => {
      res.status(201).send(move).end();
    })
    .catch((error) => {
      if (error.statusCode) {
        res.status(error.statusCode).send({message: error.message}).end();
      } else {
        res.sendStatus(500);
      }
    })
}


module.exports = {
  findAll,
  findById,
  create,
  placeMove
};


