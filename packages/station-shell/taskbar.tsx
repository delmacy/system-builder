"use client";

import type { AppManifest } from "@system-builder/station-app-runtime";
import type { WindowDefinition, WindowInstance } from "@system-builder/station-windowing";
import { Button, cn } from "@system-builder/ui-core";
import { StationIcon } from "@system-builder/ui-icons";

export type StationTaskbarWindow = Readonly<{
  instance: WindowInstance;
  definition: WindowDefinition;
}>;

export type StationTaskbarProps = Readonly<{
  apps: readonly AppManifest[];
  windows: readonly StationTaskbarWindow[];
  activeWindowRef: string | null;
  launcherOpen: boolean;
  onLauncherOpenChange: (open: boolean) => void;
  onLaunchApp: (appId: string) => void;
  onActivateWindow: (instance: WindowInstance) => void;
}>;

export function StationTaskbar({
  apps,
  windows,
  activeWindowRef,
  launcherOpen,
  onLauncherOpenChange,
  onLaunchApp,
  onActivateWindow,
}: StationTaskbarProps) {
  return (
    <footer
      data-slot="station-taskbar"
      className="relative flex h-12 shrink-0 items-center gap-2 border-t bg-[var(--sb-taskbar)] px-3"
    >
      {launcherOpen ? (
        <section
          aria-label="Launcher"
          data-slot="station-launcher"
          className="absolute bottom-14 left-3 z-[10000] w-80 overflow-hidden rounded-xl border bg-popover p-2 text-popover-foreground shadow-2xl"
        >
          <div className="px-2 pb-2 pt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Applications
          </div>
          <div className="grid gap-1">
            {apps.map((app) => (
              <Button
                key={app.id}
                className="h-auto justify-start gap-3 px-3 py-2 text-left"
                data-app-ref={app.id}
                variant="ghost"
                onClick={() => {
                  onLaunchApp(app.id);
                  onLauncherOpenChange(false);
                }}
              >
                <StationIcon token={app.icon} size={18} />
                <span className="min-w-0">
                  <span className="block truncate font-medium">{app.name}</span>
                  {app.description ? (
                    <span className="block truncate text-xs font-normal text-muted-foreground">
                      {app.description}
                    </span>
                  ) : null}
                </span>
              </Button>
            ))}
          </div>
        </section>
      ) : null}

      <Button
        aria-expanded={launcherOpen}
        aria-label="Open applications"
        data-slot="launcher-trigger"
        size="icon"
        variant={launcherOpen ? "secondary" : "ghost"}
        onClick={() => onLauncherOpenChange(!launcherOpen)}
      >
        <StationIcon token="shell.home" size={18} />
      </Button>

      <div className="h-6 w-px shrink-0 bg-border" aria-hidden="true" />

      <div
        className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto"
        data-slot="taskbar-windows"
      >
        {windows.map(({ instance, definition }) => {
          const active =
            activeWindowRef === instance.windowRef &&
            instance.lifecycle === "OPEN";

          return (
            <Button
              key={instance.windowRef}
              className={cn(
                "max-w-56 justify-start",
                instance.lifecycle === "MINIMIZED" && "text-muted-foreground",
              )}
              data-window-active={active ? "true" : "false"}
              data-window-lifecycle={instance.lifecycle}
              variant={active ? "secondary" : "ghost"}
              onClick={() => onActivateWindow(instance)}
            >
              <StationIcon token={definition.icon} />
              <span className="truncate">{definition.title}</span>
            </Button>
          );
        })}
      </div>
    </footer>
  );
}
