import assert from "node:assert/strict";
import test from "node:test";
import {
  FACTORY_JOURNEY_CONTRACT_VERSION,
  normalizeCanonicalFactoryJourney,
} from "../../packages/contracts/factory-boundary/index.js";
import {
  PROCESS_SYSTEM_LINEAGE_VERSION,
  type ProcessAnalysisDefinitionLineage,
} from "../../packages/contracts/process-versioning/lineage.js";
import { PROCESS_VERSION_IDENTITY_VERSION } from "../../packages/contracts/process-versioning/index.js";

const refs = Object.freeze({
  processArtifact: "process:order-fulfillment",
  processRevision: "process-revision:order-fulfillment:v2",
  previousProcessRevision: "process-revision:order-fulfillment:v1",
  analysis: "analysis:order-fulfillment:v2",
  systemDefinition: "system-definition:order-fulfillment:v2",
  assemblyPlan: `sha256:${"a".repeat(64)}`,
  validationEvidence: `sha256:${"b".repeat(64)}`,
  releaseArtifact: `sha256:${"c".repeat(64)}`,
  publishedRelease: "release:order-fulfillment:v2",
  deployment: "deployment:order-fulfillment:v2",
});

function lineage(): ProcessAnalysisDefinitionLineage {
  const processRevision = {
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef: refs.processArtifact,
    revisionRef: refs.processRevision,
    revisionNumber: 2,
    previousRevisionRef: refs.previousProcessRevision,
  };
  const processEndpoint = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "process-revision" as const,
    processRevision,
  };
  const analysisEndpoint = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "analysis" as const,
    identityRef: refs.analysis,
  };
  const systemDefinitionEndpoint = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "system-definition" as const,
    identityRef: refs.systemDefinition,
  };
  return {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    processRevision: processEndpoint,
    analysis: analysisEndpoint,
    systemDefinition: systemDefinitionEndpoint,
    hops: [
      {
        contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
        kind: "process-revision-to-analysis",
        from: processEndpoint,
        to: analysisEndpoint,
      },
      {
        contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
        kind: "analysis-to-system-definition",
        from: analysisEndpoint,
        to: systemDefinitionEndpoint,
      },
    ],
  };
}

