import assert from "node:assert/strict";
import test from "node:test";
import { composeFactoryJourney } from "../../packages/assembly/factory-composition.js";
import { SoftwareCatalogRegistry } from "../../packages/catalog/index.js";
import { FACTORY_JOURNEY_CONTRACT_VERSION } from "../../packages/contracts/factory-boundary/journey.js";
import { PROCESS_SYSTEM_LINEAGE_VERSION } from "../../packages/contracts/process-versioning/lineage.js";
import { PROCESS_VERSION_IDENTITY_VERSION } from "../../packages/contracts/process-versioning/index.js";
import { composeFactoryCompilerReleaseArtifact } from "../../packages/compiler/factory-composition.js";
import { dryRunDeploy } from "../../packages/deploy/index.js";
import { previewFactoryPublishedRelease } from "../../packages/release/factory-preview.js";
import { composeFactoryAssemblyValidation } from "../../packages/validation/factory-composition.js";

const revision = {
  contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
  artifactRef: "process:orders",
  revisionRef: "process-revision:orders:v1",
  revisionNumber: 1,
  previousRevisionRef: null,
};
const analysisIdentity = {
  contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
  kind: "analysis" as const,
  identityRef: "analysis:orders:v1",
};
const canonicalSystemDefinitionRef = "system-definition:orders:v1";

function binding(systemDefinitionRef = canonicalSystemDefinitionRef) {
  const process = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "process-revision" as const,
    processRevision: revision,
  };
  const definitionIdentity = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "system-definition" as const,
    identityRef: systemDefinitionRef,
  };
  return {
    contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
    journey: {
      contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
      stages: [
        { kind: "approved-process", identityRef: revision.revisionRef, provenanceRef: revision.artifactRef },
        { kind: "analysis-definition", identityRef: analysisIdentity.identityRef, provenanceRef: revision.revisionRef },
        { kind: "capability-assembly", identityRef: "assembly:pending", provenanceRef: systemDefinitionRef },
        { kind: "validation", identityRef: "validation:pending", provenanceRef: "assembly:pending" },
        { kind: "compiler-release", identityRef: "release:pending", provenanceRef: "validation:pending" },
        { kind: "deployment", identityRef: "deployment:pending", provenanceRef: "release:pending" },
      ],
    },
    lineage: {
      contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
      processRevision: process,
      analysis: analysisIdentity,
      systemDefinition: definitionIdentity,
      hops: [
        {
          contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
          kind: "process-revision-to-analysis" as const,
          from: process,
          to: analysisIdentity,
        },
        {
          contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
          kind: "analysis-to-system-definition" as const,
          from: analysisIdentity,
          to: definitionIdentity,
        },
      ] as const,
    },
  };
}

function catalog() {
  const registry = new SoftwareCatalogRegistry();
  registry.register({ capability: "orders", provider: "builtin", version: "1.0.0" });
  return registry;
}

const systemDefinition = {
  definition: "SystemDefinition" as const,
  analysisRef: analysisIdentity.identityRef,
  recipeRef: revision.revisionRef,
  capabilities: [{ id: "orders", capability: "orders", requirementRefs: ["REQ-1"] }],
};
const recipeTraceability = {
  modules: [{ requirementIds: ["REQ-1"] }],
  rules: [],
  responsibilities: [],
  exceptions: [],
};
const analysisTraceability = { findings: [{ recipeRequirementRefs: ["REQ-1"] }] };
const definitionTraceability = {
  entities: [],
  processes: [],
  actions: [],
  capabilities: [{ capability: "orders", requirementRefs: ["REQ-1"] }],
  views: [],
  policies: [],
  integrations: [],
};
const environment = {
  kind: "EnvironmentProfile" as const,
  environmentRef: "environment:p19:preview",
  runtimeVersions: ["1.0.0"],
  bindings: [],
};

function validatedChain() {
  const journeyBinding = binding();
  const assembled = composeFactoryJourney({
    journeyBinding,
    definition: systemDefinition,
    catalog: catalog(),
  });
  assert.equal(assembled.assembly.ok, true);
  if (!assembled.assembly.ok) throw new Error("expected assembly success");

  const validation = composeFactoryAssemblyValidation({
    journeyBinding,
    recipe: recipeTraceability,
    analysis: analysisTraceability,
    definition: definitionTraceability,
    assemblyPlan: assembled.assembly.plan,
  });
  assert.equal(validation.validationEvidence.decision, "PASS");
  return { journeyBinding, plan: assembled.assembly.plan, validationEvidence: validation.validationEvidence };
}

function downstreamChain() {
  const validated = validatedChain();
  const compiler = composeFactoryCompilerReleaseArtifact({
    journeyBinding: validated.journeyBinding,
    assemblyPlan: validated.plan,
    validationEvidence: validated.validationEvidence,
    compilerVersion: "1.0.0",
    runtimeVersion: "1.0.0",
  });
  const artifact = compiler.compilation.artifact;
  const published = previewFactoryPublishedRelease({
    releaseId: "orders-system",
    version: "0.0.1",
    artifact,
    publishedAt: "2026-08-31T12:00:00.000Z",
  });
  const deployPublishedRelease = {
    kind: published.kind,
    releaseId: published.releaseId,
    version: published.version,
    artifactRef: published.artifactRef,
    artifactHash: published.artifactHash,
    validationEvidenceRef: published.validationEvidenceRef,
    publishedAt: published.publishedAt,
    status: published.status,
  };
  const deployArtifact = {
    kind: artifact.kind,
    artifactHash: artifact.artifactHash,
    manifest: { runtimeVersion: artifact.manifest.runtimeVersion },
    environmentSchema: artifact.environmentSchema,
  };
  const deployment = dryRunDeploy({
    publishedRelease: deployPublishedRelease,
    releaseArtifact: deployArtifact,
    environment,
    acceptanceChecks: [{ name: "factory-composition", pass: true }],
    startedAt: "2026-08-31T12:01:00.000Z",
    completedAt: "2026-08-31T12:02:00.000Z",
  });
  assert.equal(deployment.ok, true);
  if (!deployment.ok) throw new Error("expected deployment dry-run success");
  return { validated, compiler, artifact, published, deployPublishedRelease, deployArtifact, deployment };
}

