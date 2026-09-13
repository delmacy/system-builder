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
  executionContextClaimsHermeticity,
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

const evaluatedAt = "2026-09-13T04:00:00Z";
const currentness = {
  state: "CURRENT" as const,
  assessedAt: "2026-09-13T03:00:00Z",
  validUntil: "2026-09-13T05:00:00Z",
};

const build: BuildDefinition = {
  buildRef: "build:system-builder",
  revisionRef: "git:revision-a",
};

const declaration: DeclaredDependency = {
  declarationRef: "dependency:declared:react",
  buildRef: build.buildRef,
  producingRevisionRef: build.revisionRef,
  dependencyRef: "npm:react",
  selector: "19.1.0",
};

const resolution = (overrides: Partial<ResolvedDependency> = {}): ResolvedDependency => ({
  resolutionRef: "dependency:resolved:react:19.1.0",
  declarationRef: declaration.declarationRef,
  resolvedRef: "npm:react@19.1.0",
  providerRef: "registry:npm-primary",
  providerLocalId: "pkg:react:19.1.0:a",
  mutableTag: null,
  ...overrides,
});

const material = (overrides: Partial<FetchedMaterial> = {}): FetchedMaterial => ({
  materialRef: "material:react:sha512-a",
  resolutionRef: resolution().resolutionRef,
  producingRevisionRef: build.revisionRef,
  provenanceRef: "provenance:registry-signature-a",
  contentDigest: "sha512:material-a",
  completeness: "KNOWN",
  currentness,
  ...overrides,
});

const executionContext = (overrides: Partial<BuildExecutionContext> = {}): BuildExecutionContext => ({
  executionContextRef: "execution:runner-a",
  runner: {
    runnerRef: "runner:linux-x64",
    runnerRevisionRef: "runner-image:2026-09-13",
    populationRef: "runner-population:linux-x64",
    locality: "QUALIFIED",
  },
  toolchain: {
    toolchainRef: "toolchain:node",
    toolchainRevisionRef: "node:24.8.0",
  },
  environment: {
    environmentRef: "environment:ci-linux-x64",
    environmentLabel: "linux-x64",
  },
  inputBoundary: {
    inputBoundaryRef: "inputs:build-a",
    qualifiedInputRefs: ["material:react:sha512-a", "source:git:revision-a"],
  },
  controlledImpurities: [],
  providerEvidence: {
    providerRef: "provider:github-actions",
    providerLocalRunnerId: "runner:123",
    support: "SUPPORTED",
    acknowledged: true,
    completeness: "KNOWN",
    currentness,
  },
  ...overrides,
});

const observation = (overrides: Partial<ReproducibilityObservation> = {}): ReproducibilityObservation => ({
  observationRef: "observation:build-a:1",
  buildRevisionRef: build.revisionRef,
  environmentRef: "environment:ci-linux-x64",
  populationRef: "runner-population:linux-x64",
  executionContextRef: "execution:runner-a",
  materialBoundaryRef: "boundary:materials-a",
  outputDigest: "sha256:artifact-a",
  outcome: "SUCCEEDED",
  evidence: {
    evidenceRef: "evidence:observation-a",
    completeness: "KNOWN",
    currentness: "CURRENT",
  },
  ...overrides,
});

const cacheLineage = (overrides: Partial<CacheLineage> = {}): CacheLineage => ({
  cacheEntryRef: "cache:entry-a",
  cacheEpochRef: "cache:epoch-7",
  producingRevisionRef: build.revisionRef,
  producingExecutionContextRef: "execution:runner-a",
  producingMaterialBoundaryRef: "boundary:materials-a",
  contentDigest: "sha256:cache-a",
  provenance: {
    evidenceRef: "evidence:cache-a",
    completeness: "KNOWN",
    currentness: "CURRENT",
  },
  ...overrides,
});

const residual = (
  kind: "RUNNER" | "CACHE",
  overrides: Partial<ResidualBuildCohort> = {},
): ResidualBuildCohort => ({
  cohortRef: `residual:${kind.toLowerCase()}:a`,
  kind,
  epochRef: "migration:epoch-9",
  populationRef: `${kind.toLowerCase()}-population:a`,
  residualCount: 0,
  evidence: {
    evidenceRef: `evidence:residual:${kind.toLowerCase()}:a`,
    completeness: "KNOWN",
    currentness: "CURRENT",
  },
  ...overrides,
});

test("TASK-538 preserves declared resolved fetched lineage across provider substitution", () => {
  const before = resolution();
  const substituted = resolution({
    providerRef: "registry:npm-mirror",
    providerLocalId: "mirror:react:19.1.0:77",
  });
  const fetched = material();

  assert.equal(materialPreservesBuildLineage(build, declaration, before, fetched), true);
  assert.equal(materialPreservesBuildLineage(build, declaration, substituted, fetched), true);
  assert.equal(fetchedMaterialIsAuthoritative(fetched, evaluatedAt), true);

  assert.equal(providerIdentityEstablishesCanonicalMaterialIdentity(before, fetched), false);
  assert.equal(providerIdentityEstablishesCanonicalMaterialIdentity(substituted, fetched), false);
  assert.equal(mutableTagEstablishesCanonicalMaterialIdentity(resolution({ mutableTag: "latest" }), fetched), false);
  assert.equal(declaredDependencyIsFetchedMaterial(declaration, fetched), false);

  assert.equal(materialPreservesBuildLineage(build, declaration, resolution({ resolutionRef: "dependency:resolved:collision" }), fetched), false);
  assert.equal(materialPreservesBuildLineage(build, declaration, before, material({ producingRevisionRef: "git:revision-b" })), false);
});

