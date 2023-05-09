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

export function Memoize(fn, { getKey = x => x }) {
  const cache = new Map();

  /** @type {(key: unknown) => () => void} */
  const Invalidator = key => () => {
    cache.delete(key);
  };

  return x => {
    const key = getKey(x);
    return cache.has(key)
      ? cache.get(key)
      : cache.set(key, fn(x, Invalidator(key))).get(key);
  };
}
