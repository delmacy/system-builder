import assert from "node:assert/strict";
import test from "node:test";
import { sha256Canonical } from "../../packages/deterministic/index.js";
import { compileRuntimeModelRelease } from "../../packages/compiler/runtime-model.js";

function compile() {
  const planPayload = { kind: "AssemblyPlan" as const, systemDefinitionRef: "system-definition:p13:action", components: [], sourceRefs: [] };
  const plan = { ...planPayload, contentHash: sha256Canonical(planPayload) };
  return compileRuntimeModelRelease({
    assemblyPlan: plan,
    validationEvidence: { kind: "ValidationEvidence", assemblyPlanRef: plan.contentHash, decision: "PASS", evidenceHash: sha256Canonical({ plan: plan.contentHash, decision: "PASS" }) },
    compilerVersion: "0.1.0",
    runtimeVersion: "0.1.0",
    environmentSchema: [{ name: "DATABASE_URL", kind: "secret-reference", required: true }],
    systemDefinitionRuntime: {
      kind: "SystemDefinitionRuntimeProjection",
      systemDefinitionRef: plan.systemDefinitionRef,
      entities: [{ id: "entity:ticket", fields: [{ name: "title", type: "string", required: true }] }],
      actions: [{ id: "action:update", effect: { kind: "entity.update", entityRef: "entity:ticket" } }],
      processes: [],
    },
  });
}

test("Compiler entrypoint executes only explicit generated action effects", () => {
  const result = compile();
  const entrypoint = result.files.find((file) => file.path === "runtime-entry.mjs");
  assert.ok(entrypoint);
  assert.match(entrypoint.content, /\/actions\\\/\(\[\^\/\]\+\)/);
  assert.match(entrypoint.content, /RUNTIME_ACTION_UNKNOWN/);
  assert.match(entrypoint.content, /RUNTIME_ACTION_UNSUPPORTED/);
  assert.match(entrypoint.content, /action\.effect\.kind === \"entity\.update\"/);
  assert.equal(entrypoint.content.includes("action:update"), false, "runtime must not infer behavior from a concrete action name");
  assert.equal(entrypoint.content.includes("SYSTEM_BUILDER_URL"), false);
  assert.ok(result.artifact.manifest.files.includes("runtime-entry.mjs"));
});
