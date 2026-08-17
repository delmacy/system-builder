import type { PublishedRelease } from "./index.js";

export interface ReleaseRecordStorage {
  has(identity: string): boolean;
  get(identity: string): PublishedRelease | undefined;
  set(identity: string, record: PublishedRelease): void;
}

export class InMemoryReleaseRecordStorage implements ReleaseRecordStorage {
  readonly #records = new Map<string, PublishedRelease>();

  has(identity: string): boolean {
    return this.#records.has(identity);
  }

  get(identity: string): PublishedRelease | undefined {
    const record = this.#records.get(identity);
    return record === undefined ? undefined : Object.freeze({ ...record });
  }

  set(identity: string, record: PublishedRelease): void {
    this.#records.set(identity, Object.freeze({ ...record }));
  }
}
