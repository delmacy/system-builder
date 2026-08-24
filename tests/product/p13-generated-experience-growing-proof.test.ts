import assert from "node:assert/strict";
import test from "node:test";
import { normalizeRuntimeAuthorityProjection } from "../../packages/compiler/authority-projection.js";
import { materializeRuntimeModel } from "../../packages/compiler/runtime-model.js";
import type { RuntimeAuthorityModel } from "../../packages/runtime-core/authority-resolution.js";
import { validateRuntimeGeneratedFormInput } from "../../packages/runtime-core/generated-form-input.js";
import { materializeRuntimeGeneratedViewDocument } from "../../packages/runtime-core/generated-view-document.js";
import { authorizeRuntimeRenderedGeneratedInteraction } from "../../packages/runtime-core/rendered-authority-interaction.js";

const entityRef = "entity:ticket";
const editActionRef = "action:edit-ticket";

function runtimeModel() {
  const runtimeProjection = {
    kind: "SystemDefinitionRuntimeProjection" as const,
    systemDefinitionRef: "system:p13-generated-experience",
    entities: [{
      id: entityRef,
      fields: [
        { name: "title", type: "string" as const, required: true },
        { name: "priority", type: "number" as const, required: false },
        { name: "internalSecret", type: "string" as const, required: false },
      ],
    }],
    actions: [
      { id: editActionRef, effect: { kind: "entity.update" as const, entityRef } },
      { id: "action:delete-ticket", effect: { kind: "entity.delete" as const, entityRef } },
      { id: "action:read-ticket" },
    ],
    processes: [],
    environmentRequirements: [{ name: "AUTH_SECRET", kind: "secret-reference" as const, required: true }],
    authenticationProviders: [{ id: "provider:local", bindingRef: "AUTH_SECRET" }],
    identities: [
      { id: "identity:alice", kind: "user" as const, subjectRef: "subject:alice", active: true, authenticationProviderRef: "provider:local" },
      { id: "identity:bob", kind: "user" as const, subjectRef: "subject:bob", active: true, authenticationProviderRef: "provider:local" },
    ],
    sessionPolicy: { lifetimeSeconds: 900 },
  };

  const authorityProjection = normalizeRuntimeAuthorityProjection({
    entities: runtimeProjection.entities,
    actions: runtimeProjection.actions,
    identities: runtimeProjection.identities,
    roleBindings: [
      { id: "binding:alice-agent", roleRef: "role:agent", actorRef: "identity:alice" },
      { id: "binding:bob-viewer", roleRef: "role:viewer", actorRef: "identity:bob" },
    ],
    permissions: [
      { role: "role:agent", resource: entityRef, actions: [editActionRef], policyRefs: ["policy:agent-edit"] },
      { role: "role:viewer", resource: entityRef, actions: ["action:read-ticket"] },
    ],
    policies: [{
      id: "policy:agent-edit",
      statement: "FREE TEXT MUST NEVER EXECUTE OR REACH RUNTIME OUTPUT",
      structured: {
        effect: "allow",
        roleRefs: ["role:agent"],
        resourceRefs: [entityRef],
        actionRefs: [editActionRef],
      },
    }],
    views: [
      { id: "view:ticket-list", kind: "list", binding: { entityRef, fieldRefs: ["title"], actionRefs: [] } },
      { id: "view:ticket-detail", kind: "detail", binding: { entityRef, fieldRefs: ["title", "priority"], actionRefs: [] } },
      { id: "view:ticket-form", kind: "form", binding: { entityRef, fieldRefs: ["title", "priority"], actionRefs: [editActionRef] } },
    ],
  });

  return materializeRuntimeModel(runtimeProjection.systemDefinitionRef, runtimeProjection, authorityProjection).model;
}

function authorityModel(model: ReturnType<typeof runtimeModel>): RuntimeAuthorityModel {
  return Object.freeze({
    identities: Object.freeze(model.identities.map((identity) => Object.freeze({ id: identity.id, active: identity.active }))),
    roleBindings: model.roleBindings ?? Object.freeze([]),
    permissions: model.permissions ?? Object.freeze([]),
    policies: model.policies ?? Object.freeze([]),
  });
}

