const { httpStatusCodes } = require('./httpStatusCodes');

module.exports = class Api404Error extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.status = httpStatusCodes.NOT_FOUND;
  }
};
