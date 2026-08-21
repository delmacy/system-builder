import assert from "node:assert/strict";
import test from "node:test";
import {
  DeploymentObservation,
  DeploymentFinding,
  type DeploymentRecordLike,
  type FindingsPublishObserver,
} from "../../packages/observe/index.js";
import { correlateFinding, linkFinding, deriveFindings } from "../../packages/observe/findings.js";
import { publishFindings } from "../../packages/observe/publish.js";

function recordLike(
  status: "succeeded" | "failed",
  healthChecks: readonly { name: string; status: "PASS" | "FAIL" }[],
  overrides: Partial<Record<string, unknown>> = {},
): DeploymentRecordLike {
  return {
    kind: "DeploymentRecord",
    deploymentId: "dep-negative",
    publishedReleaseRef: "release-negative",
    environmentRef: "env-negative",
    releaseHash: "hash-negative",
    startedAt: "2026-08-21T10:00:00Z",
    completedAt: "2026-08-21T10:01:00Z",
    status,
    healthChecks,
    ...overrides,
  };
}

test("DeploymentFinding.validate rejects unknown fields with OBSERVE_INVALID_FINDING:UNKNOWN_FIELD", () => {
  const finding = DeploymentFinding.create({
    severity: "warning",
    confidence: "medium",
    code: "OBSERVE_FINDING:TEST",
    message: "test finding",
    observationId: "obs-123",
    deploymentId: "dep-123",
    publishedReleaseRef: "rel-123",
    environmentRef: "env-123",
    releaseHash: "hash-123",
  });
  const json = DeploymentFinding.toJson(finding);
  const parsed = JSON.parse(json);
  parsed.unknownField = "should be rejected";
  const serialized = JSON.stringify(parsed);
  assert.throws(
    () => DeploymentFinding.fromJson(serialized),
    /OBSERVE_INVALID_FINDING:UNKNOWN_FIELD:unknownField/,
  );
});

test("DeploymentFinding.validate rejects wrong kind with OBSERVE_INVALID_FINDING:KIND", () => {
  const finding = DeploymentFinding.create({
    severity: "warning",
    confidence: "medium",
    code: "OBSERVE_FINDING:TEST",
    message: "test finding",
    observationId: "obs-123",
    deploymentId: "dep-123",
    publishedReleaseRef: "rel-123",
    environmentRef: "env-123",
    releaseHash: "hash-123",
  });
  const json = DeploymentFinding.toJson(finding);
  const parsed = JSON.parse(json);
  parsed.kind = "WrongKind";
  const serialized = JSON.stringify(parsed);
  assert.throws(
    () => DeploymentFinding.fromJson(serialized),
    /OBSERVE_INVALID_FINDING:KIND/,
  );
});

test("DeploymentFinding.validate rejects malformed required fields with OBSERVE_INVALID_FINDING:MALFORMED", () => {
  assert.throws(
    () =>
      DeploymentFinding.create({
        severity: "warning",
        confidence: "medium",
        code: "",
        message: "test",
        observationId: "obs-123",
        deploymentId: "dep-123",
        publishedReleaseRef: "rel-123",
        environmentRef: "env-123",
        releaseHash: "hash-123",
      }),
    /OBSERVE_INVALID_FINDING:MALFORMED:code/,
  );
  assert.throws(
    () =>
      DeploymentFinding.create({
        severity: "warning",
        confidence: "medium",
        code: "OBSERVE_FINDING:TEST",
        message: "",
        observationId: "obs-123",
        deploymentId: "dep-123",
        publishedReleaseRef: "rel-123",
        environmentRef: "env-123",
        releaseHash: "hash-123",
      }),
    /OBSERVE_INVALID_FINDING:MALFORMED:message/,
  );
});

