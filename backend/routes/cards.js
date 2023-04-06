const express = require('express');
const auth = require('../middlewares/auth');
const {
  getAllCards, deleteCardById, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const router = express.Router();

router.get('/cards', auth, getAllCards);
router.post('/cards', auth, createCard);
router.delete('/cards/:cardId', auth, deleteCardById);
router.put('/cards/:cardId/likes', auth, likeCard);
router.delete('/cards/:cardId/likes', auth, dislikeCard);

module.exports = router;
