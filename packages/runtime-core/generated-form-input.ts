import type { RuntimeGeneratedViewDocument } from "./generated-view-document.js";

export type RuntimeGeneratedFormInputEntry = Readonly<{
  fieldRef: string;
  value: unknown;
}>;

export type RuntimeGeneratedFormInputReason = Readonly<{
  code: "DUPLICATE_FIELD" | "UNBOUND_FIELD" | "MISSING_REQUIRED_FIELD";
  fieldRef: string;
}>;

export type RuntimeGeneratedFormInputAccepted = Readonly<{
  kind: "RuntimeGeneratedFormInputAccepted";
  ok: true;
  viewRef: string;
  entityRef: string;
  values: readonly RuntimeGeneratedFormInputEntry[];
}>;

export type RuntimeGeneratedFormInputRejected = Readonly<{
  kind: "RuntimeGeneratedFormInputRejected";
  ok: false;
  viewRef: string;
  entityRef: string;
  reasons: readonly RuntimeGeneratedFormInputReason[];
}>;

export type RuntimeGeneratedFormInputResult = RuntimeGeneratedFormInputAccepted | RuntimeGeneratedFormInputRejected;

function token(value: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) throw new Error("RUNTIME_GENERATED_FORM_INVALID_FIELD_REF");
  return normalized;
}

function reasonOrder(left: RuntimeGeneratedFormInputReason, right: RuntimeGeneratedFormInputReason): number {
  return left.fieldRef.localeCompare(right.fieldRef) || left.code.localeCompare(right.code);
}

export function validateRuntimeGeneratedFormInput(input: Readonly<{
  document: RuntimeGeneratedViewDocument;
  entries: readonly RuntimeGeneratedFormInputEntry[];
}>): RuntimeGeneratedFormInputResult {
  const boundFields = new Map(input.document.fields.map((field) => [field.fieldRef, field] as const));
  const counts = new Map<string, number>();
  const normalizedEntries = input.entries.map((entry) => Object.freeze({ fieldRef: token(entry.fieldRef), value: entry.value }));

  for (const entry of normalizedEntries) counts.set(entry.fieldRef, (counts.get(entry.fieldRef) ?? 0) + 1);

  const reasons: RuntimeGeneratedFormInputReason[] = [];
  for (const [fieldRef, count] of counts) {
    if (count > 1) reasons.push(Object.freeze({ code: "DUPLICATE_FIELD", fieldRef }));
    if (!boundFields.has(fieldRef)) reasons.push(Object.freeze({ code: "UNBOUND_FIELD", fieldRef }));
  }
  for (const field of input.document.fields) {
    if (field.required && !counts.has(field.fieldRef)) {
      reasons.push(Object.freeze({ code: "MISSING_REQUIRED_FIELD", fieldRef: field.fieldRef }));
    }
  }

  if (reasons.length > 0) {
    return Object.freeze({
      kind: "RuntimeGeneratedFormInputRejected",
      ok: false,
      viewRef: input.document.viewRef,
      entityRef: input.document.entityRef,
      reasons: Object.freeze(reasons.sort(reasonOrder)),
    });
  }

  const values = normalizedEntries
    .map((entry) => Object.freeze({ fieldRef: entry.fieldRef, value: entry.value }))
    .sort((left, right) => left.fieldRef.localeCompare(right.fieldRef));

  return Object.freeze({
    kind: "RuntimeGeneratedFormInputAccepted",
    ok: true,
    viewRef: input.document.viewRef,
    entityRef: input.document.entityRef,
    values: Object.freeze(values),
  });
}