test("DeploymentFinding.validate rejects unsupported severity with OBSERVE_INVALID_FINDING:UNSUPPORTED_SEVERITY", () => {
  assert.throws(
    () =>
      DeploymentFinding.create({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        severity: "fatal" as any,
        confidence: "medium",
        code: "OBSERVE_FINDING:TEST",
        message: "test",
        observationId: "obs-123",
        deploymentId: "dep-123",
        publishedReleaseRef: "rel-123",
        environmentRef: "env-123",
        releaseHash: "hash-123",
      }),
    /OBSERVE_INVALID_FINDING:UNSUPPORTED_SEVERITY:fatal/,
  );
});

test("DeploymentFinding.validate rejects unsupported confidence with OBSERVE_INVALID_FINDING:UNSUPPORTED_CONFIDENCE", () => {
  assert.throws(
    () =>
      DeploymentFinding.create({
        severity: "warning",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        confidence: "certain" as any,
        code: "OBSERVE_FINDING:TEST",
        message: "test",
        observationId: "obs-123",
        deploymentId: "dep-123",
        publishedReleaseRef: "rel-123",
        environmentRef: "env-123",
        releaseHash: "hash-123",
      }),
    /OBSERVE_INVALID_FINDING:UNSUPPORTED_CONFIDENCE:certain/,
  );
});

test("DeploymentFinding.validate rejects conflicting correlation with OBSERVE_INVALID_FINDING:CONFLICTING_CORRELATION", () => {
  const fields = {
    severity: "warning" as const,
    confidence: "medium" as const,
    code: "OBSERVE_FINDING:TEST",
    message: "test",
    observationId: "obs-123",
    deploymentId: "dep-123",
    publishedReleaseRef: "rel-123",
    environmentRef: "env-123",
    releaseHash: "hash-123",
  };
  const finding = DeploymentFinding.create(fields);
  const json = DeploymentFinding.toJson(finding);
  const parsed = JSON.parse(json);
  delete parsed.observationId;
  const serialized = JSON.stringify(parsed);
  assert.throws(
    () => DeploymentFinding.fromJson(serialized),
    /OBSERVE_INVALID_FINDING:CONFLICTING_CORRELATION/,
  );
});

test("DeploymentFinding.validate rejects wrong findingId with OBSERVE_INVALID_FINDING:FINDING_ID", () => {
  const fields = {
    severity: "warning" as const,
    confidence: "medium" as const,
    code: "OBSERVE_FINDING:TEST",
    message: "test",
    observationId: "obs-123",
    deploymentId: "dep-123",
    publishedReleaseRef: "rel-123",
    environmentRef: "env-123",
    releaseHash: "hash-123",
  };
  const finding = DeploymentFinding.create(fields);
  const json = DeploymentFinding.toJson(finding);
  const parsed = JSON.parse(json);
  parsed.findingId = "wrong-id";
  const serialized = JSON.stringify(parsed);
  assert.throws(
    () => DeploymentFinding.fromJson(serialized),
    /OBSERVE_INVALID_FINDING:FINDING_ID/,
  );
});

test("DeploymentFinding.validate rejects resolved secret/credential/CA value with OBSERVE_INVALID_FINDING:RESOLVED_VALUE", () => {
  const secret = "password=hunter2";
  const finding = DeploymentFinding.create({
    severity: "warning",
    confidence: "medium",
    code: "OBSERVE_FINDING:TEST",
    message: secret,
    observationId: "obs-123",
    deploymentId: "dep-123",
    publishedReleaseRef: "rel-123",
    environmentRef: "env-123",
    releaseHash: "hash-123",
  });
  try {
    DeploymentFinding.validate(finding);
    assert.fail("should have thrown");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    assert.ok(message.includes("OBSERVE_INVALID_FINDING:RESOLVED_VALUE:message"));
    assert.ok(!message.includes(secret));
    assert.ok(!message.includes("hunter2"));
  }

  const ca = "-----BEGIN CERTIFICATE-----";
  const findingWithCA = DeploymentFinding.create({
    severity: "warning",
    confidence: "medium",
    code: "OBSERVE_FINDING:TEST",
    message: ca,
    observationId: "obs-123",
    deploymentId: "dep-123",
    publishedReleaseRef: "rel-123",
    environmentRef: "env-123",
    releaseHash: "hash-123",
  });
  try {
    DeploymentFinding.validate(findingWithCA);
    assert.fail("should have thrown");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    assert.ok(message.includes("OBSERVE_INVALID_FINDING:RESOLVED_VALUE:message"));
    assert.ok(!message.includes(ca));
  }
});

