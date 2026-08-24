import { canonicalJson, sha256Canonical, sha256Text } from "@system-builder/deterministic";
import {
  compileRuntimeModelRelease,
  type CompileRuntimeModelInput,
} from "./runtime-model.js";
import type {
  GeneratedFile,
  ReleaseArtifact,
  SyntheticCompilation,
} from "./index.js";

export type AutonomousRuntimeModelBundleMetadata = Readonly<{
  kind: "AutonomousRuntimeModelBundle";
  runtimeModel: Readonly<{
    path: "runtime-model.json";
    contentHash: string;
  }>;
}>;

export function compileAutonomousRuntimeModelBundle(
  input: CompileRuntimeModelInput,
): SyntheticCompilation {
  const base = compileRuntimeModelRelease(input);
  const runtimeModelFile = base.files.find((file) => file.path === "runtime-model.json");
  if (runtimeModelFile === undefined) {
    throw new Error("COMPILER_AUTONOMOUS_RUNTIME_MODEL_MISSING");
  }

  const metadata: AutonomousRuntimeModelBundleMetadata = Object.freeze({
    kind: "AutonomousRuntimeModelBundle",
    runtimeModel: Object.freeze({
      path: "runtime-model.json",
      contentHash: runtimeModelFile.contentHash,
    }),
  });
  const metadataContent = canonicalJson(metadata);
  const metadataFile: GeneratedFile = Object.freeze({
    path: "runtime-bundle.json",
    content: metadataContent,
    contentHash: sha256Text(metadataContent),
  });
  const files = Object.freeze(
    [...base.files, metadataFile].sort((left, right) => left.path.localeCompare(right.path)),
  );
  const manifest = Object.freeze({
    ...base.artifact.manifest,
    files: Object.freeze(files.map((file) => file.path)),
  });
  const artifactPayload = {
    kind: "ReleaseArtifact" as const,
    assemblyPlanRef: base.artifact.assemblyPlanRef,
    validationEvidenceRef: base.artifact.validationEvidenceRef,
    manifest,
    environmentSchema: base.artifact.environmentSchema,
    fileHashes: files.map((file) => ({ path: file.path, contentHash: file.contentHash })),
  };
  const artifact: ReleaseArtifact = Object.freeze({
    kind: "ReleaseArtifact",
    assemblyPlanRef: artifactPayload.assemblyPlanRef,
    validationEvidenceRef: artifactPayload.validationEvidenceRef,
    artifactHash: sha256Canonical(artifactPayload),
    manifest,
    environmentSchema: base.artifact.environmentSchema,
  });

  return Object.freeze({ files, artifact });
}
