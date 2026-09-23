function token(value: string, label: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) throw new Error(`${label} must be non-empty`);
  return normalized;
}

const MODIFIER_ORDER = ["Ctrl", "Meta", "Alt", "Shift"] as const;
type Modifier = (typeof MODIFIER_ORDER)[number];

const MODIFIER_ALIASES: Readonly<Record<string, Modifier>> = Object.freeze({
  ctrl: "Ctrl",
  control: "Ctrl",
  cmd: "Meta",
  command: "Meta",
  meta: "Meta",
  option: "Alt",
  alt: "Alt",
  shift: "Shift",
});

export function normalizeShortcut(shortcut: string): string {
  const parts = token(shortcut, "shortcut")
    .split("+")
    .map((part) => token(part, "shortcut segment"));

  const modifiers = new Set<Modifier>();
  let key: string | null = null;

  for (const rawPart of parts) {
    const alias = MODIFIER_ALIASES[rawPart.toLowerCase()];
    if (alias !== undefined) {
      modifiers.add(alias);
      continue;
    }

    if (key !== null) {
      throw new Error("shortcut must contain exactly one non-modifier key");
    }

    key = rawPart.length === 1 ? rawPart.toUpperCase() : rawPart;
  }

  if (key === null) throw new Error("shortcut must contain a non-modifier key");

  return [
    ...MODIFIER_ORDER.filter((modifier) => modifiers.has(modifier)),
    key,
  ].join("+");
}

export class ShortcutRegistry {
  readonly #byShortcut = new Map<string, string>();
  readonly #byCommand = new Map<string, string>();

  register(commandId: string, shortcut: string): string {
    const normalizedCommandId = token(commandId, "command id");
    const normalizedShortcut = normalizeShortcut(shortcut);

    const occupiedBy = this.#byShortcut.get(normalizedShortcut);
    if (occupiedBy !== undefined && occupiedBy !== normalizedCommandId) {
      throw new Error(
        `shortcut conflict: ${normalizedShortcut} is already assigned to ${occupiedBy}`,
      );
    }

    const previousShortcut = this.#byCommand.get(normalizedCommandId);
    if (
      previousShortcut !== undefined &&
      previousShortcut !== normalizedShortcut
    ) {
      this.#byShortcut.delete(previousShortcut);
    }

    this.#byShortcut.set(normalizedShortcut, normalizedCommandId);
    this.#byCommand.set(normalizedCommandId, normalizedShortcut);
    return normalizedShortcut;
  }

  resolve(shortcut: string): string | null {
    return this.#byShortcut.get(normalizeShortcut(shortcut)) ?? null;
  }

  shortcutFor(commandId: string): string | null {
    return this.#byCommand.get(token(commandId, "command id")) ?? null;
  }

  entries(): readonly Readonly<{ shortcut: string; commandId: string }>[] {
    return Object.freeze(
      [...this.#byShortcut.entries()]
        .map(([shortcut, commandId]) => Object.freeze({ shortcut, commandId }))
        .sort((left, right) => left.shortcut.localeCompare(right.shortcut)),
    );
  }
}
