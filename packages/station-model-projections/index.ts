import { encodeProcessContext, resolveProcessAnchor, type CompositionReference, type ProcessContextDocument, type ProcessOwnerAdapter } from "@system-builder/station-process-context";
import { createCollectionIndex, emptySelection, selectKnownRef, selectedItem } from "@system-builder/station-interaction";

export type ProjectionId = "context-outline" | "reference-table";
export type ReferenceStatus = "available" | "missing" | "stale" | "invalid" | "unavailable";
export type ProjectionCapability = "inspect" | "request-open-composition";
export interface ProjectionDescriptor {
  readonly id: ProjectionId;
  readonly title: string;
  readonly capabilities: readonly ProjectionCapability[];
}
export const INSTALLED_PROJECTIONS: readonly ProjectionDescriptor[] = Object.freeze([
  Object.freeze({ id: "context-outline" as const, title: "Context outline", capabilities: Object.freeze(["inspect", "request-open-composition"] as const) }),
  Object.freeze({ id: "reference-table" as const, title: "Reference table", capabilities: Object.freeze(["inspect", "request-open-composition"] as const) }),
]);
/** Admission of installed inert descriptors only; never invoke imported accessors/renderers. */
export function validateProjectionDescriptors(input: unknown): boolean {
  try {
    if (!Array.isArray(input) || input.length !== 2 || Object.getOwnPropertySymbols(input).length) return false;
    const seen = new Set<string>();
    for (let i = 0; i < input.length; i++) {
      const element = Object.getOwnPropertyDescriptor(input, String(i));
      if (!element || !Object.hasOwn(element, "value")) return false;
      const value: unknown = element.value;
      if (!value || typeof value !== "object" || Array.isArray(value) || Object.getPrototypeOf(value) !== Object.prototype || Object.getOwnPropertySymbols(value).length) return false;
      const fields = Object.getOwnPropertyDescriptors(value);
      if (Object.keys(fields).length !== 3 || !["id", "title", "capabilities"].every(key => fields[key]?.enumerable && Object.hasOwn(fields[key]!, "value"))) return false;
      const id: unknown = fields.id!.value;
      if (typeof id !== "string" || seen.has(id)) return false;
      const installed = INSTALLED_PROJECTIONS.find(d => d.id === id);
      if (!installed || fields.title!.value !== installed.title) return false;
      const caps: unknown = fields.capabilities!.value;
      if (!Array.isArray(caps) || caps.length !== installed.capabilities.length || Object.keys(caps).length !== caps.length || Object.getOwnPropertySymbols(caps).length) return false;
      if (!installed.capabilities.every((cap, n) => {
        const field = Object.getOwnPropertyDescriptor(caps, String(n));
        return field && Object.hasOwn(field, "value") && field.value === cap;
      })) return false;
      seen.add(id);
    }
    return Object.keys(input).length === input.length;
  } catch { return false; }
}

export type ProjectionItem = Readonly<{
  ref: string; kind: "process-anchor" | "composition-reference"; title: string;
  parentRef: string | null; viewRef: string | null; status: ReferenceStatus;
  composition: CompositionReference | null;
}>;
export type ProjectionState = Readonly<{
  document: ProcessContextDocument; canonicalText: string;
  items: readonly ProjectionItem[]; selectedRef: string | null; projectionId: ProjectionId;
}>;
export type ProjectionResult = Readonly<{ accepted: true; state: ProjectionState }> |
  Readonly<{ accepted: false; reason: "invalid-context" | "invalid-state" | "unknown-ref" | "unknown-projection" }>;
