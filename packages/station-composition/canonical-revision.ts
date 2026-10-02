import type { ComponentRegistry } from "./registry.js";
import {
  applyCompositionDraftMutation,
  createCompositionDraftTransaction,
  type CompositionDraftMutation,
  type CompositionDraftTransaction,
} from "./draft-transaction.js";
import type { CompositionGraphFinding } from "./graph-validation.js";
import type { CompositionGraph } from "./graph.js";

export type CompositionProjectionKind = "inspector" | "layers" | "graph" | "source-yaml" | "preview";

export interface CanonicalCompositionState {
  readonly revision: number;
  readonly transaction: CompositionDraftTransaction;
}

export interface CompositionProjection<T> {
  readonly kind: CompositionProjectionKind;
  readonly revision: number;
  readonly value: T;
}

export type CanonicalMutationResult =
  | { readonly ok: true; readonly changed: boolean; readonly state: CanonicalCompositionState }
  | { readonly ok: false; readonly reason: "stale-revision"; readonly state: CanonicalCompositionState }
  | { readonly ok: false; readonly reason: "validation"; readonly state: CanonicalCompositionState; readonly findings: readonly CompositionGraphFinding[] };

function sameDraft(left: CompositionDraftTransaction, right: CompositionDraftTransaction): boolean {
  return JSON.stringify(left.draft) === JSON.stringify(right.draft);
}

export function createCanonicalCompositionState(
  base: CompositionGraph,
  registry: ComponentRegistry,
  revision = 0,
): CanonicalCompositionState {
  if (!Number.isSafeInteger(revision) || revision < 0) throw new Error("canonical composition revision must be a non-negative safe integer");
  return Object.freeze({ revision, transaction: createCompositionDraftTransaction(base, registry) });
}

export function applyCanonicalCompositionMutation(
  state: CanonicalCompositionState,
  expectedRevision: number,
  mutation: CompositionDraftMutation,
  registry: ComponentRegistry,
): CanonicalMutationResult {
  if (expectedRevision !== state.revision) return Object.freeze({ ok: false, reason: "stale-revision", state });
  const result = applyCompositionDraftMutation(state.transaction, mutation, registry);
  if (!result.ok) return Object.freeze({ ok: false, reason: "validation", state, findings: result.findings });
  if (sameDraft(state.transaction, result.transaction)) return Object.freeze({ ok: true, changed: false, state });
  const next = Object.freeze({ revision: state.revision + 1, transaction: result.transaction });
  return Object.freeze({ ok: true, changed: true, state: next });
}

export function projectCanonicalComposition<T>(
  state: CanonicalCompositionState,
  kind: CompositionProjectionKind,
  derive: (transaction: CompositionDraftTransaction) => T,
): CompositionProjection<T> {
  return Object.freeze({ kind, revision: state.revision, value: derive(state.transaction) });
}

export function isCompositionProjectionCurrent(
  state: CanonicalCompositionState,
  projection: Pick<CompositionProjection<unknown>, "revision">,
): boolean {
  return projection.revision === state.revision;
}