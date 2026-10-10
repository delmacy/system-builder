import { decodeCompositionArtifact, encodeCompositionArtifact, type ArtifactFailure,
  type ArtifactSourceResolver, type CompositionArtifact } from "./artifact-codec.js";

export const COMPOSITION_ARTIFACT_STORE_PREFIX = "station:composition-artifact:v1:";
export interface ArtifactStore { getItem(key: string): string | null; setItem(key: string, value: string): void }
export type StoredArtifactResult =
  | { readonly accepted: true; readonly document: CompositionArtifact; readonly text: string; readonly storedText: string }
  | { readonly accepted: false; readonly reason: ArtifactFailure | "storage-unavailable" | "not-found" | "storage-conflict" };
export function compositionArtifactKey(ref: string): string { return COMPOSITION_ARTIFACT_STORE_PREFIX + encodeURIComponent(ref); }
export function openStoredArtifact(store: ArtifactStore, ref: string, resolve: ArtifactSourceResolver): StoredArtifactResult {
  try {
    if (!resolve(ref)) return { accepted: false, reason: "unknown-composition" };
    const storedText = store.getItem(compositionArtifactKey(ref));
    if (storedText === null) return { accepted: false, reason: "not-found" };
    const result = decodeCompositionArtifact(storedText, resolve);
    if (!result.accepted) return result;
    if (result.document.payload.compositionRef !== ref) return { accepted: false, reason: "identity-mismatch" };
    return { ...result, storedText };
  } catch { return { accepted: false, reason: "storage-unavailable" }; }
}
/** One atomic native setItem after validation and a best-effort stale-read check; not cross-tab CAS. */
export function saveStoredArtifact(store: ArtifactStore, document: CompositionArtifact, expectedText: string | null,
  resolve: ArtifactSourceResolver): StoredArtifactResult {
  const result = encodeCompositionArtifact(document, resolve);
  if (!result.accepted) return result;
  try {
    const key = compositionArtifactKey(result.document.payload.compositionRef);
    if (store.getItem(key) !== expectedText) return { accepted: false, reason: "storage-conflict" };
    store.setItem(key, result.text);
    return { ...result, storedText: result.text };
  } catch { return { accepted: false, reason: "storage-unavailable" }; }
}
