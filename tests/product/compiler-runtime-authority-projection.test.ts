import assert from "node:assert/strict";
import test from "node:test";
import { normalizeRuntimeAuthorityProjection, type CompilerRuntimeAuthorityProjectionInput } from "../../packages/compiler/authority-projection.js";

function input(): CompilerRuntimeAuthorityProjectionInput {
  return {
    entities: [
      { id: "entity:ticket", fields: [{ name: "title", type: "string" }, { name: "ownerId", type: "string" }] },
      { id: "entity:user", fields: [{ name: "name", type: "string" }] },
    ],
    actions: [
      { id: "action:close", effect: { kind: "entity.update", entityRef: "entity:ticket" } },
      { id: "action:edit", effect: { kind: "entity.update", entityRef: "entity:ticket" } },
    ],
    identities: [{ id: "identity:alice", kind: "user", subjectRef: "subject:alice", active: true, authenticationProviderRef: "provider:local" }],
    roleBindings: [
      { id: "binding:alice-agent", roleRef: "role:agent", actorRef: "identity:alice" },
      { id: "binding:team-admin", roleRef: "role:admin", membershipRef: "membership:team-a" },
    ],
    permissions: [
      { role: "role:agent", resource: "entity:ticket", actions: ["action:edit", "action:close"], policyRefs: ["policy:owned"] },
      { role: "role:admin", resource: "view:ticket-form", actions: ["action:edit"], context: { membershipRef: "membership:team-a" } },
    ],
    policies: [
      {
        id: "policy:owned",
        statement: "Agent may edit owned tickets",
        structured: {
          effect: "allow",
          roleRefs: ["role:agent"],
          resourceRefs: ["entity:ticket"],
          actionRefs: ["action:edit"],
          contextEquals: { ownership: true },
        },
      },
    ],
    views: [
      { id: "view:ticket-form", binding: { entityRef: "entity:ticket", fieldRefs: ["title", "ownerId"], actionRefs: ["action:edit"] } },
    ],
  };
}

test("authority projection is deterministic and keeps references explicit", () => {
  const first = normalizeRuntimeAuthorityProjection(input());
  const source = input();
  const second = normalizeRuntimeAuthorityProjection({
    ...source,
    entities: [...source.entities].reverse(),
    actions: [...source.actions].reverse(),
    roleBindings: [...(source.roleBindings ?? [])].reverse(),
    permissions: [...(source.permissions ?? [])].reverse().map((permission) => ({ ...permission, actions: [...permission.actions].reverse() })),
    policies: [...(source.policies ?? [])].reverse(),
    views: [...(source.views ?? [])].reverse(),
  });

  assert.deepEqual(first, second);
  assert.equal(first.roleBindings[0]?.actorRef, "identity:alice");
  assert.equal(first.roleBindings[1]?.membershipRef, "membership:team-a");
  const agentPermission = first.permissions.find((permission) => permission.role === "role:agent" && permission.resource === "entity:ticket");
  assert.deepEqual(agentPermission?.actions, ["action:close", "action:edit"]);
});

test("authority projection fails closed on unknown and ambiguous references", () => {
  assert.throws(
    () => normalizeRuntimeAuthorityProjection({ ...input(), roleBindings: [{ id: "binding:bad", roleRef: "role:missing", actorRef: "identity:alice" }] }),
    /COMPILER_AUTHORITY_PROJECTION_UNKNOWN_ROLE_REFERENCE/,
  );
  assert.throws(
    () => normalizeRuntimeAuthorityProjection({ ...input(), roleBindings: [{ id: "binding:bad", roleRef: "role:agent", actorRef: "identity:missing" }] }),
    /COMPILER_AUTHORITY_PROJECTION_UNKNOWN_ACTOR_REFERENCE/,
  );
  assert.throws(
    () => normalizeRuntimeAuthorityProjection({ ...input(), permissions: [{ role: "role:admin", resource: "entity:ticket", actions: ["action:edit"], context: { membershipRef: "membership:missing" } }] }),
    /COMPILER_AUTHORITY_PROJECTION_UNKNOWN_MEMBERSHIP_REFERENCE/,
  );
  assert.throws(
    () => normalizeRuntimeAuthorityProjection({ ...input(), views: [{ id: "view:bad", binding: { entityRef: "entity:missing" } }] }),
    /COMPILER_AUTHORITY_PROJECTION_UNKNOWN_VIEW_ENTITY/,
  );
  assert.throws(
    () => normalizeRuntimeAuthorityProjection({ ...input(), views: [{ id: "view:bad", binding: { entityRef: "entity:ticket", fieldRefs: ["missing"] } }] }),
    /COMPILER_AUTHORITY_PROJECTION_UNKNOWN_VIEW_FIELD/,
  );
  assert.throws(
    () => normalizeRuntimeAuthorityProjection({ ...input(), permissions: [{ role: "role:agent", resource: "entity:ticket", actions: ["action:missing"] }] }),
    /COMPILER_AUTHORITY_PROJECTION_UNKNOWN_PERMISSION_ACTION/,
  );
});

test("free-text policy never becomes executable compiler output", () => {
  const result = normalizeRuntimeAuthorityProjection(input());
  const serialized = JSON.stringify(result);
  assert.equal(serialized.includes("Agent may edit owned tickets"), false);
  assert.equal(serialized.includes("statement"), false);
  assert.equal(result.policies[0]?.structured?.effect, "allow");

  const source = input();
  const descriptiveOnly: CompilerRuntimeAuthorityProjectionInput = {
    ...source,
    policies: [{ id: "policy:descriptive", statement: "documentation only" }],
    permissions: [{ role: "role:agent", resource: "entity:ticket", actions: ["action:edit"], policyRefs: ["policy:descriptive"] }],
    roleBindings: [{ id: "binding:alice-agent", roleRef: "role:agent", actorRef: "identity:alice" }],
  };
  assert.throws(
    () => normalizeRuntimeAuthorityProjection(descriptiveOnly),
    /COMPILER_AUTHORITY_PROJECTION_NON_EXECUTABLE_POLICY_REFERENCE/,
  );
});
