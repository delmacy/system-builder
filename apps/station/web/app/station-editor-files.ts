import { ARTIFACT_LIMITS, encodeCompositionArtifact, type ArtifactResult, type CompositionArtifact } from "../../../../packages/station-editor/index.js";
import type { CompositionGraph } from "../../../../packages/station-composition/index.js";
import { resolveEditorCatalogEntry } from "./station-editor-catalog.js";
import { exportCatalogArtifact, importCatalogArtifact } from "./station-editor-artifact.js";

export interface FileOperationMetadata { readonly artifactId: string; readonly createdAt: string }
export function sameEditorArtifactGraph(left: CompositionGraph, right: CompositionGraph): boolean {
  return left.rootRef === right.rootRef && left.nodes.length === right.nodes.length && left.nodes.every((node, i) => {
    const other = right.nodes[i]!;
    return node.ref === other.ref && node.componentRef === other.componentRef &&
      node.placement?.parentRef === other.placement?.parentRef && node.placement?.slotRef === other.placement?.slotRef &&
      node.placement?.columnSpan === other.placement?.columnSpan && node.placement?.rowSpan === other.placement?.rowSpan;
  });
}
/** The explicit caller workflow owns metadata/version allocation; the codec stays pure. */
export function prepareEditorArtifact(ref: string, graph: CompositionGraph, previous: CompositionArtifact | null,
  operation: FileOperationMetadata, newIdentity = false): ArtifactResult {
  if (!previous) return exportCatalogArtifact(ref, graph, { artifactId: operation.artifactId, artifactVersion: "1.0.0",
    provenance: { createdAt: operation.createdAt, producer: { id: "urn:system-builder:station", version: "1.0.0" }, inputs: [] } });
  if (previous.payload.compositionRef !== ref) return { accepted: false, reason: "identity-mismatch" };
  if (!newIdentity && sameEditorArtifactGraph(previous.payload.graph, graph)) return encodeCompositionArtifact(previous, resolveEditorCatalogEntry);
  const components = previous.artifactVersion.split(/[+-]/)[0]!.split(".");
  const artifactVersion = newIdentity ? "1.0.0" : `${components[0]}.${components[1]}.${BigInt(components[2]!) + 1n}`;
  return encodeCompositionArtifact({ ...previous, artifactVersion, artifactId: newIdentity ? operation.artifactId : previous.artifactId,
    provenance: { ...previous.provenance, createdAt: operation.createdAt,
      inputs: [...previous.provenance.inputs as unknown[], { artifactType: previous.artifactType, artifactId: previous.artifactId, artifactVersion: previous.artifactVersion }] },
    payload: { ...previous.payload, graph } }, resolveEditorCatalogEntry);
}
export interface CompositionFileInput { readonly size: number; text(): Promise<string> }
export async function readEditorArtifact(file: CompositionFileInput): Promise<ArtifactResult | { accepted: false; reason: "file-read-failed" }> {
  if (!Number.isSafeInteger(file.size) || file.size < 0 || file.size > ARTIFACT_LIMITS.bytes)
    return { accepted: false, reason: "size-limit" };
  try { return importCatalogArtifact(await file.text()); }
  catch { return { accepted: false, reason: "file-read-failed" }; }
}
export function requestArtifactDownload(text: string, ref: string): void {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const link = document.createElement("a");
  try {
    link.href = url; link.download = ref.replace(/[^A-Za-z0-9_-]/g, "-") + ".composition.json";
    link.hidden = true; document.body.append(link); link.click();
  } finally { link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
}
