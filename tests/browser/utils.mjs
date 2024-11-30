import Koa from "koa";
import mount from "koa-mount";
import serve from "koa-static";
import { deepEqual as assert, strictEqual } from "node:assert";
import fs from "node:fs";
import path from "node:path";
import puppeteer, { Page } from "puppeteer";
import { viddyIn } from "viddy/puppeteer";

const headless = "new";
const devtools = true;
const SERVER_PORT = 3100;

/**
 * Make a deferred promise.
 * @example
 * const [promise, resolve, reject] = makePromise();
 *
 * @template T
 * @returns {[Promise<T>, (...args: any[]) => T, Function]}
 */
export function makePromise() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return [promise, resolve, reject];
}

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function delay(ms) {
  return new Promise(o => setTimeout(o, ms));
}

/**
 * @param {string} __dirname
 */
export function httpServer(__dirname) {
  const app = new Koa();

  app.use(mount("/", serve(path.join(__dirname))));
  app.use(mount("/src", serve(path.join(__dirname, "../../../src"))));
  app.use(async (ctx, next) => {
    if (ctx.path === "/add-javascript") {
      const filePath = path.join(__dirname, "../../../index.mjs");
      ctx.type = "application/javascript";
      ctx.body = fs.createReadStream(filePath);
    } else {
      await next();
    }
  });

  const server = app.listen(SERVER_PORT);
  return { app, server };
}

export async function launchBrowser() {
  const browser = await puppeteer.launch({ headless, devtools });
  const page = await browser.newPage();
  await page.setViewport({ width: 600, height: 1024 });

  // Expose test-resolving promise
  const [inPageTestsDidRun, resolve, reject] = makePromise();
  await page.exposeFunction("signalTestRunFinished", resolve);

  // Timeout
  const timeoutMessage = "Timed out! CDNs took a while to load?";
  const timeoutId = setTimeout(reject, 15 * 1000, timeoutMessage);
  inPageTestsDidRun.finally(() => clearTimeout(timeoutId));

  return { browser, page, inPageTestsDidRun };
}

/**
 * @param {Page} page
 */
export async function openPage(page) {
  const url = `http://localhost:${SERVER_PORT}/index.html`;
  console.log("url", url);
  await page.goto(url);
  const viddy = await viddyIn(page);

  function assertContentExists(text, selector) {
    return viddy.when(text, { selector }).then(({ exists }) => {
      const result = exists(sel => `found: ${sel}`)
        .absent(() => "sorry, not found")
        .valueOf();

      assert(result, `found: ${selector}`);
    });
  }

  function assertContentAbsent(text, selector) {
    return viddy.when(text, { selector }).then(({ exists }) => {
      const result = exists(sel => `found: ${sel}`)
        .absent(() => "sorry, not found")
        .valueOf();

      assert(result, "sorry, not found");
    });
  }

  return { assertContentExists, assertContentAbsent };
}
