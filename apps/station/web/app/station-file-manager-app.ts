import { normalizeAppManifest } from "../../../../packages/station-app-runtime/index.js";
import type { ArtifactWorkspace } from "./station-artifact-workspace.js";
export const STATION_FILE_MANAGER_APP = normalizeAppManifest({
  id: "app:file-manager", name: "File Manager", description: "Organize portable compositions in your local workspace.",
  icon: "shell.command", launchPolicy: "SINGLETON", commands: ["file-manager.open"], tools: [],
  windows: [{ id: "file-manager", appRef: "app:file-manager", title: "File Manager", icon: "shell.command",
    defaultSize: { width: 1040, height: 680 }, minSize: { width: 680, height: 460 }, multiInstance: false, resizable: true,
    commands: ["window.close", "window.minimize", "window.maximize", "window.restore"] }],
});
export function workspaceFolderLabel(workspace: ArtifactWorkspace, ref: string): string {
  const names: string[] = []; let folder = workspace.folders.find(f => f.ref === ref);
  const seen = new Set<string>();
  while (folder && !seen.has(folder.ref)) {
    seen.add(folder.ref); names.unshift(folder.name);
    folder = workspace.folders.find(f => f.ref === folder!.parentRef);
  }
  return names.join(" / ");
}
