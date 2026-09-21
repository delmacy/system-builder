import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  PRODUCT_PROOF_CLASSES,
  PRODUCT_PROOF_TRACE_STAGES,
  assessProductProofTrace,
  qualifyProductProofEvidence,
  observeProductProof,
  type ProductProofEvidenceQualification,
  type ProductProofObligation,
  type ProductProofTraceArtifactRef,
  type ProductProofTrace,
} from "../../packages/contracts/product-proof";

const obligation: ProductProofObligation = {
  obligationId: "elicitation.requirement.acceptance",
  revision: "r7",
  producer: { ownerId: "elicitation", producerId: "requirements", revision: "r7" },
  acceptanceTarget: { targetId: "REQ-42", revision: "r7" },
  proofClass: "POSITIVE",
};

const observation = observeProductProof(obligation, {
  routeId: "route-2",
  obligationId: obligation.obligationId,
  obligationRevision: "r7",
  producer: obligation.producer,
  evidenceRef: "proof://REQ-42",
  evidenceRevision: "proof-r2",
  observedState: "PASS",
});

const target = {
  evidenceRevision: "proof-r2",
  populationId: "station-fleet-a",
  locality: "station:alpha",
  producer: obligation.producer,
};

const qualification: ProductProofEvidenceQualification = {
  ...target,
  provenance: "producer://requirements/run-7",
  state: "PASS",
  current: true,
};

const traceRef = (stage: ProductProofTraceArtifactRef["stage"], index: number): ProductProofTraceArtifactRef => ({
  stage,
  artifactId: `${stage.toLowerCase()}-${index}`,
  revision: `r${index}`,
  provenance: `producer://${stage.toLowerCase()}/${index}`,
  owner: { ownerId: stage.toLowerCase(), producerId: `producer-${index}`, revision: `r${index}` },
});

const fullTrace: ProductProofTrace = {
  traceId: "trace-REQ-42",
  segments: PRODUCT_PROOF_TRACE_STAGES.slice(0, -1).map((stage, index) => ({
    kind: "LINK" as const,
    from: traceRef(stage, index),
    to: traceRef(PRODUCT_PROOF_TRACE_STAGES[index + 1]!, index + 1),
  })),
};

describe("G2 Product Proof obligation registry", () => {
  it("keeps the four proof classes distinguishable", () => {
    assert.deepEqual(PRODUCT_PROOF_CLASSES, ["POSITIVE", "NEGATIVE", "ADVERSARIAL", "RECOVERY"]);
  });

  it("keeps missing evidence UNKNOWN rather than promoting design or acceptance to PASS", () => {
    assert.equal(observeProductProof(obligation).state, "UNKNOWN");
  });

  it("rejects evidence routed from a different producer revision", () => {
    assert.equal(observeProductProof(obligation, {
      routeId: "route-1",
      obligationId: obligation.obligationId,
      obligationRevision: "r7",
      producer: { ownerId: "elicitation", producerId: "requirements", revision: "r6" },
      evidenceRef: "proof://REQ-42",
      evidenceRevision: "proof-r1",
      observedState: "PASS",
    }).state, "UNKNOWN");
  });

  it("accepts current evidence only for the exact revision population locality and producer", () => {
    assert.deepEqual(qualifyProductProofEvidence(observation, qualification, target), {
      ...observation,
      qualificationState: "PASS",
      current: true,
      populationId: "station-fleet-a",
      locality: "station:alpha",
      provenance: "producer://requirements/run-7",
    });
  });

  it("rejects revision population and locality mismatches instead of strengthening evidence", () => {
    for (const mismatchedTarget of [
      { ...target, evidenceRevision: "proof-r3" },
      { ...target, populationId: "station-fleet-b" },
      { ...target, locality: "station:beta" },
    ]) {
      const result = qualifyProductProofEvidence(observation, qualification, mismatchedTarget);
      assert.equal(result.state, "UNKNOWN");
      assert.equal(result.qualificationState, "UNKNOWN");
    }
  });

  it("makes stale and underqualified evidence visible without promoting it", () => {
    const stale = qualifyProductProofEvidence(observation, { ...qualification, current: false }, target);
    assert.equal(stale.state, "PARTIAL");
    assert.equal(stale.current, false);

    for (const state of ["PARTIAL", "INCONCLUSIVE", "BLOCKED", "NA", "DEFERRED"] as const) {
      const result = qualifyProductProofEvidence(observation, { ...qualification, state }, target);
      assert.equal(result.state, "PARTIAL");
      assert.equal(result.qualificationState, state);
    }
  });

  it("preserves producer-owned identity revision provenance and owner refs across a complete trace", () => {
    const assessment = assessProductProofTrace(fullTrace);
    assert.equal(assessment.continuous, true);
    assert.deepEqual(assessment.gaps, []);
    const first = fullTrace.segments[0];
    assert.equal(first?.kind, "LINK");
    if (first?.kind === "LINK") {
      assert.equal(first.from.revision, "r0");
      assert.equal(first.from.provenance, "producer://elicitation_evidence/0");
      assert.equal(first.from.owner.ownerId, "elicitation_evidence");
    }
  });

  it("keeps broken-chain evidence as an explicit gap instead of fabricating continuity", () => {
    const broken: ProductProofTrace = {
      traceId: "trace-broken",
      segments: [
        ...fullTrace.segments.slice(0, 3),
        { kind: "GAP", fromStage: "STORY_USE_CASE_OR_SCENARIO", toStage: "SEMANTIC_MODEL", reason: "UNKNOWN" },
        ...fullTrace.segments.slice(4),
      ],
    };
    const assessment = assessProductProofTrace(broken);
    assert.equal(assessment.continuous, false);
    assert.deepEqual(assessment.gaps, [
      { kind: "GAP", fromStage: "STORY_USE_CASE_OR_SCENARIO", toStage: "SEMANTIC_MODEL", reason: "UNKNOWN" },
    ]);
  });
});
