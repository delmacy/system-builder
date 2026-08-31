import { ReleaseRegistry, type PublishedRelease } from "./index.js";

export type FactoryReleaseArtifactEvidence = Readonly<{
  kind: "ReleaseArtifact";
  artifactHash: string;
  validationEvidenceRef: string;
}>;

export type FactoryPublishedReleasePreviewRequest = Readonly<{
  releaseId: string;
  version: string;
  artifact: FactoryReleaseArtifactEvidence;
  publishedAt: string;
}>;

/**
 * Reuses the canonical ReleaseRegistry publication semantics inside a fresh,
 * discarded in-memory registry to derive PublishedRelease evidence without any
 * repository publication or external side effect.
 */
export function previewFactoryPublishedRelease(
  request: FactoryPublishedReleasePreviewRequest,
): PublishedRelease {
  const registry = new ReleaseRegistry();
  return registry.publish({
    releaseId: request.releaseId,
    version: request.version,
    artifact: request.artifact,
    publishedAt: request.publishedAt,
  });
}