test("correlateFinding rejects missing deployment context with CORRELATION_REQUIRES_DEPLOYMENT", () => {
  const finding = DeploymentFinding.create({
    severity: "warning",
    confidence: "medium",
    code: "OBSERVE_FINDING:TEST",
    message: "test",
    observationId: "obs-123",
    deploymentId: "dep-123",
    publishedReleaseRef: "rel-123",
    environmentRef: "env-123",
    releaseHash: "hash-123",
  });
  const incomplete = { ...finding };
  delete (incomplete as Partial<typeof incomplete>).deploymentId;
  assert.throws(
    () => correlateFinding(incomplete as never),
    /OBSERVE_INVALID_FINDING:CORRELATION_REQUIRES_DEPLOYMENT/,
  );
});

test("linkFinding requires observation kind to be DeploymentObservation or EnrichedDeploymentObservation", () => {
  const finding = DeploymentFinding.create({
    severity: "warning",
    confidence: "medium",
    code: "OBSERVE_FINDING:TEST",
    message: "test",
    observationId: "obs-123",
    deploymentId: "dep-123",
    publishedReleaseRef: "rel-123",
    environmentRef: "env-123",
    releaseHash: "hash-123",
  });
  assert.throws(
    () => linkFinding(finding, { kind: "WrongKind", observationId: "obs-456" }),
    /OBSERVE_INVALID_FINDING:LINKAGE_KIND/,
  );
});

test("linkFinding rejects correlation with mismatched findingId", () => {
  const finding = DeploymentFinding.create({
    severity: "warning",
    confidence: "medium",
    code: "OBSERVE_FINDING:TEST",
    message: "test",
    observationId: "obs-123",
    deploymentId: "dep-123",
    publishedReleaseRef: "rel-123",
    environmentRef: "env-123",
    releaseHash: "hash-123",
  });
  const correlation = correlateFinding(finding);
  const badCorrelation = { ...correlation, findingId: "wrong-id" };
  assert.throws(
    () => linkFinding(finding, undefined, badCorrelation),
    /OBSERVE_INVALID_FINDING:LINKAGE_CORRELATION_FINDING/,
  );
});

test("publishFindings returns not-configured when no observer is set", async () => {
  const record = recordLike("failed", []);
  const observation = DeploymentObservation.fromDeploymentRecord(record);
  const findings = deriveFindings(observation);
  const result = await publishFindings(findings);
  assert.equal(result.ok, true);
  assert.equal(result.outcome, "not-configured");
  assert.equal(result.count, findings.length);
});

test("publishFindings returns channel-failed when observer throws", async () => {
  const record = recordLike("failed", []);
  const observation = DeploymentObservation.fromDeploymentRecord(record);
  const findings = deriveFindings(observation);
  const observer: FindingsPublishObserver = {
    deliver: () => {
      throw new Error("channel unavailable");
    },
  };
  const result = await publishFindings(findings, undefined, observer);
  assert.equal(result.ok, false);
  assert.equal(result.outcome, "channel-failed");
  assert.equal(result.count, findings.length);
  assert.equal(result.diagnostic.code, "OBSERVE_CHANNEL_FAILED");
  assert.ok(result.diagnostic.detail.includes("observe channel unavailable"));
});

