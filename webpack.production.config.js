const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');

module.exports = {
    entry: ["./public/entry.js"],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "bundle-[hash].js",
        publicPath: path.resolve(__dirname, '/')
    },
    plugins: [
        new webpack.ProvidePlugin({
            '$': 'jquery',
            'jQuery': 'jquery',
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new ExtractTextPlugin('[name]-[hash].min.css'),
        new StatsPlugin('webpack.stats.json', {
	        source: false,
	        modules: false
	    }),
	    new webpack.DefinePlugin({
		    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
		}),
        new webpack.optimize.UglifyJsPlugin({
          comments: false,
          compress: {
            unused: true,
            dead_code: true,
            warnings: false,
            drop_debugger: true,
            conditionals: true,
            evaluate: true,
            drop_console: true,
            sequences: true,
            booleans: true
          },
          minimize: true
        }),
        new HtmlWebpackPlugin({
            template: './views/index.jade',
            inject: 'body'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': 'production'
        }),
    ],
    module: {   
        loaders: [
	        { test: /\.css$/, loader: ExtractTextPlugin.extract({fallback: "style-loader", use: "css-loader"})},
            { test: /\.jade$/, loader: "pug-loader"},
            { test: /\.js$/, loader: "babel-loader", query: {presets: ['es2015']}},
            { test: /\.(png|jpg|jpeg|gif|woff)$/, loader: 'url-loader' },
        ]
    }
 };
