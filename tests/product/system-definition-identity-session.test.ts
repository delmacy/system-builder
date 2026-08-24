import assert from "node:assert/strict";
import test from "node:test";
import { systemDefinitionSchema } from "../../packages/contracts/system-definition/index.js";

type SchemaNode = Readonly<{
  type?: string;
  required?: readonly string[];
  enum?: readonly string[];
  minimum?: number;
  maximum?: number;
  items?: SchemaNode;
  properties?: Readonly<Record<string, SchemaNode>>;
}>;

const properties = systemDefinitionSchema.properties as unknown as Readonly<Record<string, SchemaNode>>;

test("SystemDefinition identity/session descriptors are additive and reference-oriented", () => {
  const identities = properties.identities;
  const providers = properties.authenticationProviders;
  const sessionPolicy = properties.sessionPolicy;
  assert.ok(identities?.items?.properties);
  assert.ok(providers?.items);
  assert.ok(sessionPolicy?.properties);
  const identityKind = identities.items.properties.kind;
  const identityActive = identities.items.properties.active;
  const lifetime = sessionPolicy.properties.lifetimeSeconds;
  assert.ok(identityKind);
  assert.ok(identityActive);
  assert.ok(lifetime);
  assert.equal(identities.type, "array");
  assert.deepEqual(identities.items.required, ["id", "kind", "subjectRef", "active", "authenticationProviderRef"]);
  assert.deepEqual(identityKind.enum, ["user", "service"]);
  assert.equal(identityActive.type, "boolean");
  assert.equal(providers.type, "array");
  assert.deepEqual(providers.items.required, ["id", "bindingRef"]);
  assert.equal(lifetime.minimum, 1);
  assert.equal(lifetime.maximum, 86400);
});

test("identity/session contract introduces no credential or authorization value fields", () => {
  const serialized = JSON.stringify({ authenticationProviders: properties.authenticationProviders, identities: properties.identities, sessionPolicy: properties.sessionPolicy });
  for (const forbidden of ["password", "token", "secret", "credential", "signingKey", "endpoint", "role", "permission", "policy"]) assert.equal(serialized.includes(`"${forbidden}"`), false, forbidden);
  assert.equal(properties.permissions !== undefined, true);
  assert.equal(properties.policies !== undefined, true);
  assert.equal(properties.views !== undefined, true);
});

test("legacy SystemDefinition required fields remain unchanged", () => {
  assert.deepEqual(systemDefinitionSchema.required, ["definition", "analysisRef", "recipeRef", "entities", "processes", "actions", "capabilities", "views", "permissions", "policies", "integrations", "environmentRequirements"]);
});
