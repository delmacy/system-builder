import assert from "node:assert/strict";
import test from "node:test";
import { systemDefinitionSchema } from "../../packages/contracts/system-definition/index.js";

type SchemaNode = Readonly<{
  type?: string | readonly string[];
  required?: readonly string[];
  enum?: readonly string[];
  minProperties?: number;
  oneOf?: readonly SchemaNode[];
  items?: SchemaNode;
  properties?: Readonly<Record<string, SchemaNode>>;
}>;

const properties = systemDefinitionSchema.properties as unknown as Readonly<Record<string, SchemaNode>>;

test("SystemDefinition authority descriptors remain additive and explicit", () => {
  const roleBindings = properties.roleBindings;
  assert.equal(roleBindings?.type, "array");
  assert.deepEqual(roleBindings?.items?.required, ["id", "roleRef"]);
  assert.equal(roleBindings?.items?.oneOf?.length, 2);
  assert.ok(roleBindings?.items?.properties?.actorRef);
  assert.ok(roleBindings?.items?.properties?.membershipRef);

  const permission = properties.permissions?.items;
  assert.deepEqual(permission?.required, ["role", "resource", "actions"]);
  assert.ok(permission?.properties?.context);
  assert.ok(permission?.properties?.policyRefs);
  assert.equal(permission?.properties?.context?.minProperties, 1);
});

test("structured policy is bounded data and free-text statement stays descriptive", () => {
  const policy = properties.policies?.items;
  assert.deepEqual(policy?.required, ["id", "statement", "requirementRefs"]);
  const structured = policy?.properties?.structured;
  assert.ok(structured?.properties?.effect);
  assert.deepEqual(structured?.properties?.effect?.enum, ["allow", "deny"]);
  assert.ok(structured?.properties?.roleRefs);
  assert.ok(structured?.properties?.resourceRefs);
  assert.ok(structured?.properties?.actionRefs);
  assert.ok(structured?.properties?.contextEquals);

  const serialized = JSON.stringify(structured);
  for (const forbidden of ["expression", "script", "code", "eval", "function"]) {
    assert.equal(serialized.includes(`"${forbidden}"`), false, forbidden);
  }
});

test("generated view bindings require explicit entity references", () => {
  const binding = properties.views?.items?.properties?.binding;
  assert.ok(binding?.properties);
  assert.deepEqual(binding?.required, ["entityRef"]);
  assert.ok(binding.properties.entityRef);
  assert.ok(binding.properties.fieldRefs);
  assert.ok(binding.properties.actionRefs);
});

test("legacy SystemDefinition required fields remain unchanged", () => {
  assert.deepEqual(systemDefinitionSchema.required, ["definition", "analysisRef", "recipeRef", "entities", "processes", "actions", "capabilities", "views", "permissions", "policies", "integrations", "environmentRequirements"]);
});
