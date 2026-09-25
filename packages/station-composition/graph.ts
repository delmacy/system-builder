import type { ComponentDescriptor } from "./types.js";

export type CompositionNodeRef = string;
export type ComponentRef = ComponentDescriptor["id"];
export type CompositionSlotRef = string;

export interface CompositionNodePlacement {
  readonly parentRef: CompositionNodeRef;
  readonly slotRef: CompositionSlotRef;
  readonly columnSpan: number;
  readonly rowSpan: number;
}

export interface CompositionNode {
  readonly ref: CompositionNodeRef;
  readonly componentRef: ComponentRef;
  readonly placement?: CompositionNodePlacement;
}

export interface CompositionGraph {
  readonly rootRef: CompositionNodeRef;
  readonly nodes: readonly CompositionNode[];
}

export function defineCompositionGraph(graph: CompositionGraph): CompositionGraph {
  return graph;
}
