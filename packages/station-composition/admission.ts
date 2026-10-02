import type { ComponentRegistry } from "./registry.js";
import type { ComponentDescriptor } from "./types.js";
import { validateCompositionPlacement } from "./validation.js";

export interface InspectorFieldSchema {
  readonly id: string;
  readonly label: string;
  readonly readOnly?: boolean;
}

export interface ComponentAdmissionSchema {
  readonly componentRef: string;
  readonly variants: readonly string[];
  readonly inspectorFields: readonly InspectorFieldSchema[];
}

export interface CompositionAdmissionRequest {
  readonly parentRef: string;
  readonly componentRef: string;
  readonly slotId: string;
  readonly columnSpan: number;
  readonly rowSpan: number;
  readonly variant: string;
  readonly inspectorFieldIds: readonly string[];
}

export interface AdmittedCompositionContract {
  readonly parent: ComponentDescriptor;
  readonly component: ComponentDescriptor;
  readonly slotId: string;
  readonly columnSpan: number;
  readonly rowSpan: number;
  readonly variant: string;
  readonly inspectorFields: readonly InspectorFieldSchema[];
}

function token(value: string, label: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) throw new Error(`${label} must be a non-empty token`);
  return normalized;
}

function uniqueTokens(values: readonly string[], label: string): readonly string[] {
  const normalized = values.map((value) => token(value, label));
  if (new Set(normalized).size !== normalized.length) throw new Error(`${label} values must be unique`);
  return Object.freeze(normalized);
}

export function normalizeComponentAdmissionSchema(input: ComponentAdmissionSchema): ComponentAdmissionSchema {
  const componentRef = token(input.componentRef, "admission componentRef");
  const variants = uniqueTokens(input.variants, "admission variant");
  if (variants.length === 0) throw new Error("admission schema must declare at least one presentation variant");

  const fieldIds = uniqueTokens(input.inspectorFields.map((field) => field.id), "inspector field id");
  const inspectorFields = input.inspectorFields.map((field, index) => Object.freeze({
    id: fieldIds[index]!,
    label: token(field.label, "inspector field label"),
    ...(field.readOnly === undefined ? {} : { readOnly: field.readOnly }),
  }));

  return Object.freeze({ componentRef, variants, inspectorFields: Object.freeze(inspectorFields) });
}

export function resolveInspectorFields(
  schema: ComponentAdmissionSchema,
  fieldIds: readonly string[],
): readonly InspectorFieldSchema[] {
  const normalized = normalizeComponentAdmissionSchema(schema);
  const requested = uniqueTokens(fieldIds, "requested inspector field id");
  const fields = new Map(normalized.inspectorFields.map((field) => [field.id, field] as const));
  return Object.freeze(requested.map((id) => {
    const field = fields.get(id);
    if (field === undefined) throw new Error(`unknown inspector schema field: ${id}`);
    return field;
  }));
}

export function admitCompositionContract(
  registry: ComponentRegistry,
  schema: ComponentAdmissionSchema,
  request: CompositionAdmissionRequest,
): AdmittedCompositionContract {
  const normalizedSchema = normalizeComponentAdmissionSchema(schema);
  const parentRef = token(request.parentRef, "admission parentRef");
  const componentRef = token(request.componentRef, "admission componentRef");
  if (normalizedSchema.componentRef !== componentRef) throw new Error(`admission schema does not describe component: ${componentRef}`);

  const parent = registry.get(parentRef);
  if (parent === null) throw new Error(`unknown admission parent component: ${parentRef}`);
  const component = registry.get(componentRef);
  if (component === null) throw new Error(`unknown admission component: ${componentRef}`);

  const variant = token(request.variant, "admission variant");
  if (!normalizedSchema.variants.includes(variant)) throw new Error(`unsupported admission variant: ${variant}`);

  validateCompositionPlacement({
    parent,
    child: component,
    slotId: token(request.slotId, "admission slotId"),
    columnSpan: request.columnSpan,
    rowSpan: request.rowSpan,
  });

  const inspectorFields = resolveInspectorFields(normalizedSchema, request.inspectorFieldIds);
  return Object.freeze({
    parent,
    component,
    slotId: request.slotId.trim(),
    columnSpan: request.columnSpan,
    rowSpan: request.rowSpan,
    variant,
    inspectorFields,
  });
}