export type CompositionStatusResolver = (reference: CompositionReference) => Readonly<{ status: ReferenceStatus }>;
const admitted = new WeakSet<ProjectionState>();
const statuses: readonly ReferenceStatus[] = ["available", "missing", "stale", "invalid", "unavailable"];
function seal(state: ProjectionState): ProjectionState {
  const result = Object.freeze({ ...state, items: Object.freeze([...state.items]) });
  admitted.add(result); return result;
}
function status(reference: CompositionReference, resolver?: CompositionStatusResolver): ReferenceStatus {
  if (!resolver) return "unavailable";
  try {
    const result = resolver(reference);
    return result && statuses.includes(result.status) ? result.status : "invalid";
  } catch { return "unavailable"; }
}
/** Keys encode tuple components as JSON, avoiding delimiter/label/location collisions. */
export function createProjectionState(input: unknown, resolver?: CompositionStatusResolver, owner?: ProcessOwnerAdapter): ProjectionResult {
  const decoded = encodeProcessContext(input);
  if (!decoded.accepted) return { accepted: false, reason: "invalid-context" };
  const document = decoded.document, anchor = document.payload.processRevision;
  const tuple = [document.artifactType, document.artifactId, document.artifactVersion];
  const root = JSON.stringify([...tuple, "process-anchor", anchor.contractVersion, anchor.artifactRef, anchor.revisionRef, anchor.revisionNumber, anchor.previousRevisionRef]);
  const items: ProjectionItem[] = [Object.freeze({ ref: root, kind: "process-anchor", title: document.payload.title, parentRef: null, viewRef: null, status: resolveProcessAnchor(anchor, owner).status, composition: null })];
  for (const view of document.payload.views) items.push(Object.freeze({
    ref: JSON.stringify([...tuple, "composition-reference", view.ref]), kind: "composition-reference",
    title: view.title, parentRef: root, viewRef: view.ref, status: status(view.composition, resolver), composition: view.composition,
  }));
  return { accepted: true, state: seal({ document, canonicalText: decoded.text, items, selectedRef: emptySelection().selectedRef, projectionId: "context-outline" }) };
}
export function selectProjectionItem(state: ProjectionState, ref: string): ProjectionResult {
  if (!admitted.has(state)) return { accepted: false, reason: "invalid-state" };
  const result = selectKnownRef(createCollectionIndex(state.items.map(item => ({ ref: item.ref, payload: item }))), { selectedRef: state.selectedRef }, ref);
  return result.ok ? { accepted: true, state: seal({ ...state, selectedRef: result.state.selectedRef }) } : { accepted: false, reason: "unknown-ref" };
}
export function switchProjection(state: ProjectionState, id: string): ProjectionResult {
  if (!admitted.has(state)) return { accepted: false, reason: "invalid-state" };
  if (!INSTALLED_PROJECTIONS.some(d => d.id === id)) return { accepted: false, reason: "unknown-projection" };
  return { accepted: true, state: seal({ ...state, projectionId: id as ProjectionId }) };
}
/** Fresh resolution may remove availability, but never silently changes the selected identity. */
export function refreshProjectionState(state: ProjectionState, input: unknown, resolver?: CompositionStatusResolver, owner?: ProcessOwnerAdapter): ProjectionResult {
  if (!admitted.has(state)) return { accepted: false, reason: "invalid-state" };
  const result = createProjectionState(input, resolver, owner);
  if (!result.accepted) return result;
  const unchanged = state.canonicalText === result.state.canonicalText;
  return { accepted: true, state: seal({ ...result.state, projectionId: state.projectionId,
    selectedRef: unchanged && result.state.items.some(item => item.ref === state.selectedRef) ? state.selectedRef : null }) };
}
export type ProjectionInspector = Readonly<{
  item: ProjectionItem; processRevision: ProcessContextDocument["payload"]["processRevision"];
  contextIdentity: Readonly<{ artifactType: string; artifactId: string; artifactVersion: string }>;
  capabilities: readonly ProjectionCapability[];
}>;
export function projectionInspector(state: ProjectionState): ProjectionInspector | null {
  if (!admitted.has(state)) return null;
  const selected = selectedItem(createCollectionIndex(state.items.map(item => ({ ref: item.ref, payload: item }))), { selectedRef: state.selectedRef });
  if (!selected) return null;
  const item = selected.payload;
  return Object.freeze({ item, processRevision: state.document.payload.processRevision,
    contextIdentity: Object.freeze({ artifactType: state.document.artifactType, artifactId: state.document.artifactId, artifactVersion: state.document.artifactVersion }),
    capabilities: Object.freeze(item.kind === "composition-reference" && item.status === "available" ? ["inspect", "request-open-composition"] as const : ["inspect"] as const) });
}
/** This is an affordance, never authority or a substitute for fresh resolution at handoff. */
export function selectedCompositionReference(state: ProjectionState): CompositionReference | null {
  const inspector = projectionInspector(state);
  return inspector?.capabilities.includes("request-open-composition") ? inspector.item.composition : null;
}
