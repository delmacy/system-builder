import assert from "node:assert/strict";
import test from "node:test";

import { InMemoryArtifactPayloadRepository } from "../../packages/artifact-store/index.js";
import {
  compileSyntheticRelease,
  type CompilerAssemblyPlan,
  type CompilerValidationEvidence,
} from "../../packages/compiler/index.js";
import {
  DECISION_BOUNDARY_VERSION,
  verifyDecisionBoundary,
} from "../../packages/contracts/decision-boundary/index.js";
import {
  FACTORY_JOURNEY_CONTRACT_VERSION,
  FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION,
} from "../../packages/contracts/factory-boundary/index.js";
import {
  calculateProcessSemanticChangeDiff,
  normalizeProcessSemanticChangeClassificationEvidence,
  normalizeProcessSemanticChangeDecision,
  normalizeProcessSemanticChangeRationaleEvidence,
} from "../../packages/contracts/process-change/index.js";
import {
  PROCESS_SYSTEM_LINEAGE_VERSION,
  PROCESS_VERSION_IDENTITY_VERSION,
  normalizeProcessAnalysisDefinitionLineage,
  normalizeProcessRevisionIdentity,
} from "../../packages/contracts/process-versioning/index.js";
import { SingleHostActiveRuntimeOrchestrator } from "../../packages/deploy/active-runtime.js";
import { DeploymentRegistry, InMemoryDeploymentRecordStorage } from "../../packages/deploy/index.js";
import { ReleaseRegistry } from "../../packages/release/index.js";
import { executeFactoryOperatorBootstrap } from "../../scripts/factory-operator-bootstrap-command.js";

const PRODUCT = Object.freeze({
  artifactRef: "process:reference-orders",
  releaseId: "reference-orders-system",
  environmentRef: "environment:p19:reference-process",
  authorityRef: "authority:reference-process-owner",
});

const A = Object.freeze({
  revisionRef: "process-revision:reference-orders:v1",
  revisionNumber: 1,
  previousRevisionRef: null,
  analysisRef: "analysis:reference-orders:v1",
  definitionRef: "system-definition:reference-orders:v1",
  releaseVersion: "0.0.1",
  planHash: `sha256:${"a".repeat(64)}`,
  evidenceHash: `sha256:${"b".repeat(64)}`,
});

const B = Object.freeze({
  revisionRef: "process-revision:reference-orders:v2",
  revisionNumber: 2,
  previousRevisionRef: A.revisionRef,
  analysisRef: "analysis:reference-orders:v2",
  definitionRef: "system-definition:reference-orders:v2",
  releaseVersion: "0.0.2",
});

