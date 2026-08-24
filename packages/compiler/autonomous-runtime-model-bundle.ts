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

function renderRuntimeModelLoadingEntrypoint(
  entrypoint: string,
  metadata: AutonomousRuntimeModelBundleMetadata,
): string {
  const importNeedle = 'import { createServer } from "node:http";\n';
  const environmentNeedle = "let environment;\n";
  if (!entrypoint.startsWith(importNeedle) || !entrypoint.includes(environmentNeedle)) {
    throw new Error("COMPILER_AUTONOMOUS_RUNTIME_ENTRYPOINT_UNSUPPORTED");
  }

  const modelDescriptor = JSON.stringify(metadata.runtimeModel);
  const loader = [
    `const RUNTIME_MODEL_BUNDLE = ${modelDescriptor};`,
    "let runtimeModel;",
    "try {",
    '  const runtimeModelContent = await readFile(new URL(RUNTIME_MODEL_BUNDLE.path, import.meta.url), "utf8");',
    '  const runtimeModelHash = "sha256:" + createHash("sha256").update(runtimeModelContent).digest("hex");',
    "  if (runtimeModelHash !== RUNTIME_MODEL_BUNDLE.contentHash) {",
    '    fail("RUNTIME_MODEL_HASH_MISMATCH", RUNTIME_MODEL_BUNDLE.path);',
    "  } else {",
    "    const parsedRuntimeModel = JSON.parse(runtimeModelContent);",
    '    if (!parsedRuntimeModel || parsedRuntimeModel.kind !== "RuntimeModel") {',
    '      fail("RUNTIME_MODEL_INVALID", RUNTIME_MODEL_BUNDLE.path);',
    "    } else {",
    "      runtimeModel = parsedRuntimeModel;",
    "    }",
    "  }",
    "} catch (error) {",
    "  if (!process.exitCode) {",
    '    const code = error && typeof error === "object" && "code" in error && error.code === "ENOENT" ? "RUNTIME_MODEL_MISSING" : "RUNTIME_MODEL_INVALID";',
    "    fail(code, RUNTIME_MODEL_BUNDLE.path);",
    "  }",
    "}",
    "let environment;",
    "",
  ].join("\n");

  return entrypoint
    .replace(
      importNeedle,
      `${importNeedle}import { createHash } from "node:crypto";\nimport { readFile } from "node:fs/promises";\n`,
    )
    .replace(environmentNeedle, loader);
}

export function compileAutonomousRuntimeModelBundle(
  input: CompileRuntimeModelInput,
): SyntheticCompilation {
  const base = compileRuntimeModelRelease(input);
  const runtimeModelFile = base.files.find((file) => file.path === "runtime-model.json");
  if (runtimeModelFile === undefined) {
    throw new Error("COMPILER_AUTONOMOUS_RUNTIME_MODEL_MISSING");
  }
  const runtimeEntrypointFile = base.files.find((file) => file.path === "runtime-entry.mjs");
  if (runtimeEntrypointFile === undefined) {
    throw new Error("COMPILER_AUTONOMOUS_RUNTIME_ENTRYPOINT_MISSING");
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
  const runtimeEntrypointContent = renderRuntimeModelLoadingEntrypoint(
    runtimeEntrypointFile.content,
    metadata,
  );
  const runtimeEntrypoint: GeneratedFile = Object.freeze({
    path: runtimeEntrypointFile.path,
    content: runtimeEntrypointContent,
    contentHash: sha256Text(runtimeEntrypointContent),
  });
  const files = Object.freeze(
    [
      ...base.files.filter((file) => file.path !== runtimeEntrypoint.path),
      runtimeEntrypoint,
      metadataFile,
    ].sort((left, right) => left.path.localeCompare(right.path)),
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
