var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cons = require("consolidate")


var indexRouter = require('./routes/index');
var chatRouter = require('./routes/chat');
var usersRouter = require('./routes/users');
var userRouter = require('./routes/user');
var gameRouter = require('./routes/game');
var editorRouter = require('./routes/editor');
//var streamingRouter = require('./routes/streaming');
var lsRouter = require('./routes/livesupport');
var brainRouter = require('./routes/brain');
let lssupRouter = require('./routes/ls-sup')
let cryptoRouter = require('./routes/crypt')

var app = express();

// view engine setup
app.engine("html",cons.swig)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(__dirname+'/public'))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.use('/', indexRouter);
app.use('/chat', chatRouter);
app.use('/users', usersRouter);
app.use('/user', userRouter);
app.use('/game', gameRouter)
app.use('/editor', editorRouter)
//app.use('/streaming', streamingRouter)
app.use('/livesupport',lsRouter)
app.use('/brain',brainRouter)
app.use('/support',lssupRouter)
app.use('/crypto',cryptoRouter)


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
  res.render('error.pug');
});

module.exports = app;
