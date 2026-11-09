import HtmlWebpackPlugin from 'html-webpack-plugin';

// parsers: each one is loaded in its own iframe page to isolate it
// (globals, library instances) from the others.
// - globalScripts: classic scripts loaded before the parser module,
//   for libraries that only work as globals (path relative to the root).
export const parsers = [
  {
    name: 'ctk-dcmjs',
    globalScripts: [
      'ext/ctk-dcmjs/libs/jquery-1.11.0.min.js',
      'ext/ctk-dcmjs/libs/dcmjs-nico.js',
      'ext/ctk-dcmjs/utils.js'
    ]
  },
  {name: 'daikon'},
  {name: 'dcmjs'},
  {name: 'dicomParser'},
  {
    name: 'dwv-previous',
    globalScripts: ['ext/dwv-previous/dwv.min.js']
  },
  {name: 'dwv'}
];

// files served as is: not processed by webpack
// (path relative to the root, same path in the output)
export const staticFiles = [
  'index.html',
  'css',
  'view/about.html',
  ...parsers.flatMap((parser) => parser.globalScripts ?? [])
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
  // parser pages are in 'view/parsers/'
  const globalScripts = (parser.globalScripts ?? []).map(
    (src) => '../../' + src
  );
  parserPages.push(new HtmlWebpackPlugin({
    template: './view/parsers/parser.html',
    filename: 'view/parsers/' + parser.name + '.html',
    chunks: [entryName],
    parserName: parser.name,
    globalScripts: globalScripts
  }));
}

/**
 * Get a view page plugin.
 *
 * @param {string} name The view name, for example 'bench'.
 * @returns {HtmlWebpackPlugin} The plugin.
 */
function getViewPage(name) {
  return new HtmlWebpackPlugin({
    template: './view/' + name + '.html',
    filename: 'view/' + name + '.html',
    scriptLoading: 'module',
    chunks: ['dcmbench', name]
  });
}

export const common = {
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
  plugins: [
    getViewPage('bench'),
    getViewPage('diff'),
    getViewPage('memory'),
    ...parserPages
  ]
};
