import HtmlWebpackPlugin from 'html-webpack-plugin';

// parsers: each one is loaded in its own iframe page to isolate it
// (globals, library instances) from the others.
// - globalScripts: classic scripts loaded before the parser module,
//   for libraries that only work as globals (path relative to the page).
const parsers = [
  {
    name: 'ctk-dcmjs',
    globalScripts: [
      '../../ext/ctk-dcmjs/libs/jquery-1.11.0.min.js',
      '../../ext/ctk-dcmjs/libs/dcmjs-nico.js',
      '../../ext/ctk-dcmjs/utils.js'
    ]
  },
  {name: 'daikon'},
  {name: 'dcmjs'},
  {name: 'dicomParser'},
  {
    name: 'dwv-previous',
    globalScripts: ['../../ext/dwv-previous/dwv.min.js']
  },
  {name: 'dwv'}
];

const parserEntries = {};
const parserPages = [];
for (const parser of parsers) {
  const entryName = 'parser-' + parser.name;
  // the module exports are assigned to the iframe window
  parserEntries[entryName] = {
    import: './view/parsers/' + parser.name + '.js',
    library: {type: 'window'}
  };
  parserPages.push(new HtmlWebpackPlugin({
    template: './view/parsers/parser.html',
    filename: 'view/parsers/' + parser.name + '.html',
    chunks: [entryName],
    parserName: parser.name,
    globalScripts: parser.globalScripts ?? []
  }));
}

export default {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    dcmbench: './src/index.js',
    bench: './view/bench.js',
    diff: './view/diff.js',
    memory: './view/memory.js',
    ...parserEntries
  },
  resolve: {
    // node modules referenced by emscripten builds (daikon CharLS),
    // only used when running in node
    fallback: {fs: false, path: false}
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
    ...parserPages
  ]
};
