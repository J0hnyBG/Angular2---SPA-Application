const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const path = require('path');
const helpers = require('./helpers');

module.exports = {
    entry: {
        'polyfills': './client/app/polyfills.ts',
        'vendor': './client/app/vendor.ts',
        'app': './client/app/main.ts',
    },
    resolve: {
        root: [path.resolve(__dirname, '../app'), path.resolve(__dirname, '../../node_modules'), path.resolve(__dirname, '../../bower_components')],
        extensions: ['', '.ts', '.js', '.css'],
        alias: {
            jquery: path.resolve(__dirname, '../../node_modules/jquery/dist/jquery.min.js'),
            bootstrap: path.resolve(__dirname, '../../node_modules/bootstrap/dist/js/bootstrap.min.js'),
            bootstrapCss: path.resolve(__dirname, '../../node_modules/bootstrap/dist/css/bootstrap.min.css')
        }
    },
    module: {
        loaders: [{
            test: /\.ts$/,
            loaders: [
                'awesome-typescript-loader',
                'angular2-template-loader'
            ]
        }, {
            test: /\.html$/,
            loader: 'html-loader'
        }, {
            test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
            loader: 'file?name=assets/[name].[ext]'
        }, {
            test: /\.css$/,
            exclude: helpers.root('src', 'app'),
            loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
        }, {
            test: /\.css$/,
            include: helpers.root('src', 'app'),
            loader: 'raw-loader'
        }]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills']
        }),

        new HtmlWebpackPlugin({
            template: './client/index.html'
        }),

        new ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)src(\\|\/)linker/,
            helpers.root('app', 'node_modules'), // location of your src
            {
                // your Angular Async Route paths relative to this root directory
            }
        ),
        new ExtractTextPlugin("[name].css", { allChunks: true }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jquery: "jquery",
            "window.jQuery": "jquery",
            jQuery: "jquery"
        })
    ]
};
