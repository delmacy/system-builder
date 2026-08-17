import assert from "node:assert/strict";
import test from "node:test";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import { DeploymentRegistry, dryRunDeploy } from "../../packages/deploy/index.js";

const artifactHash = `sha256:${"c".repeat(64)}`;
const release = Object.freeze({
  kind: "PublishedRelease" as const,
  releaseId: "app",
  version: "1.0.0",
  artifactRef: artifactHash,
  artifactHash,
  validationEvidenceRef: `sha256:${"d".repeat(64)}`,
  publishedAt: "2026-08-16T00:00:00Z",
  status: "published" as const,
});
const artifact = Object.freeze({
  kind: "ReleaseArtifact" as const,
  artifactHash,
  manifest: Object.freeze({ runtimeVersion: "runtime-1" }),
  environmentSchema: Object.freeze([
    Object.freeze({ name: "DATABASE_URL", kind: "secret-reference" as const, required: true }),
    Object.freeze({ name: "PORT", kind: "config" as const, required: true }),
  ]),
});
const environment: EnvironmentProfile = Object.freeze({
  kind: "EnvironmentProfile",
  environmentRef: "env:test",
  runtimeVersions: Object.freeze(["runtime-1"]),
  bindings: Object.freeze([
    Object.freeze({ name: "PORT", kind: "config" as const, reference: "config://PORT" }),
    Object.freeze({ name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://database-url" }),
  ]),
});

test("deploy dry-run binds a compatible canonical EnvironmentProfile without persisting secret values", () => {
  const before = JSON.stringify(release);
  const result = dryRunDeploy({ publishedRelease: release, releaseArtifact: artifact, environment, acceptanceChecks: [{ name: "health", pass: true }], startedAt: "2026-08-16T00:00:01Z", completedAt: "2026-08-16T00:00:02Z" });
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.record.status, "succeeded");
  assert.match(result.record.deploymentId, /^sha256:[a-f0-9]{64}$/);
  assert.deepEqual(result.bindings.map((binding) => binding.reference), ["secret://database-url", "config://PORT"]);
  assert.equal(JSON.stringify(release), before);
  assert.equal(JSON.stringify(result).includes("postgres://"), false);
});

test("deploy dry-run rejects incompatible runtime without mutating release", () => {
  const before = JSON.stringify(release);
  const result = dryRunDeploy({ publishedRelease: release, releaseArtifact: artifact, environment: { ...environment, runtimeVersions: ["runtime-2"] }, acceptanceChecks: [], startedAt: "2026-08-16T00:00:01Z", completedAt: "2026-08-16T00:00:02Z" });
  assert.deepEqual(result, { ok: false, diagnostic: { code: "RUNTIME_INCOMPATIBLE", detail: "runtime-1" } });
  assert.equal(JSON.stringify(release), before);
});

test("deploy dry-run rejects a missing required canonical binding", () => {
  const result = dryRunDeploy({ publishedRelease: release, releaseArtifact: artifact, environment: { ...environment, bindings: environment.bindings.filter((binding) => binding.name !== "DATABASE_URL") }, acceptanceChecks: [], startedAt: "2026-08-16T00:00:01Z", completedAt: "2026-08-16T00:00:02Z" });
  assert.deepEqual(result, { ok: false, diagnostic: { code: "MISSING_ENVIRONMENT_BINDING", detail: "DATABASE_URL" } });
});

test("deploy dry-run rejects an attempted inline secret value even when passed from untyped input", () => {
  const unsafeEnvironment = { ...environment, bindings: environment.bindings.map((binding) => binding.name === "DATABASE_URL" ? { ...binding, value: "postgres://must-not-cross-boundary" } : binding) } as unknown as EnvironmentProfile;
  const result = dryRunDeploy({ publishedRelease: release, releaseArtifact: artifact, environment: unsafeEnvironment, acceptanceChecks: [], startedAt: "2026-08-16T00:00:01Z", completedAt: "2026-08-16T00:00:02Z" });
  assert.deepEqual(result, { ok: false, diagnostic: { code: "SECRET_VALUE_NOT_ALLOWED", detail: "DATABASE_URL" } });
});

test("failed acceptance check produces deterministic failed DeploymentRecord", () => {
  const input = { publishedRelease: release, releaseArtifact: artifact, environment, acceptanceChecks: [{ name: "health", pass: false }, { name: "schema", pass: true }], startedAt: "2026-08-16T00:00:01Z", completedAt: "2026-08-16T00:00:02Z" } as const;
  const first = dryRunDeploy(input);
  const second = dryRunDeploy(input);
  assert.deepEqual(first, second);
  assert.equal(first.ok, true);
  if (!first.ok) return;
  assert.equal(first.record.status, "failed");
  assert.deepEqual(first.record.healthChecks, [{ name: "health", status: "FAIL" }, { name: "schema", status: "PASS" }]);
});

test("deployment registry retains deterministic history and only successful records become active", () => {
  const registry = new DeploymentRegistry();
  const succeeded = dryRunDeploy({ publishedRelease: release, releaseArtifact: artifact, environment, acceptanceChecks: [{ name: "health", pass: true }], startedAt: "2026-08-16T00:00:03Z", completedAt: "2026-08-16T00:00:04Z" });
  assert.equal(succeeded.ok, true);
  if (!succeeded.ok) return;
  const stored = registry.record(succeeded.record);
  assert.equal(Object.isFrozen(stored), true);
  assert.equal(Object.isFrozen(stored.healthChecks), true);
  assert.deepEqual(registry.getActive(environment.environmentRef), stored);
  assert.deepEqual(registry.record(succeeded.record), stored);

  const failed = dryRunDeploy({ publishedRelease: { ...release, version: "1.0.1" }, releaseArtifact: artifact, environment, acceptanceChecks: [{ name: "health", pass: false }], startedAt: "2026-08-16T00:00:05Z", completedAt: "2026-08-16T00:00:06Z" });
  assert.equal(failed.ok, true);
  if (!failed.ok) return;
  registry.record(failed.record);
  assert.deepEqual(registry.getActive(environment.environmentRef), stored);
  assert.deepEqual(registry.list().map((record) => record.deploymentId), [...registry.list().map((record) => record.deploymentId)].sort());
  assert.throws(() => registry.record({ ...stored, status: "failed" }), /DEPLOYMENT_RECORD_CONFLICT/);
});

test("activation decision promotes success and explicitly retains last known good on failed candidate", () => {
  const registry = new DeploymentRegistry();
  const active = dryRunDeploy({ publishedRelease: release, releaseArtifact: artifact, environment, acceptanceChecks: [{ name: "health", pass: true }], startedAt: "2026-08-16T00:01:00Z", completedAt: "2026-08-16T00:01:01Z" });
  assert.equal(active.ok, true);
  if (!active.ok) return;
  const activated = registry.activateCandidate(active.record);
  assert.equal(activated.outcome, "activated");
  assert.equal(activated.previousActiveDeploymentId, null);
  assert.equal(activated.resultingActiveDeploymentId, active.record.deploymentId);
  assert.match(activated.decisionId, /^sha256:[a-f0-9]{64}$/);
  assert.equal(Object.isFrozen(activated), true);

  const failed = dryRunDeploy({ publishedRelease: { ...release, version: "1.0.1" }, releaseArtifact: artifact, environment, acceptanceChecks: [{ name: "health", pass: false }], startedAt: "2026-08-16T00:01:02Z", completedAt: "2026-08-16T00:01:03Z" });
  assert.equal(failed.ok, true);
  if (!failed.ok) return;
  const retained = registry.activateCandidate(failed.record);
  assert.equal(retained.outcome, "retained-active");
  assert.equal(retained.previousActiveDeploymentId, active.record.deploymentId);
  assert.equal(retained.resultingActiveDeploymentId, active.record.deploymentId);
  assert.deepEqual(registry.getActive(environment.environmentRef), active.record);
  assert.deepEqual(registry.get(failed.record.deploymentId), failed.record);
  assert.deepEqual(registry.activateCandidate(failed.record), retained);
});

test("activation decision rejects failed candidate without fabricating active state", () => {
  const registry = new DeploymentRegistry();
  const failed = dryRunDeploy({ publishedRelease: { ...release, version: "2.0.0" }, releaseArtifact: artifact, environment, acceptanceChecks: [{ name: "health", pass: false }], startedAt: "2026-08-16T00:02:00Z", completedAt: "2026-08-16T00:02:01Z" });
  assert.equal(failed.ok, true);
  if (!failed.ok) return;
  const decision = registry.activateCandidate(failed.record);
  assert.equal(decision.outcome, "rejected-no-active");
  assert.equal(decision.previousActiveDeploymentId, null);
  assert.equal(decision.resultingActiveDeploymentId, null);
  assert.equal(registry.getActive(environment.environmentRef), undefined);
  assert.deepEqual(registry.get(failed.record.deploymentId), failed.record);
});
