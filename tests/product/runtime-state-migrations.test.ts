import assert from "node:assert/strict";
import test from "node:test";
import { normalizeRuntimeStateRequirement } from "../../packages/runtime-core/index.js";
import type { RuntimeStateRequirement } from "../../packages/runtime-core/index.js";

function requirement(): RuntimeStateRequirement {
  return {
    kind: "RuntimeStateRequirement",
    capability: "state.counter",
    storeKind: "sql",
    connectionBinding: { name: "DATABASE_URL", kind: "secret-reference" },
    migrations: [
      {
        id: "counter-v2",
        capability: "state.counter",
        order: 20,
        path: "migrations/002-counter-index.sql",
        content: "CREATE INDEX counter_value_idx ON runtime_counter (value);",
      },
      {
        id: "counter-v1",
        capability: "state.counter",
        order: 10,
        path: "migrations/001-counter.sql",
        content: "CREATE TABLE runtime_counter (id INTEGER PRIMARY KEY, value INTEGER NOT NULL);",
      },
    ],
  };
}

test("runtime state requirement normalizes migration order without carrying connection references or values", () => {
  const input = requirement();
  const normalized = normalizeRuntimeStateRequirement(input);
  const reordered = normalizeRuntimeStateRequirement({ ...input, migrations: [...input.migrations].reverse() });

  assert.deepEqual(normalized, reordered);
  assert.deepEqual(normalized.connectionBinding, { name: "DATABASE_URL", kind: "secret-reference" });
  assert.deepEqual(normalized.migrations.map((migration) => migration.id), ["counter-v1", "counter-v2"]);
  assert.equal(normalized.migrations[0]?.content, input.migrations[1]?.content);
  assert.equal(Object.isFrozen(normalized), true);
  assert.equal(Object.isFrozen(normalized.connectionBinding), true);
  assert.equal(Object.isFrozen(normalized.migrations), true);
  assert.equal(Object.isFrozen(normalized.migrations[0]), true);
});

test("runtime state requirement rejects inline or durable connection material", () => {
  const input = requirement();
  assert.throws(
    () => normalizeRuntimeStateRequirement({
      ...input,
      connectionBinding: { name: "DATABASE_URL", kind: "secret-reference", value: "postgres://secret" },
    } as unknown as RuntimeStateRequirement),
    /RUNTIME_STATE_INLINE_VALUE_NOT_ALLOWED/,
  );
  assert.throws(
    () => normalizeRuntimeStateRequirement({
      ...input,
      connectionBinding: { name: "DATABASE_URL", kind: "secret-reference", reference: "secret://db" },
    } as unknown as RuntimeStateRequirement),
    /RUNTIME_STATE_REFERENCE_NOT_ALLOWED/,
  );
});

test("runtime state requirement rejects unsafe paths, invalid order and capability mismatch", () => {
  const input = requirement();
  assert.throws(
    () => normalizeRuntimeStateRequirement({
      ...input,
      migrations: [{ ...input.migrations[0]!, path: "migrations/../escape.sql" }],
    }),
    /RUNTIME_MIGRATION_INVALID_PATH/,
  );
  assert.throws(
    () => normalizeRuntimeStateRequirement({
      ...input,
      migrations: [{ ...input.migrations[0]!, order: 0 }],
    }),
    /RUNTIME_MIGRATION_INVALID_ORDER/,
  );
  assert.throws(
    () => normalizeRuntimeStateRequirement({
      ...input,
      migrations: [{ ...input.migrations[0]!, capability: "other.capability" }],
    }),
    /RUNTIME_MIGRATION_CAPABILITY_MISMATCH/,
  );
});

test("runtime state requirement rejects duplicate ids, orders and paths", () => {
  const input = requirement();
  const [first, second] = input.migrations;
  assert.ok(first && second);
  assert.throws(
    () => normalizeRuntimeStateRequirement({ ...input, migrations: [first, { ...second, id: first.id }] }),
    /RUNTIME_MIGRATION_DUPLICATE_ID/,
  );
  assert.throws(
    () => normalizeRuntimeStateRequirement({ ...input, migrations: [first, { ...second, order: first.order }] }),
    /RUNTIME_MIGRATION_DUPLICATE_ORDER/,
  );
  assert.throws(
    () => normalizeRuntimeStateRequirement({ ...input, migrations: [first, { ...second, path: first.path }] }),
    /RUNTIME_MIGRATION_DUPLICATE_PATH/,
  );
});
