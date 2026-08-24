export type RuntimeGeneratedViewKind = "list" | "detail" | "form" | "dashboard" | "timeline" | "kanban" | "calendar" | "custom";

export type RuntimeGeneratedBindingEntity = Readonly<{
  id: string;
  fields: readonly Readonly<{ name: string; type: string; required: boolean }>[];
}>;

export type RuntimeGeneratedBindingAction = Readonly<{
  id: string;
  effect?: Readonly<{ kind: string; entityRef: string }>;
}>;

export type RuntimeGeneratedBindingView = Readonly<{
  id: string;
  kind?: RuntimeGeneratedViewKind;
  binding?: Readonly<{
    entityRef: string;
    fieldRefs?: readonly string[];
    actionRefs?: readonly string[];
  }>;
}>;

export type RuntimeGeneratedBindingModel = Readonly<{
  entities: readonly RuntimeGeneratedBindingEntity[];
  actions: readonly RuntimeGeneratedBindingAction[];
  views?: readonly RuntimeGeneratedBindingView[];
}>;

export type RuntimeGeneratedFieldBinding = Readonly<{
  fieldRef: string;
  type: string;
  required: boolean;
}>;

export type RuntimeGeneratedActionBinding = Readonly<{
  actionRef: string;
}>;

export type RuntimeGeneratedViewBinding = Readonly<{
  viewRef: string;
  entityRef: string;
  fields: readonly RuntimeGeneratedFieldBinding[];
  actions: readonly RuntimeGeneratedActionBinding[];
}>;

export type RuntimeGeneratedViewBindings = Readonly<{
  kind: "RuntimeGeneratedViewBindings";
  bindings: readonly RuntimeGeneratedViewBinding[];
}>;

function uniqueBy<T>(items: readonly T[], key: (item: T) => string, code: string): Map<string, T> {
  const result = new Map<string, T>();
  for (const item of items) {
    const id = key(item);
    if (result.has(id)) throw new Error(`${code}:${id}`);
    result.set(id, item);
  }
  return result;
}

function explicitRefs(values: readonly string[] | undefined, code: string, detail: string): readonly string[] {
  const refs = [...(values ?? [])];
  const seen = new Set<string>();
  for (const ref of refs) {
    if (seen.has(ref)) throw new Error(`${code}:${detail}:${ref}`);
    seen.add(ref);
  }
  return Object.freeze(refs.sort((left, right) => left.localeCompare(right)));
}

export function materializeRuntimeGeneratedViewBindings(
  model: RuntimeGeneratedBindingModel,
): RuntimeGeneratedViewBindings {
  const entities = uniqueBy(model.entities, (entity) => entity.id, "RUNTIME_GENERATED_BINDING_AMBIGUOUS_ENTITY");
  const actions = uniqueBy(model.actions, (action) => action.id, "RUNTIME_GENERATED_BINDING_AMBIGUOUS_ACTION");
  const views = uniqueBy(model.views ?? [], (view) => view.id, "RUNTIME_GENERATED_BINDING_AMBIGUOUS_VIEW");

  const bindings: RuntimeGeneratedViewBinding[] = [];
  for (const view of [...views.values()].sort((left, right) => left.id.localeCompare(right.id))) {
    if (view.binding === undefined) continue;
    const entity = entities.get(view.binding.entityRef);
    if (entity === undefined) {
      throw new Error(`RUNTIME_GENERATED_BINDING_UNKNOWN_ENTITY:${view.id}:${view.binding.entityRef}`);
    }

    const entityFields = uniqueBy(
      entity.fields,
      (field) => field.name,
      `RUNTIME_GENERATED_BINDING_AMBIGUOUS_FIELD:${entity.id}`,
    );
    const fieldRefs = explicitRefs(
      view.binding.fieldRefs,
      "RUNTIME_GENERATED_BINDING_AMBIGUOUS_FIELD_REFERENCE",
      view.id,
    );
    const actionRefs = explicitRefs(
      view.binding.actionRefs,
      "RUNTIME_GENERATED_BINDING_AMBIGUOUS_ACTION_REFERENCE",
      view.id,
    );

    const fields = fieldRefs.map((fieldRef) => {
      const field = entityFields.get(fieldRef);
      if (field === undefined) {
        throw new Error(`RUNTIME_GENERATED_BINDING_UNKNOWN_FIELD:${view.id}:${entity.id}:${fieldRef}`);
      }
      return Object.freeze({ fieldRef, type: field.type, required: field.required });
    });

    const actionBindings = actionRefs.map((actionRef) => {
      if (!actions.has(actionRef)) {
        throw new Error(`RUNTIME_GENERATED_BINDING_UNKNOWN_ACTION:${view.id}:${actionRef}`);
      }
      return Object.freeze({ actionRef });
    });

    bindings.push(Object.freeze({
      viewRef: view.id,
      entityRef: entity.id,
      fields: Object.freeze(fields),
      actions: Object.freeze(actionBindings),
    }));
  }

  return Object.freeze({
    kind: "RuntimeGeneratedViewBindings",
    bindings: Object.freeze(bindings),
  });
}