test("publishFindings returns findings-failed when findings are malformed", async () => {
  const malformed = {
    kind: "DeploymentFinding",
    severity: "warning",
    confidence: "medium",
    code: "",
    message: "test",
    observationId: "obs-123",
    deploymentId: "dep-123",
    publishedReleaseRef: "rel-123",
    environmentRef: "env-123",
    releaseHash: "hash-123",
    findingId: "sha256:abc123",
  } as unknown as import("../../packages/observe/index.js").DeploymentFinding;
  const observer: FindingsPublishObserver = {
    deliver: () => Promise.resolve(),
  };
  const result = await publishFindings([malformed], undefined, observer);
  assert.equal(result.ok, false);
  assert.equal(result.outcome, "findings-failed");
  assert.equal(result.count, 1);
  assert.equal(result.diagnostic.code, "OBSERVE_FINDINGS_FAILED");
  assert.ok(result.diagnostic.detail.includes("findings unavailable or malformed"));
});

test("publishFindings returns findings-failed when linkage is invalid", async () => {
  const record = recordLike("failed", []);
  const observation = DeploymentObservation.fromDeploymentRecord(record);
  const findings = deriveFindings(observation);
  const badLinkage = {
    kind: "DeploymentFindingLinkage",
    findingId: "wrong-id",
    observationId: observation.observationId,
    deploymentId: "dep-123",
    publishedReleaseRef: "rel-123",
    environmentRef: "env-123",
    releaseHash: "hash-123",
    severity: "warning",
    confidence: "medium",
    code: "OBSERVE_FINDING:TEST",
    message: "test",
  };
  const observer: FindingsPublishObserver = {
    deliver: () => Promise.resolve(),
  };
  const result = await publishFindings(findings, badLinkage as never, observer);
  assert.equal(result.ok, false);
  assert.equal(result.outcome, "findings-failed");
  assert.equal(result.count, findings.length);
  assert.equal(result.diagnostic.code, "OBSERVE_FINDINGS_FAILED");
  assert.ok(result.diagnostic.detail.includes("findings unavailable or malformed"));
});

test("No resolved secret/credential/CA value appears in negative diagnostic messages", () => {
  const secret = "password=hunter2";
  const finding = DeploymentFinding.create({
    severity: "warning",
    confidence: "medium",
    code: "OBSERVE_FINDING:TEST",
    message: secret,
    observationId: "obs-123",
    deploymentId: "dep-123",
    publishedReleaseRef: "rel-123",
    environmentRef: "env-123",
    releaseHash: "hash-123",
  });
  try {
    DeploymentFinding.validate(finding);
    assert.fail("should have thrown");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    assert.ok(message.includes("OBSERVE_INVALID_FINDING:RESOLVED_VALUE:message"));
    assert.ok(!message.includes(secret));
    assert.ok(!message.includes("hunter2"));
  }
  try {
    const incompleteFinding = DeploymentFinding.create({
      severity: "warning",
      confidence: "medium",
      code: "OBSERVE_FINDING:TEST",
      message: "test",
      observationId: "obs-123",
      deploymentId: "dep-123",
      publishedReleaseRef: "rel-123",
      environmentRef: "env-123",
      releaseHash: "hash-123",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    correlateFinding({ ...incompleteFinding, deploymentId: undefined } as any);
    assert.fail("should have thrown");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    assert.ok(message.includes("OBSERVE_INVALID_FINDING:CORRELATION_REQUIRES_DEPLOYMENT"));
    assert.ok(!message.includes("secret"));
  }
});

void test("deriveFindings rejects resolved value in health check name deterministically", () => {
  const record = recordLike("succeeded", [{ name: "password=hunter2", status: "FAIL" }]);
  const observation = DeploymentObservation.fromDeploymentRecord(record);
  assert.throws(
    () => deriveFindings(observation),
    /OBSERVE_INVALID_FINDING:RESOLVED_VALUE:healthCheckName/,
  );
});
