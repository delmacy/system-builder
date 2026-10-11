import assert from "node:assert/strict";
import test from "node:test";
import { STATION_FILE_MANAGER_APP, workspaceFolderLabel } from "../../apps/station/web/app/station-file-manager-app.js";
import { STATION_EDITOR_APP } from "../../apps/station/web/app/station-editor-app.js";
import { M1_UTILITY_APPS, StationAppRegistry } from "../../packages/station-app-runtime/index.js";
import { createWindowRuntimeState, reduceWindowRuntime } from "../../packages/station-windowing/index.js";
import { emptyArtifactWorkspace } from "../../apps/station/web/app/station-artifact-workspace.js";
test("WP11 File Manager is an ordinary singleton independent from editor with retained minimize/restore", () => {
  const registry = new StationAppRegistry([...M1_UTILITY_APPS, STATION_EDITOR_APP, STATION_FILE_MANAGER_APP]);
  const launch = registry.launch("app:file-manager"); assert.equal(launch.windowDefinitions.length, 1);
  const initial = createWindowRuntimeState(registry.list().flatMap(app => registry.launch(app.id).windowDefinitions), { width: 1280, height: 800 });
  const first = reduceWindowRuntime(initial, { type: "OPEN", definitionRef: "file-manager" });
  const second = reduceWindowRuntime(first, { type: "OPEN", definitionRef: "file-manager" });
  assert.equal(second.instances.length, 1);
  const editor = reduceWindowRuntime(second, { type: "OPEN", definitionRef: "composition-editor" });
  assert.equal(editor.instances.length, 2);
  const ref = editor.instances.find(i => i.definitionRef === "file-manager")!.windowRef;
  const minimized = reduceWindowRuntime(editor, { type: "MINIMIZE", windowRef: ref });
  assert.equal(minimized.instances.find(i => i.windowRef === ref)?.lifecycle, "MINIMIZED");
  const restored = reduceWindowRuntime(minimized, { type: "RESTORE", windowRef: ref });
  assert.equal(restored.instances.find(i => i.windowRef === ref)?.lifecycle, "OPEN");
  assert.equal(restored.instances.length, 2);
});
test("WP11 same-named folders in distinct branches remain distinguishable through human path labels", () => {
  const workspace = { ...emptyArtifactWorkspace(), folders: [...emptyArtifactWorkspace().folders,
    { ref: "folder:a", parentRef: "folder:root", name: "A" }, { ref: "folder:b", parentRef: "folder:root", name: "B" },
    { ref: "folder:aa", parentRef: "folder:a", name: "Design" }, { ref: "folder:bb", parentRef: "folder:b", name: "Design" }] };
  assert.equal(workspaceFolderLabel(workspace, "folder:aa"), "Workspace / A / Design");
  assert.equal(workspaceFolderLabel(workspace, "folder:bb"), "Workspace / B / Design");
});
