type TAddScriptOutcome = "added" | "already-added" | "already-added (unmanaged)" | "skipped";

type TAddScriptOptions = {
    /**
     * Whether the script is an ES module.
     */
    isModule?: boolean;
    /**
     * The loading behaviour of the script.
     * - "async": Loaded async, blocks current execution to evaluate.
     * - "defer": Loaded async, in-order, evaluated on idle.
     * - "blocking": Loaded sync, blocks current execution to evaluate.
     */
    loadBehavior?: "async" | "defer" | "blocking";
    /**
     * The fetch priority of the script.
     * - "high": High priority relative to other scripts.
     * - "low": Low priority relative to other scripts.
     * - "auto": Browser decides priority.
     */
    fetchPriority?: "high" | "low" | "auto";
    /**
     * Whether to skip loading of the script if ES modules are supported.
     */
    noopIfModulesSupported?: boolean;
    /**
     * Multiple requests to the same URL with different query-strings
     * will be treated as different scripts when this is set to `false`.
     */
    ignoreQueryString?: boolean;
    /**
     * Security options.
     */
    security?: {
        crossOrigin?: "anonymous" | "use-credentials";
        nonce?: string;
        integrity?: string;
        referrerPolicy?: "no-referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin" | "unsafe-url";
    };
    /**
     * Data attributes.
     */
    dataSet?: object;
    /**
     * A predicate to determine whether the script should be loaded.
     */
    skipLoading?: (src: string) => boolean;
};

type TAddScriptCallback = ({ event, removeScriptTag }: {
    event: Event;
    removeScriptTag: Function;
}) => void;

type TAddScriptCallbacks = {
    /**
     * A callback that is called when the script is loaded.
     */
    onLoad?: TAddScriptCallback;
    /**
     * A callback that is called when the script fails to load.
     */
    onError?: TAddScriptCallback;
};

type TUseScriptOptions = {
    /**
     * Whether the script should be loaded.
     */
    enabled?: boolean;
};

type TLoadScriptResult = {
    /**
     *    The type of outcome.
     */
    type: TAddScriptOutcome | "error";
    /**
     * The event that was fired when the script was loaded.
     */
    event?: Event;
    /**
     * A function that removes the script tag from the DOM. Available if
     * the script was successfully added to the DOM in the first place.
     */
    removeScriptTag?: Function;
};

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
export function addScript(src: string, options?: TAddScriptOptions & TAddScriptCallbacks): TAddScriptOutcome;

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
export function loadScript(src: string, options?: TAddScriptOptions): Promise<TLoadScriptResult>;

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
export function makeHook({ useState, useEffect }: {
    useState: Function;
    useEffect: Function;
}): (src: string, options?: TUseScriptOptions & TAddScriptOptions) => ["pending" | "loading" | "loaded" | "error", TLoadScriptResult];
