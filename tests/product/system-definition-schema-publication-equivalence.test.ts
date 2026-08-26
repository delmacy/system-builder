import assert from "node:assert/strict";
import test from "node:test";
import canonicalSchema from "../../packages/contracts/system-definition/system-definition.schema.json";
import identitySessionSchema from "../../packages/contracts/system-definition/identity-session.schema.json";
import authorityGeneratedInteractionSchema from "../../packages/contracts/system-definition/authority-generated-interaction.schema.json";
import {
  SYSTEM_DEFINITION_SCHEMA_ID,
  systemDefinitionSchema,
} from "../../packages/contracts/system-definition/index.js";

type Schema = Readonly<{
  $id?: string;
  properties: Readonly<Record<string, unknown>>;
}>;

const published = canonicalSchema as Schema;
const imported = systemDefinitionSchema as Schema;
const identity = identitySessionSchema as Schema;
const authority = authorityGeneratedInteractionSchema as Schema;

test("SystemDefinition publication and import expose equivalent representative base semantics", () => {
  assert.equal(published.$id, SYSTEM_DEFINITION_SCHEMA_ID);
  assert.equal(imported.$id, SYSTEM_DEFINITION_SCHEMA_ID);
  for (const property of ["entities", "processes", "actions", "integrations", "environmentRequirements"]) {
    assert.deepEqual(published.properties[property], imported.properties[property], property);
  }
});

test("published canonical schema cannot drop identity/session extensions", () => {
  for (const property of ["authenticationProviders", "identities", "sessionPolicy"]) {
    assert.deepEqual(published.properties[property], identity.properties[property], property);
    assert.deepEqual(imported.properties[property], identity.properties[property], property);
  }
});

test("published canonical schema cannot drop or weaken authority/generated-interaction extensions", () => {
  for (const property of ["roleBindings", "views", "permissions", "policies"]) {
    assert.deepEqual(published.properties[property], authority.properties[property], property);
    assert.deepEqual(imported.properties[property], authority.properties[property], property);
  }
});
