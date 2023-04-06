const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const httpStatusCodes = require('./utils/httpStatusCodes');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const { PORT = 3000 } = process.env;
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

mongoose.connect('mongodb://localhost:27017/aroundb');
const app = express();
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/signin', login);
app.post('/signup', createUser);
app.use((req, res, next) => {
  req.user = {
    _id: '640348d6ed9581759a6f64a3',
  };

  next();
});
app.use(cardsRouter);
app.use(usersRouter);
app.use((req, res) => {
  res.status(httpStatusCodes.NOT_FOUND).send({ message: 'Requested resource not found' });
});
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
