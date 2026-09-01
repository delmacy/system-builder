import assert from "node:assert/strict";
import test from "node:test";

import { InMemoryArtifactPayloadRepository } from "../../packages/artifact-store/index.js";
import { compileSyntheticRelease, type CompilerAssemblyPlan, type CompilerValidationEvidence } from "../../packages/compiler/index.js";
import { FACTORY_JOURNEY_CONTRACT_VERSION, FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION } from "../../packages/contracts/factory-boundary/index.js";
import { PROCESS_SYSTEM_LINEAGE_VERSION } from "../../packages/contracts/process-versioning/lineage.js";
import { PROCESS_VERSION_IDENTITY_VERSION } from "../../packages/contracts/process-versioning/index.js";
import { SingleHostActiveRuntimeOrchestrator } from "../../packages/deploy/active-runtime.js";
import { DeploymentRegistry, InMemoryDeploymentRecordStorage } from "../../packages/deploy/index.js";
import { DeploymentObservation, publish as publishObservation } from "../../packages/observe/index.js";
import { ReleaseRegistry } from "../../packages/release/index.js";
import { executeFactoryOperatorBootstrap } from "../../scripts/factory-operator-bootstrap-command.js";

const REFERENCE = Object.freeze({
  artifactRef: "process:reference-orders",
  revisionRef: "process-revision:reference-orders:v1",
  analysisRef: "analysis:reference-orders:v1",
  definitionRef: "system-definition:reference-orders:v1",
  environmentRef: "environment:p19:reference-process",
});
const SECRET = "task-456-reference-secret-must-never-leak";

function bootstrap(version: string, publishedAt: string) {
  const revision = {
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef: REFERENCE.artifactRef,
    revisionRef: REFERENCE.revisionRef,
    revisionNumber: 1,
    previousRevisionRef: null,
  };
  const analysis = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "analysis" as const,
    identityRef: REFERENCE.analysisRef,
  };
  const definitionIdentity = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "system-definition" as const,
    identityRef: REFERENCE.definitionRef,
  };
  const processRevision = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "process-revision" as const,
    processRevision: revision,
  };

  return executeFactoryOperatorBootstrap({
    contractVersion: FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION,
    prerequisites: { nodeVersion: "24.0.0", npmVersion: "11.0.0", factoryE2EAvailable: true },
    config: { inputPath: "fixture://p19-reference-product-growing-proof" },
    factoryInput: {
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
            { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "process-revision-to-analysis" as const, from: processRevision, to: analysis },
            { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "analysis-to-system-definition" as const, from: analysis, to: definitionIdentity },
          ],
        },
      },
      definition: {
        definition: "SystemDefinition" as const,
        analysisRef: analysis.identityRef,
        recipeRef: revision.revisionRef,
        capabilities: [{ id: "orders", capability: "orders", requirementRefs: ["REQ-REFERENCE-1"] }],
      },
      catalogEntries: [{ capability: "orders", provider: "builtin", version: "1.0.0" }],
      recipeTraceability: { modules: [{ requirementIds: ["REQ-REFERENCE-1"] }], rules: [], responsibilities: [], exceptions: [] },
      analysisTraceability: { findings: [{ recipeRequirementRefs: ["REQ-REFERENCE-1"] }] },
      definitionTraceability: {
        entities: [], processes: [], actions: [],
        capabilities: [{ capability: "orders", requirementRefs: ["REQ-REFERENCE-1"] }],
        views: [], policies: [], integrations: [],
      },
      compilerVersion: "1.0.0",
      runtimeVersion: "1.0.0",
      releaseId: "reference-orders-system",
      releaseVersion: version,
      publishedAt,
      environment: { kind: "EnvironmentProfile" as const, environmentRef: REFERENCE.environmentRef, runtimeVersions: ["1.0.0"], bindings: [] },
      acceptanceChecks: [{ name: "factory-e2e", pass: true }],
      startedAt: publishedAt,
      completedAt: publishedAt,
    },
  });
}

