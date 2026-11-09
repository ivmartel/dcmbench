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
// - from: path relative to the repository root,
// - to: path in the output, 'demo' is the output root.
export const staticFiles = [
  {from: 'demo/index.html', to: 'index.html'},
  {from: 'demo/css', to: 'css'},
  {from: 'demo/about.html', to: 'about.html'},
  ...parsers.flatMap((parser) => parser.globalScripts ?? [])
    .map((src) => ({from: src, to: src}))
];

const parserEntries = {};
const parserPages = [];
for (const parser of parsers) {
  const entryName = 'parser-' + parser.name;
  // the module exports are assigned to the iframe window
  parserEntries[entryName] = {
    import: './demo/parsers/' + parser.name + '.js',
    library: {type: 'window'}
  };
  // parser pages are in 'parsers/' (relative to the output root)
  const globalScripts = (parser.globalScripts ?? []).map(
    (src) => '../' + src
  );
  parserPages.push(new HtmlWebpackPlugin({
    template: './demo/parsers/parser.html',
    filename: 'parsers/' + parser.name + '.html',
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
    template: './demo/' + name + '.html',
    filename: name + '.html',
    scriptLoading: 'module',
    chunks: ['dcmbench', name]
  });
}

export const common = {
  entry: {
    dcmbench: './src/index.js',
    bench: './demo/bench.js',
    diff: './demo/diff.js',
    memory: './demo/memory.js',
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
