import assert from "node:assert/strict";
import test from "node:test";
import { compileAutonomousRuntimeModelBundle } from "../../packages/compiler/autonomous-runtime-model-bundle.js";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import { dryRunDeploy } from "../../packages/deploy/index.js";
import { sha256Canonical } from "../../packages/deterministic/index.js";
import { DeploymentObservation, publish, type PublishObserver } from "../../packages/observe/index.js";
import { bootstrapAutonomousRuntime } from "../../packages/runtime-core/index.js";

const runtimeVersion = "0.13.3";
const secretSentinel = "postgres://resolved-user:resolved-password@localhost/runtime";
const requirements = Object.freeze([
  Object.freeze({ name: "DATABASE_URL", kind: "secret-reference" as const, required: true }),
  Object.freeze({ name: "LOG_LEVEL", kind: "config" as const, required: false }),
]);

const environment: EnvironmentProfile = Object.freeze({
  kind: "EnvironmentProfile",
  environmentRef: "environment:p13:local-health",
  runtimeVersions: Object.freeze([runtimeVersion]),
  bindings: Object.freeze([
    Object.freeze({ name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://p13-runtime-database" }),
    Object.freeze({ name: "LOG_LEVEL", kind: "config" as const, reference: "config://p13-log-level" }),
  ]),
});

function compileCompleteRuntimeBundle() {
  const planPayload = {
    kind: "AssemblyPlan" as const,
    systemDefinitionRef: "system-definition:p13:local-health",
    components: [],
    sourceRefs: ["source:p13:local-health"],
  };
  const plan = { ...planPayload, contentHash: sha256Canonical(planPayload) };
  return compileAutonomousRuntimeModelBundle({
    assemblyPlan: plan,
    validationEvidence: {
      kind: "ValidationEvidence",
      assemblyPlanRef: plan.contentHash,
      decision: "PASS",
      evidenceHash: sha256Canonical({ decision: "PASS", plan: plan.contentHash }),
    },
    compilerVersion: runtimeVersion,
    runtimeVersion,
    environmentSchema: requirements,
    systemDefinitionRuntime: {
      kind: "SystemDefinitionRuntimeProjection",
      systemDefinitionRef: plan.systemDefinitionRef,
      entities: [{ id: "entity:health-ticket", fields: [{ name: "title", type: "string", required: true }] }],
      actions: [{ id: "action:health-ticket-update", effect: { kind: "entity.update", entityRef: "entity:health-ticket" } }],
      processes: [],
      environmentRequirements: requirements,
      authenticationProviders: [],
      identities: [],
      sessionPolicy: { lifetimeSeconds: 900 },
    },
    systemDefinitionAuthority: {
      kind: "RuntimeAuthorityProjection",
      roleBindings: [],
      permissions: [],
      policies: [],
      views: [],
    },
  });
}

function localHealth() {
  const bundle = compileCompleteRuntimeBundle();
  const modelFile = bundle.files.find((file) => file.path === "runtime-model.json");
  assert.ok(modelFile, "complete Runtime bundle must materialize runtime-model.json");
  const model = JSON.parse(modelFile.content) as { kind?: string };
  assert.equal(model.kind, "RuntimeModel");

  const boot = bootstrapAutonomousRuntime({ runtimeVersion, environment, requirements });
  assert.equal(boot.ok, true);
  if (!boot.ok) throw new Error(`TASK259_RUNTIME_BOOT_FAILED:${boot.diagnostic.code}`);
  return { bundle, model, health: boot.health };
}

function deploymentObservation(version: string) {
  const artifactHash = `sha256:${"e".repeat(64)}`;
  const deployed = dryRunDeploy({
    publishedRelease: Object.freeze({
      kind: "PublishedRelease" as const,
      releaseId: "p13-local-health",
      version,
      artifactRef: artifactHash,
      artifactHash,
      validationEvidenceRef: `sha256:${"f".repeat(64)}`,
      publishedAt: "2026-08-24T19:00:00Z",
      status: "published" as const,
    }),
    releaseArtifact: Object.freeze({
      kind: "ReleaseArtifact" as const,
      artifactHash,
      manifest: Object.freeze({ runtimeVersion }),
      environmentSchema: requirements,
    }),
    environment,
    acceptanceChecks: [{ name: "health", pass: true }],
    startedAt: "2026-08-24T19:00:01Z",
    completedAt: "2026-08-24T19:00:02Z",
  });
  assert.equal(deployed.ok, true);
  if (!deployed.ok) throw new Error("TASK259_DEPLOY_OBSERVATION_FAILED");
  return DeploymentObservation.fromDeploymentRecord(deployed.record);
}

function assertNoResolvedValues(value: unknown) {
  const serialized = JSON.stringify(value);
  for (const forbidden of [secretSentinel, "resolved-password", "BEGIN CERTIFICATE", "builder.internal", "observe.internal"]) {
    assert.equal(serialized.includes(forbidden), false, forbidden);
  }
}

test("TASK-259 complete Runtime exposes deterministic local health when Observe is absent", async () => {
  const first = localHealth();
  const second = localHealth();
  assert.deepEqual(first.bundle, second.bundle);
  assert.deepEqual(first.model, second.model);
  assert.deepEqual(first.health, second.health);
  assert.deepEqual(first.health, {
    kind: "RuntimeHealth",
    status: "UP",
    runtimeVersion,
    environmentRef: environment.environmentRef,
    bindingNames: ["DATABASE_URL", "LOG_LEVEL"],
  });

  const result = await publish(deploymentObservation("1.0.0"));
  assert.deepEqual(result, { ok: true, outcome: "not-configured", observationId: null });
  assert.deepEqual(localHealth().health, first.health);
  assertNoResolvedValues({ health: first.health, publication: result, bundle: first.bundle.artifact });
});

test("TASK-259 failing Observe delivery remains fail-open and cannot change Runtime availability", async () => {
  const before = localHealth().health;
  const observer: PublishObserver = {
    deliver: async () => {
      throw new Error(`Observe unavailable ${secretSentinel}`);
    },
  };

  const result = await publish(deploymentObservation("1.0.1"), observer);
  assert.equal(result.ok, false);
  if (result.ok) throw new Error("TASK259_EXPECTED_FAIL_OPEN_RESULT");
  assert.equal(result.outcome, "channel-failed");
  assert.deepEqual(result.diagnostic, {
    code: "OBSERVE_CHANNEL_FAILED",
    detail: "observe channel unavailable; deployment outcome unchanged",
  });

  const after = localHealth().health;
  assert.deepEqual(after, before);
  assert.equal(after.status, "UP");
  assertNoResolvedValues({ health: after, publication: result });
});

test("TASK-259 configured publication is deterministic provider-neutral and preserves local health", async () => {
  const observation = deploymentObservation("1.0.2");
  const delivered: unknown[] = [];
  const observer: PublishObserver = { deliver: (payload) => void delivered.push(payload) };
  const before = localHealth().health;

  const first = await publish(observation, observer);
  const second = await publish(observation, observer);

  assert.deepEqual(first, second);
  assert.equal(first.ok, true);
  if (!first.ok) throw new Error("TASK259_UNEXPECTED_PUBLICATION_FAILURE");
  assert.equal(first.outcome, "delivered");
  assert.equal(first.observationId, observation.observationId);
  assert.deepEqual(delivered, [observation, observation]);
  assert.deepEqual(localHealth().health, before);
  assertNoResolvedValues({ health: before, publication: first, delivered });
});
