import assert from "node:assert/strict";
import test from "node:test";
import { compileAutonomousRuntimeModelBundle } from "../../packages/compiler/autonomous-runtime-model-bundle.js";
import { sha256Canonical } from "../../packages/deterministic/index.js";
import type { RuntimeAuthorityModel } from "../../packages/runtime-core/authority-resolution.js";
import { validateRuntimeGeneratedFormInput } from "../../packages/runtime-core/generated-form-input.js";
import { materializeRuntimeGeneratedViewDocument } from "../../packages/runtime-core/generated-view-document.js";
import { authorizeRuntimeRenderedGeneratedInteraction } from "../../packages/runtime-core/rendered-authority-interaction.js";

const entityRef = "entity:offline-generated-ticket";
const editActionRef = "action:offline-generated-edit";

function compileBundle() {
  const planPayload = {
    kind: "AssemblyPlan" as const,
    systemDefinitionRef: "system-definition:p13:offline-generated-experience",
    components: [],
    sourceRefs: ["source:p13:offline-generated-experience"],
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
    compilerVersion: "0.13.3",
    runtimeVersion: "0.13.3",
    environmentSchema: [
      { name: "AUTH_SECRET", kind: "secret-reference", required: true },
      { name: "DATABASE_URL", kind: "secret-reference", required: true },
    ],
    systemDefinitionRuntime: {
      kind: "SystemDefinitionRuntimeProjection",
      systemDefinitionRef: plan.systemDefinitionRef,
      entities: [{
        id: entityRef,
        fields: [
          { name: "title", type: "string", required: true },
          { name: "priority", type: "number", required: false },
          { name: "internalSecret", type: "string", required: false },
        ],
      }],
      actions: [
        { id: editActionRef, effect: { kind: "entity.update", entityRef } },
        { id: "action:offline-generated-delete", effect: { kind: "entity.delete", entityRef } },
      ],
      processes: [],
      environmentRequirements: [{ name: "AUTH_SECRET", kind: "secret-reference", required: true }],
      authenticationProviders: [{ id: "provider:offline-local", bindingRef: "AUTH_SECRET" }],
      identities: [
        { id: "identity:offline-alice", kind: "user", subjectRef: "subject:offline-alice", active: true, authenticationProviderRef: "provider:offline-local" },
        { id: "identity:offline-bob", kind: "user", subjectRef: "subject:offline-bob", active: true, authenticationProviderRef: "provider:offline-local" },
      ],
      sessionPolicy: { lifetimeSeconds: 900 },
    },
    systemDefinitionAuthority: {
      kind: "RuntimeAuthorityProjection",
      roleBindings: [
        { id: "binding:offline-alice-agent", roleRef: "role:agent", actorRef: "identity:offline-alice" },
        { id: "binding:offline-bob-viewer", roleRef: "role:viewer", actorRef: "identity:offline-bob" },
      ],
      permissions: [
        { role: "role:agent", resource: entityRef, actions: [editActionRef], policyRefs: ["policy:offline-agent-edit"] },
        { role: "role:viewer", resource: entityRef, actions: [] },
      ],
      policies: [{
        id: "policy:offline-agent-edit",
        structured: {
          effect: "allow",
          roleRefs: ["role:agent"],
          resourceRefs: [entityRef],
          actionRefs: [editActionRef],
        },
      }],
      views: [
        { id: "view:offline-ticket-list", kind: "list", binding: { entityRef, fieldRefs: ["title"], actionRefs: [] } },
        { id: "view:offline-ticket-detail", kind: "detail", binding: { entityRef, fieldRefs: ["title", "priority"], actionRefs: [] } },
        { id: "view:offline-ticket-form", kind: "form", binding: { entityRef, fieldRefs: ["title", "priority"], actionRefs: [editActionRef] } },
      ],
    },
  });
}

function locallyLoadedRuntimeModel() {
  const bundle = compileBundle();
  const runtimeModelFile = bundle.files.find((file) => file.path === "runtime-model.json");
  assert.ok(runtimeModelFile);
  return {
    bundle,
    model: JSON.parse(runtimeModelFile.content),
  };
}

