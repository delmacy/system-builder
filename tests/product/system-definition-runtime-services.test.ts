import assert from "node:assert/strict";
import test from "node:test";
import { systemDefinitionSchema } from "../../packages/contracts/system-definition/index.js";

type JsonSchema = Readonly<{
  type?: "object" | "array" | "string" | "boolean" | "integer";
  const?: unknown;
  enum?: readonly unknown[];
  additionalProperties?: boolean;
  required?: readonly string[];
  properties?: Readonly<Record<string, JsonSchema>>;
  items?: JsonSchema;
  minLength?: number;
  minItems?: number;
  minimum?: number;
  pattern?: string;
  uniqueItems?: boolean;
}>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validate(value: unknown, schema: JsonSchema, path = "$"): readonly string[] {
  const errors: string[] = [];
  if (schema.const !== undefined && value !== schema.const) return [`${path}: expected const`];
  if (schema.enum !== undefined && !schema.enum.includes(value)) return [`${path}: expected enum`];
  if (schema.type === "object") {
    if (!isRecord(value)) return [`${path}: expected object`];
    for (const key of schema.required ?? []) if (!(key in value)) errors.push(`${path}.${key}: required`);
    const properties = schema.properties ?? {};
    if (schema.additionalProperties === false) for (const key of Object.keys(value)) if (!(key in properties)) errors.push(`${path}.${key}: additional property`);
    for (const [key, child] of Object.entries(properties)) if (key in value) errors.push(...validate(value[key], child, `${path}.${key}`));
  } else if (schema.type === "array") {
    if (!Array.isArray(value)) return [`${path}: expected array`];
    if (schema.minItems !== undefined && value.length < schema.minItems) errors.push(`${path}: minItems`);
    if (schema.uniqueItems && new Set(value.map((item) => JSON.stringify(item))).size !== value.length) errors.push(`${path}: uniqueItems`);
    if (schema.items) value.forEach((item, index) => errors.push(...validate(item, schema.items!, `${path}[${index}]`)));
  } else if (schema.type === "string") {
    if (typeof value !== "string") return [`${path}: expected string`];
    if (schema.minLength !== undefined && value.length < schema.minLength) errors.push(`${path}: minLength`);
    if (schema.pattern !== undefined && !new RegExp(schema.pattern).test(value)) errors.push(`${path}: pattern`);
  } else if (schema.type === "boolean" && typeof value !== "boolean") errors.push(`${path}: expected boolean`);
  else if (schema.type === "integer") {
    if (typeof value !== "number" || !Number.isInteger(value)) return [`${path}: expected integer`];
    if (schema.minimum !== undefined && value < schema.minimum) errors.push(`${path}: minimum`);
  }
  return errors;
}

function baseDefinition() {
  return {
    definition: "SystemDefinition",
    analysisRef: "analysis:p13",
    recipeRef: "recipe:p13",
    entities: [{ id: "entity:ticket", name: "Ticket", requirementRefs: ["REQ-1"], fields: [{ name: "title", type: "string" }] }],
    processes: [{ id: "process:ticket", name: "Ticket", requirementRefs: ["REQ-2"], states: ["open", "closed"] }],
    actions: [{ id: "action:close", name: "Close", requirementRefs: ["REQ-3"], effect: { kind: "entity.update", entityRef: "entity:ticket" } }],
    capabilities: [], views: [], permissions: [], policies: [], integrations: [],
    environmentRequirements: [
      { name: "storage:files", kind: "storage", required: true },
      { name: "service:notify", kind: "external-service", required: true },
    ],
  };
}

test("SystemDefinition keeps historical definitions valid when Runtime service descriptors are absent", () => {
  assert.deepEqual(validate(baseDefinition(), systemDefinitionSchema as JsonSchema), []);
});

test("SystemDefinition accepts explicit bounded job event file and HTTP integration descriptors", () => {
  const definition = baseDefinition();
  const value = {
    ...definition,
    jobs: [{ id: "job:close", name: "Close periodically", requirementRefs: ["REQ-4"], trigger: { kind: "interval", intervalMs: 1000 }, actionRef: "action:close", recordId: "ticket-1" }],
    events: [{ id: "event:close", name: "Close event", requirementRefs: ["REQ-5"], source: { kind: "runtime-http" }, actionRef: "action:close" }],
    files: [{ id: "files:attachments", name: "Attachments", requirementRefs: ["REQ-6"], bindingRef: "storage:files", operations: ["put", "get", "delete"] }],
    integrations: [{ id: "integration:notify", contract: "notify-v1", direction: "outbound", requirementRefs: ["REQ-7"], invocation: { kind: "http", method: "POST", path: "/notify", bindingRef: "service:notify" } }],
  };
  assert.deepEqual(validate(value, systemDefinitionSchema as JsonSchema), []);
});

test("Runtime service descriptors reject malformed and value-bearing declarations", () => {
  const malformedJob = { ...baseDefinition(), jobs: [{ id: "job:bad", name: "Bad", requirementRefs: ["REQ-4"], trigger: { kind: "interval", intervalMs: 0 }, actionRef: "action:close", recordId: "ticket-1" }] };
  assert.ok(validate(malformedJob, systemDefinitionSchema as JsonSchema).some((error) => error.includes("minimum")));

  const malformedEvent = { ...baseDefinition(), events: [{ id: "event:bad", name: "Bad", requirementRefs: ["REQ-5"], source: { kind: "broker" }, actionRef: "action:close" }] };
  assert.ok(validate(malformedEvent, systemDefinitionSchema as JsonSchema).some((error) => error.includes("const")));

  const leakingFile = { ...baseDefinition(), files: [{ id: "files:bad", name: "Bad", requirementRefs: ["REQ-6"], bindingRef: "storage:files", operations: ["put"], root: "/resolved/private" }] };
  assert.ok(validate(leakingFile, systemDefinitionSchema as JsonSchema).some((error) => error.includes("root")));

  const leakingIntegration = { ...baseDefinition(), integrations: [{ id: "integration:bad", contract: "v1", direction: "outbound", requirementRefs: ["REQ-7"], invocation: { kind: "http", method: "POST", path: "https://resolved.example/notify", bindingRef: "service:notify", token: "secret" } }] };
  const integrationErrors = validate(leakingIntegration, systemDefinitionSchema as JsonSchema);
  assert.ok(integrationErrors.some((error) => error.includes("token")));
  assert.ok(integrationErrors.some((error) => error.includes("pattern")));
});
