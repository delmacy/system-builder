import { normalizeAppManifest } from "../../../../packages/station-app-runtime/index.js";

export const STATION_EDITOR_APP = normalizeAppManifest({
  id: "app:composition-editor",
  name: "Composition Editor",
  description: "Edit admitted Station compositions in a local window session.",
  icon: "shell.command",
  launchPolicy: "SINGLETON",
  commands: ["composition-editor.open"],
  tools: [],
  windows: [{
    id: "composition-editor",
    appRef: "app:composition-editor",
    title: "Composition Editor",
    icon: "shell.command",
    defaultSize: { width: 1040, height: 680 },
    minSize: { width: 680, height: 460 },
    multiInstance: false,
    resizable: true,
    commands: ["window.close", "window.minimize", "window.maximize", "window.restore"],
  }],
});
