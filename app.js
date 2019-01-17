const express = require('express');
const mongoose = require("mongoose");

var ClientesRouter = require('./routes/clientes');
var CursosRouter = require('./routes/cursos');
var ValidacionRouter = require('./routes/validacion')

const app = express();
const port = 3000;

app.use('/api/clientes', ClientesRouter);
app.use('/api/cursos', CursosRouter);
app.use('/api/validacion', ValidacionRouter);

app.use(express.static('public'));

mongoose.connect('mongodb://localhost/capacitacion');
var db = mongoose.connection;

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

  res.json({
     message: err.message,
     error: err
  });
});

module.exports = app;
