const path = require('path');
const WebpackSystemRegister = require('webpack-system-register');

const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
module.exports = {
	entry: {
		timeline: path.join(process.cwd(), './timeline/timeline.module.ts'),
		routes: path.join(process.cwd(), './routes/routes.module.ts'),
	},

	node: {
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
	},
	output: {
		path: path.join(process.cwd(), 'dist'),
		filename: 'traisi-trip-diary-[name].module.js',
		libraryTarget: 'amd'
	},
	mode: 'development',
	//devtool: 'inline-source-map',
	optimization: { usedExports: true, sideEffects: true },
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
							sourceMap: false
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: false,

							sassOptions: {
								data: '@import "_styles";',
								includePaths: [path.join(__dirname, 'assets'), ".assets/"]
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
							limit: 12000, // Convert images < 8kb to base64 strings
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
	externals: [/^@angular/, /^ngx-bootstrap/, /^bootstrap/, /^bootswatch/, /^rxjs/],
	plugins: [


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
