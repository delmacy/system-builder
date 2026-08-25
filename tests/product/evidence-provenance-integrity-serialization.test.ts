import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeEvidenceProvenanceExtension,
  type EvidenceProvenanceExtension,
} from "../../packages/contracts/evidence-provenance/index.js";
import { computeEvidenceProvenanceIntegrity } from "../../packages/contracts/evidence-provenance/integrity-digest.js";
import { verifyEvidenceProvenanceIntegrity } from "../../packages/contracts/evidence-provenance/integrity-verify.js";

function roundTrip(value: unknown): unknown {
  return JSON.parse(JSON.stringify(value)) as unknown;
}

function evidence(): EvidenceProvenanceExtension {
  return normalizeEvidenceProvenanceExtension({
    extensionVersion: "1.0.0",
    evidenceId: "urn:system-builder:evidence:serialization",
    sources: [
      {
        sourceId: "urn:system-builder:source:z",
        sourceType: "document",
        capturedAt: "2026-08-25T11:00:00Z",
        authorRef: "operator:42",
      },
      {
        sourceId: "urn:system-builder:source:a",
        sourceType: "api",
        correlationRef: "urn:system-builder:correlation:serialization",
      },
    ],
    classification: { label: "derived", confidence: 0.75 },
    transformations: [
      {
        descriptorId: "normalize",
        descriptorVersion: "1.0.0",
        tool: { id: "system-builder", version: "14.3" },
      },
      {
        descriptorId: "derive",
        descriptorVersion: "1.1.0",
      },
    ],
    lineage: {
      predecessorEvidenceIds: [
        "urn:system-builder:evidence:predecessor:z",
        "urn:system-builder:evidence:predecessor:a",
      ],
    },
  });
}

test("provenance integrity survives canonical JSON round-trip without semantic drift", () => {
  const normalized = evidence();
  const integrity = computeEvidenceProvenanceIntegrity(normalized);
  const withIntegrity = normalizeEvidenceProvenanceExtension({ ...normalized, integrity });
  const before = verifyEvidenceProvenanceIntegrity(withIntegrity);

  const serialized = JSON.stringify(withIntegrity);
  const restored = normalizeEvidenceProvenanceExtension(roundTrip(withIntegrity));
  const after = verifyEvidenceProvenanceIntegrity(restored);

  assert.equal(before.status, "verified");
  assert.deepEqual(after, before);
  assert.deepEqual(restored, withIntegrity);
  assert.deepEqual(restored.integrity, integrity);
  assert.equal(JSON.stringify(restored), serialized);
  assert.equal(serialized.includes("provider"), false);
  assert.equal(serialized.includes("authorized"), false);
  assert.equal(serialized.includes("authority"), false);
});

test("integrity absence remains backward compatible across JSON round-trip", () => {
  const normalized = evidence();
  const restored = normalizeEvidenceProvenanceExtension(roundTrip(normalized));

  assert.equal(restored.integrity, undefined);
  assert.deepEqual(restored, normalized);
  assert.deepEqual(verifyEvidenceProvenanceIntegrity(restored), { status: "absent" });
  assert.equal(JSON.stringify(restored).includes("integrity"), false);
  assert.equal(JSON.stringify(restored).includes("provider"), false);
});
