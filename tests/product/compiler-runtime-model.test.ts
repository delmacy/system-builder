import assert from "node:assert/strict";
import test from "node:test";
import { sha256Canonical } from "../../packages/deterministic/index.js";
import { compileRuntimeModelRelease } from "../../packages/compiler/runtime-model.js";
import type { CompilerSystemDefinitionRuntimeProjection } from "../../packages/compiler/runtime-projection.js";

function assemblyPlan() {
  const payload = { kind: "AssemblyPlan" as const, systemDefinitionRef: "system-definition:p13:1", components: [], sourceRefs: ["source:p13"] };
  return { ...payload, contentHash: sha256Canonical(payload) };
}

function projection(reverse = false): CompilerSystemDefinitionRuntimeProjection {
  const entities = [
    { id: "entity:ticket", fields: [{ name: "title", type: "string" as const, required: true }] },
    { id: "entity:user", fields: [{ name: "name", type: "string" as const }] },
  ];
  return {
    kind: "SystemDefinitionRuntimeProjection",
    systemDefinitionRef: "system-definition:p13:1",
    entities: reverse ? entities.reverse() : entities,
    actions: [{ id: "action:close", effect: { kind: "entity.update", entityRef: "entity:ticket" } }],
    processes: [{ id: "process:ticket", states: ["open", "closed"], initialState: "open", transitions: [{ id: "transition:close", from: "open", to: "closed", actionRef: "action:close" }] }],
  };
}

function compile(reverse = false) {
  const plan = assemblyPlan();
  return compileRuntimeModelRelease({
    assemblyPlan: plan,
    validationEvidence: { kind: "ValidationEvidence", assemblyPlanRef: plan.contentHash, decision: "PASS", evidenceHash: sha256Canonical({ decision: "PASS", plan: plan.contentHash }) },
    compilerVersion: "0.1.0", runtimeVersion: "0.1.0",
    environmentSchema: [{ name: "DATABASE_URL", kind: "secret-reference", required: true }],
    systemDefinitionRuntime: projection(reverse),
  });
}

test("Compiler materializes canonical runtime model and entity migrations inside artifact integrity", () => {
  const first = compile();
  const second = compile(true);
  assert.deepEqual(first, second);
  const modelFile = first.files.find((file) => file.path === "runtime-model.json");
  assert.ok(modelFile);
  const model = JSON.parse(modelFile.content) as { kind: string; entities: { id: string; table: string }[]; processes: { initialState?: string }[] };
  assert.equal(model.kind, "RuntimeModel");
  assert.deepEqual(model.entities.map((entity) => entity.id), ["entity:ticket", "entity:user"]);
  assert.equal(model.processes[0]?.initialState, "open");
  assert.ok(model.entities.every((entity) => /^sb_entity_[a-f0-9]{16}$/.test(entity.table)));
  const entityMigrations = first.files.filter((file) => file.path.startsWith("migrations/runtime-entities/"));
  assert.equal(entityMigrations.length, 2);
  assert.ok(first.artifact.manifest.files.includes("runtime-model.json"));
  for (const migration of entityMigrations) assert.ok(first.artifact.manifest.files.includes(migration.path));
});

test("runtime model materialization remains reference-only and fails on identity mismatch", () => {
  const result = compile();
  assert.equal(JSON.stringify(result).includes("postgres://secret-value"), false);
  const plan = assemblyPlan();
  assert.throws(() => compileRuntimeModelRelease({
    assemblyPlan: plan,
    validationEvidence: { kind: "ValidationEvidence", assemblyPlanRef: plan.contentHash, decision: "PASS", evidenceHash: sha256Canonical({ decision: "PASS", plan: plan.contentHash }) },
    compilerVersion: "0.1.0", runtimeVersion: "0.1.0",
    environmentSchema: [{ name: "DATABASE_URL", kind: "secret-reference", required: true }],
    systemDefinitionRuntime: { ...projection(), systemDefinitionRef: "system-definition:wrong" },
  }), /COMPILER_RUNTIME_PROJECTION_REFERENCE_MISMATCH/);
});
