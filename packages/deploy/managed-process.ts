import { spawn, type ChildProcessByStdio } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join, normalize } from "node:path";
import type { Readable } from "node:stream";
import type { EnvironmentProfile } from "@system-builder/contracts/environment-profile";
import type { DeployPublishedRelease } from "./index.js";
import {
  type LocalGeneratedFile,
  type LocalRuntimeHealth,
  type LocalRuntimeStarted,
  type LocalVerifiableReleaseArtifact,
  type LocalVerifiedArtifactPayloadReader,
} from "./local-process.js";
import { preflightVerifiedMigrations, type LocalMigrationPreflight } from "./migration-preflight.js";
import {
  applyVerifiedPostgresMigrations,
  type LocalMigrationApplication,
  type LocalMigrationApplier,
} from "./postgres-migrations.js";
import {
  resolveRuntimeSecretEnvironment,
  type RuntimeSecretEnvironment,
  type SecretResolver,
} from "./secret-resolver.js";

type RuntimeChild = ChildProcessByStdio<null, Readable, Readable>;
type StartupOutcome =
  | Readonly<{ kind: "started"; started: LocalRuntimeStarted }>
  | Readonly<{ kind: "invalid"; detail: string }>
  | Readonly<{ kind: "closed"; exitCode: number | null }>
  | Readonly<{ kind: "timeout" }>;

export type ManagedLocalRuntimeSnapshot = Readonly<{
  kind: "ManagedLocalRuntime";
  state: "running" | "stopped" | "failed";
  runtimeVersion: string;
  environmentRef: string;
  port: number;
  workingDirectory: string;
  exitCode: number | null;
}>;

export type ManagedLocalRuntime = Readonly<{
  snapshot(): ManagedLocalRuntimeSnapshot;
  health(): Promise<LocalRuntimeHealth>;
  stop(): Promise<ManagedLocalRuntimeSnapshot>;
}>;

export type ManagedLocalRuntimeDiagnostic = Readonly<{
  code:
    | "ARTIFACT_MISMATCH"
    | "ARTIFACT_PAYLOAD_INVALID"
    | "RUNTIME_INCOMPATIBLE"
    | "RUNTIME_ENTRYPOINT_MISSING"
    | "GENERATED_PATH_INVALID"
    | "MIGRATION_PREFLIGHT_INVALID"
    | "SECRET_RESOLUTION_FAILED"
    | "MIGRATION_APPLICATION_FAILED"
    | "RUNTIME_PROCESS_FAILED"
    | "RUNTIME_STARTUP_INVALID"
    | "RUNTIME_HEALTH_INVALID"
    | "RUNTIME_PROCESS_TIMEOUT";
  detail: string;
}>;

export type StartManagedLocalRuntimeResult =
  | Readonly<{
      ok: true;
      managed: ManagedLocalRuntime;
      health: LocalRuntimeHealth;
      migrationPreflight: LocalMigrationPreflight;
      migrationApplication: LocalMigrationApplication;
    }>
  | Readonly<{ ok: false; diagnostic: ManagedLocalRuntimeDiagnostic }>;

