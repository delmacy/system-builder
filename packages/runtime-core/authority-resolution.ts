export type RuntimeAuthorityIdentity = Readonly<{
  id: string;
  active: boolean;
}>;

export type RuntimeAuthorityMembership = Readonly<{
  id: string;
  active: boolean;
}>;

export type RuntimeAuthorityRoleBinding = Readonly<{
  id: string;
  roleRef: string;
  actorRef?: string;
  membershipRef?: string;
}>;

export type RuntimeAuthorityPermissionDescriptor = Readonly<{
  role: string;
}>;

export type RuntimeAuthorityPolicyDescriptor = Readonly<{
  structured?: Readonly<{
    roleRefs?: readonly string[];
  }>;
}>;

export type RuntimeAuthorityModel = Readonly<{
  identities: readonly RuntimeAuthorityIdentity[];
  roleBindings?: readonly RuntimeAuthorityRoleBinding[];
  permissions?: readonly RuntimeAuthorityPermissionDescriptor[];
  policies?: readonly RuntimeAuthorityPolicyDescriptor[];
}>;

export type RuntimeAuthenticatedActorContext = Readonly<{
  identityRef: string;
  memberships?: readonly RuntimeAuthorityMembership[];
}>;

export type RuntimeResolvedAuthority = Readonly<{
  kind: "RuntimeResolvedAuthority";
  identityRef: string;
  membershipRefs: readonly string[];
  roleRefs: readonly string[];
  roleBindingRefs: readonly string[];
}>;

export type RuntimeAuthorityResolutionDiagnostic = Readonly<{
  code:
    | "RUNTIME_AUTHORITY_IDENTITY_MISSING"
    | "RUNTIME_AUTHORITY_IDENTITY_UNKNOWN"
    | "RUNTIME_AUTHORITY_IDENTITY_DISABLED"
    | "RUNTIME_AUTHORITY_IDENTITY_AMBIGUOUS"
    | "RUNTIME_AUTHORITY_MEMBERSHIP_UNKNOWN"
    | "RUNTIME_AUTHORITY_MEMBERSHIP_DISABLED"
    | "RUNTIME_AUTHORITY_MEMBERSHIP_AMBIGUOUS"
    | "RUNTIME_AUTHORITY_ROLE_UNKNOWN"
    | "RUNTIME_AUTHORITY_ROLE_MISSING"
    | "RUNTIME_AUTHORITY_ROLE_AMBIGUOUS";
  detail: string;
}>;

export type RuntimeAuthorityResolutionResult =
  | Readonly<{ ok: true; authority: RuntimeResolvedAuthority }>
  | Readonly<{ ok: false; diagnostic: RuntimeAuthorityResolutionDiagnostic }>;

function fail(
  code: RuntimeAuthorityResolutionDiagnostic["code"],
  detail: string,
): RuntimeAuthorityResolutionResult {
  return Object.freeze({
    ok: false,
    diagnostic: Object.freeze({ code, detail }),
  });
}

function token(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const normalized = value.trim();
  return normalized.length === 0 ? undefined : normalized;
}

function knownRoleRefs(model: RuntimeAuthorityModel): ReadonlySet<string> {
  const roles = new Set<string>();
  for (const permission of model.permissions ?? []) {
    const role = token(permission.role);
    if (role !== undefined) roles.add(role);
  }
  for (const policy of model.policies ?? []) {
    for (const roleRef of policy.structured?.roleRefs ?? []) {
      const role = token(roleRef);
      if (role !== undefined) roles.add(role);
    }
  }
  return roles;
}

export function resolveRuntimeActorAuthority(
  model: RuntimeAuthorityModel,
  actor: RuntimeAuthenticatedActorContext,
): RuntimeAuthorityResolutionResult {
  const identityRef = token(actor.identityRef);
  if (identityRef === undefined) {
    return fail("RUNTIME_AUTHORITY_IDENTITY_MISSING", "identity");
  }

  const identityMatches = model.identities.filter((identity) => token(identity.id) === identityRef);
  if (identityMatches.length === 0) {
    return fail("RUNTIME_AUTHORITY_IDENTITY_UNKNOWN", identityRef);
  }
  if (identityMatches.length !== 1) {
    return fail("RUNTIME_AUTHORITY_IDENTITY_AMBIGUOUS", identityRef);
  }
  if (!identityMatches[0].active) {
    return fail("RUNTIME_AUTHORITY_IDENTITY_DISABLED", identityRef);
  }

  const memberships = actor.memberships ?? [];
  const membershipRefs = new Set<string>();
  for (const membership of memberships) {
    const membershipRef = token(membership.id);
    if (membershipRef === undefined) {
      return fail("RUNTIME_AUTHORITY_MEMBERSHIP_UNKNOWN", "membership");
    }
    if (membershipRefs.has(membershipRef)) {
      return fail("RUNTIME_AUTHORITY_MEMBERSHIP_AMBIGUOUS", membershipRef);
    }
    if (!membership.active) {
      return fail("RUNTIME_AUTHORITY_MEMBERSHIP_DISABLED", membershipRef);
    }
    membershipRefs.add(membershipRef);
  }

  const bindings = model.roleBindings ?? [];
  const candidates: RuntimeAuthorityRoleBinding[] = [];
  for (const binding of bindings) {
    const actorRef = token(binding.actorRef);
    const membershipRef = token(binding.membershipRef);
    const actorMatch = actorRef === identityRef;
    const membershipMatch = membershipRef !== undefined && membershipRefs.has(membershipRef);
    if (actorMatch || membershipMatch) candidates.push(binding);
  }

  if (candidates.length === 0) {
    return fail("RUNTIME_AUTHORITY_ROLE_MISSING", identityRef);
  }

  const knownRoles = knownRoleRefs(model);
  const roles = new Set<string>();
  const bindingRefs = new Set<string>();
  for (const binding of candidates) {
    const bindingRef = token(binding.id);
    const roleRef = token(binding.roleRef);
    if (bindingRef === undefined || roleRef === undefined || !knownRoles.has(roleRef)) {
      return fail("RUNTIME_AUTHORITY_ROLE_UNKNOWN", roleRef ?? bindingRef ?? "role");
    }
    if (bindingRefs.has(bindingRef) || roles.has(roleRef)) {
      return fail("RUNTIME_AUTHORITY_ROLE_AMBIGUOUS", roleRef);
    }
    bindingRefs.add(bindingRef);
    roles.add(roleRef);
  }

  return Object.freeze({
    ok: true,
    authority: Object.freeze({
      kind: "RuntimeResolvedAuthority",
      identityRef,
      membershipRefs: Object.freeze([...membershipRefs].sort((left, right) => left.localeCompare(right))),
      roleRefs: Object.freeze([...roles].sort((left, right) => left.localeCompare(right))),
      roleBindingRefs: Object.freeze([...bindingRefs].sort((left, right) => left.localeCompare(right))),
    }),
  });
}
