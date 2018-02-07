'use strict';

const router = require('express')();
const controller = require('./game.controller');

router.get('/', controller.findAll);
router.get('/:id', controller.findById);
router.post('/', controller.create);
router.post('/:id/moves', controller.placeMove);

module.exports = router;