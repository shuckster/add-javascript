/**
 * Hook usage:
 *   const useScript = makeHook({ useState, useEffect })
 *   const [state, detailOrError] = useScript(url)
 *
 * Promise usage
 *   const scriptPromise = loadScript(url)
 *   scriptPromise
 *     .then(detail => {...})
 *     .catch(error => {...})
 *
 * All methods share the same cache logic. Care is taken to ensure
 * script-elements are not duplicated in the DOM, which may happen
 * while debugging with hot-module-reloading.
 */

import "./src/_typedefs.js";

export { loadScript } from "./src/load-script.mjs";
export { makeHook } from "./src/make-hook.mjs";
export { addScript, ADD_SCRIPT_OUTCOME } from "./src/core.mjs";
