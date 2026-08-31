import assert from "node:assert/strict";
import test from "node:test";
import {
  FACTORY_JOURNEY_CONTRACT_VERSION,
  normalizeFactoryJourneyInputBinding,
} from "../../packages/contracts/factory-boundary/index.js";
import { PROCESS_SYSTEM_LINEAGE_VERSION } from "../../packages/contracts/process-versioning/lineage.js";
import { PROCESS_VERSION_IDENTITY_VERSION } from "../../packages/contracts/process-versioning/index.js";

const processRevision = {
  contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
  artifactRef: "process:order-fulfillment",
  revisionRef: "process-revision:order-fulfillment:v2",
  revisionNumber: 2,
  previousRevisionRef: "process-revision:order-fulfillment:v1",
};
const analysisRef = "analysis:order-fulfillment:v2";
const definitionRef = "system-definition:order-fulfillment:v2";

const processEndpoint = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "process-revision" as const, processRevision };
const analysisEndpoint = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "analysis" as const, identityRef: analysisRef };
const definitionEndpoint = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "system-definition" as const, identityRef: definitionRef };

const lineage = {
  contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
  processRevision: processEndpoint,
  analysis: analysisEndpoint,
  systemDefinition: definitionEndpoint,
  hops: [
    { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "process-revision-to-analysis" as const, from: processEndpoint, to: analysisEndpoint },
    { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "analysis-to-system-definition" as const, from: analysisEndpoint, to: definitionEndpoint },
  ],
};

function journey() {
  return {
    contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
    stages: [
      { kind: "approved-process", identityRef: processRevision.revisionRef, provenanceRef: processRevision.artifactRef },
      { kind: "analysis-definition", identityRef: analysisRef, provenanceRef: processRevision.revisionRef },
      { kind: "capability-assembly", identityRef: "assembly:order-fulfillment:v2", provenanceRef: definitionRef },
      { kind: "validation", identityRef: "validation:order-fulfillment:v2", provenanceRef: "assembly:order-fulfillment:v2" },
      { kind: "compiler-release", identityRef: "release:order-fulfillment:v2", provenanceRef: "validation:order-fulfillment:v2" },
      { kind: "deployment", identityRef: "deployment:order-fulfillment:v2", provenanceRef: "release:order-fulfillment:v2" },
    ],
  };
}

function binding(overrides: Record<string, unknown> = {}) {
  return { contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION, journey: journey(), lineage, ...overrides };
}

test("factory journey binds exact canonical process, analysis and definition predecessors", () => {
  const normalized = normalizeFactoryJourneyInputBinding(binding());
  assert.equal(normalized.lineage.processRevision.processRevision.revisionRef, processRevision.revisionRef);
  assert.equal(normalized.journey.stages[1]?.identityRef, analysisRef);
  assert.equal(normalized.journey.stages[2]?.provenanceRef, definitionRef);
});

test("factory journey fails closed on stale or mismatched process predecessor", () => {
  const stale = journey();
  stale.stages[0]!.identityRef = processRevision.previousRevisionRef!;
  assert.throws(() => normalizeFactoryJourneyInputBinding(binding({ journey: stale })), /does not match canonical process/);

  const mismatched = journey();
  mismatched.stages[0]!.provenanceRef = "process:other";
  assert.throws(() => normalizeFactoryJourneyInputBinding(binding({ journey: mismatched })), /does not match canonical process/);
});

test("factory journey fails closed on missing or reversed analysis predecessor", () => {
  const missing = journey();
  missing.stages[1]!.provenanceRef = "process-revision:missing";
  assert.throws(() => normalizeFactoryJourneyInputBinding(binding({ journey: missing })), /predecessor does not match approved process revision/);

  const reversed = journey();
  reversed.stages[1]!.identityRef = definitionRef;
  reversed.stages[2]!.provenanceRef = analysisRef;
  assert.throws(() => normalizeFactoryJourneyInputBinding(binding({ journey: reversed })), /does not match canonical analysis identity/);
});

test("factory journey refuses mismatched system-definition predecessor without adding authority", () => {
  const mismatched = journey();
  mismatched.stages[2]!.provenanceRef = "system-definition:stale";
  assert.throws(() => normalizeFactoryJourneyInputBinding(binding({ journey: mismatched })), /canonical system-definition identity/);

  assert.throws(() => normalizeFactoryJourneyInputBinding({ ...binding(), humanDecisionAuthority: true }), /unexpected field humanDecisionAuthority/);
});
