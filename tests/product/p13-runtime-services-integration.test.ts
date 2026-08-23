import assert from "node:assert/strict";
import test from "node:test";
import { renderRuntimeIntegrationExecutionSupport, runtimeIntegrationExecutionRoute } from "../../packages/runtime-core/integration-execution.js";
import { renderPersistentAutonomousRuntimeEntrypoint } from "../../packages/runtime-core/index.js";

test("integration support resolves only classified env references and hides resolved endpoints", () => {
  const support = renderRuntimeIntegrationExecutionSupport();
  assert.match(support, /requirementKind !== "external-service"/);
  assert.match(support, /env:\/\//);
  assert.match(support, /descriptor\.invocation\.method/);
  assert.match(support, /descriptor\.invocation\.path/);
  assert.match(support, /RUNTIME_INTEGRATION_INVOCATION_FAILED/);
  assert.equal(support.includes("https://resolved.example"), false);
  assert.match(runtimeIntegrationExecutionRoute, /runtimeHandleIntegrationRequest/);
});

test("persistent autonomous Runtime renders HTTP integration route without provider framework", () => {
  const entry = renderPersistentAutonomousRuntimeEntrypoint({ runtimeVersion: "0.1.0", requirements: [] });
  assert.match(entry, /runtimeHandleIntegrationRequest/);
  assert.match(entry, /RUNTIME_INTEGRATION_BINDING_UNRESOLVED/);
  assert.equal(entry.includes("@system-builder"), false);
});
