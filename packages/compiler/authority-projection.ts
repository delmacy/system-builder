import type {
  CompilerRuntimeAction,
  CompilerRuntimeEntity,
  CompilerRuntimeIdentity,
} from "./runtime-projection.js";

export type CompilerRuntimeRoleBinding = Readonly<{
  id: string;
  roleRef: string;
  actorRef?: string;
  membershipRef?: string;
}>;

export type CompilerRuntimePermissionContext = Readonly<{
  organizationRef?: string;
  membershipRef?: string;
}>;

export type CompilerRuntimePermission = Readonly<{
  role: string;
  resource: string;
  actions: readonly string[];
  context?: CompilerRuntimePermissionContext;
  policyRefs?: readonly string[];
}>;

export type CompilerRuntimeStructuredPolicy = Readonly<{
  effect: "allow" | "deny";
  roleRefs?: readonly string[];
  resourceRefs?: readonly string[];
  actionRefs?: readonly string[];
  contextEquals?: Readonly<Record<string, string | number | boolean>>;
}>;

export type CompilerRuntimePolicyDeclaration = Readonly<{
  id: string;
  statement: string;
  structured?: CompilerRuntimeStructuredPolicy;
}>;

export type CompilerRuntimeViewKind = "list" | "detail" | "form" | "dashboard" | "timeline" | "kanban" | "calendar" | "custom";

export type CompilerRuntimeViewBinding = Readonly<{
  entityRef: string;
  fieldRefs?: readonly string[];
  actionRefs?: readonly string[];
}>;

export type CompilerRuntimeViewDeclaration = Readonly<{
  id: string;
  kind: CompilerRuntimeViewKind;
  binding?: CompilerRuntimeViewBinding;
}>;

export type CompilerRuntimeAuthorityProjectionInput = Readonly<{
  entities: readonly CompilerRuntimeEntity[];
  actions: readonly CompilerRuntimeAction[];
  identities?: readonly CompilerRuntimeIdentity[];
  roleBindings?: readonly CompilerRuntimeRoleBinding[];
  permissions?: readonly CompilerRuntimePermission[];
  policies?: readonly CompilerRuntimePolicyDeclaration[];
  views?: readonly CompilerRuntimeViewDeclaration[];
}>;

export type CompilerRuntimeCompiledPolicy = Readonly<{
  id: string;
  structured?: CompilerRuntimeStructuredPolicy;
}>;

export type CompilerRuntimeCompiledView = Readonly<{
  id: string;
  kind: CompilerRuntimeViewKind;
  binding?: CompilerRuntimeViewBinding;
}>;

export type CompilerRuntimeAuthorityProjection = Readonly<{
  kind: "RuntimeAuthorityProjection";
  roleBindings: readonly CompilerRuntimeRoleBinding[];
  permissions: readonly CompilerRuntimePermission[];
  policies: readonly CompilerRuntimeCompiledPolicy[];
  views: readonly CompilerRuntimeCompiledView[];
}>;

const runtimeViewKinds = new Set<CompilerRuntimeViewKind>(["list", "detail", "form", "dashboard", "timeline", "kanban", "calendar", "custom"]);

function token(value: string, field: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) throw new Error(`COMPILER_AUTHORITY_PROJECTION_INVALID_${field.toUpperCase()}`);
  return normalized;
}

function viewKind(value: CompilerRuntimeViewKind | undefined): CompilerRuntimeViewKind {
  if (value === undefined || !runtimeViewKinds.has(value)) throw new Error("COMPILER_AUTHORITY_PROJECTION_INVALID_VIEW_KIND");
  return value;
}

function sortedUniqueTokens(values: readonly string[] | undefined, field: string): readonly string[] | undefined {
  if (values === undefined) return undefined;
  const normalized = values.map((value) => token(value, field)).sort((left, right) => left.localeCompare(right));
  if (new Set(normalized).size !== normalized.length) throw new Error(`COMPILER_AUTHORITY_PROJECTION_DUPLICATE_${field.toUpperCase()}`);
  return Object.freeze(normalized);
}

function uniqueIds<T extends Readonly<{ id: string }>>(items: readonly T[], kind: string): void {
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.id)) throw new Error(`COMPILER_AUTHORITY_PROJECTION_DUPLICATE_${kind}:${item.id}`);
    seen.add(item.id);
  }
}

function normalizeContextEquals(value: Readonly<Record<string, string | number | boolean>> | undefined): Readonly<Record<string, string | number | boolean>> | undefined {
  if (value === undefined) return undefined;
  const entries = Object.entries(value)
    .map(([key, scalar]) => [token(key, "policy_context_key"), scalar] as const)
    .sort(([left], [right]) => left.localeCompare(right));
  if (new Set(entries.map(([key]) => key)).size !== entries.length) throw new Error("COMPILER_AUTHORITY_PROJECTION_DUPLICATE_POLICY_CONTEXT_KEY");
  return Object.freeze(Object.fromEntries(entries));
}

