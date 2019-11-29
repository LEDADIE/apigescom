var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyparser = require("body-parser");
var cors = require('cors');


var indexRouter = require('./routes/index');
var clientsRouter = require('./routes/clients');
var categoriesRouter = require('./routes/categories');
var commandesRouter = require('./routes/commandes');
var produitsRouter = require('./routes/produits');
var lignecommandesRouter = require('./routes/lignecommandes');
var venteRouter = require('./routes/ventes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(bodyparser.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/api/WorkSpaceClients', clientsRouter);
app.use('/api/WorkSpaceCategories', categoriesRouter);
app.use('/api/WorkSpaceCommandes', commandesRouter);
app.use('/api/WorkSpaceProduits', produitsRouter);
app.use('/api/WorkSpaceLignecommandes', lignecommandesRouter);
app.use('/api/Vente', venteRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;