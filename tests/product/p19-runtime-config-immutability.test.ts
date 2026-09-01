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
import { executeFactoryOperatorBootstrap } from "../../scripts/factory-operator-bootstrap-command.js";
import { invokeRuntimeMaterializationHandoff } from "../../scripts/runtime-materialization-handoff.js";

function canonicalBootstrap() {
  const revision = {
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef: "process:orders",
    revisionRef: "process-revision:orders:v1",
    revisionNumber: 1,
    previousRevisionRef: null,
  };
  const analysis = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "analysis",
    identityRef: "analysis:orders:v1",
  } as const;
  const definitionIdentity = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "system-definition",
    identityRef: "system-definition:orders:v1",
  } as const;
  const processRevision = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "process-revision",
    processRevision: revision,
  } as const;

  return executeFactoryOperatorBootstrap({
    contractVersion: FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION,
    prerequisites: { nodeVersion: "24.0.0", npmVersion: "11.0.0", factoryE2EAvailable: true },
    config: { inputPath: "fixture://runtime-config-immutability" },
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
              kind: "process-revision-to-analysis",
              from: processRevision,
              to: analysis,
            },
            {
              contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
              kind: "analysis-to-system-definition",
              from: analysis,
              to: definitionIdentity,
            },
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
      recipeTraceability: {
        modules: [{ requirementIds: ["REQ-1"] }],
        rules: [], responsibilities: [], exceptions: [],
      },
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
      publishedAt: "2026-09-01T02:45:00.000Z",
      environment: {
        kind: "EnvironmentProfile",
        environmentRef: "environment:p19:runtime-config",
        runtimeVersions: ["1.0.0"],
        bindings: [],
      },
      acceptanceChecks: [{ name: "factory-e2e", pass: true }],
      startedAt: "2026-09-01T02:46:00.000Z",
      completedAt: "2026-09-01T02:47:00.000Z",
    },
  });
}

function requireCompilerPredecessors(bootstrap: ReturnType<typeof canonicalBootstrap>) {
  const assemblyPlan = bootstrap.result.assemblyPlan;
  const validationEvidence = bootstrap.result.validationEvidence;
  if (
    typeof assemblyPlan !== "object"
    || assemblyPlan === null
    || !("kind" in assemblyPlan)
    || assemblyPlan.kind !== "AssemblyPlan"
  ) {
    throw new Error("canonical bootstrap assemblyPlan must be an AssemblyPlan");
  }
  if (
    typeof validationEvidence !== "object"
    || validationEvidence === null
    || !("kind" in validationEvidence)
    || validationEvidence.kind !== "ValidationEvidence"
  ) {
    throw new Error("canonical bootstrap validationEvidence must be ValidationEvidence");
  }
  return {
    assemblyPlan: assemblyPlan as CompilerAssemblyPlan,
    validationEvidence: validationEvidence as CompilerValidationEvidence,
  };
}

function supportedInput() {
  const bootstrap = canonicalBootstrap();
  assert.equal(bootstrap.ok, true);
  if (!bootstrap.ok) throw new Error("canonical bootstrap fixture must succeed");

  const deploymentRecord = bootstrap.result.deploymentRecord;
  if (
    typeof deploymentRecord !== "object"
    || deploymentRecord === null
    || !("environmentRef" in deploymentRecord)
    || typeof deploymentRecord.environmentRef !== "string"
  ) {
    throw new Error("canonical bootstrap deploymentRecord must expose environmentRef");
  }

  const releaseArtifact = bootstrap.result.releaseArtifact;
  if (
    typeof releaseArtifact !== "object"
    || releaseArtifact === null
    || !("artifactHash" in releaseArtifact)
    || typeof releaseArtifact.artifactHash !== "string"
  ) {
    throw new Error("canonical bootstrap releaseArtifact must expose artifactHash");
  }
  const artifactHash = releaseArtifact.artifactHash;

  const predecessors = requireCompilerPredecessors(bootstrap);
  const compilation = compileSyntheticRelease({
    ...predecessors,
    compilerVersion: "1.0.0",
    runtimeVersion: "1.0.0",
  });
  assert.deepEqual(compilation.artifact, releaseArtifact);

  const artifacts = new InMemoryArtifactPayloadRepository();
  const payload = artifacts.publish({
    artifactHash: compilation.artifact.artifactHash,
    files: compilation.files,
  });
  assert.equal(payload.artifactHash, artifactHash);
  const verifiedPayload = artifacts.getVerified(compilation.artifact);
  assert.equal(verifiedPayload.artifactHash, artifactHash);

  const environment = {
    kind: "EnvironmentProfile" as const,
    environmentRef: deploymentRecord.environmentRef,
    runtimeVersions: ["1.0.0"],
    bindings: [
      { name: "DB_PASSWORD", kind: "secret-reference" as const, reference: "secret://db-password" },
      { name: "LOG_LEVEL", kind: "config" as const, reference: "config://log-level" },
    ],
  };
  return {
    bootstrap,
    environment,
    artifactHash,
    generatedFiles: compilation.files,
    artifactPayloadReader: artifacts,
  };
}

