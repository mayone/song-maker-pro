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
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");


module.exports = {
    // mode: 'development',
    context: __dirname,
    entry: './src/Main',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'build/[name].js',
        publicPath: '/',
        // library: "songmaker"
    },

    devServer: {
        host: 'localhost',
        port: 9000,
        contentBase: path.resolve(__dirname, 'dist'),
        contentBasePublicPath: '/',
        filename: '[name].js',
        index: 'index.html',
        headers: { "Access-Control-Allow-Origin": "*" },
        hot: true
    },

    resolve: {
        alias: {
            style: path.resolve(__dirname, 'style'),
            images: path.resolve(__dirname, 'images')
        },
        modules: ['src', 'node_modules'],
    },

    plugins: [
        new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin({
            title: 'Song Maker',
            favicon: 'images/favicon.png'
        }),
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                { from: "audio", to: "audio" },
                { from: "images", to: "images" },
            ],
        }),
    ],

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: [],
                loader: 'babel-loader'
            }, {
                test: /\.s[ac]ss$/,

                use: [{
                    // creates style nodes from JS strings
                    loader: "style-loader"
                }, {
                    // translates CSS into CommonJS
                    loader: "css-loader",

                    options: {
                        modules: {
                            // Interoperable CSS
                            compileType: 'icss'
                        },
                        sourceMap: true
                    }
                }, {
                    // compiles Sass to CSS
                    loader: "sass-loader",

                    options: {
                        sourceMap: true
                    }
                }]
            }, {
                test: /\.(svg|png)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        }
                    }
                ],
            }, {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        // options: {
                        //     attributes: {
                        //         root: '.'
                        //     }
                        // }
                    }
                ],
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