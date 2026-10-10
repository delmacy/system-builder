import { createCompositionDraftTransaction, type ComponentRegistry, type CompositionGraph } from "@system-builder/station-composition";
import { createCompositionArtifact } from "./artifact-codec.js";
import { acceptEditorDraft } from "./draft-boundary.js";
import type { EditorSession } from "./session.js";

export type EditorStructureIntent = Readonly<{ expectedDraftRevision: number; sessionRef: string; compositionRef: string }> & (
  | Readonly<{ type: "add-node"; nodeRef: string; componentRef: string; parentRef: string; slotRef: string }>
  | Readonly<{ type: "remove-subtree"; nodeRef: string }>
  | Readonly<{ type: "reorder-node"; nodeRef: string; direction: "before" | "after" }>);
export type EditorStructureResult =
  | Readonly<{ accepted: true; changed: boolean; session: EditorSession; selectedRef: string }>
  | Readonly<{ accepted: false; reason: "invalid-edit" | "stale-draft-revision" | "revision-overflow"; session: EditorSession }>;
/** Reuse strict codec admission (shape/connectivity/cardinality/token/node/depth/bytes) for internal graphs too. */
export function validateEditorAuthoredGraph(graph: CompositionGraph, session: EditorSession, registry: ComponentRegistry): boolean {
  return createCompositionArtifact(graph, { ...session.base, composition: session.transaction.base, registry }, {
    artifactId: "urn:system-builder:structural-validation", artifactVersion: "1.0.0",
    provenance: { createdAt: "2026-10-10T00:00:00Z", producer: { id: "urn:system-builder:station", version: "1.0.0" }, inputs: [] },
  }).accepted;
}
export function applyEditorStructure(session: EditorSession, intent: EditorStructureIntent, registry: ComponentRegistry): EditorStructureResult {
  const reject = (reason: "invalid-edit" | "stale-draft-revision" | "revision-overflow"): EditorStructureResult =>
    Object.freeze({ accepted: false, reason, session });
  try {
    if (!intent || intent.sessionRef !== session.sessionRef || intent.compositionRef !== session.base.compositionRef) return reject("invalid-edit");
    if (intent.expectedDraftRevision !== session.draftRevision) return reject("stale-draft-revision");
    if (!acceptEditorDraft(session, session.draftRevision, registry).accepted ||
        !validateEditorAuthoredGraph(session.transaction.draft, session, registry)) return reject("invalid-edit");
    const common = ["type", "expectedDraftRevision", "sessionRef", "compositionRef", "nodeRef"];
    const expected = intent.type === "add-node" ? [...common, "componentRef", "parentRef", "slotRef"] :
      intent.type === "reorder-node" ? [...common, "direction"] : intent.type === "remove-subtree" ? common : [];
    if (Reflect.ownKeys(intent).length !== expected.length || !expected.every(key => Object.hasOwn(intent, key))) return reject("invalid-edit");
    const graph = session.transaction.draft;
    let nodes = [...graph.nodes]; let selectedRef = intent.nodeRef;
    if (intent.type === "add-node") {
      const component = registry.get(intent.componentRef);
      if (!component || nodes.some(node => node.ref === intent.nodeRef) || !nodes.some(node => node.ref === intent.parentRef)) return reject("invalid-edit");
      nodes.push({ ref: intent.nodeRef, componentRef: component.id, placement: {
        parentRef: intent.parentRef, slotRef: intent.slotRef,
        columnSpan: component.constraints.recommendedColumns, rowSpan: component.constraints.recommendedRows,
      } });
    } else {
      const node = nodes.find(item => item.ref === intent.nodeRef);
      if (!node?.placement || node.ref === graph.rootRef) return reject("invalid-edit");
      if (intent.type === "remove-subtree") {
        const removed = new Set([node.ref]);
        for (let count = 0; count < nodes.length; count++) {
          let changed = false;
          for (const child of nodes) if (child.placement && removed.has(child.placement.parentRef) && !removed.has(child.ref)) {
            removed.add(child.ref); changed = true;
          }
          if (!changed) break;
        }
        nodes = nodes.filter(item => !removed.has(item.ref)); selectedRef = node.placement.parentRef;
      } else {
        if (intent.direction !== "before" && intent.direction !== "after") return reject("invalid-edit");
        const siblings = nodes.filter(item => item.placement?.parentRef === node.placement!.parentRef && item.placement?.slotRef === node.placement!.slotRef);
        const other = siblings[siblings.findIndex(item => item.ref === node.ref) + (intent.direction === "before" ? -1 : 1)];
        if (!other) return Object.freeze({ accepted: true, changed: false, session, selectedRef });
        const a = nodes.indexOf(node); const b = nodes.indexOf(other); [nodes[a], nodes[b]] = [other, node];
      }
    }
    const candidate = { rootRef: graph.rootRef, nodes };
    if (!validateEditorAuthoredGraph(candidate, session, registry)) return reject("invalid-edit");
    if (session.draftRevision === Number.MAX_SAFE_INTEGER) return reject("revision-overflow");
    const draft = createCompositionDraftTransaction(candidate, registry).draft;
    const next = Object.freeze({ ...session, draftRevision: session.draftRevision + 1,
      transaction: Object.freeze({ base: session.transaction.base, draft, findings: Object.freeze([]),
        dirty: JSON.stringify(session.transaction.base) !== JSON.stringify(draft) }) });
    if (!acceptEditorDraft(next, next.draftRevision, registry).accepted) return reject("invalid-edit");
    return Object.freeze({ accepted: true, changed: true, session: next, selectedRef });
  } catch { return reject("invalid-edit"); }
}
/** Repair only deleted selection, preferring its closest surviving ancestor. */
export function repairEditorSelection(before: CompositionGraph, after: CompositionGraph, selectedRef: string | null): string | null {
  if (selectedRef === null) return null;
  const surviving = new Set(after.nodes.map(node => node.ref));
  const seen = new Set<string>(); let ref: string | undefined = selectedRef;
  while (ref && !seen.has(ref)) {
    if (surviving.has(ref)) return ref;
    seen.add(ref); ref = before.nodes.find(node => node.ref === ref)?.placement?.parentRef;
  }
  return after.rootRef;
}
