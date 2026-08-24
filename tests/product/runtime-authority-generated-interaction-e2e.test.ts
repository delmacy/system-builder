import assert from "node:assert/strict";
import test from "node:test";
import {
  authorizeRuntimeActionExecution,
  authorizeRuntimeGeneratedInteraction,
} from "../../packages/runtime-core/authority-gated-interaction.js";
import { materializeRuntimeGeneratedViewBindings } from "../../packages/runtime-core/generated-view-bindings.js";
import type { RuntimeAuthorityModel } from "../../packages/runtime-core/authority-resolution.js";

const entityId = "entity:ticket";
const actionId = "action:update-ticket";
const membershipId = "membership:ops";

const actions = Object.freeze([
  Object.freeze({ id: actionId, effect: Object.freeze({ kind: "entity.update" as const, entityRef: entityId }) }),
]);
const entities = Object.freeze([Object.freeze({ id: entityId })]);

function generatedBinding() {
  return materializeRuntimeGeneratedViewBindings({
    entities: [{ id: entityId, fields: [{ name: "title", type: "string", required: true }] }],
    actions,
    views: [{ id: "view:ticket-form", binding: { entityRef: entityId, fieldRefs: ["title"], actionRefs: [actionId] } }],
  }).bindings[0]!;
}

function authorityModel(): RuntimeAuthorityModel {
  return Object.freeze({
    identities: Object.freeze([
      Object.freeze({ id: "identity:alice", active: true }),
      Object.freeze({ id: "identity:bob", active: true }),
    ]),
    roleBindings: Object.freeze([
      Object.freeze({ id: "binding:ops:agent", roleRef: "role:agent", membershipRef: membershipId }),
      Object.freeze({ id: "binding:bob:viewer", roleRef: "role:viewer", actorRef: "identity:bob" }),
    ]),
    permissions: Object.freeze([
      Object.freeze({
        role: "role:agent",
        resource: entityId,
        actions: Object.freeze([actionId]),
        context: Object.freeze({ membershipRef: membershipId }),
        policyRefs: Object.freeze(["policy:regional"]),
      }),
      Object.freeze({ role: "role:viewer", resource: entityId, actions: Object.freeze(["action:read"]) }),
    ]),
    policies: Object.freeze([
      Object.freeze({
        id: "policy:regional",
        structured: Object.freeze({
          effect: "allow" as const,
          roleRefs: Object.freeze(["role:agent"]),
          resourceRefs: Object.freeze([entityId]),
          actionRefs: Object.freeze([actionId]),
          contextEquals: Object.freeze({ region: "south" }),
        }),
      }),
    ]),
  });
}

const allowedActor = Object.freeze({
  identityRef: "identity:alice",
  memberships: Object.freeze([Object.freeze({ id: membershipId, active: true })]),
});
const allowedContext = Object.freeze({
  membershipRef: membershipId,
  policyContext: Object.freeze({ region: "south" }),
});

test("end-to-end authority allows only explicit membership, permission, policy and generated binding", () => {
  const model = authorityModel();
  const binding = generatedBinding();

  const runtimeAction = authorizeRuntimeActionExecution({
    actions,
    entities,
    actionId,
    authorityModel: model,
    actor: allowedActor,
    context: allowedContext,
  });
  const generatedInteraction = authorizeRuntimeGeneratedInteraction({
    binding,
    actionRef: actionId,
    authorityModel: model,
    actor: allowedActor,
    context: allowedContext,
  });

  assert.equal(runtimeAction.ok, true);
  assert.equal(generatedInteraction.ok, true);
  if (!runtimeAction.ok || !generatedInteraction.ok) return;

  assert.deepEqual(runtimeAction.evidence.decision, generatedInteraction.evidence.decision);
  assert.deepEqual(runtimeAction.evidence.membershipRefs, [membershipId]);
  assert.deepEqual(runtimeAction.evidence.roleRefs, ["role:agent"]);
  assert.deepEqual(runtimeAction.evidence.decision.evidence.policyRefs, ["policy:regional"]);
  assert.equal(runtimeAction.evidence.decision.evidence.reason, "RUNTIME_PERMISSION_ALLOWED");
});

