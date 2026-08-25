import assert from "node:assert/strict";
import test from "node:test";
import { buildEvidenceNavigationIndex } from "../../packages/contracts/evidence-provenance/navigation-index.js";
import type { EvidenceProvenanceExtension } from "../../packages/contracts/evidence-provenance/index.js";
import { validEvidenceProvenanceFixtures } from "./fixtures/evidence-provenance.js";

test("provenance navigation index is deterministic across input ordering", () => {
  const forward = buildEvidenceNavigationIndex(validEvidenceProvenanceFixtures);
  const reversed = buildEvidenceNavigationIndex([...validEvidenceProvenanceFixtures].reverse());

  assert.deepEqual(reversed, forward);
  assert.deepEqual(forward, {
    projections: [
      {
        evidenceId: "urn:system-builder:evidence:alpha",
        sourceIds: [],
        predecessorEvidenceIds: [],
      },
      {
        evidenceId: "urn:system-builder:evidence:beta",
        sourceIds: ["urn:system-builder:source:ticket-42"],
        predecessorEvidenceIds: ["urn:system-builder:evidence:alpha"],
      },
    ],
    sources: [
      {
        sourceId: "urn:system-builder:source:ticket-42",
        evidenceIds: ["urn:system-builder:evidence:beta"],
      },
    ],
  });
});

test("provenance navigation index rejects duplicate evidence identity", () => {
  const duplicate = validEvidenceProvenanceFixtures[0];
  assert.ok(duplicate);
  assert.throws(
    () => buildEvidenceNavigationIndex([duplicate, duplicate]),
    /duplicate evidenceId urn:system-builder:evidence:alpha/,
  );
});

test("provenance navigation index rejects conflicting explicit relations for one evidence identity", () => {
  const base = validEvidenceProvenanceFixtures[0];
  assert.ok(base);
  const conflict: EvidenceProvenanceExtension = {
    ...base,
    sources: [{ sourceId: "urn:system-builder:source:other", sourceType: "ticket" }],
  };

  assert.throws(
    () => buildEvidenceNavigationIndex([base, conflict]),
    /duplicate evidenceId urn:system-builder:evidence:alpha/,
  );
});

test("provenance navigation index uses only explicit portable identifiers", () => {
  const provenance: EvidenceProvenanceExtension = {
    extensionVersion: "1.0.0",
    evidenceId: "urn:system-builder:evidence:portable",
    sources: [{
      sourceId: "urn:system-builder:source:explicit",
      sourceType: "document",
      locationHint: "s3://bucket/object",
    }],
    transformations: [{
      descriptorId: "extract.document",
      descriptorVersion: "1.0.0",
      provider: { id: "provider-x" },
    }],
    lineage: { predecessorEvidenceIds: [] },
  };

  const index = buildEvidenceNavigationIndex([provenance]);
  const serialized = JSON.stringify(index);

  assert.deepEqual(index.sources, [{
    sourceId: "urn:system-builder:source:explicit",
    evidenceIds: ["urn:system-builder:evidence:portable"],
  }]);
  assert.equal(serialized.includes("s3://bucket/object"), false);
  assert.equal(serialized.includes("provider-x"), false);
  assert.equal(serialized.includes("secret"), false);
});