function canonicalBinding() {
  return {
    contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
    input: {
      contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
      lineage: lineage(),
      journey: {
        contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
        stages: [
          { kind: "approved-process", identityRef: refs.processRevision, provenanceRef: refs.processArtifact },
          { kind: "analysis-definition", identityRef: refs.analysis, provenanceRef: refs.processRevision },
          { kind: "capability-assembly", identityRef: refs.assemblyPlan, provenanceRef: refs.systemDefinition },
          { kind: "validation", identityRef: refs.validationEvidence, provenanceRef: refs.assemblyPlan },
          { kind: "compiler-release", identityRef: refs.publishedRelease, provenanceRef: refs.validationEvidence },
          { kind: "deployment", identityRef: refs.deployment, provenanceRef: refs.publishedRelease },
        ],
      },
    },
    assemblyPlan: {
      kind: "AssemblyPlan",
      systemDefinitionRef: refs.systemDefinition,
      components: [],
      sourceRefs: [refs.systemDefinition],
      contentHash: refs.assemblyPlan,
    },
    validationEvidence: {
      kind: "ValidationEvidence",
      assemblyPlanRef: refs.assemblyPlan,
      decision: "PASS",
      checks: [],
      evidenceHash: refs.validationEvidence,
    },
    releaseArtifact: {
      kind: "ReleaseArtifact",
      assemblyPlanRef: refs.assemblyPlan,
      validationEvidenceRef: refs.validationEvidence,
      artifactHash: refs.releaseArtifact,
      manifest: { compilerVersion: "1", runtimeVersion: "1", files: [] },
      environmentSchema: [],
    },
    publishedRelease: {
      kind: "PublishedRelease",
      releaseId: refs.publishedRelease,
      version: "2.0.0",
      artifactRef: refs.releaseArtifact,
      artifactHash: refs.releaseArtifact,
      validationEvidenceRef: refs.validationEvidence,
      publishedAt: "2026-08-30T00:00:00Z",
    },
    deploymentRecord: {
      kind: "DeploymentRecord",
      deploymentId: refs.deployment,
      publishedReleaseRef: refs.publishedRelease,
      environmentRef: "environment:prealpha",
      releaseHash: refs.releaseArtifact,
      startedAt: "2026-08-30T00:01:00Z",
      status: "succeeded",
    },
  };
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

test("WBS 19.1.1 proves one canonical full factory journey over public predecessor identities", () => {
  const normalized = normalizeCanonicalFactoryJourney(canonicalBinding());
  assert.deepEqual(normalized.references, {
    systemDefinitionRef: refs.systemDefinition,
    assemblyPlanRef: refs.assemblyPlan,
    validationEvidenceRef: refs.validationEvidence,
    releaseArtifactRef: refs.releaseArtifact,
    publishedReleaseRef: refs.publishedRelease,
    deploymentRef: refs.deployment,
  });
  assert.deepEqual(
    normalized.input.journey.stages.map(({ kind, identityRef, provenanceRef }) => ({ kind, identityRef, provenanceRef })),
    [
      { kind: "approved-process", identityRef: refs.processRevision, provenanceRef: refs.processArtifact },
      { kind: "analysis-definition", identityRef: refs.analysis, provenanceRef: refs.processRevision },
      { kind: "capability-assembly", identityRef: refs.assemblyPlan, provenanceRef: refs.systemDefinition },
      { kind: "validation", identityRef: refs.validationEvidence, provenanceRef: refs.assemblyPlan },
      { kind: "compiler-release", identityRef: refs.publishedRelease, provenanceRef: refs.validationEvidence },
      { kind: "deployment", identityRef: refs.deployment, provenanceRef: refs.publishedRelease },
    ],
  );
});

test("WBS 19.1.1 rejects missing, stale, duplicate and reordered canonical stages", () => {
  const missing = clone(canonicalBinding());
  missing.input.journey.stages.pop();
  assert.throws(() => normalizeCanonicalFactoryJourney(missing), /exactly 6 ordered stages/);

  const stale = clone(canonicalBinding());
  (stale.input.lineage.processRevision.processRevision as { revisionRef: string }).revisionRef = refs.previousProcessRevision;
  assert.throws(() => normalizeCanonicalFactoryJourney(stale), /approved-process stage does not match canonical process artifact\/revision identity/);

  const duplicate = clone(canonicalBinding());
  duplicate.input.journey.stages[5]!.identityRef = refs.publishedRelease;
  (duplicate.deploymentRecord as { deploymentId: string }).deploymentId = refs.publishedRelease;
  assert.throws(() => normalizeCanonicalFactoryJourney(duplicate), /duplicate stage identity/);

  const reordered = clone(canonicalBinding());
  [reordered.input.journey.stages[3], reordered.input.journey.stages[4]] = [reordered.input.journey.stages[4]!, reordered.input.journey.stages[3]!];
  assert.throws(() => normalizeCanonicalFactoryJourney(reordered), /stage 4 must be validation/);
});

test("WBS 19.1.1 rejects substituted and lineage-broken identities", () => {
  const substituted = clone(canonicalBinding());
  substituted.releaseArtifact.validationEvidenceRef = `sha256:${"d".repeat(64)}`;
  assert.throws(() => normalizeCanonicalFactoryJourney(substituted), /exact ValidationEvidence identity/);

  const brokenLineage = clone(canonicalBinding());
  const originalLineage = brokenLineage.input.lineage;
  brokenLineage.input.lineage = {
    ...originalLineage,
    hops: [
      originalLineage.hops[0],
      {
        ...originalLineage.hops[1],
        from: {
          contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
          kind: "analysis",
          identityRef: "analysis:other:v2",
        },
      },
    ],
  };
  assert.throws(() => normalizeCanonicalFactoryJourney(brokenLineage), /analysis-to-definition hop does not match declared endpoints/);
});

test("repository or model metadata cannot substitute business authority or canonical identity", () => {
  const metadataOnly = clone(canonicalBinding()) as ReturnType<typeof canonicalBinding> & Record<string, unknown>;
  (metadataOnly.input.journey.stages[0] as { identityRef: string }).identityRef = "git:commit:abc123";
  metadataOnly.model = "gpt-5.6";
  metadataOnly.pullRequest = 999;
  metadataOnly.classification = "approved";
  assert.throws(() => normalizeCanonicalFactoryJourney(metadataOnly), /unexpected field model/);

  const gitIdentity = clone(canonicalBinding());
  (gitIdentity.input.journey.stages[0] as { identityRef: string }).identityRef = "git:commit:abc123";
  assert.throws(() => normalizeCanonicalFactoryJourney(gitIdentity), /canonical process artifact\/revision identity/);
});
