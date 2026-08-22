import assert from "node:assert/strict";
import test from "node:test";
import {
  DeploymentObservation,
  DeploymentOperationMetadata,
  enrichObservation,
  publishFindings,
  type DeploymentFindingsPublication,
  type EnrichedDeploymentObservation,
  type FindingsPublishObserver,
} from "../../packages/observe/index.js";
import {
  deriveFindings,
  linkFinding,
  type DeploymentFinding,
  type DeploymentFindingLinkage,
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

function findings(): readonly DeploymentFinding[] {
  return deriveFindings(enriched(observation("failed", [{ name: "liveness", status: "FAIL" }])));
}

test("publishFindings delivers the findings publication to a configured channel", async () => {
  const source = findings();
  const delivered: DeploymentFindingsPublication[] = [];
  const observer: FindingsPublishObserver = { deliver: (publication) => void delivered.push(publication) };

  const result = await publishFindings(source, undefined, observer);

  assert.equal(result.ok, true);
  if (!result.ok) throw new Error("TASK155_UNEXPECTED_FAILURE");
  assert.equal(result.outcome, "delivered");
  assert.equal(result.count, source.length);
  assert.equal(delivered.length, 1);
  const publication = delivered[0];
  assert.ok(publication);
  assert.equal(publication.kind, "DeploymentFindingsPublication");
  assert.equal(publication.findings.length, source.length);
  assert.equal(publication.linkage, undefined);
});

test("publishFindings carries a linkage document additively when provided", async () => {
  const source = findings();
  const [finding] = source;
  assert.ok(finding);
  const linkage = linkFinding(finding);
  const delivered: DeploymentFindingsPublication[] = [];
  const observer: FindingsPublishObserver = { deliver: (publication) => void delivered.push(publication) };

  const result = await publishFindings(source, linkage, observer);

  assert.equal(result.ok, true);
  if (!result.ok) throw new Error("TASK155_UNEXPECTED_FAILURE");
  assert.equal(result.outcome, "delivered");
  const publication = delivered[0];
  assert.ok(publication);
  assert.ok(publication.linkage);
  assert.equal(publication.linkage.kind, "DeploymentFindingLinkage");
  assert.equal(publication.linkage.linkageId, linkage.linkageId);
});

test("publishFindings with no channel configured returns a deterministic not-configured result", async () => {
  const source = findings();

  const result = await publishFindings(source);

  assert.deepEqual(result, Object.freeze({ ok: true, outcome: "not-configured", count: source.length } as const));
  assert.equal(result.ok, true);
  if (!result.ok) throw new Error("TASK155_UNEXPECTED_FAILURE");
  assert.equal(result.outcome, "not-configured");
  assert.equal(result.count, source.length);
});

test("publishFindings fails open when the channel is unavailable or throws, without propagating", async () => {
  const source = findings();
  const failing: FindingsPublishObserver = {
    deliver: async () => {
      throw new Error("observe findings channel offline");
    },
  };

  let result;
  let propagated = false;
  try {
    result = await publishFindings(source, undefined, failing);
  } catch {
    propagated = true;
  }

  assert.equal(propagated, false);
  assert.ok(result);
  assert.equal(result.ok, false);
  if (result.ok) throw new Error("TASK155_SHOULD_HAVE_FAILED_OPEN");
  assert.equal(result.outcome, "channel-failed");
  assert.equal(result.count, source.length);
  assert.deepEqual(
    result.diagnostic,
    Object.freeze({ code: "OBSERVE_CHANNEL_FAILED", detail: "observe channel unavailable; deployment outcome unchanged" } as const),
  );
});

test("a synchronous throw from the findings channel also fails open without propagating", async () => {
  const source = findings();
  const throwing: FindingsPublishObserver = {
    deliver: () => {
      throw new Error("sync findings channel failure");
    },
  };

  let result;
  let propagated = false;
  try {
    result = await publishFindings(source, undefined, throwing);
  } catch {
    propagated = true;
  }

  assert.equal(propagated, false);
  assert.ok(result);
  assert.equal(result.ok, false);
  if (result.ok) throw new Error("TASK155_SHOULD_HAVE_FAILED_OPEN");
  assert.equal(result.outcome, "channel-failed");
});

test("publishFindings fails open when findings are malformed, without propagating", async () => {
  const malformed = [Object.freeze({ kind: "DeploymentFinding", findingId: "sha256:0000", severity: "critical" }) as unknown as DeploymentFinding];

  let result;
  let propagated = false;
  try {
    result = await publishFindings(malformed);
  } catch {
    propagated = true;
  }

  assert.equal(propagated, false);
  assert.ok(result);
  assert.equal(result.ok, false);
  if (result.ok) throw new Error("TASK155_SHOULD_HAVE_FAILED_OPEN");
  assert.equal(result.outcome, "findings-failed");
  assert.equal(result.count, malformed.length);
  assert.deepEqual(
    result.diagnostic,
    Object.freeze({ code: "OBSERVE_FINDINGS_FAILED", detail: "findings unavailable or malformed; deployment outcome unchanged" } as const),
  );
  assert.equal(result.diagnostic.detail.includes("sha256"), false);
});

test("publishFindings fails open when a linkage binds a finding not in the publication", async () => {
  const source = findings();
  const [finding] = source;
  assert.ok(finding);
  const foreign = linkFinding(finding);
  const empty: readonly DeploymentFinding[] = [];

  let result;
  let propagated = false;
  try {
    result = await publishFindings(empty, foreign as DeploymentFindingLinkage);
  } catch {
    propagated = true;
  }

  assert.equal(propagated, false);
  assert.ok(result);
  assert.equal(result.ok, false);
  if (result.ok) throw new Error("TASK155_SHOULD_HAVE_FAILED_OPEN");
  assert.equal(result.outcome, "findings-failed");
  assert.equal(result.count, 0);
});

test("publishFindings rejects a forged linkage with matching findingId and never delivers it", async () => {
  const source = findings();
  const [finding] = source;
  assert.ok(finding);
  const linkage = linkFinding(finding);
  const forged = { ...linkage, observationId: "sha256:foreign-observation" } as DeploymentFindingLinkage;
  let delivered = false;
  const observer: FindingsPublishObserver = { deliver: () => { delivered = true; } };

  const result = await publishFindings(source, forged, observer);

  assert.equal(result.ok, false);
  if (result.ok) throw new Error("TASK155_SHOULD_HAVE_FAILED_OPEN");
  assert.equal(result.outcome, "findings-failed");
  assert.equal(delivered, false);
});

test("publishFindings rejects a value-tainted forged linkage without echoing the value", async () => {
  const source = findings();
  const [finding] = source;
  assert.ok(finding);
  const linkage = linkFinding(finding);
  const secret = "password=hunter2";
  const forged = { ...linkage, message: secret } as DeploymentFindingLinkage;

  const result = await publishFindings(source, forged);

  assert.equal(result.ok, false);
  if (result.ok) throw new Error("TASK155_SHOULD_HAVE_FAILED_OPEN");
  assert.equal(result.outcome, "findings-failed");
  assert.equal(JSON.stringify(result).includes(secret), false);
  assert.equal(JSON.stringify(result).includes("hunter2"), false);
});

test("findings publication is deterministic: equal inputs produce equal outcomes", async () => {
  const source = findings();

  const first = await publishFindings(source);
  const second = await publishFindings(source);

  assert.deepEqual(first, second);
  if (first.ok && second.ok) {
    assert.equal(first.outcome, "not-configured");
    assert.equal(first.count, second.count);
  }
});

test("emitted findings publication never carries a resolved secret/credential/CA value", async () => {
  const source = findings();
  const delivered: string[] = [];
  const observer: FindingsPublishObserver = {
    deliver: (publication) => void delivered.push(JSON.stringify(publication)),
  };

  const result = await publishFindings(source, undefined, observer);

  assert.equal(result.ok, true);
  if (!result.ok) throw new Error("TASK155_UNEXPECTED_FAILURE");
  assert.equal(result.outcome, "delivered");
  const serialized = delivered[0] ?? "";
  assert.equal(serialized.includes("postgres://"), false);
  assert.equal(serialized.includes("secret://publisher-database"), false);
  assert.equal(serialized.includes("-----BEGIN"), false);
  assert.equal(serialized.includes("password="), false);
});

test("a failing findings pipeline never breaks Deploy or the autonomous Runtime", async () => {
  const obs = observation("failed", []);
  assert.equal(DeploymentObservation.fromDeploymentRecord(recordLike("failed", [])).status, "failed");
  const source = deriveFindings(enriched(obs));
  const failing: FindingsPublishObserver = {
    deliver: async () => {
      throw new Error("findings pipeline offline");
    },
  };

  const result = await publishFindings(source, undefined, failing);

  assert.equal(result.ok, false);
  if (result.ok) throw new Error("TASK155_SHOULD_HAVE_FAILED_OPEN");
  assert.equal(result.outcome, "channel-failed");

  const rerun = observation("failed", []);
  assert.equal(rerun.status, "failed");
  assert.equal(rerun.observationId, obs.observationId);
});
