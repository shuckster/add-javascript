import { dirname } from "node:path";
import { after, before, describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { setupTestContext } from "../context.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("10-module", () => {
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

  it("loads a module script that loads another module", async () => {
    const { assertContentExists, assertContentAbsent } = context;
    //
    // Module script
    //
    await assertContentAbsent("multiple-scripts", "#script-module");
    await assertContentExists("loaded", "#script-module");

    //
    // Callback count
    //
    await assertContentExists("2", "#callback-count");
  });
});
