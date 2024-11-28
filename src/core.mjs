import "./_typedefs.js";

import { Memoize } from "./Memoize.mjs";
import {
  BOOLEAN,
  isAbsoluteURL,
  validate,
  validateDataSet,
  validateFunction,
  validatePojo,
  validateString,
  validateURL,
} from "./validation.mjs";

export const ADD_SCRIPT_OUTCOME = {
  ADDED: "added",
  ALREADY_ADDED: "already-added",
  ALREADY_ADDED_UNMANAGED: "already-added (unmanaged)",
  SKIPPED: "skipped",
  ERROR: "error",
};

const BEHAVIOURS = ["async", "defer", "blocking"];
const PRIORITIES = ["", "high", "low", "auto"];
const ORIGINS = ["", "anonymous", "use-credentials"];
const POLICIES = [
  "",
  "no-referrer",
  "no-referrer-when-downgrade",
  "origin",
  "origin-when-cross-origin",
  "same-origin",
  "strict-origin",
  "strict-origin-when-cross-origin",
  "unsafe-url",
];

function noop() {
  return;
}

function getWindow() {
  return globalThis.window;
}

/**
 * Upsert entry into the cache.
 */

const upsertScriptCache = Memoize(
  /**
   * @param {object} options
   * @param {string} [options.src]
   * @param {boolean} [options.ignoreQueryString]
   * @param {number} [options.ttlInSeconds]
   * @param {() => void} invalidate
   */
  ({ ttlInSeconds = Infinity }, invalidate) => {
    if (ttlInSeconds !== Infinity) {
      setTimeout(invalidate, ttlInSeconds * 1000);
    }
    return { invalidate };
  },
  {
    getKey: ({ src, ignoreQueryString = true }) => {
      if (!ignoreQueryString) {
        return src;
      }
      const [path] = src.split("?");
      return path;
    },
  },
);

/**
 * Detect if a script is already in the document.
 *
 * By default will not consider the query string, which is often used
 * to bust caches. This can be changed by passing an options object
 * with `ignoreQueryString` set to `false`.
 *
 * @example
 * scriptAlreadyInDocument("./script.js?bust-cache=1");
 *
 * scriptAlreadyInDocument("./script.js?bust-cache=2", {
 *   ignoreQueryString: false,
 * });
 *
 * @param {string} src
 * @param {object} [options]
 * @param {boolean} [options.ignoreQueryString] Defaults to `true`.
 * @returns {boolean}
 */

export function scriptAlreadyInDocument(src, options) {
  const { ignoreQueryString = true } = options || {};
  const absoluteSrc = isAbsoluteURL(src) ? src : new URL(src, getWindow().location.href).href;
  const isScriptInDoc = !!plainScriptTagsWithSrcSet().find((scriptEl) => {
    const existingSrc = scriptEl.src || "";
    if (!ignoreQueryString) {
      return existingSrc === absoluteSrc;
    }
    const [path] = existingSrc.split("?");
    return path === absoluteSrc;
  });
  return isScriptInDoc;
}

function plainScriptTagsWithSrcSet() {
  const els = getWindow().document.getElementsByTagName("script");
  return (
    Array.from(els)
      .filter((el) => el.type !== 'importmap') // ignore importmaps
      .filter((el) => el.src)
  );
}

/**
 * Add a script to the document.
 *
 * @param {string} src
 *    The URL of the script to load.
 *
 * @param {TAddScriptOptions & TAddScriptCallbacks} [options]
 *    Options.
 *
 * @throws {Error}
 *    When an invalid value is passed.
 *
 * @returns {TAddScriptOutcome}
 */