test("P13 generated experience grows from RuntimeModel through deterministic list detail and form documents", () => {
  const model = runtimeModel();
  const record = { title: "Printer offline", priority: 2, internalSecret: "must-not-render", unbound: "must-not-render" };

  const list = materializeRuntimeGeneratedViewDocument({ model, viewRef: "view:ticket-list", record });
  const detail = materializeRuntimeGeneratedViewDocument({ model, viewRef: "view:ticket-detail", record });
  const form = materializeRuntimeGeneratedViewDocument({ model, viewRef: "view:ticket-form", record });

  assert.equal(list.viewKind, "list");
  assert.deepEqual(list.fields.map((field) => field.fieldRef), ["title"]);
  assert.equal(detail.viewKind, "detail");
  assert.deepEqual(detail.fields.map((field) => field.fieldRef), ["priority", "title"]);
  assert.equal(form.viewKind, "form");
  assert.deepEqual(form.actions, [{ actionRef: editActionRef }]);

  const second = materializeRuntimeGeneratedViewDocument({ model: runtimeModel(), viewRef: "view:ticket-form", record: { priority: 2, title: "Printer offline" } });
  assert.deepEqual(form, second);

  const serialized = JSON.stringify({ model, list, detail, form });
  for (const forbidden of ["FREE TEXT MUST NEVER EXECUTE", "must-not-render", "credential", "password", "signingKey", "resolvedValue", "sessionToken", "Builder", "Observe"]) {
    assert.equal(serialized.includes(forbidden), false, forbidden);
  }
});

test("P13 generated form validation is bounded and fail-closed", () => {
  const model = runtimeModel();
  const form = materializeRuntimeGeneratedViewDocument({ model, viewRef: "view:ticket-form", record: {} });

  const accepted = validateRuntimeGeneratedFormInput({
    document: form,
    entries: [{ fieldRef: "priority", value: "not-coerced" }, { fieldRef: "title", value: 42 }],
  });
  assert.equal(accepted.ok, true);
  if (accepted.ok) {
    assert.deepEqual(accepted.values, [{ fieldRef: "priority", value: "not-coerced" }, { fieldRef: "title", value: 42 }]);
  }

  const missing = validateRuntimeGeneratedFormInput({ document: form, entries: [{ fieldRef: "priority", value: 1 }] });
  assert.deepEqual(missing, {
    kind: "RuntimeGeneratedFormInputRejected",
    ok: false,
    viewRef: "view:ticket-form",
    entityRef,
    reasons: [{ code: "MISSING_REQUIRED_FIELD", fieldRef: "title" }],
  });

  const extra = validateRuntimeGeneratedFormInput({ document: form, entries: [{ fieldRef: "title", value: "ok" }, { fieldRef: "internalSecret", value: "secret-value" }] });
  assert.equal(extra.ok, false);
  assert.equal(JSON.stringify(extra).includes("secret-value"), false);

  const duplicate = validateRuntimeGeneratedFormInput({ document: form, entries: [{ fieldRef: "title", value: "one" }, { fieldRef: "title", value: "two" }] });
  assert.equal(duplicate.ok, false);
});

test("P13 rendered interaction uses the existing Construction B authority path for allow and deny", () => {
  const model = runtimeModel();
  const document = materializeRuntimeGeneratedViewDocument({ model, viewRef: "view:ticket-form", record: { title: "Ticket" } });
  const authority = authorityModel(model);

  const allowed = authorizeRuntimeRenderedGeneratedInteraction({
    document,
    actionRef: editActionRef,
    authorityModel: authority,
    actor: { identityRef: "identity:alice" },
  });
  assert.equal(allowed.ok, true);
  if (allowed.ok) assert.equal(allowed.evidence.decision.allowed, true);

  const denied = authorizeRuntimeRenderedGeneratedInteraction({
    document,
    actionRef: editActionRef,
    authorityModel: authority,
    actor: { identityRef: "identity:bob" },
  });
  assert.equal(denied.ok, false);
  if (!denied.ok) assert.equal(denied.stage, "permission");

  const unboundAction = authorizeRuntimeRenderedGeneratedInteraction({
    document,
    actionRef: "action:delete-ticket",
    authorityModel: authority,
    actor: { identityRef: "identity:alice" },
  });
  assert.equal(unboundAction.ok, false);
  if (!unboundAction.ok) assert.equal(unboundAction.stage, "interaction");

  const serialized = JSON.stringify({ allowed, denied, unboundAction });
  for (const forbidden of ["FREE TEXT MUST NEVER EXECUTE", "credential", "password", "secret-value", "signingKey", "resolvedValue"]) {
    assert.equal(serialized.includes(forbidden), false, forbidden);
  }
});

test("P13 generated rendering fails closed for unknown view without Builder or Observe lookup", () => {
  assert.throws(
    () => materializeRuntimeGeneratedViewDocument({ model: runtimeModel(), viewRef: "view:missing", record: {} }),
    /RUNTIME_GENERATED_RENDER_UNKNOWN_VIEW:view:missing/,
  );
});
