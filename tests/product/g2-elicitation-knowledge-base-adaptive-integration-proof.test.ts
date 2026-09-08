import assert from "node:assert/strict";
import test from "node:test";

import {
  EKB_QUESTION_SEMANTIC_KIND,
  ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
  SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  normalizeQuestionDefinitionRevision,
  normalizeQuestionOccurrence,
} from "../../packages/contracts/elicitation-knowledge-base/index.js";
import { normalizeEKBFollowUpPlan } from "../../packages/contracts/elicitation-knowledge-base/follow-up.js";
import { normalizeEKBCapabilityLensRoute } from "../../packages/contracts/elicitation-knowledge-base/capability-lens-routing.js";
import {
  collectEKBNegativeSpaceBlockers,
  normalizeEKBNegativeSpaceCoverageRecord,
} from "../../packages/contracts/elicitation-knowledge-base/negative-space-coverage.js";
import {
  EKB_TRACE_AUTHORITY_MODE,
  normalizeEKBDerivedTraceabilityRecord,
} from "../../packages/contracts/elicitation-knowledge-base/derived-traceability.js";

const owner = "capability:elicitation";
const canonicalRef = "question:maintenance-window";
const definition = normalizeQuestionDefinitionRevision({
  contractVersion: ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
  ref: {
    contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
    semanticOwner: owner,
    semanticKind: EKB_QUESTION_SEMANTIC_KIND,
    canonicalRef,
    definitionRef: `${canonicalRef}@definition`,
    revisionOwner: owner,
    revisionDimension: "wording",
    revisionRef: "r1",
  },
  text: "Which maintenance windows are unavailable?",
});
const occurrence = normalizeQuestionOccurrence({
  contractVersion: ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
  ref: {
    occurrence: {
      contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
      semanticOwner: owner,
      semanticKind: EKB_QUESTION_SEMANTIC_KIND,
      canonicalRef,
      occurrenceRef: "occurrence:station-a:maintenance-window:1",
    },
    producingDefinitionRevision: definition.ref,
  },
  definitionRevision: definition.ref,
  context: {
    contextRef: "workshop:station-a",
    populationScope: "population:station-a",
    localityScope: "locality:station-a",
  },
});

function followUp() {
  return normalizeEKBFollowUpPlan({
    contractVersion: ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
    followUpRef: "follow-up:maintenance-window:1",
    trigger: {
      kind: "GAP",
      gapRef: "gap:maintenance-window:unknown",
      contradictionRef: null,
      stageObligationRef: null,
      severity: "HIGH",
      occurrence: occurrence.ref,
      context: occurrence.context,
      currentnessState: "CURRENT",
    },
    outcome: "FOLLOW_UP_REQUIRED",
    route: {
      targetQuestionRevisionRef: "question:maintenance-window:r1:follow-up-1",
      targetAuthority: null,
    },
    rationale: "Explicit unresolved gap requires a bounded follow-up.",
  });
}

function route() {
  const lensRevision = { lensRef: "lens:maintenance", revisionRef: "lens:maintenance:r1" } as const;
  return normalizeEKBCapabilityLensRoute({
    contractVersion: ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
    identity: { routeRef: "lens-route:maintenance:1", producingLensRevision: lensRevision },
    routeRef: "lens-route:maintenance:1",
    sourceFollowUpRef: followUp().followUpRef,
    producingLensRevision: lensRevision,
    sourceOccurrence: occurrence.ref,
    sourceContext: occurrence.context,
    targetOwners: [
      { ownerRef: "capability:maintenance", authorityRef: "semantic-owner:maintenance" },
      { ownerRef: "capability:scheduling", authorityRef: "semantic-owner:scheduling" },
    ],
    outcome: "MULTI_CANDIDATE",
    rationale: "Two external semantic owners remain explicit candidates; no winner is inferred.",
  });
}

function unknownCoverage(localityScope = "locality:station-a", populationScope = "population:station-a:operators") {
  return normalizeEKBNegativeSpaceCoverageRecord({
    contractVersion: ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
    negativeSpaceRef: `negative-space:${localityScope}:${populationScope}`,
    sourceCapabilityRouteRef: route().routeRef,
    kind: "STAKEHOLDER",
    expectedRef: "stakeholder-cohort:operators",
    populationScope,
    localityScope,
    state: "UNKNOWN",
    currentnessState: "UNKNOWN",
    severity: "HIGH",
    evidenceRef: null,
    applicabilityRef: null,
    rationale: "Expected stakeholder cohort has not yet been observed.",
    contradictionRefs: [],
  });
}

function trace() {
  return normalizeEKBDerivedTraceabilityRecord({
    contractVersion: ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
    traceRef: "trace:operator-answer:r1:story:r4",
    sourceOccurrenceRef: occurrence.ref.occurrence.occurrenceRef,
    sourceArtifactRef: "information:operator-answer",
    sourceRevisionRef: "revision:operator-answer:r1",
    sourceInformationKind: "Claim",
    sourceCurrentness: "CURRENT",
    targetArtifactRef: "story:maintenance-screen",
    targetRevisionRef: "revision:story:maintenance-screen:r4",
    targetSemanticOwnerRef: "owner:product-backlog",
    derivationKind: "STORY",
    rationale: "A claim may motivate a candidate story without becoming authoritative.",
    evidenceRefs: ["evidence:interview:17"],
    contradictionRefs: ["contradiction:operator-vs-supervisor"],
    negationRef: "negation:no-automatic-closure",
    traceState: "ACTIVE",
    authorityMode: EKB_TRACE_AUTHORITY_MODE,
    supersedesTraceRef: null,
  });
}