function successorApproval(outcome: "approved" | "rejected" = "approved") {
  const fromRevision = normalizeProcessRevisionIdentity({
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef: PRODUCT.artifactRef,
    revisionRef: A.revisionRef,
    revisionNumber: A.revisionNumber,
    previousRevisionRef: A.previousRevisionRef,
  });
  const toRevision = normalizeProcessRevisionIdentity({
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef: PRODUCT.artifactRef,
    revisionRef: B.revisionRef,
    revisionNumber: B.revisionNumber,
    previousRevisionRef: B.previousRevisionRef,
  });
  const semanticDiff = calculateProcessSemanticChangeDiff({
    fromRevision,
    toRevision,
    fromSnapshot: [{ semanticRef: "orders:receive", evidenceRef: "evidence:orders-receive:v1" }],
    toSnapshot: [
      { semanticRef: "orders:receive", evidenceRef: "evidence:orders-receive:v1" },
      { semanticRef: "orders:validate", evidenceRef: "evidence:orders-validate:v2" },
    ],
  });
  const classifierDecision = verifyDecisionBoundary({
    descriptor: {
      boundaryVersion: DECISION_BOUNDARY_VERSION,
      decisionId: "decision:classify-reference-orders-v2",
      category: "deterministic",
    },
    metadata: { invariantRef: "invariant:process-change-classification" },
    riskCriticality: { risk: "medium", criticality: "standard" },
    expectedCategory: "deterministic",
  });
  const classificationInput = {
    diffRef: "diff:reference-orders:v1-v2",
    semanticDiff,
    classification: "non-breaking" as const,
    classifierDecision,
    evidenceRefs: ["evidence:reference-orders:v1-v2"],
  };
  const classificationEvidence = normalizeProcessSemanticChangeClassificationEvidence(classificationInput);
  const rationaleInput = {
    diffRef: classificationEvidence.diffRef,
    semanticDiff,
    classificationRef: "classification:reference-orders:v1-v2",
    classificationEvidence: classificationInput,
    reasonRef: "reason:approved-successor-process-revision",
    evidenceRefs: ["evidence:reference-orders:v1-v2"],
  };
  normalizeProcessSemanticChangeRationaleEvidence(rationaleInput);
  const decision = normalizeProcessSemanticChangeDecision({
    rationaleRef: "rationale:reference-orders:v1-v2",
    rationaleEvidence: rationaleInput,
    outcome,
    decisionId: "decision:approve-reference-orders-v2",
    authorityRef: PRODUCT.authorityRef,
    decisionDescriptor: {
      boundaryVersion: DECISION_BOUNDARY_VERSION,
      decisionId: "decision:approve-reference-orders-v2",
      category: "human-decision",
    },
    decisionMetadata: { authorityRef: PRODUCT.authorityRef },
  });
  return Object.freeze({ fromRevision, toRevision, decision });
}

function requireApprovedSuccessor(approval = successorApproval()) {
  if (approval.decision.outcome !== "approved") {
    throw new Error("successor process revision requires authoritative approval");
  }
  if (approval.decision.fromRevisionRef !== A.revisionRef) {
    throw new Error("approval predecessor does not match retained A");
  }
  if (approval.decision.toRevisionRef !== B.revisionRef || approval.toRevision.previousRevisionRef !== A.revisionRef) {
    throw new Error("approval successor does not match canonical B");
  }
  return approval;
}

function canonicalLineage(
  revision: Readonly<{
    revisionRef: string;
    revisionNumber: number;
    previousRevisionRef: string | null;
    analysisRef: string;
    definitionRef: string;
  }>,
) {
  const processRevision = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "process-revision" as const,
    processRevision: normalizeProcessRevisionIdentity({
      contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
      artifactRef: PRODUCT.artifactRef,
      revisionRef: revision.revisionRef,
      revisionNumber: revision.revisionNumber,
      previousRevisionRef: revision.previousRevisionRef,
    }),
  };
  const analysis = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "analysis" as const,
    identityRef: revision.analysisRef,
  };
  const systemDefinition = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "system-definition" as const,
    identityRef: revision.definitionRef,
  };
  return normalizeProcessAnalysisDefinitionLineage({
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    processRevision,
    analysis,
    systemDefinition,
    hops: [
      {
        contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
        kind: "process-revision-to-analysis",
        from: processRevision,
        to: analysis,
      },
      {
        contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
        kind: "analysis-to-system-definition",
        from: analysis,
        to: systemDefinition,
      },
    ],
  });
}

function compileRetainedA() {
  const assemblyPlan = {
    kind: "AssemblyPlan" as const,
    systemDefinitionRef: A.definitionRef,
    components: [{ capability: "orders", provider: "builtin", version: "1.0.0" }],
    sourceRefs: [A.revisionRef, A.analysisRef, A.definitionRef],
    contentHash: A.planHash,
  };
  const validationEvidence = {
    kind: "ValidationEvidence" as const,
    assemblyPlanRef: assemblyPlan.contentHash,
    decision: "PASS" as const,
    evidenceHash: A.evidenceHash,
  };
  return compileSyntheticRelease({
    assemblyPlan,
    validationEvidence,
    compilerVersion: "1.0.0",
    runtimeVersion: "1.0.0",
    environmentSchema: [],
  });
}

