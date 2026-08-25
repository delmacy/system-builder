import assert from "node:assert/strict";
import test from "node:test";
import { buildEvidenceNavigationIndex } from "../../packages/contracts/evidence-provenance/navigation-index.js";
import { queryEvidenceBySource } from "../../packages/contracts/evidence-provenance/source-to-evidence-navigation.js";
import type { EvidenceProvenanceExtension } from "../../packages/contracts/evidence-provenance/index.js";

const sourceId = "urn:system-builder:source:shared";

function provenance(evidenceId: string): EvidenceProvenanceExtension {
  return {
    extensionVersion: "1.0.0",
    evidenceId,
    sources: [{ sourceId, sourceType: "ticket" }],
    transformations: [],
    lineage: { predecessorEvidenceIds: [] },
  };
}

test("source navigation returns canonically ordered matching evidence identities", () => {
  const index = buildEvidenceNavigationIndex([
    provenance("urn:system-builder:evidence:zeta"),
    provenance("urn:system-builder:evidence:alpha"),
  ]);

  assert.deepEqual(queryEvidenceBySource(index, sourceId), {
    sourceId,
    found: true,
    evidenceIds: [
      "urn:system-builder:evidence:alpha",
      "urn:system-builder:evidence:zeta",
    ],
  });
});

test("source navigation is independent of provenance input order", () => {
  const left = buildEvidenceNavigationIndex([
    provenance("urn:system-builder:evidence:zeta"),
    provenance("urn:system-builder:evidence:alpha"),
  ]);
  const right = buildEvidenceNavigationIndex([
    provenance("urn:system-builder:evidence:alpha"),
    provenance("urn:system-builder:evidence:zeta"),
  ]);

  assert.deepEqual(queryEvidenceBySource(left, sourceId), queryEvidenceBySource(right, sourceId));
});

test("source navigation returns explicit empty result for absent source", () => {
  const index = buildEvidenceNavigationIndex([provenance("urn:system-builder:evidence:alpha")]);
  const missing = "urn:system-builder:source:missing";

  assert.deepEqual(queryEvidenceBySource(index, missing), {
    sourceId: missing,
    found: false,
    evidenceIds: [],
  });
});

test("source navigation rejects malformed source identifiers without lookup inference", () => {
  const index = buildEvidenceNavigationIndex([]);
  assert.throws(() => queryEvidenceBySource(index, "not a uri"), /malformed sourceId/);
});
