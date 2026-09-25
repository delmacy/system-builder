export type CollectionItemRef = string;

export interface CollectionItem<T = unknown> {
  readonly ref: CollectionItemRef;
  readonly payload: T;
}

export interface CollectionIndex<T = unknown> {
  readonly items: readonly CollectionItem<T>[];
  readonly byRef: ReadonlyMap<CollectionItemRef, CollectionItem<T>>;
}

export interface SelectionState {
  readonly selectedRef: CollectionItemRef | null;
}

export type SelectionResult =
  | { readonly ok: true; readonly state: SelectionState }
  | { readonly ok: false; readonly state: SelectionState; readonly reason: "unknown-ref" };

export function createCollectionIndex<T>(items: readonly CollectionItem<T>[]): CollectionIndex<T> {
  const byRef = new Map<CollectionItemRef, CollectionItem<T>>();

  for (const item of items) {
    if (byRef.has(item.ref)) {
      throw new Error(`Duplicate collection item ref: ${item.ref}`);
    }
    byRef.set(item.ref, item);
  }

  return { items: [...items], byRef };
}

export function emptySelection(): SelectionState {
  return { selectedRef: null };
}

export function clearSelection(): SelectionState {
  return emptySelection();
}

export function selectKnownRef<T>(
  collection: CollectionIndex<T>,
  state: SelectionState,
  ref: CollectionItemRef,
): SelectionResult {
  if (!collection.byRef.has(ref)) {
    return { ok: false, state, reason: "unknown-ref" };
  }

  return { ok: true, state: { selectedRef: ref } };
}

export function selectedItem<T>(
  collection: CollectionIndex<T>,
  state: SelectionState,
): CollectionItem<T> | null {
  if (state.selectedRef === null) return null;
  return collection.byRef.get(state.selectedRef) ?? null;
}
