import { spawn, type ChildProcessByStdio } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join, normalize } from "node:path";
import type { Readable } from "node:stream";
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

export type LocalRuntimeStarted = Readonly<{
  kind: "RuntimeStarted";
  status: "UP";
  port: number;
  runtimeVersion: string;
  environmentRef: string;
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
    | "RUNTIME_STARTUP_INVALID"
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

type RuntimeChild = ChildProcessByStdio<null, Readable, Readable>;

type StartupOutcome =
  | Readonly<{ kind: "started"; started: LocalRuntimeStarted }>
  | Readonly<{ kind: "invalid"; detail: string }>
  | Readonly<{ kind: "closed"; exitCode: number | null }>
  | Readonly<{ kind: "timeout" }>;

function validGeneratedPath(path: string): boolean {
  const normalized = normalize(path).replaceAll("\\", "/");
  return !isAbsolute(path) && normalized !== ".." && !normalized.startsWith("../") && normalized.length > 0;
}

function parseStarted(line: string): LocalRuntimeStarted | null {
  try {
    const value = JSON.parse(line) as Partial<LocalRuntimeStarted>;
    if (
      value.kind !== "RuntimeStarted" ||
      value.status !== "UP" ||
      typeof value.port !== "number" ||
      !Number.isInteger(value.port) ||
      value.port <= 0 ||
      value.port > 65535 ||
      typeof value.runtimeVersion !== "string" ||
      typeof value.environmentRef !== "string"
    ) return null;
    return Object.freeze({
      kind: "RuntimeStarted",
      status: "UP",
      port: value.port,
      runtimeVersion: value.runtimeVersion,
      environmentRef: value.environmentRef,
    });
  } catch {
    return null;
  }
}

function parseHealth(value: unknown): LocalRuntimeHealth | null {
  if (!value || typeof value !== "object") return null;
  const health = value as Partial<LocalRuntimeHealth>;
  if (
    health.kind !== "RuntimeHealth" ||
    health.status !== "UP" ||
    typeof health.runtimeVersion !== "string" ||
    typeof health.environmentRef !== "string" ||
    !Array.isArray(health.bindingNames) ||
    !health.bindingNames.every((name) => typeof name === "string")
  ) return null;
  return Object.freeze({
    kind: "RuntimeHealth",
    status: "UP",
    runtimeVersion: health.runtimeVersion,
    environmentRef: health.environmentRef,
    bindingNames: Object.freeze([...health.bindingNames]),
  });
}

function errorDetail(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function waitForStartup(child: RuntimeChild, timeoutMs: number): Promise<StartupOutcome> {
  return new Promise((resolve) => {
    let settled = false;
    let buffer = "";
    const settle = (outcome: StartupOutcome) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      child.stdout.off("data", onData);
      child.off("close", onClose);
      resolve(outcome);
    };
    const onData = (chunk: string) => {
      buffer += chunk;
      const newline = buffer.indexOf("\n");
      if (newline < 0) return;
      const line = buffer.slice(0, newline).trim();
      const started = parseStarted(line);
      settle(started ? { kind: "started", started } : { kind: "invalid", detail: line });
    };
    const onClose = (exitCode: number | null) => settle({ kind: "closed", exitCode });
    const timer = setTimeout(() => settle({ kind: "timeout" }), timeoutMs);
    child.stdout.on("data", onData);
    child.once("close", onClose);
  });
}

function waitForClose(child: RuntimeChild, timeoutMs: number): Promise<Readonly<{ timedOut: boolean; exitCode: number | null }>> {
  if (child.exitCode !== null) return Promise.resolve({ timedOut: false, exitCode: child.exitCode });
  return new Promise((resolve) => {
    let settled = false;
    const settle = (value: Readonly<{ timedOut: boolean; exitCode: number | null }>) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      child.off("close", onClose);
      resolve(value);
    };
    const onClose = (exitCode: number | null) => settle({ timedOut: false, exitCode });
    const timer = setTimeout(() => settle({ timedOut: true, exitCode: child.exitCode }), timeoutMs);
    child.once("close", onClose);
  });
}

