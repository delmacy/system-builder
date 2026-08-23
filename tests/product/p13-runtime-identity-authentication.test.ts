import assert from "node:assert/strict";
import test from "node:test";
import { sha256Canonical } from "../../packages/deterministic/index.js";
import { compileRuntimeModelRelease } from "../../packages/compiler/runtime-model.js";

function compileIdentityRuntime() {
  const planPayload = { kind: "AssemblyPlan" as const, systemDefinitionRef: "system-definition:p13:identity", components: [], sourceRefs: ["source:p13"] };
  const plan = { ...planPayload, contentHash: sha256Canonical(planPayload) };
  return compileRuntimeModelRelease({
    assemblyPlan: plan,
    validationEvidence: { kind: "ValidationEvidence", assemblyPlanRef: plan.contentHash, decision: "PASS", evidenceHash: sha256Canonical({ decision: "PASS", plan: plan.contentHash }) },
    compilerVersion: "0.1.0",
    runtimeVersion: "0.1.0",
    environmentSchema: [{ name: "AUTH_PROVIDER", kind: "secret-reference", required: true }],
    systemDefinitionRuntime: {
      kind: "SystemDefinitionRuntimeProjection",
      systemDefinitionRef: "system-definition:p13:identity",
      entities: [], actions: [], processes: [],
      environmentRequirements: [{ name: "AUTH_PROVIDER", kind: "secret-reference", required: true }],
      authenticationProviders: [{ id: "provider:reference", bindingRef: "AUTH_PROVIDER" }],
      identities: [
        { id: "identity:active", kind: "user", subjectRef: "person:active", active: true, authenticationProviderRef: "provider:reference" },
        { id: "identity:disabled", kind: "service", subjectRef: "service:disabled", active: false, authenticationProviderRef: "provider:reference" },
      ],
      sessionPolicy: { lifetimeSeconds: 900 },
    },
  });
}

test("generated Runtime contains explicit provider authentication and active identity mapping", () => {
  const compiled = compileIdentityRuntime();
  const entry = compiled.files.find((file) => file.path === "runtime-entry.mjs");
  assert.ok(entry);
  assert.match(entry.content, /\/auth\/login/);
  assert.match(entry.content, /RUNTIME_AUTH_INVALID_CREDENTIAL/);
  assert.match(entry.content, /RUNTIME_AUTH_IDENTITY_UNMAPPED/);
  assert.match(entry.content, /RUNTIME_AUTH_IDENTITY_DISABLED/);
  assert.match(entry.content, /process\.env\[provider\.bindingRef\]/);
  assert.match(entry.content, /RuntimeAuthenticatedIdentity/);
});

test("generated authentication artifact stays reference-only and contains no authorization grant", () => {
  const compiled = compileIdentityRuntime();
  const serialized = JSON.stringify(compiled);
  assert.equal(serialized.includes("runtime-auth-secret-value"), false);
  assert.equal(serialized.includes("roles:"), false);
  assert.equal(serialized.includes("permissions:"), false);
  assert.equal(serialized.includes("AUTH_PROVIDER"), true);
});
