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
declare module "src/Memoize" {
    /**
     * @template T
     * @typedef {(x: T) => T} TIdentity
     */
    /**
     * @typedef {object} TMemoizeOptions
     *
     * @property {TIdentity<unknown>} [getKey]
     *    Function that takes the arguments passed to the memoized function
     *    and returns a string key to be used for memoization.
     *
     *    Defaults to the identity function, which is just taking the first
     *    argument and returning it.
     *
     */
    /**
     * Memoize a function.
     *
     * Offers a means of invalidating the cache, and the key used for
     * memoization can be customised with `getKey`.
     *
     * @example
     * const memoized = Memoize(
     *   (key, invalidate) => {
     *     setTimeout(invalidate, 1000 * 30)
     *     return dbLookup(key);
     *   },
     *   { getKey: ({ src }) => src }
     * );
     *
     * @template I, O
     *
     * @param {(input: I, invalidator: () => void) => O} fn
     *    The function to memoize.
     *
     * @param {TMemoizeOptions} options
     *    Options.
     *
     * @returns {(input: I) => O}
     *
     */
    export function Memoize<I, O>(fn: (input: I, invalidator: () => void) => O, { getKey }: TMemoizeOptions): (input: I) => O;
    export type TIdentity<T> = (x: T) => T;
    export type TMemoizeOptions = {
        /**
         * Function that takes the arguments passed to the memoized function
         * and returns a string key to be used for memoization.
         *
         * Defaults to the identity function, which is just taking the first
         * argument and returning it.
         */
        getKey?: TIdentity<unknown>;
    };
}
declare module "src/validation" {
    /**
     * Validation against a list of variations.
     *
     * @template T
     * @param {string} name
     * @param {T} value
     * @param {T[]} variations
     * @throws {Error}
     * @returns {void}
     */
    export function validate<T>(name: string, value: T, variations: T[]): void;
    /**
     * String validation.
     *
     * @param {string} name
     * @param {unknown} value
     * @throws {Error}
     * @returns {void}
     */
    export function validateString(name: string, value: unknown): void;
    /**
     * Function validation.
     *
     * @param {string} name
     * @param {unknown} value
     * @throws {Error}
     * @returns {void}
     */
    export function validateFunction(name: string, value: unknown): void;
    /**
     * Plain object validation.
     *
     * @param {string} name
     * @param {unknown} value
     * @throws {Error}
     * @returns {void}
     */
    export function validatePojo(name: string, value: unknown): void;
    /**
     * Data-set object validation.
     *
     * @param {string} name
     * @param {unknown} value
     * @throws {Error}
     * @returns {void}
     */
    export function validateDataSet(name: string, value: unknown): void;
    /**
     * URL validation.
     *
     * @param {string} name
     * @param {unknown} value
     * @throws {Error}
     * @returns {void}
     */
    export function validateURL(name: string, value: unknown): void;
    /**
     * Check if absolute URL.
     *
     * @param {unknown} url
     * @returns {boolean}
     */
    export function isAbsoluteURL(url: unknown): boolean;
    export const BOOLEAN: boolean[];
}
declare module "src/core" {
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
    export function scriptAlreadyInDocument(src: string, options?: {
        ignoreQueryString?: boolean;
    }): boolean;
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
    export namespace ADD_SCRIPT_OUTCOME {
        const ADDED: string;
        const ALREADY_ADDED: string;
        const ALREADY_ADDED_UNMANAGED: string;
        const SKIPPED: string;
        const ERROR: string;
    }
}
declare module "src/load-script" {
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
}
declare module "src/make-hook" {
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
}
declare module "index" {
    export { loadScript } from "./src/load-script.mjs";
    export { makeHook } from "./src/make-hook.mjs";
    export { addScript, ADD_SCRIPT_OUTCOME } from "./src/core.mjs";
}
