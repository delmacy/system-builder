import assert from "node:assert/strict";
import test from "node:test";
import {
  SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  normalizeDefinitionRevisionRef,
  normalizeRevisionLineage,
  normalizeRevisionVector,
} from "../../packages/contracts/semantic-substrate/index.js";

const definition = {
  contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  semanticOwner: "capability:orders",
  semanticKind: "process",
  canonicalRef: "orders.fulfillment",
  definitionRef: "orders.fulfillment@definition-1",
} as const;

test("revision vectors are sparse, immutable and deterministically ordered", () => {
  const vector = normalizeRevisionVector([
    { revisionOwner: "team-b", revisionDimension: "policy", revisionRef: "1" },
    { revisionOwner: "team-a", revisionDimension: "schema", revisionRef: "1" },
  ]);
  assert.deepEqual(vector, [
    { revisionOwner: "team-a", revisionDimension: "schema", revisionRef: "1" },
    { revisionOwner: "team-b", revisionDimension: "policy", revisionRef: "1" },
  ]);
  assert.ok(Object.isFrozen(vector));
  assert.ok(vector.every(Object.isFrozen));
});

test("duplicate revision dimensions fail closed while equal values under distinct coordinates remain distinct", () => {
  assert.throws(() => normalizeRevisionVector([
    { revisionOwner: "team-a", revisionDimension: "schema", revisionRef: "1" },
    { revisionOwner: "team-a", revisionDimension: "schema", revisionRef: "2" },
  ]), /duplicate revision dimension/);

  assert.deepEqual(normalizeRevisionVector([
    { revisionOwner: "team-a", revisionDimension: "schema", revisionRef: "1" },
    { revisionOwner: "team-b", revisionDimension: "schema", revisionRef: "1" },
  ]).length, 2);
});

test("definition revision remains distinct and lineage preserves predecessor history", () => {
  const predecessor = normalizeDefinitionRevisionRef({
    ...definition,
    revisionOwner: "team-a",
    revisionDimension: "schema",
    revisionRef: "1",
  });
  const successor = normalizeDefinitionRevisionRef({
    ...definition,
    revisionOwner: "team-a",
    revisionDimension: "schema",
    revisionRef: "2",
  });
  const lineage = normalizeRevisionLineage({ relation: "corrects", predecessor, successor });

  assert.equal(lineage.predecessor.revisionRef, "1");
  assert.equal(lineage.successor.revisionRef, "2");
  assert.ok(Object.isFrozen(lineage.predecessor));
  assert.ok(Object.isFrozen(lineage.successor));
  assert.throws(() => normalizeRevisionLineage({ relation: "supersedes", predecessor, successor: predecessor }), /successor must differ/);
});