test("TASK-483 composes adaptive follow-up, multi-candidate routing, conservative coverage and reference-only traceability", () => {
  const plan = followUp();
  const lensRoute = route();
  const coverage = unknownCoverage();
  const derived = trace();

  assert.equal(plan.trigger.occurrence.producingDefinitionRevision.revisionRef, "r1");
  assert.equal(plan.trigger.context.localityScope, "locality:station-a");
  assert.equal(lensRoute.sourceFollowUpRef, plan.followUpRef);
  assert.equal(lensRoute.outcome, "MULTI_CANDIDATE");
  assert.equal(lensRoute.targetOwners.length, 2);
  assert.equal(coverage.sourceCapabilityRouteRef, lensRoute.routeRef);
  assert.equal(coverage.state, "UNKNOWN");
  assert.equal(coverage.currentnessState, "UNKNOWN");
  assert.equal(derived.sourceOccurrenceRef, occurrence.ref.occurrence.occurrenceRef);
  assert.equal(derived.sourceRevisionRef, "revision:operator-answer:r1");
  assert.equal(derived.targetRevisionRef, "revision:story:maintenance-screen:r4");
  assert.equal(derived.sourceInformationKind, "Claim");
  assert.equal(derived.authorityMode, "REFERENCE_ONLY");
  assert.deepEqual(derived.contradictionRefs, ["contradiction:operator-vs-supervisor"]);
});

test("TASK-483 keeps HIGH and CRITICAL unresolved coverage as explicit stage blockers", () => {
  const high = unknownCoverage();
  const critical = normalizeEKBNegativeSpaceCoverageRecord({
    ...unknownCoverage(),
    negativeSpaceRef: "negative-space:station-a:maintenance-log",
    kind: "SOURCE",
    expectedRef: "source:maintenance-log",
    state: "PARTIAL",
    currentnessState: "INSUFFICIENT",
    severity: "CRITICAL",
    populationScope: "population:station-a",
  });
  assert.deepEqual(collectEKBNegativeSpaceBlockers([high, critical]), [
    critical.negativeSpaceRef,
    high.negativeSpaceRef,
  ].sort());
});

test("TASK-483 explicitly rejects every mandatory adversarial shortcut", () => {
  assert.throws(
    () => normalizeEKBFollowUpPlan({ ...followUp(), outcome: "INCONCLUSIVE", route: { targetQuestionRevisionRef: "question:default", targetAuthority: null } }),
    /must not fabricate a target question or owner/,
  );
  assert.throws(() => normalizeEKBCapabilityLensRoute({ ...route(), semanticPredicate: "maintenance.window" }), /unexpected field semanticPredicate/);
  assert.throws(() => normalizeEKBCapabilityLensRoute({ ...route(), firstMatchWins: true }), /unexpected field firstMatchWins/);
  assert.throws(() => normalizeEKBNegativeSpaceCoverageRecord({ ...unknownCoverage(), missingMeansNotApplicable: true }), /unexpected field missingMeansNotApplicable/);
  assert.throws(() => normalizeEKBNegativeSpaceCoverageRecord({ ...unknownCoverage(), evidenceCount: 0 }), /unexpected field evidenceCount/);
  assert.throws(
    () => normalizeEKBDerivedTraceabilityRecord({ ...trace(), sourceCurrentness: "STALE", traceState: "ACTIVE" }),
    /must yield UNRESOLVED/,
  );
  assert.throws(() => normalizeEKBDerivedTraceabilityRecord({ ...trace(), authorityMode: "AUTHORITATIVE" }), /reference-only/);
  assert.throws(() => normalizeEKBDerivedTraceabilityRecord({ ...trace(), latestSourceRevisionRef: "revision:operator-answer:r2" }), /unexpected field latestSourceRevisionRef/);
  assert.deepEqual(trace().contradictionRefs, ["contradiction:operator-vs-supervisor"]);
  assert.equal(trace().negationRef, "negation:no-automatic-closure");
  assert.throws(() => normalizeEKBFollowUpPlan({ ...followUp(), completion: 1 }), /unexpected field completion/);
});

test("TASK-483 recovery and coexistence preserve locality, currentness, epistemic state and external ownership", () => {
  const stale = normalizeEKBDerivedTraceabilityRecord({ ...trace(), sourceCurrentness: "STALE", traceState: "UNRESOLVED" });
  assert.equal(stale.traceState, "UNRESOLVED");
  assert.equal(stale.sourceInformationKind, "Claim");
  assert.equal(stale.targetSemanticOwnerRef, "owner:product-backlog");

  const fleet = unknownCoverage("locality:fleet", "population:fleet:operators");
  const local = unknownCoverage();
  assert.notEqual(fleet.localityScope, local.localityScope);
  assert.notEqual(fleet.populationScope, local.populationScope);
  assert.equal(local.state, "UNKNOWN");

  assert.throws(() => normalizeEKBDerivedTraceabilityRecord({ ...trace(), targetSemanticOwnerRef: "owner:ekb" }), /must remain external/);
  assert.throws(() => normalizeEKBCapabilityLensRoute({ ...route(), confidence: 0.99 }), /unexpected field confidence/);
});
