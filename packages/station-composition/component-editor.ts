import type { CompositionGraph } from "./graph.js";
import type { ComponentRegistry } from "./registry.js";
import type { ChildPolicy, ComponentDescriptor, SlotDescriptor, SpanConstraints } from "./types.js";
import { normalizeComponentDescriptor } from "./validation.js";
import {
  createCompositionEditorState,
  type CompositionEditorState,
} from "./editor-engine.js";

export interface ComponentEditorDefinition {
  readonly descriptor: ComponentDescriptor;
  readonly variants: readonly string[];
}

export interface ComponentEditorState {
  readonly definition: ComponentEditorDefinition;
  readonly composition: CompositionEditorState;
}

export type ComponentContractMutation =
  | { readonly kind: "set-child-policy"; readonly childPolicy: ChildPolicy }
  | { readonly kind: "set-constraints"; readonly constraints: SpanConstraints }
  | { readonly kind: "set-slots"; readonly slots: readonly SlotDescriptor[] }
  | { readonly kind: "set-variants"; readonly variants: readonly string[] };

export type ComponentContractMutationResult =
  | { readonly ok: true; readonly state: ComponentEditorState }
  | { readonly ok: false; readonly state: ComponentEditorState; readonly error: string };

function normalizeVariants(input: readonly string[]): readonly string[] {
  const variants = input.map((value) => value.trim());
  if (variants.some((value) => value.length === 0)) throw new Error("component variants must be non-empty tokens");
  if (new Set(variants).size !== variants.length) throw new Error("component variants must be unique");
  return Object.freeze([...variants]);
}

function normalizeDefinition(input: ComponentEditorDefinition): ComponentEditorDefinition {
  return Object.freeze({
    descriptor: normalizeComponentDescriptor(input.descriptor),
    variants: normalizeVariants(input.variants),
  });
}

export function createComponentEditorState(
  definition: ComponentEditorDefinition,
  graph: CompositionGraph,
  registry: ComponentRegistry,
): ComponentEditorState {
  return Object.freeze({
    definition: normalizeDefinition(definition),
    composition: createCompositionEditorState(graph, registry),
  });
}

export function mutateComponentEditorContract(
  state: ComponentEditorState,
  mutation: ComponentContractMutation,
): ComponentContractMutationResult {
  try {
    const descriptor = state.definition.descriptor;
    const nextDescriptor: ComponentDescriptor = mutation.kind === "set-child-policy"
      ? { ...descriptor, childPolicy: mutation.childPolicy }
      : mutation.kind === "set-constraints"
        ? { ...descriptor, constraints: mutation.constraints }
        : mutation.kind === "set-slots"
          ? { ...descriptor, slots: mutation.slots }
          : descriptor;
    const variants = mutation.kind === "set-variants" ? mutation.variants : state.definition.variants;
    const definition = normalizeDefinition({ descriptor: nextDescriptor, variants });
    return Object.freeze({ ok: true, state: Object.freeze({ definition, composition: state.composition }) });
  } catch (error) {
    return Object.freeze({
      ok: false,
      state,
      error: error instanceof Error ? error.message : "invalid component editor mutation",
    });
  }
}
