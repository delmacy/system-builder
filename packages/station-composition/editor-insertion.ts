import { mutateCompositionEditor, type CompositionEditorState } from "./editor-engine.js";
import type { ComponentRegistry } from "./registry.js";
import type { CompositionNode } from "./graph.js";
import type { CompositionGraphFinding } from "./graph-validation.js";

export type EditorInsertResult =
  | Readonly<{ ok: true; state: CompositionEditorState }>
  | Readonly<{ ok: false; state: CompositionEditorState; reason: string; findings?: readonly CompositionGraphFinding[] }>;

export type EditorInsertion = Readonly<{
  ref: string; componentRef: string; parentRef: string; slotRef: string;
  columnSpan: number; rowSpan: number;
}>;

/** Admission through the canonical editor draft transaction, never direct graph mutation. */
export function insertEditorComponent(state: CompositionEditorState, registry: ComponentRegistry, input: EditorInsertion): EditorInsertResult {
  const graph = state.transaction.draft;
  if (!input.ref.trim() || graph.nodes.some(node => node.ref === input.ref)) return { ok: false, state, reason: "invalid or duplicate node reference" };
  const child = registry.get(input.componentRef);
  if (child === null) return { ok: false, state, reason: "component not registered" };
  const parent = graph.nodes.find(node => node.ref === input.parentRef);
  if (!parent) return { ok: false, state, reason: "parent not found" };
  const parentDescriptor = registry.get(parent.componentRef);
  const slot = parentDescriptor?.slots.find(item => item.id === input.slotRef);
  if (!slot) return { ok: false, state, reason: "parent slot not found" };
  if (slot.childPolicy === "single" && graph.nodes.some(node => node.placement?.parentRef === input.parentRef && node.placement.slotRef === input.slotRef))
    return { ok: false, state, reason: "single-child slot already occupied" };
  const node: CompositionNode = {
    ref: input.ref, componentRef: child.id,
    placement: { parentRef: input.parentRef, slotRef: input.slotRef, columnSpan: input.columnSpan, rowSpan: input.rowSpan },
  };
  const result = mutateCompositionEditor(state, { type: "replace-node", node }, registry);
  return result.ok ? { ok: true, state: result.state } : { ok: false, state, reason: "invalid composition placement", findings: result.findings };
}
