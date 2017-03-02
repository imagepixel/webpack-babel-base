import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default function(settings) {
  const {
    sourceMaps,
    minify,
    nodeEnv,
    devServer,
    devServerPort
  } = settings;

  const styleLoaders = [
    sourceMaps ? 'css-loader?sourceMap' : 'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        plugins: () => ([
          autoprefixer({browsers: ['last 2 version']})
        ])
      }
    },
    sourceMaps ? 'sass-loader?sourceMap' : 'sass-loader',
    'import-glob-loader'
  ];

  return {
    // Entries define which file chunks will be created
    entry: {
      // The dev server here is a special case and does not reflect a file in the build folder
      devServer: `webpack-dev-server/client?http://localhost:${devServerPort}`,
      // The main.js file will be generated with the index.js source file as root
      main: [
        'webpack/hot/only-dev-server',
        path.resolve(__dirname, '../src/js/index.js')
      ]
    },
    // Output defines where the build files will be created by webpack
    output: {
      path: path.resolve(__dirname, '../build'),
      // The pattern [name] will be replaced by the key of the entry object in this case by "main"
      filename: '[name].js',
      publicPath: '/'
    },
    resolve: {
      // This lets webpack also search for modules in the node_modules folder
      modules: ['node_modules']
    },
    module: {
      // Rules define which loaders to use on which files
      rules: [
        {
          // Therefore every rule contains a regex.
          // If the regex matches the loaders will be applied to the current file.
          test: /\.scss$/,
          use: devServer
            ? ['style-loader', ...styleLoaders]
            // In case there is no dev server we want to extract the generated styles
            // to reside in its own main.css file.
            : ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: styleLoaders
            })
        }, {
          test: /\.js$/,
          // We do not need to transpile node module since we expect
          // that they already contain final build files
          exclude: /node_modules/,
          use: [
            'babel-loader'
          ]
        }, {
          test: /\.(jpg|png|gif|svg)$/,
          // Only use the above test on files within the following folders
          include: [
            path.resolve(__dirname, '../src/assets/images')
          ],
          use: ['file-loader']
        }, {
          test: /\.svg$/,
          // Only use the above test on files within the following folders
          include: [
            path.resolve(__dirname, '../src/assets/icons')
          ],
          use: [
            'svg-sprite-loader?' + JSON.stringify({
              name: 'icon-[name]',
              prefixize: true
            }),
            'svgo-loader' // This loader minifies SVG files
          ]
        }, {
          // It is necessary to tell webpack to put fonts into their own files
          // otherwise webpack would complain if we use any custom font families within our styles
          test: /\.(ttf|eot|woff|woff2|svg)$/,
          include: [
            path.resolve(__dirname, '../src/assets/fonts')
          ],
          use: ['file-loader']
        }
      ]
    },
    plugins: [
      // Define that the extracted styles will be written into a file called main.css
      new ExtractTextPlugin('main.css'),
      // Define arbitrary global JS variables which can then be accessed within the application
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(nodeEnv)
        }
      }),
      // Create an index.html file in the build which gets styles and scripts injected
      new HtmlWebpackPlugin({
        template: path.join(__dirname, '../src/index.html'),
        inject: true
      }),
      ...(minify ? [
        new webpack.optimize.UglifyJsPlugin()
      ] : [])
    ],
    // Enable source maps
    // https://webpack.github.io/docs/configuration.html#devtool
    devtool: sourceMaps ? 'inline-source-map' : undefined,
    devServer: {
      contentBase: path.resolve(__dirname, '../src'),
      port: devServerPort
    }
  };
}
