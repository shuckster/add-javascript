const fs = require("fs");
const path = require("path");
const Koa = require("koa");
const serve = require("koa-static");
const mount = require("koa-mount");

const puppeteer = require("puppeteer");
const assert = require("assert");
const { viddyIn } = require("viddy/puppeteer");

const headless = "new";
const devtools = true;
const SERVER_PORT = 4765;

/**
 * Make a deferred promise.
 * @example
 * const [promise, resolve, reject] = makePromise();
 *
 * @template T
 * @returns {[Promise<T>, (...args: any[]) => T, Function]}
 */

function makePromise() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return [promise, resolve, reject];
}

async function main() {
  // Server
  const app = new Koa()
    .use(mount("/", serve(path.join(__dirname, "/www"))))
    .use(mount("/src", serve(path.join(__dirname, "/../src"))))
    .use(async (ctx, next) => {
      if (ctx.path === "/add-javascript") {
        const filePath = path.join(__dirname, "../index.mjs");
        ctx.type = "application/javascript";
        ctx.body = fs.createReadStream(filePath);
      } else {
        await next();
      }
    });

  const server = app.listen(SERVER_PORT);

  // Browser
  const browser = await puppeteer.launch({ headless, devtools });
  process.on("unhandledRejection", (reason) => {
    console.log("Unhandled rejection, reason:", reason);
    browser.close();
    server.close();
    process.exit(1);
  });

  // Comms.
  const page = await browser.newPage();
  await page.setViewport({ width: 600, height: 1024 }); 
  const [inBrowserTestRun, resolve, reject] = makePromise();
  await page.exposeFunction("signalTestRunFinished", resolve);
  const timeoutId = setTimeout(
    reject,
    15 * 1000,
    "Timed out! CDNs took a while to load?",
  );

  // Tests
  await page.goto(`http://localhost:${SERVER_PORT}/index.html`);
  const viddy = await viddyIn(page);

  function assertContentExists(text, selector) {
    return viddy.when(text, { selector }).then(({ exists }) => {
      const result = exists((sel) => `found: ${sel}`)
        .absent(() => "sorry, not found")
        .valueOf();

      assert.equal(result, `found: ${selector}`);
    });
  }

  function assertContentAbsent(text, selector) {
    return viddy.when(text, { selector }).then(({ exists }) => {
      const result = exists((sel) => `found: ${sel}`)
        .absent(() => "sorry, not found")
        .valueOf();

      assert.equal(result, "sorry, not found");
    });
  }

  // Tests
  await inBrowserTestRun;
  clearTimeout(timeoutId);

  //
  // Inline script
  //
  await assertContentAbsent("multiple-scripts", "#script-classic-inline");
  await assertContentExists("loaded", "#script-classic-inline");

  //
  // Inline module script
  //
  await assertContentAbsent("multiple-scripts", "#script-module-inline");
  await assertContentExists("loaded", "#script-module-inline");

  //
  // Standard script
  //
  await assertContentAbsent("multiple-scripts", "#script-classic");
  await assertContentExists("loaded", "#script-classic");

  //
  // Deferred standard script
  //
  await assertContentExists("loaded", "#script-classic-defer");

  //
  // Module script
  //
  await assertContentAbsent("multiple-scripts", "#script-module");
  await assertContentExists("loaded", "#script-module");

  //
  // 404 script not found
  //
  await assertContentAbsent("loaded", "#script-404");
  await assertContentExists("failed-ok", "#script-404");

  //
  // Skipped scripts
  //
  await assertContentExists("skipped", "#script-classic-skipped");
  await assertContentAbsent("loaded", "#script-classic-skipped");

  await assertContentExists("skipped", "#script-skip-if-module-support");
  await assertContentAbsent("loaded", "#script-skip-if-module-support");

  //
  // Duplicate script 
  //
  await assertContentExists("multiple-codes", "#script-classic-with-duplicate");
  await assertContentExists("loaded", "#script-classic-with-duplicate");

  //
  // React + Mithril + SolidJS Hooks
  //
  await assertContentExists("loaded", "#react-root");
  await assertContentExists("loaded", "#mithril-root");
  await assertContentExists("loaded", "#solidjs-root");

  //
  // Callbacks
  //
  await assertContentExists("14", "#callback-count");

  // ...

  await browser.close();
  server.close();
}

main();
