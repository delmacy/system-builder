export type CompilerRuntimeField = Readonly<{
  name: string;
  type: "string" | "number" | "boolean" | "date" | "datetime" | "json" | "reference";
  required?: boolean;
  referenceEntity?: string;
}>;

export type CompilerRuntimeEntity = Readonly<{
  id: string;
  fields: readonly CompilerRuntimeField[];
}>;

export type CompilerRuntimeAction = Readonly<{
  id: string;
  effect?: Readonly<{
    kind: "entity.create" | "entity.update" | "entity.delete";
    entityRef: string;
  }>;
}>;

export type CompilerRuntimeTransition = Readonly<{
  id: string;
  from: string;
  to: string;
  actionRef?: string;
}>;

export type CompilerRuntimeProcess = Readonly<{
  id: string;
  states: readonly string[];
  initialState?: string;
  transitions?: readonly CompilerRuntimeTransition[];
}>;

export type CompilerRuntimeEnvironmentRequirement = Readonly<{
  name: string;
  kind: "config" | "secret-reference" | "external-service" | "storage" | "database";
  required: boolean;
}>;

export type CompilerRuntimeJob = Readonly<{
  id: string;
  trigger: Readonly<{ kind: "interval"; intervalMs: number }>;
  actionRef: string;
  recordId: string;
}>;

export type CompilerRuntimeEvent = Readonly<{
  id: string;
  source: Readonly<{ kind: "runtime-http" }>;
  actionRef: string;
}>;

export type CompilerRuntimeFile = Readonly<{
  id: string;
  bindingRef: string;
  operations: readonly ("put" | "get" | "delete")[];
}>;

export type CompilerRuntimeIntegration = Readonly<{
  id: string;
  invocation?: Readonly<{
    kind: "http";
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    path: string;
    bindingRef: string;
  }>;
}>;

export type CompilerSystemDefinitionRuntimeProjection = Readonly<{
  kind: "SystemDefinitionRuntimeProjection";
  systemDefinitionRef: string;
  entities: readonly CompilerRuntimeEntity[];
  actions: readonly CompilerRuntimeAction[];
  processes: readonly CompilerRuntimeProcess[];
  environmentRequirements?: readonly CompilerRuntimeEnvironmentRequirement[];
  jobs?: readonly CompilerRuntimeJob[];
  events?: readonly CompilerRuntimeEvent[];
  files?: readonly CompilerRuntimeFile[];
  integrations?: readonly CompilerRuntimeIntegration[];
}>;

function token(value: string, field: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) throw new Error(`COMPILER_RUNTIME_PROJECTION_INVALID_${field.toUpperCase()}`);
  return normalized;
}

function uniqueById<T extends Readonly<{ id: string }>>(items: readonly T[], kind: string): readonly T[] {
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.id)) throw new Error(`COMPILER_RUNTIME_PROJECTION_DUPLICATE_${kind}:${item.id}`);
    seen.add(item.id);
  }
  return items;
}

function normalizeEnvironmentRequirements(
  requirements: readonly CompilerRuntimeEnvironmentRequirement[] | undefined,
): readonly CompilerRuntimeEnvironmentRequirement[] {
  const normalized = (requirements ?? []).map((requirement) => Object.freeze({
    name: token(requirement.name, "environment_requirement_name"),
    kind: requirement.kind,
    required: requirement.required,
  })).sort((left, right) => left.name.localeCompare(right.name) || left.kind.localeCompare(right.kind));
  const seen = new Set<string>();
  for (const requirement of normalized) {
    if (seen.has(requirement.name)) throw new Error(`COMPILER_RUNTIME_PROJECTION_DUPLICATE_ENVIRONMENT_REQUIREMENT:${requirement.name}`);
    seen.add(requirement.name);
  }
  return Object.freeze(normalized);
}

function requireBinding(
  requirements: readonly CompilerRuntimeEnvironmentRequirement[],
  bindingRef: string,
  expectedKind: "storage" | "external-service",
): string {
  const reference = token(bindingRef, "binding_ref");
  const requirement = requirements.find((candidate) => candidate.name === reference);
  if (!requirement) throw new Error(`COMPILER_RUNTIME_PROJECTION_UNKNOWN_BINDING_REFERENCE:${reference}`);
  if (requirement.kind !== expectedKind) throw new Error(`COMPILER_RUNTIME_PROJECTION_INCOMPATIBLE_BINDING:${reference}:${requirement.kind}`);
  if (!requirement.required) throw new Error(`COMPILER_RUNTIME_PROJECTION_OPTIONAL_EXECUTION_BINDING:${reference}`);
  return reference;
}

