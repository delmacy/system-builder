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

export type CompilerSystemDefinitionRuntimeProjection = Readonly<{
  kind: "SystemDefinitionRuntimeProjection";
  systemDefinitionRef: string;
  entities: readonly CompilerRuntimeEntity[];
  actions: readonly CompilerRuntimeAction[];
  processes: readonly CompilerRuntimeProcess[];
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

  return Object.freeze({
    kind: "SystemDefinitionRuntimeProjection",
    systemDefinitionRef: projectionRef,
    entities: Object.freeze(entities),
    actions: Object.freeze(actions),
    processes: Object.freeze(processes),
  });
}
