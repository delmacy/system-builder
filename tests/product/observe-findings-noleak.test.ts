import assert from "node:assert/strict";
import test from "node:test";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
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
  correlateFinding,
  DeploymentFinding,
  deriveFindings,
  linkFinding,
  type DeploymentFinding as DeploymentFindingType,
  type DeploymentFindingSource,
} from "../../packages/observe/findings.js";
import { dryRunDeploy, type DeploymentRecord } from "../../packages/deploy/index.js";

const artifactHash = `sha256:${"a".repeat(64)}`;
const SECRET = "password=hunter2";
const CA = "-----BEGIN CERTIFICATE-----\nMIIB...\n-----END CERTIFICATE-----";
const TOKEN = "Authorization: Bearer abc-123-def";
const DSN = "postgres://user:pass@db-host:5432/app";
const SECRET_REF = "secret://observe-database";

const release = Object.freeze({
  kind: "PublishedRelease" as const,
  releaseId: "observe-app",
  version: "1.0.0",
  artifactRef: artifactHash,
  artifactHash,
  validationEvidenceRef: `sha256:${"b".repeat(64)}`,
  publishedAt: "2026-08-19T10:00:00Z",
  status: "published" as const,
});
const artifact = Object.freeze({
  kind: "ReleaseArtifact" as const,
  artifactHash,
  manifest: Object.freeze({ runtimeVersion: "runtime-1" }),
  environmentSchema: Object.freeze([
    Object.freeze({ name: "DATABASE_URL", kind: "secret-reference" as const, required: true }),
  ]),
});
const environment: EnvironmentProfile = Object.freeze({
  kind: "EnvironmentProfile",
  environmentRef: "env:observe",
  runtimeVersions: Object.freeze(["runtime-1"]),
  bindings: Object.freeze([
    Object.freeze({ name: "DATABASE_URL", kind: "secret-reference" as const, reference: SECRET_REF }),
  ]),
});

function produceRecord(): DeploymentRecord {
  const result = dryRunDeploy({
    publishedRelease: release,
    releaseArtifact: artifact,
    environment,
    acceptanceChecks: [{ name: "health", pass: false }],
    startedAt: "2026-08-19T10:00:01Z",
    completedAt: "2026-08-19T10:00:02Z",
  });
  assert.equal(result.ok, true);
  if (!result.ok) throw new Error("TASK156_DEPLOY_FAILED");
  return result.record;
}

function observation(): ReturnType<typeof DeploymentObservation.fromDeploymentRecord> {
  return DeploymentObservation.fromDeploymentRecord(produceRecord());
}

function operation() {
  return DeploymentOperationMetadata.fromExecutionContext({
    executorRef: "user://maintainer",
    source: "manual",
    mode: "execute",
    sourceRef: "cli:sb-deploy",
    triggeredAt: "2026-08-19T10:00:00Z",
    runtimeRef: "runtime://managed-a",
    processRef: "process://a-1",
    sessionRef: "session://s1",
    deploymentId: produceRecord().deploymentId,
    publishedReleaseRef: release.releaseId,
    environmentRef: environment.environmentRef,
    releaseHash: artifactHash,
  });
}

function enrichedSource(): DeploymentFindingSource {
  const enriched = enrichObservation(observation(), operation()) as EnrichedDeploymentObservation;
  return enriched;
}

function findings(): readonly DeploymentFindingType[] {
  return deriveFindings(enrichedSource());
}

const RESOLVED_MARKERS: readonly string[] = [SECRET, "hunter2", CA, TOKEN, DSN, "db-host", "BEGIN CERTIFICATE", "Bearer"];

function assertNoLeak(serialized: string, label: string): void {
  for (const marker of RESOLVED_MARKERS) {
    assert.equal(serialized.includes(marker), false, `${label} leaked marker ${marker}`);
  }
  assert.equal(serialized.includes(SECRET_REF), false, `${label} leaked secret reference`);
}

test("findings derived from a value-tainted source context carry references only", () => {
  const source = enrichedSource();
  const derived = deriveFindings(source);
  assert.ok(derived.length >= 1);

  for (const finding of derived) {
    const serialized = JSON.stringify(finding);
    assertNoLeak(serialized, "derived finding");
    assert.equal(finding.findingId.startsWith("sha256:"), true);
  }
});

test("findings remain reference-only after validation round-trip", () => {
  for (const finding of findings()) {
    const validated = DeploymentFinding.validate(finding);
    const serialized = DeploymentFinding.toJson(validated);
    assertNoLeak(serialized, "validated finding");
    assert.equal(validated.findingId, finding.findingId);
  }
});

test("findings remain reference-only after lossless serialization round-trip", () => {
  for (const finding of findings()) {
    const serialized = DeploymentFinding.toJson(finding);
    assertNoLeak(serialized, "serialized finding");
    const restored = DeploymentFinding.fromJson(serialized);
    assert.equal(restored.findingId, finding.findingId);
  }
});

test("correlation carries context and confidence without resolved values", () => {
  for (const finding of findings()) {
    const correlation = correlateFinding(finding);
    const serialized = JSON.stringify(correlation);
    assertNoLeak(serialized, "correlation");
    assert.equal(correlation.correlationId.startsWith("sha256:"), true);
    assert.equal(correlation.findingId, finding.findingId);
  }
});

