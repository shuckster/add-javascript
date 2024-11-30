import { delay, makePromise } from "./utils.js";

export { makePromise };

let callbackCount = 0;

function drawCallbackCount() {
  document.getElementById(
    "callback-count",
  ).innerHTML = `Callback count: ${callbackCount}`;
}

drawCallbackCount();

export function bumpCallbackCount() {
  callbackCount++;
  drawCallbackCount();
}

export function runTest(description, promise) {
  const [timeoutPromise, _, reject] = makePromise();
  setTimeout(reject, 10 * 1000, new Error("timeout"));
  return Promise.race([
    promise,
    timeoutPromise,
  ]).catch(err => {
    const { message } = err;
    console.log(description, ": Error:", message);
    throw err;
  });
}

//
// All tests
//

export const getScriptEls = url => () =>
  document.querySelectorAll(`script[src="${url}"]`);

export const assertSingleScriptTag = selector => scriptEls => {
  if (scriptEls.length === 1) {
    return;
  }
  const el = document.querySelector(selector);
  document.querySelector(selector).innerHTML = " <code>multiple-scripts</code>";
};

export const assertSingleCodeElement = selector => () => {
  const container = document.querySelector(selector);
  if (!container) {
    throw new Error("No container");
  }
  const els = container.querySelectorAll("code");
  if (els.length === 1) {
    return;
  }
  document.querySelector(selector).innerHTML += " <code>multiple-codes</code>";
};
