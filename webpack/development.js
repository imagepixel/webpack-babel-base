import config from './config';

export default config({
  devServer: true,
  devServerPort: 3000,
  sourceMaps: true,
  minify: false,
  nodeEnv: 'development'
});
