import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const nodeEnv = process.env.NODE_ENV;
const isDev = nodeEnv === 'development';
const isProd = !isDev;

function fileName() {
	return isDev ? '[name].js' : '[name].js';
}

export default {
	entry: {
		index: path.resolve('src/scripts/index.js'),
	},
	output: {
		filename: fileName(),
	},
	mode: nodeEnv,
	// optimization: {
	// 	minimize: false,
	// },
	devtool: isDev ? 'inline-source-map' : false,
	resolve: {
		extensions: ['.js'],
		alias: {
			'@': path.resolve('src'),
			'@modules': path.resolve('src/scripts/modules'),
		},
		modules: [
			path.resolve('src/scripts/modules'),
			path.resolve('node_modules'),
		],
	},
	module: {
		rules: [
			{
				test: '/.js$/',
				exclude: path.resolve('node_modules'),
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
			{
				test: '/.css/',
				use: ['style-loader', 'css-loader'],
			},
		],
	},
};
