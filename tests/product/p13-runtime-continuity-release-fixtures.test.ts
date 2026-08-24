import assert from "node:assert/strict";
import test from "node:test";
import { InMemoryArtifactPayloadRepository } from "../../packages/artifact-store/index.js";
import { compileAutonomousRuntimeModelBundle } from "../../packages/compiler/autonomous-runtime-model-bundle.js";
import { sha256Canonical } from "../../packages/deterministic/index.js";
import { ReleaseRegistry } from "../../packages/release/index.js";

function assemblyPlan() {
  const payload = {
    kind: "AssemblyPlan" as const,
    systemDefinitionRef: "system-definition:p13:continuity",
    components: [],
    sourceRefs: ["source:p13:continuity"],
  };
  return { ...payload, contentHash: sha256Canonical(payload) };
}

function compileContinuityRelease(runtimeVersion: "1.0.0" | "1.1.0") {
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
      { name: "LOG_LEVEL", kind: "config", required: false },
    ],
    systemDefinitionRuntime: {
      kind: "SystemDefinitionRuntimeProjection",
      systemDefinitionRef: plan.systemDefinitionRef,
      entities: [
        {
          id: "entity:ticket",
          fields: [{ name: "title", type: "string", required: true }],
        },
      ],
      actions: [
        {
          id: "action:ticket:update",
          effect: { kind: "entity.update", entityRef: "entity:ticket" },
        },
      ],
      processes: [
        {
          id: "process:ticket",
          states: ["open", "closed"],
          initialState: "open",
          transitions: [
            {
              id: "transition:close",
              from: "open",
              to: "closed",
              actionRef: "action:ticket:update",
            },
          ],
        },
      ],
      environmentRequirements: [
        { name: "AUTH_BINDING", kind: "secret-reference", required: true },
      ],
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
      roleBindings: [
        {
          id: "binding:operator",
          roleRef: "role:operator",
          actorRef: "identity:user:1",
        },
      ],
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

function runtimeModelFile(compilation: ReturnType<typeof compileContinuityRelease>) {
  const file = compilation.files.find((candidate) => candidate.path === "runtime-model.json");
  assert.ok(file);
  return file;
}

function buildPublishedPair() {
  const a = compileContinuityRelease("1.0.0");
  const b = compileContinuityRelease("1.1.0");
  const artifacts = new InMemoryArtifactPayloadRepository();
  const aPayload = artifacts.publish({ artifactHash: a.artifact.artifactHash, files: a.files });
  const bPayload = artifacts.publish({ artifactHash: b.artifact.artifactHash, files: b.files });
  const releases = new ReleaseRegistry();
  const releaseA = releases.publish({
    releaseId: "p13-runtime-continuity",
    version: "1.0.0",
    artifact: a.artifact,
    publishedAt: "2026-08-24T20:20:00Z",
  });
  const releaseB = releases.publish({
    releaseId: "p13-runtime-continuity",
    version: "1.1.0",
    artifact: b.artifact,
    publishedAt: "2026-08-24T20:21:00Z",
  });

  return {
    a,
    b,
    aPayload,
    bPayload,
    verifiedA: artifacts.getVerified(a.artifact),
    verifiedB: artifacts.getVerified(b.artifact),
    releaseA,
    releaseB,
  };
}

test("TASK-261 materializes deterministic compatible autonomous Runtime A/B releases from actual Compiler output", () => {
  const first = buildPublishedPair();
  const second = buildPublishedPair();

  assert.deepEqual(first, second);
  assert.notEqual(first.a.artifact.artifactHash, first.b.artifact.artifactHash);
  assert.equal(first.a.artifact.manifest.runtimeVersion, "1.0.0");
  assert.equal(first.b.artifact.manifest.runtimeVersion, "1.1.0");
  assert.equal(first.releaseA.version, "1.0.0");
  assert.equal(first.releaseB.version, "1.1.0");
  assert.equal(first.releaseA.releaseId, first.releaseB.releaseId);
  assert.notEqual(first.releaseA.artifactHash, first.releaseB.artifactHash);
  assert.equal(first.verifiedA.verified, true);
  assert.equal(first.verifiedB.verified, true);

  const aModel = runtimeModelFile(first.a);
  const bModel = runtimeModelFile(first.b);
  const explicitCompatibility = Object.freeze({
    fromRuntimeVersion: "1.0.0",
    toRuntimeVersion: "1.1.0",
    relation: "same-runtime-model" as const,
    runtimeModelContentHash: aModel.contentHash,
  });

  assert.equal(aModel.contentHash, bModel.contentHash);
  assert.equal(aModel.content, bModel.content);
  assert.equal(explicitCompatibility.runtimeModelContentHash, bModel.contentHash);
  assert.equal(explicitCompatibility.relation, "same-runtime-model");

  const parsedModel = JSON.parse(aModel.content) as Record<string, unknown>;
  assert.equal(parsedModel.kind, "RuntimeModel");
  for (const key of [
    "entities",
    "actions",
    "processes",
    "authenticationProviders",
    "identities",
    "roleBindings",
    "permissions",
    "policies",
    "views",
  ]) {
    assert.ok(Array.isArray(parsedModel[key]), `${key} must remain materialized in continuity releases`);
  }
});

test("TASK-261 continuity release evidence keeps resolved values and Builder/Observe endpoints out of durable artifacts", () => {
  const pair = buildPublishedPair();
  const evidence = JSON.stringify(pair);

  assert.equal(evidence.includes("resolved-secret-value"), false);
  assert.equal(evidence.includes("postgres://"), false);
  assert.equal(evidence.includes("builder.internal"), false);
  assert.equal(evidence.includes("observe.internal"), false);
  assert.equal(evidence.includes("secret://"), false);
});
