import path from 'path';
import { src, dest, parallel } from 'gulp';
import webpack from 'webpack-stream';
import webpackConfig from '../../webpack.config.js';
import browserSync from 'browser-sync';
import plumber from 'gulp-plumber';
import plumberConfig from '../utils/plumberConfig.js';
import filterEmptyGlobPatterns from '../utils/filterEmptyGlobPatterns.js';

//TODO: Возможно стоит добавить changed в таск

function scriptsMain() {
	return src('./src/scripts/index.js')
		.pipe(plumber(plumberConfig('Scripts Main')))
		.pipe(webpack(webpackConfig))
		.pipe(dest('./app/scripts/'), { base: './app/scripts/' })
		.pipe(browserSync.stream());
}

function scriptsLibrary() {
	return src('./src/scripts/libraries/**/*.js')
		.pipe(plumber(plumberConfig('Scripts Library')))
		.pipe(dest('./app/scripts/libraries/'), {
			base: './app/scripts/libraries/',
		})
		.pipe(browserSync.stream());
}

export default parallel(scriptsMain, scriptsLibrary);
