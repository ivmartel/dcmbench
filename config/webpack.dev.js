import {common} from './webpack.common.js';

export default {
  ...common,
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    open: '/',
    // static files are served from the repository,
    // with 'demo' as the site root
    static: [
      {
        directory: './demo',
        publicPath: '/'
      },
      {
        directory: './ext',
        publicPath: '/ext'
      },
      {
        directory: './data',
        publicPath: '/data'
      }
    ]
  }
};
