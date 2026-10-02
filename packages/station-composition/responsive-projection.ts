import type { CompositionGraph, CompositionNodePlacement, CompositionNodeRef } from "./graph.js";
import type { ComponentRegistry } from "./registry.js";
import { validateCompositionGraph } from "./graph-validation.js";
import { validateCompositionPlacement } from "./validation.js";

export interface ResponsiveCondition {
  readonly minWidth?: number;
  readonly maxWidth?: number;
}

export interface ResponsivePlacementOverride {
  readonly nodeRef: CompositionNodeRef;
  readonly condition: ResponsiveCondition;
  readonly placement: CompositionNodePlacement;
}

export interface ResponsiveProjectionNode {
  readonly ref: CompositionNodeRef;
  readonly componentRef: string;
  readonly semanticOrder: number;
  readonly placement?: CompositionNodePlacement;
}

export interface ResponsiveCompositionProjection {
  readonly rootRef: CompositionNodeRef;
  readonly nodes: readonly ResponsiveProjectionNode[];
}

function assertCondition(condition: ResponsiveCondition): void {
  const { minWidth, maxWidth } = condition;
  if (minWidth !== undefined && (!Number.isFinite(minWidth) || minWidth < 0)) throw new Error("responsive minWidth must be a finite non-negative number");
  if (maxWidth !== undefined && (!Number.isFinite(maxWidth) || maxWidth < 0)) throw new Error("responsive maxWidth must be a finite non-negative number");
  if (minWidth !== undefined && maxWidth !== undefined && minWidth > maxWidth) throw new Error("responsive condition range is malformed");
}

function overlaps(a: ResponsiveCondition, b: ResponsiveCondition): boolean {
  const aMin = a.minWidth ?? Number.NEGATIVE_INFINITY;
  const aMax = a.maxWidth ?? Number.POSITIVE_INFINITY;
  const bMin = b.minWidth ?? Number.NEGATIVE_INFINITY;
  const bMax = b.maxWidth ?? Number.POSITIVE_INFINITY;
  return Math.max(aMin, bMin) <= Math.min(aMax, bMax);
}

function matches(condition: ResponsiveCondition, width: number): boolean {
  return (condition.minWidth === undefined || width >= condition.minWidth) && (condition.maxWidth === undefined || width <= condition.maxWidth);
}

export function projectResponsiveComposition(
  graph: CompositionGraph,
  registry: ComponentRegistry,
  width: number,
  overrides: readonly ResponsivePlacementOverride[],
): ResponsiveCompositionProjection {
  if (!Number.isFinite(width) || width < 0) throw new Error("responsive width must be a finite non-negative number");
  const graphFindings = validateCompositionGraph(graph, registry);
  if (graphFindings.length > 0) throw new Error(`canonical composition graph is invalid: ${graphFindings[0]?.message ?? "unknown finding"}`);

  const byNode = new Map<CompositionNodeRef, ResponsivePlacementOverride[]>();
  for (const override of overrides) {
    assertCondition(override.condition);
    if (!graph.nodes.some((node) => node.ref === override.nodeRef)) throw new Error(`responsive override references unknown node: ${override.nodeRef}`);
    const current = byNode.get(override.nodeRef) ?? [];
    if (current.some((candidate) => overlaps(candidate.condition, override.condition))) throw new Error(`responsive conditions overlap for node: ${override.nodeRef}`);
    current.push(override);
    byNode.set(override.nodeRef, current);
  }

  const nodes = graph.nodes.map((node, semanticOrder) => {
    const applicable = (byNode.get(node.ref) ?? []).filter((candidate) => matches(candidate.condition, width));
    if (applicable.length > 1) throw new Error(`responsive projection is ambiguous for node: ${node.ref}`);
    const placement = applicable[0]?.placement ?? node.placement;
    if (placement !== undefined) {
      const parentNode = graph.nodes.find((candidate) => candidate.ref === placement.parentRef);
      const parent = parentNode === undefined ? null : registry.get(parentNode.componentRef);
      const child = registry.get(node.componentRef);
      if (parent === null || child === null) throw new Error(`responsive placement owner is unresolved for node: ${node.ref}`);
      validateCompositionPlacement({ parent, child, slotId: placement.slotRef, columnSpan: placement.columnSpan, rowSpan: placement.rowSpan });
    }
    return Object.freeze({ ref: node.ref, componentRef: node.componentRef, semanticOrder, ...(placement === undefined ? {} : { placement: Object.freeze({ ...placement }) }) });
  });

  return Object.freeze({ rootRef: graph.rootRef, nodes: Object.freeze(nodes) });
}
