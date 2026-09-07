import assert from "node:assert/strict";
import test from "node:test";
import { normalizeTypedSemanticGraph } from "../../packages/contracts/semantic-substrate/index.js";

const revision = (semanticOwner: string, semanticKind: string, canonicalRef: string, revisionRef: string) => ({
  contractVersion: "1.0.0",
  semanticOwner,
  semanticKind,
  canonicalRef,
  definitionRef: `${canonicalRef}:definition`,
  revisionOwner: semanticOwner,
  revisionDimension: "definition",
  revisionRef,
});

const workforce = revision("workforce", "person", "person:alice", "w-3");
const scheduling = revision("scheduling", "shift", "shift:night", "s-9");

const graph = (relations: unknown[]) => ({
  contractVersion: "1.0.0",
  nodes: [
    { ref: scheduling, metadata: { label: "Night shift" } },
    { ref: workforce, metadata: { label: "Alice" } },
  ],
  relations,
});

test("typed semantic graph preserves foreign owner/kind/revision and normalizes deterministically", () => {
  const normalized = normalizeTypedSemanticGraph(graph([
    { relationKind: "references", source: scheduling, target: workforce, metadata: { note: "assigned person", sourceSystem: "scheduler" } },
  ]));
  assert.equal(normalized.nodes[0]?.ref.semanticOwner, "scheduling");
  assert.equal(normalized.nodes[1]?.ref.semanticOwner, "workforce");
  assert.equal(normalized.relations[0]?.source.revisionRef, "s-9");
  assert.equal(normalized.relations[0]?.target.revisionRef, "w-3");
  assert.deepEqual(Object.keys(normalized.relations[0]?.metadata ?? {}), ["note", "sourceSystem"]);
  assert.ok(Object.isFrozen(normalized));
  assert.ok(Object.isFrozen(normalized.nodes));
  assert.ok(Object.isFrozen(normalized.relations));
});

test("typed semantic graph fails closed on owner, kind or revision endpoint drift", () => {
  for (const target of [
    { ...workforce, semanticOwner: "scheduling" },
    { ...workforce, semanticKind: "shift" },
    { ...workforce, revisionRef: "w-4" },
  ]) {
    assert.throws(
      () => normalizeTypedSemanticGraph(graph([{ relationKind: "references", source: scheduling, target, metadata: {} }])),
      /does not exactly match a graph node revision/,
    );
  }
});

test("typed semantic graph rejects unknown relation kinds and ambiguous duplicate edges", () => {
  assert.throws(
    () => normalizeTypedSemanticGraph(graph([{ relationKind: "generic_link", source: scheduling, target: workforce, metadata: {} }])),
    /unknown semantic relation kind/,
  );
  const relation = { relationKind: "references", source: scheduling, target: workforce, metadata: {} };
  assert.throws(() => normalizeTypedSemanticGraph(graph([relation, relation])), /duplicate ambiguous relation/);
});

test("metadata cannot erase or redefine semantic ownership, kind, relation or lifecycle", () => {
  for (const metadata of [
    { semanticOwner: "universal" },
    { semanticKind: "generic" },
    { relationKind: "generic_link" },
    { predicate: "is-current" },
    { lifecycle: "approved" },
  ]) {
    assert.throws(
      () => normalizeTypedSemanticGraph(graph([{ relationKind: "references", source: scheduling, target: workforce, metadata }])),
      /cannot redefine semantic field/,
    );
  }
});
