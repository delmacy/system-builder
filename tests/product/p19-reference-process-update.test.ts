import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";

import { InMemoryArtifactPayloadRepository } from "../../packages/artifact-store/index.js";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { SingleHostActiveRuntimeOrchestrator } from "../../packages/deploy/active-runtime.js";
import { DeploymentRegistry, InMemoryDeploymentRecordStorage } from "../../packages/deploy/index.js";
import { ReleaseRegistry } from "../../packages/release/index.js";

const assemblyPlan = {
  kind: "AssemblyPlan" as const,
  systemDefinitionRef: "system-definition:reference-orders:v1",
  components: [{ capability: "orders", provider: "builtin", version: "1.0.0" }],
  sourceRefs: ["process-revision:reference-orders:v1", "analysis:reference-orders:v1", "system-definition:reference-orders:v1"],
  contentHash: `sha256:${"a".repeat(64)}`,
};
const validationEvidence = {
  kind: "ValidationEvidence" as const,
  assemblyPlanRef: assemblyPlan.contentHash,
  decision: "PASS" as const,
  evidenceHash: `sha256:${"b".repeat(64)}`,
};

function candidate(version: string, minute: number, expectedActiveDeploymentId: string | null) {
  const compilation = compileSyntheticRelease({
    assemblyPlan,
    validationEvidence,
    compilerVersion: "1.0.0",
    runtimeVersion: "1.0.0",
    environmentSchema: [],
  });
  const artifacts = new InMemoryArtifactPayloadRepository();
  artifacts.publish({ artifactHash: compilation.artifact.artifactHash, files: compilation.files });
  const publishedRelease = new ReleaseRegistry().publish({
    releaseId: "reference-orders-system",
    version,
    artifact: compilation.artifact,
    publishedAt: `2026-09-01T14:${minute.toString().padStart(2, "0")}:00.000Z`,
  });
  return {
    publishedRelease,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: artifacts,
    environment: {
      kind: "EnvironmentProfile" as const,
      environmentRef: "environment:p19:reference-process",
      runtimeVersions: ["1.0.0"],
      bindings: [],
    },
    processEnvironment: {
      SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1",
      SYSTEM_BUILDER_OBSERVE_URL: "http://127.0.0.1:1",
    },
    expectedActiveDeploymentId,
    startedAt: `2026-09-01T14:${minute.toString().padStart(2, "0")}:01.000Z`,
    completedAt: `2026-09-01T14:${minute.toString().padStart(2, "0")}:02.000Z`,
  };
}

test("TASK-454 promotes compatible reference successor B and retains exact predecessor A until atomic activation", async () => {
  const registry = new DeploymentRegistry(new InMemoryDeploymentRecordStorage());
  const orchestrator = new SingleHostActiveRuntimeOrchestrator(registry);

  const a = await orchestrator.promote(candidate("0.0.1", 20, null));
  assert.equal(a.ok, true);
  if (!a.ok || !a.active) return;
  const aDeploymentId = a.candidateRecord.deploymentId;
  const aWorkingDirectory = a.active.process.workingDirectory;
  assert.equal(a.decision.outcome, "activated");
  assert.equal((await orchestrator.health(a.active.process.environmentRef)).status, "UP");

  const b = await orchestrator.promote(candidate("0.0.2", 21, aDeploymentId));
  assert.equal(b.ok, true);
  if (!b.ok || !b.active) return;
  assert.equal(b.promoted, true);
  assert.equal(b.decision.outcome, "activated");
  assert.equal(b.decision.previousActiveDeploymentId, aDeploymentId);
  assert.equal(b.decision.resultingActiveDeploymentId, b.candidateRecord.deploymentId);
  assert.equal(b.candidateRecord.publishedReleaseRef, "reference-orders-system@0.0.2");
  assert.equal(b.candidateRecord.environmentRef, "environment:p19:reference-process");
  assert.equal(registry.getActive(b.active.process.environmentRef)?.deploymentId, b.candidateRecord.deploymentId);
  assert.equal((await orchestrator.health(b.active.process.environmentRef)).status, "UP");
  await assert.rejects(access(aWorkingDirectory));

  await orchestrator.stopActive(b.active.process.environmentRef);
});

