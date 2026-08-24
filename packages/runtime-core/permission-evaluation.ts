import type {
  RuntimeAuthorityPermissionDescriptor,
  RuntimeResolvedAuthority,
} from "./authority-resolution.js";

export type RuntimePermissionEvaluationContext = Readonly<{
  organizationRef?: string;
  membershipRef?: string;
}>;

export type RuntimePermissionDecisionReason =
  | "RUNTIME_PERMISSION_ALLOWED"
  | "RUNTIME_PERMISSION_DEFAULT_DENY"
  | "RUNTIME_PERMISSION_CONTEXT_MISMATCH"
  | "RUNTIME_PERMISSION_POLICY_EVALUATION_REQUIRED";

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

export function evaluateRuntimePermission(input: Readonly<{
  authority: RuntimeResolvedAuthority;
  permissions: readonly RuntimeAuthorityPermissionDescriptor[];
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
        || JSON.stringify(left.context ?? {}).localeCompare(JSON.stringify(right.context ?? {}));
    });

  if (candidates.length === 0) {
    return deny(resourceRef, actionRef, "RUNTIME_PERMISSION_DEFAULT_DENY");
  }

  let policyBoundCandidate: RuntimeAuthorityPermissionDescriptor | undefined;
  for (const permission of candidates) {
    const roleRef = token(permission.role)!;
    if (!contextMatches(permission, input.authority, input.context)) continue;
    const policyRefs = sortedUnique(permission.policyRefs);
    if (policyRefs.length > 0) {
      policyBoundCandidate ??= permission;
      continue;
    }
    return Object.freeze({
      kind: "RuntimePermissionDecision",
      allowed: true,
      evidence: Object.freeze({
        roleRef,
        resourceRef,
        actionRef,
        ...(token(permission.context?.membershipRef) === undefined ? {} : { membershipRef: token(permission.context?.membershipRef)! }),
        ...(token(permission.context?.organizationRef) === undefined ? {} : { organizationRef: token(permission.context?.organizationRef)! }),
        policyRefs: Object.freeze([]),
        reason: "RUNTIME_PERMISSION_ALLOWED" as const,
      }),
    });
  }

  if (policyBoundCandidate !== undefined) {
    return deny(resourceRef, actionRef, "RUNTIME_PERMISSION_POLICY_EVALUATION_REQUIRED", {
      roleRef: token(policyBoundCandidate.role),
      membershipRef: token(policyBoundCandidate.context?.membershipRef),
      organizationRef: token(policyBoundCandidate.context?.organizationRef),
      policyRefs: policyBoundCandidate.policyRefs,
    });
  }

  const first = candidates[0]!;
  return deny(resourceRef, actionRef, "RUNTIME_PERMISSION_CONTEXT_MISMATCH", {
    roleRef: token(first.role),
    membershipRef: token(first.context?.membershipRef),
    organizationRef: token(first.context?.organizationRef),
    policyRefs: first.policyRefs,
  });
}
