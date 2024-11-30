import { dirname } from "node:path";
import { after, before, describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { setupTestContext } from "../context.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("03-classic-skipped", () => {
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

  it("asserts that script-loading has been skipped", async () => {
    const { assertContentExists, assertContentAbsent } = context;
    //
    // Skipped script
    //
    await assertContentExists("skipped", "#script-classic-skipped");
    await assertContentAbsent("loaded", "#script-classic-skipped");

    //
    // Callback count
    //
    await assertContentExists("0", "#callback-count");
  });
});
