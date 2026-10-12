import { normalizeAppManifest } from "../../../../packages/station-app-runtime/index.js";
export const STATION_STUDIOS_APP = normalizeAppManifest({
  id: "app:studios", name: "Studios", description: "Shared installed Studio navigation and model-scoped context inspection.",
  icon: "view.grid", launchPolicy: "SINGLETON", commands: ["studios.open"], tools: [],
  windows: [{ id: "studios", appRef: "app:studios", title: "Studios", icon: "view.grid",
    defaultSize: { width: 1040, height: 680 }, minSize: { width: 680, height: 460 }, multiInstance: false, resizable: true,
    commands: ["window.close", "window.minimize", "window.maximize", "window.restore"] }],
});
