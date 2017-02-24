import config from '../webpack/config';

export default config({
  sourceMaps: false,
  devServer: false,
  devServerPort: null,
  minify: true,
  nodeEnv: 'production'
});
