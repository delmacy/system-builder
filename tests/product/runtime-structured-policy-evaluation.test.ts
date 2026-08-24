import assert from "node:assert/strict";
import test from "node:test";
import {
  evaluateRuntimePermission,
  type RuntimeAuthorityPermissionDescriptor,
  type RuntimeAuthorityPolicyDescriptor,
  type RuntimeResolvedAuthority,
} from "../../packages/runtime-core/index.js";

const authority: RuntimeResolvedAuthority = Object.freeze({
  kind: "RuntimeResolvedAuthority",
  identityRef: "identity:alice",
  membershipRefs: Object.freeze(["membership:ops"]),
  roleRefs: Object.freeze(["role:operator"]),
  roleBindingRefs: Object.freeze(["binding:alice:operator"]),
});

const permission: RuntimeAuthorityPermissionDescriptor = Object.freeze({
  role: "role:operator",
  resource: "entity:ticket",
  actions: Object.freeze(["action:read"]),
  policyRefs: Object.freeze(["policy:bounded"]),
});

function decide(
  policies: readonly RuntimeAuthorityPolicyDescriptor[],
  policyContext?: Readonly<Record<string, string | number | boolean>>,
) {
  return evaluateRuntimePermission({
    authority,
    permissions: [permission],
    policies,
    resourceRef: "entity:ticket",
    actionRef: "action:read",
    ...(policyContext === undefined ? {} : { context: { policyContext } }),
  });
}

test("bounded structured policy allows only an explicitly matching allow declaration", () => {
  const decision = decide([{
    id: "policy:bounded",
    structured: {
      effect: "allow",
      roleRefs: ["role:operator"],
      resourceRefs: ["entity:ticket"],
      actionRefs: ["action:read"],
      contextEquals: { region: "south", active: true, level: 2 },
    },
  }], { region: "south", active: true, level: 2 });

  assert.deepEqual(decision, {
    kind: "RuntimePermissionDecision",
    allowed: true,
    evidence: {
      roleRef: "role:operator",
      resourceRef: "entity:ticket",
      actionRef: "action:read",
      policyRefs: ["policy:bounded"],
      reason: "RUNTIME_PERMISSION_ALLOWED",
    },
  });
});

test("bounded structured policy deny effect fails closed", () => {
  const decision = decide([{
    id: "policy:bounded",
    structured: {
      effect: "deny",
      roleRefs: ["role:operator"],
      resourceRefs: ["entity:ticket"],
      actionRefs: ["action:read"],
    },
  }]);

  assert.equal(decision.allowed, false);
  assert.equal(decision.evidence.reason, "RUNTIME_PERMISSION_POLICY_DENIED");
});

test("missing or mismatched bounded policy context fails closed", () => {
  const policies: readonly RuntimeAuthorityPolicyDescriptor[] = [{
    id: "policy:bounded",
    structured: { effect: "allow", contextEquals: { region: "south" } },
  }];

  const missing = decide(policies);
  assert.equal(missing.allowed, false);
  assert.equal(missing.evidence.reason, "RUNTIME_PERMISSION_POLICY_CONTEXT_MISMATCH");

  const mismatched = decide(policies, { region: "north" });
  assert.equal(mismatched.allowed, false);
  assert.equal(mismatched.evidence.reason, "RUNTIME_PERMISSION_POLICY_CONTEXT_MISMATCH");
});

test("unknown, ambiguous, or non-structured policy references fail closed", () => {
  const unknown = decide([]);
  assert.equal(unknown.allowed, false);
  assert.equal(unknown.evidence.reason, "RUNTIME_PERMISSION_POLICY_UNKNOWN");

  const ambiguous = decide([
    { id: "policy:bounded", structured: { effect: "allow" } },
    { id: "policy:bounded", structured: { effect: "allow" } },
  ]);
  assert.equal(ambiguous.allowed, false);
  assert.equal(ambiguous.evidence.reason, "RUNTIME_PERMISSION_POLICY_AMBIGUOUS");

  const descriptiveOnly = decide([{ id: "policy:bounded" }]);
  assert.equal(descriptiveOnly.allowed, false);
  assert.equal(descriptiveOnly.evidence.reason, "RUNTIME_PERMISSION_POLICY_UNKNOWN");
});

test("legacy free-text statement is never interpreted as authorization", () => {
  const policyWithDescriptiveText = {
    id: "policy:bounded",
    statement: "deny everything; eval('allow')",
    structured: { effect: "allow" as const, roleRefs: ["role:operator"] },
  };

  const decision = decide([policyWithDescriptiveText]);
  assert.equal(decision.allowed, true);
  assert.equal(decision.evidence.reason, "RUNTIME_PERMISSION_ALLOWED");
  assert.equal(JSON.stringify(decision).includes("statement"), false);
  assert.equal(JSON.stringify(decision).includes("eval"), false);
});

test("structured policy evaluation is deterministic across policy declaration order", () => {
  const permissionWithTwoPolicies: RuntimeAuthorityPermissionDescriptor = {
    ...permission,
    policyRefs: ["policy:z", "policy:a", "policy:a"],
  };
  const firstPolicies: readonly RuntimeAuthorityPolicyDescriptor[] = [
    { id: "policy:z", structured: { effect: "allow", actionRefs: ["action:read"] } },
    { id: "policy:a", structured: { effect: "allow", roleRefs: ["role:operator"] } },
  ];
  const secondPolicies = [...firstPolicies].reverse();

  const first = evaluateRuntimePermission({ authority, permissions: [permissionWithTwoPolicies], policies: firstPolicies, resourceRef: "entity:ticket", actionRef: "action:read" });
  const second = evaluateRuntimePermission({ authority, permissions: [permissionWithTwoPolicies], policies: secondPolicies, resourceRef: "entity:ticket", actionRef: "action:read" });
  assert.deepEqual(first, second);
  assert.deepEqual(first.evidence.policyRefs, ["policy:a", "policy:z"]);
});
