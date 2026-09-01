import assert from "node:assert/strict";
import test from "node:test";

import {
  FACTORY_JOURNEY_CONTRACT_VERSION,
  FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION,
} from "../../packages/contracts/factory-boundary/index.js";
import { PROCESS_SYSTEM_LINEAGE_VERSION } from "../../packages/contracts/process-versioning/lineage.js";
import { PROCESS_VERSION_IDENTITY_VERSION } from "../../packages/contracts/process-versioning/index.js";
import { executeFactoryOperatorBootstrap } from "../../scripts/factory-operator-bootstrap-command.js";
import {
  invokeRuntimeMaterializationHandoff,
  preflightRuntimeMaterializationHandoff,
} from "../../scripts/runtime-materialization-handoff.js";

function bootstrapInput() {
  const revision = {
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef: "process:orders",
    revisionRef: "process-revision:orders:v1",
    revisionNumber: 1,
    previousRevisionRef: null,
  };
  const analysis = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "analysis", identityRef: "analysis:orders:v1" } as const;
  const definitionIdentity = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "system-definition", identityRef: "system-definition:orders:v1" } as const;
  const processRevision = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "process-revision", processRevision: revision } as const;
  const factoryInput = {
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
    definitionTraceability: { entities: [], processes: [], actions: [], capabilities: [{ capability: "orders", requirementRefs: ["REQ-1"] }], views: [], policies: [], integrations: [] },
    compilerVersion: "1.0.0",
    runtimeVersion: "1.0.0",
    releaseId: "orders-system",
    releaseVersion: "0.0.1",
    publishedAt: "2026-09-01T01:15:00.000Z",
    environment: { kind: "EnvironmentProfile" as const, environmentRef: "environment:p19:runtime-handoff", runtimeVersions: ["1.0.0"], bindings: [] },
    acceptanceChecks: [{ name: "factory-e2e", pass: true }],
    startedAt: "2026-09-01T01:16:00.000Z",
    completedAt: "2026-09-01T01:17:00.000Z",
  };
  return {
    contractVersion: FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION,
    prerequisites: { nodeVersion: "24.0.0", npmVersion: "11.0.0", factoryE2EAvailable: true },
    config: { inputPath: "fixture://runtime-handoff" },
    factoryInput,
  };
}

function setup() {
  const raw = bootstrapInput();
  const bootstrap = executeFactoryOperatorBootstrap(raw);
  const environment = raw.factoryInput.environment;
  let payloadReads = 0;
  const artifactPayloadReader = {
    getVerified: () => {
      payloadReads += 1;
      throw new Error("TASK-439 preflight must not read artifact payload");
    },
  };
  return { bootstrap, environment, artifactPayloadReader, payloadReads: () => payloadReads };
}

test("TASK-439 binds exact canonical bootstrap predecessors deterministically without side effects", () => {
  const firstSetup = setup();
  const inputSnapshot = JSON.stringify({ bootstrap: firstSetup.bootstrap, environment: firstSetup.environment });
  const first = preflightRuntimeMaterializationHandoff(firstSetup);
  const second = preflightRuntimeMaterializationHandoff(firstSetup);

  assert.deepEqual(first, second);
  assert.equal(first.publishedRelease, firstSetup.bootstrap.result.publishedRelease);
  assert.equal(first.releaseArtifact, firstSetup.bootstrap.result.releaseArtifact);
  assert.equal(first.deploymentRecord, firstSetup.bootstrap.result.deploymentRecord);
  assert.equal(first.environment, firstSetup.environment);
  assert.equal(firstSetup.payloadReads(), 0);
  assert.equal(JSON.stringify({ bootstrap: firstSetup.bootstrap, environment: firstSetup.environment }), inputSnapshot);
});

