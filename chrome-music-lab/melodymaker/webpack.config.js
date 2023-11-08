/**
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const path = require('path');
const webpack = require('webpack');

var PROD = JSON.parse(process.env.PROD_ENV || '0');

module.exports = {
	mode: 'development',
	entry: {
		"Main": "./src/Main",
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js'
	},
	resolve: {
		alias: {
			style: path.resolve(__dirname, 'style/')
		},
		modules: ["style", "src", "third_party/Tone.js/", "third_party", "node_modules"],
	},
	devServer: {
		static: {
			directory: path.join(__dirname, '/'),
		},
		compress: true,
		port: 9000,
	},
	plugins: PROD ? [
		new webpack.optimize.UglifyJsPlugin({ minimize: true })
	] : [],
	module: {
		rules: [
			{
				test: /\.s[ac]ss$/i,
				use: [
					// Creates `style` nodes from JS strings
					"style-loader",
					// Translates CSS into CommonJS
					"css-loader",
					// Compiles Sass to CSS
					"sass-loader",
				],
			},
			{
				test: /\.(png|gif)$/,
				use: "url-loader",
			},
			{
				test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
				use: "file-loader?name=images/font/[hash].[ext]"
			}
		]
	}
};