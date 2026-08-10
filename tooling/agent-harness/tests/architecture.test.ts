import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { analyzeArchitecture } from "../src/architecture.js";

describe("architecture dependency gates", () => {
  it("rejects a Runtime to Builder authoring import", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-architecture-"));
    const directory = join(root, "packages/runtime-core/src");
    mkdirSync(directory, { recursive: true });
    writeFileSync(join(directory, "bad.ts"), 'import "@system-builder/mirror";\n');
    assert.deepEqual(analyzeArchitecture(root), [
      {
        file: "packages/runtime-core/src/bad.ts",
        rule: "runtime-does-not-import-builder-authoring",
        importPath: "@system-builder/mirror",
      },
    ]);
  });

  it("allows Runtime to consume public contracts", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-architecture-"));
    const directory = join(root, "packages/runtime-core/src");
    mkdirSync(directory, { recursive: true });
    writeFileSync(join(directory, "good.ts"), 'import "@system-builder/contracts";\n');
    assert.deepEqual(analyzeArchitecture(root), []);
  });

  it("rejects relative cross-package imports and package cycles", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-architecture-"));
    const alpha = join(root, "packages/alpha/src");
    const beta = join(root, "packages/beta/src");
    mkdirSync(alpha, { recursive: true });
    mkdirSync(beta, { recursive: true });
    writeFileSync(join(alpha, "index.ts"), 'import "@system-builder/beta";\nimport "../../beta/src/internal";\n');
    writeFileSync(join(beta, "index.ts"), 'import "@system-builder/alpha";\n');
    const violations = analyzeArchitecture(root);
    assert.ok(violations.some((item) => item.rule === "suite-modules-use-public-package-imports"));
    assert.ok(violations.some((item) => item.rule === "no-circular-package-dependencies"));
  });
});
