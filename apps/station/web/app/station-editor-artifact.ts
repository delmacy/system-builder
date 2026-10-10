import { createCompositionArtifact, decodeCompositionArtifact, encodeCompositionArtifact,
  type ArtifactMetadata, type ArtifactResult, type CompositionArtifact } from "../../../../packages/station-editor/index.js";
import type { CompositionGraph } from "../../../../packages/station-composition/index.js";
import { resolveEditorCatalogEntry } from "./station-editor-catalog.js";

export function exportCatalogArtifact(ref: string, graph: CompositionGraph, metadata: ArtifactMetadata): ArtifactResult {
  const source = resolveEditorCatalogEntry(ref);
  return source ? createCompositionArtifact(graph, source, metadata) : { accepted: false, reason: "unknown-composition" };
}
export function importCatalogArtifact(text: string): ArtifactResult {
  return decodeCompositionArtifact(text, resolveEditorCatalogEntry);
}
export function reemitCatalogArtifact(document: CompositionArtifact): ArtifactResult {
  return encodeCompositionArtifact(document, resolveEditorCatalogEntry);
}
