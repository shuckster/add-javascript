import { after, before, describe, it } from "node:test";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { httpServer, launchBrowser, openPage } from "../utils.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("02-classic-inline", () => {
  let server;
  let port;
  let browser;
  let page;
  let inPageTestsDidRun;
  let assertContentExists;
  let assertContentAbsent;

  before(async () => {
    const $server = await httpServer(__dirname);
    server = $server.server;
    port = $server.port;

    const $browser = await launchBrowser();
    browser = $browser.browser;
    page = $browser.page;
    process.on("unhandledRejection", reason => {
      console.log("Unhandled rejection, reason:", reason);
      browser.close();
      server.close();
      process.exit(1);
    });

    const $page = await openPage(page, port);
    assertContentExists = $page.assertContentExists;
    assertContentAbsent = $page.assertContentAbsent;
    await inPageTestsDidRun;
  });

  after(async () => {
    browser.close();
    server.close();
  });

  it("finds the text added by an inline script", async () => {
    //
    // Inline standard script
    //
    await assertContentExists("loaded", "#script-classic-inline");
  });
});
