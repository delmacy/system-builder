import assert from "node:assert/strict";
import test from "node:test";
import {
  FACTORY_JOURNEY_CONTRACT_VERSION,
  normalizeCanonicalFactoryJourney,
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

function canonicalBinding() {
  const journey = {
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
  return {
    contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
    input: { contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION, journey, lineage },
    assemblyPlan: { kind: "AssemblyPlan", systemDefinitionRef: definitionRef, components: [], sourceRefs: [definitionRef], contentHash: assemblyRef },
    validationEvidence: { kind: "ValidationEvidence", assemblyPlanRef: assemblyRef, decision: "PASS", checks: [], evidenceHash: validationRef },
    releaseArtifact: { kind: "ReleaseArtifact", assemblyPlanRef: assemblyRef, validationEvidenceRef: validationRef, artifactHash: releaseArtifactRef, manifest: { compilerVersion: "1", runtimeVersion: "1", files: [] }, environmentSchema: [] },
    publishedRelease: { kind: "PublishedRelease", releaseId: publishedReleaseRef, version: "2.0.0", artifactRef: releaseArtifactRef, artifactHash: releaseArtifactRef, validationEvidenceRef: validationRef, publishedAt: "2026-08-30T00:00:00Z" },
    deploymentRecord: { kind: "DeploymentRecord", deploymentId: deploymentRef, publishedReleaseRef, environmentRef: "environment:prealpha", releaseHash: releaseArtifactRef, startedAt: "2026-08-30T00:01:00Z", status: "succeeded" },
  };
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

test("canonical factory journey normalizes deterministically", () => {
  const first = normalizeCanonicalFactoryJourney(canonicalBinding());
  const second = normalizeCanonicalFactoryJourney(clone(canonicalBinding()));
  assert.deepEqual(first, second);
});

test("canonical validator rejects missing, duplicate and reordered stages", () => {
  const missing = clone(canonicalBinding());
  missing.input.journey.stages.pop();
  assert.throws(() => normalizeCanonicalFactoryJourney(missing), /exactly 6 ordered stages/);

  const duplicate = clone(canonicalBinding());
  duplicate.input.journey.stages[5]!.identityRef = duplicate.input.journey.stages[4]!.identityRef;
  duplicate.deploymentRecord.deploymentId = duplicate.input.journey.stages[4]!.identityRef;
  assert.throws(() => normalizeCanonicalFactoryJourney(duplicate), /duplicate stage identity/);

  const reordered = clone(canonicalBinding());
  [reordered.input.journey.stages[2], reordered.input.journey.stages[3]] = [reordered.input.journey.stages[3]!, reordered.input.journey.stages[2]!];
  assert.throws(() => normalizeCanonicalFactoryJourney(reordered), /stage 3 must be capability-assembly/);
});

test("canonical validator rejects stale or forged predecessor lineage", () => {
  const stale = clone(canonicalBinding());
  stale.input.journey.stages[1]!.provenanceRef = "process-revision:order-fulfillment:v1";
  assert.throws(() => normalizeCanonicalFactoryJourney(stale), /predecessor does not match approved process revision/);

  const forged = clone(canonicalBinding());
  forged.input.journey.stages[2]!.provenanceRef = "system-definition:other:v2";
  assert.throws(() => normalizeCanonicalFactoryJourney(forged), /canonical system-definition identity/);

  const brokenRelease = clone(canonicalBinding());
  brokenRelease.input.journey.stages[4]!.provenanceRef = `sha256:${"f".repeat(64)}`;
  assert.throws(() => normalizeCanonicalFactoryJourney(brokenRelease), /published release chain/);
});

test("canonical validator rejects unknown extra state", () => {
  const extraTopLevel = { ...canonicalBinding(), execute: true };
  assert.throws(() => normalizeCanonicalFactoryJourney(extraTopLevel), /unexpected field execute/);

  const extraStage = clone(canonicalBinding()) as ReturnType<typeof canonicalBinding> & { input: ReturnType<typeof canonicalBinding>["input"] };
  (extraStage.input.journey.stages[0] as typeof extraStage.input.journey.stages[number] & { runtimeAuthority?: boolean }).runtimeAuthority = true;
  assert.throws(() => normalizeCanonicalFactoryJourney(extraStage), /unexpected field runtimeAuthority/);
});
