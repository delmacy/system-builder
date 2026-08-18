import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";
import { InMemoryArtifactPayloadRepository } from "../../packages/artifact-store/index.js";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { SingleHostActiveRuntimeOrchestrator } from "../../packages/deploy/active-runtime.js";
import { DeploymentRegistry, InMemoryDeploymentRecordStorage, type DeploymentRecord, type DeploymentRecordStorage } from "../../packages/deploy/index.js";
import { ReleaseRegistry } from "../../packages/release/index.js";

const assemblyPlan = {
  kind: "AssemblyPlan" as const,
  systemDefinitionRef: "system-definition:active-runtime:1",
  components: [{ capability: "auth.basic", provider: "provider-auth", version: "1.0.0" }],
  sourceRefs: ["system-definition:active-runtime:1"],
  contentHash: `sha256:${"c".repeat(64)}`,
};
const validationEvidence = {
  kind: "ValidationEvidence" as const,
  assemblyPlanRef: assemblyPlan.contentHash,
  decision: "PASS" as const,
  evidenceHash: `sha256:${"d".repeat(64)}`,
};

function fixture(version: string, publishedAt: string) {
  const compilation = compileSyntheticRelease({ assemblyPlan, validationEvidence, compilerVersion: "0.3.0", runtimeVersion: "0.3.0", environmentSchema: [] });
  const artifacts = new InMemoryArtifactPayloadRepository();
  artifacts.publish({ artifactHash: compilation.artifact.artifactHash, files: compilation.files });
  const publishedRelease = new ReleaseRegistry().publish({ releaseId: "active-runtime", version, artifact: compilation.artifact, publishedAt });
  const environment = { kind: "EnvironmentProfile" as const, environmentRef: "environment:active-runtime", runtimeVersions: ["0.3.0"], bindings: [] };
  return { compilation, artifacts, publishedRelease, environment };
}

