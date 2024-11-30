import { dirname } from "node:path";
import { after, before, describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { setupTestContext } from "../context.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("12-404", () => {
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

  it("404 script not found", async () => {
    const { assertContentExists, assertContentAbsent } = context;
    //
    // 404 script not found
    //
    await assertContentAbsent("loaded", "#script-404");
    await assertContentExists("failed-ok", "#script-404");

    //
    // Callback count
    //
    await assertContentExists("1", "#callback-count");
  });
});
