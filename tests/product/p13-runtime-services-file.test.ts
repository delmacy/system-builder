import assert from "node:assert/strict";
import test from "node:test";
import { renderRuntimeFileExecutionSupport, runtimeFileExecutionRoute } from "../../packages/runtime-core/file-execution.js";
import { renderPersistentAutonomousRuntimeEntrypoint } from "../../packages/runtime-core/index.js";

test("file execution support is reference-only and rejects traversal without embedding roots", () => {
  const support = renderRuntimeFileExecutionSupport();
  assert.match(support, /env:\/\//);
  assert.match(support, /requirementKind !== \"storage\"/);
  assert.match(support, /RUNTIME_FILE_PATH_INVALID/);
  assert.match(support, /path\.relative/);
  assert.equal(support.includes("/resolved/storage/root"), false);
  assert.match(runtimeFileExecutionRoute, /runtimeHandleFileRequest/);
});

test("persistent autonomous Runtime renders file route support without Builder dependency", () => {
  const entry = renderPersistentAutonomousRuntimeEntrypoint({ runtimeVersion: "0.1.0", requirements: [] });
  assert.match(entry, /runtimeHandleFileRequest/);
  assert.match(entry, /RUNTIME_FILE_BINDING_UNRESOLVED/);
  assert.equal(entry.includes("@system-builder"), false);
});
