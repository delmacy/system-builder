import assert from "node:assert/strict";
import test from "node:test";
import {
  resolveRuntimeActorAuthority,
  type RuntimeAuthorityModel,
} from "../../packages/runtime-core/index.js";

function model(overrides: Partial<RuntimeAuthorityModel> = {}): RuntimeAuthorityModel {
  return {
    identities: [{ id: "identity:alice", active: true }],
    roleBindings: [{ id: "binding:alice:operator", roleRef: "role:operator", actorRef: "identity:alice" }],
    permissions: [{ role: "role:operator" }],
    policies: [],
    ...overrides,
  };
}

test("resolves only an explicitly bound active actor role", () => {
  const result = resolveRuntimeActorAuthority(model(), { identityRef: "identity:alice" });
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(result.authority, {
    kind: "RuntimeResolvedAuthority",
    identityRef: "identity:alice",
    membershipRefs: [],
    roleRefs: ["role:operator"],
    roleBindingRefs: ["binding:alice:operator"],
  });
});

test("authentication alone does not imply a role", () => {
  const result = resolveRuntimeActorAuthority(model({ roleBindings: [] }), { identityRef: "identity:alice" });
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.diagnostic.code, "RUNTIME_AUTHORITY_ROLE_MISSING");
});

test("resolves membership authority only when the authenticated actor context explicitly carries an active membership", () => {
  const result = resolveRuntimeActorAuthority(
    model({
      roleBindings: [{ id: "binding:membership:operator", roleRef: "role:operator", membershipRef: "membership:ops" }],
    }),
    { identityRef: "identity:alice", memberships: [{ id: "membership:ops", active: true }] },
  );
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(result.authority.membershipRefs, ["membership:ops"]);
  assert.deepEqual(result.authority.roleRefs, ["role:operator"]);
});

test("fails closed for disabled identity or membership", () => {
  const disabledIdentity = resolveRuntimeActorAuthority(
    model({ identities: [{ id: "identity:alice", active: false }] }),
    { identityRef: "identity:alice" },
  );
  assert.equal(disabledIdentity.ok, false);
  if (!disabledIdentity.ok) assert.equal(disabledIdentity.diagnostic.code, "RUNTIME_AUTHORITY_IDENTITY_DISABLED");

  const disabledMembership = resolveRuntimeActorAuthority(
    model({
      roleBindings: [{ id: "binding:membership:operator", roleRef: "role:operator", membershipRef: "membership:ops" }],
    }),
    { identityRef: "identity:alice", memberships: [{ id: "membership:ops", active: false }] },
  );
  assert.equal(disabledMembership.ok, false);
  if (!disabledMembership.ok) assert.equal(disabledMembership.diagnostic.code, "RUNTIME_AUTHORITY_MEMBERSHIP_DISABLED");
});

test("fails closed for unknown or ambiguous identity authority", () => {
  const unknown = resolveRuntimeActorAuthority(model(), { identityRef: "identity:bob" });
  assert.equal(unknown.ok, false);
  if (!unknown.ok) assert.equal(unknown.diagnostic.code, "RUNTIME_AUTHORITY_IDENTITY_UNKNOWN");

  const ambiguous = resolveRuntimeActorAuthority(
    model({ identities: [{ id: "identity:alice", active: true }, { id: "identity:alice", active: true }] }),
    { identityRef: "identity:alice" },
  );
  assert.equal(ambiguous.ok, false);
  if (!ambiguous.ok) assert.equal(ambiguous.diagnostic.code, "RUNTIME_AUTHORITY_IDENTITY_AMBIGUOUS");
});

test("fails closed for unknown roles and ambiguous role resolution", () => {
  const unknownRole = resolveRuntimeActorAuthority(
    model({ roleBindings: [{ id: "binding:alice:unknown", roleRef: "role:unknown", actorRef: "identity:alice" }] }),
    { identityRef: "identity:alice" },
  );
  assert.equal(unknownRole.ok, false);
  if (!unknownRole.ok) assert.equal(unknownRole.diagnostic.code, "RUNTIME_AUTHORITY_ROLE_UNKNOWN");

  const ambiguousRole = resolveRuntimeActorAuthority(
    model({
      roleBindings: [
        { id: "binding:alice:operator", roleRef: "role:operator", actorRef: "identity:alice" },
        { id: "binding:membership:operator", roleRef: "role:operator", membershipRef: "membership:ops" },
      ],
    }),
    { identityRef: "identity:alice", memberships: [{ id: "membership:ops", active: true }] },
  );
  assert.equal(ambiguousRole.ok, false);
  if (!ambiguousRole.ok) assert.equal(ambiguousRole.diagnostic.code, "RUNTIME_AUTHORITY_ROLE_AMBIGUOUS");
});

test("resolution is deterministic and ignores identity labels, provider names and declaration order", () => {
  const first = resolveRuntimeActorAuthority(
    model({
      roleBindings: [
        { id: "binding:alice:reviewer", roleRef: "role:reviewer", actorRef: "identity:alice" },
        { id: "binding:alice:operator", roleRef: "role:operator", actorRef: "identity:alice" },
      ],
      permissions: [{ role: "role:reviewer" }, { role: "role:operator" }],
    }),
    { identityRef: "identity:alice" },
  );
  const second = resolveRuntimeActorAuthority(
    model({
      roleBindings: [
        { id: "binding:alice:operator", roleRef: "role:operator", actorRef: "identity:alice" },
        { id: "binding:alice:reviewer", roleRef: "role:reviewer", actorRef: "identity:alice" },
      ],
      permissions: [{ role: "role:operator" }, { role: "role:reviewer" }],
    }),
    { identityRef: "identity:alice" },
  );
  assert.deepEqual(first, second);
});
