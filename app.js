const express = require('express');
const path = require('path');
const rp = require('request-promise');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.js');
const populateRisk = require('./lib/riskGrid');
const dangerTest = require('./lib/dangerTest');
const routes = require('./routes/index');
const riskGrid = populateRisk('result.txt');
const bodyParser = require('body-parser');
const qs = require('querystring');
const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 8080 : process.env.PORT;
const app = express();

let APIKey = 'AIzaSyAE6o3bNueg57_Ij5oK3oTqd40R0nac5No';
let a = {
      uri: 'https://maps.googleapis.com/maps/api/directions/json?',
      qs: {
        origin:`place_id:ChIJDWQUKbXSJIgRE4GK31hWlms`, destination: `place_id:ChIJdR3LEAHKJIgR0sS5NU6Gdlc`,
        language: 'en', mode: 'walking', alternatives: true, key: APIKey
      }
    };

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

if(isDeveloping) {
  console.log("NO");
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    PublicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      has: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });
  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  
  app.get('/', function response(req, res) {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
    res.end();
  });

  app.post('/danger', function response(req, res) {
    let placeId = req.body.data;
    let option = {
      uri: 'https://maps.googleapis.com/maps/api/directions/json?',
      qs: {
        origin:`place_id:${placeId[0]}`, destination: `place_id:${placeId[1]}`,
        language: 'en', mode: 'walking', alternatives: true, key: APIKey
      }
    };
    rp(option)
      .then(function(json) {
        console.log(json);
        res.json({ data: dangerTest(JSON.parse(json), riskGrid)});
      })
      .catch(function(err) {
        console.error("Failed to get JSON from Google API", err);
      })
});

} else {
  console.log("YES");
  app.use(express.static(__dirname + '/dist'));
  app.get('/', function response(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });

  app.post('/danger', function response(req, res) {
    let placeId = req.body.data;
    let option = {
      uri: 'https://maps.googleapis.com/maps/api/directions/json?',
      qs: {
        origin:`place_id:${placeId[0]}`, destination: `place_id:${placeId[1]}`,
        language: 'en', mode: 'walking', alternatives: true, key: APIKey
      },
      json: true
    };

    rp(options)
      .then(function(json) {
        res.json({ data: dangerTest(json), riskGrid});
      })
      .catch(function(err) {
        console.error("Failed to get JSON from Google API", err);
      })
});
}


/*
app.get('/getGeo/:start/:dest', function(req, res) {
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
});*/

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
  res.status('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;