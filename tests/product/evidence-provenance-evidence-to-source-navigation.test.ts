import assert from "node:assert/strict";
import test from "node:test";
import { buildEvidenceNavigationIndex } from "../../packages/contracts/evidence-provenance/navigation-index.js";
import { querySourcesByEvidence } from "../../packages/contracts/evidence-provenance/evidence-to-source-navigation.js";
import type { EvidenceProvenanceExtension } from "../../packages/contracts/evidence-provenance/index.js";

const evidenceId = "urn:system-builder:evidence:reverse";

function provenance(): EvidenceProvenanceExtension {
  return {
    extensionVersion: "1.0.0",
    evidenceId,
    sources: [
      { sourceId: "urn:system-builder:source:zeta", sourceType: "document" },
      { sourceId: "urn:system-builder:source:alpha", sourceType: "ticket" },
    ],
    transformations: [],
    lineage: { predecessorEvidenceIds: [] },
  };
}

test("evidence navigation returns explicit source identities in canonical order", () => {
  const index = buildEvidenceNavigationIndex([provenance()]);

  assert.deepEqual(querySourcesByEvidence(index, evidenceId), {
    evidenceId,
    found: true,
    sourceIds: [
      "urn:system-builder:source:alpha",
      "urn:system-builder:source:zeta",
    ],
  });
});

test("evidence navigation returns explicit empty result for absent evidence", () => {
  const index = buildEvidenceNavigationIndex([provenance()]);
  const missing = "urn:system-builder:evidence:missing";

  assert.deepEqual(querySourcesByEvidence(index, missing), {
    evidenceId: missing,
    found: false,
    sourceIds: [],
  });
});

test("evidence navigation never infers source identities from lineage or metadata", () => {
  const record: EvidenceProvenanceExtension = {
    extensionVersion: "1.0.0",
    evidenceId: "urn:system-builder:evidence:no-sources",
    sources: [],
    transformations: [{
      descriptorId: "transform.example",
      descriptorVersion: "1.0.0",
      provider: { id: "provider-x" },
    }],
    lineage: { predecessorEvidenceIds: ["urn:system-builder:evidence:parent"] },
  };
  const index = buildEvidenceNavigationIndex([record]);

  assert.deepEqual(querySourcesByEvidence(index, record.evidenceId), {
    evidenceId: record.evidenceId,
    found: true,
    sourceIds: [],
  });
});

test("evidence navigation rejects malformed evidence identifiers", () => {
  const index = buildEvidenceNavigationIndex([]);
  assert.throws(() => querySourcesByEvidence(index, "not a uri"), /malformed evidenceId/);
});
