import {common} from './webpack.common.js';

export default {
  ...common,
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    open: '/',
    // static files are served from the repository
    static: [
      {
        directory: './',
        publicPath: '/'
      },
      {
        directory: './demo',
        publicPath: '/demo'
      },
    ]
  }
};
