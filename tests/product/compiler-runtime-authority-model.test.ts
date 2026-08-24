import assert from "node:assert/strict";
import test from "node:test";
import { canonicalJson } from "@system-builder/deterministic";
import { normalizeRuntimeAuthorityProjection } from "../../packages/compiler/authority-projection.js";
import { materializeRuntimeModel } from "../../packages/compiler/runtime-model.js";

function runtimeProjection() {
  return {
    kind: "SystemDefinitionRuntimeProjection" as const,
    systemDefinitionRef: "system:p13",
    entities: [{ id: "entity:ticket", fields: [{ name: "title", type: "string" as const }] }],
    actions: [{ id: "action:edit", effect: { kind: "entity.update" as const, entityRef: "entity:ticket" } }],
    processes: [],
    environmentRequirements: [{ name: "AUTH_SECRET", kind: "secret-reference" as const, required: true }],
    authenticationProviders: [{ id: "provider:local", bindingRef: "AUTH_SECRET" }],
    identities: [{ id: "identity:alice", kind: "user" as const, subjectRef: "subject:alice", active: true, authenticationProviderRef: "provider:local" }],
    sessionPolicy: { lifetimeSeconds: 900 },
  };
}

function authorityProjection() {
  const runtime = runtimeProjection();
  return normalizeRuntimeAuthorityProjection({
    entities: runtime.entities,
    actions: runtime.actions,
    identities: runtime.identities,
    roleBindings: [{ id: "binding:alice-agent", roleRef: "role:agent", actorRef: "identity:alice" }],
    permissions: [{ role: "role:agent", resource: "entity:ticket", actions: ["action:edit"], policyRefs: ["policy:owned"] }],
    policies: [{ id: "policy:owned", statement: "documentation only", structured: { effect: "allow", roleRefs: ["role:agent"], resourceRefs: ["entity:ticket"], actionRefs: ["action:edit"], contextEquals: { ownership: true } } }],
    views: [{ id: "view:ticket", kind: "form", binding: { entityRef: "entity:ticket", fieldRefs: ["title"], actionRefs: ["action:edit"] } }],
  });
}

test("RuntimeModel carries normalized authority and generated interaction descriptors deterministically", () => {
  const first = materializeRuntimeModel("system:p13", runtimeProjection(), authorityProjection()).model;
  const second = materializeRuntimeModel("system:p13", runtimeProjection(), authorityProjection()).model;

  assert.deepEqual(first.roleBindings, [{ id: "binding:alice-agent", roleRef: "role:agent", actorRef: "identity:alice" }]);
  assert.deepEqual(first.permissions, [{ role: "role:agent", resource: "entity:ticket", actions: ["action:edit"], policyRefs: ["policy:owned"] }]);
  assert.equal(first.policies?.[0]?.structured?.effect, "allow");
  assert.equal(first.views?.[0]?.kind, "form");
  assert.deepEqual(first.views?.[0]?.binding, { entityRef: "entity:ticket", fieldRefs: ["title"], actionRefs: ["action:edit"] });
  assert.equal(canonicalJson(first), canonicalJson(second));
});

test("RuntimeModel is byte-stable in shape when authority declarations are absent", () => {
  const model = materializeRuntimeModel("system:p13", runtimeProjection()).model;
  assert.equal(Object.hasOwn(model, "roleBindings"), false);
  assert.equal(Object.hasOwn(model, "permissions"), false);
  assert.equal(Object.hasOwn(model, "policies"), false);
  assert.equal(Object.hasOwn(model, "views"), false);
});

test("RuntimeModel authority projection remains reference-only and drops free-text policy", () => {
  const serialized = JSON.stringify(materializeRuntimeModel("system:p13", runtimeProjection(), authorityProjection()).model);
  assert.equal(serialized.includes("documentation only"), false);
  assert.equal(serialized.includes("statement"), false);
  for (const marker of ["credential", "resolvedValue", "signingKey", "endpointValue"]) assert.equal(serialized.includes(marker), false, marker);
});