function compileApprovedB() {
  const approval = requireApprovedSuccessor();
  const lineage = canonicalLineage(B);
  const factoryInput = {
    journeyBinding: {
      contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
      journey: {
        contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
        stages: [
          { kind: "approved-process" as const, identityRef: B.revisionRef, provenanceRef: PRODUCT.artifactRef },
          { kind: "analysis-definition" as const, identityRef: B.analysisRef, provenanceRef: B.revisionRef },
          { kind: "capability-assembly" as const, identityRef: "assembly:pending", provenanceRef: B.definitionRef },
          { kind: "validation" as const, identityRef: "validation:pending", provenanceRef: "assembly:pending" },
          { kind: "compiler-release" as const, identityRef: "release:pending", provenanceRef: "validation:pending" },
          { kind: "deployment" as const, identityRef: "deployment:pending", provenanceRef: "release:pending" },
        ],
      },
      lineage,
    },
    definition: {
      definition: "SystemDefinition" as const,
      analysisRef: B.analysisRef,
      recipeRef: approval.toRevision.revisionRef,
      capabilities: [{ id: "orders", capability: "orders", requirementRefs: ["REQ-REFERENCE-1", "REQ-REFERENCE-2"] }],
    },
    catalogEntries: [{ capability: "orders", provider: "builtin", version: "1.0.0" }],
    recipeTraceability: {
      modules: [{ requirementIds: ["REQ-REFERENCE-1", "REQ-REFERENCE-2"] }],
      rules: [],
      responsibilities: [],
      exceptions: [],
    },
    analysisTraceability: {
      findings: [{ recipeRequirementRefs: ["REQ-REFERENCE-1", "REQ-REFERENCE-2"] }],
    },
    definitionTraceability: {
      entities: [],
      processes: [],
      actions: [],
      capabilities: [{ capability: "orders", requirementRefs: ["REQ-REFERENCE-1", "REQ-REFERENCE-2"] }],
      views: [],
      policies: [],
      integrations: [],
    },
    compilerVersion: "1.0.0",
    runtimeVersion: "1.0.0",
    releaseId: PRODUCT.releaseId,
    releaseVersion: B.releaseVersion,
    publishedAt: "2026-09-02T03:00:00.000Z",
    environment: {
      kind: "EnvironmentProfile" as const,
      environmentRef: PRODUCT.environmentRef,
      runtimeVersions: ["1.0.0"],
      bindings: [],
    },
    acceptanceChecks: [{ name: "factory-e2e", pass: true }],
    startedAt: "2026-09-02T02:59:00.000Z",
    completedAt: "2026-09-02T03:00:00.000Z",
  };
  const bootstrap = executeFactoryOperatorBootstrap({
    contractVersion: FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION,
    prerequisites: { nodeVersion: "24.0.0", npmVersion: "11.0.0", factoryE2EAvailable: true },
    config: { inputPath: "fixture://p19-successor-growing-proof" },
    factoryInput,
  });
  const assemblyPlan = bootstrap.result.assemblyPlan;
  const validationEvidence = bootstrap.result.validationEvidence;
  if (typeof assemblyPlan !== "object" || assemblyPlan === null || !("kind" in assemblyPlan) || assemblyPlan.kind !== "AssemblyPlan") {
    throw new Error("successor assemblyPlan must be canonical AssemblyPlan evidence");
  }
  if (
    typeof validationEvidence !== "object"
    || validationEvidence === null
    || !("kind" in validationEvidence)
    || validationEvidence.kind !== "ValidationEvidence"
  ) {
    throw new Error("successor validationEvidence must be canonical ValidationEvidence");
  }
  const compilation = compileSyntheticRelease({
    assemblyPlan: assemblyPlan as CompilerAssemblyPlan,
    validationEvidence: validationEvidence as CompilerValidationEvidence,
    compilerVersion: "1.0.0",
    runtimeVersion: "1.0.0",
    environmentSchema: [],
  });
  return Object.freeze({ approval, lineage, compilation });
}

