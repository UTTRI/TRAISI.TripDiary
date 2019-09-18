const path = require('path');
const WebpackSystemRegister = require('webpack-system-register');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
	entry: {
		timeline: path.join(process.cwd(), './timeline/timeline.module.ts'),
		routes: path.join(process.cwd(), './routes/routes.module.ts'),
	},

	output: {
		path: path.join(process.cwd(), 'dist'),
		filename: 'traisi-trip-diary-[name].module.js',
		libraryTarget: 'amd'
	},
	mode: 'development',
	devtool: 'inline-source-map',

	resolve: {
		extensions: ['.ts', '.js'],
		plugins: [new TsConfigPathsPlugin /* { tsconfig, compiler } */()]
	},

	module: {
		rules: [
			{
				test: /\.ts$/,
				loaders: ['angular2-template-loader?keepUrl=true', 'angular-router-loader'],
				exclude: [/node_modules/]
			},
			{
				test: /\.tsx?$/,
				use: 'ts-loader'
			},
			{
				test: /\.html?$/,
				use: 'raw-loader'
			},
			{
				test: /\.css$/,
				use: [
					'style-loader', // creates style nodes from JS strings
					'css-loader' // translates CSS into CommonJS
				]
			},
			{
				test: /\.scss$/,
				use: [
					'to-string-loader',
					{
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,

							sassOptions: {
								data: '@import "_styles";',
								includePaths: [path.join(__dirname, 'assets')]
							}
						}
					}
				]
			},
			{
				test: /\.(png|jp(e*)g|svg)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 32000, // Convert images < 8kb to base64 strings
							name: 'images/[hash]-[name].[ext]'
						}
					}
				]
			},
			{
				test: /\.js$/,
				include: [path.resolve(__dirname, 'node_modules/ngx-bootstrap')],
				use: {
					loader: 'babel-loader'
				}
			}
		]
	},
	/*externals: [
        function (context, request, callback) {
            if (/^@angular/.test(request)) {
                return callback(null, 'umd ' + request);
            }
            callback();
        }
    ],*/
	externals: [/^@angular/, /^ngx-bootstrap/, /^bootstrap/, /^bootswatch/],
	plugins: [
		new CopyWebpackPlugin([{ from: 'dist/', to: '../../../traisi-v2/src/TRAISI/development', toType: 'dir' }], { debug: 'warning' }),

		/* new WebpackSystemRegister({
             systemjsDeps: [
                 /^ngx-bootstrap/, // any import that starts with react
             ],
             registerName: 'test-module', // optional name that SystemJS will know this bundle as.
         }), */
		/*
        new UglifyJsPlugin({
            uglifyOptions:{
                output: {
                    comments: false,
                }
            }
        })  */
	]
};
