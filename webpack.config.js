const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    devtool: 'eval-source-map',
    entry: [
        'webpack-hot-middleware/client?reload=true',
        "./public/entry.js"
    ],
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
        new HtmlWebpackPlugin({ 
            template: './views/index.jade'
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    ],
    module: {
        loaders: [
            { test: /\.css$/, loader: "style-loader!css-loader" },
            { test: /\.jade$/, loader: "pug-loader"}
        ]
    },
    devServer: {
        historyApiFallback: true
    }
};  