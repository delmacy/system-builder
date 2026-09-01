import assert from "node:assert/strict";
import test from "node:test";

import { InMemoryArtifactPayloadRepository } from "../../packages/artifact-store/index.js";
import {
  compileSyntheticRelease,
  type CompilerAssemblyPlan,
  type CompilerValidationEvidence,
} from "../../packages/compiler/index.js";
import {
  FACTORY_JOURNEY_CONTRACT_VERSION,
  FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION,
} from "../../packages/contracts/factory-boundary/index.js";
import { PROCESS_SYSTEM_LINEAGE_VERSION } from "../../packages/contracts/process-versioning/lineage.js";
import { PROCESS_VERSION_IDENTITY_VERSION } from "../../packages/contracts/process-versioning/index.js";
import { ReleaseRegistry } from "../../packages/release/index.js";
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
  const revisionRef: string = REFERENCE_PROCESS.revisionRef;
  const revision = {
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef: REFERENCE_PROCESS.artifactRef,
    revisionRef,
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

function requireCompilerPredecessors(result: ReturnType<typeof bootstrap>) {
  const assemblyPlan = result.result.assemblyPlan;
  const validationEvidence = result.result.validationEvidence;
  if (
    typeof assemblyPlan !== "object"
    || assemblyPlan === null
    || !("kind" in assemblyPlan)
    || assemblyPlan.kind !== "AssemblyPlan"
  ) {
    throw new Error("reference baseline assemblyPlan must be canonical AssemblyPlan evidence");
  }
  if (
    typeof validationEvidence !== "object"
    || validationEvidence === null
    || !("kind" in validationEvidence)
    || validationEvidence.kind !== "ValidationEvidence"
  ) {
    throw new Error("reference baseline validationEvidence must be canonical ValidationEvidence");
  }
  return {
    assemblyPlan: assemblyPlan as CompilerAssemblyPlan,
    validationEvidence: validationEvidence as CompilerValidationEvidence,
  };
}

function compileReferenceProcess() {
  const result = bootstrap();
  assert.equal(result.ok, true);
  const predecessors = requireCompilerPredecessors(result);
  const compilation = compileSyntheticRelease({
    ...predecessors,
    compilerVersion: "1.0.0",
    runtimeVersion: "1.0.0",
  });
  return { result, predecessors, compilation };
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

  assert.equal(substituted.journeyBinding.journey.stages[0]?.identityRef, REFERENCE_PROCESS.revisionRef);
  assert.equal(substituted.definition.recipeRef, REFERENCE_PROCESS.revisionRef);
  assert.throws(() => bootstrap(substituted));
});

test("TASK-451 carries the frozen reference process through Compiler verification and canonical Release publication", () => {
  const first = compileReferenceProcess();
  const repeated = compileReferenceProcess();
  assert.deepEqual(first.compilation, repeated.compilation);

  assert.equal(first.predecessors.assemblyPlan.systemDefinitionRef, REFERENCE_PROCESS.definitionRef);
  assert.equal(first.compilation.artifact.assemblyPlanRef, first.predecessors.assemblyPlan.contentHash);
  assert.equal(first.compilation.artifact.validationEvidenceRef, first.predecessors.validationEvidence.evidenceHash);

  const payloads = new InMemoryArtifactPayloadRepository();
  const stored = payloads.publish({
    artifactHash: first.compilation.artifact.artifactHash,
    files: first.compilation.files,
  });
  const repeatedStored = payloads.publish({
    artifactHash: first.compilation.artifact.artifactHash,
    files: first.compilation.files,
  });
  assert.deepEqual(stored, repeatedStored);
  const verified = payloads.getVerified(first.compilation.artifact);
  assert.equal(verified.verified, true);
  assert.deepEqual(verified.files, first.compilation.files);

  const releases = new ReleaseRegistry();
  const published = releases.publish({
    releaseId: "reference-orders-system",
    version: "0.0.1",
    artifact: first.compilation.artifact,
    publishedAt: "2026-09-01T13:40:00.000Z",
  });
  assert.equal(published.kind, "PublishedRelease");
  assert.equal(published.artifactRef, first.compilation.artifact.artifactHash);
  assert.equal(published.artifactHash, first.compilation.artifact.artifactHash);
  assert.equal(published.validationEvidenceRef, first.compilation.artifact.validationEvidenceRef);
  assert.deepEqual(releases.get("reference-orders-system", "0.0.1"), published);
  assert.throws(() => releases.publish({
    releaseId: "reference-orders-system",
    version: "0.0.1",
    artifact: first.compilation.artifact,
    publishedAt: "2026-09-01T13:40:00.000Z",
  }), /RELEASE_DUPLICATE_IDENTITY/);

  const immutableEvidence = JSON.stringify({ artifact: first.compilation.artifact, published, files: verified.files });
  assert.equal(first.compilation.artifact.environmentSchema.length, 0);
  assert.equal(immutableEvidence.includes("EnvironmentProfile"), false);
  assert.equal(immutableEvidence.includes("environment:p19:reference-process"), false);
  assert.equal(immutableEvidence.includes("secret://"), false);
});

test("TASK-451 fails closed on stale project or substituted artifact evidence before Release publication", () => {
  const canonical = compileReferenceProcess();

  const staleValidation: CompilerValidationEvidence = Object.freeze({
    ...canonical.predecessors.validationEvidence,
    assemblyPlanRef: `sha256:${"0".repeat(64)}`,
  });
  const staleReleases = new ReleaseRegistry();
  assert.throws(() => compileSyntheticRelease({
    assemblyPlan: canonical.predecessors.assemblyPlan,
    validationEvidence: staleValidation,
    compilerVersion: "1.0.0",
    runtimeVersion: "1.0.0",
  }), /COMPILER_VALIDATION_ASSEMBLY_MISMATCH/);
  assert.equal(staleReleases.get("reference-orders-system", "0.0.1"), undefined);

  const substitutedFiles = canonical.compilation.files.map((file, index) =>
    index === 0 ? Object.freeze({ ...file, content: `${file.content}\nsubstituted` }) : file,
  );
  const substitutedPayloads = new InMemoryArtifactPayloadRepository();
  substitutedPayloads.publish({
    artifactHash: canonical.compilation.artifact.artifactHash,
    files: substitutedFiles,
  });
  const substitutedReleases = new ReleaseRegistry();
  assert.throws(
    () => substitutedPayloads.getVerified(canonical.compilation.artifact),
    /ARTIFACT_PAYLOAD_FILE_HASH_MISMATCH/,
  );
  assert.equal(substitutedReleases.get("reference-orders-system", "0.0.1"), undefined);
});
