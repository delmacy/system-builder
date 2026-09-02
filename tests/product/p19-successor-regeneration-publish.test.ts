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
  normalizeProcessRevisionIdentity,
} from "../../packages/contracts/process-versioning/index.js";
import { ReleaseRegistry } from "../../packages/release/index.js";
import { executeFactoryOperatorBootstrap } from "../../scripts/factory-operator-bootstrap-command.js";

const PROCESS = Object.freeze({
  artifactRef: "process:reference-orders",
  predecessorRevisionRef: "process-revision:reference-orders:v1",
  successorRevisionRef: "process-revision:reference-orders:v2",
  successorAnalysisRef: "analysis:reference-orders:v2",
  successorDefinitionRef: "system-definition:reference-orders:v2",
  authorityRef: "authority:reference-process-owner",
  releaseId: "reference-orders-system",
  predecessorReleaseVersion: "0.0.1",
  successorReleaseVersion: "0.0.2",
});

function successorApproval(options: Readonly<{
  outcome?: "approved" | "rejected";
  previousRevisionRef?: string;
}> = {}) {
  const fromRevision = normalizeProcessRevisionIdentity({
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef: PROCESS.artifactRef,
    revisionRef: PROCESS.predecessorRevisionRef,
    revisionNumber: 1,
    previousRevisionRef: null,
  });
  const toRevision = normalizeProcessRevisionIdentity({
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef: PROCESS.artifactRef,
    revisionRef: PROCESS.successorRevisionRef,
    revisionNumber: 2,
    previousRevisionRef: options.previousRevisionRef ?? PROCESS.predecessorRevisionRef,
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
  normalizeProcessSemanticChangeClassificationEvidence(classificationInput);
  const rationaleInput = {
    diffRef: classificationInput.diffRef,
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
    outcome: options.outcome ?? "approved",
    decisionId: "decision:approve-reference-orders-v2",
    authorityRef: PROCESS.authorityRef,
    decisionDescriptor: {
      boundaryVersion: DECISION_BOUNDARY_VERSION,
      decisionId: "decision:approve-reference-orders-v2",
      category: "human-decision",
    },
    decisionMetadata: { authorityRef: PROCESS.authorityRef },
  });
  return Object.freeze({ fromRevision, toRevision, decision });
}

function requireApprovedSuccessor(input = successorApproval()) {
  if (input.decision.outcome !== "approved") {
    throw new Error("successor process revision requires authoritative approval");
  }
  if (input.decision.fromRevisionRef !== input.fromRevision.revisionRef) {
    throw new Error("approval predecessor does not match canonical predecessor revision");
  }
  if (input.decision.toRevisionRef !== input.toRevision.revisionRef) {
    throw new Error("approval successor does not match canonical successor revision");
  }
  return input;
}

function successorFactoryInput(approval = requireApprovedSuccessor()) {
  const revision = approval.toRevision;
  const processRevision = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "process-revision" as const,
    processRevision: revision,
  };
  const analysis = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "analysis" as const,
    identityRef: PROCESS.successorAnalysisRef,
  };
  const systemDefinition = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "system-definition" as const,
    identityRef: PROCESS.successorDefinitionRef,
  };
  return {
    journeyBinding: {
      contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
      journey: {
        contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
        stages: [
          { kind: "approved-process", identityRef: revision.revisionRef, provenanceRef: revision.artifactRef },
          { kind: "analysis-definition", identityRef: analysis.identityRef, provenanceRef: revision.revisionRef },
          { kind: "capability-assembly", identityRef: "assembly:pending", provenanceRef: systemDefinition.identityRef },
          { kind: "validation", identityRef: "validation:pending", provenanceRef: "assembly:pending" },
          { kind: "compiler-release", identityRef: "release:pending", provenanceRef: "validation:pending" },
          { kind: "deployment", identityRef: "deployment:pending", provenanceRef: "release:pending" },
        ],
      },
      lineage: {
        contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
        processRevision,
        analysis,
        systemDefinition,
        hops: [
          {
            contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
            kind: "process-revision-to-analysis" as const,
            from: processRevision,
            to: analysis,
          },
          {
            contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
            kind: "analysis-to-system-definition" as const,
            from: analysis,
            to: systemDefinition,
          },
        ],
      },
    },
    definition: {
      definition: "SystemDefinition" as const,
      analysisRef: analysis.identityRef,
      recipeRef: revision.revisionRef,
      capabilities: [{ id: "orders", capability: "orders", requirementRefs: ["REQ-REFERENCE-1", "REQ-REFERENCE-2"] }],
    },
    catalogEntries: [{ capability: "orders", provider: "builtin", version: "1.0.0" }],
    recipeTraceability: { modules: [{ requirementIds: ["REQ-REFERENCE-1", "REQ-REFERENCE-2"] }], rules: [], responsibilities: [], exceptions: [] },
    analysisTraceability: { findings: [{ recipeRequirementRefs: ["REQ-REFERENCE-1", "REQ-REFERENCE-2"] }] },
    definitionTraceability: {
      entities: [], processes: [], actions: [],
      capabilities: [{ capability: "orders", requirementRefs: ["REQ-REFERENCE-1", "REQ-REFERENCE-2"] }],
      views: [], policies: [], integrations: [],
    },
    compilerVersion: "1.0.0",
    runtimeVersion: "1.0.0",
    releaseId: PROCESS.releaseId,
    releaseVersion: PROCESS.successorReleaseVersion,
    publishedAt: "2026-09-01T21:00:00.000Z",
    environment: {
      kind: "EnvironmentProfile" as const,
      environmentRef: "environment:p19:reference-process",
      runtimeVersions: ["1.0.0"],
      bindings: [],
    },
    acceptanceChecks: [{ name: "factory-e2e", pass: true }],
    startedAt: "2026-09-01T20:59:00.000Z",
    completedAt: "2026-09-01T21:00:00.000Z",
  };
}