async function terminateChild(child: RuntimeChild, timeoutMs: number): Promise<Readonly<{ timedOut: boolean; exitCode: number | null }>> {
  if (child.exitCode !== null) return { timedOut: false, exitCode: child.exitCode };
  child.kill("SIGTERM");
  const graceful = await waitForClose(child, timeoutMs);
  if (!graceful.timedOut) return graceful;
  if (child.exitCode === null) child.kill("SIGKILL");
  const forced = await waitForClose(child, timeoutMs);
  return { timedOut: true, exitCode: forced.exitCode };
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
  const timeoutMs = input.timeoutMs ?? 5_000;
  let stdout = "";
  let stderr = "";
  let child: RuntimeChild | undefined;
  try {
    for (const file of generatedFiles) {
      const target = join(workingDirectory, file.path);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, file.content, "utf8");
    }

    child = spawn(process.execPath, [join(workingDirectory, "runtime-entry.mjs")], {
      cwd: workingDirectory,
      env: {
        ...process.env,
        ...(input.processEnvironment ?? {}),
        SYSTEM_BUILDER_ENVIRONMENT_PROFILE: JSON.stringify(input.environment),
        SYSTEM_BUILDER_RUNTIME_PORT: "0",
      },
      stdio: ["ignore", "pipe", "pipe"],
    });
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk: string) => { stdout += chunk; });
    child.stderr.on("data", (chunk: string) => { stderr += chunk; });

    const startup = await waitForStartup(child, timeoutMs);
    if (startup.kind === "timeout") {
      if (child.exitCode === null) child.kill("SIGKILL");
      const closed = await waitForClose(child, timeoutMs);
      return Object.freeze({
        ok: false,
        activated: true,
        diagnostic: Object.freeze({ code: "RUNTIME_PROCESS_TIMEOUT", detail: String(timeoutMs) }),
        stdout,
        stderr,
        exitCode: closed.exitCode,
        workingDirectory,
      });
    }
    if (startup.kind === "closed") {
      return Object.freeze({
        ok: false,
        activated: true,
        diagnostic: Object.freeze({ code: "RUNTIME_PROCESS_FAILED", detail: stderr.trim() || stdout.trim() || String(startup.exitCode) }),
        stdout,
        stderr,
        exitCode: startup.exitCode,
        workingDirectory,
      });
    }
    if (startup.kind === "invalid") {
      const stopped = await terminateChild(child, timeoutMs);
      return Object.freeze({
        ok: false,
        activated: true,
        diagnostic: Object.freeze({ code: "RUNTIME_STARTUP_INVALID", detail: startup.detail }),
        stdout,
        stderr,
        exitCode: stopped.exitCode,
        workingDirectory,
      });
    }

    if (child.exitCode !== null) {
      return Object.freeze({
        ok: false,
        activated: true,
        diagnostic: Object.freeze({ code: "RUNTIME_PROCESS_FAILED", detail: stderr.trim() || String(child.exitCode) }),
        stdout,
        stderr,
        exitCode: child.exitCode,
        workingDirectory,
      });
    }

    let health: LocalRuntimeHealth | null = null;
    try {
      const response = await fetch(`http://127.0.0.1:${startup.started.port}/health`, {
        signal: AbortSignal.timeout(timeoutMs),
      });
      health = response.status === 200 ? parseHealth(await response.json()) : null;
    } catch (error) {
      const stopped = await terminateChild(child, timeoutMs);
      return Object.freeze({
        ok: false,
        activated: true,
        diagnostic: Object.freeze({ code: "RUNTIME_HEALTH_INVALID", detail: errorDetail(error) }),
        stdout,
        stderr,
        exitCode: stopped.exitCode,
        workingDirectory,
      });
    }

    if (!health || health.runtimeVersion !== input.releaseArtifact.manifest.runtimeVersion || health.environmentRef !== input.environment.environmentRef) {
      const stopped = await terminateChild(child, timeoutMs);
      return Object.freeze({
        ok: false,
        activated: true,
        diagnostic: Object.freeze({ code: "RUNTIME_HEALTH_INVALID", detail: health ? JSON.stringify(health) : "invalid-health" }),
        stdout,
        stderr,
        exitCode: stopped.exitCode,
        workingDirectory,
      });
    }
    if (child.exitCode !== null) {
      return Object.freeze({
        ok: false,
        activated: true,
        diagnostic: Object.freeze({ code: "RUNTIME_PROCESS_FAILED", detail: stderr.trim() || String(child.exitCode) }),
        stdout,
        stderr,
        exitCode: child.exitCode,
        workingDirectory,
      });
    }

    const stopped = await terminateChild(child, timeoutMs);
    if (stopped.timedOut) {
      return Object.freeze({
        ok: false,
        activated: true,
        diagnostic: Object.freeze({ code: "RUNTIME_PROCESS_TIMEOUT", detail: "shutdown" }),
        stdout,
        stderr,
        exitCode: stopped.exitCode,
        workingDirectory,
      });
    }
    if (stopped.exitCode !== 0) {
      return Object.freeze({
        ok: false,
        activated: true,
        diagnostic: Object.freeze({ code: "RUNTIME_PROCESS_FAILED", detail: stderr.trim() || String(stopped.exitCode) }),
        stdout,
        stderr,
        exitCode: stopped.exitCode,
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
    if (child && child.exitCode === null) {
      child.kill("SIGKILL");
      await waitForClose(child, timeoutMs);
    }
    await rm(workingDirectory, { recursive: true, force: true });
  }
}
