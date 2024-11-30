import { dirname } from "node:path";
import { after, before, describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { setupTestContext } from "../context.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("01-classic-defer", () => {
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

  it("finds the text added by a deferred script", async () => {
    const { assertContentExists } = context;
    //
    // Deferred standard script
    //
    await assertContentExists("loaded", "#script-classic-defer");

    //
    // Callback count
    //
    await assertContentExists("1", "#callback-count");
  });
});
