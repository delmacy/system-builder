import { decodeCompositionArtifact, type ArtifactStore, type CompositionArtifact } from "../../../../packages/station-editor/index.js";
import { resolveEditorCatalogEntry } from "./station-editor-catalog.js";
import { prepareEditorArtifact, sameEditorArtifactGraph } from "./station-editor-files.js";
import { loadArtifactWorkspace, mutateArtifactWorkspace, workspaceDocument,
  type ArtifactWorkspace, type WorkspaceFile, type WorkspaceResult } from "./station-artifact-workspace.js";

export const REVISION_DIFF_LIMIT = 512;
export interface RevisionEntry { readonly file: WorkspaceFile; readonly document: CompositionArtifact }
/** Retention order, deliberately independent from SemVer/publication ordering. */
export function workspaceRevisions(workspace: ArtifactWorkspace, fileRef: string): readonly RevisionEntry[] {
  const selected = workspace.files.find(file => file.ref === fileRef);
  const document = selected && workspaceDocument(selected);
  if (!document) return Object.freeze([]);
  return Object.freeze(workspace.files.flatMap(file => {
    const candidate = workspaceDocument(file);
    return candidate && candidate.artifactType === document.artifactType && candidate.artifactId === document.artifactId
      ? [Object.freeze({ file, document: candidate })] : [];
  }));
}
export interface RevisionIntent {
  readonly baseRef: string; readonly ref: string; readonly name: string; readonly text: string;
}
export type RevisionResult = WorkspaceResult | { readonly accepted: false; readonly reason: "invalid-revision" | "revision-conflict" };
function validIntent(value: unknown): value is RevisionIntent {
  if (!value || typeof value !== "object" || Array.isArray(value) ||
      ![Object.prototype, null].includes(Object.getPrototypeOf(value))) return false;
  const keys = ["baseRef", "ref", "name", "text"];
  return Reflect.ownKeys(value).length === keys.length && keys.every(key => {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    return descriptor?.enumerable && Object.hasOwn(descriptor, "value") && typeof descriptor.value === "string";
  });
}
/** Existing records survive every failure; this is expected-text detection, not a cross-tab CAS. */
export function appendWorkspaceRevision(store: ArtifactStore, expectedText: string | null, intent: RevisionIntent): RevisionResult {
  if (!validIntent(intent)) return { accepted: false, reason: "invalid-revision" };
  const current = loadArtifactWorkspace(store);
  if (!current.accepted) return current;
  if (current.storedText !== expectedText) return { accepted: false, reason: "storage-conflict" };
  const revisions = workspaceRevisions(current.workspace, intent.baseRef);
  const base = revisions.at(-1);
  if (!base || base.file.ref !== intent.baseRef) return { accepted: false, reason: "revision-conflict" };
  const candidate = decodeCompositionArtifact(intent.text, resolveEditorCatalogEntry);
  if (!candidate.accepted || !/^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$/.test(base.document.artifactVersion))
    return { accepted: false, reason: "invalid-revision" };
  const next = candidate.document;
  if (next.artifactType !== base.document.artifactType || next.artifactId !== base.document.artifactId ||
      next.payload.compositionRef !== base.document.payload.compositionRef ||
      sameEditorArtifactGraph(next.payload.graph, base.document.payload.graph) ||
      revisions.some(entry => entry.document.artifactVersion === next.artifactVersion))
    return { accepted: false, reason: "invalid-revision" };
  const prepared = prepareEditorArtifact(base.document.payload.compositionRef, next.payload.graph, base.document,
    { artifactId: base.document.artifactId, createdAt: next.provenance.createdAt as string });
  if (!prepared.accepted || prepared.text !== candidate.text) return { accepted: false, reason: "invalid-revision" };
  return mutateArtifactWorkspace(store, expectedText, { type: "append-file", ref: intent.ref,
    folderRef: base.file.folderRef, name: intent.name, text: candidate.text });
}

export interface RevisionChange {
  readonly path: string; readonly kind: "added" | "removed" | "changed";
  readonly before?: unknown; readonly after?: unknown;
}
export type RevisionDiffResult =
  | { readonly accepted: true; readonly changes: readonly RevisionChange[]; readonly truncated: boolean }
  | { readonly accepted: false; readonly reason: "invalid-revision" | "identity-mismatch" };
const object = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === "object" && !Array.isArray(value);
const segment = (key: string) => key.replace(/~/g, "~0").replace(/\//g, "~1");
/** Diff full inert validated envelopes; arrays preserve authored order and output is explicitly capped. */
export function compareWorkspaceRevisions(beforeText: string, afterText: string): RevisionDiffResult {
  const before = decodeCompositionArtifact(beforeText, resolveEditorCatalogEntry);
  const after = decodeCompositionArtifact(afterText, resolveEditorCatalogEntry);
  if (!before.accepted || !after.accepted) return { accepted: false, reason: "invalid-revision" };
  if (before.document.artifactId !== after.document.artifactId || before.document.artifactType !== after.document.artifactType ||
      before.document.payload.compositionRef !== after.document.payload.compositionRef)
    return { accepted: false, reason: "identity-mismatch" };
  const changes: RevisionChange[] = []; let truncated = false;
  const add = (change: RevisionChange) => {
    if (changes.length === REVISION_DIFF_LIMIT) truncated = true;
    else changes.push(Object.freeze(change));
  };
  const visit = (left: unknown, right: unknown, path: string): void => {
    if (truncated || JSON.stringify(left) === JSON.stringify(right)) return;
    if (Array.isArray(left) && Array.isArray(right)) {
      for (let i = 0; i < Math.max(left.length, right.length) && !truncated; i++) {
        const child = path + "/" + i;
        if (i >= left.length) add({ path: child, kind: "added", after: right[i] });
        else if (i >= right.length) add({ path: child, kind: "removed", before: left[i] });
        else visit(left[i], right[i], child);
      }
    } else if (object(left) && object(right)) {
      for (const key of [...new Set([...Object.keys(left), ...Object.keys(right)])].sort()) {
        if (truncated) break;
        const child = path + "/" + segment(key);
        if (!Object.hasOwn(left, key)) add({ path: child, kind: "added", after: right[key] });
        else if (!Object.hasOwn(right, key)) add({ path: child, kind: "removed", before: left[key] });
        else visit(left[key], right[key], child);
      }
    } else add({ path, kind: "changed", before: left, after: right });
  };
  visit(before.document, after.document, "");
  return Object.freeze({ accepted: true, changes: Object.freeze(changes), truncated });
}
