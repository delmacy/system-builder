export const BUILD_MATERIAL_IDENTITY_CONTRACT_VERSION = "1.0.0" as const;

export type BuildEvidenceCompleteness = "KNOWN" | "PARTIAL" | "UNKNOWN";
export type BuildCurrentnessState = "CURRENT" | "STALE" | "UNKNOWN";

export type BuildCurrentness = Readonly<{
  state: BuildCurrentnessState;
  assessedAt: string;
  validUntil: string;
}>;

export type BuildDefinition = Readonly<{
  buildRef: string;
  revisionRef: string;
}>;

export type DeclaredDependency = Readonly<{
  declarationRef: string;
  buildRef: string;
  producingRevisionRef: string;
  dependencyRef: string;
  selector: string;
}>;

export type ResolvedDependency = Readonly<{
  resolutionRef: string;
  declarationRef: string;
  resolvedRef: string;
  providerRef: string;
  providerLocalId: string;
  mutableTag: string | null;
}>;

export type FetchedMaterial = Readonly<{
  materialRef: string;
  resolutionRef: string;
  producingRevisionRef: string;
  provenanceRef: string | null;
  contentDigest: string;
  completeness: BuildEvidenceCompleteness;
  currentness: BuildCurrentness;
}>;

const nonEmpty = (value: string | null): value is string => typeof value === "string" && value.trim().length > 0;
const validTime = (value: string): boolean => Number.isFinite(Date.parse(value));

export function fetchedMaterialIsAuthoritative(
  material: FetchedMaterial,
  evaluatedAt: string,
): boolean {
  if (!nonEmpty(material.materialRef) || !nonEmpty(material.resolutionRef) || !nonEmpty(material.producingRevisionRef)) return false;
  if (!nonEmpty(material.provenanceRef) || !nonEmpty(material.contentDigest)) return false;
  if (material.completeness !== "KNOWN" || material.currentness.state !== "CURRENT") return false;
  if (!validTime(evaluatedAt) || !validTime(material.currentness.assessedAt) || !validTime(material.currentness.validUntil)) return false;
  const evaluated = Date.parse(evaluatedAt);
  return evaluated >= Date.parse(material.currentness.assessedAt) && evaluated <= Date.parse(material.currentness.validUntil);
}

export function materialPreservesBuildLineage(
  build: BuildDefinition,
  declaration: DeclaredDependency,
  resolution: ResolvedDependency,
  material: FetchedMaterial,
): boolean {
  return nonEmpty(build.buildRef)
    && nonEmpty(build.revisionRef)
    && declaration.buildRef === build.buildRef
    && declaration.producingRevisionRef === build.revisionRef
    && resolution.declarationRef === declaration.declarationRef
    && material.resolutionRef === resolution.resolutionRef
    && material.producingRevisionRef === build.revisionRef;
}

export function providerIdentityEstablishesCanonicalMaterialIdentity(
  resolution: ResolvedDependency,
  material: FetchedMaterial,
): false {
  void resolution;
  void material;
  return false;
}

export function mutableTagEstablishesCanonicalMaterialIdentity(
  resolution: ResolvedDependency,
  material: FetchedMaterial,
): false {
  void resolution;
  void material;
  return false;
}

export function declaredDependencyIsFetchedMaterial(
  declaration: DeclaredDependency,
  material: FetchedMaterial,
): false {
  void declaration;
  void material;
  return false;
}
