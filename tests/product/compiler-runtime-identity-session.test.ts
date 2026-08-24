import assert from "node:assert/strict";
import test from "node:test";
import { normalizeSystemDefinitionRuntimeProjection } from "../../packages/compiler/runtime-projection.js";

function projection() {
  return {
    kind: "SystemDefinitionRuntimeProjection" as const,
    systemDefinitionRef: "system:p13",
    entities: [], actions: [], processes: [],
    environmentRequirements: [{ name: "AUTH_SECRET", kind: "secret-reference" as const, required: true }],
    authenticationProviders: [{ id: "provider:b", bindingRef: "AUTH_SECRET" }, { id: "provider:a", bindingRef: "AUTH_SECRET" }],
    identities: [
      { id: "identity:b", kind: "service" as const, subjectRef: "service:b", active: true, authenticationProviderRef: "provider:b" },
      { id: "identity:a", kind: "user" as const, subjectRef: "person:a", active: true, authenticationProviderRef: "provider:a" },
    ],
    sessionPolicy: { lifetimeSeconds: 900 },
  };
}

test("identity/session projection is deterministic and reference-only", () => {
  const normalized = normalizeSystemDefinitionRuntimeProjection("system:p13", projection());
  assert.deepEqual(normalized.authenticationProviders?.map((item) => item.id), ["provider:a", "provider:b"]);
  assert.deepEqual(normalized.identities?.map((item) => item.id), ["identity:a", "identity:b"]);
  assert.deepEqual(normalized.sessionPolicy, { lifetimeSeconds: 900 });
  const serialized = JSON.stringify(normalized);
  assert.equal(serialized.includes("credential"), false);
  assert.equal(serialized.includes("token"), false);
});

test("identity/session projection fails closed for unknown provider or binding", () => {
  const unknownProvider = projection();
  unknownProvider.identities = [{ id: "identity:a", kind: "user", subjectRef: "person:a", active: true, authenticationProviderRef: "provider:missing" }];
  assert.throws(() => normalizeSystemDefinitionRuntimeProjection("system:p13", unknownProvider), /UNKNOWN_AUTHENTICATION_PROVIDER/);
  const missingBinding = projection();
  missingBinding.authenticationProviders = [{ id: "provider:a", bindingRef: "MISSING" }];
  missingBinding.identities = [];
  assert.throws(() => normalizeSystemDefinitionRuntimeProjection("system:p13", missingBinding), /UNKNOWN_BINDING_REFERENCE/);
});

test("identity/session projection rejects duplicate identities and unbounded lifetime", () => {
  const duplicate = projection();
  const firstIdentity = duplicate.identities[0];
  assert.ok(firstIdentity);
  duplicate.identities = [firstIdentity, firstIdentity];
  assert.throws(() => normalizeSystemDefinitionRuntimeProjection("system:p13", duplicate), /DUPLICATE_IDENTITY/);
  const invalidLifetime = projection();
  invalidLifetime.sessionPolicy = { lifetimeSeconds: 86401 };
  assert.throws(() => normalizeSystemDefinitionRuntimeProjection("system:p13", invalidLifetime), /INVALID_SESSION_LIFETIME/);
});
