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

test("TASK-122 local expected-active mismatch fails before candidate start and preserves A", async () => {
  const registry = new DeploymentRegistry(new InMemoryDeploymentRecordStorage());
  const orchestrator = new SingleHostActiveRuntimeOrchestrator(registry);
  const a = await orchestrator.promote(input("1.0.0", 12, null));
  assert.equal(a.ok, true);
  if (!a.ok) return;
  const activeA = a.active;
  assert.ok(activeA);

  const mismatch = await orchestrator.promote(input("1.1.0", 13, `sha256:${"f".repeat(64)}`));
  assert.equal(mismatch.ok, false);
  if (mismatch.ok) return;
  assert.equal(mismatch.outcome, "local-active-mismatch");
  assert.equal(mismatch.diagnostic.code, "LOCAL_ACTIVE_MISMATCH");
  assert.equal(mismatch.active?.deploymentId, a.candidateRecord.deploymentId);
  assert.equal((await orchestrator.health(activeA.process.environmentRef)).status, "UP");
  assert.equal(registry.getActive(activeA.process.environmentRef)?.deploymentId, a.candidateRecord.deploymentId);
  await orchestrator.stopActive(activeA.process.environmentRef);
});
