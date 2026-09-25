import type { ComponentDescriptor } from "./types.js";
import { normalizeComponentDescriptor } from "./validation.js";

function idToken(value: string): string {
  const id = value.trim();
  if (id.length === 0) throw new Error("component id must be non-empty");
  return id;
}

export class ComponentRegistry {
  readonly #components = new Map<string, ComponentDescriptor>();

  constructor(descriptors: readonly unknown[] = []) {
    for (const descriptor of descriptors) this.register(descriptor);
  }

  register(input: unknown): ComponentDescriptor {
    const descriptor = normalizeComponentDescriptor(input);
    if (this.#components.has(descriptor.id)) throw new Error(`duplicate component descriptor id: ${descriptor.id}`);
    this.#components.set(descriptor.id, descriptor);
    return descriptor;
  }

  get(id: string): ComponentDescriptor | null {
    return this.#components.get(idToken(id)) ?? null;
  }

  list(): readonly ComponentDescriptor[] {
    return Object.freeze([...this.#components.values()].sort((a, b) => a.id.localeCompare(b.id)));
  }
}
