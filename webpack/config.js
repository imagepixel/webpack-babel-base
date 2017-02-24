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
    entry: {
      devServer: `webpack-dev-server/client?http://localhost:${devServerPort}`,
      main: [
        'webpack/hot/only-dev-server',
        path.resolve(__dirname, '../src/js/index.js')
      ]
    },
    output: {
      path: path.resolve(__dirname, '../build'),
      filename: '[name].js',
      publicPath: '/'
    },
    resolve: {
      modules: ['node_modules']
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: devServer
            ? ['style-loader', ...styleLoaders]
            : ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: styleLoaders
            })
        }, {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            'babel-loader'
          ]
        }, {
          test: /\.(jpg|png|gif|svg)$/,
          include: [
            path.resolve(__dirname, '../src/assets/images')
          ],
          use: ['file-loader']
        }, {
          test: /\.svg$/,
          include: [
            path.resolve(__dirname, '../src/assets/icons')
          ],
          use: [
            'svg-sprite-loader?' + JSON.stringify({
              name: 'icon-[name]',
              prefixize: true
            }),
            'svgo-loader'
          ]
        }, {
          test: /\.(ttf|eot|woff|woff2|svg)$/,
          include: [
            path.resolve(__dirname, '../src/assets/fonts')
          ],
          use: ['file-loader']
        }
      ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new ExtractTextPlugin('main.css'),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(nodeEnv)
        }
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, '../src/index.html'),
        inject: true
      }),
      ...(minify ? [
        new webpack.optimize.UglifyJsPlugin()
      ] : [])
    ],
    // https://webpack.github.io/docs/configuration.html#devtool
    devtool: sourceMaps ? 'inline-source-map' : undefined,
    devServer: {
      hot: true,
      contentBase: path.resolve(__dirname, '../src'),
      port: devServerPort
    }
  };
}
