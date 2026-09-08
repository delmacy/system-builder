import assert from "node:assert/strict";
import test from "node:test";

import {
  ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
} from "../../packages/contracts/elicitation-knowledge-base/index.js";
import {
  normalizeEKBContradictionRecord,
  normalizeEKBRoutingRecord,
} from "../../packages/contracts/elicitation-knowledge-base/routing.js";

const contradiction = {
  contractVersion: ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
  contradictionRef: "ekb:contradiction:1",
  subjectRef: "semantic:subject:1",
  contextRef: "context:station-a",
  competingRecords: [
    { recordRef: "ekb:record:a", qualificationRef: "ekb:qualification:a" },
    { recordRef: "ekb:record:b", qualificationRef: "ekb:qualification:b" },
  ],
  severity: "CRITICAL",
  resolutionAuthority: { ownerRef: "owner:domain-b", authorityRef: "authority:decision-boundary-b" },
  affectedGateRefs: ["gate:build-readiness"],
  affectedArtifactRefs: ["artifact:requirements"],
  routeRef: "route:domain-b",
  dispositionRef: null,
  supersedesContradictionRef: null,
} as const;

const applicability = {
  subjectRef: "semantic:subject:1",
  contextRef: "context:station-a",
  populationScope: "population:station-a",
  localityScope: "locality:station-a",
} as const;

test("TASK-476 preserves competing records and external resolution authority", () => {
  const normalized = normalizeEKBContradictionRecord(contradiction);
  assert.equal(normalized.competingRecords.length, 2);
  assert.equal(normalized.competingRecords[0]?.recordRef, "ekb:record:a");
  assert.equal(normalized.competingRecords[1]?.recordRef, "ekb:record:b");
  assert.equal(normalized.resolutionAuthority?.ownerRef, "owner:domain-b");
  assert.deepEqual(normalized.affectedGateRefs, ["gate:build-readiness"]);
});

test("TASK-476 rejects synthetic winner collapse and missing critical route", () => {
  assert.throws(() => normalizeEKBContradictionRecord({ ...contradiction, competingRecords: [contradiction.competingRecords[0]] }), /at least two/);
  assert.throws(() => normalizeEKBContradictionRecord({ ...contradiction, competingRecords: [contradiction.competingRecords[0], contradiction.competingRecords[0]] }), /distinct/);
  assert.throws(() => normalizeEKBContradictionRecord({ ...contradiction, resolutionAuthority: null, routeRef: null }), /requires an external resolution authority or explicit route/);
  assert.throws(() => normalizeEKBContradictionRecord({ ...contradiction, winnerRecordRef: "ekb:record:a" }), /unexpected field winnerRecordRef/);
  assert.throws(() => normalizeEKBContradictionRecord({ ...contradiction, confidence: 0.99 }), /unexpected field confidence/);
});

test("TASK-476 makes NOT_APPLICABLE evidence-bearing rather than a default", () => {
  const valid = normalizeEKBRoutingRecord({
    contractVersion: ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
    routingRef: "route:na:1",
    sourceOwnerRef: "owner:capability-a",
    targetAuthority: null,
    applicability,
    outcome: "NOT_APPLICABLE",
    rationale: "Capability is absent from the qualified station scope.",
    evidenceRefs: ["evidence:capability-inventory:1"],
    blockedGateRefs: [],
  });
  assert.equal(valid.outcome, "NOT_APPLICABLE");
  assert.throws(() => normalizeEKBRoutingRecord({ ...valid, rationale: null }), /explicit rationale and applicability evidence/);
  assert.throws(() => normalizeEKBRoutingRecord({ ...valid, evidenceRefs: [] }), /explicit rationale and applicability evidence/);
});

test("TASK-476 preserves unresolved and inconclusive outcomes without coercion", () => {
  for (const outcome of ["UNRESOLVED", "INCONCLUSIVE"] as const) {
    const routed = normalizeEKBRoutingRecord({
      contractVersion: ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
      routingRef: `route:${outcome.toLowerCase()}`,
      sourceOwnerRef: "owner:capability-a",
      targetAuthority: null,
      applicability,
      outcome,
      rationale: "No qualified resolution authority has produced a disposition.",
      evidenceRefs: [],
      blockedGateRefs: [],
    });
    assert.equal(routed.outcome, outcome);
  }
});

test("TASK-476 routes across owners without cloning target ownership", () => {
  const routed = normalizeEKBRoutingRecord({
    contractVersion: ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
    routingRef: "route:cross-owner:1",
    sourceOwnerRef: "owner:capability-a",
    targetAuthority: { ownerRef: "owner:domain-b", authorityRef: "authority:domain-b:resolution" },
    applicability,
    outcome: "ROUTED",
    rationale: "Question belongs to domain B authority.",
    evidenceRefs: ["evidence:owner-map:1"],
    blockedGateRefs: [],
  });
  assert.equal(routed.sourceOwnerRef, "owner:capability-a");
  assert.equal(routed.targetAuthority?.ownerRef, "owner:domain-b");
  assert.notEqual(routed.sourceOwnerRef, routed.targetAuthority?.ownerRef);
  assert.throws(() => normalizeEKBRoutingRecord({ ...routed, targetPredicate: "copied-domain-b-rule" }), /unexpected field targetPredicate/);
});

test("TASK-476 requires explicit blocked gates for BLOCKED outcome", () => {
  const base = {
    contractVersion: ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
    routingRef: "route:blocked:1",
    sourceOwnerRef: "owner:capability-a",
    targetAuthority: { ownerRef: "owner:domain-b", authorityRef: "authority:domain-b:resolution" },
    applicability,
    outcome: "BLOCKED",
    rationale: "Critical contradiction blocks readiness.",
    evidenceRefs: ["evidence:conflict:1"],
    blockedGateRefs: ["gate:readiness"],
  } as const;
  assert.equal(normalizeEKBRoutingRecord(base).blockedGateRefs[0], "gate:readiness");
  assert.throws(() => normalizeEKBRoutingRecord({ ...base, blockedGateRefs: [] }), /requires at least one blocked gate/);
});
