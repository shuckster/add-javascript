import { dirname } from "node:path";
import { after, before, describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { setupTestContext } from "../context.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe.skip("06-from-mithril", () => {
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

  it("loads a script using Mithril", async () => {
    const { assertContentExists } = context;
    //
    // React + Mithril + SolidJS Hooks
    //
    await assertContentExists("loaded", "#mithril-root");

    //
    // Callback count
    //
    await assertContentExists("1", "#callback-count");
  });
});
