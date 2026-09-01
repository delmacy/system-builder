import assert from "node:assert/strict";
import { access } from "node:fs/promises";
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
import { invokeRuntimeMaterializationHandoff } from "../../scripts/runtime-materialization-handoff.js";

const REFERENCE = Object.freeze({
  artifactRef: "process:reference-orders",
  revisionRef: "process-revision:reference-orders:v1",
  analysisRef: "analysis:reference-orders:v1",
  definitionRef: "system-definition:reference-orders:v1",
  environmentRef: "environment:p19:reference-process",
});

function canonicalBootstrap() {
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
    config: { inputPath: "fixture://p19-reference-process-deploy-runtime" },
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
        capabilities: [{ id: "orders", capability: "orders", requirementRefs: ["REQ-REFERENCE-1"] }],
      },
      catalogEntries: [{ capability: "orders", provider: "builtin", version: "1.0.0" }],
      recipeTraceability: {
        modules: [{ requirementIds: ["REQ-REFERENCE-1"] }],
        rules: [], responsibilities: [], exceptions: [],
      },
      analysisTraceability: { findings: [{ recipeRequirementRefs: ["REQ-REFERENCE-1"] }] },
      definitionTraceability: {
        entities: [], processes: [], actions: [],
        capabilities: [{ capability: "orders", requirementRefs: ["REQ-REFERENCE-1"] }],
        views: [], policies: [], integrations: [],
      },
      compilerVersion: "1.0.0",
      runtimeVersion: "1.0.0",
      releaseId: "reference-orders-system",
      releaseVersion: "0.0.1",
      publishedAt: "2026-09-01T13:40:00.000Z",
      environment: {
        kind: "EnvironmentProfile" as const,
        environmentRef: REFERENCE.environmentRef,
        runtimeVersions: ["1.0.0"],
        bindings: [],
      },
      acceptanceChecks: [{ name: "factory-e2e", pass: true }],
      startedAt: "2026-09-01T13:39:00.000Z",
      completedAt: "2026-09-01T13:40:00.000Z",
    },
  });
}

function requireCompilerPredecessors(bootstrap: ReturnType<typeof canonicalBootstrap>) {
  const assemblyPlan = bootstrap.result.assemblyPlan;
  const validationEvidence = bootstrap.result.validationEvidence;
  if (typeof assemblyPlan !== "object" || assemblyPlan === null || !("kind" in assemblyPlan) || assemblyPlan.kind !== "AssemblyPlan") {
    throw new Error("reference deployment assemblyPlan must be canonical AssemblyPlan evidence");
  }
  if (typeof validationEvidence !== "object" || validationEvidence === null || !("kind" in validationEvidence) || validationEvidence.kind !== "ValidationEvidence") {
    throw new Error("reference deployment validationEvidence must be canonical ValidationEvidence");
  }
  return {
    assemblyPlan: assemblyPlan as CompilerAssemblyPlan,
    validationEvidence: validationEvidence as CompilerValidationEvidence,
  };
}

function supportedInput() {
  const bootstrap = canonicalBootstrap();
  assert.equal(bootstrap.ok, true);
  const compilation = compileSyntheticRelease({
    ...requireCompilerPredecessors(bootstrap),
    compilerVersion: "1.0.0",
    runtimeVersion: "1.0.0",
  });
  assert.deepEqual(compilation.artifact, bootstrap.result.releaseArtifact);

  const payloads = new InMemoryArtifactPayloadRepository();
  payloads.publish({ artifactHash: compilation.artifact.artifactHash, files: compilation.files });
  assert.equal(payloads.getVerified(compilation.artifact).verified, true);

  const published = new ReleaseRegistry().publish({
    releaseId: "reference-orders-system",
    version: "0.0.1",
    artifact: compilation.artifact,
    publishedAt: "2026-09-01T13:40:00.000Z",
  });
  assert.deepEqual(published, bootstrap.result.publishedRelease);

  const environment = {
    kind: "EnvironmentProfile" as const,
    environmentRef: REFERENCE.environmentRef,
    runtimeVersions: ["1.0.0"],
    bindings: [
      { name: "DB_PASSWORD", kind: "secret-reference" as const, reference: "secret://reference-db-password" },
      { name: "LOG_LEVEL", kind: "config" as const, reference: "config://reference-log-level" },
    ],
  };
  return { bootstrap, compilation, payloads, published, environment };
}

