const Card = require('../models/card');
const httpStatusCodes = require('../utils/httpStatusCodes');

// get all cards
module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(httpStatusCodes.INTERNAL_SERVER).send({ message: 'An error has occurred on the server.' }));
};

// remove card by ID
module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      const error = new Error('data not found');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.statusCode === httpStatusCodes.NOT_FOUND) {
        res.status(httpStatusCodes.NOT_FOUND).send({ message: 'user not found' });
      } else if (err.name === 'CastError') {
        res.status(httpStatusCodes.BAD_REQUEST).send({ message: 'Bad Request' });
      } else {
        res
          .status(httpStatusCodes.INTERNAL_SERVER)
          .send({ message: 'An error has occurred on the server.' });
      }
    });
};

// create new card
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(httpStatusCodes.BAD_REQUEST).send({ message: 'invalid data' });
      } else {
        res
          .status(httpStatusCodes.INTERNAL_SERVER)
          .send({ message: 'An error has occurred on the server.' });
      }
    });
};

// like card
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => (!card
      ? res.status(httpStatusCodes.NOT_FOUND).send({ message: 'user not found' })
      : res.send({ data: card })))
    .catch((err) => {
      if (err.statusCode === httpStatusCodes.NOT_FOUND) {
        res.status(httpStatusCodes.NOT_FOUND).send({ message: 'user not found' });
      } else if (err.name === 'CastError') {
        res.status(httpStatusCodes.BAD_REQUEST).send({ message: 'Bad Request' });
      } else {
        res
          .status(httpStatusCodes.INTERNAL_SERVER)
          .send({ message: 'An error has occurred on the server.' });
      }
    });
};

// dislike card
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => (!card
      ? res.status(httpStatusCodes.NOT_FOUND).send({ message: 'user not found' })
      : res.send({ data: card })))
    .catch((err) => {
      if (err.statusCode === httpStatusCodes.NOT_FOUND) {
        res.status(httpStatusCodes.NOT_FOUND).send({ message: 'user not found' });
      } else if (err.name === 'CastError') {
        res.status(httpStatusCodes.BAD_REQUEST).send({ message: 'Bad Request' });
      } else {
        res
          .status(httpStatusCodes.INTERNAL_SERVER)
          .send({ message: 'An error has occurred on the server.' });
      }
    });
};
