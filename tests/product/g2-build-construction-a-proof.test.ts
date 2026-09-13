import assert from "node:assert/strict";
import test from "node:test";

import {
  declaredDependencyIsFetchedMaterial,
  fetchedMaterialIsAuthoritative,
  materialPreservesBuildLineage,
  mutableTagEstablishesCanonicalMaterialIdentity,
  providerIdentityEstablishesCanonicalMaterialIdentity,
  type BuildDefinition,
  type DeclaredDependency,
  type FetchedMaterial,
  type ResolvedDependency,
} from "../../packages/contracts/build-reproducibility/build-material-identity.js";
import {
  buildExecutionContextIsQualified,
  providerAcknowledgementEstablishesQualifiedRunner,
  sameEnvironmentLabelEstablishesSameEffectiveInputs,
  type BuildExecutionContext,
} from "../../packages/contracts/build-reproducibility/build-execution-context.js";
import {
  allResidualBuildCohortsAreDrained,
  cacheEntryIsCurrentAndProvenanced,
  cacheHitEstablishesTrustedCurrentMaterial,
  evaluateReproducibilityClaim,
  successfulBuildsEstablishReproducibility,
  type CacheLineage,
  type ReproducibilityObservation,
  type ResidualBuildCohort,
} from "../../packages/contracts/build-reproducibility/reproducibility-cache-drainage.js";

const evaluatedAt = "2026-09-13T03:30:00.000Z";
const currentness = { state: "CURRENT" as const, assessedAt: "2026-09-13T03:00:00.000Z", validUntil: "2026-09-13T04:00:00.000Z" };
const qualifiedEvidence = { evidenceRef: "evidence:qualified", completeness: "KNOWN" as const, currentness: "CURRENT" as const };

const build: BuildDefinition = { buildRef: "build:system-builder", revisionRef: "revision:42" };
const declaration: DeclaredDependency = {
  declarationRef: "declaration:pkg-a",
  buildRef: build.buildRef,
  producingRevisionRef: build.revisionRef,
  dependencyRef: "dependency:pkg-a",
  selector: "^1.0.0",
};
const resolution: ResolvedDependency = {
  resolutionRef: "resolution:pkg-a:1.2.3",
  declarationRef: declaration.declarationRef,
  resolvedRef: "pkg-a@1.2.3",
  providerRef: "registry:primary",
  providerLocalId: "local:123",
  mutableTag: "latest",
};
const material = (overrides: Partial<FetchedMaterial> = {}): FetchedMaterial => ({
  materialRef: "material:sha256:aaa",
  resolutionRef: resolution.resolutionRef,
  producingRevisionRef: build.revisionRef,
  provenanceRef: "provenance:attestation:1",
  contentDigest: "sha256:aaa",
  completeness: "KNOWN",
  currentness,
  ...overrides,
});

const executionContext = (overrides: Partial<BuildExecutionContext> = {}): BuildExecutionContext => ({
  executionContextRef: "execution:linux-x64:42",
  runner: { runnerRef: "runner:linux", runnerRevisionRef: "runner-revision:9", populationRef: "population:linux-x64", locality: "QUALIFIED" },
  toolchain: { toolchainRef: "toolchain:node", toolchainRevisionRef: "node:24" },
  environment: { environmentRef: "environment:sha256:env", environmentLabel: "linux-x64" },
  inputBoundary: { inputBoundaryRef: "inputs:sha256:inputs", qualifiedInputRefs: ["material:sha256:aaa"] },
  controlledImpurities: [],
  providerEvidence: {
    providerRef: "ci:provider-a",
    providerLocalRunnerId: "runner-local:7",
    support: "SUPPORTED",
    acknowledged: true,
    completeness: "KNOWN",
    currentness,
  },
  ...overrides,
});

const observation = (overrides: Partial<ReproducibilityObservation> = {}): ReproducibilityObservation => ({
  observationRef: "observation:1",
  buildRevisionRef: build.revisionRef,
  environmentRef: "environment:sha256:env",
  populationRef: "population:linux-x64",
  executionContextRef: "execution:linux-x64:42",
  materialBoundaryRef: "inputs:sha256:inputs",
  outputDigest: "sha256:output",
  outcome: "SUCCEEDED",
  evidence: qualifiedEvidence,
  ...overrides,
});

const cache = (overrides: Partial<CacheLineage> = {}): CacheLineage => ({
  cacheEntryRef: "cache:entry:1",
  cacheEpochRef: "cache:epoch:4",
  producingRevisionRef: build.revisionRef,
  producingExecutionContextRef: "execution:linux-x64:42",
  producingMaterialBoundaryRef: "inputs:sha256:inputs",
  contentDigest: "sha256:cache",
  provenance: qualifiedEvidence,
  ...overrides,
});

const cohort = (overrides: Partial<ResidualBuildCohort> = {}): ResidualBuildCohort => ({
  cohortRef: "cohort:runner:legacy",
  kind: "RUNNER",
  epochRef: "runner:epoch:3",
  populationRef: "population:legacy-runner",
  residualCount: 0,
  evidence: qualifiedEvidence,
  ...overrides,
});

