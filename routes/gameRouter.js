const {Router} = require('express');
const gameController = require('../controllers/gameController.js');

const gameRouter = Router();

gameRouter.post('/checkValid', gameController.checkValid);
gameRouter.get('/characters', gameController.getCharacters);
gameRouter.post('/winner', gameController.createWinner);
gameRouter.get('/winners', gameController.getWinners);

module.exports = gameRouter;