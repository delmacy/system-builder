import assert from "node:assert/strict";
import test from "node:test";
import {
  authorizeRuntimeActionExecution,
  authorizeRuntimeGeneratedInteraction,
} from "../../packages/runtime-core/authority-gated-interaction.js";
import { materializeRuntimeGeneratedViewBindings } from "../../packages/runtime-core/generated-view-bindings.js";
import type { RuntimeAuthorityModel } from "../../packages/runtime-core/authority-resolution.js";

const actionId = "action:edit";
const entityId = "entity:ticket";

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
    Object.freeze({ role: "role:agent", resource: entityId, actions: Object.freeze([actionId]) }),
    Object.freeze({ role: "role:viewer", resource: entityId, actions: Object.freeze(["action:read"]) }),
  ]),
});

const actions = Object.freeze([
  Object.freeze({ id: actionId, effect: Object.freeze({ kind: "entity.update" as const, entityRef: entityId }) }),
]);
const entities = Object.freeze([Object.freeze({ id: entityId })]);
const generated = materializeRuntimeGeneratedViewBindings({
  entities: [{ id: entityId, fields: [{ name: "title", type: "string", required: true }] }],
  actions,
  views: [{ id: "view:ticket", binding: { entityRef: entityId, fieldRefs: ["title"], actionRefs: [actionId] } }],
});
const binding = generated.bindings[0]!;

test("allowed actor passes representative Runtime action and generated interaction through the same authority decision", () => {
  const actor = Object.freeze({ identityRef: "identity:alice" });
  const runtimeAction = authorizeRuntimeActionExecution({
    actions,
    entities,
    actionId,
    authorityModel,
    actor,
  });
  const generatedInteraction = authorizeRuntimeGeneratedInteraction({
    binding,
    actionRef: actionId,
    authorityModel,
    actor,
  });

  assert.equal(runtimeAction.ok, true);
  assert.equal(generatedInteraction.ok, true);
  if (!runtimeAction.ok || !generatedInteraction.ok) return;

  assert.equal(runtimeAction.evidence.decision.allowed, true);
  assert.equal(generatedInteraction.evidence.decision.allowed, true);
  assert.deepEqual(runtimeAction.evidence.decision, generatedInteraction.evidence.decision);
  assert.deepEqual(runtimeAction.evidence.roleRefs, ["role:agent"]);
  assert.deepEqual(generatedInteraction.evidence.roleRefs, ["role:agent"]);
});

test("denied actor is rejected consistently by both representative paths", () => {
  const actor = Object.freeze({ identityRef: "identity:bob" });
  const runtimeAction = authorizeRuntimeActionExecution({
    actions,
    entities,
    actionId,
    authorityModel,
    actor,
  });
  const generatedInteraction = authorizeRuntimeGeneratedInteraction({
    binding,
    actionRef: actionId,
    authorityModel,
    actor,
  });

  assert.equal(runtimeAction.ok, false);
  assert.equal(generatedInteraction.ok, false);
  if (runtimeAction.ok || generatedInteraction.ok) return;

  assert.equal(runtimeAction.stage, "permission");
  assert.equal(generatedInteraction.stage, "permission");
  if (runtimeAction.stage !== "permission" || generatedInteraction.stage !== "permission") return;

  assert.equal(runtimeAction.decision.allowed, false);
  assert.equal(generatedInteraction.decision.allowed, false);
  assert.equal(runtimeAction.decision.evidence.reason, "RUNTIME_PERMISSION_DEFAULT_DENY");
  assert.deepEqual(runtimeAction.decision, generatedInteraction.decision);
});

test("generated interaction rejects actions that are not explicitly bound before authority evaluation", () => {
  const result = authorizeRuntimeGeneratedInteraction({
    binding,
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

test("authority evidence remains bounded and secret-free", () => {
  const result = authorizeRuntimeActionExecution({
    actions,
    entities,
    actionId,
    authorityModel,
    actor: { identityRef: "identity:alice" },
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;
  const serialized = JSON.stringify(result.evidence);
  for (const marker of ["credential", "password", "secret", "token", "signingKey", "resolvedValue"]) {
    assert.equal(serialized.toLowerCase().includes(marker.toLowerCase()), false, marker);
  }
});
