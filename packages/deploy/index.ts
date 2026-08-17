import type { EnvironmentBinding, EnvironmentProfile } from "@system-builder/contracts/environment-profile";
import { sha256Canonical } from "@system-builder/deterministic";
import { InMemoryDeploymentRecordStorage, type DeploymentRecordStorage } from "./storage.js";

export type { EnvironmentBinding, EnvironmentProfile } from "@system-builder/contracts/environment-profile";
export { InMemoryDeploymentRecordStorage, type DeploymentRecordStorage } from "./storage.js";

export type DeployPublishedRelease = Readonly<{
  kind: "PublishedRelease";
  releaseId: string;
  version: string;
  artifactRef: string;
  artifactHash: string;
  validationEvidenceRef: string;
  publishedAt: string;
  status?: "published" | "deprecated" | "archived";
}>;

export type DeployReleaseArtifact = Readonly<{
  kind: "ReleaseArtifact";
  artifactHash: string;
  manifest: Readonly<{ runtimeVersion: string }>;
  environmentSchema: readonly Readonly<{
    name: string;
    kind: "config" | "secret-reference";
    required: boolean;
  }>[];
}>;

export type AcceptanceCheck = Readonly<{ name: string; pass: boolean }>;

export type DeploymentRecord = Readonly<{
  kind: "DeploymentRecord";
  deploymentId: string;
  publishedReleaseRef: string;
  environmentRef: string;
  releaseHash: string;
  startedAt: string;
  completedAt: string;
  status: "succeeded" | "failed";
  healthChecks: readonly Readonly<{ name: string; status: "PASS" | "FAIL" }>[];
}>;

export type DeploymentActivationDecision = Readonly<{
  kind: "DeploymentActivationDecision";
  decisionId: string;
  outcome: "activated" | "retained-active" | "rejected-no-active";
  candidateDeploymentId: string;
  environmentRef: string;
  previousActiveDeploymentId: string | null;
  resultingActiveDeploymentId: string | null;
}>;

export type DryRunDeploymentResult =
  | Readonly<{ ok: true; record: DeploymentRecord; bindings: readonly EnvironmentBinding[] }>
  | Readonly<{
      ok: false;
      diagnostic: Readonly<{
        code: "ARTIFACT_MISMATCH" | "RUNTIME_INCOMPATIBLE" | "MISSING_ENVIRONMENT_BINDING" | "SECRET_VALUE_NOT_ALLOWED";
        detail: string;
      }>;
    }>;

function releaseRef(release: DeployPublishedRelease): string {
  return `${release.releaseId}@${release.version}`;
}

function immutableDeploymentRecord(record: DeploymentRecord): DeploymentRecord {
  return Object.freeze({
    ...record,
    healthChecks: Object.freeze(record.healthChecks.map((check) => Object.freeze({ ...check }))),
  });
}

export class DeploymentRegistry {
  readonly #storage: DeploymentRecordStorage;

  constructor(storage: DeploymentRecordStorage = new InMemoryDeploymentRecordStorage()) {
    this.#storage = storage;
  }

  record(record: DeploymentRecord): DeploymentRecord {
    const normalized = immutableDeploymentRecord(record);
    const existing = this.#storage.get(record.deploymentId);
    if (existing !== undefined) {
      if (JSON.stringify(existing) !== JSON.stringify(normalized)) {
        throw new Error(`DEPLOYMENT_RECORD_CONFLICT:${record.deploymentId}`);
      }
      return existing;
    }
    this.#storage.set(record.deploymentId, normalized);
    if (normalized.status === "succeeded") {
      this.#storage.setActiveDeploymentId(normalized.environmentRef, normalized.deploymentId);
    }
    return normalized;
  }

  activateCandidate(record: DeploymentRecord): DeploymentActivationDecision {
    const previousActive = this.getActive(record.environmentRef);
    const candidate = this.record(record);
    const resultingActive = this.getActive(record.environmentRef);
    const outcome = candidate.status === "succeeded"
      ? "activated" as const
      : previousActive === undefined
        ? "rejected-no-active" as const
        : "retained-active" as const;
    const payload = Object.freeze({
      outcome,
      candidateDeploymentId: candidate.deploymentId,
      environmentRef: candidate.environmentRef,
      previousActiveDeploymentId: previousActive?.deploymentId ?? null,
      resultingActiveDeploymentId: resultingActive?.deploymentId ?? null,
    });
    return Object.freeze({
      kind: "DeploymentActivationDecision",
      decisionId: sha256Canonical(payload),
      ...payload,
    });
  }

  get(deploymentId: string): DeploymentRecord | undefined {
    return this.#storage.get(deploymentId);
  }

  list(): readonly DeploymentRecord[] {
    return Object.freeze([...this.#storage.values()].sort((left, right) => left.deploymentId.localeCompare(right.deploymentId)));
  }

  getActive(environmentRef: string): DeploymentRecord | undefined {
    const deploymentId = this.#storage.getActiveDeploymentId(environmentRef);
    return deploymentId === undefined ? undefined : this.#storage.get(deploymentId);
  }
}

export function dryRunDeploy(input: Readonly<{
  publishedRelease: DeployPublishedRelease;
  releaseArtifact: DeployReleaseArtifact;
  environment: EnvironmentProfile;
  acceptanceChecks: readonly AcceptanceCheck[];
  startedAt: string;
  completedAt: string;
}>): DryRunDeploymentResult {
  const releaseSnapshot = JSON.stringify(input.publishedRelease);
  if (input.publishedRelease.artifactHash !== input.releaseArtifact.artifactHash || input.publishedRelease.artifactRef !== input.releaseArtifact.artifactHash) {
    return Object.freeze({ ok: false, diagnostic: Object.freeze({ code: "ARTIFACT_MISMATCH", detail: input.releaseArtifact.artifactHash }) });
  }
  if (!input.environment.runtimeVersions.includes(input.releaseArtifact.manifest.runtimeVersion)) {
    return Object.freeze({ ok: false, diagnostic: Object.freeze({ code: "RUNTIME_INCOMPATIBLE", detail: input.releaseArtifact.manifest.runtimeVersion }) });
  }

  const bindings = [...input.environment.bindings].sort((a, b) => a.name.localeCompare(b.name) || a.kind.localeCompare(b.kind));
  for (const binding of bindings) {
    if ("value" in (binding as unknown as Record<string, unknown>)) {
      return Object.freeze({ ok: false, diagnostic: Object.freeze({ code: "SECRET_VALUE_NOT_ALLOWED", detail: binding.name }) });
    }
  }
  for (const requirement of input.releaseArtifact.environmentSchema.filter((item) => item.required)) {
    if (!bindings.some((binding) => binding.name === requirement.name && binding.kind === requirement.kind && binding.reference.trim().length > 0)) {
      return Object.freeze({ ok: false, diagnostic: Object.freeze({ code: "MISSING_ENVIRONMENT_BINDING", detail: requirement.name }) });
    }
  }

  const healthChecks = Object.freeze([...input.acceptanceChecks]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((check) => Object.freeze({ name: check.name, status: check.pass ? "PASS" as const : "FAIL" as const })));
  const status = healthChecks.every((check) => check.status === "PASS") ? "succeeded" as const : "failed" as const;
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
    status,
    healthChecks,
  });
  if (JSON.stringify(input.publishedRelease) !== releaseSnapshot) throw new Error("DEPLOY_MUTATED_RELEASE");
  return Object.freeze({ ok: true, record, bindings: Object.freeze(bindings.map((binding) => Object.freeze({ ...binding }))) });
}