test("TASK-454 rejects stale and failed reference successors without perturbing last-known-good B", async () => {
  const registry = new DeploymentRegistry(new InMemoryDeploymentRecordStorage());
  const orchestrator = new SingleHostActiveRuntimeOrchestrator(registry);

  const a = await orchestrator.promote(candidate("0.0.1", 22, null));
  assert.equal(a.ok, true);
  if (!a.ok) return;
  const b = await orchestrator.promote(candidate("0.0.2", 23, a.candidateRecord.deploymentId));
  assert.equal(b.ok, true);
  if (!b.ok || !b.active) return;
  const bDeploymentId = b.candidateRecord.deploymentId;
  const environmentRef = b.active.process.environmentRef;

  const stale = await orchestrator.promote(candidate("0.0.3", 24, a.candidateRecord.deploymentId));
  assert.equal(stale.ok, true);
  if (!stale.ok) return;
  assert.equal(stale.promoted, false);
  assert.equal(stale.decision.outcome, "stale-active");
  assert.equal(stale.decision.resultingActiveDeploymentId, bDeploymentId);
  assert.equal(registry.getActive(environmentRef)?.deploymentId, bDeploymentId);
  assert.equal((await orchestrator.health(environmentRef)).status, "UP");

  const failedInput = candidate("0.0.4", 25, bDeploymentId);
  const verified = failedInput.artifactPayloadReader.getVerified(failedInput.releaseArtifact);
  const failed = await orchestrator.promote({
    ...failedInput,
    artifactPayloadReader: {
      getVerified: () => ({
        ...verified,
        files: verified.files.map((file) => file.path === "runtime-entry.mjs"
          ? { ...file, content: "console.log('invalid-startup'); setInterval(() => {}, 1000);" }
          : file),
      }),
    },
    timeoutMs: 1_000,
  });
  assert.equal(failed.ok, false);
  if (failed.ok) return;
  assert.equal(failed.outcome, "candidate-failed");
  assert.equal(failed.diagnostic.code, "RUNTIME_STARTUP_INVALID");
  assert.equal(registry.getActive(environmentRef)?.deploymentId, bDeploymentId);
  assert.equal(orchestrator.getActive(environmentRef)?.deploymentId, bDeploymentId);
  assert.equal((await orchestrator.health(environmentRef)).status, "UP");

  await orchestrator.stopActive(environmentRef);
});

test("TASK-455 restores exact retained A after B without regenerating release identity", async () => {
  const registry = new DeploymentRegistry(new InMemoryDeploymentRecordStorage());
  const orchestrator = new SingleHostActiveRuntimeOrchestrator(registry);
  const retainedA = candidate("0.0.1", 26, null);

  const a = await orchestrator.promote(retainedA);
  assert.equal(a.ok, true);
  if (!a.ok || !a.active) return;
  const originalARelease = retainedA.publishedRelease;
  const originalAArtifact = retainedA.releaseArtifact;
  const originalAArtifactHash = originalAArtifact.artifactHash;

  const retainedB = candidate("0.0.2", 27, a.candidateRecord.deploymentId);
  const b = await orchestrator.promote(retainedB);
  assert.equal(b.ok, true);
  if (!b.ok || !b.active) return;
  const bDeploymentId = b.candidateRecord.deploymentId;

  const restored = await orchestrator.promote({
    ...retainedA,
    expectedActiveDeploymentId: bDeploymentId,
    startedAt: "2026-09-01T14:28:01.000Z",
    completedAt: "2026-09-01T14:28:02.000Z",
  });
  assert.equal(restored.ok, true);
  if (!restored.ok || !restored.active) return;
  assert.equal(restored.promoted, true);
  assert.equal(restored.decision.outcome, "activated");
  assert.equal(restored.decision.previousActiveDeploymentId, bDeploymentId);
  assert.equal(restored.candidateRecord.publishedReleaseRef, "reference-orders-system@0.0.1");
  assert.equal(restored.candidateRecord.artifactHash, originalAArtifactHash);
  assert.equal(retainedA.publishedRelease, originalARelease);
  assert.equal(retainedA.releaseArtifact, originalAArtifact);
  assert.equal(restored.candidateRecord.environmentRef, "environment:p19:reference-process");
  assert.equal(registry.getActive(restored.active.process.environmentRef)?.deploymentId, restored.candidateRecord.deploymentId);
  assert.equal((await orchestrator.health(restored.active.process.environmentRef)).status, "UP");

  const staleRestore = await orchestrator.promote({
    ...retainedB,
    expectedActiveDeploymentId: bDeploymentId,
    startedAt: "2026-09-01T14:29:01.000Z",
    completedAt: "2026-09-01T14:29:02.000Z",
  });
  assert.equal(staleRestore.ok, true);
  if (!staleRestore.ok) return;
  assert.equal(staleRestore.promoted, false);
  assert.equal(staleRestore.decision.outcome, "stale-active");
  assert.equal(staleRestore.decision.resultingActiveDeploymentId, restored.candidateRecord.deploymentId);
  assert.equal(registry.getActive(restored.active.process.environmentRef)?.deploymentId, restored.candidateRecord.deploymentId);
  assert.equal((await orchestrator.health(restored.active.process.environmentRef)).status, "UP");

  await orchestrator.stopActive(restored.active.process.environmentRef);
});