test("factory downstream composition preserves exact validation, artifact, release and deployment predecessor identities", () => {
  const result = downstreamChain();
  assert.equal(result.compiler.assemblyPlanRef, result.validated.plan.contentHash);
  assert.equal(result.compiler.validationEvidenceRef, result.validated.validationEvidence.evidenceHash);
  assert.equal(result.artifact.assemblyPlanRef, result.validated.plan.contentHash);
  assert.equal(result.artifact.validationEvidenceRef, result.validated.validationEvidence.evidenceHash);
  assert.equal(result.published.artifactRef, result.artifact.artifactHash);
  assert.equal(result.published.artifactHash, result.artifact.artifactHash);
  assert.equal(result.published.validationEvidenceRef, result.validated.validationEvidence.evidenceHash);
  assert.equal(result.deployment.record.publishedReleaseRef, "orders-system@0.0.1");
  assert.equal(result.deployment.record.releaseHash, result.artifact.artifactHash);
});

test("factory downstream composition is deterministic for repeated canonical inputs", () => {
  assert.deepEqual(downstreamChain(), downstreamChain());
});

test("factory compiler rejects cross-system assembly lineage", () => {
  const validated = validatedChain();
  assert.throws(
    () => composeFactoryCompilerReleaseArtifact({
      journeyBinding: binding("system-definition:other:v1"),
      assemblyPlan: validated.plan,
      validationEvidence: validated.validationEvidence,
      compilerVersion: "1.0.0",
      runtimeVersion: "1.0.0",
    }),
    /FACTORY_COMPILER_SYSTEM_DEFINITION_MISMATCH/,
  );
});

test("factory compiler rejects substituted validation predecessor identity", () => {
  const validated = validatedChain();
  assert.throws(
    () => composeFactoryCompilerReleaseArtifact({
      journeyBinding: validated.journeyBinding,
      assemblyPlan: validated.plan,
      validationEvidence: {
        ...validated.validationEvidence,
        assemblyPlanRef: `sha256:${"0".repeat(64)}`,
      },
      compilerVersion: "1.0.0",
      runtimeVersion: "1.0.0",
    }),
    /FACTORY_COMPILER_VALIDATION_PREDECESSOR_MISMATCH/,
  );
});

test("factory compiler fails closed when validation is not PASS", () => {
  const validated = validatedChain();
  assert.throws(
    () => composeFactoryCompilerReleaseArtifact({
      journeyBinding: validated.journeyBinding,
      assemblyPlan: validated.plan,
      validationEvidence: { ...validated.validationEvidence, decision: "FAIL" as const },
      compilerVersion: "1.0.0",
      runtimeVersion: "1.0.0",
    }),
    /COMPILER_VALIDATION_FAILED/,
  );
});

test("factory release preview rejects an invalid compiler artifact identity", () => {
  assert.throws(
    () => previewFactoryPublishedRelease({
      releaseId: "orders-system",
      version: "0.0.1",
      artifact: {
        kind: "ReleaseArtifact",
        artifactHash: "not-a-hash",
        validationEvidenceRef: `sha256:${"1".repeat(64)}`,
      },
      publishedAt: "2026-08-31T12:00:00.000Z",
    }),
    /RELEASE_INVALID_ARTIFACT_HASH/,
  );
});

test("factory deployment preview rejects an artifact substituted after release derivation", () => {
  const result = downstreamChain();
  const rejected = dryRunDeploy({
    publishedRelease: result.deployPublishedRelease,
    releaseArtifact: { ...result.deployArtifact, artifactHash: `sha256:${"0".repeat(64)}` },
    environment,
    acceptanceChecks: [{ name: "factory-composition", pass: true }],
    startedAt: "2026-08-31T12:01:00.000Z",
    completedAt: "2026-08-31T12:02:00.000Z",
  });
  assert.equal(rejected.ok, false);
  if (rejected.ok) return;
  assert.equal(rejected.diagnostic.code, "ARTIFACT_MISMATCH");
});

test("factory deployment preview rejects incompatible runtime input", () => {
  const result = downstreamChain();
  const rejected = dryRunDeploy({
    publishedRelease: result.deployPublishedRelease,
    releaseArtifact: result.deployArtifact,
    environment: { ...environment, runtimeVersions: ["9.9.9"] },
    acceptanceChecks: [{ name: "factory-composition", pass: true }],
    startedAt: "2026-08-31T12:01:00.000Z",
    completedAt: "2026-08-31T12:02:00.000Z",
  });
  assert.equal(rejected.ok, false);
  if (rejected.ok) return;
  assert.equal(rejected.diagnostic.code, "RUNTIME_INCOMPATIBLE");
});