test("TASK-452 deploys the exact reference release through the supported generated-runtime lifecycle with Builder unavailable", async () => {
  const input = supportedInput();
  const secretValue = "task-452-reference-secret-must-never-leak";
  const result = await invokeRuntimeMaterializationHandoff({
    bootstrap: input.bootstrap,
    environment: input.environment,
    artifactPayloadReader: input.payloads,
    secretResolver: { resolve: (reference) => {
      assert.equal(reference, "secret://reference-db-password");
      return secretValue;
    } },
    processEnvironment: {
      SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1",
      SYSTEM_BUILDER_FACTORY_URL: "http://127.0.0.1:1",
      SYSTEM_BUILDER_BOOTSTRAP_URL: "http://127.0.0.1:1",
    },
    timeoutMs: 2_000,
  });

  assert.equal(result.publishedReleaseRef, `${input.published.releaseId}@${input.published.version}`);
  assert.equal(result.artifactHash, input.compilation.artifact.artifactHash);
  assert.equal(result.deploy.ok, true);
  if (!result.deploy.ok) return;
  assert.equal(result.deploy.health.status, "UP");
  assert.equal(result.deploy.health.environmentRef, REFERENCE.environmentRef);
  assert.equal(result.deploy.health.runtimeVersion, "1.0.0");
  assert.deepEqual(result.deploy.health.bindingNames, ["DB_PASSWORD", "LOG_LEVEL"]);
  assert.equal(JSON.stringify(input.published).includes(secretValue), false);
  assert.equal(JSON.stringify(input.compilation).includes(secretValue), false);
  assert.equal(JSON.stringify(result).includes(secretValue), false);
  await assert.rejects(access(result.deploy.workingDirectory));
});

test("TASK-452 fails closed before activation on invalid payload, environment or secret resolution", async () => {
  const payloadInput = supportedInput();
  const payloadFailure = await invokeRuntimeMaterializationHandoff({
    bootstrap: payloadInput.bootstrap,
    environment: payloadInput.environment,
    artifactPayloadReader: { getVerified: () => { throw new Error("TASK_452_PAYLOAD_REJECTED"); } },
    timeoutMs: 2_000,
  });
  assert.equal(payloadFailure.deploy.ok, false);
  if (!payloadFailure.deploy.ok) {
    assert.equal(payloadFailure.deploy.activated, false);
    assert.equal(payloadFailure.deploy.diagnostic.code, "ARTIFACT_PAYLOAD_INVALID");
  }

  const environmentInput = supportedInput();
  await assert.rejects(
    invokeRuntimeMaterializationHandoff({
      bootstrap: environmentInput.bootstrap,
      environment: { ...environmentInput.environment, environmentRef: "environment:p19:substituted" },
      artifactPayloadReader: environmentInput.payloads,
      timeoutMs: 2_000,
    }),
    /RUNTIME_HANDOFF_ENVIRONMENT_PREDECESSOR_MISMATCH/,
  );

  const secretInput = supportedInput();
  const secretFailure = await invokeRuntimeMaterializationHandoff({
    bootstrap: secretInput.bootstrap,
    environment: secretInput.environment,
    artifactPayloadReader: secretInput.payloads,
    secretResolver: { resolve: () => { throw new Error("TASK_452_SECRET_REJECTED"); } },
    timeoutMs: 2_000,
  });
  assert.equal(secretFailure.deploy.ok, false);
  if (!secretFailure.deploy.ok) {
    assert.equal(secretFailure.deploy.activated, false);
    assert.equal(secretFailure.deploy.diagnostic.code, "SECRET_RESOLUTION_FAILED");
  }
});

test("TASK-452 keeps migration and startup failures fail-closed with no false health/state success", async () => {
  const migrationInput = supportedInput();
  const migrationFailure = await invokeRuntimeMaterializationHandoff({
    bootstrap: migrationInput.bootstrap,
    environment: migrationInput.environment,
    artifactPayloadReader: migrationInput.payloads,
    secretResolver: { resolve: () => "task-452-migration-secret" },
    migrationApplier: async () => { throw new Error("TASK_452_MIGRATION_FAILURE:task-452-migration-secret"); },
    timeoutMs: 2_000,
  });
  assert.equal(migrationFailure.deploy.ok, false);
  if (!migrationFailure.deploy.ok) {
    assert.equal(migrationFailure.deploy.activated, false);
    assert.equal(migrationFailure.deploy.diagnostic.code, "MIGRATION_APPLICATION_FAILED");
    assert.equal(migrationFailure.deploy.diagnostic.detail.includes("task-452-migration-secret"), false);
    assert.equal("health" in migrationFailure.deploy, false);
    assert.equal("state" in migrationFailure.deploy, false);
  }

  const startupInput = supportedInput();
  const startupFailure = await invokeRuntimeMaterializationHandoff({
    bootstrap: startupInput.bootstrap,
    environment: startupInput.environment,
    artifactPayloadReader: startupInput.payloads,
    processEnvironment: { NODE_OPTIONS: "--task-452-invalid-node-option" },
    timeoutMs: 2_000,
  });
  assert.equal(startupFailure.deploy.ok, false);
  if (!startupFailure.deploy.ok) {
    assert.equal(startupFailure.deploy.activated, true);
    assert.equal(startupFailure.deploy.diagnostic.code, "RUNTIME_PROCESS_FAILED");
    assert.equal("health" in startupFailure.deploy, false);
    assert.equal("state" in startupFailure.deploy, false);
    if (startupFailure.deploy.workingDirectory !== undefined) {
      await assert.rejects(access(startupFailure.deploy.workingDirectory));
    }
  }
});
