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
  /** Inert display override for admitted installed buttons; never action/HTML authority. */
  readonly text?: string;
  readonly placement?: CompositionNodePlacement;
}

export interface CompositionGraph {
  readonly rootRef: CompositionNodeRef;
  readonly nodes: readonly CompositionNode[];
}

export function defineCompositionGraph(graph: CompositionGraph): CompositionGraph {
  return graph;
}

/** Bounded plain display data. No trimming/normalization: accepted text round-trips exactly. */
export function validButtonDisplayText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && [...value].length <= 256 &&
    !/[\p{Cc}\uD800-\uDFFF]/u.test(value);
}
export function supportsButtonDisplayText(componentRef: string): boolean {
  return componentRef === "component:button" || componentRef === "component:lab-button";
}
