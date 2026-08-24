import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  resolveRuntimeActorAuthority,
  type RuntimeAuthorityModel,
} from "../../packages/runtime-core/authority-resolution.js";
import { evaluateRuntimePermission } from "../../packages/runtime-core/permission-evaluation.js";

const localRuntimeModel = Object.freeze({
  kind: "RuntimeModel",
  systemDefinitionRef: "system-definition:p13:offline-authority",
  identities: Object.freeze([
    Object.freeze({ id: "identity:operator", active: true }),
    Object.freeze({ id: "identity:disabled", active: false }),
  ]),
  roleBindings: Object.freeze([
    Object.freeze({
      id: "binding:operator-membership",
      roleRef: "role:operator",
      membershipRef: "membership:ops",
    }),
  ]),
  permissions: Object.freeze([
    Object.freeze({
      role: "role:operator",
      resource: "entity:ticket",
      actions: Object.freeze(["action:ticket:update"]),
      context: Object.freeze({ membershipRef: "membership:ops" }),
      policyRefs: Object.freeze(["policy:bounded-allow"]),
    }),
    Object.freeze({
      role: "role:operator",
      resource: "entity:legacy",
      actions: Object.freeze(["action:legacy:read"]),
      policyRefs: Object.freeze(["policy:legacy-text"]),
    }),
  ]),
  policies: Object.freeze([
    Object.freeze({
      id: "policy:bounded-allow",
      structured: Object.freeze({
        effect: "allow" as const,
        roleRefs: Object.freeze(["role:operator"]),
        resourceRefs: Object.freeze(["entity:ticket"]),
        actionRefs: Object.freeze(["action:ticket:update"]),
        contextEquals: Object.freeze({ environment: "offline" }),
      }),
    }),
    // A legacy/free-text policy reaches RuntimeModel as non-executable metadata only.
    Object.freeze({ id: "policy:legacy-text" }),
  ]),
} satisfies RuntimeAuthorityModel & Readonly<{ kind: "RuntimeModel"; systemDefinitionRef: string }>);

async function withLocalRuntimeModel<T>(run: (model: RuntimeAuthorityModel) => Promise<T> | T): Promise<T> {
  const directory = await mkdtemp(join(tmpdir(), "system-builder-task-256-"));
  const path = join(directory, "runtime-model.json");
  try {
    await writeFile(path, JSON.stringify(localRuntimeModel), "utf8");
    const loaded = JSON.parse(await readFile(path, "utf8")) as RuntimeAuthorityModel;
    return await run(loaded);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test("TASK-256 authentication alone grants no role from local RuntimeModel", async () => {
  await withLocalRuntimeModel((model) => {
    const result = resolveRuntimeActorAuthority(model, {
      identityRef: "identity:operator",
    });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.diagnostic.code, "RUNTIME_AUTHORITY_ROLE_MISSING");
  });
});

test("TASK-256 missing disabled unknown and ambiguous membership fail closed offline", async () => {
  await withLocalRuntimeModel((model) => {
    const missing = resolveRuntimeActorAuthority(model, { identityRef: "identity:operator" });
    assert.equal(missing.ok, false);

    const disabled = resolveRuntimeActorAuthority(model, {
      identityRef: "identity:operator",
      memberships: [{ id: "membership:ops", active: false }],
    });
    assert.equal(disabled.ok, false);
    if (!disabled.ok) assert.equal(disabled.diagnostic.code, "RUNTIME_AUTHORITY_MEMBERSHIP_DISABLED");

    const unknownIdentity = resolveRuntimeActorAuthority(model, {
      identityRef: "identity:unknown",
      memberships: [{ id: "membership:ops", active: true }],
    });
    assert.equal(unknownIdentity.ok, false);
    if (!unknownIdentity.ok) assert.equal(unknownIdentity.diagnostic.code, "RUNTIME_AUTHORITY_IDENTITY_UNKNOWN");

    const ambiguousMembership = resolveRuntimeActorAuthority(model, {
      identityRef: "identity:operator",
      memberships: [
        { id: "membership:ops", active: true },
        { id: "membership:ops", active: true },
      ],
    });
    assert.equal(ambiguousMembership.ok, false);
    if (!ambiguousMembership.ok) assert.equal(ambiguousMembership.diagnostic.code, "RUNTIME_AUTHORITY_MEMBERSHIP_AMBIGUOUS");
  });
});

test("TASK-256 local RuntimeModel preserves explicit allow and default deny semantics", async () => {
  await withLocalRuntimeModel((model) => {
    const resolved = resolveRuntimeActorAuthority(model, {
      identityRef: "identity:operator",
      memberships: [{ id: "membership:ops", active: true }],
    });
    assert.equal(resolved.ok, true);
    if (!resolved.ok) return;

    const allowed = evaluateRuntimePermission({
      authority: resolved.authority,
      permissions: model.permissions ?? [],
      policies: model.policies ?? [],
      resourceRef: "entity:ticket",
      actionRef: "action:ticket:update",
      context: {
        membershipRef: "membership:ops",
        policyContext: { environment: "offline" },
      },
    });
    assert.equal(allowed.allowed, true);
    assert.equal(allowed.evidence.reason, "RUNTIME_PERMISSION_ALLOWED");

    const denied = evaluateRuntimePermission({
      authority: resolved.authority,
      permissions: model.permissions ?? [],
      policies: model.policies ?? [],
      resourceRef: "entity:ticket",
      actionRef: "action:ticket:delete",
      context: { membershipRef: "membership:ops" },
    });
    assert.equal(denied.allowed, false);
    assert.equal(denied.evidence.reason, "RUNTIME_PERMISSION_DEFAULT_DENY");
  });
});

test("TASK-256 free-text policy remains non-executable with Builder and Observe unavailable", async () => {
  await withLocalRuntimeModel((model) => {
    const resolved = resolveRuntimeActorAuthority(model, {
      identityRef: "identity:operator",
      memberships: [{ id: "membership:ops", active: true }],
    });
    assert.equal(resolved.ok, true);
    if (!resolved.ok) return;

    const decision = evaluateRuntimePermission({
      authority: resolved.authority,
      permissions: model.permissions ?? [],
      policies: model.policies ?? [],
      resourceRef: "entity:legacy",
      actionRef: "action:legacy:read",
    });
    assert.equal(decision.allowed, false);
    assert.equal(decision.evidence.reason, "RUNTIME_PERMISSION_POLICY_UNKNOWN");

    // The proof uses only the locally read runtime-model.json plus pure Runtime authority APIs.
    assert.equal(JSON.stringify(model).includes("builder.internal"), false);
    assert.equal(JSON.stringify(model).includes("observe.internal"), false);
  });
});
