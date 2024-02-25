var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// added
const nodemailer = require('nodemailer');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var donar_module_router = require('./routes/donar-module');
var submitformRouter = require('./routes/submit-form');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/donar-module', donar_module_router);
// app.post('/submit-form', (req, res) => {
//   // Process the form data here
//   const username = req.body.username;
//   const password = req.body.password;

//   // Perform any necessary validation or processing of the form data

//   // Redirect to another page after processing
//   res.json({ message: 'Form submitted successfully! Thank you for donating' });
// });

app.use('/submit-form', submitformRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
