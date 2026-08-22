export type RuntimeActionModel = Readonly<{
  id: string;
  effect?: Readonly<{
    kind: "entity.create" | "entity.update" | "entity.delete";
    entityRef: string;
  }>;
}>;

export type RuntimeActionEntity = Readonly<{ id: string }>;

export function resolveRuntimeAction(
  actions: readonly RuntimeActionModel[],
  entities: readonly RuntimeActionEntity[],
  actionId: string,
): Readonly<
  | { ok: true; action: RuntimeActionModel & { effect: NonNullable<RuntimeActionModel["effect"]> }; entity: RuntimeActionEntity }
  | { ok: false; code: string; detail: string }
> {
  const action = actions.find((candidate) => candidate.id === actionId);
  if (!action) return Object.freeze({ ok: false, code: "RUNTIME_ACTION_UNKNOWN", detail: actionId });
  if (!action.effect) return Object.freeze({ ok: false, code: "RUNTIME_ACTION_UNSUPPORTED", detail: actionId });
  const entity = entities.find((candidate) => candidate.id === action.effect!.entityRef);
  if (!entity) return Object.freeze({ ok: false, code: "RUNTIME_ACTION_INVALID_TARGET", detail: action.effect.entityRef });
  return Object.freeze({ ok: true, action: action as RuntimeActionModel & { effect: NonNullable<RuntimeActionModel["effect"]> }, entity });
}