function errorDetail(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function redactSecrets(detail: string, runtimeSecrets: RuntimeSecretEnvironment): string {
  let redacted = detail;
  for (const value of Object.values(runtimeSecrets)) {
    if (value.length > 0) redacted = redacted.replaceAll(value, "[REDACTED]");
  }
  return redacted;
}

function validGeneratedPath(path: string): boolean {
  const normalized = normalize(path).replaceAll("\\", "/");
  return !isAbsolute(path) && normalized !== ".." && !normalized.startsWith("../") && normalized.length > 0;
}

function parseStarted(line: string): LocalRuntimeStarted | null {
  try {
    const value = JSON.parse(line) as Partial<LocalRuntimeStarted>;
    if (
      value.kind !== "RuntimeStarted" || value.status !== "UP" || typeof value.port !== "number" ||
      !Number.isInteger(value.port) || value.port <= 0 || value.port > 65535 ||
      typeof value.runtimeVersion !== "string" || typeof value.environmentRef !== "string"
    ) return null;
    return Object.freeze({ kind: "RuntimeStarted", status: "UP", port: value.port, runtimeVersion: value.runtimeVersion, environmentRef: value.environmentRef });
  } catch {
    return null;
  }
}

function parseHealth(value: unknown): LocalRuntimeHealth | null {
  if (!value || typeof value !== "object") return null;
  const health = value as Partial<LocalRuntimeHealth>;
  if (
    health.kind !== "RuntimeHealth" || health.status !== "UP" || typeof health.runtimeVersion !== "string" ||
    typeof health.environmentRef !== "string" || !Array.isArray(health.bindingNames) ||
    !health.bindingNames.every((name) => typeof name === "string")
  ) return null;
  return Object.freeze({ kind: "RuntimeHealth", status: "UP", runtimeVersion: health.runtimeVersion, environmentRef: health.environmentRef, bindingNames: Object.freeze([...health.bindingNames]) });
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

async function stopChild(child: RuntimeChild, timeoutMs: number): Promise<number | null> {
  if (child.exitCode !== null) return child.exitCode;
  child.kill("SIGTERM");
  const graceful = await waitForClose(child, timeoutMs);
  if (!graceful.timedOut) return graceful.exitCode;
  if (child.exitCode === null) child.kill("SIGKILL");
  return (await waitForClose(child, timeoutMs)).exitCode;
}

async function readHealth(port: number, timeoutMs: number): Promise<LocalRuntimeHealth> {
  const response = await fetch(`http://127.0.0.1:${port}/health`, { signal: AbortSignal.timeout(timeoutMs) });
  const health = response.status === 200 ? parseHealth(await response.json()) : null;
  if (!health) throw new Error(`RUNTIME_HEALTH_RESPONSE_INVALID:${response.status}`);
  return health;
}

export async function startManagedLocalRuntime(input: Readonly<{
  publishedRelease: DeployPublishedRelease;
  releaseArtifact: LocalVerifiableReleaseArtifact;
  artifactPayloadReader: LocalVerifiedArtifactPayloadReader;
  environment: EnvironmentProfile;
  secretResolver?: SecretResolver;
  migrationApplier?: LocalMigrationApplier;
  processEnvironment?: Readonly<Record<string, string>>;
  timeoutMs?: number;
}>): Promise<StartManagedLocalRuntimeResult> {
  if (input.publishedRelease.artifactHash !== input.releaseArtifact.artifactHash || input.publishedRelease.artifactRef !== input.releaseArtifact.artifactHash) {
    return Object.freeze({ ok: false, diagnostic: Object.freeze({ code: "ARTIFACT_MISMATCH", detail: input.releaseArtifact.artifactHash }) });
  }
  if (!input.environment.runtimeVersions.includes(input.releaseArtifact.manifest.runtimeVersion)) {
    return Object.freeze({ ok: false, diagnostic: Object.freeze({ code: "RUNTIME_INCOMPATIBLE", detail: input.releaseArtifact.manifest.runtimeVersion }) });
  }

  let generatedFiles: readonly LocalGeneratedFile[];
  try {
    const verified = input.artifactPayloadReader.getVerified(input.releaseArtifact);
    if (verified.verified !== true || verified.artifactHash !== input.releaseArtifact.artifactHash) throw new Error("ARTIFACT_PAYLOAD_VERIFICATION_REQUIRED");
    generatedFiles = verified.files;
  } catch (error) {
    return Object.freeze({ ok: false, diagnostic: Object.freeze({ code: "ARTIFACT_PAYLOAD_INVALID", detail: errorDetail(error) }) });
  }
  for (const file of generatedFiles) {
    if (!validGeneratedPath(file.path)) return Object.freeze({ ok: false, diagnostic: Object.freeze({ code: "GENERATED_PATH_INVALID", detail: file.path }) });
  }

  let migrationPreflight: LocalMigrationPreflight;
  try { migrationPreflight = preflightVerifiedMigrations(generatedFiles); }
  catch (error) { return Object.freeze({ ok: false, diagnostic: Object.freeze({ code: "MIGRATION_PREFLIGHT_INVALID", detail: errorDetail(error) }) }); }
  if (!generatedFiles.some((file) => file.path === "runtime-entry.mjs")) {
    return Object.freeze({ ok: false, diagnostic: Object.freeze({ code: "RUNTIME_ENTRYPOINT_MISSING", detail: "verified-artifact-payload" }) });
  }

  let runtimeSecrets: RuntimeSecretEnvironment = Object.freeze({});
  if (input.secretResolver) {
    try { runtimeSecrets = resolveRuntimeSecretEnvironment(input.environment, input.secretResolver); }
    catch (error) { return Object.freeze({ ok: false, diagnostic: Object.freeze({ code: "SECRET_RESOLUTION_FAILED", detail: errorDetail(error) }) }); }
  }

  let migrationApplication: LocalMigrationApplication;
  try {
    migrationApplication = await (input.migrationApplier ?? applyVerifiedPostgresMigrations)({ preflight: migrationPreflight, generatedFiles, runtimeSecrets });
  } catch (error) {
    return Object.freeze({ ok: false, diagnostic: Object.freeze({ code: "MIGRATION_APPLICATION_FAILED", detail: redactSecrets(errorDetail(error), runtimeSecrets) }) });
  }

  const workingDirectory = await mkdtemp(join(tmpdir(), "system-builder-managed-runtime-"));
  const timeoutMs = input.timeoutMs ?? 5_000;
  let child: RuntimeChild | undefined;
  try {
    for (const file of generatedFiles) {
      const target = join(workingDirectory, file.path);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, file.content, "utf8");
    }
    child = spawn(process.execPath, [join(workingDirectory, "runtime-entry.mjs")], {
      cwd: workingDirectory,
      env: { ...process.env, ...(input.processEnvironment ?? {}), ...runtimeSecrets, SYSTEM_BUILDER_ENVIRONMENT_PROFILE: JSON.stringify(input.environment), SYSTEM_BUILDER_RUNTIME_PORT: "0" },
      stdio: ["ignore", "pipe", "pipe"],
    });
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");

    const startup = await waitForStartup(child, timeoutMs);
    if (startup.kind === "timeout") {
      await stopChild(child, timeoutMs); await rm(workingDirectory, { recursive: true, force: true });
      return Object.freeze({ ok: false, diagnostic: Object.freeze({ code: "RUNTIME_PROCESS_TIMEOUT", detail: String(timeoutMs) }) });
    }
    if (startup.kind === "closed") {
      await rm(workingDirectory, { recursive: true, force: true });
      return Object.freeze({ ok: false, diagnostic: Object.freeze({ code: "RUNTIME_PROCESS_FAILED", detail: String(startup.exitCode) }) });
    }
    if (startup.kind === "invalid") {
      await stopChild(child, timeoutMs); await rm(workingDirectory, { recursive: true, force: true });
      return Object.freeze({ ok: false, diagnostic: Object.freeze({ code: "RUNTIME_STARTUP_INVALID", detail: redactSecrets(startup.detail, runtimeSecrets) }) });
    }

    let health: LocalRuntimeHealth;
    try { health = await readHealth(startup.started.port, timeoutMs); }
    catch (error) {
      await stopChild(child, timeoutMs); await rm(workingDirectory, { recursive: true, force: true });
      return Object.freeze({ ok: false, diagnostic: Object.freeze({ code: "RUNTIME_HEALTH_INVALID", detail: redactSecrets(errorDetail(error), runtimeSecrets) }) });
    }
    if (health.runtimeVersion !== input.releaseArtifact.manifest.runtimeVersion || health.environmentRef !== input.environment.environmentRef) {
      await stopChild(child, timeoutMs); await rm(workingDirectory, { recursive: true, force: true });
      return Object.freeze({ ok: false, diagnostic: Object.freeze({ code: "RUNTIME_HEALTH_INVALID", detail: redactSecrets(JSON.stringify(health), runtimeSecrets) }) });
    }

    const managedChild = child;
    let stopped = false;
    let stoppedExitCode: number | null = null;
    const snapshot = (): ManagedLocalRuntimeSnapshot => Object.freeze({
      kind: "ManagedLocalRuntime",
      state: stopped ? "stopped" : managedChild.exitCode === null ? "running" : "failed",
      runtimeVersion: startup.started.runtimeVersion,
      environmentRef: startup.started.environmentRef,
      port: startup.started.port,
      workingDirectory,
      exitCode: stopped ? stoppedExitCode : managedChild.exitCode,
    });
    const managed: ManagedLocalRuntime = Object.freeze({
      snapshot,
      health: () => readHealth(startup.started.port, timeoutMs),
      stop: async () => {
        if (!stopped) {
          stoppedExitCode = await stopChild(managedChild, timeoutMs);
          await rm(workingDirectory, { recursive: true, force: true });
          stopped = true;
        }
        return snapshot();
      },
    });
    child = undefined;
    return Object.freeze({ ok: true, managed, health, migrationPreflight, migrationApplication });
  } catch (error) {
    if (child) await stopChild(child, timeoutMs);
    await rm(workingDirectory, { recursive: true, force: true });
    return Object.freeze({ ok: false, diagnostic: Object.freeze({ code: "RUNTIME_PROCESS_FAILED", detail: redactSecrets(errorDetail(error), runtimeSecrets) }) });
  }
}
