import assert from "node:assert/strict";
import test from "node:test";
import { parseRuntimeEntityRoute, renderRuntimeEntityApiSupport } from "../../packages/runtime-core/entity-api.js";

test("entity API route derives deterministic entity and record identity from generated resource path", () => {
  assert.deepEqual(parseRuntimeEntityRoute("/entities/entity%3Aticket/ticket-1"), { entityId: "entity:ticket", recordId: "ticket-1" });
  assert.deepEqual(parseRuntimeEntityRoute("/entities/entity%3Aticket/ticket-1?x=1"), { entityId: "entity:ticket", recordId: "ticket-1" });
  assert.equal(parseRuntimeEntityRoute("/entities/entity%3Aticket"), undefined);
  assert.equal(parseRuntimeEntityRoute("/actions/action%3Aclose"), undefined);
});

test("rendered entity API exposes bounded CRUD methods and explicit negative diagnostics", () => {
  const source = renderRuntimeEntityApiSupport();
  assert.match(source, /runtimeHandleEntityRequest/);
  assert.match(source, /RUNTIME_ENTITY_UNKNOWN/);
  assert.match(source, /RUNTIME_ENTITY_METHOD_NOT_ALLOWED/);
  assert.match(source, /RUNTIME_INVALID_JSON_BODY/);
  assert.match(source, /runtimeEntityCreate/);
  assert.match(source, /runtimeEntityRead/);
  assert.match(source, /runtimeEntityUpdate/);
  assert.match(source, /runtimeEntityDelete/);
  assert.equal(source.includes("auth"), false);
  assert.equal(source.includes("SYSTEM_BUILDER_URL"), false);
});