export function normalizeRuntimeAuthorityProjection(input: CompilerRuntimeAuthorityProjectionInput): CompilerRuntimeAuthorityProjection {
  const entities = [...input.entities].map((entity) => ({
    id: token(entity.id, "entity_id"),
    fields: [...entity.fields].map((field) => token(field.name, "field_name")),
  }));
  uniqueIds(entities, "ENTITY");
  const entityIds = new Set(entities.map((entity) => entity.id));
  const entityFields = new Map<string, Set<string>>();
  for (const entity of entities) {
    if (new Set(entity.fields).size !== entity.fields.length) throw new Error(`COMPILER_AUTHORITY_PROJECTION_DUPLICATE_FIELD:${entity.id}`);
    entityFields.set(entity.id, new Set(entity.fields));
  }

  const actions = [...input.actions].map((action) => ({ id: token(action.id, "action_id") }));
  uniqueIds(actions, "ACTION");
  const actionIds = new Set(actions.map((action) => action.id));

  const identities = [...(input.identities ?? [])].map((identity) => ({ id: token(identity.id, "identity_id") }));
  uniqueIds(identities, "IDENTITY");
  const identityIds = new Set(identities.map((identity) => identity.id));

  const views: CompilerRuntimeCompiledView[] = [...(input.views ?? [])].map((view): CompilerRuntimeCompiledView => {
    const id = token(view.id, "view_id");
    const kind = viewKind(view.kind);
    if (view.binding === undefined) return Object.freeze({ id, kind });
    const entityRef = token(view.binding.entityRef, "view_entity_ref");
    if (!entityIds.has(entityRef)) throw new Error(`COMPILER_AUTHORITY_PROJECTION_UNKNOWN_VIEW_ENTITY:${entityRef}`);
    const fieldRefs = sortedUniqueTokens(view.binding.fieldRefs, "view_field_ref");
    const actionRefs = sortedUniqueTokens(view.binding.actionRefs, "view_action_ref");
    const fields = entityFields.get(entityRef)!;
    for (const fieldRef of fieldRefs ?? []) if (!fields.has(fieldRef)) throw new Error(`COMPILER_AUTHORITY_PROJECTION_UNKNOWN_VIEW_FIELD:${entityRef}:${fieldRef}`);
    for (const actionRef of actionRefs ?? []) if (!actionIds.has(actionRef)) throw new Error(`COMPILER_AUTHORITY_PROJECTION_UNKNOWN_VIEW_ACTION:${actionRef}`);
    return Object.freeze({
      id,
      kind,
      binding: Object.freeze({
        entityRef,
        ...(fieldRefs === undefined ? {} : { fieldRefs }),
        ...(actionRefs === undefined ? {} : { actionRefs }),
      }),
    });
  }).sort((left, right) => left.id.localeCompare(right.id));
  uniqueIds(views, "VIEW");
  const viewIds = new Set(views.map((view) => view.id));
  const resourceIds = new Set([...entityIds, ...viewIds]);

  const policies: CompilerRuntimeCompiledPolicy[] = [...(input.policies ?? [])].map((policy): CompilerRuntimeCompiledPolicy => {
    const id = token(policy.id, "policy_id");
    token(policy.statement, "policy_statement");
    if (policy.structured === undefined) return Object.freeze({ id });
    const roleRefs = sortedUniqueTokens(policy.structured.roleRefs, "policy_role_ref");
    const resourceRefs = sortedUniqueTokens(policy.structured.resourceRefs, "policy_resource_ref");
    const actionRefs = sortedUniqueTokens(policy.structured.actionRefs, "policy_action_ref");
    for (const resourceRef of resourceRefs ?? []) if (!resourceIds.has(resourceRef)) throw new Error(`COMPILER_AUTHORITY_PROJECTION_UNKNOWN_POLICY_RESOURCE:${resourceRef}`);
    for (const actionRef of actionRefs ?? []) if (!actionIds.has(actionRef)) throw new Error(`COMPILER_AUTHORITY_PROJECTION_UNKNOWN_POLICY_ACTION:${actionRef}`);
    return Object.freeze({
      id,
      structured: Object.freeze({
        effect: policy.structured.effect,
        ...(roleRefs === undefined ? {} : { roleRefs }),
        ...(resourceRefs === undefined ? {} : { resourceRefs }),
        ...(actionRefs === undefined ? {} : { actionRefs }),
        ...(policy.structured.contextEquals === undefined ? {} : { contextEquals: normalizeContextEquals(policy.structured.contextEquals)! }),
      }),
    });
  }).sort((left, right) => left.id.localeCompare(right.id));
  uniqueIds(policies, "POLICY");
  const policyIds = new Set(policies.map((policy) => policy.id));
  const executablePolicyIds = new Set(policies.filter((policy) => policy.structured !== undefined).map((policy) => policy.id));

  const permissions: CompilerRuntimePermission[] = [...(input.permissions ?? [])].map((permission): CompilerRuntimePermission => {
    const role = token(permission.role, "permission_role");
    const resource = token(permission.resource, "permission_resource");
    if (!resourceIds.has(resource)) throw new Error(`COMPILER_AUTHORITY_PROJECTION_UNKNOWN_PERMISSION_RESOURCE:${resource}`);
    const actionsForPermission = sortedUniqueTokens(permission.actions, "permission_action")!;
    if (actionsForPermission.length === 0) throw new Error(`COMPILER_AUTHORITY_PROJECTION_EMPTY_PERMISSION_ACTIONS:${role}:${resource}`);
    for (const actionRef of actionsForPermission) if (!actionIds.has(actionRef)) throw new Error(`COMPILER_AUTHORITY_PROJECTION_UNKNOWN_PERMISSION_ACTION:${actionRef}`);
    const policyRefs = sortedUniqueTokens(permission.policyRefs, "permission_policy_ref");
    for (const policyRef of policyRefs ?? []) {
      if (!policyIds.has(policyRef)) throw new Error(`COMPILER_AUTHORITY_PROJECTION_UNKNOWN_POLICY_REFERENCE:${policyRef}`);
      if (!executablePolicyIds.has(policyRef)) throw new Error(`COMPILER_AUTHORITY_PROJECTION_NON_EXECUTABLE_POLICY_REFERENCE:${policyRef}`);
    }
    const context = permission.context === undefined ? undefined : Object.freeze({
      ...(permission.context.organizationRef === undefined ? {} : { organizationRef: token(permission.context.organizationRef, "organization_ref") }),
      ...(permission.context.membershipRef === undefined ? {} : { membershipRef: token(permission.context.membershipRef, "membership_ref") }),
    });
    return Object.freeze({
      role,
      resource,
      actions: actionsForPermission,
      ...(context === undefined ? {} : { context }),
      ...(policyRefs === undefined ? {} : { policyRefs }),
    });
  }).sort((left, right) => left.role.localeCompare(right.role) || left.resource.localeCompare(right.resource) || JSON.stringify(left.context ?? {}).localeCompare(JSON.stringify(right.context ?? {})));
  const permissionKeys = new Set<string>();
  for (const permission of permissions) {
    const key = `${permission.role}\u0000${permission.resource}\u0000${JSON.stringify(permission.context ?? {})}`;
    if (permissionKeys.has(key)) throw new Error(`COMPILER_AUTHORITY_PROJECTION_AMBIGUOUS_PERMISSION:${permission.role}:${permission.resource}`);
    permissionKeys.add(key);
  }

  const knownRoles = new Set(permissions.map((permission) => permission.role));
  for (const policy of policies) for (const roleRef of policy.structured?.roleRefs ?? []) knownRoles.add(roleRef);

  const roleBindings: CompilerRuntimeRoleBinding[] = [...(input.roleBindings ?? [])].map((binding): CompilerRuntimeRoleBinding => {
    const id = token(binding.id, "role_binding_id");
    const roleRef = token(binding.roleRef, "role_ref");
    if (!knownRoles.has(roleRef)) throw new Error(`COMPILER_AUTHORITY_PROJECTION_UNKNOWN_ROLE_REFERENCE:${roleRef}`);
    const actorRef = binding.actorRef === undefined ? undefined : token(binding.actorRef, "actor_ref");
    const membershipRef = binding.membershipRef === undefined ? undefined : token(binding.membershipRef, "membership_ref");
    if ((actorRef === undefined) === (membershipRef === undefined)) throw new Error(`COMPILER_AUTHORITY_PROJECTION_AMBIGUOUS_ROLE_BINDING:${id}`);
    if (actorRef !== undefined && !identityIds.has(actorRef)) throw new Error(`COMPILER_AUTHORITY_PROJECTION_UNKNOWN_ACTOR_REFERENCE:${actorRef}`);
    return Object.freeze({ id, roleRef, ...(actorRef === undefined ? {} : { actorRef }), ...(membershipRef === undefined ? {} : { membershipRef }) });
  }).sort((left, right) => left.id.localeCompare(right.id));
  uniqueIds(roleBindings, "ROLE_BINDING");
  const roleBindingTargets = new Set<string>();
  for (const binding of roleBindings) {
    const target = `${binding.actorRef === undefined ? `membership:${binding.membershipRef}` : `actor:${binding.actorRef}`}\u0000${binding.roleRef}`;
    if (roleBindingTargets.has(target)) throw new Error(`COMPILER_AUTHORITY_PROJECTION_AMBIGUOUS_ROLE_BINDING_TARGET:${binding.roleRef}`);
    roleBindingTargets.add(target);
  }
  const membershipRefs = new Set(roleBindings.flatMap((binding) => binding.membershipRef === undefined ? [] : [binding.membershipRef]));
  for (const permission of permissions) {
    const membershipRef = permission.context?.membershipRef;
    if (membershipRef !== undefined && !membershipRefs.has(membershipRef)) throw new Error(`COMPILER_AUTHORITY_PROJECTION_UNKNOWN_MEMBERSHIP_REFERENCE:${membershipRef}`);
  }

  return Object.freeze({
    kind: "RuntimeAuthorityProjection",
    roleBindings: Object.freeze(roleBindings),
    permissions: Object.freeze(permissions),
    policies: Object.freeze(policies),
    views: Object.freeze(views),
  });
}
