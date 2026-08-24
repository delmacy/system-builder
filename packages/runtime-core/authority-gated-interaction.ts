import { resolveRuntimeAction, type RuntimeActionEntity, type RuntimeActionModel } from "./action-execution.js";
import {
  resolveRuntimeActorAuthority,
  type RuntimeAuthenticatedActorContext,
  type RuntimeAuthorityModel,
  type RuntimeAuthorityResolutionDiagnostic,
  type RuntimeResolvedAuthority,
} from "./authority-resolution.js";
import type { RuntimeGeneratedViewBinding } from "./generated-view-bindings.js";
import {
  evaluateRuntimePermission,
  type RuntimePermissionDecision,
  type RuntimePermissionEvaluationContext,
} from "./permission-evaluation.js";

export type RuntimeAuthorityGateEvidence = Readonly<{
  identityRef: string;
  membershipRefs: readonly string[];
  roleRefs: readonly string[];
  roleBindingRefs: readonly string[];
  decision: RuntimePermissionDecision;
}>;

export type RuntimeAuthorityGateResult =
  | Readonly<{
      ok: true;
      authority: RuntimeResolvedAuthority;
      evidence: RuntimeAuthorityGateEvidence;
    }>
  | Readonly<{
      ok: false;
      stage: "authority";
      diagnostic: RuntimeAuthorityResolutionDiagnostic;
    }>
  | Readonly<{
      ok: false;
      stage: "permission";
      authority: RuntimeResolvedAuthority;
      decision: RuntimePermissionDecision;
      evidence: RuntimeAuthorityGateEvidence;
    }>;

function freezeEvidence(
  authority: RuntimeResolvedAuthority,
  decision: RuntimePermissionDecision,
): RuntimeAuthorityGateEvidence {
  return Object.freeze({
    identityRef: authority.identityRef,
    membershipRefs: Object.freeze([...authority.membershipRefs]),
    roleRefs: Object.freeze([...authority.roleRefs]),
    roleBindingRefs: Object.freeze([...authority.roleBindingRefs]),
    decision,
  });
}

/**
 * Shared bounded, fail-closed authority path used by both representative Runtime
 * action execution and generated interaction gating.
 */
export function evaluateRuntimeAuthorityGate(input: Readonly<{
  authorityModel: RuntimeAuthorityModel;
  actor: RuntimeAuthenticatedActorContext;
  resourceRef: string;
  actionRef: string;
  context?: RuntimePermissionEvaluationContext;
}>): RuntimeAuthorityGateResult {
  const resolved = resolveRuntimeActorAuthority(input.authorityModel, input.actor);
  if (!resolved.ok) {
    return Object.freeze({ ok: false, stage: "authority", diagnostic: resolved.diagnostic });
  }

  const decision = evaluateRuntimePermission({
    authority: resolved.authority,
    permissions: input.authorityModel.permissions ?? [],
    ...(input.authorityModel.policies === undefined ? {} : { policies: input.authorityModel.policies }),
    resourceRef: input.resourceRef,
    actionRef: input.actionRef,
    ...(input.context === undefined ? {} : { context: input.context }),
  });
  const evidence = freezeEvidence(resolved.authority, decision);

  if (!decision.allowed) {
    return Object.freeze({
      ok: false,
      stage: "permission",
      authority: resolved.authority,
      decision,
      evidence,
    });
  }

  return Object.freeze({ ok: true, authority: resolved.authority, evidence });
}

export type RuntimeAuthorizedActionExecutionResult =
  | Readonly<{
      ok: true;
      action: RuntimeActionModel & { effect: NonNullable<RuntimeActionModel["effect"]> };
      entity: RuntimeActionEntity;
      authority: RuntimeResolvedAuthority;
      evidence: RuntimeAuthorityGateEvidence;
    }>
  | Readonly<{
      ok: false;
      stage: "action";
      code: string;
      detail: string;
    }>
  | Exclude<RuntimeAuthorityGateResult, Readonly<{ ok: true }>>;

export function authorizeRuntimeActionExecution(input: Readonly<{
  actions: readonly RuntimeActionModel[];
  entities: readonly RuntimeActionEntity[];
  actionId: string;
  authorityModel: RuntimeAuthorityModel;
  actor: RuntimeAuthenticatedActorContext;
  context?: RuntimePermissionEvaluationContext;
}>): RuntimeAuthorizedActionExecutionResult {
  const resolvedAction = resolveRuntimeAction(input.actions, input.entities, input.actionId);
  if (!resolvedAction.ok) {
    return Object.freeze({
      ok: false,
      stage: "action",
      code: resolvedAction.code,
      detail: resolvedAction.detail,
    });
  }

  const gated = evaluateRuntimeAuthorityGate({
    authorityModel: input.authorityModel,
    actor: input.actor,
    resourceRef: resolvedAction.entity.id,
    actionRef: resolvedAction.action.id,
    ...(input.context === undefined ? {} : { context: input.context }),
  });
  if (!gated.ok) return gated;

  return Object.freeze({
    ok: true,
    action: resolvedAction.action,
    entity: resolvedAction.entity,
    authority: gated.authority,
    evidence: gated.evidence,
  });
}

export type RuntimeAuthorizedGeneratedInteractionResult =
  | Readonly<{
      ok: true;
      viewRef: string;
      entityRef: string;
      actionRef: string;
      authority: RuntimeResolvedAuthority;
      evidence: RuntimeAuthorityGateEvidence;
    }>
  | Readonly<{
      ok: false;
      stage: "interaction";
      code: "RUNTIME_GENERATED_INTERACTION_ACTION_NOT_BOUND";
      detail: string;
    }>
  | Exclude<RuntimeAuthorityGateResult, Readonly<{ ok: true }>>;

export function authorizeRuntimeGeneratedInteraction(input: Readonly<{
  binding: RuntimeGeneratedViewBinding;
  actionRef: string;
  authorityModel: RuntimeAuthorityModel;
  actor: RuntimeAuthenticatedActorContext;
  context?: RuntimePermissionEvaluationContext;
}>): RuntimeAuthorizedGeneratedInteractionResult {
  const actionRef = input.actionRef.trim();
  if (!input.binding.actions.some((binding) => binding.actionRef === actionRef)) {
    return Object.freeze({
      ok: false,
      stage: "interaction",
      code: "RUNTIME_GENERATED_INTERACTION_ACTION_NOT_BOUND",
      detail: `${input.binding.viewRef}:${actionRef}`,
    });
  }

  const gated = evaluateRuntimeAuthorityGate({
    authorityModel: input.authorityModel,
    actor: input.actor,
    resourceRef: input.binding.entityRef,
    actionRef,
    ...(input.context === undefined ? {} : { context: input.context }),
  });
  if (!gated.ok) return gated;

  return Object.freeze({
    ok: true,
    viewRef: input.binding.viewRef,
    entityRef: input.binding.entityRef,
    actionRef,
    authority: gated.authority,
    evidence: gated.evidence,
  });
}
