import assert from "node:assert/strict";
import test from "node:test";
import { InMemoryArtifactPayloadRepository } from "../../packages/artifact-store/index.js";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { SingleHostActiveRuntimeOrchestrator } from "../../packages/deploy/active-runtime.js";
import { DeploymentRegistry, dryRunDeploy, InMemoryDeploymentRecordStorage } from "../../packages/deploy/index.js";
import { SingleHostRuntimeReconciler } from "../../packages/deploy/runtime-reconciliation.js";
import { InMemorySecretResolver } from "../../packages/deploy/secret-resolver.js";
import { ReleaseRegistry } from "../../packages/release/index.js";

const assemblyPlan = {
  kind: "AssemblyPlan" as const,
  systemDefinitionRef: "system-definition:reconcile:1",
  components: [{ capability: "auth.basic", provider: "provider-auth", version: "1.0.0" }],
  sourceRefs: ["system-definition:reconcile:1"],
  contentHash: `sha256:${"c".repeat(64)}`,
};
const validationEvidence = {
  kind: "ValidationEvidence" as const,
  assemblyPlanRef: assemblyPlan.contentHash,
  decision: "PASS" as const,
  evidenceHash: `sha256:${"d".repeat(64)}`,
};

function fixture() {
  const compilation = compileSyntheticRelease({ assemblyPlan, validationEvidence, compilerVersion: "0.9.0", runtimeVersion: "0.9.0", environmentSchema: [] });
  const artifacts = new InMemoryArtifactPayloadRepository();
  artifacts.publish({ artifactHash: compilation.artifact.artifactHash, files: compilation.files });
  const releases = new ReleaseRegistry();
  const releaseA = releases.publish({ releaseId: "reconcile-runtime", version: "1.0.0", artifact: compilation.artifact, publishedAt: "2026-08-18T00:40:00Z" });
  const releaseB = releases.publish({ releaseId: "reconcile-runtime", version: "1.1.0", artifact: compilation.artifact, publishedAt: "2026-08-18T00:41:00Z" });
  const environment = { kind: "EnvironmentProfile" as const, environmentRef: "environment:reconcile-test", runtimeVersions: ["0.9.0"], bindings: [] as Array<{ name: string; kind: "config" | "secret-reference"; reference: string }> };
  const registry = new DeploymentRegistry(new InMemoryDeploymentRecordStorage());
  return { compilation, artifacts, releaseA, releaseB, environment, registry };
}

function promotionInput(value: ReturnType<typeof fixture>, release: ReturnType<typeof fixture>["releaseA"], expectedActiveDeploymentId: string | null, startedAt: string, completedAt: string) {
  return { publishedRelease: release, releaseArtifact: value.compilation.artifact, artifactPayloadReader: value.artifacts, environment: value.environment, expectedActiveDeploymentId, startedAt, completedAt };
}

function activateRecord(value: ReturnType<typeof fixture>, environment = value.environment) {
  return dryRunDeploy({
    publishedRelease: value.releaseB,
    releaseArtifact: value.compilation.artifact,
    environment,
    acceptanceChecks: [{ name: "runtime-health", pass: true }],
    startedAt: "2026-08-18T00:44:00Z",
    completedAt: "2026-08-18T00:44:01Z",
  });
}

function overriddenReader(value: ReturnType<typeof fixture>, runtimeEntry: string) {
  const verified = value.artifacts.getVerified(value.compilation.artifact);
  return {
    getVerified: () => ({
      ...verified,
      files: verified.files.map((file) => file.path === "runtime-entry.mjs" ? { ...file, content: runtimeEntry } : file),
    }),
  };
}

test("TASK-125 fresh reconciler rematerializes durable authoritative B after controlled manager shutdown", async () => {
  const value = fixture();
  const manager = new SingleHostActiveRuntimeOrchestrator(value.registry);
  const a = await manager.promote(promotionInput(value, value.releaseA, null, "2026-08-18T00:42:00Z", "2026-08-18T00:42:01Z"));
  assert.equal(a.ok, true);
  if (!a.ok || !a.promoted || a.active === null) throw new Error("TASK125_A_PROMOTION_FAILED");
  const b = await manager.promote(promotionInput(value, value.releaseB, a.candidateRecord.deploymentId, "2026-08-18T00:43:00Z", "2026-08-18T00:43:01Z"));
  assert.equal(b.ok, true);
  if (!b.ok || !b.promoted || b.active === null) throw new Error("TASK125_B_PROMOTION_FAILED");
  assert.equal((await manager.health(value.environment.environmentRef)).status, "UP");
  const authoritativeB = value.registry.getActive(value.environment.environmentRef);
  assert.ok(authoritativeB);
  const authorityBeforeRestart = JSON.stringify({ active: authoritativeB, history: value.registry.list() });
  const stopped = await manager.stopActive(value.environment.environmentRef);
  assert.ok(stopped);
  assert.equal(stopped.process.state, "stopped");
  assert.equal(value.registry.getActive(value.environment.environmentRef)?.deploymentId, authoritativeB.deploymentId);

  const fresh = new SingleHostRuntimeReconciler(value.registry);
  const reconciled = await fresh.reconcile({ publishedRelease: value.releaseB, releaseArtifact: value.compilation.artifact, artifactPayloadReader: value.artifacts, environment: value.environment });
  assert.equal(reconciled.ok, true);
  if (!reconciled.ok) throw new Error("TASK125_RECONCILIATION_FAILED");
  assert.equal(reconciled.deployment.deploymentId, authoritativeB.deploymentId);
  assert.equal(reconciled.active.process.state, "running");
  assert.equal((await fresh.health(value.environment.environmentRef)).status, "UP");
  assert.equal(JSON.stringify({ active: value.registry.getActive(value.environment.environmentRef), history: value.registry.list() }), authorityBeforeRestart);
  await fresh.shutdown(value.environment.environmentRef);
  assert.equal(value.registry.getActive(value.environment.environmentRef)?.deploymentId, authoritativeB.deploymentId);
});

