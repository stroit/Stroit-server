const express = require('express');
const path = require('path');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const favicon = require('serve-favicon');
const qs = require('querystring');
const bodyParser = require('body-parser');

const config = require('./webpack.config.js');
const main = require('./routes/index');
const getCrimeData = require('./routes/crime');
const getDanger = require('./routes/danger');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 8080 : process.env.PORT;
const app = express();

app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

console.log("NODE_ENV: ", process.env.NODE_ENV);

if (isDeveloping) {
    console.log("[!] Running for Development");
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

    app.get('/', main);
    app.get('/crime', getCrimeData);
    app.post('/danger', getDanger);

} else {
    console.log("[!] Running for Production");
    app.use(express.static(__dirname + '/dist'));

    app.get('/', function response(req, res) {
        res.sendFile(path.join(__dirname, 'dist/index.html'));
    });
    app.get('/crime', getCrimeData);
    app.post('/danger', getDanger);
}

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