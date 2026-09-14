export const GENERATED_EXPERIENCE_CONTRACT_VERSION = "1.0.0" as const;

export type GeneratedExperienceEvidenceCompleteness = "KNOWN" | "PARTIAL" | "UNKNOWN" | "INCONCLUSIVE";
export type GeneratedExperienceCurrentnessState = "CURRENT" | "STALE" | "UNKNOWN";
export type GeneratedExperienceProjectionQualification = "CURRENT" | "PARTIAL" | "STALE" | "RECONCILE_BEFORE_RETRY" | "INVALID";
export type GeneratedExperienceLocalityScope = "LOCAL" | "STATION" | "FLEET";
export type GeneratedExperienceVisibility = "VISIBLE" | "HIDDEN";
export type GeneratedExperienceAuthorityDecision = "GRANTED" | "DENIED" | "CONFLICTED" | "UNKNOWN" | "INCONCLUSIVE";
export type GeneratedExperienceDomainEligibility = "ELIGIBLE" | "INELIGIBLE" | "UNKNOWN" | "INCONCLUSIVE";
export type GeneratedExperienceActionQualification = "ELIGIBLE" | "INELIGIBLE" | "RECONCILE_BEFORE_RETRY" | "INVALID";

export type GeneratedExperienceCurrentness = Readonly<{
  state: GeneratedExperienceCurrentnessState;
  assessedAt: string;
  validUntil: string;
}>;

export type GeneratedExperienceLocality = Readonly<{
  scope: GeneratedExperienceLocalityScope;
  scopeRef: string;
}>;

export type GeneratedExperienceSourceEvidence = Readonly<{
  sourceRef: string;
  sourceRevisionRef: string;
  sourceAuthorityRef: string;
  currentness: GeneratedExperienceCurrentness;
  completeness: GeneratedExperienceEvidenceCompleteness;
  locality: GeneratedExperienceLocality | null;
}>;

export type GeneratedExperienceProjectionLineage = Readonly<{
  rootProjectionRef: string;
  predecessorProjectionRevisionRef: string | null;
}>;

export type GeneratedExperienceProjection = Readonly<{
  projectionRef: string;
  projectionRevisionRef: string;
  generatedAt: string;
  source: GeneratedExperienceSourceEvidence;
  currentness: GeneratedExperienceCurrentness;
  completeness: GeneratedExperienceEvidenceCompleteness;
  locality: GeneratedExperienceLocality | null;
  lineage: GeneratedExperienceProjectionLineage;
}>;

export type GeneratedExperienceAuthorityEvidence = Readonly<{
  authorityRef: string;
  authorityRevisionRef: string;
  decision: GeneratedExperienceAuthorityDecision;
  currentness: GeneratedExperienceCurrentness;
}>;

export type GeneratedExperienceDomainActionEvidence = Readonly<{
  actionContractRef: string;
  actionContractRevisionRef: string;
  effectRef: string;
  eligibility: GeneratedExperienceDomainEligibility;
  currentness: GeneratedExperienceCurrentness;
}>;

export type GeneratedExperienceActionSurface = Readonly<{
  projection: GeneratedExperienceProjection;
  actionSurfaceRef: string;
  visibility: GeneratedExperienceVisibility;
  authority: GeneratedExperienceAuthorityEvidence;
  domainAction: GeneratedExperienceDomainActionEvidence;
  presentedCompleteness: GeneratedExperienceEvidenceCompleteness;
}>;

const nonEmpty = (value: string): boolean => value.trim().length > 0;
const validTime = (value: string): boolean => Number.isFinite(Date.parse(value));

function currentAt(currentness: GeneratedExperienceCurrentness, evaluatedAt: string): boolean {
  if (currentness.state !== "CURRENT" || !validTime(evaluatedAt) || !validTime(currentness.assessedAt) || !validTime(currentness.validUntil)) return false;
  const at = Date.parse(evaluatedAt);
  return at >= Date.parse(currentness.assessedAt) && at <= Date.parse(currentness.validUntil);
}

function sameLocality(left: GeneratedExperienceLocality | null, right: GeneratedExperienceLocality | null): boolean {
  if (left === null || right === null) return left === right;
  return left.scope === right.scope && left.scopeRef === right.scopeRef && nonEmpty(left.scopeRef);
}

function completenessDoesNotStrengthen(
  source: GeneratedExperienceEvidenceCompleteness,
  presented: GeneratedExperienceEvidenceCompleteness,
): boolean {
  switch (source) {
    case "KNOWN":
      return true;
    case "PARTIAL":
      return presented !== "KNOWN";
    case "UNKNOWN":
      return presented === "UNKNOWN";
    case "INCONCLUSIVE":
      return presented === "INCONCLUSIVE" || presented === "UNKNOWN";
  }
}

