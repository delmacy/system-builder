import type { DeploymentRecord } from "./index.js";

export type AtomicDeploymentActivationResult = Readonly<{
  outcome: "activated" | "retained-active" | "rejected-no-active" | "stale-active";
  previousActiveDeploymentId: string | null;
  resultingActiveDeploymentId: string | null;
}>;

export interface DeploymentRecordStorage {
  has(deploymentId: string): boolean;
  get(deploymentId: string): DeploymentRecord | undefined;
  set(deploymentId: string, record: DeploymentRecord): void;
  values(): readonly DeploymentRecord[];
  getActiveDeploymentId(environmentRef: string): string | undefined;
  setActiveDeploymentId(environmentRef: string, deploymentId: string): void;
  activateAtomically?(
    record: DeploymentRecord,
    expectedActiveDeploymentId: string | null,
  ): Promise<AtomicDeploymentActivationResult>;
}

export class InMemoryDeploymentRecordStorage implements DeploymentRecordStorage {
  readonly #records = new Map<string, DeploymentRecord>();
  readonly #active = new Map<string, string>();

  has(deploymentId: string): boolean {
    return this.#records.has(deploymentId);
  }

  get(deploymentId: string): DeploymentRecord | undefined {
    return this.#records.get(deploymentId);
  }

  set(deploymentId: string, record: DeploymentRecord): void {
    this.#records.set(deploymentId, record);
  }

  values(): readonly DeploymentRecord[] {
    return Object.freeze([...this.#records.values()]);
  }

  getActiveDeploymentId(environmentRef: string): string | undefined {
    return this.#active.get(environmentRef);
  }

  setActiveDeploymentId(environmentRef: string, deploymentId: string): void {
    this.#active.set(environmentRef, deploymentId);
  }

  async activateAtomically(
    record: DeploymentRecord,
    expectedActiveDeploymentId: string | null,
  ): Promise<AtomicDeploymentActivationResult> {
    const previous = this.#active.get(record.environmentRef) ?? null;
    this.#records.set(record.deploymentId, record);

    if (record.status === "failed") {
      return Object.freeze({
        outcome: previous === null ? "rejected-no-active" : "retained-active",
        previousActiveDeploymentId: previous,
        resultingActiveDeploymentId: previous,
      });
    }

    if (previous !== expectedActiveDeploymentId) {
      return Object.freeze({
        outcome: "stale-active",
        previousActiveDeploymentId: previous,
        resultingActiveDeploymentId: previous,
      });
    }

    this.#active.set(record.environmentRef, record.deploymentId);
    return Object.freeze({
      outcome: "activated",
      previousActiveDeploymentId: previous,
      resultingActiveDeploymentId: record.deploymentId,
    });
  }
}
