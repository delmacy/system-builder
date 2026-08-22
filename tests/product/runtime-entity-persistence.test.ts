import assert from "node:assert/strict";
import test from "node:test";
import { renderRuntimeEntityPersistenceSupport, validateRuntimeEntityPayload } from "../../packages/runtime-core/entity-persistence.js";

const entity = {
  id: "entity:ticket",
  table: "sb_entity_0123456789abcdef",
  fields: [
    { name: "title", type: "string", required: true },
    { name: "priority", type: "number", required: false },
    { name: "closed", type: "boolean", required: false },
  ],
} as const;

test("generated entity persistence validates declared fields and types fail closed", () => {
  assert.deepEqual(validateRuntimeEntityPayload(entity, { title: "A", priority: 2 }), { ok: true, value: { title: "A", priority: 2 } });
  assert.deepEqual(validateRuntimeEntityPayload(entity, { priority: 2 }), { ok: false, code: "RUNTIME_ENTITY_REQUIRED_FIELD_MISSING", detail: "entity:ticket:title" });
  assert.deepEqual(validateRuntimeEntityPayload(entity, { title: "A", other: true }), { ok: false, code: "RUNTIME_ENTITY_UNKNOWN_FIELD", detail: "entity:ticket:other" });
  assert.deepEqual(validateRuntimeEntityPayload(entity, { title: 9 }), { ok: false, code: "RUNTIME_ENTITY_INVALID_FIELD_TYPE", detail: "entity:ticket:title:string" });
  assert.deepEqual(validateRuntimeEntityPayload(entity, { priority: 3 }, true), { ok: true, value: { priority: 3 } });
});

test("rendered persistence uses generated tables, PostgreSQL query support and no Builder dependency", () => {
  const source = renderRuntimeEntityPersistenceSupport();
  assert.match(source, /postgresSimpleQuery/);
  assert.match(source, /runtimeEntityCreate/);
  assert.match(source, /runtimeEntityRead/);
  assert.match(source, /runtimeEntityUpdate/);
  assert.match(source, /runtimeEntityDelete/);
  assert.equal(source.includes("SYSTEM_BUILDER_URL"), false);
  assert.equal(source.includes("DATABASE_URL="), false);
});
