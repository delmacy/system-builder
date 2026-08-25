import type { EvidenceProvenanceExtension } from "../../../packages/contracts/evidence-provenance/index.js";

export const validEvidenceProvenanceFixtures: readonly EvidenceProvenanceExtension[] = [
  {
    extensionVersion: "1.0.0",
    evidenceId: "urn:system-builder:evidence:alpha",
    sources: [],
    transformations: [],
    lineage: { predecessorEvidenceIds: [] },
  },
  {
    extensionVersion: "1.0.0",
    evidenceId: "urn:system-builder:evidence:beta",
    sources: [
      {
        sourceId: "urn:system-builder:source:ticket-42",
        sourceType: "ticket",
        capturedAt: "2026-08-25T01:00:00Z",
        authorRef: "actor:operator-1",
      },
    ],
    classification: { label: "observed", confidence: 0.8 },
    transformations: [
      {
        descriptorId: "normalize.ticket",
        descriptorVersion: "1.0.0",
        tool: { id: "system-builder.normalizer", version: "1" },
        provider: { id: "system-builder" },
      },
    ],
    lineage: { predecessorEvidenceIds: ["urn:system-builder:evidence:alpha"] },
  },
];

export const invalidEvidenceProvenanceFixtures: readonly unknown[] = [
  {
    extensionVersion: "1.0.0",
    sources: [],
    transformations: [],
    lineage: { predecessorEvidenceIds: [] },
  },
  {
    extensionVersion: "1.0.0",
    evidenceId: "not a uri",
    sources: [],
    transformations: [],
    lineage: { predecessorEvidenceIds: [] },
  },
  {
    extensionVersion: "1.0.0",
    evidenceId: "urn:system-builder:evidence:gamma",
    sources: [],
    classification: { label: "observed", confidence: 1.5 },
    transformations: [],
    lineage: { predecessorEvidenceIds: [] },
  },
  {
    extensionVersion: "1.0.0",
    evidenceId: "urn:system-builder:evidence:delta",
    sources: [],
    transformations: [],
    lineage: { predecessorEvidenceIds: [] },
    credential: "must-not-be-accepted",
  },
];
