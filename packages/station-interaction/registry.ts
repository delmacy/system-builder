import { ShortcutRegistry } from "./shortcuts.js";
import {
  available,
  type CommandAvailability,
  type PresentationCommandDefinition,
  type StationInteractionContext,
} from "./types.js";

function token(value: string, label: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) throw new Error(`${label} must be non-empty`);
  return normalized;
}

function normalizeDefinition(
  definition: PresentationCommandDefinition,
): PresentationCommandDefinition {
  if (definition.kind !== "presentation") {
    throw new Error("presentation registry accepts presentation commands only");
  }

  const id = token(definition.id, "command id");
  const title = token(definition.title, "command title");

  return Object.freeze({
    kind: "presentation",
    id,
    title,
    ...(definition.description === undefined
      ? {}
      : { description: token(definition.description, "command description") }),
    ...(definition.shortcut === undefined
      ? {}
      : { shortcut: definition.shortcut }),
    ...(definition.availability === undefined
      ? {}
      : { availability: definition.availability }),
    execute: definition.execute,
  });
}

export class CommandUnavailableError extends Error {
  readonly commandId: string;
  readonly reason: string;

  constructor(commandId: string, reason: string) {
    super(`command ${commandId} is unavailable: ${reason}`);
    this.name = "CommandUnavailableError";
    this.commandId = commandId;
    this.reason = reason;
  }
}

export class PresentationCommandRegistry {
  readonly #definitions = new Map<string, PresentationCommandDefinition>();
  readonly #shortcuts = new ShortcutRegistry();

  register(definition: PresentationCommandDefinition): PresentationCommandDefinition {
    const normalized = normalizeDefinition(definition);

    if (this.#definitions.has(normalized.id)) {
      throw new Error(`duplicate presentation command id: ${normalized.id}`);
    }

    if (normalized.shortcut !== undefined) {
      this.#shortcuts.register(normalized.id, normalized.shortcut);
    }

    this.#definitions.set(normalized.id, normalized);
    return normalized;
  }

  get(commandId: string): PresentationCommandDefinition | null {
    return this.#definitions.get(token(commandId, "command id")) ?? null;
  }

  list(): readonly PresentationCommandDefinition[] {
    return Object.freeze(
      [...this.#definitions.values()].sort((left, right) =>
        left.id.localeCompare(right.id),
      ),
    );
  }

  availability(
    commandId: string,
    context: StationInteractionContext,
  ): CommandAvailability {
    const definition = this.#require(commandId);
    return definition.availability?.(context) ?? available();
  }

  async invoke(
    commandId: string,
    context: StationInteractionContext,
  ): Promise<void> {
    const definition = this.#require(commandId);
    const state = definition.availability?.(context) ?? available();

    if (!state.available) {
      throw new CommandUnavailableError(definition.id, state.reason);
    }

    await definition.execute(context);
  }

  resolveShortcut(shortcut: string): PresentationCommandDefinition | null {
    const commandId = this.#shortcuts.resolve(shortcut);
    return commandId === null ? null : this.#require(commandId);
  }

  shortcutFor(commandId: string): string | null {
    return this.#shortcuts.shortcutFor(commandId);
  }

  #require(commandId: string): PresentationCommandDefinition {
    const normalizedId = token(commandId, "command id");
    const definition = this.#definitions.get(normalizedId);
    if (definition === undefined) {
      throw new Error(`unknown presentation command: ${normalizedId}`);
    }
    return definition;
  }
}
