import type { EnvironmentProfile } from "@system-builder/contracts/environment-profile";
import { sha256Canonical } from "@system-builder/deterministic";
import type { DeployPublishedRelease, DeploymentRecord } from "./index.js";
import {
  runLocalProcessDeployment,
  type LocalProcessDeploymentDiagnostic,
  type LocalProcessDeploymentResult,
  type LocalVerifiableReleaseArtifact,
  type LocalVerifiedArtifactPayloadReader,
} from "./local-process.js";

export type LocalDeploymentResult =
  | Readonly<{
      ok: true;
      record: DeploymentRecord;
      execution: LocalProcessDeploymentResult;
    }>
  | Readonly<{
      ok: false;
      activated: false;
      diagnostic: LocalProcessDeploymentDiagnostic;
    }>;

function releaseRef(release: DeployPublishedRelease): string {
  return `${release.releaseId}@${release.version}`;
}

export async function executeLocalDeployment(input: Readonly<{
  publishedRelease: DeployPublishedRelease;
  releaseArtifact: LocalVerifiableReleaseArtifact;
  artifactPayloadReader: LocalVerifiedArtifactPayloadReader;
  environment: EnvironmentProfile;
  startedAt: string;
  completedAt: string;
  processEnvironment?: Readonly<Record<string, string>>;
  timeoutMs?: number;
}>): Promise<LocalDeploymentResult> {
  const execution = await runLocalProcessDeployment({
    publishedRelease: input.publishedRelease,
    releaseArtifact: input.releaseArtifact,
    artifactPayloadReader: input.artifactPayloadReader,
    environment: input.environment,
    ...(input.processEnvironment === undefined ? {} : { processEnvironment: input.processEnvironment }),
    ...(input.timeoutMs === undefined ? {} : { timeoutMs: input.timeoutMs }),
  });

  if (!execution.ok && !execution.activated) {
    return Object.freeze({ ok: false, activated: false, diagnostic: execution.diagnostic });
  }

  const healthChecks = Object.freeze([
    Object.freeze({
      name: "runtime-health",
      status: execution.ok ? "PASS" as const : "FAIL" as const,
    }),
  ]);
  const bindings = [...input.environment.bindings]
    .map((binding) => ({ name: binding.name, kind: binding.kind, reference: binding.reference }))
    .sort((left, right) => left.name.localeCompare(right.name) || left.kind.localeCompare(right.kind));
  const payload = {
    publishedReleaseRef: releaseRef(input.publishedRelease),
    environmentRef: input.environment.environmentRef,
    releaseHash: input.publishedRelease.artifactHash,
    startedAt: input.startedAt,
    completedAt: input.completedAt,
    healthChecks,
    bindings,
  };
  const record: DeploymentRecord = Object.freeze({
    kind: "DeploymentRecord",
    deploymentId: sha256Canonical(payload),
    publishedReleaseRef: payload.publishedReleaseRef,
    environmentRef: payload.environmentRef,
    releaseHash: payload.releaseHash,
    startedAt: payload.startedAt,
    completedAt: payload.completedAt,
    status: execution.ok ? "succeeded" : "failed",
    healthChecks,
  });

  return Object.freeze({ ok: true, record, execution });
}
