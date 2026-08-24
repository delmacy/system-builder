import assert from "node:assert/strict";
import test from "node:test";
import {
  resolveRuntimeActorAuthority,
  type RuntimeAuthorityModel,
} from "../../packages/runtime-core/index.js";
import { evaluateRuntimePermission } from "../../packages/runtime-core/permission-evaluation.js";

function permission(role: string, resource = "entity:ticket", actions: readonly string[] = ["action:read"]) {
  return { role, resource, actions };
}

function model(overrides: Partial<RuntimeAuthorityModel> = {}): RuntimeAuthorityModel {
  return {
    identities: [{ id: "identity:alice", active: true }],
    roleBindings: [{ id: "binding:alice:operator", roleRef: "role:operator", actorRef: "identity:alice" }],
    permissions: [permission("role:operator")],
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
    model({ roleBindings: [{ id: "binding:membership:operator", roleRef: "role:operator", membershipRef: "membership:ops" }] }),
    { identityRef: "identity:alice", memberships: [{ id: "membership:ops", active: true }] },
  );
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(result.authority.membershipRefs, ["membership:ops"]);
  assert.deepEqual(result.authority.roleRefs, ["role:operator"]);
});

test("fails closed for disabled identity or membership", () => {
  const disabledIdentity = resolveRuntimeActorAuthority(model({ identities: [{ id: "identity:alice", active: false }] }), { identityRef: "identity:alice" });
  assert.equal(disabledIdentity.ok, false);
  if (!disabledIdentity.ok) assert.equal(disabledIdentity.diagnostic.code, "RUNTIME_AUTHORITY_IDENTITY_DISABLED");

  const disabledMembership = resolveRuntimeActorAuthority(
    model({ roleBindings: [{ id: "binding:membership:operator", roleRef: "role:operator", membershipRef: "membership:ops" }] }),
    { identityRef: "identity:alice", memberships: [{ id: "membership:ops", active: false }] },
  );
  assert.equal(disabledMembership.ok, false);
  if (!disabledMembership.ok) assert.equal(disabledMembership.diagnostic.code, "RUNTIME_AUTHORITY_MEMBERSHIP_DISABLED");
});

test("fails closed for unknown or ambiguous identity authority", () => {
  const unknown = resolveRuntimeActorAuthority(model(), { identityRef: "identity:bob" });
  assert.equal(unknown.ok, false);
  if (!unknown.ok) assert.equal(unknown.diagnostic.code, "RUNTIME_AUTHORITY_IDENTITY_UNKNOWN");

  const ambiguous = resolveRuntimeActorAuthority(model({ identities: [{ id: "identity:alice", active: true }, { id: "identity:alice", active: true }] }), { identityRef: "identity:alice" });
  assert.equal(ambiguous.ok, false);
  if (ambiguous.ok) return;
  assert.equal(ambiguous.diagnostic.code, "RUNTIME_AUTHORITY_IDENTITY_AMBIGUOUS");
});

test("fails closed for unknown roles and ambiguous role resolution", () => {
  const unknownRole = resolveRuntimeActorAuthority(model({ roleBindings: [{ id: "binding:alice:unknown", roleRef: "role:unknown", actorRef: "identity:alice" }] }), { identityRef: "identity:alice" });
  assert.equal(unknownRole.ok, false);
  if (!unknownRole.ok) assert.equal(unknownRole.diagnostic.code, "RUNTIME_AUTHORITY_ROLE_UNKNOWN");

  const ambiguousRole = resolveRuntimeActorAuthority(
    model({ roleBindings: [
      { id: "binding:alice:operator", roleRef: "role:operator", actorRef: "identity:alice" },
      { id: "binding:membership:operator", roleRef: "role:operator", membershipRef: "membership:ops" },
    ] }),
    { identityRef: "identity:alice", memberships: [{ id: "membership:ops", active: true }] },
  );
  assert.equal(ambiguousRole.ok, false);
  if (!ambiguousRole.ok) assert.equal(ambiguousRole.diagnostic.code, "RUNTIME_AUTHORITY_ROLE_AMBIGUOUS");
});

test("resolution is deterministic and ignores declaration order", () => {
  const first = resolveRuntimeActorAuthority(model({
    roleBindings: [
      { id: "binding:alice:reviewer", roleRef: "role:reviewer", actorRef: "identity:alice" },
      { id: "binding:alice:operator", roleRef: "role:operator", actorRef: "identity:alice" },
    ],
    permissions: [permission("role:reviewer"), permission("role:operator")],
  }), { identityRef: "identity:alice" });
  const second = resolveRuntimeActorAuthority(model({
    roleBindings: [
      { id: "binding:alice:operator", roleRef: "role:operator", actorRef: "identity:alice" },
      { id: "binding:alice:reviewer", roleRef: "role:reviewer", actorRef: "identity:alice" },
    ],
    permissions: [permission("role:operator"), permission("role:reviewer")],
  }), { identityRef: "identity:alice" });
  assert.deepEqual(first, second);
});

