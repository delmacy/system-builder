import type {
  RuntimeAuthorityPermissionDescriptor,
  RuntimeAuthorityPolicyDescriptor,
  RuntimeAuthorityPolicyScalar,
  RuntimeResolvedAuthority,
} from "./authority-resolution.js";

export type RuntimePermissionEvaluationContext = Readonly<{
  organizationRef?: string;
  membershipRef?: string;
  policyContext?: Readonly<Record<string, RuntimeAuthorityPolicyScalar>>;
}>;

export type RuntimePermissionDecisionReason =
  | "RUNTIME_PERMISSION_ALLOWED"
  | "RUNTIME_PERMISSION_DEFAULT_DENY"
  | "RUNTIME_PERMISSION_CONTEXT_MISMATCH"
  | "RUNTIME_PERMISSION_POLICY_EVALUATION_REQUIRED"
  | "RUNTIME_PERMISSION_POLICY_UNKNOWN"
  | "RUNTIME_PERMISSION_POLICY_AMBIGUOUS"
  | "RUNTIME_PERMISSION_POLICY_CONTEXT_MISMATCH"
  | "RUNTIME_PERMISSION_POLICY_DENIED";

export type RuntimePermissionDecisionEvidence = Readonly<{
  roleRef?: string;
  resourceRef: string;
  actionRef: string;
  membershipRef?: string;
  organizationRef?: string;
  policyRefs: readonly string[];
  reason: RuntimePermissionDecisionReason;
}>;

export type RuntimePermissionDecision = Readonly<{
  kind: "RuntimePermissionDecision";
  allowed: boolean;
  evidence: RuntimePermissionDecisionEvidence;
}>;

function token(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const normalized = value.trim();
  return normalized.length === 0 ? undefined : normalized;
}

function sortedUnique(values: readonly string[] | undefined): readonly string[] {
  return Object.freeze(
    [...new Set((values ?? []).map((value) => token(value)).filter((value): value is string => value !== undefined))]
      .sort((left, right) => left.localeCompare(right)),
  );
}

function deny(
  resourceRef: string,
  actionRef: string,
  reason: Exclude<RuntimePermissionDecisionReason, "RUNTIME_PERMISSION_ALLOWED">,
  details: Readonly<{
    roleRef?: string | undefined;
    membershipRef?: string | undefined;
    organizationRef?: string | undefined;
    policyRefs?: readonly string[] | undefined;
  }> = {},
): RuntimePermissionDecision {
  return Object.freeze({
    kind: "RuntimePermissionDecision",
    allowed: false,
    evidence: Object.freeze({
      resourceRef,
      actionRef,
      ...(details.roleRef === undefined ? {} : { roleRef: details.roleRef }),
      ...(details.membershipRef === undefined ? {} : { membershipRef: details.membershipRef }),
      ...(details.organizationRef === undefined ? {} : { organizationRef: details.organizationRef }),
      policyRefs: sortedUnique(details.policyRefs),
      reason,
    }),
  });
}

function allow(
  permission: RuntimeAuthorityPermissionDescriptor,
  resourceRef: string,
  actionRef: string,
  policyRefs: readonly string[],
): RuntimePermissionDecision {
  return Object.freeze({
    kind: "RuntimePermissionDecision",
    allowed: true,
    evidence: Object.freeze({
      roleRef: token(permission.role)!,
      resourceRef,
      actionRef,
      ...(token(permission.context?.membershipRef) === undefined ? {} : { membershipRef: token(permission.context?.membershipRef)! }),
      ...(token(permission.context?.organizationRef) === undefined ? {} : { organizationRef: token(permission.context?.organizationRef)! }),
      policyRefs: sortedUnique(policyRefs),
      reason: "RUNTIME_PERMISSION_ALLOWED" as const,
    }),
  });
}

function contextMatches(
  permission: RuntimeAuthorityPermissionDescriptor,
  authority: RuntimeResolvedAuthority,
  context: RuntimePermissionEvaluationContext | undefined,
): boolean {
  const requiredMembership = token(permission.context?.membershipRef);
  const requiredOrganization = token(permission.context?.organizationRef);
  const suppliedMembership = token(context?.membershipRef);
  const suppliedOrganization = token(context?.organizationRef);

  if (requiredMembership !== undefined) {
    if (!authority.membershipRefs.includes(requiredMembership)) return false;
    if (suppliedMembership !== undefined && suppliedMembership !== requiredMembership) return false;
  } else if (suppliedMembership !== undefined && !authority.membershipRefs.includes(suppliedMembership)) {
    return false;
  }

  if (requiredOrganization !== undefined && suppliedOrganization !== requiredOrganization) return false;
  return true;
}

function policyContextMatches(
  policy: RuntimeAuthorityPolicyDescriptor,
  roleRef: string,
  resourceRef: string,
  actionRef: string,
  context: RuntimePermissionEvaluationContext | undefined,
): boolean {
  const structured = policy.structured;
  if (structured === undefined) return false;

  const roleRefs = sortedUnique(structured.roleRefs);
  if (roleRefs.length > 0 && !roleRefs.includes(roleRef)) return false;

  const resourceRefs = sortedUnique(structured.resourceRefs);
  if (resourceRefs.length > 0 && !resourceRefs.includes(resourceRef)) return false;

  const actionRefs = sortedUnique(structured.actionRefs);
  if (actionRefs.length > 0 && !actionRefs.includes(actionRef)) return false;

  const requiredContext = structured.contextEquals ?? {};
  const suppliedContext = context?.policyContext;
  for (const key of Object.keys(requiredContext).sort((left, right) => left.localeCompare(right))) {
    if (suppliedContext === undefined || !Object.prototype.hasOwnProperty.call(suppliedContext, key)) return false;
    if (suppliedContext[key] !== requiredContext[key]) return false;
  }

  return true;
}

