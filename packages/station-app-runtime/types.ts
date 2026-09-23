import type { IconToken } from "@system-builder/ui-icons";
import type { WindowDefinition } from "@system-builder/station-windowing";

export type LaunchPolicy = "SINGLETON" | "MULTI_INSTANCE";

export type ToolManifest = Readonly<{
  id: string;
  name: string;
  icon: IconToken;
  supportedSurfaces: readonly string[];
  commands: readonly string[];
  lazyLoad: boolean;
}>;

export type AppManifest = Readonly<{
  id: string;
  name: string;
  description?: string;
  icon: IconToken;
  launchPolicy: LaunchPolicy;
  windows: readonly WindowDefinition[];
  commands: readonly string[];
  tools: readonly ToolManifest[];
}>;

export type AppLaunch = Readonly<{
  appRef: string;
  windowDefinitions: readonly WindowDefinition[];
}>;
