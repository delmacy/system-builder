import { normalizeAppManifest } from "../../../../packages/station-app-runtime/index.js";
export const STATION_WORKFLOW_APP = normalizeAppManifest({
  id: "app:workflow-studio", name: "Workflow Studio", description: "Author local technical workflow candidates, validate and reopen revisions.",
  icon: "shell.command", launchPolicy: "SINGLETON", commands: ["workflow-studio.open"], tools: [],
  windows: [{ id: "workflow-studio", appRef: "app:workflow-studio", title: "Workflow Studio", icon: "shell.command",
    defaultSize: { width: 1040, height: 680 }, minSize: { width: 680, height: 460 }, multiInstance: false, resizable: true,
    commands: ["window.close", "window.minimize", "window.maximize", "window.restore"] }],
});
