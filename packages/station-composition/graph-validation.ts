import type { ComponentRegistry } from "./registry.js";
import type { CompositionGraph, CompositionNode } from "./graph.js";
import { validateCompositionPlacement } from "./validation.js";

export type CompositionGraphFindingCode =
  | "duplicate-node-ref"
  | "missing-root"
  | "root-has-placement"
  | "unknown-component-ref"
  | "dangling-parent-ref"
  | "invalid-placement";

export interface CompositionGraphFinding {
  readonly code: CompositionGraphFindingCode;
  readonly nodeRef: string;
  readonly message: string;
}

function finding(code: CompositionGraphFindingCode, nodeRef: string, message: string): CompositionGraphFinding {
  return Object.freeze({ code, nodeRef, message });
}

export function validateCompositionGraph(graph: CompositionGraph, registry: ComponentRegistry): readonly CompositionGraphFinding[] {
  const findings: CompositionGraphFinding[] = [];
  const byRef = new Map<string, CompositionNode>();
  const duplicateRefs = new Set<string>();

  for (const node of graph.nodes) {
    if (byRef.has(node.ref)) duplicateRefs.add(node.ref);
    else byRef.set(node.ref, node);
  }
  for (const ref of [...duplicateRefs].sort()) findings.push(finding("duplicate-node-ref", ref, `duplicate composition node ref: ${ref}`));

  const root = byRef.get(graph.rootRef);
  if (root === undefined) findings.push(finding("missing-root", graph.rootRef, `composition root does not exist: ${graph.rootRef}`));
  else if (root.placement !== undefined) findings.push(finding("root-has-placement", root.ref, `composition root must not have parent placement: ${root.ref}`));

  for (const node of [...graph.nodes].sort((a, b) => a.ref.localeCompare(b.ref) || a.componentRef.localeCompare(b.componentRef))) {
    const child = registry.get(node.componentRef);
    if (child === null) {
      findings.push(finding("unknown-component-ref", node.ref, `unknown component ref: ${node.componentRef}`));
      continue;
    }
    if (node.ref === graph.rootRef && node.placement === undefined) continue;
    if (node.placement === undefined) {
      findings.push(finding("dangling-parent-ref", node.ref, `non-root node has no parent placement: ${node.ref}`));
      continue;
    }
    const parentNode = byRef.get(node.placement.parentRef);
    if (parentNode === undefined) {
      findings.push(finding("dangling-parent-ref", node.ref, `unknown parent node ref: ${node.placement.parentRef}`));
      continue;
    }
    const parent = registry.get(parentNode.componentRef);
    if (parent === null) continue;
    try {
      validateCompositionPlacement({ parent, child, slotId: node.placement.slotRef, columnSpan: node.placement.columnSpan, rowSpan: node.placement.rowSpan });
    } catch (error) {
      findings.push(finding("invalid-placement", node.ref, error instanceof Error ? error.message : String(error)));
    }
  }

  return Object.freeze(findings);
}
