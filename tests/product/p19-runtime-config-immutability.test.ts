import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";

import {
  FACTORY_JOURNEY_CONTRACT_VERSION,
  FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION,
} from "../../packages/contracts/factory-boundary/index.js";
import { PROCESS_SYSTEM_LINEAGE_VERSION } from "../../packages/contracts/process-versioning/lineage.js";
import { PROCESS_VERSION_IDENTITY_VERSION } from "../../packages/contracts/process-versioning/index.js";
import { executeFactoryOperatorBootstrap } from "../../scripts/factory-operator-bootstrap-command.js";
import { invokeRuntimeMaterializationHandoff } from "../../scripts/runtime-materialization-handoff.js";

const runtimeEntry = `
import http from "node:http";
const profile = JSON.parse(process.env.SYSTEM_BUILDER_ENVIRONMENT_PROFILE);
const server = http.createServer((request, response) => {
  if (request.url === "/health") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({
      kind: "RuntimeHealth",
      status: "UP",
      runtimeVersion: "1.0.0",
      environmentRef: profile.environmentRef,
      bindingNames: profile.bindings.map((binding) => binding.name),
    }));
    return;
  }
  response.writeHead(404); response.end();
});
server.listen(0, "127.0.0.1", () => {
  const address = server.address();
  console.log(JSON.stringify({
    kind: "RuntimeStarted",
    status: "UP",
    port: address.port,
    runtimeVersion: "1.0.0",
    environmentRef: profile.environmentRef,
  }));
});
const shutdown = () => server.close(() => process.exit(0));
process.once("SIGTERM", shutdown);
process.once("SIGINT", shutdown);`;

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

  const environment = {
    kind: "EnvironmentProfile" as const,
    environmentRef: deploymentRecord.environmentRef,
    runtimeVersions: ["1.0.0"],
    bindings: [
      { name: "DB_PASSWORD", kind: "secret-reference" as const, reference: "secret://db-password" },
      { name: "LOG_LEVEL", kind: "config" as const, reference: "config://log-level" },
    ],
  };
  const generatedFiles = Object.freeze([
    Object.freeze({ path: "runtime-entry.mjs", content: runtimeEntry, contentHash: `sha256:${"c".repeat(64)}` }),
  ]);
  const artifactPayloadReader = {
    getVerified: () => Object.freeze({
      artifactHash,
      files: generatedFiles,
      verified: true as const,
    }),
  };
  return { bootstrap, environment, artifactHash, generatedFiles, artifactPayloadReader };
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

test("TASK-443 startup failure is proven through the supported real Deploy invocation without partial success", async () => {
  const input = supportedInput();
  const invalidStartupFiles = Object.freeze([
    Object.freeze({
      path: "runtime-entry.mjs",
      content: `console.log("TASK_443_INVALID_STARTUP");\nsetInterval(() => {}, 1_000);\nprocess.once("SIGTERM", () => process.exit(0));`,
      contentHash: `sha256:${"d".repeat(64)}`,
    }),
  ]);
  const result = await invokeRuntimeMaterializationHandoff({
    bootstrap: input.bootstrap,
    environment: input.environment,
    artifactPayloadReader: {
      getVerified: () => Object.freeze({
        artifactHash: input.artifactHash,
        files: invalidStartupFiles,
        verified: true as const,
      }),
    },
    timeoutMs: 2_000,
  });

  assert.equal(result.deploy.ok, false);
  if (result.deploy.ok) return;
  assert.equal(result.deploy.activated, true);
  assert.equal(result.deploy.diagnostic.code, "RUNTIME_STARTUP_INVALID");
  assert.equal(result.deploy.diagnostic.detail, "TASK_443_INVALID_STARTUP");
  assert.equal("health" in result.deploy, false);
  assert.equal("state" in result.deploy, false);
  assert.equal("migrationApplication" in result.deploy, false);
  if ("workingDirectory" in result.deploy && result.deploy.workingDirectory !== undefined) {
    await assert.rejects(access(result.deploy.workingDirectory));
  }
});