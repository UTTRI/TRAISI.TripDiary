const path = require('path');
const WebpackSystemRegister = require('webpack-system-register');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');
module.exports = {
	entry: {
		timeline: path.join(process.cwd(), './timeline/timeline.module.ts'),
		routes: path.join(process.cwd(), './routes/routes.module.ts')
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
				exclude: [path.resolve(__dirname, 'node_modules/mapbox-gl'), /node_modules/],
				use: {
					loader: 'babel-loader',
					options: {
						plugins: [
							"@babel/plugin-proposal-class-properties"
						]
					}
				}
			},
			/*{
				test: /\.ts$/,
				exclude: [/node_modules/],
				use: {
					use: 'babel-loader',
					options: {
						plugins: [
							"@babel/plugin-proposal-class-properties"
						]
					}
				}
			}, */
			{
				test: /\.tsx?$/,
				use: 'babel-loader'
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
				test: /\.m?js$/,
				exclude: [path.resolve(__dirname, 'node_modules/mapbox-gl'), /node_modules/],
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
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
	externals: [/^@angular/, /^ngx-bootstrap/, /^bootstrap/, /^bootswatch/, /^rxjs/, /^@ng-bootstrap\/ng-bootstrap/, /^angular-popper/, /^popper\.js/],
	plugins: [
		// new CopyWebpackPlugin([{ from: 'dist/', to: '../../../traisi-v2/src/TRAISI/development', toType: 'dir' }], { debug: 'warning' }),
		new CopyWebpackPlugin([{ from: 'dist/', to: '../../../TRAISI/development', toType: 'dir' }], { debug: 'warning' }),
		new webpack.ProvidePlugin({
				   L: 'leaflet',
				 	ExtraMarkers: 'leaflet-extra-markers'
				   
			     }),
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
