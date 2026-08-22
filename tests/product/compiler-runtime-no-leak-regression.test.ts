import assert from "node:assert/strict";
import test from "node:test";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import type { CompilerEnvironmentRequirement } from "../../packages/compiler/index.js";
import { compileWorkflowRuntimeRelease } from "../../packages/compiler/workflow-runtime.js";
import { sha256Canonical } from "../../packages/deterministic/index.js";
import { bootstrapAutonomousRuntime } from "../../packages/runtime-core/index.js";

const SECRET_VALUE = "postgres://runtime-user:must-not-leak@db.internal/runtime";

function compile(environmentSchema: readonly CompilerEnvironmentRequirement[] = [{ name: "DATABASE_URL", kind: "secret-reference", required: true }]) {
  const payload = { kind: "AssemblyPlan" as const, systemDefinitionRef: "system-definition:p13:no-leak", components: [], sourceRefs: [] };
  const plan = { ...payload, contentHash: sha256Canonical(payload) };
  return compileWorkflowRuntimeRelease({
    assemblyPlan: plan,
    validationEvidence: { kind: "ValidationEvidence", assemblyPlanRef: plan.contentHash, decision: "PASS", evidenceHash: sha256Canonical({ plan: plan.contentHash, decision: "PASS" }) },
    compilerVersion: "0.1.0",
    runtimeVersion: "0.1.0",
    environmentSchema,
    systemDefinitionRuntime: {
      kind: "SystemDefinitionRuntimeProjection",
      systemDefinitionRef: plan.systemDefinitionRef,
      entities: [{ id: "entity:ticket", fields: [{ name: "title", type: "string", required: true }] }],
      actions: [{ id: "action:close", effect: { kind: "entity.update", entityRef: "entity:ticket" } }],
      processes: [{ id: "process:ticket", states: ["open", "closed"], initialState: "open", transitions: [{ id: "transition:close", from: "open", to: "closed", actionRef: "action:close" }] }],
    },
  });
}

test("Construction A generated model, migrations and ReleaseArtifact remain value-free", () => {
  const result = compile();
  const serialized = JSON.stringify(result);
  assert.equal(serialized.includes(SECRET_VALUE), false);
  assert.ok(result.artifact.environmentSchema.some((requirement) => requirement.name === "DATABASE_URL" && requirement.kind === "secret-reference"));
  assert.ok(result.files.some((file) => file.path === "runtime-model.json"));
  assert.ok(result.files.some((file) => file.path === "migrations/runtime-workflows/001-workflow-state.sql"));
  for (const file of result.files) assert.equal(file.content.includes(SECRET_VALUE), false);
});

test("Compiler rejects inline values before generated runtime surfaces are materialized", () => {
  const unsafe = [{ name: "DATABASE_URL", kind: "secret-reference", required: true, value: SECRET_VALUE }] as unknown as readonly CompilerEnvironmentRequirement[];
  assert.throws(() => compile(unsafe), /COMPILER_SECRET_VALUE_NOT_ALLOWED:DATABASE_URL/);
});

test("Runtime fails closed on missing or inline bindings without echoing resolved values", () => {
  const requirements = [{ name: "DATABASE_URL", kind: "secret-reference" as const, required: true }];
  const missing: EnvironmentProfile = Object.freeze({
    kind: "EnvironmentProfile",
    environmentRef: "environment:p13:no-leak",
    runtimeVersions: Object.freeze(["0.1.0"]),
    bindings: Object.freeze([]),
  });
  assert.deepEqual(bootstrapAutonomousRuntime({ runtimeVersion: "0.1.0", environment: missing, requirements }), {
    ok: false,
    diagnostic: { code: "RUNTIME_MISSING_ENVIRONMENT_BINDING", detail: "DATABASE_URL" },
  });

  const inline = {
    kind: "EnvironmentProfile",
    environmentRef: "environment:p13:no-leak",
    runtimeVersions: ["0.1.0"],
    bindings: [{ name: "DATABASE_URL", kind: "secret-reference", reference: "secret://database-url", value: SECRET_VALUE }],
  } as unknown as EnvironmentProfile;
  const result = bootstrapAutonomousRuntime({ runtimeVersion: "0.1.0", environment: inline, requirements });
  assert.deepEqual(result, { ok: false, diagnostic: { code: "RUNTIME_INLINE_VALUE_NOT_ALLOWED", detail: "DATABASE_URL" } });
  assert.equal(JSON.stringify(result).includes(SECRET_VALUE), false);
});