test("TASK-125 reconciliation rejects non-authoritative release before managed process exists", async () => {
  const value = fixture();
  const candidate = activateRecord(value);
  assert.equal(candidate.ok, true);
  if (!candidate.ok) throw new Error("TASK125_RECORD_FAILED");
  assert.equal((await value.registry.activateCandidateAtomically(candidate.record, null)).outcome, "activated");
  const fresh = new SingleHostRuntimeReconciler(value.registry);
  const result = await fresh.reconcile({ publishedRelease: value.releaseA, releaseArtifact: value.compilation.artifact, artifactPayloadReader: value.artifacts, environment: value.environment });
  assert.equal(result.ok, false);
  if (result.ok) throw new Error("TASK125_MISMATCH_ACCEPTED");
  assert.equal(result.diagnostic.code, "AUTHORITY_RELEASE_MISMATCH");
  assert.equal(fresh.getActive(value.environment.environmentRef), null);
  assert.equal(value.registry.getActive(value.environment.environmentRef)?.deploymentId, candidate.record.deploymentId);
});

test("TASK-126 no active authority fails closed without creating managed state", async () => {
  const value = fixture();
  const fresh = new SingleHostRuntimeReconciler(value.registry);
  const result = await fresh.reconcile({ publishedRelease: value.releaseB, releaseArtifact: value.compilation.artifact, artifactPayloadReader: value.artifacts, environment: value.environment });
  assert.equal(result.ok, false);
  if (result.ok) throw new Error("TASK126_NO_AUTHORITY_ACCEPTED");
  assert.equal(result.diagnostic.code, "NO_ACTIVE_AUTHORITY");
  assert.equal(fresh.getActive(value.environment.environmentRef), null);
  assert.equal(value.registry.list().length, 0);
});

test("TASK-126 duplicate reconciliation reuses the same managed B and controlled shutdown preserves authority", async () => {
  const value = fixture();
  const candidate = activateRecord(value);
  assert.equal(candidate.ok, true);
  if (!candidate.ok) throw new Error("TASK126_RECORD_FAILED");
  assert.equal((await value.registry.activateCandidateAtomically(candidate.record, null)).outcome, "activated");
  const fresh = new SingleHostRuntimeReconciler(value.registry);
  const first = await fresh.reconcile({ publishedRelease: value.releaseB, releaseArtifact: value.compilation.artifact, artifactPayloadReader: value.artifacts, environment: value.environment });
  assert.equal(first.ok, true);
  if (!first.ok) throw new Error("TASK126_FIRST_RECONCILIATION_FAILED");
  const second = await fresh.reconcile({ publishedRelease: value.releaseB, releaseArtifact: value.compilation.artifact, artifactPayloadReader: value.artifacts, environment: value.environment });
  assert.equal(second.ok, true);
  if (!second.ok) throw new Error("TASK126_SECOND_RECONCILIATION_FAILED");
  assert.equal(second.alreadyReconciled, true);
  assert.equal(second.active.process.port, first.active.process.port);
  assert.equal(second.active.process.workingDirectory, first.active.process.workingDirectory);
  assert.equal((await fresh.health(value.environment.environmentRef)).status, "UP");
  const stopped = await fresh.shutdown(value.environment.environmentRef);
  assert.ok(stopped);
  assert.equal(stopped.process.state, "stopped");
  assert.equal(fresh.getActive(value.environment.environmentRef), null);
  assert.equal(value.registry.getActive(value.environment.environmentRef)?.deploymentId, candidate.record.deploymentId);
});

test("TASK-126 startup failure redacts resolved secret and leaves durable B untouched", async () => {
  const value = fixture();
  const secretValue = "reconciliation-secret-value";
  const environment = {
    ...value.environment,
    bindings: [{ name: "RECONCILE_SECRET", kind: "secret-reference" as const, reference: "secret://reconcile/runtime" }],
  };
  const candidate = activateRecord(value, environment);
  assert.equal(candidate.ok, true);
  if (!candidate.ok) throw new Error("TASK126_SECRET_RECORD_FAILED");
  assert.equal((await value.registry.activateCandidateAtomically(candidate.record, null)).outcome, "activated");
  const invalidEntry = `console.log(process.env.RECONCILE_SECRET); setInterval(() => {}, 1000);`;
  const fresh = new SingleHostRuntimeReconciler(value.registry);
  const result = await fresh.reconcile({
    publishedRelease: value.releaseB,
    releaseArtifact: value.compilation.artifact,
    artifactPayloadReader: overriddenReader(value, invalidEntry),
    environment,
    secretResolver: new InMemorySecretResolver({ "secret://reconcile/runtime": secretValue }),
    timeoutMs: 1_000,
  });
  assert.equal(result.ok, false);
  if (result.ok) throw new Error("TASK126_INVALID_STARTUP_ACCEPTED");
  assert.equal(result.diagnostic.code, "RUNTIME_STARTUP_INVALID");
  assert.equal(JSON.stringify(result).includes(secretValue), false);
  assert.equal(fresh.getActive(environment.environmentRef), null);
  assert.equal(value.registry.getActive(environment.environmentRef)?.deploymentId, candidate.record.deploymentId);
});
