import assert from "node:assert/strict";
import test from "node:test";
import {
  canonicalEvidenceProvenanceIntegrityInput,
  projectEvidenceProvenanceIntegrityInput,
} from "../../packages/contracts/evidence-provenance/integrity-canonicalization.js";

function evidence(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    extensionVersion: "1.0.0",
    evidenceId: "urn:system-builder:evidence:canonical",
    sources: [
      { sourceId: "urn:source:b", sourceType: "document" },
      { sourceId: "urn:source:a", sourceType: "event" },
    ],
    classification: { label: "verified", confidence: 0.75 },
    transformations: [
      { descriptorId: "capture", descriptorVersion: "1.0.0" },
      { descriptorId: "normalize", descriptorVersion: "1.0.0" },
    ],
    lineage: {
      predecessorEvidenceIds: ["urn:evidence:b", "urn:evidence:a"],
    },
    ...overrides,
  };
}

test("equivalent provenance input canonicalizes identically regardless of insertion and set-like order", () => {
  const left = evidence();
  const right = {
    lineage: { predecessorEvidenceIds: ["urn:evidence:a", "urn:evidence:b"] },
    transformations: [
      { descriptorVersion: "1.0.0", descriptorId: "capture" },
      { descriptorVersion: "1.0.0", descriptorId: "normalize" },
    ],
    classification: { confidence: 0.75, label: "verified" },
    sources: [
      { sourceType: "event", sourceId: "urn:source:a" },
      { sourceType: "document", sourceId: "urn:source:b" },
    ],
    evidenceId: "urn:system-builder:evidence:canonical",
    extensionVersion: "1.0.0",
  };

  assert.equal(
    canonicalEvidenceProvenanceIntegrityInput(left),
    canonicalEvidenceProvenanceIntegrityInput(right),
  );
});

test("meaningful provenance changes alter the canonical integrity input", () => {
  const baseline = canonicalEvidenceProvenanceIntegrityInput(evidence());
  const changed = canonicalEvidenceProvenanceIntegrityInput(
    evidence({ evidenceId: "urn:system-builder:evidence:changed" }),
  );
  assert.notEqual(changed, baseline);

  const reorderedTransformation = canonicalEvidenceProvenanceIntegrityInput(
    evidence({
      transformations: [
        { descriptorId: "normalize", descriptorVersion: "1.0.0" },
        { descriptorId: "capture", descriptorVersion: "1.0.0" },
      ],
    }),
  );
  assert.notEqual(reorderedTransformation, baseline);
});

test("integrity descriptor is excluded from its own canonical input", () => {
  const baseline = canonicalEvidenceProvenanceIntegrityInput(evidence());
  const withIntegrity = canonicalEvidenceProvenanceIntegrityInput(
    evidence({
      integrity: {
        algorithm: "sha256",
        digest: "0".repeat(64),
      },
    }),
  );
  assert.equal(withIntegrity, baseline);
  assert.equal("integrity" in projectEvidenceProvenanceIntegrityInput(evidence()), false);
});

test("unsupported and non-finite provenance values fail before canonicalization", () => {
  assert.throws(
    () => canonicalEvidenceProvenanceIntegrityInput(evidence({ classification: { confidence: Number.NaN } })),
    /expected finite number from 0 through 1/,
  );
  assert.throws(
    () => canonicalEvidenceProvenanceIntegrityInput(evidence({ classification: { confidence: Number.POSITIVE_INFINITY } })),
    /expected finite number from 0 through 1/,
  );
  assert.throws(
    () => canonicalEvidenceProvenanceIntegrityInput(evidence({ unsupported: true })),
    /unexpected field unsupported/,
  );
});
