// Karma configuration
// Generated on Fri Oct 11 2019 05:53:27 GMT-0400 (Eastern Daylight Time)
let webpack = require('./webpack.config.test');
module.exports = function(config) {
	config.set({
		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: './',
		plugins: ['karma-jasmine', 'karma-chrome-launcher', 'karma-webpack'],
		karmaTypescriptConfig: {
			tsconfig: './tsconfig.spec.json'
		},

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine'],
		mime: {
			'text/x-typescript': ['ts', 'tsx']
		},

		// list of files / patterns to load in the browser
		files: [
			'tests/**/*.ts' // *.tsx for React Jsx
		],

		webpack: webpack,

		// list of files / patterns to exclude
		exclude: ['node_modules/*'],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'tests/*.ts': ['webpack'],
		},

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress'],

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['Chrome'],

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity
	});
};
