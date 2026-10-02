export type FocusKind = "window" | "tool" | "surface" | "control";

export type FocusTarget = Readonly<{
  kind: FocusKind;
  ref: string;
}>;

export type SelectionContext = Readonly<{
  refs: readonly string[];
  primaryRef: string | null;
}>;

export type StationInteractionContext = Readonly<{
  focus: FocusTarget | null;
  selection: SelectionContext;
  surfaceRef: string | null;
}>;

export type CommandAvailability =
  | Readonly<{ available: true }>
  | Readonly<{ available: false; reason: string }>;

export type PresentationCommandDefinition = Readonly<{
  kind: "presentation";
  id: string;
  title: string;
  description?: string;
  shortcut?: string;
  availability?: (context: StationInteractionContext) => CommandAvailability;
  execute: (context: StationInteractionContext) => void | Promise<void>;
}>;

/** Owner-qualified data projected by Station without acquiring mutation authority. */
export type CommandOwnerCurrentness = "current" | "stale" | "unknown";
export type CommandOwnerResult = "accepted" | "effective" | "partial" | "unknown" | "stale";
export type CommandOwnerAffordance = "retry" | "compensate";

export type CommandOwnerProjection = Readonly<{
  ownerRef: string;
  targetRef: string;
  currentness: CommandOwnerCurrentness;
  result?: CommandOwnerResult;
  affordances?: readonly CommandOwnerAffordance[];
}>;

/**
 * Carries owner-provided command state without deriving target, success,
 * authorization, retry, or compensation from Station presentation context.
 */
export function commandOwnerProjection(input: CommandOwnerProjection): CommandOwnerProjection {
  const ownerRef = input.ownerRef.trim();
  const targetRef = input.targetRef.trim();
  if (ownerRef.length === 0) throw new Error("command projection ownerRef must be non-empty");
  if (targetRef.length === 0) throw new Error("command projection targetRef must be non-empty");

  return Object.freeze({
    ownerRef,
    targetRef,
    currentness: input.currentness,
    ...(input.result === undefined ? {} : { result: input.result }),
    ...(input.affordances === undefined
      ? {}
      : { affordances: Object.freeze([...input.affordances]) }),
  });
}

/**
 * Descriptor reserved for future Station SDK/Core command routing.
 *
 * It is intentionally not executable by PresentationCommandRegistry.
 * Authority remains with Core/domain owners.
 */
export type CoreCommandIntent = Readonly<{
  kind: "core-intent";
  id: string;
  actionRef: string;
  targetRef: string;
  payload: Readonly<Record<string, unknown>>;
}>;

export function available(): CommandAvailability {
  return Object.freeze({ available: true });
}

export function unavailable(reason: string): CommandAvailability {
  const normalized = reason.trim();
  if (normalized.length === 0) throw new Error("command unavailability reason must be non-empty");
  return Object.freeze({ available: false, reason: normalized });
}
