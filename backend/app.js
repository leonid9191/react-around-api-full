require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const httpStatusCodes = require('./utils/httpStatusCodes');
const { errorLogger, requestLogger } = require('./middlewares/logger');

const limiter = rateLimit({
  windowMs: 15 * 60 * 100000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const { PORT = 3000 } = process.env;
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

mongoose.connect('mongodb://localhost:27017/aroundb');
const app = express();
app.use(limiter);
app.use(cors());
app.options('*', cors()); // enable requests for all routes
app.use(helmet());
app.use(express.json());
app.use(requestLogger);
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cardsRouter);
app.use(usersRouter);
app.use((req, res) => {
  res
    .status(httpStatusCodes.NOT_FOUND)
    .send({ message: 'Requested resource not found' });
});
app.use(errorLogger);
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
