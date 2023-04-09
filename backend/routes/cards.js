const express = require('express');
const auth = require('../middlewares/auth');
const {
  getAllCards, deleteCardById, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { createCardSchema, cardIdSchema } = require('../middlewares/validation');

const router = express.Router();

router.get('/cards', auth, getAllCards);
router.post('/cards', auth, createCard);
router.delete('/cards/:cardId', auth, deleteCardById);
router.put('/cards/likes/:cardId/', auth, likeCard);
router.delete('/cards/likes/:cardId/', auth, dislikeCard);

module.exports = router;
