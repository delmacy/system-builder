import assert from "node:assert/strict";
import test from "node:test";

import {
  EKB_INFORMATION_KINDS,
  EKB_QUESTION_SEMANTIC_KIND,
  ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
  SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  normalizeInformationRecord,
  normalizeQuestionDefinitionRevision,
  normalizeQuestionOccurrence,
} from "../../packages/contracts/elicitation-knowledge-base/index.js";
import { normalizeEKBRecordQualification } from "../../packages/contracts/elicitation-knowledge-base/qualification.js";
import { normalizeEKBContradictionRecord, normalizeEKBRoutingRecord } from "../../packages/contracts/elicitation-knowledge-base/routing.js";
import { assessEKBSufficiency, normalizeEKBCoverageRecord } from "../../packages/contracts/elicitation-knowledge-base/coverage.js";

const owner = "capability:elicitation";
const questionRef = "question:asset-criticality";

function definition(revisionRef: string) {
  return normalizeQuestionDefinitionRevision({
    contractVersion: ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
    ref: {
      contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
      semanticOwner: owner,
      semanticKind: EKB_QUESTION_SEMANTIC_KIND,
      canonicalRef: questionRef,
      definitionRef: `${questionRef}@definition`,
      revisionOwner: owner,
      revisionDimension: "wording",
      revisionRef,
    },
    text: revisionRef === "r1" ? "Which assets are critical?" : "Which assets are mission critical?",
  });
}

function occurrenceInput(revision = definition("r1")) {
  return {
    contractVersion: ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
    ref: {
      occurrence: {
        contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
        semanticOwner: owner,
        semanticKind: EKB_QUESTION_SEMANTIC_KIND,
        canonicalRef: questionRef,
        occurrenceRef: "occurrence:station-a:asset-criticality",
      },
      producingDefinitionRevision: revision.ref,
    },
    definitionRevision: revision.ref,
    context: { contextRef: "workshop:station-a", populationScope: "population:station-a", localityScope: "locality:station-a" },
  } as const;
}

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

