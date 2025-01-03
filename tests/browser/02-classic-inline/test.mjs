import { dirname } from "node:path";
import { after, before, describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { setupTestContext } from "../context.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("02-classic-inline", () => {
  /** @type {import("../context.mjs").TTextContext} */
  let context;

  before(async () => {
    context = await setupTestContext(__dirname);
    await context.inPageTestsDidRun;
    console.log('got here!');
  });

  after(async () => {
    context.browser.close();
    context.server.close();
  });

  it("finds the text added by an inline script", async () => {
    const { assertContentExists } = context;
    //
    // Inline standard script
    //
    await assertContentExists("loaded", "#script-classic-inline");

    //
    // Callback count
    //
    await assertContentExists("1", "#callback-count");
  });
});
