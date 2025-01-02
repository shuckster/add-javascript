import { dirname } from "node:path";
import { after, before, describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { setupTestContext } from "../../context.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("show/hide/show", () => {
  /** @type {import("../../context.mjs").TTextContext} */
  let context;

  before(async () => {
    context = await setupTestContext(__dirname, 4);
    await context.inPageTestsDidRun;
  });

  after(async () => {
    context.browser.close();
    context.server.close();
  });

  it("shows/hides/shows a Component with a script, loading it once, but firing its API twice", async () => {
    const { assertContentExists } = context;
    //
    // React Hooks
    //
    await assertContentExists("loaded via renderLoaded", "#react-root");

    //
    // Callback count
    //
    await assertContentExists("11", "#callback-count");
  });
});
