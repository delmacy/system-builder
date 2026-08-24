import assert from "node:assert/strict";
import test from "node:test";
import { authorizeRuntimeGeneratedInteraction } from "../../packages/runtime-core/authority-gated-interaction.js";
import type { RuntimeAuthorityModel } from "../../packages/runtime-core/authority-resolution.js";
import { materializeRuntimeGeneratedViewBindings } from "../../packages/runtime-core/generated-view-bindings.js";
import { materializeRuntimeGeneratedViewDocument } from "../../packages/runtime-core/generated-view-document.js";
import { authorizeRuntimeRenderedGeneratedInteraction } from "../../packages/runtime-core/rendered-authority-interaction.js";

const actionRef = "action:edit";
const entityRef = "entity:ticket";

const authorityModel: RuntimeAuthorityModel = Object.freeze({
  identities: Object.freeze([
    Object.freeze({ id: "identity:alice", active: true }),
    Object.freeze({ id: "identity:bob", active: true }),
  ]),
  roleBindings: Object.freeze([
    Object.freeze({ id: "binding:alice-agent", roleRef: "role:agent", actorRef: "identity:alice" }),
    Object.freeze({ id: "binding:bob-viewer", roleRef: "role:viewer", actorRef: "identity:bob" }),
  ]),
  permissions: Object.freeze([
    Object.freeze({ role: "role:agent", resource: entityRef, actions: Object.freeze([actionRef]) }),
    Object.freeze({ role: "role:viewer", resource: entityRef, actions: Object.freeze(["action:read"]) }),
  ]),
});

function model() {
  return {
    entities: [{ id: entityRef, fields: [{ name: "title", type: "string", required: true }] }],
    actions: [
      { id: actionRef, effect: { kind: "entity.update", entityRef } },
      { id: "action:delete", effect: { kind: "entity.delete", entityRef } },
    ],
    views: [{ id: "view:ticket-form", kind: "form", binding: { entityRef, fieldRefs: ["title"], actionRefs: [actionRef] } }],
  } as const;
}

function document() {
  return materializeRuntimeGeneratedViewDocument({
    model: model(),
    viewRef: "view:ticket-form",
    record: { title: "Ticket" },
  });
}

function binding() {
  const generated = materializeRuntimeGeneratedViewBindings(model());
  const resolved = generated.bindings[0];
  assert.ok(resolved);
  return resolved;
}

test("allowed rendered action reuses the existing generated interaction authority decision exactly", () => {
  const actor = { identityRef: "identity:alice" } as const;
  const direct = authorizeRuntimeGeneratedInteraction({ binding: binding(), actionRef, authorityModel, actor });
  const rendered = authorizeRuntimeRenderedGeneratedInteraction({ document: document(), actionRef, authorityModel, actor });

  assert.deepEqual(rendered, direct);
  assert.equal(rendered.ok, true);
  if (!rendered.ok) return;
  assert.equal(rendered.evidence.decision.allowed, true);
});

test("denied rendered action reuses the same fail-closed permission decision", () => {
  const actor = { identityRef: "identity:bob" } as const;
  const direct = authorizeRuntimeGeneratedInteraction({ binding: binding(), actionRef, authorityModel, actor });
  const rendered = authorizeRuntimeRenderedGeneratedInteraction({ document: document(), actionRef, authorityModel, actor });

  assert.deepEqual(rendered, direct);
  assert.equal(rendered.ok, false);
  if (rendered.ok) return;
  assert.equal(rendered.stage, "permission");
});

test("action not exposed by the render document fails before authority evaluation", () => {
  const result = authorizeRuntimeRenderedGeneratedInteraction({
    document: document(),
    actionRef: "action:delete",
    authorityModel,
    actor: { identityRef: "identity:alice" },
  });

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.stage, "interaction");
  if (result.stage !== "interaction") return;
  assert.equal(result.code, "RUNTIME_GENERATED_INTERACTION_ACTION_NOT_BOUND");
});

test("authentication without an explicit role binding grants nothing and evidence remains bounded", () => {
  const noBindingModel: RuntimeAuthorityModel = Object.freeze({
    ...authorityModel,
    identities: Object.freeze([...authorityModel.identities, Object.freeze({ id: "identity:charlie", active: true })]),
  });
  const result = authorizeRuntimeRenderedGeneratedInteraction({
    document: document(),
    actionRef,
    authorityModel: noBindingModel,
    actor: { identityRef: "identity:charlie" },
  });

  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.stage, "authority");
  const serialized = JSON.stringify(result);
  for (const marker of ["credential", "password", "secret", "token", "signingKey", "resolvedValue"]) {
    assert.equal(serialized.toLowerCase().includes(marker.toLowerCase()), false, marker);
  }
});
