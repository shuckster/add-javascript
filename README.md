<h1 align="center"><code>add-javascript</code> 📜</h1>

<p align="center">
  <a href="https://github.com/shuckster/add-javascript/blob/master/LICENSE">
    <img
      alt="MIT license"
      src="https://img.shields.io/npm/l/add-javascript?style=plastic"
    /></a>
  <a href="https://bundlephobia.com/result?p=add-javascript">
    <img
      alt="npm bundle size"
      src="https://img.shields.io/bundlephobia/minzip/add-javascript?style=plastic"
    /></a>
  <a href="https://www.npmjs.com/package/add-javascript">
    <img
      alt="Version"
      src="https://img.shields.io/npm/v/add-javascript?style=plastic"
    /></a>
</p>

Just add JavaScript.

Includes validation, integrity checking, caching, and a cross-framework hook.

- 🤙 [addScript()](#addScript) - Core function, callback based
- 🙏 [loadScript()](#loadscript) - Promise based
- 🪝 [makeHook()](#makehook) - Create a React/Preact/Mithril/SolidJS hook
- 📀 [Install / Use](#install--use)
- 🤨 [But why?](#but-why)

### `addScript()`

```js
import { addScript } from "add-javascript";

addScript("https://www.example.com/script.js", options);
// "added" | "already-added" | "already-added (unmanaged)" | "skipped"
//
//    "unmanaged" - means the script was not added by `add-javascript`
//
//    "skipped"   - means `skipLoading()` returned true. Callbacks will
//                  still have run, so this does not imply a no-op.
//
```

`options` (defaults shown, see [index.d.ts](./index.d.ts) for all):

```js
// options:
{
  isModule: false,
  loadBehavior: "async",
  fetchPriority: "auto",
  noopIfModulesSupported: false,
  ignoreQueryString: true,
  security: {
    crossOrigin: "",
    nonce: "",
    integrity: "",
    referrerPolicy: ""
  },
  dataSet: {},
  skipLoading: () => false,
  onLoad: detail => {},
  onError: detail => {}
}
```

```ts
// detail:
{
  event: Event,
  removeScriptTag: () => void
}
```

### `loadScript()`

```js
import { loadScript } from "add-javascript";

loadScript("https://www.example.com/script.js", {
  // Same options as addScript(), but
  // without onLoad and onError since we
  // can use Promise callbacks instead
})
  .then(successDetail => {})
  .catch(failDetail => {});
```

```ts
// successDetail:
{
  type: "added" | "already-added" | "already-added (unmanaged)" | "skipped",
  event: Event,
  removeScriptTag: () => void
}

// failDetail:
{
  type: "error",
  event: Event,
  removeScriptTag: () => void
}
```

```js
// Multiple scripts
await Promise.all([
  loadScript("https://www.example.com/script-1.js", options),
  loadScript("https://www.example.com/script-2.js", options)
]);

// ...or if you have common options:
await Promise.all(
  [
    "https://www.example.com/script-1.js",
    "https://www.example.com/script-2.js"
  ].map(src => loadScript(src, options))
);
```

### `makeHook()`

#### `React` / `Preact`

```js
import { makeHook } from "add-javascript";
import { useState, useEffect } from "react";

// Make the Hook
const useScriptReact = makeHook({ useState, useEffect });

function ReactComponent(props) {
  // Use it
  const [state, detail] = useScriptReact("./my-script.js", options);
  // state == "pending" | "loading" | "loaded" | "error"
  // detail == successDetail | failDetail

  return <div>{state}</div>;
}
```

#### `Mithril`

```js
import { makeHook } from "add-javascript";
import { withHooks, useState, useEffect } from "mithril-hooks";

// Make the Hook
const useScriptMithril = makeHook({ useState, useEffect });

const MithrilComponent = withHooks(() => {
  // Use it
  const [state, detail] = useScriptMithril("./my-script.js", options);
  // state == "pending" | "loading" | "loaded" | "error"
  // detail == successDetail | failDetail

  return m("div", state);
});
```

#### `SolidJS`

```js
import { makeHook } from "add-javascript";
import { createSignal, createEffect } from "solid-js";

// Make the Hook
const useScriptSolidJS = makeHook({
  useState: createSignal,
  useEffect: createEffect
});

function SolidJSComponent() {
  // Use it
  const [state, detail] = useScriptSolidJS("./my-script.js", options);
  // state() == "pending" | "loading" | "loaded" | "error"
  // detail() == successDetail | failDetail

  return html`${state()}`;
}
```

You can use all of these frameworks on the same page (if you like.) Check out [the tests](./tests/www/index.html) for a working implementation of this.

Create `useScript` in its own file for your convenience:

```js
// useScript.js
import { makeHook } from "add-javascript";
import { useState, useEffect } from "react";

export const useScript = makeHook({ useState, useEffect });
```

```js
// ReactComponent.js
import { useScript } from "./useScript";

function ReactComponent(props) {
  const [state] = useScript("./my-script.js");
  return <div>{state}</div>;
}
```

## Install / Use

```
$ pnpm i add-javascript
```

Supports `import`/`require` for ESM/CJS.

Browser/UMD version here:

```html
<script src="https://unpkg.com/add-javascript/dist/browser/add-javascript.browser.js"></script>
<script>
  const { loadScript } = addJs;
</script>
```

## But why?

> "There are loooads of loadScript/useScript libraries. Why make another one?"

Good question. Perhaps I didn't really need my own library, but I once found myself battling a bug caused by Hot Module Reloading vs. a 3rd-party script and I just ended up writing one to solve the problem. This is the result.

As for the bug, the size of the codebase I was working on at the time make the problem difficult to debug. Long story short, the 3rd-party script was being loaded multiple times and was also not [idempotent](https://www.google.com/search?q=idempotent).

There was also a chance it could be loaded in a vanilla way or via a Hook, hence the desire to offer an API that would consolidate the script-adding logic. This also explains the options default of `ignoreQueryString: true`, which considers a script loaded regardless of its (in my case: cache-busting) query-string parameters.

The `options` format is also something of an itch I wanted to scratch.

All that is behind me now, but perhaps someone else will find the outcome of these efforts useful.

Still, if your codebase is under your full control you're likely far better just rolling your own little helper than installing `add-javascript`:

```js
const loadScript = (src, options = { async: true }) =>
  new Promise((resolve, reject) => {
    const script = document.createElement("script");
    Object.assign(script, options);
    script.onload = resolve;
    script.onerror = reject;
    script.src = src;
    document.body.appendChild(script);
  });
```

# Credits

`add-javascript` was written by [Conan Theobald](https://github.com/shuckster/).

I hope you found it useful! If so, I like [coffee ☕️](https://www.buymeacoffee.com/shuckster) :)

## License

MIT licensed: See [LICENSE](LICENSE)
