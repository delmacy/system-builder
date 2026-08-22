import assert from "node:assert/strict";
import test from "node:test";
import {
  DeploymentObservation,
  DeploymentOperationMetadata,
  enrichObservation,
  linkFinding,
  type EnrichedDeploymentObservation,
} from "../../packages/observe/index.js";
import {
  correlateFinding,
  deriveFindings,
  type DeploymentFindingCorrelation,
  type DeploymentFindingSource,
} from "../../packages/observe/findings.js";

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

test("linkFinding produces an additive linkage document with a content-addressed linkageId", () => {
  const finding = failedFinding();
  const linkage = linkFinding(finding);

  assert.equal(linkage.kind, "DeploymentFindingLinkage");
  assert.match(linkage.linkageId, /^sha256:[a-f0-9]{64}$/);
  assert.equal(linkage.findingId, finding.findingId);
  assert.equal(linkage.observationId, finding.observationId);
  assert.equal(linkage.deploymentId, finding.deploymentId);
  assert.equal(linkage.publishedReleaseRef, finding.publishedReleaseRef);
  assert.equal(linkage.environmentRef, finding.environmentRef);
  assert.equal(linkage.releaseHash, finding.releaseHash);
});

test("linkFinding carries through severity, confidence, code and message from the finding", () => {
  const finding = failedFinding();
  const linkage = linkFinding(finding);

  assert.equal(linkage.severity, finding.severity);
  assert.equal(linkage.confidence, finding.confidence);
  assert.equal(linkage.code, finding.code);
  assert.equal(linkage.message, finding.message);
});

test("linkFinding binds the finding to an observation evidence when provided", () => {
  const finding = failedFinding();
  const obs = enriched(observation("failed", []));
  const linkage = linkFinding(finding, obs);

  assert.equal(linkage.observationId, obs.observationId);
  assert.equal(linkage.observationId, finding.observationId);
});

test("linkFinding carries optional runtime/process/session refs additively", () => {
  const finding = failedFinding();
  const linkage = linkFinding(finding);

  assert.equal(linkage.operationId, finding.operationId);
  assert.equal(linkage.runtimeRef, "runtime://managed-a");
  assert.equal(linkage.processRef, "process://a-1");
  assert.equal(linkage.sessionRef, "session://s1");
});

test("linkFinding carries a correlated evidence correlationId when provided", () => {
  const finding = failedFinding();
  const correlation = correlateFinding(finding);
  const linkage = linkFinding(finding, undefined, correlation);

  assert.equal(linkage.correlationId, correlation.correlationId);
});

test("linkFinding is deterministic: equal inputs produce equal linkageId", () => {
  const finding = failedFinding();
  const left = linkFinding(finding);
  const right = linkFinding(finding);

  assert.equal(left.linkageId, right.linkageId);
});

test("linkFinding identity is content-addressed: a finding change changes the linkageId", () => {
  const finding = failedFinding();
  const other = deriveFindings(enriched(observation("failed", [{ name: "liveness", status: "FAIL" }])));
  const otherFinding = other.find((candidate) => candidate.code.includes("HEALTH_CHECK_FAILED"));
  assert.ok(otherFinding);

  const base = linkFinding(finding);
  const changed = linkFinding(otherFinding);

  assert.notEqual(changed.linkageId, base.linkageId);
});

test("linkFinding is additive: it never alters the DeploymentFinding identity or the observation", () => {
  const finding = failedFinding();
  const findingIdBefore = finding.findingId;
  const obs = enriched(observation("failed", []));
  const observationIdBefore = obs.observationId;

  linkFinding(finding, obs);

  assert.equal(finding.findingId, findingIdBefore);
  assert.equal(obs.observationId, observationIdBefore);
});

test("linkFinding rejects an observation that is not an observation-like object", () => {
  const finding = failedFinding();
  assert.throws(() => linkFinding(finding, { kind: "DeploymentRecord", observationId: "deploy:x" } as never),
    /OBSERVE_INVALID_FINDING:LINKAGE_KIND/);
});

test("linkFinding rejects an observation that does not match the finding source observation", () => {
  const finding = failedFinding();
  assert.throws(
    () => linkFinding(finding, { kind: "DeploymentObservation", observationId: "sha256:foreign-observation" } as never),
    /OBSERVE_INVALID_FINDING:LINKAGE_OBSERVATION/,
  );
});

test("linkFinding rejects a correlation that binds a different finding", () => {
  const finding = failedFinding();
  const other = deriveFindings(enriched(observation("failed", [{ name: "liveness", status: "FAIL" }])));
  const otherFinding = other.find((candidate) => candidate.code.includes("HEALTH_CHECK_FAILED"));
  assert.ok(otherFinding);
  const foreign = correlateFinding(otherFinding);

  assert.throws(() => linkFinding(finding, undefined, foreign as unknown as DeploymentFindingCorrelation),
    /OBSERVE_INVALID_FINDING:LINKAGE_CORRELATION_FINDING/);
});

test("linkFinding never expresses a resolved secret/credential/CA value in the linkage", () => {
  const finding = failedFinding();
  const linkage = linkFinding(finding);

  const serialized = JSON.stringify(linkage);
  assert.equal(serialized.includes("password="), false);
  assert.equal(serialized.includes("-----BEGIN"), false);
  assert.equal(serialized.includes("Bearer"), false);
});
