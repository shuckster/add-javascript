import { dirname } from "node:path";
import { after, before, describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { setupTestContext } from "../context.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("09-module-inline", () => {
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

  it("loads an inline module script", async () => {
    const { assertContentExists, assertContentAbsent } = context;
    //
    // Inline module script
    //
    await assertContentAbsent("multiple-scripts", "#script-module-inline");
    await assertContentExists("loaded", "#script-module-inline");

    //
    // Callback count
    //
    await assertContentExists("0", "#callback-count");
  });
});
