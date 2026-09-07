import assert from "node:assert/strict";
import test from "node:test";

import {
  EVIDENCE_PROVENANCE_EXTENSION_VERSION,
  normalizeEvidenceProvenanceExtension,
} from "../../packages/contracts/evidence-provenance/index.js";
import {
  SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  normalizeCurrentnessQualification,
  normalizeDefinitionRevisionRef,
} from "../../packages/contracts/semantic-substrate/index.js";

function bindEvidenceToSemantic(input: {
  evidence: unknown;
  semanticRevision: unknown;
  currentness: unknown;
}) {
  const evidence = normalizeEvidenceProvenanceExtension(input.evidence);
  const semanticRevision = normalizeDefinitionRevisionRef(input.semanticRevision);
  const currentness = normalizeCurrentnessQualification(input.currentness);

  if (semanticRevision.semanticOwner !== "evidence-provenance") {
    throw new Error("semantic evidence reference must remain owned by evidence-provenance");
  }
  if (semanticRevision.semanticKind !== "evidence-record") {
    throw new Error("semantic evidence reference must use evidence-record kind");
  }
  if (semanticRevision.canonicalRef !== evidence.evidenceId) {
    throw new Error("semantic canonicalRef must preserve evidenceId without replacing it");
  }
  if (semanticRevision.revisionOwner !== "evidence-provenance") {
    throw new Error("semantic evidence revision owner must remain evidence-provenance");
  }
  if (semanticRevision.revisionDimension !== "evidence-capture") {
    throw new Error("semantic evidence revision dimension must remain evidence-capture");
  }
  if (semanticRevision.revisionRef !== "urn:system-builder:evidence:capture:1") {
    throw new Error("semantic evidence revisionRef must preserve the producing capture revision");
  }
  if (JSON.stringify(currentness.subject) !== JSON.stringify(semanticRevision)) {
    throw new Error("currentness subject must exactly match the semantic evidence revision");
  }

  return Object.freeze({ evidence, semanticRevision, currentness });
}

const evidence = {
  extensionVersion: EVIDENCE_PROVENANCE_EXTENSION_VERSION,
  evidenceId: "urn:system-builder:evidence:shared-external-value",
  sources: [
    {
      sourceId: "urn:system-builder:evidence:shared-external-value",
      sourceType: "provider-event",
      capturedAt: "2026-09-07T20:10:00Z",
      correlationRef: "urn:provider:event:42",
    },
  ],
  classification: {
    label: "observed",
    confidence: 0.4,
  },
  transformations: [
    {
      descriptorId: "provider-normalization",
      descriptorVersion: "1.0.0",
      provider: { id: "shared-external-value" },
    },
  ],
  lineage: {
    predecessorEvidenceIds: ["urn:system-builder:evidence:prior"],
  },
} as const;

const semanticRevision = {
  contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  semanticOwner: "evidence-provenance",
  semanticKind: "evidence-record",
  canonicalRef: evidence.evidenceId,
  definitionRef: evidence.evidenceId,
  revisionOwner: "evidence-provenance",
  revisionDimension: "evidence-capture",
  revisionRef: "urn:system-builder:evidence:capture:1",
} as const;

function currentness(state: "CURRENT" | "STALE" | "UNKNOWN" | "INSUFFICIENT") {
  return {
    contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
    subject: semanticRevision,
    revisionVector: [
      {
        revisionOwner: "evidence-provenance",
        revisionDimension: "evidence-capture",
        revisionRef: semanticRevision.revisionRef,
      },
    ],
    temporal: {
      occurredAt: "2026-09-07T20:10:00Z",
      observedAt: "2026-09-07T20:11:00Z",
      evaluatedAt: "2026-09-07T20:12:00Z",
      effectiveFrom: null,
      effectiveUntil: null,
      reconciledAt: null,
    },
    populationScope: "urn:system-builder:evidence:population:provider-events",
    localityScope: "provider:shared-external-value",
    currentnessHorizon: {
      assessedAt: "2026-09-07T20:12:00Z",
      validUntil: "2026-09-07T21:12:00Z",
    },
    state,
    reason: `semantic evidence qualification is ${state.toLowerCase()}`,
  } as const;
}

test("evidence provenance remains authoritative while semantic qualification is additive", () => {
  const bound = bindEvidenceToSemantic({
    evidence,
    semanticRevision,
    currentness: currentness("CURRENT"),
  });

  assert.equal(bound.evidence.evidenceId, "urn:system-builder:evidence:shared-external-value");
  assert.equal(bound.evidence.classification?.label, "observed");
  assert.equal(bound.evidence.classification?.confidence, 0.4);
  assert.deepEqual(bound.evidence.lineage.predecessorEvidenceIds, ["urn:system-builder:evidence:prior"]);
  assert.equal(bound.semanticRevision.semanticOwner, "evidence-provenance");
  assert.equal(bound.currentness.state, "CURRENT");
});

test("equal external/provider values do not collapse evidence and semantic identities", () => {
  const bound = bindEvidenceToSemantic({ evidence, semanticRevision, currentness: currentness("CURRENT") });

  assert.equal(bound.evidence.sources[0]?.sourceId, bound.evidence.evidenceId);
  assert.equal(bound.evidence.transformations[0]?.provider?.id, "shared-external-value");
  assert.equal(bound.semanticRevision.canonicalRef, bound.evidence.evidenceId);
  assert.notEqual(bound.semanticRevision.revisionRef, bound.evidence.evidenceId);
  assert.equal(bound.semanticRevision.semanticOwner, "evidence-provenance");
});

test("stale and unknown semantic qualification cannot strengthen evidence meaning", () => {
  const stale = bindEvidenceToSemantic({ evidence, semanticRevision, currentness: currentness("STALE") });
  const unknown = bindEvidenceToSemantic({ evidence, semanticRevision, currentness: currentness("UNKNOWN") });

  for (const bound of [stale, unknown]) {
    assert.equal(bound.evidence.classification?.label, "observed");
    assert.equal(bound.evidence.classification?.confidence, 0.4);
    assert.deepEqual(bound.evidence.lineage.predecessorEvidenceIds, ["urn:system-builder:evidence:prior"]);
  }
  assert.equal(stale.currentness.state, "STALE");
  assert.equal(unknown.currentness.state, "UNKNOWN");
});

test("adversarial semantic owner and revision substitution fail closed", () => {
  assert.throws(
    () =>
      bindEvidenceToSemantic({
        evidence,
        semanticRevision: { ...semanticRevision, semanticOwner: "provider" },
        currentness: {
          ...currentness("CURRENT"),
          subject: { ...semanticRevision, semanticOwner: "provider" },
        },
      }),
    /semantic evidence reference must remain owned by evidence-provenance/,
  );

  assert.throws(
    () =>
      bindEvidenceToSemantic({
        evidence,
        semanticRevision: { ...semanticRevision, revisionRef: "urn:system-builder:evidence:capture:2" },
        currentness: {
          ...currentness("CURRENT"),
          subject: { ...semanticRevision, revisionRef: "urn:system-builder:evidence:capture:2" },
        },
      }),
    /semantic evidence revisionRef must preserve the producing capture revision/,
  );
});
