import assert from "node:assert/strict";
import test from "node:test";
import { InMemoryArtifactPayloadRepository } from "../../packages/artifact-store/index.js";
import { compileAutonomousRuntimeModelBundle } from "../../packages/compiler/autonomous-runtime-model-bundle.js";
import { SingleHostActiveRuntimeOrchestrator } from "../../packages/deploy/active-runtime.js";
import { DeploymentRegistry } from "../../packages/deploy/index.js";
import { PostgresDeploymentRecordStorage } from "../../packages/deploy/postgres-state.js";
import { InMemorySecretResolver } from "../../packages/deploy/secret-resolver.js";
import { sha256Canonical } from "../../packages/deterministic/index.js";
import { ReleaseRegistry } from "../../packages/release/index.js";

const runtimePostgresUrl = process.env.SYSTEM_BUILDER_TEST_POSTGRES_URL;
const deployPostgresUrl = process.env.SYSTEM_BUILDER_TEST_AUTH_POSTGRES_URL;
const unavailableControlPlane = Object.freeze({
  SYSTEM_BUILDER_URL: "http://127.0.0.1:1",
  OBSERVE_URL: "http://127.0.0.1:1",
  SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1",
  SYSTEM_BUILDER_OBSERVE_URL: "http://127.0.0.1:1",
});

function assemblyPlan() {
  const payload = {
    kind: "AssemblyPlan" as const,
    systemDefinitionRef: "system-definition:p13:compatible-upgrade",
    components: [],
    sourceRefs: ["source:p13:compatible-upgrade"],
  };
  return { ...payload, contentHash: sha256Canonical(payload) };
}

function compileRelease(runtimeVersion: "1.0.0" | "1.1.0") {
  const plan = assemblyPlan();
  return compileAutonomousRuntimeModelBundle({
    assemblyPlan: plan,
    validationEvidence: {
      kind: "ValidationEvidence",
      assemblyPlanRef: plan.contentHash,
      decision: "PASS",
      evidenceHash: sha256Canonical({ decision: "PASS", plan: plan.contentHash }),
    },
    compilerVersion: "0.1.0",
    runtimeVersion,
    environmentSchema: [
      { name: "DATABASE_URL", kind: "secret-reference", required: true },
      { name: "AUTH_BINDING", kind: "secret-reference", required: true },
    ],
    systemDefinitionRuntime: {
      kind: "SystemDefinitionRuntimeProjection",
      systemDefinitionRef: plan.systemDefinitionRef,
      entities: [{ id: "entity:ticket", fields: [{ name: "title", type: "string", required: true }] }],
      actions: [{ id: "action:ticket:update", effect: { kind: "entity.update", entityRef: "entity:ticket" } }],
      processes: [
        {
          id: "process:ticket",
          states: ["open", "closed"],
          initialState: "open",
          transitions: [
            { id: "transition:close", from: "open", to: "closed", actionRef: "action:ticket:update" },
          ],
        },
      ],
      environmentRequirements: [{ name: "AUTH_BINDING", kind: "secret-reference", required: true }],
      authenticationProviders: [{ id: "auth:local", bindingRef: "AUTH_BINDING" }],
      identities: [
        {
          id: "identity:user:1",
          kind: "user",
          subjectRef: "user:1",
          active: true,
          authenticationProviderRef: "auth:local",
        },
      ],
      sessionPolicy: { lifetimeSeconds: 3600 },
    },
    systemDefinitionAuthority: {
      kind: "RuntimeAuthorityProjection",
      roleBindings: [{ id: "binding:operator", roleRef: "role:operator", actorRef: "identity:user:1" }],
      permissions: [
        {
          role: "role:operator",
          resource: "entity:ticket",
          actions: ["action:ticket:update"],
          policyRefs: ["policy:ticket-update"],
        },
      ],
      policies: [
        {
          id: "policy:ticket-update",
          structured: {
            effect: "allow",
            roleRefs: ["role:operator"],
            resourceRefs: ["entity:ticket"],
            actionRefs: ["action:ticket:update"],
          },
        },
      ],
      views: [
        {
          id: "view:ticket-form",
          kind: "form",
          binding: {
            entityRef: "entity:ticket",
            fieldRefs: ["title"],
            actionRefs: ["action:ticket:update"],
          },
        },
      ],
    },
  });
}