function publishCandidate(
  releases: ReleaseRegistry,
  revision: typeof A | typeof B,
  compilation: ReturnType<typeof compileRetainedA>,
  expectedActiveDeploymentId: string | null,
  minute: number,
) {
  const payloads = new InMemoryArtifactPayloadRepository();
  const stored = payloads.publish({
    artifactHash: compilation.artifact.artifactHash,
    files: compilation.files,
  });
  assert.deepEqual(
    payloads.publish({ artifactHash: compilation.artifact.artifactHash, files: compilation.files }),
    stored,
  );
  const publishedRelease = releases.publish({
    releaseId: PRODUCT.releaseId,
    version: revision.releaseVersion,
    artifact: compilation.artifact,
    publishedAt: `2026-09-02T03:${minute.toString().padStart(2, "0")}:00.000Z`,
  });
  const lineage = canonicalLineage(revision);
  const releaseIdentityRef = `${publishedRelease.releaseId}@${publishedRelease.version}`;
  const releaseAdmission = releases.admitSystemDefinitionLineage({
    releaseId: publishedRelease.releaseId,
    version: publishedRelease.version,
    systemDefinitionRef: revision.definitionRef,
    lineageHop: {
      contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
      kind: "system-definition-to-release",
      from: lineage.systemDefinition,
      to: {
        contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
        kind: "release",
        identityRef: releaseIdentityRef,
      },
    },
  });
  return {
    upstream: lineage,
    releaseAdmission,
    publishedRelease,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: payloads,
    environment: {
      kind: "EnvironmentProfile" as const,
      environmentRef: PRODUCT.environmentRef,
      runtimeVersions: ["1.0.0"],
      bindings: [],
    },
    processEnvironment: {
      SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1",
      SYSTEM_BUILDER_OBSERVE_URL: "http://127.0.0.1:1",
    },
    expectedActiveDeploymentId,
    startedAt: `2026-09-02T03:${minute.toString().padStart(2, "0")}:01.000Z`,
    completedAt: `2026-09-02T03:${minute.toString().padStart(2, "0")}:02.000Z`,
  };
}

function admitDeploymentLineage(
  deployments: DeploymentRegistry,
  deploymentId: string,
  releaseIdentityRef: string,
) {
  return deployments.admitReleaseLineage({
    deploymentId,
    releaseIdentityRef,
    lineageHop: {
      contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
      kind: "release-to-deployment",
      from: {
        contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
        kind: "release",
        identityRef: releaseIdentityRef,
      },
      to: {
        contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
        kind: "deployment",
        identityRef: deploymentId,
      },
    },
  });
}