function authorityModel(model: ReturnType<typeof locallyLoadedRuntimeModel>["model"]): RuntimeAuthorityModel {
  return Object.freeze({
    identities: Object.freeze(model.identities.map((identity: { id: string; active: boolean }) => Object.freeze({ id: identity.id, active: identity.active }))),
    roleBindings: model.roleBindings ?? Object.freeze([]),
    permissions: model.permissions ?? Object.freeze([]),
    policies: model.policies ?? Object.freeze([]),
  });
}

test("TASK-258 renders deterministic list detail and form documents from locally loaded autonomous RuntimeModel", () => {
  const first = locallyLoadedRuntimeModel();
  const second = locallyLoadedRuntimeModel();
  assert.deepEqual(first.bundle, second.bundle);
  assert.deepEqual(first.model, second.model);

  const record = {
    title: "Offline printer",
    priority: 2,
    internalSecret: "must-not-render",
    unbound: "must-not-render",
  };
  const list = materializeRuntimeGeneratedViewDocument({ model: first.model, viewRef: "view:offline-ticket-list", record });
  const detail = materializeRuntimeGeneratedViewDocument({ model: first.model, viewRef: "view:offline-ticket-detail", record });
  const form = materializeRuntimeGeneratedViewDocument({ model: first.model, viewRef: "view:offline-ticket-form", record });

  assert.equal(list.viewKind, "list");
  assert.deepEqual(list.fields.map((field) => field.fieldRef), ["title"]);
  assert.equal(detail.viewKind, "detail");
  assert.deepEqual(detail.fields.map((field) => field.fieldRef), ["priority", "title"]);
  assert.equal(form.viewKind, "form");
  assert.deepEqual(form.actions, [{ actionRef: editActionRef }]);

  const serialized = JSON.stringify({ list, detail, form, artifact: first.bundle.artifact });
  for (const forbidden of ["must-not-render", "resolved-secret", "sessionToken", "password", "builder.internal", "observe.internal"]) {
    assert.equal(serialized.includes(forbidden), false, forbidden);
  }
});

test("TASK-258 generated form and rendered actions fail closed while reusing the shared authority path", () => {
  const { model } = locallyLoadedRuntimeModel();
  const form = materializeRuntimeGeneratedViewDocument({ model, viewRef: "view:offline-ticket-form", record: {} });

  const accepted = validateRuntimeGeneratedFormInput({
    document: form,
    entries: [{ fieldRef: "title", value: "Offline" }, { fieldRef: "priority", value: 3 }],
  });
  assert.equal(accepted.ok, true);

  const unboundInput = validateRuntimeGeneratedFormInput({
    document: form,
    entries: [{ fieldRef: "title", value: "Offline" }, { fieldRef: "internalSecret", value: "resolved-secret-must-not-leak" }],
  });
  assert.equal(unboundInput.ok, false);
  assert.equal(JSON.stringify(unboundInput).includes("resolved-secret-must-not-leak"), false);

  const authority = authorityModel(model);
  const allowed = authorizeRuntimeRenderedGeneratedInteraction({
    document: form,
    actionRef: editActionRef,
    authorityModel: authority,
    actor: { identityRef: "identity:offline-alice" },
  });
  assert.equal(allowed.ok, true);
  if (allowed.ok) assert.equal(allowed.evidence.decision.allowed, true);

  const denied = authorizeRuntimeRenderedGeneratedInteraction({
    document: form,
    actionRef: editActionRef,
    authorityModel: authority,
    actor: { identityRef: "identity:offline-bob" },
  });
  assert.equal(denied.ok, false);
  if (!denied.ok) assert.equal(denied.stage, "permission");

  const unboundAction = authorizeRuntimeRenderedGeneratedInteraction({
    document: form,
    actionRef: "action:offline-generated-delete",
    authorityModel: authority,
    actor: { identityRef: "identity:offline-alice" },
  });
  assert.equal(unboundAction.ok, false);
  if (!unboundAction.ok) assert.equal(unboundAction.stage, "interaction");

  assert.throws(
    () => materializeRuntimeGeneratedViewDocument({ model, viewRef: "view:offline-missing", record: {} }),
    /RUNTIME_GENERATED_RENDER_UNKNOWN_VIEW:view:offline-missing/,
  );

  const evidence = JSON.stringify({ accepted, unboundInput, allowed, denied, unboundAction });
  for (const forbidden of ["resolved-secret", "sessionToken", "password", "Builder", "Observe"]) {
    assert.equal(evidence.includes(forbidden), false, forbidden);
  }
});
