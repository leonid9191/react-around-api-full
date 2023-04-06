const { httpStatusCodes } = require('./httpStatusCodes');

module.exports = class Api400Error extends Error {
  constructor(message) {
    super(message);
    this.name = 'Bad Request';
    this.status = httpStatusCodes.BAD_REQUEST;
  }
};
