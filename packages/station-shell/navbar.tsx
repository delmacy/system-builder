import { Button, Badge } from "@system-builder/ui-core";
import { StationIcon } from "@system-builder/ui-icons";

export type StationConnectionState = "disconnected";

export type StationNavbarProps = Readonly<{
  contextLabel: string;
  connection: StationConnectionState;
  searchAvailable?: boolean;
  commandAvailable?: boolean;
  onHome: () => void;
  onSearch?: () => void;
  onCommand?: () => void;
  onSettings: () => void;
}>;

function connectionLabel(connection: StationConnectionState): string {
  switch (connection) {
    case "disconnected":
      return "Core: Disconnected";
  }
}

export function StationNavbar({
  contextLabel,
  connection,
  searchAvailable = false,
  commandAvailable = false,
  onHome,
  onSearch,
  onCommand,
  onSettings,
}: StationNavbarProps) {
  return (
    <header
      aria-label="Station navigation"
      className="flex h-12 w-full shrink-0 items-center gap-2 border-b bg-[var(--sb-toolbar)] px-3"
      data-slot="station-navbar"
      data-core-connection={connection}
    >
      <Button
        aria-label="System Builder Home"
        className="shrink-0 px-2"
        onClick={onHome}
        variant="ghost"
      >
        <StationIcon token="shell.home" />
        <span className="font-semibold">System Builder</span>
      </Button>

      <div
        aria-label="Current context"
        className="min-w-0 flex-1 border-l pl-3 text-sm text-muted-foreground"
        data-slot="station-current-context"
      >
        <span className="truncate">{contextLabel}</span>
      </div>

      <div
        aria-label="Station global actions"
        className="flex shrink-0 items-center gap-1"
        data-slot="station-navbar-actions"
      >
        <Button
          aria-label="Search"
          disabled={!searchAvailable}
          onClick={onSearch}
          size="sm"
          title={searchAvailable ? "Search" : "Search surface is not available yet"}
          variant="ghost"
        >
          <StationIcon token="shell.search" />
          <span className="hidden md:inline">Search</span>
        </Button>
        <Button
          aria-label="Commands"
          disabled={!commandAvailable}
          onClick={onCommand}
          size="sm"
          title={commandAvailable ? "Commands" : "Command surface is not available yet"}
          variant="ghost"
        >
          <StationIcon token="shell.command" />
          <span className="hidden md:inline">Commands</span>
        </Button>
        <Button aria-label="Settings" onClick={onSettings} size="sm" variant="ghost">
          <StationIcon token="settings" />
          <span className="hidden md:inline">Settings</span>
        </Button>
      </div>

      <Badge
        className="shrink-0 bg-muted text-muted-foreground"
        data-slot="station-core-status"
      >
        {connectionLabel(connection)}
      </Badge>
    </header>
  );
}
