import type { ComponentRegistry } from "./registry.js";
import type { CompositionGraph } from "./graph.js";
import type { CompositionGraphFinding } from "./graph-validation.js";
import {
  applyCompositionDraftMutation,
  createCompositionDraftTransaction,
  discardCompositionDraft,
  projectCompositionPreview,
  type CompositionDraftMutation,
  type CompositionDraftTransaction,
} from "./draft-transaction.js";

export interface CompositionEditorState {
  readonly transaction: CompositionDraftTransaction;
  readonly selectedNodeRef?: string;
}

export type CompositionEditorMutationResult =
  | { readonly ok: true; readonly state: CompositionEditorState }
  | { readonly ok: false; readonly state: CompositionEditorState; readonly findings: readonly CompositionGraphFinding[] };

function hasNode(graph: CompositionGraph, nodeRef: string): boolean {
  return graph.nodes.some((node) => node.ref === nodeRef);
}

export function createCompositionEditorState(base: CompositionGraph, registry: ComponentRegistry): CompositionEditorState {
  return Object.freeze({ transaction: createCompositionDraftTransaction(base, registry) });
}

export function selectCompositionEditorNode(state: CompositionEditorState, nodeRef?: string): CompositionEditorState {
  const selectedNodeRef = nodeRef !== undefined && hasNode(state.transaction.draft, nodeRef) ? nodeRef : undefined;
  return Object.freeze({ transaction: state.transaction, ...(selectedNodeRef === undefined ? {} : { selectedNodeRef }) });
}

export function mutateCompositionEditor(
  state: CompositionEditorState,
  mutation: CompositionDraftMutation,
  registry: ComponentRegistry,
): CompositionEditorMutationResult {
  const result = applyCompositionDraftMutation(state.transaction, mutation, registry);
  if (!result.ok) return Object.freeze({ ok: false, state, findings: result.findings });
  const selectedNodeRef = state.selectedNodeRef !== undefined && hasNode(result.transaction.draft, state.selectedNodeRef)
    ? state.selectedNodeRef
    : undefined;
  return Object.freeze({
    ok: true,
    state: Object.freeze({ transaction: result.transaction, ...(selectedNodeRef === undefined ? {} : { selectedNodeRef }) }),
  });
}

export function discardCompositionEditorDraft(state: CompositionEditorState): CompositionEditorState {
  const transaction = discardCompositionDraft(state.transaction);
  const selectedNodeRef = state.selectedNodeRef !== undefined && hasNode(transaction.draft, state.selectedNodeRef)
    ? state.selectedNodeRef
    : undefined;
  return Object.freeze({ transaction, ...(selectedNodeRef === undefined ? {} : { selectedNodeRef }) });
}

export function projectCompositionEditorPreview(state: CompositionEditorState): CompositionGraph {
  return projectCompositionPreview(state.transaction);
}
