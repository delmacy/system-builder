import test from "node:test";
import assert from "node:assert/strict";
import { sha256Canonical } from "@system-builder/deterministic";
import {
  DeploymentObservation,
  enrichObservation,
  DeploymentFinding,
  linkFinding,
  publishFindings,
  DeploymentOperationMetadata,
  type DeploymentRecordLike,
  type FindingsPublishObserver,
} from "../../packages/observe/index.js";
import { DeploymentRegistry, dryRunDeploy, type DeploymentRecord } from "../../packages/deploy/index.js";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import { deriveFindings, correlateFinding } from "../../packages/observe/findings.js";
import type { DeploymentFindingSource } from "../../packages/observe/findings.js";

const e2eArtifactHash = `sha256:${"e".repeat(64)}`;
const e2eRelease = Object.freeze({
  kind: "PublishedRelease" as const,
  releaseId: "observe-findings-positive",
  version: "1.0.0",
  artifactRef: e2eArtifactHash,
  artifactHash: e2eArtifactHash,
  validationEvidenceRef: `sha256:${"f".repeat(64)}`,
  publishedAt: "2026-08-21T09:59:00Z",
  status: "published" as const,
});
const e2eArtifact = Object.freeze({
  kind: "ReleaseArtifact" as const,
  artifactHash: e2eArtifactHash,
  manifest: Object.freeze({ runtimeVersion: "runtime-1" }),
  environmentSchema: Object.freeze([
    Object.freeze({ name: "DATABASE_URL", kind: "secret-reference" as const, required: true }),
  ]),
});
const e2eEnvironment: EnvironmentProfile = Object.freeze({
  kind: "EnvironmentProfile",
  environmentRef: "env:observe-findings-positive",
  runtimeVersions: Object.freeze(["runtime-1"]),
  bindings: Object.freeze([
    Object.freeze({ name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://findings-positive-db" }),
  ]),
});

function deployThroughActualApi(
  registry: DeploymentRegistry,
  version: string,
  acceptanceChecks: readonly { name: string; pass: boolean }[],
): DeploymentRecord {
  const result = dryRunDeploy({
    publishedRelease: { ...e2eRelease, version },
    releaseArtifact: e2eArtifact,
    environment: e2eEnvironment,
    acceptanceChecks,
    startedAt: "2026-08-21T10:00:00Z",
    completedAt: "2026-08-21T10:01:00Z",
  });
  assert.equal(result.ok, true);
  if (!result.ok) throw new Error("TASK157_DEPLOY_FAILED");
  return registry.record(result.record);
}

void test("findings positive path: actual Deploy record flows through enriched observation, findings, correlation, linkage, serialization and publication", async () => {
  const registry = new DeploymentRegistry();
  const record = deployThroughActualApi(registry, "1.0.1", [
    { name: "runtime-health", pass: false },
    { name: "database-health", pass: false },
  ]);
  assert.equal(registry.get(record.deploymentId), record);

  const observation = DeploymentObservation.fromDeploymentRecord(record);
  const metadata = DeploymentOperationMetadata.fromExecutionContext({
    executorRef: "user://maintainer",
    source: "manual",
    mode: "execute",
    sourceRef: "cli:sb-deploy",
    triggeredAt: "2026-08-21T09:59:30Z",
    runtimeRef: "runtime://managed-positive",
    processRef: "process://positive-1",
    sessionRef: "session://positive-1",
    deploymentId: record.deploymentId,
    publishedReleaseRef: record.publishedReleaseRef,
    environmentRef: record.environmentRef,
    releaseHash: record.releaseHash,
  });
  const enriched = enrichObservation(observation, metadata);
  assert.equal(enriched.kind, "EnrichedDeploymentObservation");

  const findings = deriveFindings(enriched as DeploymentFindingSource);
  assert.equal(findings.length, 3);
  const deploymentFailure = findings.find((finding) => finding.code === "OBSERVE_FINDING:DEPLOYMENT_FAILED");
  assert.ok(deploymentFailure);
  assert.equal(deploymentFailure.severity, "critical");
  assert.equal(deploymentFailure.confidence, "high");
  assert.equal(deploymentFailure.operationId, metadata.operationId);
  assert.equal(deploymentFailure.runtimeRef, "runtime://managed-positive");

  const correlation = correlateFinding(deploymentFailure);
  assert.equal(correlation.deploymentId, record.deploymentId);
  assert.equal(correlation.observationId, observation.observationId);
  const linkage = linkFinding(deploymentFailure, observation, correlation);
  assert.equal(linkage.correlationId, correlation.correlationId);
  assert.equal(linkage.findingId, deploymentFailure.findingId);

  const roundTripped = DeploymentFinding.fromJson(DeploymentFinding.toJson(deploymentFailure));
  assert.deepEqual(roundTripped, deploymentFailure);

  const delivered: unknown[] = [];
  const result = await publishFindings(findings, linkage, {
    deliver: (publication) => void delivered.push(publication),
  });
  assert.equal(result.ok, true);
  assert.equal(result.outcome, "delivered");
  assert.equal(delivered.length, 1);
  assert.equal(JSON.stringify(delivered).includes("secret://findings-positive-db"), false);
});

void test("findings positive path: failed deployment derives critical finding with correct severity/confidence/id", () => {
  const record: DeploymentRecordLike = {
    kind: "DeploymentRecord",
    deploymentId: "dep-123",
    publishedReleaseRef: "release-abc",
    environmentRef: "env-prod",
    releaseHash: "hash-xyz",
    startedAt: "2026-08-21T10:00:00Z",
    completedAt: "2026-08-21T10:01:00Z",
    status: "failed",
    healthChecks: [],
  };

  const observation = DeploymentObservation.fromDeploymentRecord(record);
  const findings = deriveFindings(observation);

  assert.equal(findings.length, 1);
  const finding = findings[0]!;
  assert.equal(finding.severity, "critical");
  assert.equal(finding.confidence, "high");
  assert.equal(finding.code, "OBSERVE_FINDING:DEPLOYMENT_FAILED");
  assert.equal(finding.deploymentId, "dep-123");
  assert.equal(finding.observationId, observation.observationId);
  assert.ok(finding.findingId.length > 0);

  const payload = { ...finding };
  delete (payload as unknown as { findingId?: string }).findingId;
  (payload as Record<string, unknown>).kind = "DeploymentFinding";
  const expected = sha256Canonical(payload);
  assert.equal(finding.findingId, expected);
});

void test("findings positive path: failed health checks derive warning findings", () => {
  const record: DeploymentRecordLike = {
    kind: "DeploymentRecord",
    deploymentId: "dep-456",
    publishedReleaseRef: "release-def",
    environmentRef: "env-staging",
    releaseHash: "hash-abc",
    startedAt: "2026-08-21T10:00:00Z",
    completedAt: "2026-08-21T10:01:00Z",
    status: "succeeded",
    healthChecks: [
      { name: "web", status: "PASS" },
      { name: "db", status: "FAIL" },
      { name: "cache", status: "FAIL" },
    ],
  };

  const observation = DeploymentObservation.fromDeploymentRecord(record);
  const findings = deriveFindings(observation);

  assert.equal(findings.length, 2);
  for (const finding of findings) {
    assert.equal(finding.severity, "warning");
    assert.equal(finding.confidence, "medium");
    assert.equal(finding.code, "OBSERVE_FINDING:HEALTH_CHECK_FAILED");
    assert.ok(finding.message.startsWith("health check \""));
    assert.ok(finding.message.endsWith("\" did not pass"));
  }
  const names = findings.map((f) => {
    const match = f.message.match(/^health check "([^"]+)"/);
    return match ? match[1] : null;
  });
  assert.deepEqual(names.sort(), ["cache", "db"]);
});

void test("findings positive path: clean success with emitInfoOnCleanSuccess derives info finding", () => {
  const record: DeploymentRecordLike = {
    kind: "DeploymentRecord",
    deploymentId: "dep-789",
    publishedReleaseRef: "release-ghi",
    environmentRef: "env-prod",
    releaseHash: "hash-123",
    startedAt: "2026-08-21T10:00:00Z",
    completedAt: "2026-08-21T10:01:00Z",
    status: "succeeded",
    healthChecks: [{ name: "web", status: "PASS" }],
  };

  const observation = DeploymentObservation.fromDeploymentRecord(record);
  const findings = deriveFindings(observation, { emitInfoOnCleanSuccess: true });

  assert.equal(findings.length, 1);
  const finding = findings[0]!;
  assert.equal(finding.severity, "info");
  assert.equal(finding.confidence, "high");
  assert.equal(finding.code, "OBSERVE_FINDING:DEPLOYMENT_SUCCEEDED");
  assert.equal(finding.message, "deployment completed successfully");
});

void test("findings positive path: clean success without emitInfoOnCleanSuccess derives no findings", () => {
  const record: DeploymentRecordLike = {
    kind: "DeploymentRecord",
    deploymentId: "dep-000",
    publishedReleaseRef: "release-000",
    environmentRef: "env-prod",
    releaseHash: "hash-000",
    startedAt: "2026-08-21T10:00:00Z",
    completedAt: "2026-08-21T10:01:00Z",
    status: "succeeded",
    healthChecks: [{ name: "web", status: "PASS" }],
  };

  const observation = DeploymentObservation.fromDeploymentRecord(record);
  const findings = deriveFindings(observation);
  assert.equal(findings.length, 0);
});

void test("findings positive path: toJson/fromJson round-trip is lossless", () => {
  const record: DeploymentRecordLike = {
    kind: "DeploymentRecord",
    deploymentId: "dep-roundtrip",
    publishedReleaseRef: "release-roundtrip",
    environmentRef: "env-test",
    releaseHash: "hash-roundtrip",
    startedAt: "2026-08-21T10:00:00Z",
    completedAt: "2026-08-21T10:01:00Z",
    status: "failed",
    healthChecks: [
      { name: "web", status: "PASS" },
      { name: "db", status: "FAIL" },
    ],
  };

  const observation = DeploymentObservation.fromDeploymentRecord(record);
  const findings = deriveFindings(observation);
  assert.equal(findings.length, 2);

  for (const original of findings) {
    const serialized = DeploymentFinding.toJson(original);
    const deserialized = DeploymentFinding.fromJson(serialized);
    assert.deepEqual(deserialized, original);
  }
});

void test("findings positive path: correlation adds deterministic correlationId with refs", () => {
  const record: DeploymentRecordLike = {
    kind: "DeploymentRecord",
    deploymentId: "dep-correlate",
    publishedReleaseRef: "release-correlate",
    environmentRef: "env-correlate",
    releaseHash: "hash-correlate",
    startedAt: "2026-08-21T10:00:00Z",
    completedAt: "2026-08-21T10:01:00Z",
    status: "failed",
    healthChecks: [],
  };

  const observation = DeploymentObservation.fromDeploymentRecord(record);
  const findings = deriveFindings(observation);
  assert.equal(findings.length, 1);
  const finding = findings[0]!;

  const correlation = correlateFinding(finding);
  assert.equal(correlation.kind, "DeploymentFindingCorrelation");
  assert.equal(correlation.findingId, finding.findingId);
  assert.equal(correlation.observationId, observation.observationId);
  assert.equal(correlation.deploymentId, "dep-correlate");
  assert.equal(correlation.publishedReleaseRef, "release-correlate");
  assert.equal(correlation.environmentRef, "env-correlate");
  assert.equal(correlation.releaseHash, "hash-correlate");
  assert.ok(correlation.correlationId.length > 0);

  const payload = {
    kind: "DeploymentFindingCorrelation",
    findingId: finding.findingId,
    observationId: observation.observationId,
    deploymentId: "dep-correlate",
    publishedReleaseRef: "release-correlate",
    environmentRef: "env-correlate",
    releaseHash: "hash-correlate",
  };
  const expected = sha256Canonical(payload);
  assert.equal(correlation.correlationId, expected);
});

void test("findings positive path: correlation includes optional operation refs", () => {
  const record: DeploymentRecordLike = {
    kind: "DeploymentRecord",
    deploymentId: "dep-ops",
    publishedReleaseRef: "release-ops",
    environmentRef: "env-ops",
    releaseHash: "hash-ops",
    startedAt: "2026-08-21T10:00:00Z",
    completedAt: "2026-08-21T10:01:00Z",
    status: "failed",
    healthChecks: [],
  };

  const observation = DeploymentObservation.fromDeploymentRecord(record);
  const findings = deriveFindings(observation);
  assert.equal(findings.length, 1);
  const finding = findings[0]!;

  const runtime = { runtimeRef: "rt-123", processRef: "proc-456", sessionRef: "sess-789" };
  const correlation = correlateFinding(finding, runtime);
  assert.equal(correlation.runtimeRef, "rt-123");
  assert.equal(correlation.processRef, "proc-456");
  assert.equal(correlation.sessionRef, "sess-789");

  const payload = {
    kind: "DeploymentFindingCorrelation",
    findingId: finding.findingId,
    observationId: observation.observationId,
    deploymentId: "dep-ops",
    publishedReleaseRef: "release-ops",
    environmentRef: "env-ops",
    releaseHash: "hash-ops",
    runtimeRef: "rt-123",
    processRef: "proc-456",
    sessionRef: "sess-789",
  };
  const expected = sha256Canonical(payload);
  assert.equal(correlation.correlationId, expected);
});

void test("findings positive path: linkage creates deterministic linkageId with finding fields", () => {
  const record: DeploymentRecordLike = {
    kind: "DeploymentRecord",
    deploymentId: "dep-link",
    publishedReleaseRef: "release-link",
    environmentRef: "env-link",
    releaseHash: "hash-link",
    startedAt: "2026-08-21T10:00:00Z",
    completedAt: "2026-08-21T10:01:00Z",
    status: "failed",
    healthChecks: [
      { name: "web", status: "PASS" },
      { name: "db", status: "FAIL" },
    ],
  };

  const observation = DeploymentObservation.fromDeploymentRecord(record);
  const findings = deriveFindings(observation);
  const failedCheck = findings.find((f) => f.code === "OBSERVE_FINDING:HEALTH_CHECK_FAILED");
  assert.ok(failedCheck);

  const linkage = linkFinding(failedCheck);
  assert.equal(linkage.kind, "DeploymentFindingLinkage");
  assert.equal(linkage.findingId, failedCheck.findingId);
  assert.equal(linkage.observationId, observation.observationId);
  assert.equal(linkage.deploymentId, "dep-link");
  assert.equal(linkage.severity, "warning");
  assert.equal(linkage.confidence, "medium");
  assert.equal(linkage.code, "OBSERVE_FINDING:HEALTH_CHECK_FAILED");
  assert.ok(linkage.linkageId.length > 0);

  const payload = {
    kind: "DeploymentFindingLinkage",
    findingId: failedCheck.findingId,
    observationId: observation.observationId,
    deploymentId: "dep-link",
    publishedReleaseRef: "release-link",
    environmentRef: "env-link",
    releaseHash: "hash-link",
    severity: "warning",
    confidence: "medium",
    code: "OBSERVE_FINDING:HEALTH_CHECK_FAILED",
    message: failedCheck.message,
  };
  const expected = sha256Canonical(payload);
  assert.equal(linkage.linkageId, expected);
});

void test("findings positive path: linkage includes correlationId when provided", () => {
  const record: DeploymentRecordLike = {
    kind: "DeploymentRecord",
    deploymentId: "dep-link-cor",
    publishedReleaseRef: "release-link-cor",
    environmentRef: "env-link-cor",
    releaseHash: "hash-link-cor",
    startedAt: "2026-08-21T10:00:00Z",
    completedAt: "2026-08-21T10:01:00Z",
    status: "failed",
    healthChecks: [],
  };

  const observation = DeploymentObservation.fromDeploymentRecord(record);
  const findings = deriveFindings(observation);
  assert.equal(findings.length, 1);
  const finding = findings[0]!;

  const correlation = correlateFinding(finding);
  const linkage = linkFinding(finding, observation, correlation);
  assert.equal(linkage.correlationId, correlation.correlationId);
});

void test("findings positive path: enrichObservation with operation metadata includes operation refs in findings", () => {
  const record: DeploymentRecordLike = {
    kind: "DeploymentRecord",
    deploymentId: "dep-enrich",
    publishedReleaseRef: "release-enrich",
    environmentRef: "env-enrich",
    releaseHash: "hash-enrich",
    startedAt: "2026-08-21T10:00:00Z",
    completedAt: "2026-08-21T10:01:00Z",
    status: "failed",
    healthChecks: [],
  };

  const observation = DeploymentObservation.fromDeploymentRecord(record);
  const metadata = DeploymentOperationMetadata.create({
    executorRef: "exec-123",
    source: "manual",
    mode: "execute",
    sourceRef: "src-456",
    triggeredAt: "2026-08-21T09:59:00Z",
    runtimeRef: "rt-enrich",
    processRef: "proc-enrich",
    sessionRef: "sess-enrich",
  });
  const enriched = enrichObservation(observation, metadata);

  const source: DeploymentFindingSource = {
    kind: enriched.kind,
    observationId: enriched.observationId,
    deploymentId: enriched.deploymentId,
    publishedReleaseRef: enriched.publishedReleaseRef,
    environmentRef: enriched.environmentRef,
    releaseHash: enriched.releaseHash,
    status: enriched.status,
    healthChecks: enriched.healthChecks,
    operation: (enriched as unknown as { operation: DeploymentOperationMetadata }).operation,
  };
  const findings = deriveFindings(source);
  assert.equal(findings.length, 1);
  const finding = findings[0]!;
  assert.equal(finding.operationId, metadata.operationId);
  assert.equal(finding.runtimeRef, "rt-enrich");
  assert.equal(finding.processRef, "proc-enrich");
  assert.equal(finding.sessionRef, "sess-enrich");
});

void test("findings positive path: publishFindings delivers to injected receiver", async () => {
  const record: DeploymentRecordLike = {
    kind: "DeploymentRecord",
    deploymentId: "dep-publish",
    publishedReleaseRef: "release-publish",
    environmentRef: "env-publish",
    releaseHash: "hash-publish",
    startedAt: "2026-08-21T10:00:00Z",
    completedAt: "2026-08-21T10:01:00Z",
    status: "failed",
    healthChecks: [
      { name: "web", status: "PASS" },
      { name: "db", status: "FAIL" },
    ],
  };

  const observation = DeploymentObservation.fromDeploymentRecord(record);
  const findings = deriveFindings(observation);
  assert.equal(findings.length, 2);

  const received: unknown[] = [];
  const observer: FindingsPublishObserver = {
    deliver: (doc: unknown) => {
      received.push(doc);
      return Promise.resolve();
    },
  };

  const result = await publishFindings(findings, undefined, observer);
  assert.equal(result.ok, true);
  assert.equal(result.outcome, "delivered");
  assert.equal(result.count, 2);
  assert.equal(received.length, 1);

  const publication = received[0] as {
    kind: string;
    findings: readonly { findingId: string }[];
  };
  assert.equal(publication.kind, "DeploymentFindingsPublication");
  assert.equal(publication.findings.length, findings.length);
  assert.deepEqual(
    publication.findings.map((finding) => finding.findingId),
    findings.map((finding) => finding.findingId),
  );
});

void test("findings positive path: no resolved secret/CA value appears in any emitted artifact", async () => {
  const record: DeploymentRecordLike = {
    kind: "DeploymentRecord",
    deploymentId: "dep-no-secret",
    publishedReleaseRef: "release-no-secret",
    environmentRef: "env-no-secret",
    releaseHash: "hash-no-secret",
    startedAt: "2026-08-21T10:00:00Z",
    completedAt: "2026-08-21T10:01:00Z",
    status: "failed",
    healthChecks: [
      { name: "web", status: "PASS" },
      { name: "db", status: "FAIL" },
    ],
  };

  const observation = DeploymentObservation.fromDeploymentRecord(record);
  const findings = deriveFindings(observation);
  assert.equal(findings.length, 2);

  const jsonSerialized = findings.map((f) => DeploymentFinding.toJson(f));
  const allJson = jsonSerialized.join("\n");

  const secretMarkers = [
    /-----BEGIN/i,
    /password\s*[:=]/i,
    /passwd\s*[:=]/i,
    /token\s*[:=]/i,
    /apikey\s*[:=]/i,
    /api_key\s*[:=]/i,
    /secret\s*[:=]/i,
    /client_secret\s*[:=]/i,
    /authorization\s*[:=]/i,
    /credential\s*[:=]/i,
    /bearer\s+[a-z0-9_-]+/i,
  ];

  for (const marker of secretMarkers) {
    assert.ok(!marker.test(allJson), `found secret marker ${marker.source} in findings JSON`);
  }

  const correlations = findings.map((f) => correlateFinding(f));
  const serializedCorrelations = correlations.map((c) => JSON.stringify(c));
  const allCorrJson = serializedCorrelations.join("\n");
  for (const marker of secretMarkers) {
    assert.ok(!marker.test(allCorrJson), `found secret marker ${marker.source} in correlation JSON`);
  }

  const linkages = findings.map((f) => linkFinding(f));
  const serializedLinkages = linkages.map((l) => JSON.stringify(l));
  const allLinkJson = serializedLinkages.join("\n");
  for (const marker of secretMarkers) {
    assert.ok(!marker.test(allLinkJson), `found secret marker ${marker.source} in linkage JSON`);
  }

  const observer: FindingsPublishObserver = {
    deliver: (doc: unknown) => {
      const json = JSON.stringify(doc);
      for (const marker of secretMarkers) {
        assert.ok(!marker.test(json), `found secret marker ${marker.source} in published doc`);
      }
      return Promise.resolve();
    },
  };
  const result = await publishFindings(findings, undefined, observer);
  assert.equal(result.ok, true);
  assert.equal(result.outcome, "delivered");
});

void test("findings positive path: deriveFindings preserves all correlation refs from observation", () => {
  const record: DeploymentRecordLike = {
    kind: "DeploymentRecord",
    deploymentId: "dep-correlation-all",
    publishedReleaseRef: "release-correlation-all",
    environmentRef: "env-correlation-all",
    releaseHash: "hash-correlation-all",
    startedAt: "2026-08-21T10:00:00Z",
    completedAt: "2026-08-21T10:01:00Z",
    status: "failed",
    healthChecks: [
      { name: "web", status: "PASS" },
      { name: "db", status: "FAIL" },
    ],
  };

  const observation = DeploymentObservation.fromDeploymentRecord(record);
  const metadata = DeploymentOperationMetadata.create({
    executorRef: "exec-all",
    source: "api",
    mode: "execute",
    sourceRef: "src-all",
    triggeredAt: "2026-08-21T09:59:00Z",
    runtimeRef: "rt-all",
    processRef: "proc-all",
    sessionRef: "sess-all",
  });
  const enriched = enrichObservation(observation, metadata);

  const source: DeploymentFindingSource = {
    kind: enriched.kind,
    observationId: enriched.observationId,
    deploymentId: enriched.deploymentId,
    publishedReleaseRef: enriched.publishedReleaseRef,
    environmentRef: enriched.environmentRef,
    releaseHash: enriched.releaseHash,
    status: enriched.status,
    healthChecks: enriched.healthChecks,
    operation: (enriched as Record<string, unknown>).operation as DeploymentOperationMetadata,
  };
  const findings = deriveFindings(source);
  assert.equal(findings.length, 2);

  for (const finding of findings) {
    assert.equal(finding.observationId, observation.observationId);
    assert.equal(finding.deploymentId, "dep-correlation-all");
    assert.equal(finding.publishedReleaseRef, "release-correlation-all");
    assert.equal(finding.environmentRef, "env-correlation-all");
    assert.equal(finding.releaseHash, "hash-correlation-all");
    assert.equal(finding.operationId, metadata.operationId);
    assert.equal(finding.runtimeRef, "rt-all");
    assert.equal(finding.processRef, "proc-all");
    assert.equal(finding.sessionRef, "sess-all");
  }
});

void test("findings positive path: linkFinding accepts the matching source observation", () => {
  const record: DeploymentRecordLike = {
    kind: "DeploymentRecord",
    deploymentId: "dep-link-obs",
    publishedReleaseRef: "release-link-obs",
    environmentRef: "env-link-obs",
    releaseHash: "hash-link-obs",
    startedAt: "2026-08-21T10:00:00Z",
    completedAt: "2026-08-21T10:01:00Z",
    status: "failed",
    healthChecks: [],
  };

  const observation = DeploymentObservation.fromDeploymentRecord(record);
  const findings = deriveFindings(observation);
  assert.equal(findings.length, 1);
  const finding = findings[0]!;

  const linkage = linkFinding(finding, observation);
  assert.equal(linkage.observationId, observation.observationId);
});
