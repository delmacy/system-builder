import { normalizeAppManifest } from "../../../../packages/station-app-runtime/index.js";
export const STATION_PROCESS_CONTEXT_APP = normalizeAppManifest({
  id: "app:process-context", name: "Process Context", description: "Open portable process references and their separate layout projections.",
  icon: "studio.process-context", launchPolicy: "SINGLETON", commands: ["process-context.open"], tools: [],
  windows: [{ id: "process-context", appRef: "app:process-context", title: "Process Context", icon: "studio.process-context",
    defaultSize: { width: 1040, height: 680 }, minSize: { width: 680, height: 460 }, multiInstance: false, resizable: true,
    commands: ["window.close", "window.minimize", "window.maximize", "window.restore"] }],
});
