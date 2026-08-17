import type { SoftwareCatalogRecord } from "./index.js";

export interface CatalogRecordStorage {
  has(identity: string): boolean;
  set(identity: string, record: SoftwareCatalogRecord): void;
  values(): readonly SoftwareCatalogRecord[];
}

export class InMemoryCatalogRecordStorage implements CatalogRecordStorage {
  readonly #records = new Map<string, SoftwareCatalogRecord>();

  has(identity: string): boolean {
    return this.#records.has(identity);
  }

  set(identity: string, record: SoftwareCatalogRecord): void {
    this.#records.set(identity, record);
  }

  values(): readonly SoftwareCatalogRecord[] {
    return Object.freeze([...this.#records.values()]);
  }
}
