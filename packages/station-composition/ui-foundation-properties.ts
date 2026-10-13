/** Strict serializable, inert values for source-owned foundation field components.
 * This module does not grant Editor readiness or authorize runtime actions.
 */
export type FoundationFieldRef = "ui:color-field" | "ui:property-picker" | "ui:document-text-field";
export type FoundationFieldProperties =
  | Readonly<{ label: string; value: string; disabled: boolean }>
  | Readonly<{ label: string; value: string; choices: readonly Readonly<{ id: string; label: string; disabled: boolean }>[]; disabled: boolean }>
  | Readonly<{ label: string; value: string; rows: number; maxLength: number; disabled: boolean; readOnly: boolean }>;

function plainRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}
function keysMatch(value: Record<string, unknown>, expected: readonly string[]): boolean {
  const keys = Reflect.ownKeys(value);
  return keys.length === expected.length && expected.every(key => {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    return !!descriptor && descriptor.enumerable && "value" in descriptor;
  });
}
const safeText = (value: unknown, max: number) =>
  typeof value === "string" && value.length <= max && !/[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F]/u.test(value);
const labelValid = (value: unknown) => safeText(value, 120) && (value as string).trim().length > 0;
const flag = (value: unknown) => typeof value === "boolean";
/** Closed-world validation; never accept callbacks, unknown keys, accessors or CSS. */
export function validFoundationFieldProperties(ref: string, input: unknown): input is FoundationFieldProperties {
  try {
    if (!plainRecord(input) || !labelValid(input.label) || !flag(input.disabled)) return false;
    if (ref === "ui:color-field") {
      return keysMatch(input, ["label", "value", "disabled"]) &&
        typeof input.value === "string" && /^#[0-9a-fA-F]{6}$/.test(input.value);
    }
    if (ref === "ui:property-picker") {
      if (!keysMatch(input, ["label", "value", "choices", "disabled"]) ||
          !Array.isArray(input.choices) || input.choices.length < 1 || input.choices.length > 64 ||
          !safeText(input.value, 120)) return false;
      const ids = new Set<string>();
      for (const choice of input.choices) {
        if (!plainRecord(choice) || !keysMatch(choice, ["id", "label", "disabled"]) ||
            !labelValid(choice.id) || !labelValid(choice.label) || !flag(choice.disabled) ||
            ids.has(choice.id as string)) return false;
        ids.add(choice.id as string);
      }
      return input.choices.some(choice => choice.id === input.value && choice.disabled === false);
    }
    if (ref === "ui:document-text-field") {
      return keysMatch(input, ["label", "value", "rows", "maxLength", "disabled", "readOnly"]) &&
        Number.isSafeInteger(input.rows) && (input.rows as number) >= 1 && (input.rows as number) <= 24 &&
        Number.isSafeInteger(input.maxLength) && (input.maxLength as number) >= 1 &&
        (input.maxLength as number) <= 10000 && flag(input.readOnly) &&
        safeText(input.value, input.maxLength as number);
    }
    return false;
  } catch {
    return false;
  }
}
