/**
 * Get a function exposed by a parser iframe page.
 *
 * Each parser runs in its own iframe (id 'iframe-<name>') to isolate it
 * from the others; its page sets parse, parse2 and/or dump on its window.
 * Only available once the iframe has loaded (window.onload of the view).
 *
 * @param {string} parserName The parser name, for example 'dwv'.
 * @param {string} funcName The function name: 'parse', 'parse2' or 'dump'.
 * @returns {Function|undefined} The function, undefined if not found.
 */
export function getParserFunction(parserName, funcName) {
  const iframe = document.getElementById('iframe-' + parserName);
  if (!iframe) {
    console.warn('No iframe for parser: ' + parserName);
    return undefined;
  }
  const func = iframe.contentWindow[funcName];
  if (typeof func !== 'function') {
    console.warn('No ' + funcName + ' function for parser: ' + parserName);
    return undefined;
  }
  return func;
}