export function generatedExperienceProjectionIdentityIsDistinct(projection: GeneratedExperienceProjection): boolean {
  return nonEmpty(projection.projectionRef)
    && nonEmpty(projection.projectionRevisionRef)
    && nonEmpty(projection.source.sourceRef)
    && nonEmpty(projection.source.sourceRevisionRef)
    && nonEmpty(projection.source.sourceAuthorityRef)
    && projection.projectionRef !== projection.source.sourceRef;
}

export function generatedExperienceProjectionPreservesLocality(projection: GeneratedExperienceProjection): boolean {
  return sameLocality(projection.source.locality, projection.locality);
}

export function generatedExperienceProjectionDoesNotStrengthenSource(projection: GeneratedExperienceProjection): boolean {
  return completenessDoesNotStrengthen(projection.source.completeness, projection.completeness);
}

export function evaluateGeneratedExperienceProjection(
  projection: GeneratedExperienceProjection,
  evaluatedAt: string,
): GeneratedExperienceProjectionQualification {
  if (
    !generatedExperienceProjectionIdentityIsDistinct(projection)
    || !nonEmpty(projection.lineage.rootProjectionRef)
    || projection.lineage.rootProjectionRef !== projection.projectionRef
    || !validTime(projection.generatedAt)
    || !generatedExperienceProjectionPreservesLocality(projection)
    || !generatedExperienceProjectionDoesNotStrengthenSource(projection)
  ) return "INVALID";

  if (
    projection.source.completeness === "UNKNOWN"
    || projection.source.completeness === "INCONCLUSIVE"
    || projection.completeness === "UNKNOWN"
    || projection.completeness === "INCONCLUSIVE"
    || projection.source.currentness.state === "UNKNOWN"
    || projection.currentness.state === "UNKNOWN"
  ) return "RECONCILE_BEFORE_RETRY";

  if (!currentAt(projection.source.currentness, evaluatedAt) || !currentAt(projection.currentness, evaluatedAt)) return "STALE";

  if (projection.source.completeness === "PARTIAL" || projection.completeness === "PARTIAL") return "PARTIAL";

  return "CURRENT";
}

export function generatedExperienceProjectionIdentityCollides(
  left: GeneratedExperienceProjection,
  right: GeneratedExperienceProjection,
): boolean {
  if (left.projectionRef !== right.projectionRef) return false;
  return left.lineage.rootProjectionRef !== right.lineage.rootProjectionRef
    || left.source.sourceRef !== right.source.sourceRef;
}

export function generatedExperienceRegenerationPreservesLineage(
  previous: GeneratedExperienceProjection,
  next: GeneratedExperienceProjection,
): boolean {
  if (!validTime(previous.generatedAt) || !validTime(next.generatedAt)) return false;
  return previous.projectionRef === next.projectionRef
    && previous.lineage.rootProjectionRef === next.lineage.rootProjectionRef
    && previous.source.sourceRef === next.source.sourceRef
    && previous.projectionRevisionRef !== next.projectionRevisionRef
    && next.lineage.predecessorProjectionRevisionRef === previous.projectionRevisionRef
    && Date.parse(next.generatedAt) >= Date.parse(previous.generatedAt)
    && generatedExperienceProjectionPreservesLocality(previous)
    && generatedExperienceProjectionPreservesLocality(next);
}

export function generatedExperienceProjectionEstablishesCanonicalTruth(projection: GeneratedExperienceProjection): false {
  void projection;
  return false;
}

export function generatedExperienceActionSurfaceDoesNotEstablishAuthority(surface: GeneratedExperienceActionSurface): true {
  void surface;
  return true;
}

export function generatedExperienceActionSurfaceDoesNotStrengthenStatus(surface: GeneratedExperienceActionSurface): boolean {
  return generatedExperienceProjectionDoesNotStrengthenSource(surface.projection)
    && completenessDoesNotStrengthen(surface.projection.completeness, surface.presentedCompleteness);
}

