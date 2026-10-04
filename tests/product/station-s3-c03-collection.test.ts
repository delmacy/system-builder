import assert from "node:assert/strict";
import test from "node:test";
import {
  createStationCollection,
  projectVisualOrder,
  reorderCollectionSemantics,
} from "../../packages/station-composition/collection.js";

test("C3 collection keeps keyed topology and visual order separate from semantic order", () => {
  const collection = createStationCollection([
    { key: "ticket-a" },
    { key: "ticket-b", parentKey: "ticket-a" },
    { key: "ticket-c", parentKey: "ticket-a" },
  ]);
  const visual = projectVisualOrder(collection, ["ticket-c", "ticket-a", "ticket-b"]);
  assert.equal(visual.ok, true);
  assert.deepEqual(collection.semanticOrder, ["ticket-a", "ticket-b", "ticket-c"]);
  assert.deepEqual(collection.members, [
    { key: "ticket-a" },
    { key: "ticket-b", parentKey: "ticket-a" },
    { key: "ticket-c", parentKey: "ticket-a" },
  ]);
});

test("C3 semantic reorder is deterministic, revisioned, and preserves keyed topology", () => {
  const collection = createStationCollection([{ key: "a" }, { key: "b", parentKey: "a" }, { key: "c" }]);
  const result = reorderCollectionSemantics(collection, 0, ["c", "a", "b"]);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.changed, true);
  assert.equal(result.collection.revision, 1);
  assert.deepEqual(result.collection.semanticOrder, ["c", "a", "b"]);
  assert.deepEqual(result.collection.members, collection.members);
});

test("C3 invalid and stale order references fail closed with zero canonical mutation", () => {
  const collection = createStationCollection([{ key: "a" }, { key: "b" }, { key: "c" }]);
  const before = JSON.stringify(collection);
  for (const result of [
    reorderCollectionSemantics(collection, 1, ["c", "b", "a"]),
    reorderCollectionSemantics(collection, 0, ["a", "a", "c"]),
    reorderCollectionSemantics(collection, 0, ["a", "b", "unknown"]),
    reorderCollectionSemantics(collection, 0, ["a", "b"]),
  ]) assert.equal(result.ok, false);
  assert.equal(JSON.stringify(collection), before);
});

test("C3 rejects malformed or ambiguous collection topology before state exists", () => {
  assert.throws(() => createStationCollection([{ key: "a" }, { key: "a" }]));
  assert.throws(() => createStationCollection([{ key: "a", parentKey: "missing" }]));
  assert.throws(() => createStationCollection([{ key: "a", parentKey: "a" }]));
  assert.throws(() => createStationCollection([{ key: "" }]));
});
