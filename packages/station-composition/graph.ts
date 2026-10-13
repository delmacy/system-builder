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
  /** Inert display override for admitted installed controls; never action/HTML authority. */
  readonly text?: string;
  /** Typed inert component presentation only; never action/authorization. */
  readonly properties?: ComponentProperties;
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
  readonly defaultChecked?: never;
  readonly kind?: never;
  readonly inputType?: never;
  readonly placeholder?: never;
  readonly readOnly?: never;
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

export interface InputProperties {
  readonly defaultChecked?: never;
  readonly kind: "input";
  readonly inputType: "text" | "email" | "search";
  readonly placeholder: string;
  readonly disabled: boolean;
  readonly readOnly: boolean;
  /** Type refinements exclude legacy Button keys; these are never wire fields. */
  readonly variant?: never;
  readonly presentation?: never;
}
export interface CheckboxProperties {
  readonly kind: "checkbox";
  readonly defaultChecked: boolean;
  readonly disabled: boolean;
  readonly inputType?: never;
  readonly placeholder?: never;
  readonly readOnly?: never;
  readonly variant?: never;
  readonly presentation?: never;
}
export interface DialogProperties {
  readonly kind: "dialog";
  readonly title: string;
  readonly description: string;
  readonly disabled: boolean;
  readonly defaultChecked?: never;
  readonly inputType?: never;
  readonly placeholder?: never;
  readonly readOnly?: never;
  readonly variant?: never;
  readonly presentation?: never;
}
/** Plain modal presentation; current open state is not portable application authority. */
export function validDialogProperties(value: unknown): value is DialogProperties {
  try {
    const fields = inertFields(value, ["kind", "title", "description", "disabled"]);
    return !!fields && fields.kind === "dialog" && validButtonDisplayText(fields.title) &&
      typeof fields.description === "string" && [...fields.description].length <= 512 &&
      !/[\p{Cc}\uD800-\uDFFF]/u.test(fields.description) && typeof fields.disabled === "boolean";
  } catch { return false; }
}
export type ComponentProperties = ButtonProperties | InputProperties | CheckboxProperties | DialogProperties;
export function supportsComponentDisplayText(componentRef: string): boolean {
  return supportsButtonDisplayText(componentRef) || ["component:input", "component:checkbox", "component:dialog"].includes(componentRef);
}
export function validInputProperties(value: unknown): value is InputProperties {
  try {
    const fields = inertFields(value, ["kind", "inputType", "placeholder", "disabled", "readOnly"]);
    return !!fields && fields.kind === "input" && ["text", "email", "search"].includes(fields.inputType as string) &&
      typeof fields.placeholder === "string" && [...fields.placeholder].length <= 256 &&
      !/[\p{Cc}\uD800-\uDFFF]/u.test(fields.placeholder) &&
      typeof fields.disabled === "boolean" && typeof fields.readOnly === "boolean";
  } catch { return false; }
}
export function validComponentProperties(value: unknown, componentRef: string): value is ComponentProperties {
  return supportsButtonDisplayText(componentRef) ? validButtonProperties(value) :
    componentRef === "component:input" ? validInputProperties(value) :
      componentRef === "component:checkbox" ? validCheckboxProperties(value) :
        componentRef === "component:dialog" && validDialogProperties(value);
}
export function freezeComponentProperties(value: ComponentProperties): ComponentProperties {
  if (validButtonProperties(value)) return freezeButtonProperties(value);
  if (validCheckboxProperties(value)) return Object.freeze({ kind: "checkbox", defaultChecked: value.defaultChecked, disabled: value.disabled });
  if (validDialogProperties(value)) return Object.freeze({ kind: "dialog", title: value.title, description: value.description, disabled: value.disabled });
  if (!validInputProperties(value)) throw new Error("Invalid component properties");
  return Object.freeze({ kind: "input", inputType: value.inputType, placeholder: value.placeholder,
    disabled: value.disabled, readOnly: value.readOnly });
}

/** Initial visual default only; application current checked/value state is never admitted. */
export function validCheckboxProperties(value: unknown): value is CheckboxProperties {
  try {
    const fields = inertFields(value, ["kind", "defaultChecked", "disabled"]);
    return !!fields && fields.kind === "checkbox" && typeof fields.defaultChecked === "boolean" && typeof fields.disabled === "boolean";
  } catch { return false; }
}
