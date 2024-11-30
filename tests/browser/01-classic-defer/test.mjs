import { after, before, describe, it } from "node:test";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { httpServer, launchBrowser, openPage } from "../utils.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("01-classic-defer", () => {
  let server;
  let browser;
  let page;
  let inPageTestsDidRun;
  let assertContentExists;
  let assertContentAbsent;

  before(async () => {
    const $server = httpServer(__dirname);
    server = $server.server;
    const $browser = await launchBrowser();
    browser = $browser.browser;
    page = $browser.page;
    process.on("unhandledRejection", reason => {
      console.log("Unhandled rejection, reason:", reason);
      browser.close();
      server.close();
      process.exit(1);
    });
    const $page = await openPage(page);
    assertContentExists = $page.assertContentExists;
    assertContentAbsent = $page.assertContentAbsent;
    await inPageTestsDidRun;
  });

  after(async () => {
    browser.close();
    server.close();
  });

  it("finds the text added by a deferred script", async () => {
    //
    // Deferred standard script
    //
    await assertContentExists("loaded", "#script-classic-defer");
  });
});
