import "./_typedefs.js";

import { addScript } from "./core.mjs";

/**
 * Add a script to the document returning a Promise.
 *
 * @example
 * // One script
 * await loadScript("https://www.example.com/script.js", {
 *   loadBehavior: "async"
 * })
 *
 * // Multiple scripts
 * await Promise.all(
 *   [
 *     "https://www.example.com/script-1.js",
 *     "https://www.example.com/script-2.js",
 *   ].map(src => loadScript(src))
 * )
 *
 * @param {string} src
 * 		The URL of the script to load.
 *
 * @param {TAddScriptOptions} [options]
 * 		Options.
 *
 * @returns {Promise<TLoadScriptResult>}
 */

export function loadScript(src, options) {
  return new Promise((resolve, reject) => {
    const result = addScript(src, {
      ...options,
      onLoad: (detail) => resolve({ type: "added", ...detail }),
      onError: (detail) => reject({ type: "error", ...detail }),
    });
    if (result !== "added") {
      resolve({ type: result });
    }
  });
}
