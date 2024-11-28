export const BOOLEAN = [true, false];

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
export function validate(name, value, variations) {
  if (variations.includes(value)) {
    return;
  }
  throw new Error(
    `Invalid value for '${name}'. Got: ${JSON.stringify(
      value,
    )}, expected one of: ${variations
      .map((x) => JSON.stringify(x))
      .join(", ")}.`,
  );
}

/**
 * String validation.
 *
 * @param {string} name
 * @param {unknown} value
 * @throws {Error}
 * @returns {asserts value is string}
 */
export function validateString(name, value) {
  if (typeof value === "string") {
    return;
  }
  throw new Error(
    `Invalid value for '${name}'. Got: ${JSON.stringify(
      value,
    )}, expected a string.`,
  );
}

/**
 * Function validation.
 *
 * @param {string} name
 * @param {unknown} value
 * @throws {Error}
 * @returns {asserts value is Function}
 */
export function validateFunction(name, value) {
  if (typeof value === "function") {
    return;
  }
  throw new Error(
    `Invalid value for '${name}'. Got: ${JSON.stringify(
      value,
    )}, expected a function.`,
  );
}

/**
 * Is plain object.
 *
 * @param {unknown} obj
 * @returns {boolean}
 */
function isPojo(obj) {
  if (obj === null || typeof obj !== "object") {
    return false;
  }
  return Object.getPrototypeOf(obj) === Object.prototype;
}

/**
 * Plain object validation.
 *
 * @param {string} name
 * @param {unknown} value
 * @throws {Error}
 * @returns {asserts value is object}
 */
export function validatePojo(name, value) {
  if (isPojo(value)) {
    return;
  }
  throw new Error(
    `Invalid value for '${name}'. Got: ${JSON.stringify(
      value,
    )}, expected a plain object.`,
  );
}

function stringIsCamelCase(str) {
  return /^[a-z][a-zA-Z0-9]*$/.test(str);
}

/**
 * Data-set object validation.
 *
 * @param {string} name
 * @param {unknown} value
 * @throws {Error}
 * @returns {asserts value is object}
 */
export function validateDataSet(name, value) {
  validatePojo(name, value);
  const keys = Object.keys(value);
  if (keys.length === 0) {
    return;
  }
  const allCamelCase = keys.every(stringIsCamelCase);
  if (!allCamelCase) {
    throw new Error(
      `Invalid value for '${name}'. Got: ${JSON.stringify(
        value,
      )}, expected a plain object with camelCase keys.`,
    );
  }
}

/**
 * URL validation.
 *
 * @param {string} name
 * @param {unknown} value
 * @throws {Error}
 * @returns {void}
 */

export function validateURL(name, value) {
  if (isAbsoluteURL(value) || isRelativeURL(value)) {
    return;
  }
  throw new Error(
    `Invalid value for '${name}'. Got: ${JSON.stringify(
      value,
    )}, expected a valid URL.`,
  );
}

const rxValidURLChars = /[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+/;

/**
 * Check if absolute URL.
 *
 * @param {unknown} url
 * @returns {boolean}
 */

export function isAbsoluteURL(url) {
  if (typeof url !== "string") {
    return false;
  }
  if (!rxValidURLChars.test(url)) {
    return false;
  }
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

function isRelativeURL(url) {
  if (typeof url !== "string") {
    return false;
  }
  if (!rxValidURLChars.test(url)) {
    return false;
  }
  try {
    new URL(url, "http://example.com");
    return true;
  } catch (error) {
    return false;
  }
}
