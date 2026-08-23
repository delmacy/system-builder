import assert from "node:assert/strict";
import test from "node:test";
import { sha256Canonical } from "../../packages/deterministic/index.js";
import { compileRuntimeModelRelease } from "../../packages/compiler/runtime-model.js";

function compiledRuntime(lifetimeSeconds = 30) {
  const payload = { kind: "AssemblyPlan" as const, systemDefinitionRef: "system-definition:p13:session", components: [], sourceRefs: ["source:p13"] };
  const plan = { ...payload, contentHash: sha256Canonical(payload) };
  return compileRuntimeModelRelease({
    assemblyPlan: plan,
    validationEvidence: { kind: "ValidationEvidence", assemblyPlanRef: plan.contentHash, decision: "PASS", evidenceHash: sha256Canonical({ decision: "PASS", plan: plan.contentHash }) },
    compilerVersion: "0.1.0",
    runtimeVersion: "0.1.0",
    environmentSchema: [{ name: "AUTH_PROVIDER", kind: "secret-reference", required: true }],
    systemDefinitionRuntime: {
      kind: "SystemDefinitionRuntimeProjection",
      systemDefinitionRef: "system-definition:p13:session",
      entities: [], actions: [], processes: [],
      environmentRequirements: [{ name: "AUTH_PROVIDER", kind: "secret-reference", required: true }],
      authenticationProviders: [{ id: "provider:reference", bindingRef: "AUTH_PROVIDER" }],
      identities: [{ id: "identity:alice", kind: "user", subjectRef: "person:alice", active: true, authenticationProviderRef: "provider:reference" }],
      sessionPolicy: { lifetimeSeconds },
    },
  });
}

test("generated Runtime issues opaque local sessions with explicit expiry", () => {
  const entry = compiledRuntime().files.find((file) => file.path === "runtime-entry.mjs");
  assert.ok(entry);
  assert.match(entry.content, /globalThis\.crypto\.randomUUID\(\)/);
  assert.match(entry.content, /sessionPolicy\.lifetimeSeconds \* 1000/);
  assert.match(entry.content, /runtimeSessions = new Map\(\)/);
  assert.match(entry.content, /\/auth\/session/);
  assert.match(entry.content, /RuntimeAuthenticatedIdentity/);
});

test("generated Runtime fails closed for missing unknown expired or disabled sessions", () => {
  const entry = compiledRuntime().files.find((file) => file.path === "runtime-entry.mjs");
  assert.ok(entry);
  for (const code of ["RUNTIME_SESSION_MISSING", "RUNTIME_SESSION_UNKNOWN", "RUNTIME_SESSION_EXPIRED", "RUNTIME_SESSION_IDENTITY_INVALID"]) {
    assert.equal(entry.content.includes(code), true, code);
  }
  assert.match(entry.content, /sessions\.delete\(token\)/);
});

test("session runtime artifacts contain policy only, never an issued token", () => {
  const compiled = compiledRuntime(15);
  const model = compiled.files.find((file) => file.path === "runtime-model.json");
  assert.ok(model);
  assert.equal(model.content.includes("\"lifetimeSeconds\":15"), true);
  const serialized = JSON.stringify(compiled);
  assert.equal(serialized.includes("issued-session-token-value"), false);
  assert.equal(serialized.includes("roles"), false);
  assert.equal(serialized.includes("permissions"), false);
});
