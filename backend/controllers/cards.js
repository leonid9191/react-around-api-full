const Card = require("../models/card");
const httpStatusCodes = require("../utils/httpStatusCodes");
const ApiError = require("../utils/ApiError");

// get all cards
module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() =>
      next(
        new ApiError(
          "An error has occurred on the server.",
          httpStatusCodes.INTERNAL_SERVER
        )
      )
    );
};

// remove card by ID
module.exports.deleteCardById = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      const error = new ApiError("data not found", httpStatusCodes.NOT_FOUND);
      throw error;
    })
    .then((card) =>
    {
      if(!card.owner.equals(req.user._id)){
        return next(new ApiError('You are not owner of the card', httpStatusCodes.NOT_FOUND));
      }
      return card.deleteOne()
      .then(() => res.send({ data: card }));
    })
    .catch((err) => {
      if (err.statusCode === httpStatusCodes.NOT_FOUND) {
        next(new ApiError("User not found", httpStatusCodes.NOT_FOUND));
      } else if (err.name === "CastError") {
        next(new ApiError("Bad Request", httpStatusCodes.BAD_REQUEST));
      } else {
        next(
          new ApiError(
            "An error has occurred on the server.",
            httpStatusCodes.INTERNAL_SERVER
          )
        );
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
      if (err.name === "ValidationError") {
        next(new ApiError("Invalid Data", httpStatusCodes.BAD_REQUEST));
      } else {
        next(
          new ApiError(
            "An error has occurred on the server",
            httpStatusCodes.INTERNAL_SERVER
          )
        );
      }
    });
};

// like card
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) =>
      !card
        ? res
            .status(httpStatusCodes.NOT_FOUND)
            .send({ message: "user not found" })
        : res.send({ data: card })
    )
    .catch((err) => {
      if (err.statusCode === httpStatusCodes.NOT_FOUND) {
        next(new ApiError("User not found", httpStatusCodes.NOT_FOUND));
      } else if (err.name === "CastError") {
        next(new ApiError("Bad Request", httpStatusCodes.BAD_REQUEST));
      } else {
        next(
          new ApiError(
            "An error has occurred on the server.",
            httpStatusCodes.INTERNAL_SERVER
          )
        );
      }
    });
};

// dislike card
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) =>
      !card
        ? res
            .status(httpStatusCodes.NOT_FOUND)
            .send({ message: "user not found" })
        : res.send({ data: card })
    )
    .catch((err) => {
      if (err.statusCode === httpStatusCodes.NOT_FOUND) {
        next(new ApiError("User not found", httpStatusCodes.NOT_FOUND));
      } else if (err.name === "CastError") {
        next(new ApiError("Bad Request", httpStatusCodes.BAD_REQUEST));
      } else {
        next(
          new ApiError(
            "An error has occurred on the server.",
            httpStatusCodes.INTERNAL_SERVER
          )
        );
      }
    });
};
