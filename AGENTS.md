# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project

dcmbench is a browser-based benchmark of JavaScript DICOM parsers (speed,
memory, dump diff). It is a static web site built with webpack and published
to GitHub Pages (`gh-pages` branch, `demo/trunk`) by CI on every push to `main`.

Parsers compared: `ctk-dcmjs` (dcmtk compiled with emscripten, vendored),
`daikon`, `dcmjs`, `dicomParser`, `dwv` (npm) and `dwv-previous` (an older
vendored dwv build).

## Commands

Package manager is **Yarn 4** (via corepack, `nodeLinker: node-modules`).
Node >= 22.15 (CI uses Node 26).

| Task | Command |
|------|---------|
| Install | `yarn install` (CI: `yarn install --immutable`) |
| Lint | `yarn run lint` |
| Unit tests (watch) | `yarn test` |
| Unit tests (CI, with coverage) | `yarn run test-ci` → `build/coverage/` |
| Dev server | `yarn start` (webpack-dev-server, localhost:8080) |
| Production build | `yarn run build` → `build/dist/` |

Before finishing a change, run `yarn run lint`, `yarn run test-ci` and
`yarn run build` — CI runs exactly these three.

## Layout

- `src/` — core library (ES modules, entry `src/index.js`, bundle `dcmbench`):
  - `dataRunner.js` — iterates over a data list (URL via XHR or `File` via
    FileReader), passes each buffer to a function runner, fires
    `status-change` events (`ready`/`running`/`cancelling`/`cancelled`/`done`).
  - `benchFunctionRunner.js` — speed measurement with `tinybench`.
  - `memoryFunctionRunner.js` — heap delta via `performance.memory`
    (Chrome only).
  - `diffFunctionRunner.js` — compares parser dumps with `diff`.
  - `parserFrames.js` — `getParserFunction(name, func)` reads a function
    from the parser iframe `iframe-<name>`.
  - `gui.js`, `dragndrop.js`, `listen.js` — table rendering, drag & drop,
    listener handler.
- `view/` — the three pages (`bench`, `memory`, `diff`), each an `.html`
  template + `.js` entry, plus `defaultData.js` (default test files list).
- `view/parsers/<name>.js` — one adapter per parser exporting `parse(buffer)`,
  and optionally `parse2(buffer)` (returns `performance.memory`, used by the
  memory page) and `dump(buffer)` (returns a string, used by the diff page).
- `view/parsers/parser.html` — template generating one page per parser.
- `config/webpack.{common,dev,prod}.js` — build config. `common.js` holds the
  `parsers` list and `staticFiles` (copied as is in prod).
- `ext/` — vendored third-party builds (`ctk-dcmjs`, `dwv-previous`).
  Do not lint, reformat or edit these.
- `data/` — DICOM test files (`<name>.dcm` + `<name>.jpg` preview). In
  production the pages fetch them from `raw.githubusercontent.com` (main),
  in development from the local folder (see `view/defaultData.js`).
- `tests/` — vitest unit tests (`*.test.js`, node environment).
- `css/`, `index.html`, `view/about.html` — static, not processed by webpack.

## Architecture notes

- **Each parser runs in its own hidden iframe** to isolate its globals and
  library instances. Webpack builds `view/parsers/<name>.html` for each entry
  of `parsers` in `config/webpack.common.js`; the adapter module's exports are
  assigned to the iframe `window` (`library: {type: 'window'}`).
- Libraries that only work as globals are loaded as classic scripts before the
  adapter through `globalScripts` (paths relative to the repo root).
- View pages resolve parser functions only at `window.onload`, when iframe
  content is available.

### Adding a parser

1. Add the dependency (`yarn add ...`) or vendor it under `ext/<name>/` with a
   `readme.md` stating source, version and date.
2. Create `view/parsers/<name>.js` exporting `parse` (and `parse2` / `dump`
   if it should appear on the memory / diff pages).
3. Add `{name, globalScripts?}` to `parsers` in `config/webpack.common.js`.
4. In each view that should use it, add
   `<iframe src="./parsers/<name>.html" id="iframe-<name>" style="display:none">`
   to `view/<page>.html` and an entry to the parser list in `view/<page>.js`.
5. Mention it in the README parser list.

## Code style

Enforced by ESLint 10 flat config (`eslint.config.js`: recommended rules plus
`@stylistic` formatting rules):

- ES modules (`"type": "module"`), 2-space indent, single quotes, semicolons,
  max line length 80, 1TBS braces, `curly` always, `===` only.
- No space before named function parens: `function foo()`,
  but `function ()` for anonymous ones.
- No spaces inside `{}`/`[]`: `{name: 'dwv'}`.
- Unused arguments must be prefixed with `_`; no dead assignments
  (`no-useless-assignment`, e.g. `let x = '';` immediately overwritten).
- Private class members use `#fields`; public methods are documented with
  JSDoc (`@param`, `@returns`).
- Browser and node globals are both allowed.

## Testing

- Vitest, `tests/**/*.test.js`, node environment (no DOM).
  `performance.memory` does not exist in node — mock it as
  `tests/memoryFunctionRunner.test.js` does.
- Coverage thresholds (v8): 20% statements/functions/lines.
- Views and parser adapters are not unit-tested; check them manually with
  `yarn start` (memory page needs Chrome).

## Conventions

- License is GPL-3.0; contributions fall under `.github/contributing.md`.
- Dependabot keeps dependencies updated (auto-merge workflow enabled);
  keep `yarn.lock` consistent (`--immutable` in CI).
- `build/` is generated and git-ignored.
