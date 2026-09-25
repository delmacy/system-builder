import type { ComponentRegistry } from "./registry.js";
import type { CompositionGraph, CompositionNode } from "./graph.js";
import { validateCompositionGraph, type CompositionGraphFinding } from "./graph-validation.js";

export interface CompositionDraftTransaction {
  readonly base: CompositionGraph;
  readonly draft: CompositionGraph;
  readonly findings: readonly CompositionGraphFinding[];
  readonly dirty: boolean;
}

export type CompositionDraftMutation =
  | { readonly type: "replace-node"; readonly node: CompositionNode }
  | { readonly type: "remove-node"; readonly nodeRef: string };

export type CompositionDraftMutationResult =
  | { readonly ok: true; readonly transaction: CompositionDraftTransaction }
  | { readonly ok: false; readonly transaction: CompositionDraftTransaction; readonly findings: readonly CompositionGraphFinding[] };

function snapshot(graph: CompositionGraph): CompositionGraph {
  return Object.freeze({ rootRef: graph.rootRef, nodes: Object.freeze(graph.nodes.map((node) => Object.freeze({ ...node, ...(node.placement === undefined ? {} : { placement: Object.freeze({ ...node.placement }) }) }))) });
}

function sameGraph(left: CompositionGraph, right: CompositionGraph): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function createCompositionDraftTransaction(base: CompositionGraph, registry: ComponentRegistry): CompositionDraftTransaction {
  const baseSnapshot = snapshot(base);
  const findings = validateCompositionGraph(baseSnapshot, registry);
  if (findings.length > 0) throw new Error(`composition draft base must be valid: ${findings[0]?.message ?? "unknown finding"}`);
  return Object.freeze({ base: baseSnapshot, draft: snapshot(baseSnapshot), findings, dirty: false });
}

export function applyCompositionDraftMutation(transaction: CompositionDraftTransaction, mutation: CompositionDraftMutation, registry: ComponentRegistry): CompositionDraftMutationResult {
  const nodes = mutation.type === "replace-node"
    ? transaction.draft.nodes.map((node) => node.ref === mutation.node.ref ? mutation.node : node)
    : transaction.draft.nodes.filter((node) => node.ref !== mutation.nodeRef);
  if (mutation.type === "replace-node" && !transaction.draft.nodes.some((node) => node.ref === mutation.node.ref)) nodes.push(mutation.node);
  const candidate = snapshot({ rootRef: transaction.draft.rootRef, nodes });
  const findings = validateCompositionGraph(candidate, registry);
  if (findings.length > 0) return Object.freeze({ ok: false, transaction, findings });
  return Object.freeze({ ok: true, transaction: Object.freeze({ base: transaction.base, draft: candidate, findings, dirty: !sameGraph(transaction.base, candidate) }) });
}

export function discardCompositionDraft(transaction: CompositionDraftTransaction): CompositionDraftTransaction {
  return Object.freeze({ base: transaction.base, draft: snapshot(transaction.base), findings: Object.freeze([]), dirty: false });
}

export function projectCompositionPreview(transaction: CompositionDraftTransaction): CompositionGraph {
  return snapshot(transaction.draft);
}
