const path = require('path');
const webpack = require('webpack');




/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

/*
 * We've enabled TerserPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/terser-webpack-plugin
 *
 */

const TerserPlugin = require('terser-webpack-plugin');




module.exports = {
    mode: 'development',
    entry: './src/Main',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },

    resolve: {
        alias: {
            // images: path.resolve(__dirname, 'images'),
            style: path.resolve(__dirname, 'style')
        },
        modules: ['src', 'images', 'style', 'data', 'midi', 'history', 'modal', 'sound', 'grid', 'input', 'keyboard', 'mic', 'functions', 'top', 'bottom', 'cloud', 'node_modules'],
    },

    plugins: [new webpack.ProgressPlugin()],

    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            include: [],
            loader: 'babel-loader'
        }, {
            test: /.(scss|css)$/,

            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader",

                options: {
                    sourceMap: true
                }
            }, {
                loader: "sass-loader",

                options: {
                    sourceMap: true
                }
            }]
        }, {
            test: /\.(svg|png)$/,
            use: "url-loader",
        }, {
            test: /\.html$/i,
            use: 'html-loader',
        }, {
            // test: /\.(svg|png)$/,
            // use: [
            //     {
            //         loader: 'file-loader',
            //         options: {
            //             name: '[name]-[hash].[ext]'
            //         }
            //     }
            // ]
        }]
    },

    optimization: {
        minimizer: [new TerserPlugin()],

        splitChunks: {
            cacheGroups: {
                vendors: {
                    priority: -10,
                    test: /[\\/]node_modules[\\/]/
                }
            },

            chunks: 'async',
            minChunks: 1,
            minSize: 30000,
            name: false
        }
    }
}