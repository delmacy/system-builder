import { DeploymentRegistry, type DeploymentRecord } from "./index.js";
import {
  startManagedLocalRuntime,
  type ManagedLocalRuntime,
  type ManagedLocalRuntimeDiagnostic,
  type ManagedLocalRuntimeSnapshot,
} from "./managed-process.js";

export type ReconciledRuntimeSnapshot = Readonly<{
  kind: "ReconciledRuntime";
  deploymentId: string;
  process: ManagedLocalRuntimeSnapshot;
}>;

export type RuntimeReconciliationDiagnostic =
  | ManagedLocalRuntimeDiagnostic
  | Readonly<{
      code:
        | "NO_ACTIVE_AUTHORITY"
        | "AUTHORITY_RELEASE_MISMATCH"
        | "AUTHORITY_ARTIFACT_MISMATCH"
        | "AUTHORITY_ENVIRONMENT_MISMATCH"
        | "AUTHORITY_CHANGED_DURING_RECONCILIATION";
      detail: string;
    }>;

export type RuntimeReconciliationInput = Parameters<typeof startManagedLocalRuntime>[0];

export type RuntimeReconciliationResult =
  | Readonly<{
      ok: true;
      deployment: DeploymentRecord;
      active: ReconciledRuntimeSnapshot;
      alreadyReconciled: boolean;
    }>
  | Readonly<{
      ok: false;
      diagnostic: RuntimeReconciliationDiagnostic;
      active: ReconciledRuntimeSnapshot | null;
    }>;

type ReconciledEntry = Readonly<{ record: DeploymentRecord; managed: ManagedLocalRuntime }>;

function releaseRef(input: RuntimeReconciliationInput): string {
  return `${input.publishedRelease.releaseId}@${input.publishedRelease.version}`;
}

function snapshot(entry: ReconciledEntry | undefined): ReconciledRuntimeSnapshot | null {
  if (entry === undefined) return null;
  return Object.freeze({
    kind: "ReconciledRuntime",
    deploymentId: entry.record.deploymentId,
    process: entry.managed.snapshot(),
  });
}

function mismatch(
  code: Extract<RuntimeReconciliationDiagnostic, { code: string }>["code"],
  detail: string,
): RuntimeReconciliationResult {
  return Object.freeze({
    ok: false,
    diagnostic: Object.freeze({ code, detail }),
    active: null,
  });
}

export class SingleHostRuntimeReconciler {
  readonly #registry: DeploymentRegistry;
  readonly #active = new Map<string, ReconciledEntry>();

  constructor(registry: DeploymentRegistry) {
    this.#registry = registry;
  }

  getActive(environmentRef: string): ReconciledRuntimeSnapshot | null {
    return snapshot(this.#active.get(environmentRef));
  }

  async health(environmentRef: string) {
    const active = this.#active.get(environmentRef);
    if (active === undefined) throw new Error(`RECONCILED_RUNTIME_NOT_MANAGED:${environmentRef}`);
    return active.managed.health();
  }

  async shutdown(environmentRef: string): Promise<ReconciledRuntimeSnapshot | null> {
    const active = this.#active.get(environmentRef);
    if (active === undefined) return null;
    await active.managed.stop();
    this.#active.delete(environmentRef);
    return snapshot(active);
  }

  async reconcile(input: RuntimeReconciliationInput): Promise<RuntimeReconciliationResult> {
    const environmentRef = input.environment.environmentRef;
    const authority = this.#registry.getActive(environmentRef);
    if (authority === undefined) {
      return mismatch("NO_ACTIVE_AUTHORITY", environmentRef);
    }
    if (authority.environmentRef !== environmentRef) {
      return mismatch("AUTHORITY_ENVIRONMENT_MISMATCH", `${authority.environmentRef}:${environmentRef}`);
    }
    if (authority.publishedReleaseRef !== releaseRef(input)) {
      return mismatch("AUTHORITY_RELEASE_MISMATCH", `${authority.publishedReleaseRef}:${releaseRef(input)}`);
    }
    if (
      authority.releaseHash !== input.publishedRelease.artifactHash ||
      authority.releaseHash !== input.releaseArtifact.artifactHash ||
      input.publishedRelease.artifactRef !== input.releaseArtifact.artifactHash
    ) {
      return mismatch("AUTHORITY_ARTIFACT_MISMATCH", authority.deploymentId);
    }

    const existing = this.#active.get(environmentRef);
    if (existing !== undefined && existing.record.deploymentId === authority.deploymentId) {
      return Object.freeze({
        ok: true,
        deployment: authority,
        active: snapshot(existing)!,
        alreadyReconciled: true,
      });
    }

    const started = await startManagedLocalRuntime(input);
    if (!started.ok) {
      return Object.freeze({ ok: false, diagnostic: started.diagnostic, active: snapshot(existing) });
    }

    const authorityAfterStart = this.#registry.getActive(environmentRef);
    if (authorityAfterStart?.deploymentId !== authority.deploymentId) {
      await started.managed.stop();
      return Object.freeze({
        ok: false,
        diagnostic: Object.freeze({
          code: "AUTHORITY_CHANGED_DURING_RECONCILIATION" as const,
          detail: `${authority.deploymentId}:${authorityAfterStart?.deploymentId ?? "null"}`,
        }),
        active: snapshot(existing),
      });
    }

    const next = Object.freeze({ record: authority, managed: started.managed });
    this.#active.set(environmentRef, next);
    if (existing !== undefined) await existing.managed.stop();
    return Object.freeze({
      ok: true,
      deployment: authority,
      active: snapshot(next)!,
      alreadyReconciled: false,
    });
  }
}
