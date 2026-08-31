import assert from "node:assert/strict";
import test from "node:test";
import { composeFactoryJourney } from "../../packages/assembly/factory-composition.js";
import {
  resolveFactoryJourneyCapabilities,
  SoftwareCatalogRegistry,
} from "../../packages/catalog/index.js";
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
const releaseId = "orders-system";
const releaseVersion = "0.0.1";

function binding(options: Readonly<{
  systemDefinitionRef?: string;
  capabilityProvenance?: string;
}> = {}) {
  const systemDefinitionRef = options.systemDefinitionRef ?? canonicalSystemDefinitionRef;
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
        {
          kind: "capability-assembly",
          identityRef: "assembly:pending",
          provenanceRef: options.capabilityProvenance ?? systemDefinitionRef,
        },
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

function catalog(includeOrders = true) {
  const registry = new SoftwareCatalogRegistry();
  if (includeOrders) {
    registry.register({ capability: "orders", provider: "builtin", version: "1.0.0" });
  }
  return registry;
}

const definition = {
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
  environmentRef: "environment:p19:proof",
  runtimeVersions: ["1.0.0"],
  bindings: [],
};

function composeWholeFactoryJourney() {
  const journeyBinding = binding();
  const registry = catalog();

  const capabilities = resolveFactoryJourneyCapabilities(registry, journeyBinding, definition);
  assert.equal(capabilities.processRevisionRef, revision.revisionRef);
  assert.equal(capabilities.analysisRef, analysisIdentity.identityRef);
  assert.equal(capabilities.systemDefinitionRef, canonicalSystemDefinitionRef);
  assert.equal(capabilities.resolutions[0]?.candidates[0]?.provider, "builtin");

  const assembled = composeFactoryJourney({ journeyBinding, definition, catalog: registry });
  assert.equal(assembled.assembly.ok, true);
  if (!assembled.assembly.ok) throw new Error("expected canonical assembly");

  const validation = composeFactoryAssemblyValidation({
    journeyBinding,
    recipe: recipeTraceability,
    analysis: analysisTraceability,
    definition: definitionTraceability,
    assemblyPlan: assembled.assembly.plan,
  });
  assert.equal(validation.validationEvidence.decision, "PASS");

  const compiler = composeFactoryCompilerReleaseArtifact({
    journeyBinding,
    assemblyPlan: assembled.assembly.plan,
    validationEvidence: validation.validationEvidence,
    compilerVersion: "1.0.0",
    runtimeVersion: "1.0.0",
  });

  const artifact = compiler.compilation.artifact;
  const published = previewFactoryPublishedRelease({
    releaseId,
    version: releaseVersion,
    artifact,
    publishedAt: "2026-08-31T13:00:00.000Z",
  });

  const deployment = dryRunDeploy({
    publishedRelease: {
      kind: published.kind,
      releaseId: published.releaseId,
      version: published.version,
      artifactRef: published.artifactRef,
      artifactHash: published.artifactHash,
      validationEvidenceRef: published.validationEvidenceRef,
      publishedAt: published.publishedAt,
      status: published.status,
    },
    releaseArtifact: {
      kind: artifact.kind,
      artifactHash: artifact.artifactHash,
      manifest: { runtimeVersion: artifact.manifest.runtimeVersion },
      environmentSchema: artifact.environmentSchema,
    },
    environment,
    acceptanceChecks: [{ name: "wbs-19.1.2-composition", pass: true }],
    startedAt: "2026-08-31T13:01:00.000Z",
    completedAt: "2026-08-31T13:02:00.000Z",
  });
  assert.equal(deployment.ok, true);
  if (!deployment.ok) throw new Error("expected deterministic deployment evidence");

  return {
    capabilities,
    plan: assembled.assembly.plan,
    validation: validation.validationEvidence,
    artifact,
    published,
    deployment: deployment.record,
  };
}

test("WBS 19.1.2 proof composes the canonical process lineage through deployment-record evidence", () => {
  const proof = composeWholeFactoryJourney();
  assert.equal(proof.plan.systemDefinitionRef, canonicalSystemDefinitionRef);
  assert.equal(proof.validation.assemblyPlanRef, proof.plan.contentHash);
  assert.equal(proof.artifact.assemblyPlanRef, proof.plan.contentHash);
  assert.equal(proof.artifact.validationEvidenceRef, proof.validation.evidenceHash);
  assert.equal(proof.published.artifactHash, proof.artifact.artifactHash);
  assert.equal(proof.published.artifactRef, proof.artifact.artifactHash);
  assert.equal(proof.published.validationEvidenceRef, proof.validation.evidenceHash);
  assert.equal(proof.deployment.publishedReleaseRef, `${releaseId}@${releaseVersion}`);
  assert.equal(proof.deployment.releaseHash, proof.artifact.artifactHash);
  assert.equal(proof.deployment.status, "succeeded");
});

test("WBS 19.1.2 proof is deterministic for identical canonical inputs", () => {
  assert.deepEqual(composeWholeFactoryJourney(), composeWholeFactoryJourney());
});

test("WBS 19.1.2 proof fails closed for a stale approved process predecessor", () => {
  assert.throws(
    () => resolveFactoryJourneyCapabilities(catalog(), binding(), {
      ...definition,
      recipeRef: "process-revision:orders:stale",
    }),
    /FACTORY_CAPABILITY_PROCESS_IDENTITY_MISMATCH/,
  );
});

test("WBS 19.1.2 proof fails closed for a missing capability provider", () => {
  assert.throws(
    () => resolveFactoryJourneyCapabilities(catalog(false), binding(), definition),
    /FACTORY_CAPABILITY_RESOLUTION_FAILED:CAPABILITY_NOT_FOUND:orders/,
  );
});

test("WBS 19.1.2 proof fails closed for a lineage-broken capability predecessor", () => {
  assert.throws(
    () => resolveFactoryJourneyCapabilities(
      catalog(),
      binding({ capabilityProvenance: "system-definition:substituted" }),
      definition,
    ),
    /canonical system-definition identity/,
  );
});

test("WBS 19.1.2 proof fails closed for cross-system assembly substitution", () => {
  const canonical = composeFactoryJourney({ journeyBinding: binding(), definition, catalog: catalog() });
  assert.equal(canonical.assembly.ok, true);
  if (!canonical.assembly.ok) return;

  assert.throws(
    () => composeFactoryAssemblyValidation({
      journeyBinding: binding({ systemDefinitionRef: "system-definition:other:v1" }),
      recipe: recipeTraceability,
      analysis: analysisTraceability,
      definition: definitionTraceability,
      assemblyPlan: canonical.assembly.plan,
    }),
    /FACTORY_VALIDATION_SYSTEM_DEFINITION_MISMATCH/,
  );
});

test("WBS 19.1.2 proof fails closed when validation evidence is substituted before compiler", () => {
  const journeyBinding = binding();
  const assembled = composeFactoryJourney({ journeyBinding, definition, catalog: catalog() });
  assert.equal(assembled.assembly.ok, true);
  if (!assembled.assembly.ok) return;
  const validation = composeFactoryAssemblyValidation({
    journeyBinding,
    recipe: recipeTraceability,
    analysis: analysisTraceability,
    definition: definitionTraceability,
    assemblyPlan: assembled.assembly.plan,
  });

  assert.throws(
    () => composeFactoryCompilerReleaseArtifact({
      journeyBinding,
      assemblyPlan: assembled.assembly.plan,
      validationEvidence: {
        ...validation.validationEvidence,
        assemblyPlanRef: `sha256:${"0".repeat(64)}`,
      },
      compilerVersion: "1.0.0",
      runtimeVersion: "1.0.0",
    }),
    /FACTORY_COMPILER_VALIDATION_PREDECESSOR_MISMATCH/,
  );
});

test("WBS 19.1.2 proof fails closed for incompatible deployment environment without mutation", () => {
  const proof = composeWholeFactoryJourney();
  const rejected = dryRunDeploy({
    publishedRelease: {
      kind: proof.published.kind,
      releaseId: proof.published.releaseId,
      version: proof.published.version,
      artifactRef: proof.published.artifactRef,
      artifactHash: proof.published.artifactHash,
      validationEvidenceRef: proof.published.validationEvidenceRef,
      publishedAt: proof.published.publishedAt,
      status: proof.published.status,
    },
    releaseArtifact: {
      kind: proof.artifact.kind,
      artifactHash: proof.artifact.artifactHash,
      manifest: { runtimeVersion: proof.artifact.manifest.runtimeVersion },
      environmentSchema: proof.artifact.environmentSchema,
    },
    environment: { ...environment, runtimeVersions: ["9.9.9"] },
    acceptanceChecks: [{ name: "wbs-19.1.2-composition", pass: true }],
    startedAt: "2026-08-31T13:01:00.000Z",
    completedAt: "2026-08-31T13:02:00.000Z",
  });
  assert.equal(rejected.ok, false);
  if (rejected.ok) return;
  assert.equal(rejected.diagnostic.code, "RUNTIME_INCOMPATIBLE");
});
