import assert from "node:assert/strict";
import test from "node:test";
import {
  evidenceProvenanceExtensionSchema,
  normalizeEvidenceProvenanceExtension,
} from "../../packages/contracts/evidence-provenance/index.js";

test("non-artifact source references keep stable provider-neutral identity with optional hints", () => {
  const normalized = normalizeEvidenceProvenanceExtension({
    extensionVersion: "1.0.0",
    evidenceId: "urn:system-builder:evidence:source-semantics",
    sources: [
      {
        sourceId: "urn:system-builder:source:ticket-42",
        sourceType: "ticket",
        correlationRef: "urn:system-builder:correlation:case-7",
        locationHint: "https://example.invalid/tickets/42",
      },
      {
        sourceId: "urn:system-builder:source:verbal-report-5",
        sourceType: "verbal-report",
      },
    ],
    transformations: [],
    lineage: { predecessorEvidenceIds: [] },
  });

  assert.deepEqual(normalized.sources, [
    {
      sourceId: "urn:system-builder:source:ticket-42",
      sourceType: "ticket",
      correlationRef: "urn:system-builder:correlation:case-7",
      locationHint: "https://example.invalid/tickets/42",
    },
    {
      sourceId: "urn:system-builder:source:verbal-report-5",
      sourceType: "verbal-report",
    },
  ]);
  assert.equal("inputs" in normalized, false, "artifact inputs remain an ADR-0009 core provenance concern");
  assert.equal(JSON.stringify(normalized).includes("providerResourceId"), false);
  assert.equal(JSON.stringify(normalized).includes("storageLocator"), false);
});

test("source reference normalization is deterministic independent of source set order", () => {
  const first = normalizeEvidenceProvenanceExtension({
    extensionVersion: "1.0.0",
    evidenceId: "urn:evidence:deterministic-source-order",
    sources: [
      { sourceId: "urn:source:z", sourceType: "document", correlationRef: "urn:correlation:2" },
      { sourceId: "urn:source:a", sourceType: "ticket", locationHint: "https://example.invalid/a" },
    ],
    transformations: [],
    lineage: { predecessorEvidenceIds: [] },
  });
  const second = normalizeEvidenceProvenanceExtension({
    extensionVersion: "1.0.0",
    evidenceId: "urn:evidence:deterministic-source-order",
    sources: [
      { locationHint: "https://example.invalid/a", sourceType: "ticket", sourceId: "urn:source:a" },
      { correlationRef: "urn:correlation:2", sourceType: "document", sourceId: "urn:source:z" },
    ],
    transformations: [],
    lineage: { predecessorEvidenceIds: [] },
  });

  assert.deepEqual(second, first);
  assert.deepEqual(first.sources.map((source) => source.sourceId), ["urn:source:a", "urn:source:z"]);
});

test("source references reject ambiguous duplicate identities and malformed optional references", () => {
  const base = {
    extensionVersion: "1.0.0",
    evidenceId: "urn:evidence:source-validation",
    transformations: [],
    lineage: { predecessorEvidenceIds: [] },
  } as const;

  assert.throws(
    () => normalizeEvidenceProvenanceExtension({
      ...base,
      sources: [
        { sourceId: "urn:source:1", sourceType: "ticket", correlationRef: "urn:correlation:a" },
        { sourceId: "urn:source:1", sourceType: "ticket", correlationRef: "urn:correlation:b" },
      ],
    }),
    /duplicate sourceId/,
  );
  assert.throws(
    () => normalizeEvidenceProvenanceExtension({
      ...base,
      sources: [{ sourceId: "urn:source:1", sourceType: "ticket", correlationRef: "not a uri" }],
    }),
    /correlationRef: malformed value/,
  );
  assert.throws(
    () => normalizeEvidenceProvenanceExtension({
      ...base,
      sources: [{ sourceId: "urn:source:1", sourceType: "ticket", locationHint: "not a uri" }],
    }),
    /locationHint: malformed value/,
  );
});

test("source reference schema keeps hints optional and non-authoritative", () => {
  const schema = evidenceProvenanceExtensionSchema as {
    properties?: {
      sources?: {
        items?: {
          required?: readonly string[];
          properties?: Record<string, unknown>;
        };
      };
    };
  };
  const sourceSchema = schema.properties?.sources?.items;
  assert.deepEqual(sourceSchema?.required, ["sourceId", "sourceType"]);
  assert.equal("correlationRef" in (sourceSchema?.properties ?? {}), true);
  assert.equal("locationHint" in (sourceSchema?.properties ?? {}), true);
  assert.equal(sourceSchema?.required?.includes("correlationRef"), false);
  assert.equal(sourceSchema?.required?.includes("locationHint"), false);
});
