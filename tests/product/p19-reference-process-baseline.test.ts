import assert from "node:assert/strict";
import test from "node:test";

import {
  FACTORY_JOURNEY_CONTRACT_VERSION,
  FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION,
} from "../../packages/contracts/factory-boundary/index.js";
import { PROCESS_SYSTEM_LINEAGE_VERSION } from "../../packages/contracts/process-versioning/lineage.js";
import { PROCESS_VERSION_IDENTITY_VERSION } from "../../packages/contracts/process-versioning/index.js";
import { executeFactoryOperatorBootstrap } from "../../scripts/factory-operator-bootstrap-command.js";

const REFERENCE_PROCESS = Object.freeze({
  artifactRef: "process:reference-orders",
  revisionRef: "process-revision:reference-orders:v1",
  analysisRef: "analysis:reference-orders:v1",
  definitionRef: "system-definition:reference-orders:v1",
  capability: "orders",
  requirementRef: "REQ-REFERENCE-1",
});

function referenceFactoryInput() {
  const revision = {
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef: REFERENCE_PROCESS.artifactRef,
    revisionRef: REFERENCE_PROCESS.revisionRef,
    revisionNumber: 1,
    previousRevisionRef: null,
  };
  const analysis = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "analysis" as const,
    identityRef: REFERENCE_PROCESS.analysisRef,
  };
  const definitionIdentity = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "system-definition" as const,
    identityRef: REFERENCE_PROCESS.definitionRef,
  };
  const processRevision = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "process-revision" as const,
    processRevision: revision,
  };

  return {
    journeyBinding: {
      contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
      journey: {
        contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
        stages: [
          { kind: "approved-process", identityRef: revision.revisionRef, provenanceRef: revision.artifactRef },
          { kind: "analysis-definition", identityRef: analysis.identityRef, provenanceRef: revision.revisionRef },
          { kind: "capability-assembly", identityRef: "assembly:pending", provenanceRef: definitionIdentity.identityRef },
          { kind: "validation", identityRef: "validation:pending", provenanceRef: "assembly:pending" },
          { kind: "compiler-release", identityRef: "release:pending", provenanceRef: "validation:pending" },
          { kind: "deployment", identityRef: "deployment:pending", provenanceRef: "release:pending" },
        ],
      },
      lineage: {
        contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
        processRevision,
        analysis,
        systemDefinition: definitionIdentity,
        hops: [
          {
            contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
            kind: "process-revision-to-analysis" as const,
            from: processRevision,
            to: analysis,
          },
          {
            contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
            kind: "analysis-to-system-definition" as const,
            from: analysis,
            to: definitionIdentity,
          },
        ],
      },
    },
    definition: {
      definition: "SystemDefinition" as const,
      analysisRef: analysis.identityRef,
      recipeRef: revision.revisionRef,
      capabilities: [
        {
          id: REFERENCE_PROCESS.capability,
          capability: REFERENCE_PROCESS.capability,
          requirementRefs: [REFERENCE_PROCESS.requirementRef],
        },
      ],
    },
    catalogEntries: [{ capability: REFERENCE_PROCESS.capability, provider: "builtin", version: "1.0.0" }],
    recipeTraceability: {
      modules: [{ requirementIds: [REFERENCE_PROCESS.requirementRef] }],
      rules: [],
      responsibilities: [],
      exceptions: [],
    },
    analysisTraceability: { findings: [{ recipeRequirementRefs: [REFERENCE_PROCESS.requirementRef] }] },
    definitionTraceability: {
      entities: [],
      processes: [],
      actions: [],
      capabilities: [
        { capability: REFERENCE_PROCESS.capability, requirementRefs: [REFERENCE_PROCESS.requirementRef] },
      ],
      views: [],
      policies: [],
      integrations: [],
    },
    compilerVersion: "1.0.0",
    runtimeVersion: "1.0.0",
    releaseId: "reference-orders-system",
    releaseVersion: "0.0.1",
    publishedAt: "2026-09-01T13:40:00.000Z",
    environment: {
      kind: "EnvironmentProfile" as const,
      environmentRef: "environment:p19:reference-process",
      runtimeVersions: ["1.0.0"],
      bindings: [],
    },
    acceptanceChecks: [{ name: "factory-e2e", pass: true }],
    startedAt: "2026-09-01T13:39:00.000Z",
    completedAt: "2026-09-01T13:40:00.000Z",
  };
}

function bootstrap(input = referenceFactoryInput()) {
  return executeFactoryOperatorBootstrap({
    contractVersion: FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION,
    prerequisites: {
      nodeVersion: "24.0.0",
      npmVersion: "11.0.0",
      factoryE2EAvailable: true,
    },
    config: { inputPath: "fixture://p19-reference-process-baseline" },
    factoryInput: input,
  });
}

test("TASK-450 freezes one deterministic canonical reference-process baseline", () => {
  const first = bootstrap();
  const repeated = bootstrap();

  assert.equal(first.ok, true);
  assert.deepEqual(first, repeated);

  const input = referenceFactoryInput();
  assert.equal(input.journeyBinding.lineage.processRevision.processRevision.artifactRef, REFERENCE_PROCESS.artifactRef);
  assert.equal(input.journeyBinding.lineage.processRevision.processRevision.revisionRef, REFERENCE_PROCESS.revisionRef);
  assert.equal(input.journeyBinding.lineage.analysis.identityRef, REFERENCE_PROCESS.analysisRef);
  assert.equal(input.journeyBinding.lineage.systemDefinition.identityRef, REFERENCE_PROCESS.definitionRef);
  assert.equal(input.definition.analysisRef, REFERENCE_PROCESS.analysisRef);
  assert.equal(input.definition.recipeRef, REFERENCE_PROCESS.revisionRef);

  const artifactEvidence = JSON.stringify({
    assemblyPlan: first.result.assemblyPlan,
    validationEvidence: first.result.validationEvidence,
    releaseArtifact: first.result.releaseArtifact,
  });
  assert.equal(artifactEvidence.includes("EnvironmentProfile"), false);
  assert.equal(artifactEvidence.includes("environment:p19:reference-process"), false);
  assert.equal(artifactEvidence.includes("secret://"), false);
});

test("TASK-450 rejects substituted process lineage through the canonical supported seam", () => {
  const substituted = referenceFactoryInput();
  substituted.journeyBinding.lineage.processRevision.processRevision.revisionRef =
    "process-revision:reference-orders:substituted";

  assert.throws(() => bootstrap(substituted));
});
