// @ts-nocheck
// ^ - prevents duplicate warnings after generation of index.d.ts

/**
 * @typedef {"added" | "already-added" | "already-added (unmanaged)" | "skipped"} TAddScriptOutcome
 */

/**
 * @typedef {object} TAddScriptOptions
 *
 * @property {boolean} [isModule = false]
 *    Whether the script is an ES module.
 *
 * @property {"async" | "defer" | "blocking"} [loadBehavior = "async"]
 *    The loading behaviour of the script.
 *    - "async": Loaded async, blocks current execution to evaluate.
 *    - "defer": Loaded async, in-order, evaluated on idle.
 *    - "blocking": Loaded sync, blocks current execution to evaluate.
 *
 * @property {"high" | "low" | "auto"} [fetchPriority = "auto"]
 *    The fetch priority of the script.
 *    - "high": High priority relative to other scripts.
 *    - "low": Low priority relative to other scripts.
 *    - "auto": Browser decides priority.
 *
 * @property {boolean} [noopIfModulesSupported = false]
 *    Whether to skip loading of the script if ES modules are supported.
 *
 * @property {boolean} [ignoreQueryString = true]
 *    Multiple requests to the same URL with different query-strings
 *    will be treated as different scripts when this is set to `false`.
 *
 * @property {object} [security]
 *    Security options.
 *
 * @property {"anonymous" | "use-credentials"} [security.crossOrigin]
 *    The cross-origin setting of the script.
 *
 * @property {string} [security.nonce]
 *    The nonce of the script.
 *
 * @property {string} [security.integrity]
 *    The [integrity-hash](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) of the script.
 *
 * @property {"no-referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin" | "unsafe-url"} [security.referrerPolicy]
 *    The referrer-policy of the script.
 *
 * @property {object} [dataSet]
 *    Data attributes.
 *
 * @property {(src: string) => boolean} [skipLoading]
 *    A predicate to determine whether the script should be loaded.
 *
 */

/**
 * @typedef {({ event, removeScriptTag }: { event: Event, removeScriptTag: function }) => void} TAddScriptCallback
 */

/**
 * @typedef {object} TAddScriptCallbacks
 *
 * @property {TAddScriptCallback} [onLoad]
 *    A callback that is called when the script is loaded.
 *
 * @property {TAddScriptCallback} [onError]
 *    A callback that is called when the script fails to load.
 *
 */

/**
 * @typedef {object} TUseScriptOptions
 *
 * @property {boolean} [enabled]
 *    Whether the script should be loaded.
 *
 */

/**
 * @typedef {object} TLoadScriptResult
 *
 * @property {TAddScriptOutcome | "error"} type
 *    The type of outcome.
 *
 * @property {Event} [event]
 *    The event that was fired when the script was loaded.
 *
 * @property {function} [removeScriptTag]
 *    A function that removes the script tag from the DOM. Available if
 *    the script was successfully added to the DOM in the first place.
 */
