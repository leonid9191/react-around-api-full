const User = require("../models/user");
const jwt = require('jsonwebtoken');
const httpStatusCodes = require("../utils/httpStatusCodes");
const ApiError = require('../utils/ApiError');
const { JWT_SECRET, NODE_ENV } = process.env;

//get current user
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new ApiError('User id not found.', httpStatusCodes.NOT_FOUND);
    })
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

// get all users
module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() =>
      res
        .status(httpStatusCodes.INTERNAL_SERVER)
        .send({ message: "An error has occurred on the server." })
    );
};
// get user by ID
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error(`User with id: ${req.params.id} not found.`);
      error.statusCode = httpStatusCodes.NOT_FOUND;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === httpStatusCodes.NOT_FOUND) {
        res
          .status(httpStatusCodes.NOT_FOUND)
          .send({ message: "user not found" });
      } else if (err.name === "CastError") {
        res
          .status(httpStatusCodes.BAD_REQUEST)
          .send({ message: "Bad Request" });
      } else {
        res
          .status(httpStatusCodes.INTERNAL_SERVER)
          .send({ message: "An error has occurred on the server." });
      }
    });
};
//Create new user
module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({ email, password: hash, name, about, avatar })
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        if (err.name === "ValidationError") {
          res
            .status(httpStatusCodes.BAD_REQUEST)
            .send({ message: "invalid data" });
        } else {
          res
            .status(httpStatusCodes.INTERNAL_SERVER)
            .send({ message: "An error has occurred on the server." });
        }
      });
  });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const error = new Error(
        "invalid data passed to the methods for updating a user"
      );
      error.statusCode = httpStatusCodes.NOT_FOUND;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === httpStatusCodes.NOT_FOUND) {
        res
          .status(httpStatusCodes.NOT_FOUND)
          .send({ message: "user not found" });
      } else if (err.name === "ValidationError") {
        res
          .status(httpStatusCodes.BAD_REQUEST)
          .send({ message: "Bad Request" });
      } else if (err.name === "CastError") {
        res
          .status(httpStatusCodes.BAD_REQUEST)
          .send({ message: "Bad Request" });
      } else {
        res
          .status(httpStatusCodes.INTERNAL_SERVER)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const error = new Error(
        "invalid data passed to the methods for updating a user"
      );
      error.statusCode = httpStatusCodes.NOT_FOUND;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === httpStatusCodes.NOT_FOUND) {
        res
          .status(httpStatusCodes.NOT_FOUND)
          .send({ message: "user not found" });
      } else if (err.name === "ValidationError") {
        res
          .status(httpStatusCodes.BAD_REQUEST)
          .send({ message: "Bad Request" });
      } else if (err.name === "CastError") {
        res
          .status(httpStatusCodes.BAD_REQUEST)
          .send({ message: "Bad Request" });
      } else {
        res
          .status(httpStatusCodes.INTERNAL_SERVER)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

//login
module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Incorrect email or password'));
      }

      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        // the hashes didn't match, rejecting the promise
        return Promise.reject(new Error('Incorrect email or password'));
      }
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' })
      // authentication successful
      res.send(token);
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};