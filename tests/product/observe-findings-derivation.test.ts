import assert from "node:assert/strict";
import test from "node:test";
import {
  DeploymentObservation,
  DeploymentOperationMetadata,
  enrichObservation,
  type EnrichedDeploymentObservation,
} from "../../packages/observe/index.js";
import { deriveFindings, type DeploymentFindingSource } from "../../packages/observe/findings.js";

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

test("deriveFindings maps a failed deployment to one deterministic critical finding", () => {
  const findings = deriveFindings(observation("failed", []));

  assert.equal(findings.length, 1);
  const [finding] = findings;
  assert.equal(finding?.kind, "DeploymentFinding");
  assert.equal(finding?.severity, "critical");
  assert.equal(finding?.confidence, "high");
  assert.equal(finding?.code, "OBSERVE_FINDING:DEPLOYMENT_FAILED");
  assert.match(finding?.findingId ?? "", /^sha256:[a-f0-9]{64}$/);
});

test("deriveFindings emits one warning finding per failing health check", () => {
  const findings = deriveFindings(
    observation("succeeded", [
      { name: "health", status: "PASS" },
      { name: "db", status: "FAIL" },
      { name: "cache", status: "FAIL" },
    ]),
  );

  assert.equal(findings.length, 2);
  for (const finding of findings) {
    assert.equal(finding.severity, "warning");
    assert.equal(finding.confidence, "medium");
    assert.equal(finding.code, "OBSERVE_FINDING:HEALTH_CHECK_FAILED");
  }
  assert.notEqual(findings[0]?.findingId, findings[1]?.findingId);
});

test("deriveFindings is deterministic: equal observations produce equal findings with equal identities", () => {
  const left = deriveFindings(observation("failed", [{ name: "db", status: "FAIL" }]));
  const right = deriveFindings(observation("failed", [{ name: "db", status: "FAIL" }]));

  assert.deepEqual(left, right);
  assert.equal(left[0]?.findingId, right[0]?.findingId);
});

test("deriveFindings is content-addressed: a changed correlation ref changes the finding identity", () => {
  const base = deriveFindings(observation("failed", []));
  const changed = deriveFindings(DeploymentObservation.fromDeploymentRecord(recordLike("failed", [], { deploymentId: "deploy:observe-b" })));

  assert.notEqual(base[0]?.findingId, changed[0]?.findingId);
});

test("deriveFindings clean success with default baseline produces no finding (no-op)", () => {
  const findings = deriveFindings(observation("succeeded", [{ name: "health", status: "PASS" }]));

  assert.equal(findings.length, 0);
});

test("deriveFindings clean success emits an info finding only when the baseline declares it", () => {
  const findings = deriveFindings(observation("succeeded", [{ name: "health", status: "PASS" }]), {
    emitInfoOnCleanSuccess: true,
  });

  assert.equal(findings.length, 1);
  const [finding] = findings;
  assert.equal(finding?.severity, "info");
  assert.equal(finding?.confidence, "high");
  assert.equal(finding?.code, "OBSERVE_FINDING:DEPLOYMENT_SUCCEEDED");
});

test("deriveFindings carries the source observation correlation refs onto every finding", () => {
  const obs = observation("failed", [{ name: "db", status: "FAIL" }]);
  const findings = deriveFindings(obs);

  for (const finding of findings) {
    assert.equal(finding.observationId, obs.observationId);
    assert.equal(finding.deploymentId, obs.deploymentId);
    assert.equal(finding.publishedReleaseRef, obs.publishedReleaseRef);
    assert.equal(finding.environmentRef, obs.environmentRef);
    assert.equal(finding.releaseHash, obs.releaseHash);
  }
});

test("deriveFindings carries optional operation refs from an enriched observation", () => {
  const obs = observation("failed", []);
  const source = enriched(obs);
  const findings = deriveFindings(source);

  assert.equal(findings.length, 1);
  const [finding] = findings;
  assert.equal(finding?.operationId, source.operation?.operationId);
  assert.equal(finding?.runtimeRef, "runtime://managed-a");
  assert.equal(finding?.processRef, "process://a-1");
  assert.equal(finding?.sessionRef, "session://s1");
});

test("deriveFindings rejects a resolved value in a health check name deterministically", () => {
  assert.throws(
    () => deriveFindings(observation("succeeded", [{ name: "password=hunter2", status: "FAIL" }])),
    /OBSERVE_INVALID_FINDING:RESOLVED_VALUE:healthCheckName/,
  );
});

test("deriveFindings rejects malformed sources deterministically", () => {
  assert.throws(
    () => deriveFindings({ kind: "OtherObservation" } as unknown as DeploymentFindingSource),
    /OBSERVE_INVALID_FINDING:KIND/,
  );
  assert.throws(
    () =>
      deriveFindings({
        ...recordLike("failed", []),
        kind: "DeploymentObservation",
        status: "unknown",
      } as unknown as DeploymentFindingSource),
    /OBSERVE_INVALID_FINDING:STATUS/,
  );
  assert.throws(
    () =>
      deriveFindings({
        ...recordLike("failed", []),
        kind: "DeploymentObservation",
        healthChecks: [{ name: "health", status: "UNKNOWN" }],
      } as unknown as DeploymentFindingSource),
    /OBSERVE_INVALID_FINDING:HEALTH_CHECK_STATUS/,
  );
});

test("deriveFindings never expresses a resolved secret/credential/CA value in any derived finding", () => {
  const SECRET = "password=hunter2";
  const CA = "-----BEGIN CERTIFICATE-----";
  const TOKEN = "Authorization: Bearer abc-123-def";

  const findings = deriveFindings(observation("failed", [{ name: "health", status: "FAIL" }]));
  const serialized = JSON.stringify(findings);

  assert.equal(serialized.includes(SECRET), false);
  assert.equal(serialized.includes(CA), false);
  assert.equal(serialized.includes(TOKEN), false);
});

test("deriveFindings keeps failed-status critical finding and per-check warnings deterministic in order", () => {
  const findings = deriveFindings(
    observation("failed", [
      { name: "db", status: "FAIL" },
      { name: "cache", status: "FAIL" },
    ]),
  );

  assert.equal(findings.length, 3);
  assert.equal(findings[0]?.severity, "critical");
  assert.equal(findings[1]?.severity, "warning");
  assert.equal(findings[2]?.severity, "warning");
});