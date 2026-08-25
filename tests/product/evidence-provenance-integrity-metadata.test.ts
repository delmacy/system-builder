import assert from "node:assert/strict";
import test from "node:test";
import {
  EVIDENCE_PROVENANCE_INTEGRITY_ALGORITHM,
  normalizeEvidenceProvenanceExtension,
} from "../../packages/contracts/evidence-provenance/index.js";

function baseEvidence(): Record<string, unknown> {
  return {
    extensionVersion: "1.0.0",
    evidenceId: "urn:system-builder:evidence:integrity-metadata",
    sources: [],
    transformations: [],
    lineage: { predecessorEvidenceIds: [] },
  };
}

test("provenance integrity metadata is optional and provider-neutral", () => {
  const withoutIntegrity = normalizeEvidenceProvenanceExtension(baseEvidence());
  assert.equal(withoutIntegrity.integrity, undefined);

  const normalized = normalizeEvidenceProvenanceExtension({
    ...baseEvidence(),
    integrity: {
      algorithm: "sha256",
      digest: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    },
  });

  assert.deepEqual(normalized.integrity, {
    algorithm: EVIDENCE_PROVENANCE_INTEGRITY_ALGORITHM,
    digest: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
  });
  const serialized = JSON.stringify(normalized.integrity);
  assert.equal(serialized.includes("provider"), false);
  assert.equal(serialized.includes("credential"), false);
  assert.equal(serialized.includes("secret"), false);
  assert.equal(serialized.includes("locator"), false);
});

test("provenance integrity metadata rejects unsupported algorithms and malformed digests", () => {
  assert.throws(
    () =>
      normalizeEvidenceProvenanceExtension({
        ...baseEvidence(),
        integrity: {
          algorithm: "sha512",
          digest: "0".repeat(128),
        },
      }),
    /integrity\.algorithm: unsupported algorithm/,
  );

  assert.throws(
    () =>
      normalizeEvidenceProvenanceExtension({
        ...baseEvidence(),
        integrity: {
          algorithm: "sha256",
          digest: "ABCDEF",
        },
      }),
    /integrity\.digest: malformed value/,
  );

  assert.throws(
    () =>
      normalizeEvidenceProvenanceExtension({
        ...baseEvidence(),
        integrity: {
          algorithm: "sha256",
          digest: "0".repeat(63),
        },
      }),
    /integrity\.digest: malformed value/,
  );
});

test("provenance integrity metadata is strict and carries no authority fields", () => {
  assert.throws(
    () =>
      normalizeEvidenceProvenanceExtension({
        ...baseEvidence(),
        integrity: {
          algorithm: "sha256",
          digest: "0".repeat(64),
          authorized: true,
        },
      }),
    /integrity: unexpected field authorized/,
  );

  assert.throws(
    () =>
      normalizeEvidenceProvenanceExtension({
        ...baseEvidence(),
        integrity: {
          algorithm: "sha256",
          digest: "0".repeat(64),
          storageLocator: "s3://bucket/object",
        },
      }),
    /integrity: unexpected field storageLocator/,
  );
});
