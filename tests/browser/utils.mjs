import Koa from "koa";
import mount from "koa-mount";
import serve from "koa-static";
import { deepEqual as assert, strictEqual } from "node:assert";
import fs from "node:fs";
import net from "node:net";
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

async function findAvailablePort(startPort) {
  const server = net.createServer();
  return new Promise((resolve) => {
    server.listen(startPort, () => {
      server.close();
      resolve(startPort);
    });

    server.on("error", () => {
      server.close();
      resolve(findAvailablePort(startPort + 1));
    });
  });
}

/**
 * @param {string} __dirname
 */
export async function httpServer(__dirname) {
  const staggeredStartup = Math.random() * 500;
  await delay(staggeredStartup);
  const availablePort = await findAvailablePort(SERVER_PORT);

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
  app.use(async (ctx, next) => {
    if (ctx.path === "/browser-utils") {
      const filePath = path.join(__dirname, "../browser-utils.mjs");
      ctx.type = "application/javascript";
      ctx.body = fs.createReadStream(filePath);
    } else {
      await next();
    }
  });

  const server = app.listen(availablePort);
  return { app, server, port: availablePort };
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
export async function openPage(page, port = SERVER_PORT) {
  const url = `http://localhost:${port}/index.html`;
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