function qualifiedCandidate(questionOccurrence: ReturnType<typeof normalizeQuestionOccurrence>["ref"], currentnessState: "CURRENT" | "STALE" = "CURRENT", localityScope = "Station:A") {
  return {
    contractVersion: "1.0.0",
    record: {
      contractVersion: "1.0.0",
      recordRef: "record:fact:1",
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
      sources: [{ sourceId: "urn:provider:manual", sourceType: "manual", locationHint: "urn:station:a" }],
      transformations: [{ descriptorId: "capture", descriptorVersion: "1.0.0", provider: { id: "manual" } }],
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

const coverageBase = {
  contractVersion: ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
  coverageRef: "coverage:process:station-a:r1",
  dimensionRef: "dimension:process",
  objectOrCapabilityRef: "capability:maintenance",
  revisionRef: "revision:r1",
  populationScope: "population:station-a",
  localityScope: "locality:station-a",
  state: "RESOLVED",
  requiredStages: ["SUFFICIENT_FOR_ABSTRACTION"],
  qualificationRef: "qualification:1",
  currentnessState: "CURRENT",
  applicabilityRef: "applicability:1",
  rationale: null,
  historicalResolvedEvidenceRef: "evidence:resolved:r1",
} as const;

test("TASK-478 composes revision-pinned questions, typed information and qualified evidence without authority amplification", () => {
  const historical = definition("r1");
  const current = definition("r2");
  const asked = normalizeQuestionOccurrence(occurrenceInput(historical));
  assert.equal(asked.ref.producingDefinitionRevision.revisionRef, "r1");
  assert.throws(() => normalizeQuestionOccurrence({ ...occurrenceInput(historical), definitionRevision: current.ref }), /must match producing revision/);

  assert.equal(EKB_INFORMATION_KINDS.length, 12);
  for (const kind of EKB_INFORMATION_KINDS) {
    const record = normalizeInformationRecord({ contractVersion: "1.0.0", recordRef: `record:${kind}`, questionOccurrence: asked.ref, kind, text: kind, origin: "Human", lineage: null });
    assert.equal(record.kind, kind);
  }
  assert.equal(normalizeInformationRecord({ contractVersion: "1.0.0", recordRef: "record:unknown", questionOccurrence: asked.ref, kind: "Unknown", text: "Not established", origin: "Human", lineage: null }).kind, "Unknown");
  assert.throws(() => normalizeInformationRecord({ contractVersion: "1.0.0", recordRef: "record:ai", questionOccurrence: asked.ref, kind: "Fact", text: "AI guess", origin: "AI", lineage: null }), /must remain InferredCandidate/);
  assert.throws(() => normalizeInformationRecord({ contractVersion: "1.0.0", recordRef: "record:ai", questionOccurrence: asked.ref, kind: "InferredCandidate", text: "AI guess", origin: "AI", lineage: null, confidence: 0.99 }), /unexpected field confidence/);

  const qualified = normalizeEKBRecordQualification(qualifiedCandidate(asked.ref));
  assert.equal(qualified.currentness.state, "CURRENT");
  assert.equal(qualified.semanticOwnerRevision.semanticOwner, "ops-owner");
  assert.equal(asked.ref.producingDefinitionRevision.revisionRef, "r1");
  assert.throws(() => normalizeEKBRecordQualification(qualifiedCandidate(asked.ref, "STALE")), /STALE cannot be silently promoted/);
  assert.throws(() => normalizeEKBRecordQualification({ ...qualifiedCandidate(asked.ref), localityScope: "Station:B" }), /locality scope must exactly match/);
});

test("TASK-478 preserves contradiction, routing and external owner boundaries through normalization", () => {
  const contradiction = normalizeEKBContradictionRecord({
    contractVersion: "1.0.0",
    contradictionRef: "contradiction:1",
    subjectRef: "subject:asset-criticality",
    contextRef: "context:station-a",
    competingRecords: [{ recordRef: "record:a", qualificationRef: "qualification:a" }, { recordRef: "record:b", qualificationRef: "qualification:b" }],
    severity: "CRITICAL",
    resolutionAuthority: { ownerRef: "owner:domain-b", authorityRef: "authority:domain-b" },
    affectedGateRefs: ["gate:abstraction"],
    affectedArtifactRefs: ["artifact:requirements"],
    routeRef: "route:domain-b",
    dispositionRef: null,
    supersedesContradictionRef: null,
  });
  assert.deepEqual(contradiction.competingRecords.map((record) => record.recordRef), ["record:a", "record:b"]);
  assert.throws(() => normalizeEKBContradictionRecord({ ...contradiction, winnerRecordRef: "record:b" }), /unexpected field winnerRecordRef/);
  assert.throws(() => normalizeEKBContradictionRecord({ ...contradiction, confidence: 1 }), /unexpected field confidence/);

  const routed = normalizeEKBRoutingRecord({
    contractVersion: "1.0.0",
    routingRef: "route:domain-b",
    sourceOwnerRef: owner,
    targetAuthority: { ownerRef: "owner:domain-b", authorityRef: "authority:domain-b" },
    applicability: { subjectRef: "subject:asset-criticality", contextRef: "context:station-a", populationScope: "population:station-a", localityScope: "locality:station-a" },
    outcome: "ROUTED",
    rationale: "Domain B owns the resolution.",
    evidenceRefs: ["evidence:owner-map:1"],
    blockedGateRefs: [],
  });
  assert.notEqual(routed.sourceOwnerRef, routed.targetAuthority?.ownerRef);
  assert.throws(() => normalizeEKBRoutingRecord({ ...routed, targetPredicate: "cloned-domain-rule" }), /unexpected field targetPredicate/);
  assert.throws(() => normalizeEKBRoutingRecord({ ...routed, outcome: "NOT_APPLICABLE", rationale: null, evidenceRefs: [] }), /explicit rationale and applicability evidence/);
});

test("TASK-478 integrated sufficiency fails closed without scalar masking or Production Readiness claims", () => {
  const resolved = normalizeEKBCoverageRecord(coverageBase);
  const blocked = normalizeEKBCoverageRecord({ ...coverageBase, coverageRef: "coverage:authority:station-a:r1", dimensionRef: "dimension:authority", state: "BLOCKED", qualificationRef: null, currentnessState: "UNKNOWN" });
  const assessment = assessEKBSufficiency({
    stage: "SUFFICIENT_FOR_ABSTRACTION",
    coverage: [resolved, blocked],
    obligations: [{ obligationRef: "obligation:critical:1", contradictionRef: "contradiction:1", severity: "CRITICAL", routingOutcome: "UNRESOLVED", coverageState: "CONFLICTED", currentnessState: "CURRENT", applicable: true }],
  });
  assert.equal(assessment.result, "FAIL");
  assert.ok(assessment.blockerRefs.includes("obligation:critical:1"));
  assert.equal("productionReadiness" in assessment, false);
  assert.throws(() => normalizeEKBCoverageRecord({ ...coverageBase, percentage: 99 }), /unexpected field percentage/);
  assert.throws(() => normalizeEKBCoverageRecord({ ...coverageBase, state: "NOT_APPLICABLE", qualificationRef: null, applicabilityRef: null, rationale: null }), /requires applicability context and rationale/);
  assert.throws(() => normalizeEKBCoverageRecord({ ...coverageBase, currentnessState: "STALE" }), /RESOLVED coverage requires CURRENT qualified evidence/);
});