test("TASK-462 proves approved process evolution A(rev1) -> B(rev2) -> exact retained A", async (t) => {
  const releases = new ReleaseRegistry();
  const deployments = new DeploymentRegistry(new InMemoryDeploymentRecordStorage());
  const orchestrator = new SingleHostActiveRuntimeOrchestrator(deployments);
  t.after(async () => {
    await orchestrator.stopActive(PRODUCT.environmentRef);
  });

  const compiledA = compileRetainedA();
  const retainedA = publishCandidate(releases, A, compiledA, null, 10);
  const originalARelease = releases.get(PRODUCT.releaseId, A.releaseVersion);
  const a = await orchestrator.promote(retainedA);
  assert.equal(a.ok, true);
  if (!a.ok || !a.active) return;
  const aDeploymentId = a.candidateRecord.deploymentId;
  const aReleaseRef = retainedA.releaseAdmission.releaseIdentityRef;
  const aAdmission = admitDeploymentLineage(deployments, aDeploymentId, aReleaseRef);
  const aRecord = deployments.get(aDeploymentId);

  const generatedB = compileApprovedB();
  const generatedBAgain = compileApprovedB();
  assert.deepEqual(generatedB.compilation, generatedBAgain.compilation);
  assert.equal(generatedB.approval.decision.outcome, "approved");
  assert.equal(generatedB.approval.toRevision.previousRevisionRef, A.revisionRef);
  assert.equal(generatedB.lineage.systemDefinition.identityRef, B.definitionRef);

  const successorB = publishCandidate(releases, B, generatedB.compilation, aDeploymentId, 11);
  assert.equal(successorB.releaseAdmission.systemDefinitionRef, B.definitionRef);
  const b = await orchestrator.promote(successorB);
  assert.equal(b.ok, true);
  if (!b.ok || !b.active) return;
  const bDeploymentId = b.candidateRecord.deploymentId;
  const bReleaseRef = successorB.releaseAdmission.releaseIdentityRef;
  const bAdmission = admitDeploymentLineage(deployments, bDeploymentId, bReleaseRef);
  const bRecord = deployments.get(bDeploymentId);
  const bRelease = releases.get(PRODUCT.releaseId, B.releaseVersion);

  assert.equal(b.promoted, true);
  assert.equal(b.decision.previousActiveDeploymentId, aDeploymentId);
  assert.equal(b.candidateRecord.releaseHash, generatedB.compilation.artifact.artifactHash);
  assert.equal((await orchestrator.health(PRODUCT.environmentRef)).status, "UP");
  assert.deepEqual(deployments.get(aDeploymentId), aRecord);
  assert.deepEqual(releases.get(PRODUCT.releaseId, A.releaseVersion), originalARelease);

  const restored = await orchestrator.promote({
    ...retainedA,
    expectedActiveDeploymentId: bDeploymentId,
    startedAt: "2026-09-02T03:12:01.000Z",
    completedAt: "2026-09-02T03:12:02.000Z",
  });
  assert.equal(restored.ok, true);
  if (!restored.ok || !restored.active) return;
  const restoredAdmission = admitDeploymentLineage(
    deployments,
    restored.candidateRecord.deploymentId,
    aReleaseRef,
  );

  assert.equal(restored.promoted, true);
  assert.equal(restored.candidateRecord.publishedReleaseRef, aReleaseRef);
  assert.equal(restored.candidateRecord.releaseHash, retainedA.releaseArtifact.artifactHash);
  assert.equal((await orchestrator.health(PRODUCT.environmentRef)).status, "UP");
  assert.deepEqual(releases.get(PRODUCT.releaseId, A.releaseVersion), originalARelease);
  assert.deepEqual(releases.get(PRODUCT.releaseId, B.releaseVersion), bRelease);
  assert.deepEqual(deployments.get(aDeploymentId), aRecord);
  assert.deepEqual(deployments.get(bDeploymentId), bRecord);
  assert.equal(releases.get(PRODUCT.releaseId, "0.0.3"), undefined);

  const history = JSON.stringify({
    approval: generatedB.approval,
    a: {
      revision: retainedA.upstream.processRevision,
      definition: retainedA.upstream.systemDefinition,
      release: retainedA.releaseAdmission,
      deployment: aAdmission,
      restoredDeployment: restoredAdmission,
    },
    b: {
      revision: successorB.upstream.processRevision,
      definition: successorB.upstream.systemDefinition,
      release: successorB.releaseAdmission,
      deployment: bAdmission,
    },
  });
  for (const ref of [A.revisionRef, A.definitionRef, aReleaseRef, B.revisionRef, B.definitionRef, bReleaseRef]) {
    assert.equal(history.includes(ref), true);
  }
  assert.equal(history.includes("secret://"), false);
  assert.equal(history.includes("EnvironmentProfile"), false);

  const repeatedRestore = await orchestrator.promote({
    ...retainedA,
    expectedActiveDeploymentId: bDeploymentId,
    startedAt: "2026-09-02T03:13:01.000Z",
    completedAt: "2026-09-02T03:13:02.000Z",
  });
  assert.equal(repeatedRestore.ok, true);
  if (!repeatedRestore.ok) return;
  assert.equal(repeatedRestore.promoted, false);
  assert.equal(repeatedRestore.decision.outcome, "stale-active");
  assert.equal(
    repeatedRestore.decision.resultingActiveDeploymentId,
    restored.candidateRecord.deploymentId,
  );
});