test("TASK-538 runner toolchain input and currentness qualification survives provider substitution", () => {
  const qualified = executionContext();
  const substituteProvider = executionContext({
    providerEvidence: {
      ...qualified.providerEvidence,
      providerRef: "provider:self-hosted",
      providerLocalRunnerId: "runner:other-local-id",
    },
  });

  assert.equal(buildExecutionContextIsQualified(qualified, evaluatedAt), true);
  assert.equal(buildExecutionContextIsQualified(substituteProvider, evaluatedAt), true);
  assert.equal(executionContextClaimsHermeticity(substituteProvider, evaluatedAt), true);
  assert.equal(providerAcknowledgementEstablishesQualifiedRunner(substituteProvider.providerEvidence), false);

  assert.equal(buildExecutionContextIsQualified(executionContext({
    providerEvidence: { ...qualified.providerEvidence, completeness: "PARTIAL" },
  }), evaluatedAt), false);
  assert.equal(buildExecutionContextIsQualified(executionContext({
    providerEvidence: { ...qualified.providerEvidence, completeness: "UNKNOWN" },
  }), evaluatedAt), false);
  assert.equal(buildExecutionContextIsQualified(executionContext({
    providerEvidence: { ...qualified.providerEvidence, currentness: { ...currentness, state: "STALE" } },
  }), evaluatedAt), false);
  assert.equal(buildExecutionContextIsQualified(executionContext({
    runner: { ...qualified.runner, locality: "UNKNOWN" },
  }), evaluatedAt), false);

  assert.equal(sameEnvironmentLabelEstablishesSameEffectiveInputs(
    qualified.environment,
    { environmentRef: "environment:different", environmentLabel: qualified.environment.environmentLabel },
  ), false);
});

test("TASK-538 build success and cache hit cannot masquerade as reproducibility evidence", () => {
  const left = observation();
  const right = observation({ observationRef: "observation:build-a:2" });
  assert.equal(successfulBuildsEstablishReproducibility(left, right), false);
  assert.equal(evaluateReproducibilityClaim({ claimRef: "claim:a", left, right }), "PASS");

  assert.equal(evaluateReproducibilityClaim({
    claimRef: "claim:different-environment",
    left,
    right: observation({ observationRef: "observation:build-a:3", environmentRef: "environment:other" }),
  }), "INCONCLUSIVE");
  assert.equal(evaluateReproducibilityClaim({
    claimRef: "claim:different-materials",
    left,
    right: observation({ observationRef: "observation:build-a:4", materialBoundaryRef: "boundary:materials-b" }),
  }), "INCONCLUSIVE");
  assert.equal(evaluateReproducibilityClaim({
    claimRef: "claim:partial",
    left,
    right: observation({
      observationRef: "observation:build-a:5",
      evidence: { evidenceRef: "evidence:partial", completeness: "PARTIAL", currentness: "CURRENT" },
    }),
  }), "INCONCLUSIVE");
  assert.equal(evaluateReproducibilityClaim({
    claimRef: "claim:unknown",
    left,
    right: observation({
      observationRef: "observation:build-a:6",
      evidence: { evidenceRef: null, completeness: "UNKNOWN", currentness: "UNKNOWN" },
    }),
  }), "INCONCLUSIVE");

  const cache = cacheLineage();
  assert.equal(cacheEntryIsCurrentAndProvenanced(cache), true);
  assert.equal(cacheHitEstablishesTrustedCurrentMaterial(cache), false);
  assert.equal(cacheEntryIsCurrentAndProvenanced(cacheLineage({
    provenance: { evidenceRef: "evidence:cache-stale", completeness: "KNOWN", currentness: "STALE" },
  })), false);
  assert.equal(cacheEntryIsCurrentAndProvenanced(cacheLineage({
    provenance: { evidenceRef: null, completeness: "UNKNOWN", currentness: "UNKNOWN" },
  })), false);
});

test("TASK-538 residual runner and cache populations require qualified drainage evidence", () => {
  const runner = residual("RUNNER");
  const cache = residual("CACHE");
  assert.equal(allResidualBuildCohortsAreDrained([runner, cache]), true);

  assert.equal(allResidualBuildCohortsAreDrained([
    runner,
    residual("CACHE", { residualCount: null }),
  ]), false);
  assert.equal(allResidualBuildCohortsAreDrained([
    runner,
    residual("CACHE", { populationRef: null }),
  ]), false);
  assert.equal(allResidualBuildCohortsAreDrained([
    runner,
    residual("CACHE", {
      evidence: { evidenceRef: "evidence:cache-partial", completeness: "PARTIAL", currentness: "CURRENT" },
    }),
  ]), false);
  assert.equal(allResidualBuildCohortsAreDrained([
    runner,
    residual("CACHE", {
      evidence: { evidenceRef: "evidence:cache-stale", completeness: "KNOWN", currentness: "STALE" },
    }),
  ]), false);
  assert.equal(allResidualBuildCohortsAreDrained([]), false);
});
