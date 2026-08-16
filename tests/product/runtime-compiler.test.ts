import assert from "node:assert/strict";
import test from "node:test";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";

const assemblyPlan = Object.freeze({
  kind: "AssemblyPlan" as const,
  systemDefinitionRef: "system-definition:runtime-compiler:1",
  components: Object.freeze([
    Object.freeze({ capability: "runtime.health", provider: "provider-runtime", version: "1.0.0" }),
  ]),
  sourceRefs: Object.freeze(["system-definition:runtime-compiler:1"]),
  contentHash: `sha256:${"d".repeat(64)}`,
});

const validationEvidence = Object.freeze({
  kind: "ValidationEvidence" as const,
  assemblyPlanRef: assemblyPlan.contentHash,
  decision: "PASS" as const,
  evidenceHash: `sha256:${"e".repeat(64)}`,
});

test("compiler materializes a deterministic self-contained persistent-capable runtime file set", () => {
  const compile = () => compileSyntheticRelease({
    assemblyPlan,
    validationEvidence,
    compilerVersion: "0.2.0",
    runtimeVersion: "0.2.0",
    environmentSchema: [
      { name: "DATABASE_URL", kind: "secret-reference", required: true },
      { name: "LOG_LEVEL", kind: "config", required: false },
    ],
  });

  const first = compile();
  const second = compile();
  assert.deepEqual(first, second);

  const entrypoint = first.files.find((file) => file.path === "runtime-entry.mjs");
  assert.ok(entrypoint);
  const imports = [...entrypoint.content.matchAll(/^\s*import\s+.*?from\s+["']([^"']+)["'];?/gm)]
    .map((match) => match[1]);
  assert.deepEqual(imports, ["node:http"]);
  assert.equal(entrypoint.content.includes("@system-builder/"), false);
  assert.equal(entrypoint.content.includes("SYSTEM_BUILDER_URL"), false);
  assert.equal(entrypoint.content.includes("OBSERVE_URL"), false);
  assert.match(entrypoint.content, /RuntimeStarted/);
  assert.match(entrypoint.content, /\/health/);

  const runtimeManifest = first.files.find((file) => file.path === "runtime-manifest.json");
  assert.ok(runtimeManifest);
  const parsedManifest = JSON.parse(runtimeManifest.content) as { entrypoint: string; runtimeVersion: string };
  assert.equal(parsedManifest.entrypoint, "runtime-entry.mjs");
  assert.equal(parsedManifest.runtimeVersion, "0.2.0");

  assert.equal(first.artifact.manifest.files.includes("runtime-entry.mjs"), true);
});
