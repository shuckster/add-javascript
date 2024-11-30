import { dirname } from "node:path";
import { after, before, describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { setupTestContext } from "../context.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("11-skip-if-module-support", () => {
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

  it("skips loading a module if the browser supports it", async () => {
    const { assertContentExists, assertContentAbsent } = context;
    //
    // Skipped scripts
    //
    await assertContentExists("skipped", "#script-skip-if-module-support");
    await assertContentAbsent("loaded", "#script-skip-if-module-support");

    //
    // Callback count
    //
    await assertContentExists("1", "#callback-count");
  });
});
