import assert from "node:assert/strict";
import test from "node:test";
import { systemDefinitionSchema } from "../../packages/contracts/system-definition/index.js";

type JsonSchema = Readonly<{
  type?: "object" | "array" | "string" | "boolean";
  const?: unknown;
  enum?: readonly unknown[];
  additionalProperties?: boolean;
  required?: readonly string[];
  dependentRequired?: Readonly<Record<string, readonly string[]>>;
  properties?: Readonly<Record<string, JsonSchema>>;
  items?: JsonSchema;
  minLength?: number;
  minItems?: number;
}>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validateSchema(value: unknown, schema: JsonSchema, path = "$"): readonly string[] {
  const errors: string[] = [];
  if (schema.const !== undefined && value !== schema.const) return [`${path}: expected const`];
  if (schema.enum !== undefined && !schema.enum.includes(value)) return [`${path}: expected enum`];
  if (schema.type === "object") {
    if (!isRecord(value)) return [`${path}: expected object`];
    for (const key of schema.required ?? []) if (!(key in value)) errors.push(`${path}.${key}: required`);
    for (const [key, dependencies] of Object.entries(schema.dependentRequired ?? {})) {
      if (key in value) for (const dependency of dependencies) if (!(dependency in value)) errors.push(`${path}.${dependency}: required by ${key}`);
    }
    const properties = schema.properties ?? {};
    if (schema.additionalProperties === false) for (const key of Object.keys(value)) if (!(key in properties)) errors.push(`${path}.${key}: additional property`);
    for (const [key, child] of Object.entries(properties)) if (key in value) errors.push(...validateSchema(value[key], child, `${path}.${key}`));
  } else if (schema.type === "array") {
    if (!Array.isArray(value)) return [`${path}: expected array`];
    if (schema.minItems !== undefined && value.length < schema.minItems) errors.push(`${path}: minItems`);
    if (schema.items) value.forEach((item, index) => errors.push(...validateSchema(item, schema.items!, `${path}[${index}]`)));
  } else if (schema.type === "string") {
    if (typeof value !== "string") return [`${path}: expected string`];
    if (schema.minLength !== undefined && value.length < schema.minLength) errors.push(`${path}: minLength`);
  } else if (schema.type === "boolean" && typeof value !== "boolean") errors.push(`${path}: expected boolean`);
  return errors;
}

const schema = systemDefinitionSchema as unknown as JsonSchema;

function baseDefinition() {
  return {
    definition: "SystemDefinition",
    analysisRef: "analysis:p13",
    recipeRef: "recipe:p13",
    entities: [{ id: "entity:ticket", name: "Ticket", requirementRefs: ["REQ-1"], fields: [{ name: "title", type: "string", required: true }] }],
    processes: [{ id: "process:ticket", name: "Ticket lifecycle", requirementRefs: ["REQ-2"], states: ["open", "closed"] }],
    actions: [{ id: "action:close-ticket", name: "Close ticket", requirementRefs: ["REQ-3"] }],
    capabilities: [], views: [], permissions: [], policies: [], integrations: [], environmentRequirements: [],
  };
}

test("legacy SystemDefinition remains valid without executable semantics", () => {
  assert.deepEqual(validateSchema(baseDefinition(), schema), []);
});

test("SystemDefinition accepts explicit initial state, action effects and workflow transitions", () => {
  const definition = baseDefinition() as Record<string, unknown>;
  definition.actions = [{ id: "action:close-ticket", name: "Close ticket", requirementRefs: ["REQ-3"], effect: { kind: "entity.update", entityRef: "entity:ticket" } }];
  definition.processes = [{ id: "process:ticket", name: "Ticket lifecycle", requirementRefs: ["REQ-2"], states: ["open", "closed"], initialState: "open", transitions: [{ id: "transition:close", from: "open", to: "closed", actionRef: "action:close-ticket" }] }];
  assert.deepEqual(validateSchema(definition, schema), []);
});

test("workflow transitions structurally require an explicit initial state", () => {
  const definition = baseDefinition() as Record<string, unknown>;
  definition.processes = [{ id: "process:ticket", name: "Ticket lifecycle", requirementRefs: ["REQ-2"], states: ["open", "closed"], transitions: [{ id: "transition:close", from: "open", to: "closed" }] }];
  assert.ok(validateSchema(definition, schema).some((error) => error.includes("initialState")));
});

test("executable semantics reject malformed, ambiguous and value-bearing declarations", () => {
  const malformed = baseDefinition() as Record<string, unknown>;
  malformed.actions = [{ id: "action:bad", name: "Bad", requirementRefs: ["REQ-3"], effect: { kind: "entity.update" } }];
  assert.ok(validateSchema(malformed, schema).some((error) => error.includes("entityRef")));
  const ambiguous = baseDefinition() as Record<string, unknown>;
  ambiguous.actions = [{ id: "action:bad", name: "Bad", requirementRefs: ["REQ-3"], effect: { kind: "entity.update", entityRef: "entity:ticket", handler: "guess-from-name" } }];
  assert.ok(validateSchema(ambiguous, schema).some((error) => error.includes("handler")));
  const leaking = baseDefinition() as Record<string, unknown>;
  leaking.processes = [{ id: "process:ticket", name: "Ticket lifecycle", requirementRefs: ["REQ-2"], states: ["open", "closed"], initialState: "open", transitions: [{ id: "transition:close", from: "open", to: "closed", value: "secret" }] }];
  assert.ok(validateSchema(leaking, schema).some((error) => error.includes("value")));
});