function input(version: string, minute: number, expectedActiveDeploymentId: string | null) {
  const value = fixture(version, `2026-08-18T00:${minute.toString().padStart(2, "0")}:00Z`);
  return {
    publishedRelease: value.publishedRelease,
    releaseArtifact: value.compilation.artifact,
    artifactPayloadReader: value.artifacts,
    environment: value.environment,
    processEnvironment: { SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1", SYSTEM_BUILDER_OBSERVE_URL: "http://127.0.0.1:1" },
    expectedActiveDeploymentId,
    startedAt: `2026-08-18T00:${minute.toString().padStart(2, "0")}:01Z`,
    completedAt: `2026-08-18T00:${minute.toString().padStart(2, "0")}:02Z`,
  };
}

test("TASK-122 accepted B promotes atomically while A remains UP until authority decides", async () => {
  const backing = new InMemoryDeploymentRecordStorage();
  const holder: { orchestrator?: SingleHostActiveRuntimeOrchestrator } = {};
  let observedAUpDuringBDecision = false;
  const storage: DeploymentRecordStorage = {
    has: (id) => backing.has(id),
    get: (id) => backing.get(id),
    set: (id, record) => backing.set(id, record),
    values: () => backing.values(),
    getActiveDeploymentId: (environmentRef) => backing.getActiveDeploymentId(environmentRef),
    setActiveDeploymentId: (environmentRef, id) => backing.setActiveDeploymentId(environmentRef, id),
    activateAtomically: async (record: DeploymentRecord, expected) => {
      if (expected !== null) {
        const orchestrator = holder.orchestrator;
        assert.ok(orchestrator);
        const active = orchestrator.getActive(record.environmentRef);
        assert.ok(active);
        assert.equal(active.deploymentId, expected);
        assert.equal(active.process.state, "running");
        assert.equal((await orchestrator.health(record.environmentRef)).status, "UP");
        observedAUpDuringBDecision = true;
      }
      return backing.activateAtomically(record, expected);
    },
  };
  const registry = new DeploymentRegistry(storage);
  const orchestrator = new SingleHostActiveRuntimeOrchestrator(registry);
  holder.orchestrator = orchestrator;

  const a = await orchestrator.promote(input("1.0.0", 10, null));
  assert.equal(a.ok, true);
  if (!a.ok) return;
  assert.equal(a.promoted, true);
  assert.equal(a.decision.outcome, "activated");
  assert.ok(a.active);
  const aSnapshot = a.active.process;
  assert.equal(aSnapshot.state, "running");
  assert.equal(registry.getActive(aSnapshot.environmentRef)?.deploymentId, a.candidateRecord.deploymentId);

  const b = await orchestrator.promote(input("1.1.0", 11, a.candidateRecord.deploymentId));
  assert.equal(b.ok, true);
  if (!b.ok) return;
  assert.equal(observedAUpDuringBDecision, true);
  assert.equal(b.promoted, true);
  assert.equal(b.decision.outcome, "activated");
  assert.equal(b.decision.previousActiveDeploymentId, a.candidateRecord.deploymentId);
  assert.equal(b.decision.resultingActiveDeploymentId, b.candidateRecord.deploymentId);
  assert.equal(orchestrator.getActive(aSnapshot.environmentRef)?.deploymentId, b.candidateRecord.deploymentId);
  assert.equal((await orchestrator.health(aSnapshot.environmentRef)).status, "UP");
  await assert.rejects(access(aSnapshot.workingDirectory));
  await assert.rejects(fetch(`http://127.0.0.1:${aSnapshot.port}/health`));

  const stoppedB = await orchestrator.stopActive(aSnapshot.environmentRef);
  assert.ok(stoppedB);
  assert.equal(stoppedB.process.state, "stopped");
});

test("TASK-123 stale accepted contender is cleaned and cannot replace or terminate B", async () => {
  const registry = new DeploymentRegistry(new InMemoryDeploymentRecordStorage());
  const orchestrator = new SingleHostActiveRuntimeOrchestrator(registry);
  const a = await orchestrator.promote(input("1.0.0", 12, null));
  assert.equal(a.ok, true);
  if (!a.ok) return;
  const b = await orchestrator.promote(input("1.1.0", 13, a.candidateRecord.deploymentId));
  assert.equal(b.ok, true);
  if (!b.ok) return;
  assert.equal(b.promoted, true);
  assert.ok(b.active);

  const c = await orchestrator.promote(input("1.2.0", 14, a.candidateRecord.deploymentId));
  assert.equal(c.ok, true);
  if (!c.ok) return;
  assert.equal(c.promoted, false);
  assert.equal(c.decision.outcome, "stale-active");
  assert.equal(c.decision.previousActiveDeploymentId, b.candidateRecord.deploymentId);
  assert.equal(c.decision.resultingActiveDeploymentId, b.candidateRecord.deploymentId);
  assert.equal(c.candidateFinal.state, "stopped");
  await assert.rejects(access(c.candidateFinal.workingDirectory));
  assert.equal(orchestrator.getActive(b.active.process.environmentRef)?.deploymentId, b.candidateRecord.deploymentId);
  assert.equal(registry.getActive(b.active.process.environmentRef)?.deploymentId, b.candidateRecord.deploymentId);
  assert.equal((await orchestrator.health(b.active.process.environmentRef)).status, "UP");
  await orchestrator.stopActive(b.active.process.environmentRef);
});

test("TASK-123 failed candidate never reaches authority and preserves B", async () => {
  const registry = new DeploymentRegistry(new InMemoryDeploymentRecordStorage());
  const orchestrator = new SingleHostActiveRuntimeOrchestrator(registry);
  const a = await orchestrator.promote(input("1.0.0", 15, null));
  assert.equal(a.ok, true);
  if (!a.ok) return;
  const b = await orchestrator.promote(input("1.1.0", 16, a.candidateRecord.deploymentId));
  assert.equal(b.ok, true);
  if (!b.ok || !b.active) return;
  const recordsBefore = registry.list().length;

  const failedInput = input("1.2.0", 17, b.candidateRecord.deploymentId);
  const verified = failedInput.artifactPayloadReader.getVerified(failedInput.releaseArtifact);
  const invalidEntry = `console.log("invalid-startup"); setInterval(() => {}, 1000);`;
  const failed = await orchestrator.promote({
    ...failedInput,
    artifactPayloadReader: {
      getVerified: () => ({
        ...verified,
        files: verified.files.map((file) => file.path === "runtime-entry.mjs" ? { ...file, content: invalidEntry } : file),
      }),
    },
    timeoutMs: 1_000,
  });
  assert.equal(failed.ok, false);
  if (failed.ok) return;
  assert.equal(failed.outcome, "candidate-failed");
  assert.equal(failed.diagnostic.code, "RUNTIME_STARTUP_INVALID");
  assert.equal(registry.list().length, recordsBefore);
  assert.equal(registry.getActive(b.active.process.environmentRef)?.deploymentId, b.candidateRecord.deploymentId);
  assert.equal(orchestrator.getActive(b.active.process.environmentRef)?.deploymentId, b.candidateRecord.deploymentId);
  assert.equal((await orchestrator.health(b.active.process.environmentRef)).status, "UP");
  await orchestrator.stopActive(b.active.process.environmentRef);
});

test("TASK-123 local process and durable authority divergence fails closed before candidate start", async () => {
  const registry = new DeploymentRegistry(new InMemoryDeploymentRecordStorage());
  const orchestrator = new SingleHostActiveRuntimeOrchestrator(registry);
  const a = await orchestrator.promote(input("1.0.0", 18, null));
  assert.equal(a.ok, true);
  if (!a.ok || !a.active) return;
  const external: DeploymentRecord = Object.freeze({
    ...a.candidateRecord,
    deploymentId: `sha256:${"e".repeat(64)}`,
    startedAt: "2026-08-18T00:19:01Z",
    completedAt: "2026-08-18T00:19:02Z",
  });
  registry.record(external);
  const recordsBefore = registry.list().length;

  const mismatch = await orchestrator.promote(input("1.1.0", 20, external.deploymentId));
  assert.equal(mismatch.ok, false);
  if (mismatch.ok) return;
  assert.equal(mismatch.outcome, "local-active-mismatch");
  assert.equal(mismatch.diagnostic.code, "LOCAL_ACTIVE_MISMATCH");
  assert.equal(mismatch.active?.deploymentId, a.candidateRecord.deploymentId);
  assert.equal(registry.list().length, recordsBefore);
  assert.equal((await orchestrator.health(a.active.process.environmentRef)).status, "UP");
  await orchestrator.stopActive(a.active.process.environmentRef);
});
