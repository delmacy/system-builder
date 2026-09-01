import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";

import { InMemoryArtifactPayloadRepository } from "../../packages/artifact-store/index.js";
import { compileSyntheticRelease, type CompilerAssemblyPlan, type CompilerValidationEvidence } from "../../packages/compiler/index.js";
import {
  FACTORY_JOURNEY_CONTRACT_VERSION,
  FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION,
} from "../../packages/contracts/factory-boundary/index.js";
import { PROCESS_SYSTEM_LINEAGE_VERSION } from "../../packages/contracts/process-versioning/lineage.js";
import { PROCESS_VERSION_IDENTITY_VERSION } from "../../packages/contracts/process-versioning/index.js";
import { DeploymentObservation, publish, type PublishObserver } from "../../packages/observe/index.js";
import { executeFactoryOperatorBootstrap } from "../../scripts/factory-operator-bootstrap-command.js";
import { invokeRuntimeMaterializationHandoff, preflightRuntimeMaterializationHandoff } from "../../scripts/runtime-materialization-handoff.js";

function supportedInput() {
  const revision = {
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef: "process:orders",
    revisionRef: "process-revision:orders:v1",
    revisionNumber: 1,
    previousRevisionRef: null,
  };
  const analysis = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "analysis" as const,
    identityRef: "analysis:orders:v1",
  };
  const definitionIdentity = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "system-definition" as const,
    identityRef: "system-definition:orders:v1",
  };
  const processRevision = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "process-revision" as const,
    processRevision: revision,
  };
  const bootstrap = executeFactoryOperatorBootstrap({
    contractVersion: FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION,
    prerequisites: { nodeVersion: "24.0.0", npmVersion: "11.0.0", factoryE2EAvailable: true },
    config: { inputPath: "fixture://p19-offline-observation" },
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
            { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "process-revision-to-analysis", from: processRevision, to: analysis },
            { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "analysis-to-system-definition", from: analysis, to: definitionIdentity },
          ],
        },
      },
      definition: {
        definition: "SystemDefinition",
        analysisRef: analysis.identityRef,
        recipeRef: revision.revisionRef,
        capabilities: [{ id: "orders", capability: "orders", requirementRefs: ["REQ-1"] }],
      },
      catalogEntries: [{ capability: "orders", provider: "builtin", version: "1.0.0" }],
      recipeTraceability: { modules: [{ requirementIds: ["REQ-1"] }], rules: [], responsibilities: [], exceptions: [] },
      analysisTraceability: { findings: [{ recipeRequirementRefs: ["REQ-1"] }] },
      definitionTraceability: {
        entities: [], processes: [], actions: [],
        capabilities: [{ capability: "orders", requirementRefs: ["REQ-1"] }],
        views: [], policies: [], integrations: [],
      },
      compilerVersion: "1.0.0",
      runtimeVersion: "1.0.0",
      releaseId: "orders-system",
      releaseVersion: "0.0.1",
      publishedAt: "2026-09-01T04:30:00.000Z",
      environment: {
        kind: "EnvironmentProfile",
        environmentRef: "environment:p19:offline-observation",
        runtimeVersions: ["1.0.0"],
        bindings: [],
      },
      acceptanceChecks: [{ name: "factory-e2e", pass: true }],
      startedAt: "2026-09-01T04:31:00.000Z",
      completedAt: "2026-09-01T04:32:00.000Z",
    },
  });
  assert.equal(bootstrap.ok, true);
  if (!bootstrap.ok) throw new Error("TASK445_BOOTSTRAP_FAILED");

  const assemblyPlan = bootstrap.result.assemblyPlan;
  const validationEvidence = bootstrap.result.validationEvidence;
  if (typeof assemblyPlan !== "object" || assemblyPlan === null || !("kind" in assemblyPlan) || assemblyPlan.kind !== "AssemblyPlan") {
    throw new Error("TASK445_INVALID_ASSEMBLY_PLAN");
  }
  if (typeof validationEvidence !== "object" || validationEvidence === null || !("kind" in validationEvidence) || validationEvidence.kind !== "ValidationEvidence") {
    throw new Error("TASK445_INVALID_VALIDATION_EVIDENCE");
  }
  const compilation = compileSyntheticRelease({
    assemblyPlan: assemblyPlan as CompilerAssemblyPlan,
    validationEvidence: validationEvidence as CompilerValidationEvidence,
    compilerVersion: "1.0.0",
    runtimeVersion: "1.0.0",
  });
  const releaseArtifact = bootstrap.result.releaseArtifact;
  assert.deepEqual(compilation.artifact, releaseArtifact);

  const artifacts = new InMemoryArtifactPayloadRepository();
  artifacts.publish({ artifactHash: compilation.artifact.artifactHash, files: compilation.files });
  artifacts.getVerified(compilation.artifact);

  const deployment = bootstrap.result.deploymentRecord;
  if (typeof deployment !== "object" || deployment === null || !("environmentRef" in deployment) || typeof deployment.environmentRef !== "string") {
    throw new Error("TASK445_INVALID_DEPLOYMENT_RECORD");
  }

  return {
    bootstrap,
    artifacts,
    observation: DeploymentObservation.fromDeploymentRecord(deployment),
    environment: {
      kind: "EnvironmentProfile" as const,
      environmentRef: deployment.environmentRef,
      runtimeVersions: ["1.0.0"],
      bindings: [{ name: "DB_PASSWORD", kind: "secret-reference" as const, reference: "secret://db-password" }],
    },
  };
}