test("permission evaluation allows only an exact declared role resource and action", () => {
  const resolved = resolveRuntimeActorAuthority(model(), { identityRef: "identity:alice" });
  assert.equal(resolved.ok, true);
  if (!resolved.ok) return;
  const allowed = evaluateRuntimePermission({ authority: resolved.authority, permissions: [permission("role:operator", "entity:ticket", ["action:read", "action:update"])], resourceRef: "entity:ticket", actionRef: "action:update" });
  assert.deepEqual(allowed, { kind: "RuntimePermissionDecision", allowed: true, evidence: { roleRef: "role:operator", resourceRef: "entity:ticket", actionRef: "action:update", policyRefs: [], reason: "RUNTIME_PERMISSION_ALLOWED" } });
});

test("permission evaluation defaults to deny with no wildcard or permissive fallback", () => {
  const resolved = resolveRuntimeActorAuthority(model(), { identityRef: "identity:alice" });
  assert.equal(resolved.ok, true);
  if (!resolved.ok) return;
  for (const [resourceRef, actionRef] of [["entity:other", "action:read"], ["entity:ticket", "action:delete"], ["*", "action:read"]] as const) {
    const denied = evaluateRuntimePermission({ authority: resolved.authority, permissions: [permission("role:operator")], resourceRef, actionRef });
    assert.equal(denied.allowed, false);
    assert.equal(denied.evidence.reason, "RUNTIME_PERMISSION_DEFAULT_DENY");
  }
});

test("permission context requires exact bounded membership and organization references", () => {
  const resolved = resolveRuntimeActorAuthority(model({ roleBindings: [{ id: "binding:ops", roleRef: "role:operator", membershipRef: "membership:ops" }] }), { identityRef: "identity:alice", memberships: [{ id: "membership:ops", active: true }] });
  assert.equal(resolved.ok, true);
  if (!resolved.ok) return;
  const permissions = [{ ...permission("role:operator"), context: { membershipRef: "membership:ops", organizationRef: "organization:acme" } }];
  const denied = evaluateRuntimePermission({ authority: resolved.authority, permissions, resourceRef: "entity:ticket", actionRef: "action:read", context: { membershipRef: "membership:ops", organizationRef: "organization:other" } });
  assert.equal(denied.allowed, false);
  assert.equal(denied.evidence.reason, "RUNTIME_PERMISSION_CONTEXT_MISMATCH");
  const allowed = evaluateRuntimePermission({ authority: resolved.authority, permissions, resourceRef: "entity:ticket", actionRef: "action:read", context: { membershipRef: "membership:ops", organizationRef: "organization:acme" } });
  assert.equal(allowed.allowed, true);
});

test("permissions with unresolved policy references fail closed", () => {
  const resolved = resolveRuntimeActorAuthority(model(), { identityRef: "identity:alice" });
  assert.equal(resolved.ok, true);
  if (!resolved.ok) return;
  const decision = evaluateRuntimePermission({ authority: resolved.authority, permissions: [{ ...permission("role:operator"), policyRefs: ["policy:office-hours"] }], resourceRef: "entity:ticket", actionRef: "action:read" });
  assert.equal(decision.allowed, false);
  assert.deepEqual(decision.evidence.policyRefs, ["policy:office-hours"]);
  assert.equal(decision.evidence.reason, "RUNTIME_PERMISSION_POLICY_UNKNOWN");
});

test("permission evidence is deterministic and contains references and reasons only", () => {
  const authority = { kind: "RuntimeResolvedAuthority" as const, identityRef: "identity:alice", membershipRefs: [], roleRefs: ["role:reviewer", "role:operator"], roleBindingRefs: ["binding:reviewer", "binding:operator"] };
  const first = evaluateRuntimePermission({ authority, permissions: [permission("role:reviewer"), permission("role:operator")], resourceRef: "entity:ticket", actionRef: "action:read" });
  const second = evaluateRuntimePermission({ authority, permissions: [permission("role:operator"), permission("role:reviewer")], resourceRef: "entity:ticket", actionRef: "action:read" });
  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(first).includes("credential"), false);
  assert.equal(JSON.stringify(first).includes("secret"), false);
  assert.equal(JSON.stringify(first).includes("token"), false);
});