test("linkage carries context and confidence without resolved values", () => {
  for (const finding of findings()) {
    const correlation = correlateFinding(finding);
    const linkage = linkFinding(finding, undefined, correlation);
    const serialized = JSON.stringify(linkage);
    assertNoLeak(serialized, "linkage");
    assert.equal(linkage.linkageId.startsWith("sha256:"), true);
    assert.equal(linkage.findingId, finding.findingId);
  }
});

test("published findings publication never carries a resolved secret/credential/CA value", async () => {
  const source = findings();
  const first = source[0];
  assert.ok(first);
  const linkage = linkFinding(first, undefined, correlateFinding(first));
  const delivered: DeploymentFindingsPublication[] = [];
  const observer: FindingsPublishObserver = { deliver: (publication) => void delivered.push(publication) };

  const result = await publishFindings(source, linkage, observer);

  assert.equal(result.ok, true);
  if (!result.ok) throw new Error("TASK156_UNEXPECTED_FAILURE");
  const serialized = JSON.stringify(delivered[0]);
  assertNoLeak(serialized, "publication");
});

test("validation rejects a deliberately value-tainted finding without echoing the value", () => {
  const valid = findings()[0];
  assert.ok(valid);
  const tainted = Object.freeze({ ...valid, message: `db unreachable ${SECRET}` });

  assert.throws(
    () => DeploymentFinding.validate(tainted),
    (error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      assert.match(message, /OBSERVE_INVALID_FINDING:RESOLVED_VALUE:message/);
      assert.equal(message.includes(SECRET), false);
      assert.equal(message.includes("hunter2"), false);
      return true;
    },
  );
});

test("validation rejects a tainted health-check name or runtime ref without echoing the value", () => {
  const valid = findings()[0];
  assert.ok(valid);
  const taintedRuntime = Object.freeze({ ...valid, runtimeRef: `runtime://${TOKEN}` });

  assert.throws(
    () => DeploymentFinding.validate(taintedRuntime),
    (error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      assert.match(message, /OBSERVE_INVALID_FINDING:RESOLVED_VALUE:runtimeRef/);
      assert.equal(message.includes(TOKEN), false);
      return true;
    },
  );
});

test("correlation rejects a tainted runtime ref and never echoes the value", () => {
  const valid = findings()[0];
  assert.ok(valid);

  assert.throws(
    () => correlateFinding(valid, { processRef: `process://${CA}` }),
    (error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      assert.match(message, /OBSERVE_INVALID_FINDING:RESOLVED_VALUE:processRef/);
      assert.equal(message.includes(CA), false);
      assert.equal(message.includes("BEGIN CERTIFICATE"), false);
      return true;
    },
  );
});

test("publishFindings fails open on a tainted finding without echoing the value", async () => {
  const valid = findings()[0];
  assert.ok(valid);
  const tainted = Object.freeze({ ...valid, message: `secret ${SECRET}` }) as unknown as DeploymentFindingType;

  let result;
  let propagated = false;
  try {
    result = await publishFindings([tainted]);
  } catch {
    propagated = true;
  }

  assert.equal(propagated, false);
  assert.ok(result);
  assert.equal(result.ok, false);
  if (result.ok) throw new Error("TASK156_SHOULD_HAVE_FAILED_OPEN");
  assert.equal(result.outcome, "findings-failed");
  assertNoLeak(JSON.stringify(result), "findings-failed diagnostic");
});

test("a failing findings no-leak pipeline never breaks Deploy or the autonomous Runtime", async () => {
  const record = produceRecord();
  const obs = DeploymentObservation.fromDeploymentRecord(record);
  const enriched = enrichObservation(obs, operation()) as EnrichedDeploymentObservation;
  const source = deriveFindings(enriched);
  const tainted = Object.freeze({ ...source[0], message: `leaked ${CA}` }) as unknown as DeploymentFindingType;

  let result;
  let propagated = false;
  try {
    result = await publishFindings([tainted]);
  } catch {
    propagated = true;
  }

  assert.equal(propagated, false);
  assert.ok(result);
  assert.equal(result.ok, false);
  if (result.ok) throw new Error("TASK156_SHOULD_HAVE_FAILED_OPEN");
  assert.equal(result.outcome, "findings-failed");

  const rerun = DeploymentObservation.fromDeploymentRecord(record);
  assert.equal(rerun.observationId, obs.observationId);
  assert.equal(rerun.deploymentId, obs.deploymentId);
});

test("canonical DeploymentRecord identity and Sprint 1/2 identities remain unchanged", () => {
  const recordA = produceRecord();
  const recordB = produceRecord();
  assert.equal(recordA.deploymentId, recordB.deploymentId);

  const obs = DeploymentObservation.fromDeploymentRecord(recordA);
  const enriched = enrichObservation(obs, operation()) as EnrichedDeploymentObservation;
  assert.equal(enriched.observationId, obs.observationId);
  assert.equal(enriched.deploymentId, obs.deploymentId);
  assert.equal(obs.observationId.startsWith("sha256:"), true);
});
