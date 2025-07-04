import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    dcmbench: './src/index.js',
    bench: './view/bench.js',
    diff: './view/diff.js',
    memory: './view/memory.js'
  },
  devServer: {
    open: '/',
    static: [
      {
        directory: './',
        publicPath: '/'
      },
      {
        directory: './view',
        publicPath: '/view'
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './view/bench.html',
      filename: 'view/bench.html',
      scriptLoading: 'module',
      chunks: ['dcmbench', 'bench']
    }),
    new HtmlWebpackPlugin({
      template: './view/diff.html',
      filename: 'view/diff.html',
      scriptLoading: 'module',
      chunks: ['dcmbench', 'diff']
    }),
    new HtmlWebpackPlugin({
      template: './view/memory.html',
      filename: 'view/memory.html',
      scriptLoading: 'module',
      chunks: ['dcmbench', 'memory']
    }),
  ]
};