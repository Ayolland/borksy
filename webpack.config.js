const Html = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	plugins: [
		new Html({
			template: './src/index.html',
			favicon: './src/borksy.gif'
		})
	],
	module: {
		rules: [{
			test: /\.scss$/,
			use: [
				'style-loader', // creates style nodes from JS strings
				'css-loader', // translates CSS into CommonJS
				'sass-loader', // compiles Sass to CSS
				'postcss-loader' // used for autoprefixer
			]
		}, {
			test: /\.(png|jpg|gif)$/,
			use: [{
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
				}
			}]
		}, {
			test: /\.html$/,
			use: {
				loader: "html-loader"
			}
		}, {
			test: /\.txt$/,
			use: {
				loader: "raw-loader"
			}
		}, {
			test: /\.md$/,
			use: [{
				loader: "html-loader"
			}, {
				loader: "markdown-loader"
			}]
		}]
	}
};
