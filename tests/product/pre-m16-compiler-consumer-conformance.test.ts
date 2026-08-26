import assert from "node:assert/strict";
import test from "node:test";
import canonicalSchema from "../../packages/contracts/system-definition/system-definition.schema.json";
import {
  SYSTEM_DEFINITION_SCHEMA_ID,
  systemDefinitionSchema,
} from "../../packages/contracts/system-definition/index.js";
import { normalizeRuntimeAuthorityProjection } from "../../packages/compiler/authority-projection.js";
import { materializeRuntimeModel } from "../../packages/compiler/runtime-model.js";
import { normalizeSystemDefinitionRuntimeProjection } from "../../packages/compiler/runtime-projection.js";

const definition = {
  entities: [{ id: "entity:ticket", fields: [{ name: "title", type: "string" as const }] }],
  actions: [{ id: "action:edit", effect: { kind: "entity.update" as const, entityRef: "entity:ticket" } }],
  processes: [],
  environmentRequirements: [{ name: "AUTH_SECRET", kind: "secret-reference" as const, required: true }],
  authenticationProviders: [{ id: "provider:local", bindingRef: "AUTH_SECRET" }],
  identities: [{ id: "identity:alice", kind: "user" as const, subjectRef: "subject:alice", active: true, authenticationProviderRef: "provider:local" }],
  sessionPolicy: { lifetimeSeconds: 900 },
  roleBindings: [{ id: "binding:alice-agent", roleRef: "role:agent", actorRef: "identity:alice" }],
  permissions: [{ role: "role:agent", resource: "entity:ticket", actions: ["action:edit"], policyRefs: ["policy:owned"] }],
  policies: [{ id: "policy:owned", statement: "documentation only", structured: { effect: "allow" as const, roleRefs: ["role:agent"], resourceRefs: ["entity:ticket"], actionRefs: ["action:edit"], contextEquals: { ownership: true } } }],
  views: [{ id: "view:ticket", kind: "form" as const, binding: { entityRef: "entity:ticket", fieldRefs: ["title"], actionRefs: ["action:edit"] } }],
};

type SchemaWithProperties = Readonly<{ $id?: string; properties: Readonly<Record<string, unknown>> }>;

test("canonical SystemDefinition extensions remain consumable through real Compiler projections", () => {
  const runtimeProjection = normalizeSystemDefinitionRuntimeProjection("system:pre-m16", {
    kind: "SystemDefinitionRuntimeProjection",
    systemDefinitionRef: "system:pre-m16",
    entities: definition.entities,
    actions: definition.actions,
    processes: definition.processes,
    environmentRequirements: definition.environmentRequirements,
    authenticationProviders: definition.authenticationProviders,
    identities: definition.identities,
    sessionPolicy: definition.sessionPolicy,
  });
  const authorityProjection = normalizeRuntimeAuthorityProjection({
    entities: definition.entities,
    actions: definition.actions,
    identities: definition.identities,
    roleBindings: definition.roleBindings,
    permissions: definition.permissions,
    policies: definition.policies,
    views: definition.views,
  });
  const model = materializeRuntimeModel("system:pre-m16", runtimeProjection, authorityProjection).model;

  assert.equal(model.identities[0]?.id, "identity:alice");
  assert.equal(model.sessionPolicy?.lifetimeSeconds, 900);
  assert.equal(model.roleBindings?.[0]?.actorRef, "identity:alice");
  assert.equal(model.permissions?.[0]?.actions[0], "action:edit");
  assert.equal(model.views?.[0]?.binding?.entityRef, "entity:ticket");
});

test("Compiler consumer proof remains bound to the canonical published SystemDefinition schema identity", () => {
  const published = canonicalSchema as SchemaWithProperties;
  const imported = systemDefinitionSchema as SchemaWithProperties;
  assert.equal(published.$id, SYSTEM_DEFINITION_SCHEMA_ID);
  assert.equal(imported.$id, SYSTEM_DEFINITION_SCHEMA_ID);
  for (const property of ["authenticationProviders", "identities", "sessionPolicy", "roleBindings", "permissions", "policies", "views"]) {
    assert.deepEqual(published.properties[property], imported.properties[property], property);
  }
});
