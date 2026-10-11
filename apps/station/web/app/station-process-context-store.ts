import { decodeCompositionArtifact, type ArtifactStore } from "../../../../packages/station-editor/index.js";
import { decodeProcessContext, encodeProcessContext, PROCESS_CONTEXT_LIMITS, type ContextResult,
  type ProcessContextDocument, type CompositionReference } from "../../../../packages/station-process-context/index.js";
import { loadArtifactWorkspace } from "./station-artifact-workspace.js";
import { resolveEditorCatalogEntry } from "./station-editor-catalog.js";
export const PROCESS_CONTEXT_KEY = "station:process-context:v1";
export type StoredContextResult = { readonly accepted: true; readonly document: ProcessContextDocument | null; readonly storedText: string | null } |
  { readonly accepted: false; readonly reason: "invalid-context" | "storage-unavailable" | "storage-conflict" };
export function loadProcessContext(store: ArtifactStore): StoredContextResult {
  try {
    const text = store.getItem(PROCESS_CONTEXT_KEY);
    if (text === null) return { accepted: true, document: null, storedText: null };
    const result = decodeProcessContext(text);
    return result.accepted ? { accepted: true, document: result.document, storedText: text } : { accepted: false, reason: "invalid-context" };
  } catch { return { accepted: false, reason: "storage-unavailable" }; }
}
/** Corruption blocks save; no hidden repair. Expected raw text is best-effort, not a cross-tab CAS. */
export function saveProcessContext(store: ArtifactStore, input: unknown, expectedText: string | null): StoredContextResult {
  const result = encodeProcessContext(input);
  if (!result.accepted) return { accepted: false, reason: "invalid-context" };
  try {
    const prior = loadProcessContext(store);
    if (!prior.accepted) return prior;
    if (prior.document && prior.document.artifactType === result.document.artifactType &&
        prior.document.artifactId === result.document.artifactId && prior.document.artifactVersion === result.document.artifactVersion) {
      const retained = encodeProcessContext(prior.document);
      if (!retained.accepted || retained.text !== result.text) return { accepted: false, reason: "storage-conflict" };
    }
    if (prior.storedText !== expectedText || store.getItem(PROCESS_CONTEXT_KEY) !== expectedText) return { accepted: false, reason: "storage-conflict" };
    store.setItem(PROCESS_CONTEXT_KEY, result.text);
    return { accepted: true, document: result.document, storedText: result.text };
  } catch { return { accepted: false, reason: "storage-unavailable" }; }
}
export type CompositionResolution = { readonly status: "available"; readonly text: string; readonly fileRef: string } |
  { readonly status: "missing" | "stale" | "invalid" | "unavailable" };
/** Resolve a logical tuple, not a location/latest alias. The real WP12 workspace validates every file. */
export function resolveContextComposition(store: ArtifactStore, reference: CompositionReference): CompositionResolution {
  const current = loadArtifactWorkspace(store);
  if (!current.accepted) return { status: current.reason === "storage-unavailable" ? "unavailable" : "invalid" };
  let sameIdentity = false;
  const exact: { text: string; fileRef: string }[] = [];
  for (const file of current.workspace.files) {
    const decoded = decodeCompositionArtifact(file.text, resolveEditorCatalogEntry);
    if (!decoded.accepted) return { status: "invalid" };
    const doc = decoded.document;
    if (doc.artifactType === reference.artifactType && doc.artifactId === reference.artifactId) {
      sameIdentity = true;
      if (doc.artifactVersion === reference.artifactVersion) exact.push({ text: decoded.text, fileRef: file.ref });
    }
  }
  if (exact.some(item => item.text !== exact[0]!.text)) return { status: "invalid" };
  return exact.length ? { status: "available", ...exact[0]! } : { status: sameIdentity ? "stale" : "missing" };
}
export async function readProcessContextFile(file: { readonly name: string; readonly size: number; text(): Promise<string> }): Promise<ContextResult | { accepted: false; reason: "invalid-filename" | "file-read-failed" }> {
  if (!file.name.endsWith(".process.json")) return { accepted: false, reason: "invalid-filename" };
  if (!Number.isSafeInteger(file.size) || file.size < 0 || file.size > PROCESS_CONTEXT_LIMITS.bytes) return { accepted: false, reason: "size-limit" };
  try { return decodeProcessContext(await file.text()); }
  catch { return { accepted: false, reason: "file-read-failed" }; }
}