test("TASK-445 local observation remains deterministic and Observe publication fails open while Builder is unavailable", async () => {
  const input = supportedInput();
  const secret = "task-445-secret-must-not-leak";
  const runtime = await invokeRuntimeMaterializationHandoff({
    bootstrap: input.bootstrap,
    environment: input.environment,
    artifactPayloadReader: input.artifacts,
    secretResolver: { resolve: () => secret },
    processEnvironment: {
      SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1",
      SYSTEM_BUILDER_FACTORY_URL: "http://127.0.0.1:1",
      SYSTEM_BUILDER_BOOTSTRAP_URL: "http://127.0.0.1:1",
      SYSTEM_BUILDER_OBSERVE_URL: "http://127.0.0.1:1",
    },
    timeoutMs: 2_000,
  });

  assert.equal(runtime.deploy.ok, true);
  if (!runtime.deploy.ok) return;
  const healthBefore = structuredClone(runtime.deploy.health);
  assert.equal(healthBefore.status, "UP");
  assert.equal(input.observation.deploymentId, runtime.deploymentId);
  assert.equal(input.observation.publishedReleaseRef, runtime.publishedReleaseRef);
  assert.equal(input.observation.environmentRef, runtime.deploy.health.environmentRef);

  const absent = await publish(input.observation);
  assert.deepEqual(absent, { ok: true, outcome: "not-configured", observationId: null });

  let attempts = 0;
  const unavailable: PublishObserver = {
    deliver: async () => {
      attempts += 1;
      throw new Error(`observe unavailable ${secret}`);
    },
  };
  const first = await publish(input.observation, unavailable);
  const second = await publish(input.observation, unavailable);

  assert.equal(attempts, 2);
  assert.deepEqual(first, second);
  assert.equal(first.ok, false);
  if (first.ok || second.ok) throw new Error("TASK445_EXPECTED_FAIL_OPEN_PUBLICATION");
  assert.equal(first.outcome, "channel-failed");
  assert.deepEqual(first.diagnostic, {
    code: "OBSERVE_CHANNEL_FAILED",
    detail: "observe channel unavailable; deployment outcome unchanged",
  });
  assert.deepEqual(runtime.deploy.health, healthBefore);
  assert.equal(JSON.stringify({ runtime, observation: input.observation, absent, first, second }).includes(secret), false);
  await assert.rejects(access(runtime.deploy.workingDirectory));
});

test("TASK-446 Builder restoration resolves canonical predecessor lineage without rebinding runtime evidence", async () => {
  const input = supportedInput();
  const secret = "task-446-secret-must-not-leak";
  const runtime = await invokeRuntimeMaterializationHandoff({
    bootstrap: input.bootstrap,
    environment: input.environment,
    artifactPayloadReader: input.artifacts,
    secretResolver: { resolve: () => secret },
    processEnvironment: {
      SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1",
      SYSTEM_BUILDER_FACTORY_URL: "http://127.0.0.1:1",
      SYSTEM_BUILDER_BOOTSTRAP_URL: "http://127.0.0.1:1",
    },
    timeoutMs: 2_000,
  });

  assert.equal(runtime.deploy.ok, true);
  if (!runtime.deploy.ok) return;
  const healthBeforeRestoration = structuredClone(runtime.deploy.health);

  const restoredBootstrap = Object.freeze({
    ...input.bootstrap,
    progress: Object.freeze({
      ...input.bootstrap.progress,
      stages: Object.freeze(input.bootstrap.progress.stages.map((stage, index) => Object.freeze({
        ...stage,
        identityRef: `${stage.identityRef}:builder-restored-noise:${index + 1}`,
        provenanceRef: `${stage.provenanceRef}:builder-restored-noise:${index + 1}`,
      }))),
    }),
    diagnostics: [{ code: "BUILDER_RESTORED_NOISE", detail: secret }],
  });
  const restored = preflightRuntimeMaterializationHandoff({
    bootstrap: restoredBootstrap,
    environment: input.environment,
    artifactPayloadReader: input.artifacts,
  });

  assert.equal(restored.deploymentRecord.deploymentId, runtime.deploymentId);
  assert.equal(restored.deploymentRecord.publishedReleaseRef, runtime.publishedReleaseRef);
  assert.equal(restored.releaseArtifact.artifactHash, runtime.artifactHash);
  assert.equal(restored.environment.environmentRef, runtime.deploy.health.environmentRef);
  assert.deepEqual(runtime.deploy.health, healthBeforeRestoration);
  assert.equal(JSON.stringify({ restored, runtime }).includes(secret), false);

  const substitutedDeploymentBootstrap = {
    ...input.bootstrap,
    result: {
      ...input.bootstrap.result,
      deploymentRecord: {
        ...restored.deploymentRecord,
        publishedReleaseRef: `${restored.deploymentRecord.publishedReleaseRef}-substituted`,
      },
    },
  };
  assert.throws(
    () => preflightRuntimeMaterializationHandoff({
      bootstrap: substitutedDeploymentBootstrap,
      environment: input.environment,
      artifactPayloadReader: input.artifacts,
    }),
    /RUNTIME_HANDOFF_DEPLOYMENT_PREDECESSOR_MISMATCH/,
  );

  const mismatchedEnvironment = {
    ...input.environment,
    environmentRef: `${input.environment.environmentRef}:substituted`,
  };
  assert.throws(
    () => preflightRuntimeMaterializationHandoff({
      bootstrap: input.bootstrap,
      environment: mismatchedEnvironment,
      artifactPayloadReader: input.artifacts,
    }),
    /RUNTIME_HANDOFF_ENVIRONMENT_PREDECESSOR_MISMATCH/,
  );

  assert.deepEqual(runtime.deploy.health, healthBeforeRestoration);
  await assert.rejects(access(runtime.deploy.workingDirectory));
});
