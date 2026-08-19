import assert from "node:assert/strict";
import test from "node:test";
import {
  DeploymentObservation,
  DeploymentOperationMetadata,
  enrichObservation,
  type EnrichedDeploymentObservation,
} from "../../packages/observe/index.js";
import { correlateFinding, deriveFindings, type DeploymentFindingSource } from "../../packages/observe/findings.js";

function recordLike(
  status: "succeeded" | "failed",
  healthChecks: readonly { name: string; status: "PASS" | "FAIL" }[],
  overrides: Partial<Record<string, unknown>> = {},
): Record<string, unknown> {
  return {
    kind: "DeploymentRecord",
    deploymentId: "deploy:observe-a",
    publishedReleaseRef: "release:observe-app@1.0.0",
    environmentRef: "env:observe",
    releaseHash: `sha256:${"b".repeat(64)}`,
    startedAt: "2026-08-19T10:00:01Z",
    completedAt: "2026-08-19T10:00:02Z",
    status,
    healthChecks,
    ...overrides,
  };
}

function observation(status: "succeeded" | "failed", healthChecks: readonly { name: string; status: "PASS" | "FAIL" }[]) {
  return DeploymentObservation.fromDeploymentRecord(recordLike(status, healthChecks));
}

function operation() {
  return DeploymentOperationMetadata.create({
    executorRef: "user://maintainer",
    source: "manual",
    mode: "execute",
    runtimeRef: "runtime://managed-a",
    processRef: "process://a-1",
    sessionRef: "session://s1",
  });
}

function enriched(obs: ReturnType<typeof observation>): DeploymentFindingSource {
  const result = enrichObservation(obs, operation());
  return result as EnrichedDeploymentObservation;
}

function failedFinding(): ReturnType<typeof deriveFindings>[number] {
  const findings = deriveFindings(enriched(observation("failed", [])));
  assert.equal(findings.length, 1);
  const [finding] = findings;
  assert.ok(finding);
  return finding;
}

test("correlateFinding binds a finding to release/environment/runtime context deterministically", () => {
  const finding = failedFinding();
  const correlation = correlateFinding(finding);

  assert.equal(correlation.kind, "DeploymentFindingCorrelation");
  assert.match(correlation.correlationId, /^sha256:[a-f0-9]{64}$/);
  assert.equal(correlation.findingId, finding.findingId);
  assert.equal(correlation.observationId, finding.observationId);
  assert.equal(correlation.deploymentId, finding.deploymentId);
  assert.equal(correlation.publishedReleaseRef, finding.publishedReleaseRef);
  assert.equal(correlation.environmentRef, finding.environmentRef);
  assert.equal(correlation.releaseHash, finding.releaseHash);
  assert.equal(correlation.operationId, finding.operationId);
});

test("correlateFinding carries provider-neutral runtime/process/session refs when provided", () => {
  const finding = failedFinding();
  const correlation = correlateFinding(finding, {
    runtimeRef: "runtime://managed-a",
    processRef: "process://a-1",
    sessionRef: "session://s1",
  });

  assert.equal(correlation.runtimeRef, "runtime://managed-a");
  assert.equal(correlation.processRef, "process://a-1");
  assert.equal(correlation.sessionRef, "session://s1");
});

test("correlateFinding reuses the enriched finding's operation/process/session refs when no runtime overrides them", () => {
  const finding = failedFinding();
  const correlation = correlateFinding(finding);

  assert.equal(correlation.operationId, finding.operationId);
  assert.equal(correlation.runtimeRef, "runtime://managed-a");
  assert.equal(correlation.processRef, "process://a-1");
  assert.equal(correlation.sessionRef, "session://s1");
});

test("correlateFinding is deterministic: equal inputs produce equal correlationId", () => {
  const finding = failedFinding();
  const left = correlateFinding(finding, { runtimeRef: "runtime://managed-a" });
  const right = correlateFinding(finding, { runtimeRef: "runtime://managed-a" });

  assert.equal(left.correlationId, right.correlationId);
});

test("correlateFinding identity is content-addressed: a runtime ref change changes the correlationId", () => {
  const finding = failedFinding();
  const base = correlateFinding(finding, { runtimeRef: "runtime://managed-a" });
  const changed = correlateFinding(finding, { runtimeRef: "runtime://managed-b" });

  assert.notEqual(changed.correlationId, base.correlationId);
});

test("correlateFinding requires the deployment correlation to be present", () => {
  const finding = failedFinding();
  assert.throws(
    () => correlateFinding({ ...finding, deploymentId: undefined } as never),
    /OBSERVE_INVALID_FINDING:CORRELATION_REQUIRES_DEPLOYMENT/,
  );
});

test("correlateFinding rejects a resolved secret value in runtime refs deterministically", () => {
  const finding = failedFinding();
  assert.throws(
    () => correlateFinding(finding, { runtimeRef: "password=hunter2" }),
    /OBSERVE_INVALID_FINDING:RESOLVED_VALUE:runtimeRef/,
  );
});

test("correlateFinding never expresses a resolved secret/credential/CA value in any correlation document", () => {
  const finding = failedFinding();
  const correlation = correlateFinding(finding, {
    runtimeRef: "runtime://managed-a",
    processRef: "process://a-1",
    sessionRef: "session://s1",
  });

  const serialized = JSON.stringify(correlation);
  assert.equal(serialized.includes("password="), false);
  assert.equal(serialized.includes("-----BEGIN"), false);
  assert.equal(serialized.includes("Bearer"), false);
});
