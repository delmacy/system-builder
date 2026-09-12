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

const evaluatedAt = "2026-09-12T12:00:00Z";
const currentness = { state: "CURRENT" as const, assessedAt: "2026-09-12T00:00:00Z", validUntil: "2026-09-13T00:00:00Z" };
const build: BuildDefinition = { buildRef: "build:app", revisionRef: "revision:7" };
const declaration: DeclaredDependency = { declarationRef: "decl:1", buildRef: build.buildRef, producingRevisionRef: build.revisionRef, dependencyRef: "dep:ui", selector: "^4" };
const resolution: ResolvedDependency = { resolutionRef: "resolution:1", declarationRef: declaration.declarationRef, resolvedRef: "package:ui@4.2.1", providerRef: "registry:a", providerLocalId: "provider-object:99", mutableTag: "latest" };
const material = (overrides: Partial<FetchedMaterial> = {}): FetchedMaterial => ({
  materialRef: "material:sha256:abc",
  resolutionRef: resolution.resolutionRef,
  producingRevisionRef: build.revisionRef,
  provenanceRef: "provenance:attestation:1",
  contentDigest: "sha256:abc",
  completeness: "KNOWN",
  currentness,
  ...overrides,
});

test("TASK-535 declaration resolution and fetched material remain distinct historical facts", () => {
  assert.equal(declaredDependencyIsFetchedMaterial(declaration, material()), false);
  assert.equal(materialPreservesBuildLineage(build, declaration, resolution, material()), true);
  assert.equal(materialPreservesBuildLineage(build, declaration, resolution, material({ producingRevisionRef: "revision:8" })), false);
});

test("TASK-535 provider identifiers and mutable tags never establish canonical material identity", () => {
  assert.equal(providerIdentityEstablishesCanonicalMaterialIdentity(resolution, material()), false);
  assert.equal(mutableTagEstablishesCanonicalMaterialIdentity(resolution, material()), false);
  const churnedProvider = { ...resolution, providerLocalId: "provider-object:100", providerRef: "registry:b" };
  assert.equal(materialPreservesBuildLineage(build, declaration, churnedProvider, material()), true);
});

test("TASK-535 only known current provenance can strengthen fetched-material authority", () => {
  assert.equal(fetchedMaterialIsAuthoritative(material(), evaluatedAt), true);
  assert.equal(fetchedMaterialIsAuthoritative(material({ provenanceRef: null }), evaluatedAt), false);
  assert.equal(fetchedMaterialIsAuthoritative(material({ completeness: "PARTIAL" }), evaluatedAt), false);
  assert.equal(fetchedMaterialIsAuthoritative(material({ completeness: "UNKNOWN" }), evaluatedAt), false);
  assert.equal(fetchedMaterialIsAuthoritative(material({ currentness: { ...currentness, state: "STALE" } }), evaluatedAt), false);
  assert.equal(fetchedMaterialIsAuthoritative(material({ currentness: { ...currentness, state: "UNKNOWN" } }), evaluatedAt), false);
  assert.equal(fetchedMaterialIsAuthoritative(material(), "2026-09-14T00:00:00Z"), false);
});

test("TASK-535 latest revision cannot reinterpret historical material lineage", () => {
  const latestBuild: BuildDefinition = { ...build, revisionRef: "revision:8" };
  assert.equal(materialPreservesBuildLineage(latestBuild, declaration, resolution, material()), false);
});