test("TASK-538 integrated lineage survives provider and runner substitution without provider identity becoming canonical", () => {
  const fetched = material();
  const original = executionContext();
  const substituted = executionContext({
    executionContextRef: "execution:linux-x64:43",
    runner: { ...original.runner, runnerRef: "runner:replacement", runnerRevisionRef: "runner-revision:10" },
    providerEvidence: { ...original.providerEvidence, providerRef: "ci:provider-b", providerLocalRunnerId: "runner-local:99" },
  });

  assert.equal(materialPreservesBuildLineage(build, declaration, resolution, fetched), true);
  assert.equal(fetchedMaterialIsAuthoritative(fetched, evaluatedAt), true);
  assert.equal(buildExecutionContextIsQualified(original, evaluatedAt), true);
  assert.equal(buildExecutionContextIsQualified(substituted, evaluatedAt), true);
  assert.equal(providerIdentityEstablishesCanonicalMaterialIdentity(resolution, fetched), false);
  assert.equal(mutableTagEstablishesCanonicalMaterialIdentity(resolution, fetched), false);
  assert.equal(declaredDependencyIsFetchedMaterial(declaration, fetched), false);
});

test("TASK-538 build success, cache hit and provider acknowledgement cannot masquerade as reproducibility authority", () => {
  const left = observation();
  const right = observation({ observationRef: "observation:2" });
  const context = executionContext();

  assert.equal(successfulBuildsEstablishReproducibility(left, right), false);
  assert.equal(evaluateReproducibilityClaim({ claimRef: "claim:qualified", left, right }), "PASS");
  assert.equal(cacheEntryIsCurrentAndProvenanced(cache()), true);
  assert.equal(cacheHitEstablishesTrustedCurrentMaterial(cache()), false);
  assert.equal(providerAcknowledgementEstablishesQualifiedRunner(context.providerEvidence), false);
});

test("TASK-538 preserves runner toolchain input and currentness qualification under stale and UNKNOWN evidence", () => {
  const context = executionContext();
  assert.equal(buildExecutionContextIsQualified(context, evaluatedAt), true);
  assert.equal(buildExecutionContextIsQualified(executionContext({
    providerEvidence: { ...context.providerEvidence, completeness: "UNKNOWN" },
  }), evaluatedAt), false);
  assert.equal(buildExecutionContextIsQualified(executionContext({
    providerEvidence: { ...context.providerEvidence, currentness: { ...currentness, state: "STALE" } },
  }), evaluatedAt), false);
  assert.equal(buildExecutionContextIsQualified(executionContext({
    runner: { ...context.runner, locality: "UNKNOWN" },
  }), evaluatedAt), false);
  assert.equal(sameEnvironmentLabelEstablishesSameEffectiveInputs(
    context.environment,
    { environmentRef: "environment:other", environmentLabel: context.environment.environmentLabel },
  ), false);
});

test("TASK-538 PARTIAL UNKNOWN and stale material/cache evidence remain non-strengthening", () => {
  assert.equal(fetchedMaterialIsAuthoritative(material({ completeness: "PARTIAL" }), evaluatedAt), false);
  assert.equal(fetchedMaterialIsAuthoritative(material({ completeness: "UNKNOWN" }), evaluatedAt), false);
  assert.equal(fetchedMaterialIsAuthoritative(material({ currentness: { ...currentness, state: "STALE" } }), evaluatedAt), false);

  const left = observation();
  assert.equal(evaluateReproducibilityClaim({
    claimRef: "claim:unknown",
    left,
    right: observation({ observationRef: "observation:unknown", evidence: { ...qualifiedEvidence, completeness: "UNKNOWN" } }),
  }), "INCONCLUSIVE");
  assert.equal(cacheEntryIsCurrentAndProvenanced(cache({ provenance: { ...qualifiedEvidence, currentness: "STALE" } })), false);
});

test("TASK-538 residual runner and cache populations require explicit qualified finite drainage", () => {
  const runner = cohort();
  const cacheResidual = cohort({ cohortRef: "cohort:cache:legacy", kind: "CACHE", epochRef: "cache:epoch:3", populationRef: "population:legacy-cache" });

  assert.equal(allResidualBuildCohortsAreDrained([runner, cacheResidual]), true);
  assert.equal(allResidualBuildCohortsAreDrained([runner, cohort({ populationRef: null })]), false);
  assert.equal(allResidualBuildCohortsAreDrained([runner, cohort({ residualCount: null })]), false);
  assert.equal(allResidualBuildCohortsAreDrained([runner, cohort({ residualCount: 1 })]), false);
  assert.equal(allResidualBuildCohortsAreDrained([runner, cohort({ evidence: { ...qualifiedEvidence, completeness: "PARTIAL" } })]), false);
  assert.equal(allResidualBuildCohortsAreDrained([runner, cohort({ evidence: { ...qualifiedEvidence, currentness: "STALE" } })]), false);
  assert.equal(allResidualBuildCohortsAreDrained([]), false);
});
