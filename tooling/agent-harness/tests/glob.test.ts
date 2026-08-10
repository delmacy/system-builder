import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { matchesGlob } from "../src/glob.js";

describe("task path globs", () => {
  it("matches recursive and exact paths", () => {
    assert.equal(matchesGlob("docs/current/PROJECT_STATE.md", "docs/**"), true);
    assert.equal(matchesGlob("package.json", "package.json"), true);
    assert.equal(matchesGlob("packages/runtime-core/src/index.ts", "packages/*/src/**"), true);
  });

  it("does not let a single star cross directories", () => {
    assert.equal(matchesGlob("packages/runtime-core/src/index.ts", "packages/*.ts"), false);
  });
});
