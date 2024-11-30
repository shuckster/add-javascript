import { dirname } from "node:path";
import { after, before, describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { setupTestContext } from "../context.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("05-classic", () => {
  /** @type {import("../context.mjs").TTextContext} */
  let context;

  before(async () => {
    context = await setupTestContext(__dirname);
    await context.inPageTestsDidRun;
  });

  after(async () => {
    context.browser.close();
    context.server.close();
  });

  it("asserts that a script can be inserted + not reinserted, but we get load-callbacks for both", async () => {
    const { assertContentExists, assertContentAbsent } = context;
    //
    // Standard script
    //
    await assertContentAbsent("multiple-scripts", "#script-classic");
    await assertContentExists("loaded", "#script-classic");

    //
    // Callback count
    //
    await assertContentExists("2", "#callback-count");
  });
});