function bootstrapSuccessor(input = successorFactoryInput()) {
  return executeFactoryOperatorBootstrap({
    contractVersion: FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION,
    prerequisites: { nodeVersion: "24.0.0", npmVersion: "11.0.0", factoryE2EAvailable: true },
    config: { inputPath: "fixture://p19-successor-regeneration" },
    factoryInput: input,
  });
}

function compilerPredecessors(result: ReturnType<typeof bootstrapSuccessor>) {
  const assemblyPlan = result.result.assemblyPlan;
  const validationEvidence = result.result.validationEvidence;
  if (typeof assemblyPlan !== "object" || assemblyPlan === null || !("kind" in assemblyPlan) || assemblyPlan.kind !== "AssemblyPlan") {
    throw new Error("successor assemblyPlan must be canonical AssemblyPlan evidence");
  }
  if (typeof validationEvidence !== "object" || validationEvidence === null || !("kind" in validationEvidence) || validationEvidence.kind !== "ValidationEvidence") {
    throw new Error("successor validationEvidence must be canonical ValidationEvidence");
  }
  return {
    assemblyPlan: assemblyPlan as CompilerAssemblyPlan,
    validationEvidence: validationEvidence as CompilerValidationEvidence,
  };
}

function compileApprovedSuccessor(approval = requireApprovedSuccessor()) {
  const input = successorFactoryInput(approval);
  const bootstrap = bootstrapSuccessor(input);
  const predecessors = compilerPredecessors(bootstrap);
  const compilation = compileSyntheticRelease({
    ...predecessors,
    compilerVersion: "1.0.0",
    runtimeVersion: "1.0.0",
  });
  return Object.freeze({ approval, input, bootstrap, predecessors, compilation });
}

