import type {
  FocusKind,
  FocusTarget,
  SelectionContext,
  StationInteractionContext,
} from "./types.js";

function token(value: string, label: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) throw new Error(`${label} must be non-empty`);
  return normalized;
}

export function focusTarget(kind: FocusKind, ref: string): FocusTarget {
  return Object.freeze({ kind, ref: token(ref, "focus ref") });
}

export function selectionContext(
  refs: readonly string[] = [],
  primaryRef: string | null = null,
): SelectionContext {
  const normalizedRefs = Object.freeze(
    [...new Set(refs.map((ref) => token(ref, "selection ref")))],
  );

  const normalizedPrimary =
    primaryRef === null ? null : token(primaryRef, "primary selection ref");

  if (
    normalizedPrimary !== null &&
    !normalizedRefs.includes(normalizedPrimary)
  ) {
    throw new Error("primary selection ref must be present in selection refs");
  }

  return Object.freeze({
    refs: normalizedRefs,
    primaryRef: normalizedPrimary,
  });
}

export function interactionContext(input: Readonly<{
  focus?: FocusTarget | null;
  selection?: SelectionContext;
  surfaceRef?: string | null;
}> = {}): StationInteractionContext {
  return Object.freeze({
    focus: input.focus ?? null,
    selection: input.selection ?? selectionContext(),
    surfaceRef:
      input.surfaceRef === undefined || input.surfaceRef === null
        ? null
        : token(input.surfaceRef, "surface ref"),
  });
}
