export interface CollectionMember {
  readonly key: string;
  readonly parentKey?: string;
}

export interface StationCollection {
  readonly revision: number;
  readonly members: readonly CollectionMember[];
  readonly semanticOrder: readonly string[];
}

export type CollectionOrderResult =
  | { readonly ok: true; readonly changed: boolean; readonly collection: StationCollection }
  | { readonly ok: false; readonly reason: "malformed" | "stale-revision" | "unknown-member" | "duplicate-member"; readonly collection: StationCollection };

function freezeCollection(revision: number, members: readonly CollectionMember[], semanticOrder: readonly string[]): StationCollection {
  return Object.freeze({
    revision,
    members: Object.freeze(members.map((member) => Object.freeze({ ...member }))),
    semanticOrder: Object.freeze([...semanticOrder]),
  });
}

function validKey(key: unknown): key is string {
  return typeof key === "string" && key.trim().length > 0;
}

export function createStationCollection(members: readonly CollectionMember[]): StationCollection {
  const keys = members.map((member) => member.key);
  if (keys.some((key) => !validKey(key))) throw new Error("collection member key must be non-empty");
  if (new Set(keys).size !== keys.length) throw new Error("collection member keys must be unique");
  const keySet = new Set(keys);
  if (members.some((member) => member.parentKey !== undefined && (!validKey(member.parentKey) || !keySet.has(member.parentKey) || member.parentKey === member.key))) {
    throw new Error("collection topology must reference a distinct known parent");
  }
  return freezeCollection(0, members, keys);
}

function validateOrder(collection: StationCollection, order: readonly string[]): CollectionOrderResult | undefined {
  if (!Array.isArray(order) || order.some((key) => !validKey(key)) || order.length !== collection.semanticOrder.length) {
    return Object.freeze({ ok: false, reason: "malformed", collection });
  }
  if (new Set(order).size !== order.length) return Object.freeze({ ok: false, reason: "duplicate-member", collection });
  const known = new Set(collection.semanticOrder);
  if (order.some((key) => !known.has(key))) return Object.freeze({ ok: false, reason: "unknown-member", collection });
  return undefined;
}

export function projectVisualOrder(collection: StationCollection, order: readonly string[]): CollectionOrderResult {
  const invalid = validateOrder(collection, order);
  if (invalid) return invalid;
  return Object.freeze({ ok: true, changed: order.some((key, index) => key !== collection.semanticOrder[index]), collection });
}

export function reorderCollectionSemantics(collection: StationCollection, expectedRevision: number, order: readonly string[]): CollectionOrderResult {
  if (expectedRevision !== collection.revision) return Object.freeze({ ok: false, reason: "stale-revision", collection });
  const invalid = validateOrder(collection, order);
  if (invalid) return invalid;
  const changed = order.some((key, index) => key !== collection.semanticOrder[index]);
  if (!changed) return Object.freeze({ ok: true, changed: false, collection });
  return Object.freeze({ ok: true, changed: true, collection: freezeCollection(collection.revision + 1, collection.members, order) });
}
