const webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
    entry: ['webpack/hot/dev-server',"./public/entry.js"],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "bundle-[hash].js",
        publicPath: path.resolve(__dirname, '/')
    },
    devServer: {
        hot: true,
        inline: true
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style-loader!css-loader" },
            { test: /\.jade$/, loader: "pug-loader"}
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            '$': 'jquery',
            'jQuery': 'jquery',
        }),
        new HtmlWebpackPlugin({ 
            template: './views/index.jade'
        })
    ],
    devServer: {
        historyApiFallback: true
    }
};  