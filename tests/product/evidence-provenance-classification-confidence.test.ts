import assert from "node:assert/strict";
import test from "node:test";
import {
  evidenceProvenanceExtensionSchema,
  normalizeEvidenceProvenanceExtension,
} from "../../packages/contracts/evidence-provenance/index.js";

const baseEvidence = {
  extensionVersion: "1.0.0",
  evidenceId: "urn:system-builder:evidence:classification-confidence",
  sources: [],
  transformations: [],
  lineage: { predecessorEvidenceIds: [] },
} as const;

test("classification label and confidence are independently optional", () => {
  const absent = normalizeEvidenceProvenanceExtension(baseEvidence);
  const labelOnly = normalizeEvidenceProvenanceExtension({ ...baseEvidence, classification: { label: "observed" } });
  const confidenceOnly = normalizeEvidenceProvenanceExtension({ ...baseEvidence, classification: { confidence: 0.8 } });
  const both = normalizeEvidenceProvenanceExtension({
    ...baseEvidence,
    classification: { label: "derived", confidence: 0.65 },
  });

  assert.equal(absent.classification, undefined);
  assert.deepEqual(labelOnly.classification, { label: "observed" });
  assert.deepEqual(confidenceOnly.classification, { confidence: 0.8 });
  assert.deepEqual(both.classification, { label: "derived", confidence: 0.65 });
});

test("confidence bounds are explicit and deterministic without an inferred default", () => {
  assert.deepEqual(
    normalizeEvidenceProvenanceExtension({ ...baseEvidence, classification: { confidence: 0 } }).classification,
    { confidence: 0 },
  );
  assert.deepEqual(
    normalizeEvidenceProvenanceExtension({ ...baseEvidence, classification: { confidence: 1 } }).classification,
    { confidence: 1 },
  );
  assert.throws(
    () => normalizeEvidenceProvenanceExtension({ ...baseEvidence, classification: { confidence: -0.01 } }),
    /expected finite number from 0 through 1/,
  );
  assert.throws(
    () => normalizeEvidenceProvenanceExtension({ ...baseEvidence, classification: { confidence: 1.01 } }),
    /expected finite number from 0 through 1/,
  );
  assert.throws(
    () => normalizeEvidenceProvenanceExtension({ ...baseEvidence, classification: { confidence: Number.NaN } }),
    /expected finite number from 0 through 1/,
  );
  assert.throws(
    () => normalizeEvidenceProvenanceExtension({ ...baseEvidence, classification: { confidence: "high" } }),
    /expected finite number from 0 through 1/,
  );
});

test("classification rejects empty or unknown metadata and remains descriptive only", () => {
  assert.throws(
    () => normalizeEvidenceProvenanceExtension({ ...baseEvidence, classification: {} }),
    /expected label and\/or confidence/,
  );
  assert.throws(
    () => normalizeEvidenceProvenanceExtension({ ...baseEvidence, classification: { label: "observed", policy: "allow" } }),
    /unexpected field policy/,
  );

  const normalized = normalizeEvidenceProvenanceExtension({
    ...baseEvidence,
    classification: { label: "review-needed", confidence: 0.4 },
  });
  assert.equal("authorized" in normalized, false);
  assert.equal("decision" in normalized, false);
  assert.equal("policy" in normalized, false);
});

test("schema exposes label and confidence independently without a vendor scoring model", () => {
  const schema = evidenceProvenanceExtensionSchema as {
    properties?: {
      classification?: {
        required?: readonly string[];
        minProperties?: number;
        properties?: Record<string, unknown>;
      };
    };
  };
  const classification = schema.properties?.classification;
  const classificationProperties = classification?.properties ?? {};
  assert.equal(classification?.required, undefined);
  assert.equal(classification?.minProperties, 1);
  assert.equal("label" in classificationProperties, true);
  assert.equal("confidence" in classificationProperties, true);
  assert.equal("provider" in classificationProperties, false);
  assert.equal("model" in classificationProperties, false);
});