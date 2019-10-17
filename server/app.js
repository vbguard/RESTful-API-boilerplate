// const createError = require('http-errors');
const express = require('express');
const passport = require('passport');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const helmet = require('helmet');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('../config/swagger.json');

// Import Router
const router = require('./routes/routes');
const config = require('../config/config');
// start App - Express
const app = express();

// Connect Mongo DB
require('../config/mongodb');

const isDevMode = process.env.NODE_ENV !== 'production';
// view engine setup
// React view engine setup
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'jsx');
// const viewEngineOptions = { beautify: true };
app.engine('jsx', require('express-react-views').createEngine());

// Add Middleware to Express
if (isDevMode) app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Set Secure to Server
app
  .disable('x-powered-by')
  .use(cors('*'))
  .use(helmet())
  .use(
    sassMiddleware({
      src: path.join(__dirname, 'public'),
      dest: path.join(__dirname, 'public'),
      indentedSyntax: true, // true = .sass and false = .scss
      sourceMap: true
    })
  )
  .use(passport.initialize())
  .use(passport.session());

require('../config/passport')(passport);

app.use(express.static(path.join(__dirname, 'static')));

app
  .get('/', (req, res) => {
    res.render('index', { name: 'John' });
  })
  .use(config.apiPATH, router)
  .use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

  // catch 404 and forward to error handler
  .use((req, res, next) => {
    res.render('error', { status: 404 });
    // next(createError(404));
  })

  // error handler
  .use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

module.exports = app;
