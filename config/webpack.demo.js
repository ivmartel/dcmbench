import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';

import {common, staticFiles} from './webpack.common.js';

// demo build: a self-contained static site in 'build/dist',
// published to gh-pages by CI
export default {
  ...common,
  mode: 'production',
  output: {
    path: path.resolve(import.meta.dirname, '../build/dist'),
    filename: '[name].[contenthash].js',
    clean: true
  },
  performance: {
    // parser libraries are big, no need to warn
    hints: false
  },
  plugins: [
    ...common.plugins,
    new CopyPlugin({
      // copy as is: do not minimize (vendored builds)
      patterns: staticFiles.map((from) => ({
        from,
        to: from,
        info: {minimized: true}
      }))
    })
  ]
};
