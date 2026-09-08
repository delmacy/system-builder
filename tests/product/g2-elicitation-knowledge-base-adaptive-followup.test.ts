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

const owner = "capability:elicitation";
const canonicalRef = "question:maintenance-window";

function definition(revisionRef: string, text: string) {
  return normalizeQuestionDefinitionRevision({
    contractVersion: ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
    ref: {
      contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
      semanticOwner: owner,
      semanticKind: EKB_QUESTION_SEMANTIC_KIND,
      canonicalRef,
      definitionRef: `${canonicalRef}@definition`,
      revisionOwner: owner,
      revisionDimension: "wording",
      revisionRef,
    },
    text,
  });
}

const historical = definition("r1", "Which maintenance windows are unavailable?");
const current = definition("r2", "Which maintenance windows and blackout periods are unavailable?");

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
    producingDefinitionRevision: historical.ref,
  },
  definitionRevision: historical.ref,
  context: {
    contextRef: "workshop:station-a",
    populationScope: "population:station-a",
    localityScope: "locality:station-a",
  },
});

function basePlan() {
  return {
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
    rationale: "A HIGH unresolved gap blocks abstraction sufficiency.",
  } as const;
}

test("TASK-479 preserves gap, occurrence, producing revision and context in deterministic follow-up planning", () => {
  const plan = normalizeEKBFollowUpPlan(basePlan());
  assert.equal(plan.trigger.gapRef, "gap:maintenance-window:unknown");
  assert.equal(plan.trigger.occurrence.occurrence.occurrenceRef, "occurrence:station-a:maintenance-window:1");
  assert.equal(plan.trigger.occurrence.producingDefinitionRevision.revisionRef, "r1");
  assert.equal(plan.trigger.context.contextRef, "workshop:station-a");
  assert.equal(plan.trigger.context.populationScope, "population:station-a");
  assert.equal(plan.trigger.context.localityScope, "locality:station-a");
  assert.equal(current.ref.revisionRef, "r2");
  assert.notEqual(plan.trigger.occurrence.producingDefinitionRevision.revisionRef, current.ref.revisionRef);
});

test("TASK-479 fails closed without routing context and never fabricates a default question or owner", () => {
  const inconclusive = normalizeEKBFollowUpPlan({
    ...basePlan(),
    outcome: "INCONCLUSIVE",
    route: { targetQuestionRevisionRef: null, targetAuthority: null },
    rationale: "Routing context is insufficient; retain the gap for explicit follow-up planning.",
  });
  assert.equal(inconclusive.outcome, "INCONCLUSIVE");
  assert.equal(inconclusive.route.targetQuestionRevisionRef, null);
  assert.equal(inconclusive.route.targetAuthority, null);

  assert.throws(
    () => normalizeEKBFollowUpPlan({ ...basePlan(), route: { targetQuestionRevisionRef: null, targetAuthority: null } }),
    /requires explicit routing context/,
  );
  assert.throws(
    () => normalizeEKBFollowUpPlan({ ...basePlan(), outcome: "INCONCLUSIVE", route: { targetQuestionRevisionRef: "question:default", targetAuthority: null } }),
    /must not fabricate a target question or owner/,
  );
});

test("TASK-479 rejects scalar masking, confidence/repetition authority and implicit closure of unresolved obligations", () => {
  assert.throws(() => normalizeEKBFollowUpPlan({ ...basePlan(), confidence: 0.99 }), /unexpected field confidence/);
  assert.throws(() => normalizeEKBFollowUpPlan({ ...basePlan(), completion: 1 }), /unexpected field completion/);
  assert.throws(() => normalizeEKBFollowUpPlan({ ...basePlan(), repetitionCount: 10 }), /unexpected field repetitionCount/);
  assert.throws(() => normalizeEKBFollowUpPlan({ ...basePlan(), outcome: "RESOLVED" }), /must be one of/);
  assert.throws(() => normalizeEKBFollowUpPlan({ ...basePlan(), outcome: "CLOSED" }), /must be one of/);
});

test("TASK-479 preserves explicit contradiction/stage triggers and stale evidence cannot become a resolved state", () => {
  const contradiction = normalizeEKBFollowUpPlan({
    ...basePlan(),
    followUpRef: "follow-up:contradiction:1",
    trigger: {
      ...basePlan().trigger,
      kind: "CONTRADICTION",
      gapRef: null,
      contradictionRef: "contradiction:maintenance-window:1",
      severity: "CRITICAL",
    },
  });
  assert.equal(contradiction.trigger.contradictionRef, "contradiction:maintenance-window:1");
  assert.equal(contradiction.outcome, "FOLLOW_UP_REQUIRED");

  const stale = normalizeEKBFollowUpPlan({
    ...basePlan(),
    followUpRef: "follow-up:stale:1",
    trigger: { ...basePlan().trigger, currentnessState: "STALE" },
    outcome: "UNRESOLVED",
    route: { targetQuestionRevisionRef: null, targetAuthority: null },
    rationale: "Evidence is stale, so the gap remains unresolved pending renewed evidence.",
  });
  assert.equal(stale.trigger.currentnessState, "STALE");
  assert.equal(stale.outcome, "UNRESOLVED");

  assert.throws(
    () => normalizeEKBFollowUpPlan({ ...basePlan(), trigger: { ...basePlan().trigger, contradictionRef: "contradiction:extra" } }),
    /exactly one explicit unresolved source reference/,
  );
});
