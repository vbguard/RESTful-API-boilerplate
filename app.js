const createError = require('http-errors');
const express = require('express');
const passport = require('passport');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const helmet = require('helmet');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('./config/swagger.json');

// Import Router
const router = require('./routes/routes');

// add .env file see
require('dotenv').config();

// start App - Express
const app = express();

// Connect Mongo DB
require('./config/mongodb');

// view engine setup
// React view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
// const viewEngineOptions = { beautify: true };
app.engine('jsx', require('express-react-views').createEngine());

// Add Middleware to Express
app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Set Secure to Server
app.disable('x-powered-by');
app.use(cors('*'));
app.use(helmet());
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
  })
);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', {name: 'John'});
});
app.use('/api', router);
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
