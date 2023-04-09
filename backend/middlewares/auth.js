require('dotenv').config();
const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../utils/httpStatusCodes');
const ApiError = require('../utils/ApiError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new ApiError('No token provided.', UNAUTHORIZED));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // payload = jwt.verify(token, 'some-secret-key');
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new ApiError('No token provided.', UNAUTHORIZED));
  }
  req.user = payload; // assigning the payload to the request object
  return next(); // sending the request to the next middleware
};