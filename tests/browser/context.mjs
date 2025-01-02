import { Browser, Page } from "puppeteer";
import { httpServer, launchBrowser, openPage } from "./utils.mjs";

/**
 * @typedef {object} TTextContext
 * @property {*} server
 * @property {number} port
 * @property {Browser} browser
 * @property {Page} page
 * @property {Promise<void>} inPageTestsDidRun
 * @property {Function} assertContentExists
 * @property {Function} assertContentAbsent
 */

/**
 * @param {string} __dirname
 * @returns {Promise<TTextContext>}
 */
export async function setupTestContext(__dirname, depth = 3) {
  const $server = await httpServer(__dirname, depth);
  const $browser = await launchBrowser();
  const $page = await openPage($browser.page, $server.port);

  process.on("unhandledRejection", reason => {
    console.log("Unhandled rejection, reason:", reason);
    $browser.browser.close();
    $server.server.close();
    process.exit(1);
  });

  return {
    ...$server,
    ...$browser,
    ...$page,
  };
}