test("TASK-441 supported handoff preserves immutable release/artifact/generated inputs, externalizes secrets and cleans every run", async () => {
  const secretValue = "task-441-runtime-secret-must-never-leak";
  const input = supportedInput();
  const releaseBefore = JSON.stringify(input.bootstrap.result.publishedRelease);
  const artifactBefore = JSON.stringify(input.bootstrap.result.releaseArtifact);
  const filesBefore = JSON.stringify(input.generatedFiles);
  const environmentBefore = JSON.stringify(input.environment);
  let resolutions = 0;

  const invoke = () => invokeRuntimeMaterializationHandoff({
    bootstrap: input.bootstrap,
    environment: input.environment,
    artifactPayloadReader: input.artifactPayloadReader,
    secretResolver: {
      resolve: (reference) => {
        resolutions += 1;
        assert.equal(reference, "secret://db-password");
        return secretValue;
      },
    },
    processEnvironment: {
      SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1",
      SYSTEM_BUILDER_OBSERVE_URL: "http://127.0.0.1:1",
    },
    timeoutMs: 2_000,
  });

  const first = await invoke();
  const second = await invoke();
  assert.equal(first.deploy.ok, true);
  assert.equal(second.deploy.ok, true);
  if (!first.deploy.ok || !second.deploy.ok) return;

  assert.equal(resolutions, 2);
  assert.equal(JSON.stringify(input.bootstrap.result.publishedRelease), releaseBefore);
  assert.equal(JSON.stringify(input.bootstrap.result.releaseArtifact), artifactBefore);
  assert.equal(JSON.stringify(input.generatedFiles), filesBefore);
  assert.equal(JSON.stringify(input.environment), environmentBefore);
  assert.equal(JSON.stringify(input.bootstrap.result.publishedRelease).includes(secretValue), false);
  assert.equal(JSON.stringify(input.bootstrap.result.releaseArtifact).includes(secretValue), false);
  assert.equal(JSON.stringify(input.generatedFiles).includes(secretValue), false);
  assert.equal(JSON.stringify(first).includes(secretValue), false);
  assert.equal(JSON.stringify(second).includes(secretValue), false);
  assert.deepEqual(first.deploy.health.bindingNames, ["DB_PASSWORD", "LOG_LEVEL"]);
  assert.deepEqual(second.deploy.health.bindingNames, ["DB_PASSWORD", "LOG_LEVEL"]);
  await assert.rejects(access(first.deploy.workingDirectory));
  await assert.rejects(access(second.deploy.workingDirectory));
});

test("TASK-441 migration failure through supported handoff redacts resolved secret and materializes no runtime directory", async () => {
  const secretValue = "task-441-migration-secret-must-never-leak";
  const input = supportedInput();
  const result = await invokeRuntimeMaterializationHandoff({
    bootstrap: input.bootstrap,
    environment: input.environment,
    artifactPayloadReader: input.artifactPayloadReader,
    secretResolver: { resolve: () => secretValue },
    migrationApplier: async () => {
      throw new Error(`TASK_441_MIGRATION_FAILURE:${secretValue}`);
    },
    timeoutMs: 2_000,
  });

  assert.equal(result.deploy.ok, false);
  if (result.deploy.ok) return;
  assert.equal(result.deploy.activated, false);
  assert.equal(result.deploy.diagnostic.code, "MIGRATION_APPLICATION_FAILED");
  assert.equal(result.deploy.diagnostic.detail.includes(secretValue), false);
  assert.match(result.deploy.diagnostic.detail, /TASK_441_MIGRATION_FAILURE:\[REDACTED\]/);
  assert.equal("workingDirectory" in result.deploy, false);
  assert.equal(JSON.stringify(result).includes(secretValue), false);
});

test("TASK-443 startup failure is proven with the exact compiler payload through the supported Deploy invocation", async () => {
  const input = supportedInput();
  const result = await invokeRuntimeMaterializationHandoff({
    bootstrap: input.bootstrap,
    environment: input.environment,
    artifactPayloadReader: input.artifactPayloadReader,
    processEnvironment: {
      NODE_OPTIONS: "--task-443-invalid-node-option",
    },
    timeoutMs: 2_000,
  });

  assert.equal(result.deploy.ok, false);
  if (result.deploy.ok) return;
  assert.equal(result.deploy.activated, true);
  assert.equal(result.deploy.diagnostic.code, "RUNTIME_PROCESS_FAILED");
  assert.match(result.deploy.diagnostic.detail, /task-443-invalid-node-option|bad option|not allowed/i);
  assert.equal("health" in result.deploy, false);
  assert.equal("state" in result.deploy, false);
  assert.equal("migrationApplication" in result.deploy, false);
  if ("workingDirectory" in result.deploy && result.deploy.workingDirectory !== undefined) {
    await assert.rejects(access(result.deploy.workingDirectory));
  }
});
