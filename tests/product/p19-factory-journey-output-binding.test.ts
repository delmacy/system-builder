import assert from "node:assert/strict";
import test from "node:test";
import {
  FACTORY_JOURNEY_CONTRACT_VERSION,
  normalizeFactoryJourneyOutputBinding,
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
const assemblyRef = `sha256:${"a".repeat(64)}`;
const validationRef = `sha256:${"b".repeat(64)}`;
const releaseArtifactRef = `sha256:${"c".repeat(64)}`;
const publishedReleaseRef = "release:order-fulfillment:v2";
const deploymentRef = "deployment:order-fulfillment:v2";

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
      { kind: "capability-assembly", identityRef: assemblyRef, provenanceRef: definitionRef },
      { kind: "validation", identityRef: validationRef, provenanceRef: assemblyRef },
      { kind: "compiler-release", identityRef: publishedReleaseRef, provenanceRef: validationRef },
      { kind: "deployment", identityRef: deploymentRef, provenanceRef: publishedReleaseRef },
    ],
  };
}

function binding(overrides: Record<string, unknown> = {}) {
  const input = { contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION, journey: journey(), lineage };
  return {
    contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
    input,
    assemblyPlan: {
      kind: "AssemblyPlan",
      systemDefinitionRef: definitionRef,
      components: [],
      sourceRefs: [definitionRef],
      contentHash: assemblyRef,
    },
    validationEvidence: {
      kind: "ValidationEvidence",
      assemblyPlanRef: assemblyRef,
      decision: "PASS",
      checks: [{ id: "factory", status: "PASS" }],
      evidenceHash: validationRef,
    },
    releaseArtifact: {
      kind: "ReleaseArtifact",
      assemblyPlanRef: assemblyRef,
      validationEvidenceRef: validationRef,
      artifactHash: releaseArtifactRef,
      manifest: { compilerVersion: "1", runtimeVersion: "1", files: [] },
      environmentSchema: [],
    },
    publishedRelease: {
      kind: "PublishedRelease",
      releaseId: publishedReleaseRef,
      version: "2.0.0",
      artifactRef: releaseArtifactRef,
      artifactHash: releaseArtifactRef,
      validationEvidenceRef: validationRef,
      publishedAt: "2026-08-30T00:00:00Z",
    },
    deploymentRecord: {
      kind: "DeploymentRecord",
      deploymentId: deploymentRef,
      publishedReleaseRef,
      environmentRef: "environment:prealpha",
      releaseHash: releaseArtifactRef,
      startedAt: "2026-08-30T00:01:00Z",
      status: "succeeded",
    },
    ...overrides,
  };
}

test("factory journey binds exact definition through deployment identities using public artifact contracts", () => {
  const normalized = normalizeFactoryJourneyOutputBinding(binding());
  assert.deepEqual(normalized.references, {
    systemDefinitionRef: definitionRef,
    assemblyPlanRef: assemblyRef,
    validationEvidenceRef: validationRef,
    releaseArtifactRef,
    publishedReleaseRef,
    deploymentRef,
  });
});

test("factory journey rejects cross-system or substituted AssemblyPlan identity", () => {
  assert.throws(
    () => normalizeFactoryJourneyOutputBinding(binding({ assemblyPlan: { ...binding().assemblyPlan as object, systemDefinitionRef: "system-definition:other" } })),
    /canonical system-definition identity/,
  );
  const substituted = journey();
  substituted.stages[2]!.identityRef = `sha256:${"d".repeat(64)}`;
  assert.throws(
    () => normalizeFactoryJourneyOutputBinding(binding({ input: { ...binding().input as object, journey: substituted } })),
    /exact AssemblyPlan identity/,
  );
});

test("factory journey rejects missing or substituted validation and release predecessors", () => {
  const missingValidation = { ...binding().validationEvidence as Record<string, unknown> };
  delete missingValidation.assemblyPlanRef;
  assert.throws(() => normalizeFactoryJourneyOutputBinding(binding({ validationEvidence: missingValidation })), /missing field assemblyPlanRef/);

  assert.throws(
    () => normalizeFactoryJourneyOutputBinding(binding({ releaseArtifact: { ...binding().releaseArtifact as object, validationEvidenceRef: "validation:other" } })),
    /exact ValidationEvidence identity/,
  );
  assert.throws(
    () => normalizeFactoryJourneyOutputBinding(binding({ publishedRelease: { ...binding().publishedRelease as object, artifactRef: "artifact:substituted" } })),
    /exact ReleaseArtifact identity/,
  );
});

test("factory journey rejects substituted deployment predecessor without release or deploy side effects", () => {
  assert.throws(
    () => normalizeFactoryJourneyOutputBinding(binding({ deploymentRecord: { ...binding().deploymentRecord as object, publishedReleaseRef: "release:other" } })),
    /exact PublishedRelease identity/,
  );
  assert.throws(
    () => normalizeFactoryJourneyOutputBinding({ ...binding(), executeDeployment: true }),
    /unexpected field executeDeployment/,
  );
});
