import assert from "node:assert/strict";
import test from "node:test";
import { canonicalJson } from "@system-builder/deterministic";
import { materializeRuntimeModel } from "../../packages/compiler/runtime-model.js";

function projection() {
  return {
    kind: "SystemDefinitionRuntimeProjection" as const,
    systemDefinitionRef: "system:p13",
    entities: [], actions: [], processes: [],
    environmentRequirements: [{ name: "AUTH_SECRET", kind: "secret-reference" as const, required: true }],
    authenticationProviders: [{ id: "provider:local", bindingRef: "AUTH_SECRET" }],
    identities: [{ id: "identity:alice", kind: "user" as const, subjectRef: "person:alice", active: true, authenticationProviderRef: "provider:local" }],
    sessionPolicy: { lifetimeSeconds: 900 },
  };
}

test("RuntimeModel materializes normalized identity/session descriptors", () => {
  const first = materializeRuntimeModel("system:p13", projection()).model;
  const second = materializeRuntimeModel("system:p13", projection()).model;
  assert.deepEqual(first.authenticationProviders, [{ id: "provider:local", bindingRef: "AUTH_SECRET" }]);
  assert.deepEqual(first.identities, [{ id: "identity:alice", kind: "user", subjectRef: "person:alice", active: true, authenticationProviderRef: "provider:local" }]);
  assert.deepEqual(first.sessionPolicy, { lifetimeSeconds: 900 });
  assert.equal(canonicalJson(first), canonicalJson(second));
});

test("RuntimeModel remains backward compatible when identity/session is absent", () => {
  const model = materializeRuntimeModel("system:p13", { kind: "SystemDefinitionRuntimeProjection", systemDefinitionRef: "system:p13", entities: [], actions: [], processes: [] }).model;
  assert.deepEqual(model.authenticationProviders, []);
  assert.deepEqual(model.identities, []);
  assert.equal(model.sessionPolicy, undefined);
});

test("RuntimeModel contains references only", () => {
  const serialized = JSON.stringify(materializeRuntimeModel("system:p13", projection()).model);
  for (const marker of ["password", "credential", "token", "resolvedValue", "signingKey"]) assert.equal(serialized.includes(marker), false, marker);
});
