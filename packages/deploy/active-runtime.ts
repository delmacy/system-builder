import { DeploymentRegistry, dryRunDeploy, type DeploymentActivationDecision, type DeploymentRecord } from "./index.js";
import {
  startManagedLocalRuntime,
  type ManagedLocalRuntime,
  type ManagedLocalRuntimeDiagnostic,
  type ManagedLocalRuntimeSnapshot,
} from "./managed-process.js";

export type ActiveManagedRuntimeSnapshot = Readonly<{
  kind: "ActiveManagedRuntime";
  deploymentId: string;
  process: ManagedLocalRuntimeSnapshot;
}>;

export type ActiveRuntimePromotionInput = Parameters<typeof startManagedLocalRuntime>[0] & Readonly<{
  expectedActiveDeploymentId: string | null;
  startedAt: string;
  completedAt: string;
}>;

export type ActiveRuntimePromotionResult =
  | Readonly<{
      ok: true;
      promoted: boolean;
      decision: DeploymentActivationDecision;
      candidateRecord: DeploymentRecord;
      active: ActiveManagedRuntimeSnapshot | null;
      candidateFinal: ManagedLocalRuntimeSnapshot;
    }>
  | Readonly<{
      ok: false;
      promoted: false;
      outcome: "candidate-failed" | "local-active-mismatch";
      diagnostic: ManagedLocalRuntimeDiagnostic | Readonly<{ code: "LOCAL_ACTIVE_MISMATCH"; detail: string }>;
      active: ActiveManagedRuntimeSnapshot | null;
    }>;

type ActiveEntry = Readonly<{ record: DeploymentRecord; managed: ManagedLocalRuntime }>;

function snapshot(entry: ActiveEntry | undefined): ActiveManagedRuntimeSnapshot | null {
  if (entry === undefined) return null;
  return Object.freeze({
    kind: "ActiveManagedRuntime",
    deploymentId: entry.record.deploymentId,
    process: entry.managed.snapshot(),
  });
}

export class SingleHostActiveRuntimeOrchestrator {
  readonly #registry: DeploymentRegistry;
  readonly #active = new Map<string, ActiveEntry>();

  constructor(registry: DeploymentRegistry) {
    this.#registry = registry;
  }

  getActive(environmentRef: string): ActiveManagedRuntimeSnapshot | null {
    return snapshot(this.#active.get(environmentRef));
  }

  async health(environmentRef: string) {
    const active = this.#active.get(environmentRef);
    if (active === undefined) throw new Error(`ACTIVE_RUNTIME_NOT_MANAGED:${environmentRef}`);
    return active.managed.health();
  }

  async stopActive(environmentRef: string): Promise<ActiveManagedRuntimeSnapshot | null> {
    const active = this.#active.get(environmentRef);
    if (active === undefined) return null;
    await active.managed.stop();
    this.#active.delete(environmentRef);
    return snapshot(active);
  }

  async promote(input: ActiveRuntimePromotionInput): Promise<ActiveRuntimePromotionResult> {
    const environmentRef = input.environment.environmentRef;
    const previous = this.#active.get(environmentRef);
    const previousId = previous?.record.deploymentId ?? null;
    if (previousId !== input.expectedActiveDeploymentId) {
      return Object.freeze({
        ok: false,
        promoted: false,
        outcome: "local-active-mismatch",
        diagnostic: Object.freeze({
          code: "LOCAL_ACTIVE_MISMATCH" as const,
          detail: `${input.expectedActiveDeploymentId ?? "null"}:${previousId ?? "null"}`,
        }),
        active: snapshot(previous),
      });
    }

    const started = await startManagedLocalRuntime(input);
    if (!started.ok) {
      return Object.freeze({
        ok: false,
        promoted: false,
        outcome: "candidate-failed",
        diagnostic: started.diagnostic,
        active: snapshot(previous),
      });
    }

    const candidate = dryRunDeploy({
      publishedRelease: input.publishedRelease,
      releaseArtifact: input.releaseArtifact,
      environment: input.environment,
      acceptanceChecks: [{ name: "runtime-health", pass: true }],
      startedAt: input.startedAt,
      completedAt: input.completedAt,
    });
    if (!candidate.ok) {
      await started.managed.stop();
      throw new Error(`ACTIVE_RUNTIME_RECORD_FAILED:${candidate.diagnostic.code}:${candidate.diagnostic.detail}`);
    }

    let decision: DeploymentActivationDecision;
    try {
      decision = await this.#registry.activateCandidateAtomically(candidate.record, input.expectedActiveDeploymentId);
    } catch (error) {
      await started.managed.stop();
      throw error;
    }

    if (decision.outcome === "activated") {
      const next = Object.freeze({ record: candidate.record, managed: started.managed });
      this.#active.set(environmentRef, next);
      if (previous !== undefined && previous.record.deploymentId !== candidate.record.deploymentId) {
        await previous.managed.stop();
      }
      return Object.freeze({
        ok: true,
        promoted: true,
        decision,
        candidateRecord: candidate.record,
        active: snapshot(next),
        candidateFinal: started.managed.snapshot(),
      });
    }

    const candidateFinal = await started.managed.stop();
    return Object.freeze({
      ok: true,
      promoted: false,
      decision,
      candidateRecord: candidate.record,
      active: snapshot(previous),
      candidateFinal,
    });
  }
}
