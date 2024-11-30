import { dirname } from "node:path";
import { after, before, describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { setupTestContext } from "../context.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("04-classic-with-duplicate", () => {
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

  it("asserts that scripts can be removed and reinserted", async () => {
    const { assertContentExists } = context;
    //
    // Duplicate script 
    //
    await assertContentExists("multiple-codes", "#script-classic-with-duplicate");
    await assertContentExists("loaded", "#script-classic-with-duplicate");

    //
    // Callback count
    //
    await assertContentExists("2", "#callback-count");
  });
});