test("TASK-462 cumulative adversarial boundaries fail closed without partial-success evidence", async (t) => {
  const releases = new ReleaseRegistry();
  const deployments = new DeploymentRegistry(new InMemoryDeploymentRecordStorage());
  const orchestrator = new SingleHostActiveRuntimeOrchestrator(deployments);
  t.after(async () => {
    await orchestrator.stopActive(PRODUCT.environmentRef);
  });

  assert.throws(
    () => requireApprovedSuccessor(successorApproval("rejected")),
    /requires authoritative approval/,
  );
  assert.equal(releases.get(PRODUCT.releaseId, B.releaseVersion), undefined);

  const retainedA = publishCandidate(releases, A, compileRetainedA(), null, 20);
  const a = await orchestrator.promote(retainedA);
  assert.equal(a.ok, true);
  if (!a.ok || !a.active) return;
  const aDeploymentId = a.candidateRecord.deploymentId;
  const aRecord = deployments.get(aDeploymentId);

  const generatedB = compileApprovedB();
  const successorB = publishCandidate(releases, B, generatedB.compilation, aDeploymentId, 21);

  const stale = await orchestrator.promote({
    ...successorB,
    expectedActiveDeploymentId: "deployment:reference-orders:substituted",
    startedAt: "2026-09-02T03:22:01.000Z",
    completedAt: "2026-09-02T03:22:02.000Z",
  });
  assert.equal(stale.ok, true);
  if (!stale.ok) return;
  assert.equal(stale.promoted, false);
  assert.equal(stale.decision.outcome, "stale-active");
  assert.deepEqual(deployments.getActive(PRODUCT.environmentRef), aRecord);

  const verified = successorB.artifactPayloadReader.getVerified(successorB.releaseArtifact);
  const tamperedPayloads = new InMemoryArtifactPayloadRepository();
  tamperedPayloads.publish({
    artifactHash: successorB.releaseArtifact.artifactHash,
    files: verified.files.map((file) =>
      file.path === "runtime-entry.mjs"
        ? { ...file, content: `${file.content}\n// substituted` }
        : file),
  });
  const tampered = await orchestrator.promote({
    ...successorB,
    artifactPayloadReader: tamperedPayloads,
    startedAt: "2026-09-02T03:23:01.000Z",
    completedAt: "2026-09-02T03:23:02.000Z",
  });
  assert.equal(tampered.ok, false);
  if (!tampered.ok) {
    assert.equal(tampered.outcome, "candidate-failed");
    assert.equal(tampered.diagnostic.code, "ARTIFACT_PAYLOAD_INVALID");
    assert.match(tampered.diagnostic.detail, /ARTIFACT_PAYLOAD_FILE_HASH_MISMATCH:runtime-entry\.mjs/);
  }
  assert.deepEqual(deployments.getActive(PRODUCT.environmentRef), aRecord);
  assert.equal((await orchestrator.health(PRODUCT.environmentRef)).status, "UP");

  const incompatible = await orchestrator.promote({
    ...successorB,
    environment: {
      ...successorB.environment,
      runtimeVersions: ["2.0.0"],
    },
    startedAt: "2026-09-02T03:24:01.000Z",
    completedAt: "2026-09-02T03:24:02.000Z",
  });
  assert.equal(incompatible.ok, false);
  if (!incompatible.ok) {
    assert.equal(incompatible.outcome, "candidate-failed");
    assert.equal(incompatible.diagnostic.code, "RUNTIME_INCOMPATIBLE");
  }
  assert.deepEqual(deployments.getActive(PRODUCT.environmentRef), aRecord);
  assert.equal((await orchestrator.health(PRODUCT.environmentRef)).status, "UP");

  const evidence = JSON.stringify({
    active: deployments.getActive(PRODUCT.environmentRef),
    releaseA: releases.get(PRODUCT.releaseId, A.releaseVersion),
    releaseB: releases.get(PRODUCT.releaseId, B.releaseVersion),
  });
  assert.equal(evidence.includes("secret://"), false);
  assert.equal(evidence.includes("EnvironmentProfile"), false);
});