function evaluateBoundPolicies(input: Readonly<{
  policies: readonly RuntimeAuthorityPolicyDescriptor[];
  policyRefs: readonly string[];
  roleRef: string;
  resourceRef: string;
  actionRef: string;
  context?: RuntimePermissionEvaluationContext;
}>): Exclude<RuntimePermissionDecisionReason, "RUNTIME_PERMISSION_DEFAULT_DENY" | "RUNTIME_PERMISSION_CONTEXT_MISMATCH" | "RUNTIME_PERMISSION_POLICY_EVALUATION_REQUIRED"> {
  for (const policyRef of sortedUnique(input.policyRefs)) {
    const matches = input.policies.filter((policy) => token(policy.id) === policyRef);
    if (matches.length === 0) return "RUNTIME_PERMISSION_POLICY_UNKNOWN";
    if (matches.length !== 1) return "RUNTIME_PERMISSION_POLICY_AMBIGUOUS";

    const policy = matches[0]!;
    const effect = policy.structured?.effect;
    if (effect !== "allow" && effect !== "deny") return "RUNTIME_PERMISSION_POLICY_UNKNOWN";
    if (!policyContextMatches(policy, input.roleRef, input.resourceRef, input.actionRef, input.context)) {
      return "RUNTIME_PERMISSION_POLICY_CONTEXT_MISMATCH";
    }
    if (effect === "deny") return "RUNTIME_PERMISSION_POLICY_DENIED";
  }
  return "RUNTIME_PERMISSION_ALLOWED";
}

export function evaluateRuntimePermission(input: Readonly<{
  authority: RuntimeResolvedAuthority;
  permissions: readonly RuntimeAuthorityPermissionDescriptor[];
  policies?: readonly RuntimeAuthorityPolicyDescriptor[];
  resourceRef: string;
  actionRef: string;
  context?: RuntimePermissionEvaluationContext;
}>): RuntimePermissionDecision {
  const resourceRef = token(input.resourceRef) ?? "";
  const actionRef = token(input.actionRef) ?? "";
  if (resourceRef.length === 0 || actionRef.length === 0) {
    return deny(resourceRef, actionRef, "RUNTIME_PERMISSION_DEFAULT_DENY");
  }

  const roleRefs = sortedUnique(input.authority.roleRefs);
  const candidates = input.permissions
    .filter((permission) => {
      const role = token(permission.role);
      const resource = token(permission.resource);
      const actions = sortedUnique(permission.actions);
      return role !== undefined && roleRefs.includes(role) && resource === resourceRef && actions.includes(actionRef);
    })
    .sort((left, right) => {
      const leftRole = token(left.role) ?? "";
      const rightRole = token(right.role) ?? "";
      return leftRole.localeCompare(rightRole)
        || JSON.stringify(left.context ?? {}).localeCompare(JSON.stringify(right.context ?? {}))
        || JSON.stringify(sortedUnique(left.policyRefs)).localeCompare(JSON.stringify(sortedUnique(right.policyRefs)));
    });

  if (candidates.length === 0) {
    return deny(resourceRef, actionRef, "RUNTIME_PERMISSION_DEFAULT_DENY");
  }

  let firstPolicyFailure: Readonly<{
    permission: RuntimeAuthorityPermissionDescriptor;
    reason: Exclude<RuntimePermissionDecisionReason, "RUNTIME_PERMISSION_ALLOWED" | "RUNTIME_PERMISSION_DEFAULT_DENY" | "RUNTIME_PERMISSION_CONTEXT_MISMATCH" | "RUNTIME_PERMISSION_POLICY_EVALUATION_REQUIRED">;
  }> | undefined;
  let firstContextMismatch: RuntimeAuthorityPermissionDescriptor | undefined;

  for (const permission of candidates) {
    const roleRef = token(permission.role)!;
    if (!contextMatches(permission, input.authority, input.context)) {
      firstContextMismatch ??= permission;
      continue;
    }

    const policyRefs = sortedUnique(permission.policyRefs);
    if (policyRefs.length === 0) return allow(permission, resourceRef, actionRef, []);

    if (input.policies === undefined) {
      firstPolicyFailure ??= { permission, reason: "RUNTIME_PERMISSION_POLICY_UNKNOWN" };
      continue;
    }

    const policyReason = evaluateBoundPolicies({
      policies: input.policies,
      policyRefs,
      roleRef,
      resourceRef,
      actionRef,
      ...(input.context === undefined ? {} : { context: input.context }),
    });
    if (policyReason === "RUNTIME_PERMISSION_ALLOWED") {
      return allow(permission, resourceRef, actionRef, policyRefs);
    }
    firstPolicyFailure ??= { permission, reason: policyReason };
  }

  if (firstPolicyFailure !== undefined) {
    const permission = firstPolicyFailure.permission;
    return deny(resourceRef, actionRef, firstPolicyFailure.reason, {
      roleRef: token(permission.role),
      membershipRef: token(permission.context?.membershipRef),
      organizationRef: token(permission.context?.organizationRef),
      policyRefs: permission.policyRefs,
    });
  }

  if (firstContextMismatch !== undefined) {
    return deny(resourceRef, actionRef, "RUNTIME_PERMISSION_CONTEXT_MISMATCH", {
      roleRef: token(firstContextMismatch.role),
      membershipRef: token(firstContextMismatch.context?.membershipRef),
      organizationRef: token(firstContextMismatch.context?.organizationRef),
      policyRefs: firstContextMismatch.policyRefs,
    });
  }

  return deny(resourceRef, actionRef, "RUNTIME_PERMISSION_DEFAULT_DENY");
}
