import type { DeploymentRecord } from "./index.js";

export interface DeploymentRecordStorage {
  has(deploymentId: string): boolean;
  get(deploymentId: string): DeploymentRecord | undefined;
  set(deploymentId: string, record: DeploymentRecord): void;
  values(): readonly DeploymentRecord[];
  getActiveDeploymentId(environmentRef: string): string | undefined;
  setActiveDeploymentId(environmentRef: string, deploymentId: string): void;
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
}