export function addScript(src, options) {
  validateString("src", src);
  validateURL("src", src);

  const { skipLoading = noop } = options || {};
  validateFunction("skipLoading", skipLoading);
  if (skipLoading !== noop && skipLoading(src)) {
    return /** @type {TAddScriptOutcome} */ (ADD_SCRIPT_OUTCOME.SKIPPED);
  }

  const {
    isModule = false,
    loadBehavior = "async",
    fetchPriority = "",
    noopIfModulesSupported = false,
    ignoreQueryString = true,
    security = {},
    dataSet = {},
  } = options || {};

  validate("isModule", isModule, BOOLEAN);
  validate("loadBehavior", loadBehavior, BEHAVIOURS);
  validate("fetchPriority", fetchPriority, PRIORITIES);
  validate("noopIfModulesSupported", noopIfModulesSupported, BOOLEAN);
  validate("ignoreQueryString", ignoreQueryString, BOOLEAN);
  validatePojo("security", security);
  validateDataSet("dataSet", dataSet);

  const { onLoad = noop, onError = noop } = options || {};

  validateFunction("onLoad", onLoad);
  validateFunction("onError", onError);

  const scriptMeta = upsertScriptCache({ src, ignoreQueryString });
  if (scriptMeta.promise instanceof Promise) {
    scriptMeta.promise.then(onLoad, onError);
    return scriptMeta.scriptElement
      ? /** @type {TAddScriptOutcome} */ (ADD_SCRIPT_OUTCOME.ALREADY_ADDED)
      : /** @type {TAddScriptOutcome} */ (
          ADD_SCRIPT_OUTCOME.ALREADY_ADDED_UNMANAGED
        );
  }

  // Unmanaged script, just fire onload and return
  if (scriptAlreadyInDocument(src, { ignoreQueryString })) {
    scriptMeta.promise = Promise.resolve();
    scriptMeta.promise.then(onLoad, onError);

    return /** @type {TAddScriptOutcome} */ (
      ADD_SCRIPT_OUTCOME.ALREADY_ADDED_UNMANAGED
    );
  }

  const {
    crossOrigin = "",
    nonce = "",
    integrity = "",
    referrerPolicy = "",
  } = security || {};

  validate("crossOrigin", crossOrigin, ORIGINS);
  validateString("nonce", nonce);
  validateString("integrity", integrity);
  validate("referrerPolicy", referrerPolicy, POLICIES);

  let crossorigin;
  if (integrity) {
    if (!["", "anonymous"].includes(crossOrigin)) {
      throw new Error(`When 'integrity' is specified, 'crossOrigin' must be "anonymous".
It is currently set to "${crossOrigin}".

You can also remove the 'crossOrigin' option; it will be set to
"anonymous" automatically if 'integrity' is specified.`);
    }
    crossorigin = "anonymous";
  } else {
    crossorigin = crossOrigin;

    if (isAbsoluteURL(src) && src.indexOf(getWindow().location.origin) !== 0) {
      console.warn(
        `The script "${src}" is being loaded from a different origin
to the current page. It is recommended that you use the
'integrity' option to ensure the script has not been
tampered with.`,
      );
    }
  }

  //
  // Now we can try and add the script to the document
  //

  const scriptProps = {
    // Behaviour
    ...(isModule ? { type: "module" } : {}),
    ...(noopIfModulesSupported ? { noModule: true } : {}),
    ...(loadBehavior === "async" ? { async: true } : {}),
    ...(loadBehavior === "defer" ? { defer: true } : {}),
    ...(fetchPriority && PRIORITIES.includes(fetchPriority)
      ? { fetchPriority }
      : {}),

    // Security
    ...(nonce ? { nonce } : {}),
    ...(integrity ? { integrity } : {}),
    ...(crossorigin ? { crossOrigin: crossorigin } : {}),
    ...(referrerPolicy && POLICIES.includes(referrerPolicy)
      ? { referrerPolicy }
      : {}),

    // Data-set
    ...(Object.keys(dataSet).length ? { dataset: dataSet } : {}),

    // order is important; apply src last of all
    src,
  };

  const el = getWindow().document.createElement("script");

  scriptMeta.src = src;
  scriptMeta.scriptElement = el;
  scriptMeta.promise = new Promise((resolve, reject) => {
    function removeScriptTag() {
      scriptMeta.invalidate?.();
      el.parentNode.removeChild(el);
    }

    el.addEventListener("load", (event) => {
      el.removeEventListener("load", resolve);
      resolve({ event, removeScriptTag });
    });

    el.addEventListener("error", (event) => {
      // Permit retries in consumer
      removeScriptTag();
      el.removeEventListener("error", reject);
      reject({ event, removeScriptTag });
    });
  });
  scriptMeta.promise.then(onLoad, onError);

  Object.assign(el, scriptProps);

  if (loadBehavior === "defer") {
    getWindow().document.head.appendChild(el);
  } else {
    getWindow().document.body.appendChild(el);
  }

  return /** @type {TAddScriptOutcome} */ (ADD_SCRIPT_OUTCOME.ADDED);
}
