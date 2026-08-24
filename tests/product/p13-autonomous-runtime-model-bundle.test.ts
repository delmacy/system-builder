import assert from "node:assert/strict";
import test from "node:test";
import { sha256Canonical } from "../../packages/deterministic/index.js";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { compileAutonomousRuntimeModelBundle } from "../../packages/compiler/autonomous-runtime-model-bundle.js";

function assemblyPlan() {
  const payload = {
    kind: "AssemblyPlan" as const,
    systemDefinitionRef: "system-definition:p13:offline-autonomy",
    components: [],
    sourceRefs: ["source:p13:offline-autonomy"],
  };
  return { ...payload, contentHash: sha256Canonical(payload) };
}

function compileCompleteBundle() {
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
    runtimeVersion: "0.1.0",
    environmentSchema: [
      { name: "DATABASE_URL", kind: "secret-reference", required: true },
      { name: "AUTH_BINDING", kind: "secret-reference", required: true },
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
      authenticationProviders: [
        { id: "auth:local", bindingRef: "AUTH_BINDING" },
      ],
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

test("TASK-254 materializes complete RuntimeModel into deterministic autonomous bundle metadata", () => {
  const first = compileCompleteBundle();
  const second = compileCompleteBundle();
  assert.deepEqual(first, second);

  const modelFile = first.files.find((file) => file.path === "runtime-model.json");
  const metadataFile = first.files.find((file) => file.path === "runtime-bundle.json");
  assert.ok(modelFile);
  assert.ok(metadataFile);

  const model = JSON.parse(modelFile.content) as Record<string, unknown>;
  assert.equal(model.kind, "RuntimeModel");
  assert.ok(Array.isArray(model.entities));
  assert.ok(Array.isArray(model.actions));
  assert.ok(Array.isArray(model.processes));
  assert.ok(Array.isArray(model.authenticationProviders));
  assert.ok(Array.isArray(model.identities));
  assert.ok(Array.isArray(model.roleBindings));
  assert.ok(Array.isArray(model.permissions));
  assert.ok(Array.isArray(model.policies));
  assert.ok(Array.isArray(model.views));

  assert.deepEqual(JSON.parse(metadataFile.content), {
    kind: "AutonomousRuntimeModelBundle",
    runtimeModel: {
      contentHash: modelFile.contentHash,
      path: "runtime-model.json",
    },
  });
  assert.ok(first.artifact.manifest.files.includes("runtime-model.json"));
  assert.ok(first.artifact.manifest.files.includes("runtime-bundle.json"));
  assert.equal(JSON.stringify(first).includes("resolved-secret-value"), false);
  assert.equal(JSON.stringify(first).includes("builder.internal"), false);
  assert.equal(JSON.stringify(first).includes("observe.internal"), false);
});

test("TASK-254 remains additive for historical synthetic compilation without RuntimeModel", () => {
  const plan = assemblyPlan();
  const historical = compileSyntheticRelease({
    assemblyPlan: plan,
    validationEvidence: {
      kind: "ValidationEvidence",
      assemblyPlanRef: plan.contentHash,
      decision: "PASS",
      evidenceHash: sha256Canonical({ decision: "PASS", plan: plan.contentHash }),
    },
    compilerVersion: "0.1.0",
    runtimeVersion: "0.1.0",
  });

  assert.equal(historical.files.some((file) => file.path === "runtime-model.json"), false);
  assert.equal(historical.files.some((file) => file.path === "runtime-bundle.json"), false);
});