function requireCompilerPredecessors(result: ReturnType<typeof bootstrap>) {
  const assemblyPlan = result.result.assemblyPlan;
  const validationEvidence = result.result.validationEvidence;
  if (typeof assemblyPlan !== "object" || assemblyPlan === null || !("kind" in assemblyPlan) || assemblyPlan.kind !== "AssemblyPlan") {
    throw new Error("growing proof assemblyPlan must be canonical AssemblyPlan evidence");
  }
  if (typeof validationEvidence !== "object" || validationEvidence === null || !("kind" in validationEvidence) || validationEvidence.kind !== "ValidationEvidence") {
    throw new Error("growing proof validationEvidence must be canonical ValidationEvidence");
  }
  return { assemblyPlan: assemblyPlan as CompilerAssemblyPlan, validationEvidence: validationEvidence as CompilerValidationEvidence };
}

function release(version: string, minute: number) {
  const publishedAt = `2026-09-01T18:${minute.toString().padStart(2, "0")}:00.000Z`;
  const factory = bootstrap(version, publishedAt);
  assert.equal(factory.ok, true);
  const compilation = compileSyntheticRelease({
    ...requireCompilerPredecessors(factory),
    compilerVersion: "1.0.0",
    runtimeVersion: "1.0.0",
  });
  assert.deepEqual(compilation.artifact, factory.result.releaseArtifact);
  const payloads = new InMemoryArtifactPayloadRepository();
  payloads.publish({ artifactHash: compilation.artifact.artifactHash, files: compilation.files });
  assert.equal(payloads.getVerified(compilation.artifact).verified, true);
  const published = new ReleaseRegistry().publish({
    releaseId: "reference-orders-system",
    version,
    artifact: compilation.artifact,
    publishedAt,
  });
  assert.deepEqual(published, factory.result.publishedRelease);
  return { factory, compilation, payloads, published };
}

function candidate(value: ReturnType<typeof release>, minute: number, expectedActiveDeploymentId: string | null) {
  return {
    publishedRelease: value.published,
    releaseArtifact: value.compilation.artifact,
    artifactPayloadReader: value.payloads,
    environment: {
      kind: "EnvironmentProfile" as const,
      environmentRef: REFERENCE.environmentRef,
      runtimeVersions: ["1.0.0"],
      bindings: [{ name: "DB_PASSWORD", kind: "secret-reference" as const, reference: "secret://reference-db-password" }],
    },
    secretResolver: { resolve: (reference: string) => {
      assert.equal(reference, "secret://reference-db-password");
      return SECRET;
    } },
    processEnvironment: {
      SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1",
      SYSTEM_BUILDER_FACTORY_URL: "http://127.0.0.1:1",
      SYSTEM_BUILDER_BOOTSTRAP_URL: "http://127.0.0.1:1",
      SYSTEM_BUILDER_OBSERVE_URL: "http://127.0.0.1:1",
    },
    expectedActiveDeploymentId,
    startedAt: `2026-09-01T18:${minute.toString().padStart(2, "0")}:01.000Z`,
    completedAt: `2026-09-01T18:${minute.toString().padStart(2, "0")}:02.000Z`,
    timeoutMs: 2_000,
  };
}