function environment() {
  return {
    kind: "EnvironmentProfile" as const,
    environmentRef: "environment:p13-compatible-upgrade",
    runtimeVersions: ["1.0.0", "1.1.0"],
    bindings: [
      { name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://p13/runtime-db" },
      { name: "AUTH_BINDING", kind: "secret-reference" as const, reference: "secret://p13/auth-binding" },
    ],
  };
}

const postgresFixturesMissing = runtimePostgresUrl === undefined || deployPostgresUrl === undefined
  ? "PostgreSQL CI fixtures not configured"
  : false;

test("TASK-262 promotes compatible autonomous Runtime A to B only after candidate acceptance", { skip: postgresFixturesMissing }, async () => {
  assert.ok(runtimePostgresUrl);
  assert.ok(deployPostgresUrl);

  const compilationA = compileRelease("1.0.0");
  const compilationB = compileRelease("1.1.0");
  const artifacts = new InMemoryArtifactPayloadRepository();
  artifacts.publish({ artifactHash: compilationA.artifact.artifactHash, files: compilationA.files });
  artifacts.publish({ artifactHash: compilationB.artifact.artifactHash, files: compilationB.files });

  const releases = new ReleaseRegistry();
  const releaseA = releases.publish({
    releaseId: "p13-runtime-compatible-upgrade",
    version: "1.0.0",
    artifact: compilationA.artifact,
    publishedAt: "2026-08-24T20:30:00Z",
  });
  const releaseB = releases.publish({
    releaseId: "p13-runtime-compatible-upgrade",
    version: "1.1.0",
    artifact: compilationB.artifact,
    publishedAt: "2026-08-24T20:31:00Z",
  });

  const storage = await PostgresDeploymentRecordStorage.open(deployPostgresUrl, "p13_task262_upgrade");
  const registry = new DeploymentRegistry(storage);
  const manager = new SingleHostActiveRuntimeOrchestrator(registry);
  const resolver = new InMemorySecretResolver({
    "secret://p13/runtime-db": runtimePostgresUrl,
    "secret://p13/auth-binding": "local-auth-binding",
  });

  const promoteInput = (
    release: typeof releaseA,
    compilation: typeof compilationA,
    expectedActiveDeploymentId: string | null,
    minute: number,
  ) => ({
    publishedRelease: release,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: artifacts,
    environment: environment(),
    secretResolver: resolver,
    processEnvironment: unavailableControlPlane,
    expectedActiveDeploymentId,
    startedAt: `2026-08-24T20:${minute.toString().padStart(2, "0")}:01Z`,
    completedAt: `2026-08-24T20:${minute.toString().padStart(2, "0")}:02Z`,
    timeoutMs: 10_000,
  });

  const a = await manager.promote(promoteInput(releaseA, compilationA, null, 32));
  assert.equal(a.ok, true);
  if (!a.ok || !a.promoted || a.active === null) throw new Error("TASK262_A_NOT_ACTIVE");
  assert.equal(a.decision.outcome, "activated");
  assert.equal(registry.getActive(environment().environmentRef)?.deploymentId, a.candidateRecord.deploymentId);
  assert.equal((await manager.health(environment().environmentRef)).status, "UP");

  const activeBeforeB = registry.getActive(environment().environmentRef);
  assert.ok(activeBeforeB);
  assert.equal(activeBeforeB.deploymentId, a.candidateRecord.deploymentId);

  const b = await manager.promote(
    promoteInput(releaseB, compilationB, a.candidateRecord.deploymentId, 33),
  );
  assert.equal(b.ok, true);
  if (!b.ok || !b.promoted || b.active === null) throw new Error("TASK262_B_NOT_ACTIVE");
  assert.equal(b.decision.outcome, "activated");
  assert.equal(b.decision.previousActiveDeploymentId, a.candidateRecord.deploymentId);
  assert.equal(b.decision.resultingActiveDeploymentId, b.candidateRecord.deploymentId);
  assert.equal(registry.getActive(environment().environmentRef)?.deploymentId, b.candidateRecord.deploymentId);
  assert.equal((await manager.health(environment().environmentRef)).status, "UP");
  assert.equal(b.candidateFinal.process.state, "running");

  const evidence = JSON.stringify({
    releaseA,
    releaseB,
    decisionA: a.decision,
    decisionB: b.decision,
    activeBeforeB,
    activeAfterB: registry.getActive(environment().environmentRef),
    healthAfterB: await manager.health(environment().environmentRef),
  });
  assert.equal(evidence.includes(runtimePostgresUrl), false);
  assert.equal(evidence.includes("local-auth-binding"), false);
  assert.equal(evidence.includes("builder.internal"), false);
  assert.equal(evidence.includes("observe.internal"), false);

  const stopped = await manager.stopActive(environment().environmentRef);
  assert.ok(stopped);
  assert.equal(stopped.deploymentId, b.candidateRecord.deploymentId);
  await storage.close();
});
