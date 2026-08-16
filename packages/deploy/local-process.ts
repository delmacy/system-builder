import { spawn } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join, normalize } from "node:path";
import type { EnvironmentProfile } from "@system-builder/contracts/environment-profile";
import type { DeployPublishedRelease, DeployReleaseArtifact } from "./index.js";

export type LocalGeneratedFile = Readonly<{
  path: string;
  content: string;
  contentHash: string;
}>;

export type LocalVerifiableReleaseArtifact = DeployReleaseArtifact & Readonly<{
  assemblyPlanRef: string;
  validationEvidenceRef: string;
  manifest: Readonly<{
    compilerVersion: string;
    runtimeVersion: string;
    files: readonly string[];
  }>;
}>;

export type LocalVerifiedArtifactPayloadReader = Readonly<{
  getVerified(artifact: LocalVerifiableReleaseArtifact): Readonly<{
    artifactHash: string;
    files: readonly LocalGeneratedFile[];
    verified: true;
  }>;
}>;

export type LocalRuntimeHealth = Readonly<{
  kind: "RuntimeHealth";
  status: "UP";
  runtimeVersion: string;
  environmentRef: string;
  bindingNames: readonly string[];
}>;

export type LocalProcessDeploymentDiagnostic = Readonly<{
  code:
    | "ARTIFACT_MISMATCH"
    | "ARTIFACT_PAYLOAD_INVALID"
    | "RUNTIME_INCOMPATIBLE"
    | "RUNTIME_ENTRYPOINT_MISSING"
    | "GENERATED_PATH_INVALID"
    | "RUNTIME_PROCESS_FAILED"
    | "RUNTIME_HEALTH_INVALID"
    | "RUNTIME_PROCESS_TIMEOUT";
  detail: string;
}>;

export type LocalProcessDeploymentResult =
  | Readonly<{
      ok: true;
      activated: true;
      health: LocalRuntimeHealth;
      stdout: string;
      stderr: string;
      exitCode: 0;
      workingDirectory: string;
    }>
  | Readonly<{
      ok: false;
      activated: boolean;
      diagnostic: LocalProcessDeploymentDiagnostic;
      stdout: string;
      stderr: string;
      exitCode: number | null;
      workingDirectory?: string;
    }>;

function validGeneratedPath(path: string): boolean {
  const normalized = normalize(path).replaceAll("\\", "/");
  return !isAbsolute(path) && normalized !== ".." && !normalized.startsWith("../") && normalized.length > 0;
}

function parseHealth(stdout: string): LocalRuntimeHealth | null {
  const lines = stdout.trim().split(/\r?\n/).filter(Boolean);
  const last = lines.at(-1);
  if (!last) return null;
  try {
    const value = JSON.parse(last) as Partial<LocalRuntimeHealth>;
    if (
      value.kind !== "RuntimeHealth" ||
      value.status !== "UP" ||
      typeof value.runtimeVersion !== "string" ||
      typeof value.environmentRef !== "string" ||
      !Array.isArray(value.bindingNames) ||
      !value.bindingNames.every((name) => typeof name === "string")
    ) return null;
    return Object.freeze({
      kind: "RuntimeHealth",
      status: "UP",
      runtimeVersion: value.runtimeVersion,
      environmentRef: value.environmentRef,
      bindingNames: Object.freeze([...value.bindingNames]),
    });
  } catch {
    return null;
  }
}