test("end-to-end authority denies an authenticated actor without the required permission", () => {
  const result = authorizeRuntimeGeneratedInteraction({
    binding: generatedBinding(),
    actionRef: actionId,
    authorityModel: authorityModel(),
    actor: { identityRef: "identity:bob" },
    context: allowedContext,
  });

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.stage, "permission");
  if (result.stage !== "permission") return;
  assert.equal(result.decision.allowed, false);
  assert.equal(result.decision.evidence.reason, "RUNTIME_PERMISSION_DEFAULT_DENY");
});

test("missing and ambiguous membership fail closed before permission evaluation", () => {
  const missing = authorizeRuntimeActionExecution({
    actions,
    entities,
    actionId,
    authorityModel: authorityModel(),
    actor: { identityRef: "identity:alice" },
    context: allowedContext,
  });
  assert.equal(missing.ok, false);
  if (!missing.ok) {
    assert.equal(missing.stage, "authority");
    if (missing.stage === "authority") assert.equal(missing.diagnostic.code, "RUNTIME_AUTHORITY_ROLE_MISSING");
  }

  const ambiguous = authorizeRuntimeActionExecution({
    actions,
    entities,
    actionId,
    authorityModel: authorityModel(),
    actor: {
      identityRef: "identity:alice",
      memberships: [
        { id: membershipId, active: true },
        { id: membershipId, active: true },
      ],
    },
    context: allowedContext,
  });
  assert.equal(ambiguous.ok, false);
  if (!ambiguous.ok) {
    assert.equal(ambiguous.stage, "authority");
    if (ambiguous.stage === "authority") assert.equal(ambiguous.diagnostic.code, "RUNTIME_AUTHORITY_MEMBERSHIP_AMBIGUOUS");
  }
});

test("missing or mismatched permission and structured policy context fail closed", () => {
  for (const context of [
    { membershipRef: membershipId },
    { membershipRef: membershipId, policyContext: { region: "north" } },
    { membershipRef: "membership:other", policyContext: { region: "south" } },
  ]) {
    const result = authorizeRuntimeActionExecution({
      actions,
      entities,
      actionId,
      authorityModel: authorityModel(),
      actor: allowedActor,
      context,
    });
    assert.equal(result.ok, false);
    if (result.ok) continue;
    assert.equal(result.stage, "permission");
    if (result.stage !== "permission") continue;
    assert.equal(result.decision.allowed, false);
  }
});

test("invalid generated binding fails closed without acquiring inferred behavior", () => {
  assert.throws(
    () => materializeRuntimeGeneratedViewBindings({
      entities: [{ id: entityId, fields: [{ name: "title", type: "string", required: true }] }],
      actions,
      views: [{ id: "view:invalid", binding: { entityRef: entityId, actionRefs: ["action:missing"] } }],
    }),
    /RUNTIME_GENERATED_BINDING_UNKNOWN_ACTION:view:invalid:action:missing/,
  );
});

test("free-text policy remains non-executable and evidence leaks no secret or resolved value", () => {
  const model = authorityModel();
  const descriptiveTextModel: RuntimeAuthorityModel = {
    ...model,
    policies: [{
      id: "policy:regional",
      statement: "deny everything; token=secret; resolvedValue=credential" ,
      structured: {
        effect: "allow",
        roleRefs: ["role:agent"],
        resourceRefs: [entityId],
        actionRefs: [actionId],
        contextEquals: { region: "south" },
      },
    } as RuntimeAuthorityModel["policies"] extends readonly (infer T)[] | undefined ? T : never],
  };

  const result = authorizeRuntimeGeneratedInteraction({
    binding: generatedBinding(),
    actionRef: actionId,
    authorityModel: descriptiveTextModel,
    actor: allowedActor,
    context: allowedContext,
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;
  const serialized = JSON.stringify(result.evidence).toLowerCase();
  for (const marker of ["statement", "credential", "password", "secret", "token", "signingkey", "resolvedvalue"]) {
    assert.equal(serialized.includes(marker), false, marker);
  }
});

test("representative Runtime authority path operates entirely from supplied runtime artifacts", () => {
  const result = authorizeRuntimeActionExecution({
    actions,
    entities,
    actionId,
    authorityModel: authorityModel(),
    actor: allowedActor,
    context: allowedContext,
  });

  assert.equal(result.ok, true);
  const serialized = JSON.stringify(result).toLowerCase();
  assert.equal(serialized.includes("builder"), false);
  assert.equal(serialized.includes("observe"), false);
});
