import assert from "node:assert/strict";
import test from "node:test";
import type { EvidenceNavigationIndex } from "../../packages/contracts/evidence-provenance/navigation-index.js";
import { queryEvidenceBySource } from "../../packages/contracts/evidence-provenance/source-to-evidence-navigation.js";
import { querySourcesByEvidence } from "../../packages/contracts/evidence-provenance/evidence-to-source-navigation.js";

const sourceId = "urn:system-builder:source:shared";
const evidenceA = "urn:system-builder:evidence:a";
const evidenceB = "urn:system-builder:evidence:b";

function validOneToManyIndex(): EvidenceNavigationIndex {
  return {
    projections: [
      { evidenceId: evidenceB, sourceIds: [sourceId], predecessorEvidenceIds: [] },
      { evidenceId: evidenceA, sourceIds: [sourceId], predecessorEvidenceIds: [] },
    ],
    sources: [{ sourceId, evidenceIds: [evidenceB, evidenceA] }],
  };
}

test("navigation preserves valid one-to-many relations with canonical query results", () => {
  const index = validOneToManyIndex();
  assert.deepEqual(queryEvidenceBySource(index, sourceId), {
    sourceId,
    found: true,
    evidenceIds: [evidenceA, evidenceB],
  });
  assert.deepEqual(querySourcesByEvidence(index, evidenceA), {
    evidenceId: evidenceA,
    found: true,
    sourceIds: [sourceId],
  });
});

test("navigation fails closed on duplicate evidence identity", () => {
  const index: EvidenceNavigationIndex = {
    projections: [
      { evidenceId: evidenceA, sourceIds: [], predecessorEvidenceIds: [] },
      { evidenceId: evidenceA, sourceIds: [sourceId], predecessorEvidenceIds: [] },
    ],
    sources: [{ sourceId, evidenceIds: [evidenceA] }],
  };

  assert.throws(() => querySourcesByEvidence(index, evidenceA), /duplicate evidenceId/);
});

test("navigation fails closed on duplicate source identity", () => {
  const index: EvidenceNavigationIndex = {
    projections: [{ evidenceId: evidenceA, sourceIds: [sourceId], predecessorEvidenceIds: [] }],
    sources: [
      { sourceId, evidenceIds: [evidenceA] },
      { sourceId, evidenceIds: [evidenceA] },
    ],
  };

  assert.throws(() => queryEvidenceBySource(index, sourceId), /duplicate sourceId/);
});

test("navigation fails closed on conflicting bidirectional explicit relation", () => {
  const index: EvidenceNavigationIndex = {
    projections: [{ evidenceId: evidenceA, sourceIds: [sourceId], predecessorEvidenceIds: [] }],
    sources: [{ sourceId, evidenceIds: [evidenceB] }],
  };

  assert.throws(() => queryEvidenceBySource(index, sourceId), /conflicting explicit relation/);
});

test("missing navigation remains explicit and never fabricates data", () => {
  const index: EvidenceNavigationIndex = { projections: [], sources: [] };
  assert.deepEqual(queryEvidenceBySource(index, sourceId), { sourceId, found: false, evidenceIds: [] });
  assert.deepEqual(querySourcesByEvidence(index, evidenceA), { evidenceId: evidenceA, found: false, sourceIds: [] });
});