test("TASK-459 regenerates and publishes B from the exact approved successor process revision", () => {
  const first = compileApprovedSuccessor();
  const repeated = compileApprovedSuccessor();
  assert.deepEqual(first.compilation, repeated.compilation);
  assert.equal(first.approval.toRevision.revisionRef, PROCESS.successorRevisionRef);
  assert.equal(first.approval.toRevision.previousRevisionRef, PROCESS.predecessorRevisionRef);
  assert.equal(first.input.definition.recipeRef, PROCESS.successorRevisionRef);
  assert.equal(first.input.journeyBinding.lineage.systemDefinition.identityRef, PROCESS.successorDefinitionRef);
  assert.equal(first.predecessors.assemblyPlan.systemDefinitionRef, PROCESS.successorDefinitionRef);
  assert.equal(first.compilation.artifact.assemblyPlanRef, first.predecessors.assemblyPlan.contentHash);
  assert.equal(first.compilation.artifact.validationEvidenceRef, first.predecessors.validationEvidence.evidenceHash);

  const payloads = new InMemoryArtifactPayloadRepository();
  const stored = payloads.publish({ artifactHash: first.compilation.artifact.artifactHash, files: first.compilation.files });
  const repeatedStored = payloads.publish({ artifactHash: first.compilation.artifact.artifactHash, files: first.compilation.files });
  assert.deepEqual(stored, repeatedStored);
  const verified = payloads.getVerified(first.compilation.artifact);
  assert.equal(verified.verified, true);
  assert.deepEqual(verified.files, first.compilation.files);

  const releases = new ReleaseRegistry();
  const retainedA = releases.publish({
    releaseId: PROCESS.releaseId,
    version: PROCESS.predecessorReleaseVersion,
    artifact: { kind: "ReleaseArtifact", artifactHash: `sha256:${"a".repeat(64)}`, validationEvidenceRef: "validation:reference-orders:v1" },
    publishedAt: "2026-09-01T18:30:00.000Z",
  });
  const retainedABefore = releases.get(PROCESS.releaseId, PROCESS.predecessorReleaseVersion);
  const publishedB = releases.publish({
    releaseId: PROCESS.releaseId,
    version: PROCESS.successorReleaseVersion,
    artifact: first.compilation.artifact,
    publishedAt: "2026-09-01T21:00:00.000Z",
  });
  const releaseIdentityRef = `${publishedB.releaseId}@${publishedB.version}`;
  const lineageAdmission = releases.admitSystemDefinitionLineage({
    releaseId: publishedB.releaseId,
    version: publishedB.version,
    systemDefinitionRef: PROCESS.successorDefinitionRef,
    lineageHop: {
      contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
      kind: "system-definition-to-release",
      from: { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "system-definition", identityRef: PROCESS.successorDefinitionRef },
      to: { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "release", identityRef: releaseIdentityRef },
    },
  });

  assert.deepEqual(releases.get(PROCESS.releaseId, PROCESS.predecessorReleaseVersion), retainedABefore);
  assert.deepEqual(retainedABefore, retainedA);
  assert.equal(publishedB.artifactHash, first.compilation.artifact.artifactHash);
  assert.equal(publishedB.validationEvidenceRef, first.compilation.artifact.validationEvidenceRef);
  assert.equal(lineageAdmission.systemDefinitionRef, PROCESS.successorDefinitionRef);
  assert.equal(lineageAdmission.releaseIdentityRef, releaseIdentityRef);
  assert.throws(() => releases.publish({
    releaseId: PROCESS.releaseId,
    version: PROCESS.successorReleaseVersion,
    artifact: first.compilation.artifact,
    publishedAt: "2026-09-01T21:00:00.000Z",
  }), /RELEASE_DUPLICATE_IDENTITY/);

  const evidence = JSON.stringify({ approval: first.approval, artifact: first.compilation.artifact, publishedB, lineageAdmission });
  assert.equal(evidence.includes(PROCESS.successorRevisionRef), true);
  assert.equal(evidence.includes("secret://"), false);
  assert.equal(evidence.includes("EnvironmentProfile"), false);
});

test("TASK-459 fails closed before Release publication for rejected, stale or broken successor provenance", () => {
  const releases = new ReleaseRegistry();
  assert.throws(() => compileApprovedSuccessor(requireApprovedSuccessor(successorApproval({ outcome: "rejected" }))), /requires authoritative approval/);
  assert.equal(releases.get(PROCESS.releaseId, PROCESS.successorReleaseVersion), undefined);

  assert.throws(() => successorApproval({ previousRevisionRef: "process-revision:reference-orders:substituted" }), /canonical predecessor/);
  assert.equal(releases.get(PROCESS.releaseId, PROCESS.successorReleaseVersion), undefined);

  const broken = successorFactoryInput();
  broken.journeyBinding.lineage.processRevision.processRevision.revisionRef = "process-revision:reference-orders:substituted";
  assert.throws(() => bootstrapSuccessor(broken));
  assert.equal(releases.get(PROCESS.releaseId, PROCESS.successorReleaseVersion), undefined);
});

test("TASK-459 rejects stale Compiler evidence and unverifiable payload before immutable B publication", () => {
  const canonical = compileApprovedSuccessor();
  const releases = new ReleaseRegistry();
  const staleValidation: CompilerValidationEvidence = Object.freeze({
    ...canonical.predecessors.validationEvidence,
    assemblyPlanRef: `sha256:${"0".repeat(64)}`,
  });
  assert.throws(() => compileSyntheticRelease({
    assemblyPlan: canonical.predecessors.assemblyPlan,
    validationEvidence: staleValidation,
    compilerVersion: "1.0.0",
    runtimeVersion: "1.0.0",
  }), /COMPILER_VALIDATION_ASSEMBLY_MISMATCH/);
  assert.equal(releases.get(PROCESS.releaseId, PROCESS.successorReleaseVersion), undefined);

  const substitutedFiles = canonical.compilation.files.map((file, index) =>
    index === 0 ? Object.freeze({ ...file, content: `${file.content}\nsubstituted` }) : file,
  );
  const payloads = new InMemoryArtifactPayloadRepository();
  payloads.publish({ artifactHash: canonical.compilation.artifact.artifactHash, files: substitutedFiles });
  assert.throws(() => payloads.getVerified(canonical.compilation.artifact), /ARTIFACT_PAYLOAD_FILE_HASH_MISMATCH/);
  assert.equal(releases.get(PROCESS.releaseId, PROCESS.successorReleaseVersion), undefined);
});