function errorDetail(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export async function runLocalProcessDeployment(input: Readonly<{
  publishedRelease: DeployPublishedRelease;
  releaseArtifact: LocalVerifiableReleaseArtifact;
  artifactPayloadReader: LocalVerifiedArtifactPayloadReader;
  environment: EnvironmentProfile;
  processEnvironment?: Readonly<Record<string, string>>;
  timeoutMs?: number;
}>): Promise<LocalProcessDeploymentResult> {
  const releaseSnapshot = JSON.stringify(input.publishedRelease);
  const artifactSnapshot = JSON.stringify(input.releaseArtifact);

  if (
    input.publishedRelease.artifactHash !== input.releaseArtifact.artifactHash ||
    input.publishedRelease.artifactRef !== input.releaseArtifact.artifactHash
  ) {
    return Object.freeze({
      ok: false,
      activated: false,
      diagnostic: Object.freeze({ code: "ARTIFACT_MISMATCH", detail: input.releaseArtifact.artifactHash }),
      stdout: "",
      stderr: "",
      exitCode: null,
    });
  }
  if (!input.environment.runtimeVersions.includes(input.releaseArtifact.manifest.runtimeVersion)) {
    return Object.freeze({
      ok: false,
      activated: false,
      diagnostic: Object.freeze({ code: "RUNTIME_INCOMPATIBLE", detail: input.releaseArtifact.manifest.runtimeVersion }),
      stdout: "",
      stderr: "",
      exitCode: null,
    });
  }

  let generatedFiles: readonly LocalGeneratedFile[];
  try {
    const verifiedPayload = input.artifactPayloadReader.getVerified(input.releaseArtifact);
    if (verifiedPayload.artifactHash !== input.releaseArtifact.artifactHash || verifiedPayload.verified !== true) {
      throw new Error("ARTIFACT_PAYLOAD_VERIFICATION_REQUIRED");
    }
    generatedFiles = verifiedPayload.files;
  } catch (error) {
    return Object.freeze({
      ok: false,
      activated: false,
      diagnostic: Object.freeze({ code: "ARTIFACT_PAYLOAD_INVALID", detail: errorDetail(error) }),
      stdout: "",
      stderr: "",
      exitCode: null,
    });
  }
  const filesSnapshot = JSON.stringify(generatedFiles);

  for (const file of generatedFiles) {
    if (!validGeneratedPath(file.path)) {
      return Object.freeze({
        ok: false,
        activated: false,
        diagnostic: Object.freeze({ code: "GENERATED_PATH_INVALID", detail: file.path }),
        stdout: "",
        stderr: "",
        exitCode: null,
      });
    }
  }
  const runtimeEntry = generatedFiles.find((file) => file.path === "runtime-entry.mjs");
  if (!runtimeEntry) {
    return Object.freeze({
      ok: false,
      activated: false,
      diagnostic: Object.freeze({ code: "RUNTIME_ENTRYPOINT_MISSING", detail: "verified-artifact-payload" }),
      stdout: "",
      stderr: "",
      exitCode: null,
    });
  }

  const workingDirectory = await mkdtemp(join(tmpdir(), "system-builder-local-deploy-"));
  let stdout = "";
  let stderr = "";
  let exitCode: number | null = null;
  let timedOut = false;
  try {
    for (const file of generatedFiles) {
      const target = join(workingDirectory, file.path);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, file.content, "utf8");
    }

    const child = spawn(process.execPath, [join(workingDirectory, "runtime-entry.mjs")], {
      cwd: workingDirectory,
      env: {
        ...process.env,
        ...(input.processEnvironment ?? {}),
        SYSTEM_BUILDER_ENVIRONMENT_PROFILE: JSON.stringify(input.environment),
      },
      stdio: ["ignore", "pipe", "pipe"],
    });
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk: string) => { stdout += chunk; });
    child.stderr.on("data", (chunk: string) => { stderr += chunk; });

    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, input.timeoutMs ?? 5_000);
    exitCode = await new Promise<number | null>((resolve, reject) => {
      child.once("error", reject);
      child.once("close", resolve);
    });
    clearTimeout(timeout);

    if (timedOut) {
      return Object.freeze({
        ok: false,
        activated: true,
        diagnostic: Object.freeze({ code: "RUNTIME_PROCESS_TIMEOUT", detail: String(input.timeoutMs ?? 5_000) }),
        stdout,
        stderr,
        exitCode,
        workingDirectory,
      });
    }
    if (exitCode !== 0) {
      return Object.freeze({
        ok: false,
        activated: true,
        diagnostic: Object.freeze({ code: "RUNTIME_PROCESS_FAILED", detail: stderr.trim() || String(exitCode) }),
        stdout,
        stderr,
        exitCode,
        workingDirectory,
      });
    }
    const health = parseHealth(stdout);
    if (!health) {
      return Object.freeze({
        ok: false,
        activated: true,
        diagnostic: Object.freeze({ code: "RUNTIME_HEALTH_INVALID", detail: stdout.trim() }),
        stdout,
        stderr,
        exitCode,
        workingDirectory,
      });
    }
    if (
      JSON.stringify(input.publishedRelease) !== releaseSnapshot ||
      JSON.stringify(input.releaseArtifact) !== artifactSnapshot ||
      JSON.stringify(generatedFiles) !== filesSnapshot
    ) throw new Error("LOCAL_DEPLOY_MUTATED_IMMUTABLE_INPUT");

    return Object.freeze({
      ok: true,
      activated: true,
      health,
      stdout,
      stderr,
      exitCode: 0,
      workingDirectory,
    });
  } finally {
    await rm(workingDirectory, { recursive: true, force: true });
  }
}
