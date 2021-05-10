require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
let cors = require('cors');
const helmet = require('helmet');
const NODE_ENV = require('./config');
const userRouter = require('./users/user-router');
const auth = require('./middleware/auth');
const exercisesRouter = require('./exercises/exercises-router');
const bodyPartsRouter = require('./body-parts/body-parts-router');
const muscleGroupsRouter = require('./muscle-groups/muscle-groups-router');
const mealsRouter = require('./meals/meals-router');
const bodyCompositionsRouter = require('./body-composition/body-compositions-router');

const jsonParser = express.json();
const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

var corsOptions = {
  origin: 'https://fit-journal-client-yefenny.vercel.app',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(morgan(morganOption));
app.use(cors(corsOptions));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://fit-journal-client-yefenny.vercel.app'
  );

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
app.use(express.static('public'));
app.use(jsonParser);

app.use('/api/users', cors(corsOptions), userRouter);
app.use(auth);
app.use('/api/exercises', exercisesRouter);
app.use('/api/body-parts', bodyPartsRouter);
app.use('/api/muscle-groups', muscleGroupsRouter);
app.use('/api/meals', mealsRouter);
app.use('/api/body-compositions', bodyCompositionsRouter);
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
