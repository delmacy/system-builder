import {
  materializeRuntimeGeneratedViewBindings,
  type RuntimeGeneratedBindingModel,
  type RuntimeGeneratedViewKind,
} from "./generated-view-bindings.js";

export type RuntimeGeneratedRenderField = Readonly<{
  fieldRef: string;
  type: string;
  required: boolean;
  value: unknown;
}>;

export type RuntimeGeneratedRenderAction = Readonly<{
  actionRef: string;
}>;

export type RuntimeGeneratedViewDocument = Readonly<{
  kind: "RuntimeGeneratedViewDocument";
  viewRef: string;
  viewKind: RuntimeGeneratedViewKind;
  entityRef: string;
  fields: readonly RuntimeGeneratedRenderField[];
  actions: readonly RuntimeGeneratedRenderAction[];
}>;

export type RuntimeGeneratedViewDocumentInput = Readonly<{
  model: RuntimeGeneratedBindingModel;
  viewRef: string;
  record: Readonly<Record<string, unknown>>;
}>;

const supportedViewKinds = new Set<RuntimeGeneratedViewKind>([
  "list",
  "detail",
  "form",
  "dashboard",
  "timeline",
  "kanban",
  "calendar",
  "custom",
]);

function explicitToken(value: string, field: string): string {
  const token = value.trim();
  if (token.length === 0) throw new Error(`RUNTIME_GENERATED_RENDER_INVALID_${field.toUpperCase()}`);
  return token;
}

export function materializeRuntimeGeneratedViewDocument(
  input: RuntimeGeneratedViewDocumentInput,
): RuntimeGeneratedViewDocument {
  const viewRef = explicitToken(input.viewRef, "view_ref");
  const views = [...(input.model.views ?? [])];
  const matchingViews = views.filter((view) => view.id === viewRef);
  if (matchingViews.length !== 1) {
    throw new Error(
      matchingViews.length === 0
        ? `RUNTIME_GENERATED_RENDER_UNKNOWN_VIEW:${viewRef}`
        : `RUNTIME_GENERATED_BINDING_AMBIGUOUS_VIEW:${viewRef}`,
    );
  }

  const view = matchingViews[0];
  if (view === undefined || view.binding === undefined) {
    throw new Error(`RUNTIME_GENERATED_RENDER_VIEW_NOT_BOUND:${viewRef}`);
  }
  if (view.kind === undefined || !supportedViewKinds.has(view.kind)) {
    throw new Error(`RUNTIME_GENERATED_RENDER_INVALID_VIEW_KIND:${viewRef}`);
  }

  const bindings = materializeRuntimeGeneratedViewBindings(input.model);
  const binding = bindings.bindings.find((candidate) => candidate.viewRef === viewRef);
  if (binding === undefined) throw new Error(`RUNTIME_GENERATED_RENDER_VIEW_NOT_BOUND:${viewRef}`);

  const fields = binding.fields.map((field) => Object.freeze({
    fieldRef: field.fieldRef,
    type: field.type,
    required: field.required,
    value: Object.prototype.hasOwnProperty.call(input.record, field.fieldRef)
      ? input.record[field.fieldRef]
      : null,
  }));
  const actions = binding.actions.map((action) => Object.freeze({ actionRef: action.actionRef }));

  return Object.freeze({
    kind: "RuntimeGeneratedViewDocument",
    viewRef,
    viewKind: view.kind,
    entityRef: binding.entityRef,
    fields: Object.freeze(fields),
    actions: Object.freeze(actions),
  });
}
