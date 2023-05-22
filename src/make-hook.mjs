import "./_typedefs.js";

import { loadScript } from "./load-script.mjs";

/**
 * Create a `useScript` Hook using dependency injection. Compatible with
 * React, Preact, Mithril, and SolidJS.
 *
 * @example
 * // React-like API:
 * import { useState, useEffect } from "react";
 * const useScript = makeHook({ useState, useEffect });
 *
 * // SolidJS API:
 * import { createSignal, onMount } from "solid-js";
 * const useScript = makeHook({
 *   useState: createSignal,
 *   useEffect: createEffect
 * });
 *
 * function YourComponent() {
 *   const [state, detail] = useScript("...", options);
 *   // ...
 * }
 *
 * @param {object} dependencies
 *		Dependencies.
 *
 * @param {function} dependencies.useState
 *		A `useState` Hook from your preferred framework.
 *
 * @param {function} dependencies.useEffect
 *		A `useEffect` Hook from your preferred framework.
 *
 */

export function makeHook({ useState, useEffect }) {
  /**
   * Add a script to the document via a React Hook.
   *
   * @param {string} src The URL of the script to load.
   * @param {TUseScriptOptions & TAddScriptOptions} [options] Options.
   * @returns {["pending" | "loading" | "loaded" | "error", TLoadScriptResult]}
   */

  function useScript(src, options) {
    const [state, setState] = useState("pending");
    const [detail, setDetail] = useState();

    useEffect(() => {
      setState("loading");
      loadScript(src, options)
        .then((result) => {
          setState("loaded");
          setDetail(result);
        })
        .catch((error) => {
          setState("error");
          setDetail(error);
        });
    }, [src]);

    return [state, detail];
  }

  return useScript;
}
