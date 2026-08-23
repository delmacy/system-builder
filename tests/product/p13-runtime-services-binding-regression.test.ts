import assert from "node:assert/strict";
import test from "node:test";
import { sha256Canonical } from "../../packages/deterministic/index.js";
import { compileRuntimeModelRelease } from "../../packages/compiler/runtime-model.js";
import { normalizeSystemDefinitionRuntimeProjection } from "../../packages/compiler/runtime-projection.js";
import { renderRuntimeFileExecutionSupport } from "../../packages/runtime-core/file-execution.js";
import { renderRuntimeIntegrationExecutionSupport } from "../../packages/runtime-core/integration-execution.js";

const STORAGE_ROOT = "/resolved/private/storage-root";
const SERVICE_URL = "https://resolved.internal.example:8443";
const SERVICE_TOKEN = "resolved-service-token-value";

function projection() {
  return {
    kind: "SystemDefinitionRuntimeProjection" as const,
    systemDefinitionRef: "system-definition:p13:bindings",
    entities: [], actions: [], processes: [],
    environmentRequirements: [
      { name: "storage:files", kind: "storage" as const, required: true },
      { name: "service:notify", kind: "external-service" as const, required: true },
    ],
    files: [{ id: "files:attachments", bindingRef: "storage:files", operations: ["get" as const] }],
    integrations: [{ id: "integration:notify", invocation: { kind: "http" as const, method: "POST" as const, path: "/notify", bindingRef: "service:notify" } }],
  };
}

test("Construction B projection fails closed on missing and incompatible classified requirements", () => {
  assert.throws(() => normalizeSystemDefinitionRuntimeProjection("system-definition:p13:bindings", {
    ...projection(), environmentRequirements: [{ name: "service:notify", kind: "external-service", required: true }],
  }), /UNKNOWN_BINDING_REFERENCE:storage:files/);
  assert.throws(() => normalizeSystemDefinitionRuntimeProjection("system-definition:p13:bindings", {
    ...projection(), environmentRequirements: [
      { name: "storage:files", kind: "external-service", required: true },
      { name: "service:notify", kind: "external-service", required: true },
    ],
  }), /INCOMPATIBLE_BINDING:storage:files:external-service/);
});

test("Construction B generated durable evidence remains reference-only", () => {
  const payload = { kind: "AssemblyPlan" as const, systemDefinitionRef: "system-definition:p13:bindings", components: [], sourceRefs: ["source:p13"] };
  const assemblyPlan = { ...payload, contentHash: sha256Canonical(payload) };
  const compiled = compileRuntimeModelRelease({
    assemblyPlan,
    validationEvidence: { kind: "ValidationEvidence", assemblyPlanRef: assemblyPlan.contentHash, decision: "PASS", evidenceHash: sha256Canonical({ decision: "PASS", plan: assemblyPlan.contentHash }) },
    compilerVersion: "0.1.0", runtimeVersion: "0.1.0",
    systemDefinitionRuntime: projection(),
  });
  const durable = JSON.stringify(compiled);
  for (const resolved of [STORAGE_ROOT, SERVICE_URL, SERVICE_TOKEN]) assert.equal(durable.includes(resolved), false);
  assert.match(durable, /storage:files/);
  assert.match(durable, /service:notify/);
});

test("Construction B runtime diagnostics expose binding identity but not resolved values", () => {
  const support = renderRuntimeFileExecutionSupport() + renderRuntimeIntegrationExecutionSupport();
  assert.match(support, /RUNTIME_FILE_BINDING_UNRESOLVED/);
  assert.match(support, /RUNTIME_INTEGRATION_BINDING_UNRESOLVED/);
  for (const resolved of [STORAGE_ROOT, SERVICE_URL, SERVICE_TOKEN]) assert.equal(support.includes(resolved), false);
  assert.equal(support.includes("error.message"), false);
  assert.equal(support.includes("Builder"), false);
  assert.equal(support.includes("Observe"), false);
});