export function evaluateGeneratedExperienceActionSurface(
  surface: GeneratedExperienceActionSurface,
  evaluatedAt: string,
): GeneratedExperienceActionQualification {
  if (
    !nonEmpty(surface.actionSurfaceRef)
    || !nonEmpty(surface.authority.authorityRef)
    || !nonEmpty(surface.authority.authorityRevisionRef)
    || !nonEmpty(surface.domainAction.actionContractRef)
    || !nonEmpty(surface.domainAction.actionContractRevisionRef)
    || !nonEmpty(surface.domainAction.effectRef)
    || !generatedExperienceActionSurfaceDoesNotStrengthenStatus(surface)
  ) return "INVALID";

  const projectionQualification = evaluateGeneratedExperienceProjection(surface.projection, evaluatedAt);
  if (projectionQualification === "INVALID") return "INVALID";
  if (projectionQualification === "STALE" || projectionQualification === "RECONCILE_BEFORE_RETRY") return "RECONCILE_BEFORE_RETRY";

  if (
    surface.authority.decision === "CONFLICTED"
    || surface.authority.decision === "UNKNOWN"
    || surface.authority.decision === "INCONCLUSIVE"
    || surface.domainAction.eligibility === "UNKNOWN"
    || surface.domainAction.eligibility === "INCONCLUSIVE"
  ) return "RECONCILE_BEFORE_RETRY";

  if (!currentAt(surface.authority.currentness, evaluatedAt) || !currentAt(surface.domainAction.currentness, evaluatedAt)) {
    return "RECONCILE_BEFORE_RETRY";
  }

  if (surface.authority.decision === "DENIED" || surface.domainAction.eligibility === "INELIGIBLE") return "INELIGIBLE";

  return "ELIGIBLE";
}

export type GeneratedExperienceTruthState = "KNOWN" | "PARTIAL" | "UNKNOWN" | "INCONCLUSIVE" | "CONFLICTED";
export type GeneratedExperienceEvidencePolarity = "AFFIRMS" | "NEGATES" | "CONTRADICTS" | "UNRESOLVED";

export type GeneratedExperienceArtifactEvidenceRef = Readonly<{
  evidenceRef: string;
  evidenceRevisionRef: string;
  sourceRef: string;
  sourceRevisionRef: string;
  polarity: GeneratedExperienceEvidencePolarity;
}>;

export type GeneratedExperienceArtifact = Readonly<{
  artifactRef: string;
  artifactRevisionRef: string;
  generatedAt: string;
  projectionRef: string;
  projectionRevisionRef: string;
  sourceRef: string;
  sourceRevisionRef: string;
  state: GeneratedExperienceTruthState;
  currentness: GeneratedExperienceCurrentness;
  evidence: readonly GeneratedExperienceArtifactEvidenceRef[];
  predecessorArtifactRevisionRef: string | null;
}>;

export function generatedExperienceArtifactPreservesUnresolvedTruth(artifact: GeneratedExperienceArtifact): boolean {
  const polarities = new Set(artifact.evidence.map((item) => item.polarity));
  const hasConflict = polarities.has("CONTRADICTS") || (polarities.has("AFFIRMS") && polarities.has("NEGATES"));
  const hasUnresolved = polarities.has("UNRESOLVED");
  if (hasConflict && artifact.state !== "CONFLICTED") return false;
  if (hasUnresolved && artifact.state === "KNOWN") return false;
  return true;
}

export function generatedExperienceArtifactLineageIsComplete(artifact: GeneratedExperienceArtifact): boolean {
  if (
    !nonEmpty(artifact.artifactRef)
    || !nonEmpty(artifact.artifactRevisionRef)
    || !nonEmpty(artifact.projectionRef)
    || !nonEmpty(artifact.projectionRevisionRef)
    || !nonEmpty(artifact.sourceRef)
    || !nonEmpty(artifact.sourceRevisionRef)
    || !validTime(artifact.generatedAt)
    || artifact.evidence.length === 0
  ) return false;

  return artifact.evidence.every((item) => nonEmpty(item.evidenceRef)
    && nonEmpty(item.evidenceRevisionRef)
    && nonEmpty(item.sourceRef)
    && nonEmpty(item.sourceRevisionRef));
}

export function generatedExperienceArtifactIsBounded(artifact: GeneratedExperienceArtifact): boolean {
  return generatedExperienceArtifactLineageIsComplete(artifact)
    && generatedExperienceArtifactPreservesUnresolvedTruth(artifact);
}

export function generatedExperienceArtifactRegenerationPreservesHistory(
  previous: GeneratedExperienceArtifact,
  next: GeneratedExperienceArtifact,
): boolean {
  return generatedExperienceArtifactIsBounded(previous)
    && generatedExperienceArtifactIsBounded(next)
    && previous.artifactRef === next.artifactRef
    && previous.artifactRevisionRef !== next.artifactRevisionRef
    && next.predecessorArtifactRevisionRef === previous.artifactRevisionRef
    && previous.projectionRef === next.projectionRef
    && previous.sourceRef === next.sourceRef
    && Date.parse(next.generatedAt) >= Date.parse(previous.generatedAt);
}

export function generatedExperienceArtifactAcceptanceEstablishesCanonicalTruth(
  artifact: GeneratedExperienceArtifact,
): false {
  void artifact;
  return false;
}
