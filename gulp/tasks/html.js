import browserSync from 'browser-sync';
import dotenv from 'dotenv';
import { dest, src } from 'gulp';
import plumber from 'gulp-plumber';
import prettyHtml from 'gulp-pretty-html';
import ssi from 'gulp-ssi';
import plumberConfig from '../utils/plumberConfig.js';

// Get NODE ENVIRONMENT
dotenv.config();
const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

// Config objects
const prettyHtmlConfig = {
	indent_size: 4,
	preserve_newlines: false,
};
const htmlminConfig = {
	collapseWhitespace: true,
	removeComments: true,
	minifyCSS: true,
	minifyJS: true,
	html5: true,
};

export default function html() {
	return (
		src(['./src/html/**/*.html', '!./src/html/blocks/**/*.html'])
			.pipe(plumber(plumberConfig('HTML')))
			// .pipe(changed('./app'))
			.pipe(ssi())
			.pipe(prettyHtml(prettyHtmlConfig))
			// .pipe(gulpIf( isProd, htmlmin(htmlminConfig) ))
			.pipe(dest('./app'), { base: './app' })
			.on('end', browserSync.reload)
	);
}
