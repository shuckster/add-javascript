// @ts-nocheck

import { describe, it } from "node:test";
import { deepEqual as assert, strictEqual } from "node:assert";
import { addScript } from "../index.mjs";

function assertThrow(fn) {
  let threw = "did not throw";
  try {
    fn();
  } catch (err) {
    threw = "threw";
  }
  assert(threw, "threw", "Expected to throw, but did not");
}

function assertDidNotThrow(fn) {
  let msg = "Did not throw";
  let threw = "did not throw";
  try {
    fn();
  } catch (err) {
    threw = "threw";
    msg = err.message;
  }
  assert(threw, "did not throw", `Expected to NOT throw, but did: ${msg}`);
}

function mockCreateScript() {
  globalThis.window = {
    location: {
      href: "https://example.org",
      origin: "https://example.org",
    },
    document: {
      createElement: () => ({}),
      addEventListener: () => {},
      getElementsByTagName: () => [],
      head: {
        appendChild: () => {},
      },
      body: {
        appendChild: () => {},
      },
    },
  };
}

const src = "https://example.com/absolute";

let srcCount = 0;
function dynamicSrc(url) {
  return `${url || src}/${srcCount++}.js`;
}

mockCreateScript();

describe("addScript", () => {
  it("throws when no src set", () => {
    assertThrow(() => addScript());
  });

  it("throws when invalid URL", () => {
    assertThrow(() => addScript("><"));
  });

  it("throws when skipLoading not a function", () => {
    assertThrow(() =>
      addScript(dynamicSrc(), {
        skipLoading: "not a function",
      }),
    );
  });

  it("throws when isModule not boolean", () => {
    assertThrow(() =>
      addScript(dynamicSrc(), {
        isModule: "not a boolean",
      }),
    );
  });

  it("throws when loadBehavior not a string", () => {
    assertThrow(() =>
      addScript(dynamicSrc(), {
        loadBehavior: 123,
      }),
    );
  });

  it("throws when fetchPriority not a string", () => {
    assertThrow(() =>
      addScript(dynamicSrc(), {
        fetchPriority: 123,
      }),
    );
  });

  it("throws when noopIfModulesSupported not a boolean", () => {
    assertThrow(() =>
      addScript(dynamicSrc(), {
        noopIfModulesSupported: "not a boolean",
      }),
    );
  });

  it("throws when ignoreQueryString not a boolean", () => {
    assertThrow(() =>
      addScript(dynamicSrc(), {
        ignoreQueryString: "not a boolean",
      }),
    );
  });

  it("throws when security not an object", () => {
    assertThrow(() =>
      addScript(dynamicSrc(), {
        security: "not an object",
      }),
    );
  });

  it("throws when onLoad not a function", () => {
    assertThrow(() =>
      addScript(dynamicSrc(), {
        onLoad: "not a function",
      }),
    );
  });

  it("throws when onError not a function", () => {
    assertThrow(() =>
      addScript(dynamicSrc(), {
        onError: "not a function",
      }),
    );
  });

  // Security

  it("throws when security.crossOrigin not a string", () => {
    assertThrow(() =>
      addScript(dynamicSrc(), {
        security: {
          crossOrigin: 123,
        },
      }),
    );
  });

  it("throws when security.nonce not a string", () => {
    assertThrow(() =>
      addScript(dynamicSrc(), {
        security: {
          nonce: 123,
        },
      }),
    );
  });

  it("throws when security.integrity not a string", () => {
    assertThrow(() =>
      addScript(dynamicSrc(), {
        security: {
          integrity: 123,
        },
      }),
    );
  });

  it("throws when security.referrerPolicy not a string", () => {
    assertThrow(() =>
      addScript(dynamicSrc(), {
        security: {
          referrerPolicy: 123,
        },
      }),
    );
  });

  it("no throw with security.crossOrigin empty + integrity", () => {
    assertDidNotThrow(() =>
      addScript(dynamicSrc(), {
        security: {
          integrity: "specified",
          crossOrigin: "",
        },
      }),
    );
  });

  it("throws with security.integrity/crossOrigin mismatch", () => {
    assertThrow(() =>
      addScript(dynamicSrc(), {
        security: {
          integrity: "specified",
          crossOrigin: "use-credentials",
        },
      }),
    );
  });

  it("no throw with correct security.integrity/crossOrigin", () => {
    assertDidNotThrow(() =>
      addScript(dynamicSrc(), {
        security: {
          integrity: "specified",
          crossOrigin: "anonymous",
        },
      }),
    );
  });

  it("warns when src.origin !== window.location.origin with full URL specified", (t) => {
    let capturedConsoleMessage = "";
    t.mock.method(console, "warn", (msg) => {
      capturedConsoleMessage = msg;
    });

    const src = dynamicSrc();
    addScript(src);

    strictEqual(
      capturedConsoleMessage,
      `The script "${src}" is being loaded from a different origin
to the current page. It is recommended that you use the
'integrity' option to ensure the script has not been
tampered with.`,
    );
  });

  it("does not warn when src.origin !== window.location.origin if src URL is relative", (t) => {
    let capturedConsoleMessage = "";
    t.mock.method(console, "warn", (msg) => {
      capturedConsoleMessage = msg;
    });

    const src = dynamicSrc("./relative");
    addScript(src);

    strictEqual(capturedConsoleMessage, "");
  });

  it("throws when dataSet not an object", () => {
    assertThrow(() =>
      addScript(dynamicSrc(), {
        dataSet: "not an object",
      }),
    );
  });

  it("throws when dataSet contains non-camelCase strings", () => {
    assertThrow(() =>
      addScript(dynamicSrc(), {
        dataSet: {
          ["hello-there"]: "1",
        },
      }),
    );
  });

  it("does not throw when dataSet contains camelCase strings", () => {
    assertDidNotThrow(() =>
      addScript(dynamicSrc(), {
        dataSet: {
          helloThere: "1",
        },
      }),
    );
  });
});