test("TASK-456 composes the complete reference product journey through canonical owners", async () => {
  const repeatedA = release("0.0.1", 30);
  const retainedA = release("0.0.1", 30);
  assert.deepEqual(retainedA.factory, repeatedA.factory);
  assert.deepEqual(retainedA.compilation, repeatedA.compilation);
  assert.equal(requireCompilerPredecessors(retainedA.factory).assemblyPlan.systemDefinitionRef, REFERENCE.definitionRef);

  const registry = new DeploymentRegistry(new InMemoryDeploymentRecordStorage());
  const orchestrator = new SingleHostActiveRuntimeOrchestrator(registry);
  const aInput = candidate(retainedA, 31, null);
  const a = await orchestrator.promote(aInput);
  assert.equal(a.ok, true);
  if (!a.ok || !a.active) return;
  assert.equal(a.candidateRecord.publishedReleaseRef, "reference-orders-system@0.0.1");
  assert.equal(a.candidateRecord.releaseHash, retainedA.compilation.artifact.artifactHash);
  assert.equal(a.candidateRecord.environmentRef, REFERENCE.environmentRef);
  assert.equal((await orchestrator.health(REFERENCE.environmentRef)).status, "UP");

  const observation = DeploymentObservation.fromDeploymentRecord(a.candidateRecord);
  assert.equal(observation.deploymentId, a.candidateRecord.deploymentId);
  assert.equal(observation.publishedReleaseRef, a.candidateRecord.publishedReleaseRef);
  assert.equal(observation.releaseHash, a.candidateRecord.releaseHash);
  const observeFailure = await publishObservation(observation, { deliver: async () => { throw new Error("observe unavailable"); } });
  assert.equal(observeFailure.ok, false);
  assert.equal(registry.getActive(REFERENCE.environmentRef)?.deploymentId, a.candidateRecord.deploymentId);
  assert.equal((await orchestrator.health(REFERENCE.environmentRef)).status, "UP");

  const retainedB = release("0.0.2", 32);
  assert.equal(retainedB.compilation.artifact.artifactHash, retainedA.compilation.artifact.artifactHash);
  const b = await orchestrator.promote(candidate(retainedB, 33, a.candidateRecord.deploymentId));
  assert.equal(b.ok, true);
  if (!b.ok || !b.active) return;
  assert.equal(b.promoted, true);
  assert.equal(b.decision.previousActiveDeploymentId, a.candidateRecord.deploymentId);
  assert.equal(b.candidateRecord.publishedReleaseRef, "reference-orders-system@0.0.2");
  assert.equal((await orchestrator.health(REFERENCE.environmentRef)).status, "UP");

  const stale = release("0.0.3", 34);
  const staleResult = await orchestrator.promote(candidate(stale, 35, a.candidateRecord.deploymentId));
  assert.equal(staleResult.ok, true);
  if (!staleResult.ok) return;
  assert.equal(staleResult.promoted, false);
  assert.equal(staleResult.decision.outcome, "stale-active");
  assert.equal(registry.getActive(REFERENCE.environmentRef)?.deploymentId, b.candidateRecord.deploymentId);

  const restored = await orchestrator.promote(candidate(retainedA, 36, b.candidateRecord.deploymentId));
  assert.equal(restored.ok, true);
  if (!restored.ok || !restored.active) return;
  assert.equal(restored.promoted, true);
  assert.equal(restored.candidateRecord.publishedReleaseRef, "reference-orders-system@0.0.1");
  assert.equal(restored.candidateRecord.releaseHash, retainedA.compilation.artifact.artifactHash);
  assert.equal(registry.getActive(REFERENCE.environmentRef)?.deploymentId, restored.candidateRecord.deploymentId);
  assert.equal((await orchestrator.health(REFERENCE.environmentRef)).status, "UP");

  const repeatedRestore = await orchestrator.promote(candidate(retainedA, 37, b.candidateRecord.deploymentId));
  assert.equal(repeatedRestore.ok, true);
  if (!repeatedRestore.ok) return;
  assert.equal(repeatedRestore.promoted, false);
  assert.equal(repeatedRestore.decision.outcome, "stale-active");
  assert.equal(registry.getActive(REFERENCE.environmentRef)?.deploymentId, restored.candidateRecord.deploymentId);

  const auditableEvidence = JSON.stringify({
    processRevision: REFERENCE.revisionRef,
    systemDefinition: REFERENCE.definitionRef,
    releaseA: retainedA.published,
    artifact: retainedA.compilation.artifact,
    deploymentA: a.candidateRecord,
    observation,
    releaseB: retainedB.published,
    deploymentB: b.candidateRecord,
    restoredA: restored.candidateRecord,
  });
  assert.equal(auditableEvidence.includes(SECRET), false);
  assert.equal(auditableEvidence.includes("secret://reference-db-password"), false);
  assert.equal(auditableEvidence.includes("EnvironmentProfile"), false);

  await orchestrator.stopActive(REFERENCE.environmentRef);
});
