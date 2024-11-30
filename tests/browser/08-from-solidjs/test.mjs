import { dirname } from "node:path";
import { after, before, describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { setupTestContext } from "../context.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("08-from-solidjs", () => {
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

  it("loads a script using SolidJS", async () => {
    const { assertContentExists } = context;
    //
    // SolidJS Hooks
    //
    await assertContentExists("loaded", "#solidjs-root");

    //
    // Callback count
    //
    await assertContentExists("1", "#callback-count");
  });
});