export function normalizeSystemDefinitionRuntimeProjection(
  expectedSystemDefinitionRef: string,
  projection: CompilerSystemDefinitionRuntimeProjection,
): CompilerSystemDefinitionRuntimeProjection {
  const expectedRef = token(expectedSystemDefinitionRef, "system_definition_ref");
  if (projection.kind !== "SystemDefinitionRuntimeProjection") throw new Error("COMPILER_RUNTIME_PROJECTION_INVALID_KIND");
  const projectionRef = token(projection.systemDefinitionRef, "system_definition_ref");
  if (projectionRef !== expectedRef) throw new Error(`COMPILER_RUNTIME_PROJECTION_REFERENCE_MISMATCH:${projectionRef}`);

  const entities = uniqueById(
    projection.entities.map((entity) => Object.freeze({
      id: token(entity.id, "entity_id"),
      fields: Object.freeze(entity.fields.map((field) => Object.freeze({
        name: token(field.name, "field_name"),
        type: field.type,
        ...(field.required === undefined ? {} : { required: field.required }),
        ...(field.referenceEntity === undefined ? {} : { referenceEntity: token(field.referenceEntity, "reference_entity") }),
      })).sort((left, right) => left.name.localeCompare(right.name))),
    })).sort((left, right) => left.id.localeCompare(right.id)),
    "ENTITY",
  );
  const entityIds = new Set(entities.map((entity) => entity.id));
  for (const entity of entities) {
    const fieldNames = new Set<string>();
    for (const field of entity.fields) {
      if (fieldNames.has(field.name)) throw new Error(`COMPILER_RUNTIME_PROJECTION_DUPLICATE_FIELD:${entity.id}:${field.name}`);
      fieldNames.add(field.name);
      if (field.type === "reference" && field.referenceEntity !== undefined && !entityIds.has(field.referenceEntity)) {
        throw new Error(`COMPILER_RUNTIME_PROJECTION_UNKNOWN_ENTITY_REFERENCE:${field.referenceEntity}`);
      }
    }
  }

  const actions = uniqueById(
    projection.actions.map((action) => Object.freeze({
      id: token(action.id, "action_id"),
      ...(action.effect === undefined ? {} : { effect: Object.freeze({ kind: action.effect.kind, entityRef: token(action.effect.entityRef, "action_entity_ref") }) }),
    })).sort((left, right) => left.id.localeCompare(right.id)),
    "ACTION",
  );
  const actionIds = new Set(actions.map((action) => action.id));
  for (const action of actions) {
    if (action.effect !== undefined && !entityIds.has(action.effect.entityRef)) throw new Error(`COMPILER_RUNTIME_PROJECTION_UNKNOWN_ACTION_ENTITY:${action.effect.entityRef}`);
  }

  const processes = uniqueById(
    projection.processes.map((process) => {
      const processId = token(process.id, "process_id");
      const states = [...process.states].map((state) => token(state, "process_state")).sort((left, right) => left.localeCompare(right));
      if (new Set(states).size !== states.length) throw new Error(`COMPILER_RUNTIME_PROJECTION_DUPLICATE_STATE:${processId}`);
      const stateSet = new Set(states);
      const initialState = process.initialState === undefined ? undefined : token(process.initialState, "initial_state");
      const transitions = (process.transitions ?? []).map((transition) => Object.freeze({
        id: token(transition.id, "transition_id"),
        from: token(transition.from, "transition_from"),
        to: token(transition.to, "transition_to"),
        ...(transition.actionRef === undefined ? {} : { actionRef: token(transition.actionRef, "transition_action_ref") }),
      })).sort((left, right) => left.id.localeCompare(right.id));
      uniqueById(transitions, "TRANSITION");
      if (transitions.length > 0 && initialState === undefined) throw new Error(`COMPILER_RUNTIME_PROJECTION_INITIAL_STATE_REQUIRED:${processId}`);
      if (initialState !== undefined && !stateSet.has(initialState)) throw new Error(`COMPILER_RUNTIME_PROJECTION_UNKNOWN_INITIAL_STATE:${processId}:${initialState}`);
      for (const transition of transitions) {
        if (!stateSet.has(transition.from) || !stateSet.has(transition.to)) throw new Error(`COMPILER_RUNTIME_PROJECTION_UNKNOWN_TRANSITION_STATE:${processId}:${transition.id}`);
        if (transition.actionRef !== undefined && !actionIds.has(transition.actionRef)) throw new Error(`COMPILER_RUNTIME_PROJECTION_UNKNOWN_TRANSITION_ACTION:${transition.actionRef}`);
      }
      return Object.freeze({
        id: processId,
        states: Object.freeze(states),
        ...(initialState === undefined ? {} : { initialState }),
        ...(transitions.length === 0 ? {} : { transitions: Object.freeze(transitions) }),
      });
    }).sort((left, right) => left.id.localeCompare(right.id)),
    "PROCESS",
  );

  const environmentRequirements = normalizeEnvironmentRequirements(projection.environmentRequirements);

  const jobs = uniqueById(
    (projection.jobs ?? []).map((job) => {
      const id = token(job.id, "job_id");
      const actionRef = token(job.actionRef, "job_action_ref");
      if (!actionIds.has(actionRef)) throw new Error(`COMPILER_RUNTIME_PROJECTION_UNKNOWN_JOB_ACTION:${actionRef}`);
      if (job.trigger.kind !== "interval" || !Number.isInteger(job.trigger.intervalMs) || job.trigger.intervalMs <= 0) {
        throw new Error(`COMPILER_RUNTIME_PROJECTION_INVALID_JOB_TRIGGER:${id}`);
      }
      return Object.freeze({ id, trigger: Object.freeze({ kind: "interval" as const, intervalMs: job.trigger.intervalMs }), actionRef, recordId: token(job.recordId, "job_record_id") });
    }).sort((left, right) => left.id.localeCompare(right.id)),
    "JOB",
  );

  const events = uniqueById(
    (projection.events ?? []).map((event) => {
      const id = token(event.id, "event_id");
      const actionRef = token(event.actionRef, "event_action_ref");
      if (!actionIds.has(actionRef)) throw new Error(`COMPILER_RUNTIME_PROJECTION_UNKNOWN_EVENT_ACTION:${actionRef}`);
      if (event.source.kind !== "runtime-http") throw new Error(`COMPILER_RUNTIME_PROJECTION_INVALID_EVENT_SOURCE:${id}`);
      return Object.freeze({ id, source: Object.freeze({ kind: "runtime-http" as const }), actionRef });
    }).sort((left, right) => left.id.localeCompare(right.id)),
    "EVENT",
  );

  const files = uniqueById(
    (projection.files ?? []).map((file) => {
      const id = token(file.id, "file_id");
      const bindingRef = requireBinding(environmentRequirements, file.bindingRef, "storage");
      const operations = [...file.operations].sort((left, right) => left.localeCompare(right));
      if (operations.length === 0 || new Set(operations).size !== operations.length) throw new Error(`COMPILER_RUNTIME_PROJECTION_INVALID_FILE_OPERATIONS:${id}`);
      return Object.freeze({ id, bindingRef, operations: Object.freeze(operations) });
    }).sort((left, right) => left.id.localeCompare(right.id)),
    "FILE",
  );

  const integrations = uniqueById(
    (projection.integrations ?? []).map((integration) => {
      const id = token(integration.id, "integration_id");
      if (integration.invocation === undefined) return Object.freeze({ id });
      if (integration.invocation.kind !== "http") throw new Error(`COMPILER_RUNTIME_PROJECTION_INVALID_INTEGRATION_KIND:${id}`);
      const path = token(integration.invocation.path, "integration_path");
      if (!path.startsWith("/") || path.startsWith("//")) throw new Error(`COMPILER_RUNTIME_PROJECTION_INVALID_INTEGRATION_PATH:${id}`);
      return Object.freeze({
        id,
        invocation: Object.freeze({
          kind: "http" as const,
          method: integration.invocation.method,
          path,
          bindingRef: requireBinding(environmentRequirements, integration.invocation.bindingRef, "external-service"),
        }),
      });
    }).sort((left, right) => left.id.localeCompare(right.id)),
    "INTEGRATION",
  );

  return Object.freeze({
    kind: "SystemDefinitionRuntimeProjection",
    systemDefinitionRef: projectionRef,
    entities: Object.freeze(entities),
    actions: Object.freeze(actions),
    processes: Object.freeze(processes),
    ...(projection.environmentRequirements === undefined ? {} : { environmentRequirements }),
    ...(projection.jobs === undefined ? {} : { jobs: Object.freeze(jobs) }),
    ...(projection.events === undefined ? {} : { events: Object.freeze(events) }),
    ...(projection.files === undefined ? {} : { files: Object.freeze(files) }),
    ...(projection.integrations === undefined ? {} : { integrations: Object.freeze(integrations) }),
  });
}
