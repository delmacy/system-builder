import assert from "node:assert/strict";
import test from "node:test";
import { sha256Canonical } from "../../packages/deterministic/index.js";
import { compileRuntimeModelRelease } from "../../packages/compiler/runtime-model.js";

function compileActorRuntime() {
  const payload = { kind: "AssemblyPlan" as const, systemDefinitionRef: "system-definition:p13:actor", components: [], sourceRefs: ["source:p13"] };
  const plan = { ...payload, contentHash: sha256Canonical(payload) };
  return compileRuntimeModelRelease({
    assemblyPlan: plan,
    validationEvidence: { kind: "ValidationEvidence", assemblyPlanRef: plan.contentHash, decision: "PASS", evidenceHash: sha256Canonical({ decision: "PASS", plan: plan.contentHash }) },
    compilerVersion: "0.1.0",
    runtimeVersion: "0.1.0",
    environmentSchema: [
      { name: "DATABASE_URL", kind: "secret-reference", required: true },
      { name: "AUTH_PROVIDER", kind: "secret-reference", required: true },
    ],
    systemDefinitionRuntime: {
      kind: "SystemDefinitionRuntimeProjection",
      systemDefinitionRef: "system-definition:p13:actor",
      entities: [{ id: "entity:ticket", fields: [{ name: "title", type: "string", required: true }] }],
      actions: [{ id: "action:create", effect: { kind: "entity.create", entityRef: "entity:ticket" } }],
      processes: [],
      environmentRequirements: [
        { name: "DATABASE_URL", kind: "secret-reference", required: true },
        { name: "AUTH_PROVIDER", kind: "secret-reference", required: true },
      ],
      authenticationProviders: [{ id: "provider:reference", bindingRef: "AUTH_PROVIDER" }],
      identities: [{ id: "identity:alice", kind: "user", subjectRef: "person:alice", active: true, authenticationProviderRef: "provider:reference" }],
      sessionPolicy: { lifetimeSeconds: 60 },
    },
  });
}

test("representative action route requires authenticated session and exposes actor context", () => {
  const entry = compileActorRuntime().files.find((file) => file.path === "runtime-entry.mjs");
  assert.ok(entry);
  assert.match(entry.content, /runtimeHandleActorRequiredActionRequest/);
  assert.match(entry.content, /RUNTIME_UNAUTHENTICATED/);
  assert.match(entry.content, /actor: runtimePublicIdentity\(actor\.identity\)/);
  assert.match(entry.content, /runtimeResolveSession\(model, sessions, runtimeBearerToken\(request\)\)/);
});

test("actor context remains authentication-only without implicit authorization", () => {
  const serialized = JSON.stringify(compileActorRuntime());
  assert.equal(serialized.includes("roleGrant"), false);
  assert.equal(serialized.includes("permissionGrant"), false);
  assert.equal(serialized.includes("policyDecision"), false);
  assert.equal(serialized.includes("RuntimeAction"), true);
});
