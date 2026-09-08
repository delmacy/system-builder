import assert from "node:assert/strict";
import test from "node:test";
import { normalizeEKBRecordQualification } from "../../packages/contracts/elicitation-knowledge-base/qualification.js";

const ownerRevision = {
  contractVersion: "1.0.0",
  semanticOwner: "ops-owner",
  semanticKind: "elicitation-answer",
  canonicalRef: "answer:station-a",
  definitionRef: "answer-def:station-a",
  revisionOwner: "ops-owner",
  revisionDimension: "content",
  revisionRef: "r1",
} as const;

const questionOccurrence = {
  occurrence: {
    contractVersion: "1.0.0",
    semanticOwner: "ekb",
    semanticKind: "elicitation-question",
    canonicalRef: "question:q1",
    occurrenceRef: "occ:q1:1",
  },
  producingDefinitionRevision: {
    contractVersion: "1.0.0",
    semanticOwner: "ekb",
    semanticKind: "elicitation-question",
    canonicalRef: "question:q1",
    definitionRef: "question-def:q1",
    revisionOwner: "ekb",
    revisionDimension: "wording",
    revisionRef: "r1",
  },
} as const;

function candidate(currentnessState: "CURRENT" | "STALE" | "UNKNOWN" | "INSUFFICIENT" = "CURRENT", localityScope = "Station:A") {
  return {
    contractVersion: "1.0.0",
    record: {
      contractVersion: "1.0.0",
      recordRef: "record:1",
      questionOccurrence,
      kind: "Fact",
      text: "Radar is operational",
      origin: "Human",
      lineage: null,
    },
    semanticOwnerRevision: ownerRevision,
    evidence: {
      extensionVersion: "1.0.0",
      evidenceId: "urn:evidence:station-a:1",
      sources: [{ sourceId: "urn:provider:shared-value", sourceType: "manual", locationHint: "urn:station:a" }],
      transformations: [{ descriptorId: "capture", descriptorVersion: "1.0.0", provider: { id: "shared-value" } }],
      lineage: { predecessorEvidenceIds: [] },
    },
    currentness: {
      contractVersion: "1.0.0",
      subject: ownerRevision,
      revisionVector: [{ revisionOwner: "ops-owner", revisionDimension: "content", revisionRef: "r1" }],
      temporal: { occurredAt: null, observedAt: "2026-09-08T06:00:00Z", evaluatedAt: null, effectiveFrom: null, effectiveUntil: null, reconciledAt: null },
      populationScope: "RadarFleet",
      localityScope,
      currentnessHorizon: { assessedAt: "2026-09-08T06:00:00Z", validUntil: "2026-09-09T06:00:00Z" },
      state: currentnessState,
      reason: "owner-qualified observation",
    },
    populationScope: "RadarFleet",
    localityScope,
  } as const;
}

test("EKB qualification preserves evidence, semantic owner revision, currentness and locality as distinct coordinates", () => {
  const normalized = normalizeEKBRecordQualification(candidate());
  assert.equal(normalized.record.kind, "Fact");
  assert.equal(normalized.semanticOwnerRevision.semanticOwner, "ops-owner");
  assert.equal(normalized.evidence.evidenceId, "urn:evidence:station-a:1");
  assert.equal(normalized.currentness.state, "CURRENT");
  assert.equal(normalized.localityScope, "Station:A");
});

test("STALE UNKNOWN and INSUFFICIENT cannot silently produce a current Fact", () => {
  for (const state of ["STALE", "UNKNOWN", "INSUFFICIENT"] as const) {
    assert.throws(() => normalizeEKBRecordQualification(candidate(state)), new RegExp(`${state} cannot be silently promoted`));
  }
});

test("owner/revision substitution is rejected even when provider/source values coincide", () => {
  const value = candidate();
  assert.throws(() => normalizeEKBRecordQualification({ ...value, semanticOwnerRevision: { ...ownerRevision, revisionRef: "r2" } }), /currentness subject must exactly match/);
});

test("Fleet/global currentness cannot be strengthened into Station/local currentness", () => {
  const value = candidate();
  assert.throws(() => normalizeEKBRecordQualification({ ...value, localityScope: "Station:B" }), /currentness locality scope must exactly match/);
});

test("historical producing revision remains pinned after current qualification changes", () => {
  const normalized = normalizeEKBRecordQualification(candidate());
  assert.equal(normalized.semanticOwnerRevision.revisionRef, "r1");
  assert.equal(normalized.currentness.subject.revisionRef, "r1");
});
