var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var readline = require('readline');
const rp = require('request-promise');

var populateRisk = require('./lib/riskGrid');
var dangerTest = require('./lib/dangerTest');
//var routes = require('./routes/index');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// var riskGrid = populateRisk('result.txt');
app.use(require('body-parser').json());

app.use('/', function(req, res) {
  res.render('/dist/index.html');
});

app.get('/getGeo/:start/:dest', function(req, res) {
  console.log("\n\n\n\n\n\n\\n\n\n\n\n\n\n\\n\\fasdfafdf\n\n\nn\\nn");
  let baseAPIUrl = 'https://maps.googleapis.com/maps/api/directions/json?';
  let apiKEY = "&language=en&mode=walking&alternatives=true&key=AIzaSyAE6o3bNueg57_Ij5oK3oTqd40R0nac5No";
  let start = `origin=place_id:${req.params('start')}`;
  let dest = `&destination=place_id:${req.parm('dest')}`;
  console.log(baseAPIUrl+start+dest+apiKEY);

  let option = {
    method: 'GET',
    uri: baseAPIUrl+start+dest+apiKEY,
    json: true
  };

  rp(option)
    .then(function(parsedJson) {
      res.send(parsedJson);
    })
    .catch(function(err) {
      console.error(err);
    })
});

/*
app.post('/danger', function(req, res){
  //calcalute using ur functions
  //Take json response from google (data)
  //Calc function and then return array of safety
  res.json({ data: dangerTest(JSON.parse(req.body.data), riskGrid)});
});
*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;