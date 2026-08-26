import assert from "node:assert/strict";
import test from "node:test";
import canonicalSchema from "../../packages/contracts/system-definition/system-definition.schema.json";
import {
  SYSTEM_DEFINITION_SCHEMA_ID,
  systemDefinitionSchema,
} from "../../packages/contracts/system-definition/index.js";

type SchemaNode = Readonly<{
  $id?: string;
  properties?: Readonly<Record<string, unknown>>;
  required?: readonly string[];
}>;

const canonical = canonicalSchema as SchemaNode;
const imported = systemDefinitionSchema as SchemaNode;

test("canonical SystemDefinition schema identity resolves to the imported complete contract", () => {
  assert.equal(canonical.$id, SYSTEM_DEFINITION_SCHEMA_ID);
  assert.deepEqual(imported, canonical);

  for (const property of [
    "authenticationProviders",
    "identities",
    "sessionPolicy",
    "roleBindings",
    "views",
    "permissions",
    "policies",
  ]) {
    assert.ok(canonical.properties?.[property], `canonical schema must publish ${property}`);
  }
});

test("canonical schema keeps the established required surface backward-compatible", () => {
  assert.deepEqual(canonical.required, [
    "definition",
    "analysisRef",
    "recipeRef",
    "entities",
    "processes",
    "actions",
    "capabilities",
    "views",
    "permissions",
    "policies",
    "integrations",
    "environmentRequirements",
  ]);
});
