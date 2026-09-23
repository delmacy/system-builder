import type { AppManifest } from "./types.js";
import { normalizeAppManifest } from "./validation.js";

const commonWindowCommands = Object.freeze([
  "window.close",
  "window.minimize",
  "window.maximize",
  "window.restore",
]);

export const WELCOME_APP: AppManifest = normalizeAppManifest({
  id: "app:welcome",
  name: "Welcome",
  description: "Station orientation and disconnected-state entry surface.",
  icon: "shell.home",
  launchPolicy: "SINGLETON",
  commands: ["welcome.open"],
  tools: [],
  windows: [
    {
      id: "welcome",
      appRef: "app:welcome",
      title: "Welcome",
      icon: "shell.home",
      defaultSize: { width: 720, height: 480 },
      minSize: { width: 480, height: 320 },
      multiInstance: false,
      resizable: true,
      commands: commonWindowCommands,
    },
  ],
});

export const COMPONENT_LAB_APP: AppManifest = normalizeAppManifest({
  id: "app:component-lab",
  name: "Component Lab",
  description: "Internal visual primitive and interaction state inventory.",
  icon: "shell.command",
  launchPolicy: "SINGLETON",
  commands: ["component-lab.open"],
  tools: [
    {
      id: "tool:component-lab:inspector",
      name: "Primitive inspector",
      icon: "shell.search",
      supportedSurfaces: ["component-lab"],
      commands: ["component-lab.inspect"],
      lazyLoad: true,
    },
  ],
  windows: [
    {
      id: "component-lab",
      appRef: "app:component-lab",
      title: "Component Lab",
      icon: "shell.command",
      defaultSize: { width: 960, height: 640 },
      minSize: { width: 640, height: 420 },
      multiInstance: false,
      resizable: true,
      commands: commonWindowCommands,
    },
  ],
});

export const SETTINGS_APP: AppManifest = normalizeAppManifest({
  id: "app:settings",
  name: "Settings",
  description: "Disposable Station presentation preferences.",
  icon: "settings",
  launchPolicy: "SINGLETON",
  commands: ["settings.open"],
  tools: [],
  windows: [
    {
      id: "settings",
      appRef: "app:settings",
      title: "Settings",
      icon: "settings",
      defaultSize: { width: 720, height: 560 },
      minSize: { width: 520, height: 380 },
      multiInstance: false,
      resizable: true,
      commands: commonWindowCommands,
    },
  ],
});

export const M1_UTILITY_APPS: readonly AppManifest[] = Object.freeze([
  WELCOME_APP,
  COMPONENT_LAB_APP,
  SETTINGS_APP,
]);