test("TASK-439 rejects stale or substituted release/artifact/deployment predecessors before payload access", () => {
  const base = setup();
  const canonical = base.bootstrap.result;

  const substitutedRelease = {
    ...base.bootstrap,
    result: { ...canonical, publishedRelease: { ...(canonical.publishedRelease as object), version: "9.9.9" } },
  } as typeof base.bootstrap;
  assert.throws(
    () => preflightRuntimeMaterializationHandoff({ ...base, bootstrap: substitutedRelease }),
    /RUNTIME_HANDOFF_DEPLOYMENT_PREDECESSOR_MISMATCH/,
  );

  const substitutedArtifact = {
    ...base.bootstrap,
    result: { ...canonical, releaseArtifact: { ...(canonical.releaseArtifact as object), artifactHash: "sha256:substituted" } },
  } as typeof base.bootstrap;
  assert.throws(
    () => preflightRuntimeMaterializationHandoff({ ...base, bootstrap: substitutedArtifact }),
    /RUNTIME_HANDOFF_ARTIFACT_MISMATCH/,
  );

  const staleDeployment = {
    ...base.bootstrap,
    result: { ...canonical, deploymentRecord: { ...(canonical.deploymentRecord as object), publishedReleaseRef: "orders-system@0.0.0" } },
  } as typeof base.bootstrap;
  assert.throws(
    () => preflightRuntimeMaterializationHandoff({ ...base, bootstrap: staleDeployment }),
    /RUNTIME_HANDOFF_DEPLOYMENT_PREDECESSOR_MISMATCH/,
  );
  assert.equal(base.payloadReads(), 0);
});

test("TASK-439 rejects incompatible environment and embedded protected values before activation", () => {
  const base = setup();
  assert.throws(
    () => preflightRuntimeMaterializationHandoff({
      ...base,
      environment: { ...base.environment, runtimeVersions: ["2.0.0"] },
    }),
    /RUNTIME_HANDOFF_RUNTIME_INCOMPATIBLE/,
  );

  const unsafeEnvironment = {
    ...base.environment,
    bindings: [{ name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://database", value: "do-not-carry" }],
  };
  assert.throws(
    () => preflightRuntimeMaterializationHandoff({ ...base, environment: unsafeEnvironment }),
    /RUNTIME_HANDOFF_ENVIRONMENT_VALUE_NOT_ALLOWED/,
  );
  assert.equal(base.payloadReads(), 0);
});

test("TASK-439 rejects malformed canonical output and never trusts bootstrap progress as identity authority", () => {
  const base = setup();
  const malformed = {
    ...base.bootstrap,
    progress: { ...(base.bootstrap.progress as object), releaseId: "attacker-release" },
    result: { ...base.bootstrap.result, publishedRelease: null },
  } as unknown as typeof base.bootstrap;

  assert.throws(
    () => preflightRuntimeMaterializationHandoff({ ...base, bootstrap: malformed }),
    /PublishedRelease must be an object/,
  );
  assert.equal(base.payloadReads(), 0);
});

test("TASK-440 invokes the existing Deploy adapter exactly once after mandatory preflight", async () => {
  const base = setup();
  const expectedBinding = preflightRuntimeMaterializationHandoff(base);
  let calls = 0;
  let captured: unknown;
  const result = await invokeRuntimeMaterializationHandoff(base, async (input) => {
    calls += 1;
    captured = input;
    return Object.freeze({
      ok: false as const,
      activated: false,
      diagnostic: Object.freeze({ code: "ARTIFACT_PAYLOAD_INVALID" as const, detail: "proof-only-deploy-invoker" }),
      stdout: "",
      stderr: "",
      exitCode: null,
    });
  });

  assert.equal(calls, 1);
  assert.equal(base.payloadReads(), 0);
  assert.equal((captured as { publishedRelease: unknown }).publishedRelease, base.bootstrap.result.publishedRelease);
  assert.equal((captured as { releaseArtifact: unknown }).releaseArtifact, base.bootstrap.result.releaseArtifact);
  assert.equal((captured as { environment: unknown }).environment, base.environment);
  assert.equal(result.publishedReleaseRef, expectedBinding.deploymentRecord.publishedReleaseRef);
  assert.equal(result.artifactHash, expectedBinding.releaseArtifact.artifactHash);
  assert.equal(result.deploymentId, expectedBinding.deploymentRecord.deploymentId);
  assert.equal(result.deploy.ok, false);
});

test("TASK-440 rejects stale preflight evidence before any Deploy invocation", async () => {
  const base = setup();
  let calls = 0;
  await assert.rejects(
    invokeRuntimeMaterializationHandoff(
      { ...base, environment: { ...base.environment, runtimeVersions: ["2.0.0"] } },
      async () => {
        calls += 1;
        throw new Error("Deploy must not run after preflight rejection");
      },
    ),
    /RUNTIME_HANDOFF_RUNTIME_INCOMPATIBLE/,
  );
  assert.equal(calls, 0);
  assert.equal(base.payloadReads(), 0);
});
