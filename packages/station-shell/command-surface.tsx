"use client";

import { useMemo, useState } from "react";

import {
  type CoreCommandIntent,
  type PresentationCommandRegistry,
  type StationInteractionContext,
} from "@system-builder/station-interaction";
import { Badge, Button, Input } from "@system-builder/ui-core";
import { StationIcon } from "@system-builder/ui-icons";

import type { StationConnectionState } from "./navbar.js";

export type CommandSurfaceMode = "commands" | "search";

export type ProjectedPresentationCommand = Readonly<{
  kind: "presentation";
  id: string;
  title: string;
  shortcut: string | null;
  available: boolean;
  reason: string | null;
}>;

export type ProjectedCoreCommandIntent = Readonly<{
  kind: "core-intent";
  id: string;
  actionRef: string;
  targetRef: string;
  authorization: "core-required";
  requestable: boolean;
  reason: string | null;
}>;

export function projectPresentationCommands(
  registry: PresentationCommandRegistry,
  context: StationInteractionContext,
): readonly ProjectedPresentationCommand[] {
  return Object.freeze(
    registry.list().map((definition) => {
      const availability = registry.availability(definition.id, context);
      return Object.freeze({
        kind: "presentation" as const,
        id: definition.id,
        title: definition.title,
        shortcut: registry.shortcutFor(definition.id),
        available: availability.available,
        reason: availability.available ? null : availability.reason,
      });
    }),
  );
}

export function projectCoreCommandIntents(
  intents: readonly CoreCommandIntent[],
  connection: StationConnectionState,
): readonly ProjectedCoreCommandIntent[] {
  return Object.freeze(
    intents.map((intent) =>
      Object.freeze({
        kind: "core-intent" as const,
        id: intent.id,
        actionRef: intent.actionRef,
        targetRef: intent.targetRef,
        authorization: "core-required" as const,
        requestable: connection !== "disconnected",
        reason:
          connection === "disconnected"
            ? "Core is disconnected; intent cannot be requested."
            : null,
      }),
    ),
  );
}

export type StationCommandSurfaceProps = Readonly<{
  registry: PresentationCommandRegistry;
  context: StationInteractionContext;
  coreIntents?: readonly CoreCommandIntent[];
  connection: StationConnectionState;
  expanded: boolean;
  mode: CommandSurfaceMode;
  onExpandedChange: (expanded: boolean) => void;
}>;

export function StationCommandSurface({
  registry,
  context,
  coreIntents = [],
  connection,
  expanded,
  mode,
  onExpandedChange,
}: StationCommandSurfaceProps) {
  const [query, setQuery] = useState("");
  const presentationCommands = useMemo(
    () => projectPresentationCommands(registry, context),
    [registry, context],
  );
  const projectedCoreIntents = useMemo(
    () => projectCoreCommandIntents(coreIntents, connection),
    [coreIntents, connection],
  );
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const visiblePresentationCommands =
    normalizedQuery.length === 0
      ? presentationCommands
      : presentationCommands.filter((command) =>
          [command.title, command.id, command.shortcut ?? ""]
            .join(" ")
            .toLocaleLowerCase()
            .includes(normalizedQuery),
        );

  const focusLabel =
    context.focus?.kind === "window" ? context.focus.ref : "Desktop";
  const selectionLabel =
    context.selection.refs.length === 0
      ? "No semantic selection"
      : `${context.selection.refs.length} selected`;

  return (
    <section
      aria-label="Station command surface"
      className="shrink-0 border-b bg-[var(--sb-toolbar)]"
      data-slot="station-command-surface"
      data-command-mode={mode}
    >
      <div
        className="flex min-h-10 items-center gap-2 px-3 py-1"
        data-slot="station-toolbar"
      >
        <Badge>Presentation</Badge>
        <span className="min-w-0 truncate text-xs text-muted-foreground">
          Focus: {focusLabel} · {selectionLabel}
        </span>
        <div className="ml-auto flex shrink-0 items-center gap-1">
          {presentationCommands.map((command) => (
            <Button
              key={command.id}
              aria-label={command.title}
              disabled={!command.available}
              onClick={() => void registry.invoke(command.id, context)}
              size="sm"
              title={command.reason ?? command.shortcut ?? command.title}
              variant="ghost"
            >
              {command.title}
              {command.shortcut !== null ? (
                <span className="text-[10px] text-muted-foreground">
                  {command.shortcut}
                </span>
              ) : null}
            </Button>
          ))}
          <Button
            aria-expanded={expanded}
            aria-label={expanded ? "Close command surface" : "Open command surface"}
            onClick={() => onExpandedChange(!expanded)}
            size="icon"
            variant="ghost"
          >
            <StationIcon token="shell.command" />
          </Button>
        </div>
      </div>

      {expanded ? (
        <div
          className="grid gap-3 border-t p-3 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.55fr)]"
          data-slot="station-command-panel"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge>Presentation Commands</Badge>
              <span className="text-xs text-muted-foreground">
                Execute locally against Station presentation state.
              </span>
            </div>
            {mode === "search" ? (
              <Input
                aria-label="Search presentation commands"
                autoFocus
                onChange={(event) => setQuery(event.currentTarget.value)}
                placeholder="Search commands…"
                value={query}
              />
            ) : null}
            <div className="flex flex-wrap gap-2">
              {visiblePresentationCommands.map((command) => (
                <Button
                  key={command.id}
                  disabled={!command.available}
                  onClick={() => void registry.invoke(command.id, context)}
                  size="sm"
                  title={command.reason ?? command.title}
                  variant="outline"
                >
                  {command.title}
                </Button>
              ))}
              {visiblePresentationCommands.length === 0 ? (
                <span className="text-sm text-muted-foreground">
                  No presentation commands match this context.
                </span>
              ) : null}
            </div>
          </div>

          <div className="space-y-2 border-l-0 md:border-l md:pl-3">
            <div className="flex items-center gap-2">
              <Badge>Core Command Intents</Badge>
              <span className="text-xs text-muted-foreground">
                Visible intent never means authorized.
              </span>
            </div>
            {projectedCoreIntents.length === 0 ? (
              <span className="text-sm text-muted-foreground">
                No Core command intents are available in the current context.
              </span>
            ) : (
              <div className="flex flex-wrap gap-2">
                {projectedCoreIntents.map((intent) => (
                  <Button
                    key={intent.id}
                    disabled={!intent.requestable}
                    size="sm"
                    title={
                      intent.reason ??
                      "Request only; Core still validates and authorizes."
                    }
                    variant="outline"
                  >
                    {intent.actionRef}
                    <Badge>Core required</Badge>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
