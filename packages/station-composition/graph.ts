import type { ComponentDescriptor } from "./types.js";

export type CompositionNodeRef = string;
export type ComponentRef = ComponentDescriptor["id"];
export type CompositionSlotRef = string;

export interface CompositionNodePlacement {
  readonly parentRef: CompositionNodeRef;
  readonly slotRef: CompositionSlotRef;
  readonly columnSpan: number;
  readonly rowSpan: number;
}

export interface CompositionNode {
  readonly ref: CompositionNodeRef;
  readonly componentRef: ComponentRef;
  /** Inert display override for admitted installed buttons; never action/HTML authority. */
  readonly text?: string;
  /** Typed inert button presentation only; never action/authorization. */
  readonly properties?: ButtonProperties;
  readonly placement?: CompositionNodePlacement;
}

export interface CompositionGraph {
  readonly rootRef: CompositionNodeRef;
  readonly nodes: readonly CompositionNode[];
}

export function defineCompositionGraph(graph: CompositionGraph): CompositionGraph {
  return graph;
}

/** Bounded plain display data. No trimming/normalization: accepted text round-trips exactly. */
export function validButtonDisplayText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && [...value].length <= 256 &&
    !/[\p{Cc}\uD800-\uDFFF]/u.test(value);
}
export function supportsButtonDisplayText(componentRef: string): boolean {
  return componentRef === "component:button" || componentRef === "component:lab-button";
}

export interface ButtonIconPresentation {
  readonly mode: "text" | "icon-text" | "icon";
  readonly placement: "start" | "end";
  readonly icon: Readonly<{ catalogVersion: string; assetRef: string }>;
}
export interface ButtonProperties {
  readonly variant: "default" | "outline" | "ghost";
  readonly disabled: boolean;
  readonly presentation?: ButtonIconPresentation;
}
/** Check descriptors before values: hostile nested accessors must never run. */
export function validButtonProperties(value: unknown): value is ButtonProperties {
  try {
    if (!value || typeof value !== "object" || Array.isArray(value) ||
        ![Object.prototype, null].includes(Object.getPrototypeOf(value))) return false;
    const keys = Reflect.ownKeys(value);
    if (!keys.includes("variant") || !keys.includes("disabled") ||
        keys.some(key => !["variant", "disabled", "presentation"].includes(key as string))) return false;
    if (keys.includes("presentation")) {
      const d = Object.getOwnPropertyDescriptor(value, "presentation");
      if (!d?.enumerable || !("value" in d) || !validButtonIconPresentation(d.value)) return false;
    }
    const variant = Object.getOwnPropertyDescriptor(value, "variant");
    const disabled = Object.getOwnPropertyDescriptor(value, "disabled");
    return !!variant && !!disabled && variant.enumerable === true && disabled.enumerable === true &&
      "value" in variant && "value" in disabled &&
      ["default", "outline", "ghost"].includes(variant.value as string) && typeof disabled.value === "boolean";
  } catch { return false; }
}

function inertFields(value: unknown, expected: readonly string[]): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value) ||
      ![Object.prototype, null].includes(Object.getPrototypeOf(value))) return null;
  const keys = Reflect.ownKeys(value);
  if (keys.length !== expected.length || keys.some(key => typeof key !== "string" || !expected.includes(key))) return null;
  const result: Record<string, unknown> = {};
  for (const key of expected) {
    const d = Object.getOwnPropertyDescriptor(value, key);
    if (!d?.enumerable || !("value" in d)) return null;
    result[key] = d.value as unknown;
  }
  return result;
}
/** Syntactic portable admission; asset availability is resolved by the ICON owner. */
export function validButtonIconPresentation(value: unknown): value is ButtonIconPresentation {
  try {
    const p = inertFields(value, ["mode", "placement", "icon"]);
    if (!p || !["text", "icon-text", "icon"].includes(p.mode as string) || !["start", "end"].includes(p.placement as string)) return false;
    const icon = inertFields(p.icon, ["catalogVersion", "assetRef"]);
    return !!icon && typeof icon.assetRef === "string" && icon.assetRef.length <= 128 &&
      /^glyph:[a-z0-9]+(?:-[a-z0-9]+)*$/.test(icon.assetRef) && typeof icon.catalogVersion === "string" &&
      icon.catalogVersion.length <= 32 && /^\d+\.\d+\.\d+$/.test(icon.catalogVersion);
  } catch { return false; }
}
/** Copy every admitted nested field; callers cannot mutate a retained revision by alias. */
export function freezeButtonProperties(value: ButtonProperties): ButtonProperties {
  if (!validButtonProperties(value)) throw new Error("Invalid button properties");
  return Object.freeze({ variant: value.variant, disabled: value.disabled,
    ...(value.presentation === undefined ? {} : { presentation: Object.freeze({ mode: value.presentation.mode,
      placement: value.presentation.placement, icon: Object.freeze({ catalogVersion: value.presentation.icon.catalogVersion,
        assetRef: value.presentation.icon.assetRef }) }) }) });
}
