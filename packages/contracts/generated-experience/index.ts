export const GENERATED_EXPERIENCE_CONTRACT_VERSION = "1.0.0" as const;

export type GeneratedExperienceEvidenceCompleteness = "KNOWN" | "PARTIAL" | "UNKNOWN" | "INCONCLUSIVE";
export type GeneratedExperienceCurrentnessState = "CURRENT" | "STALE" | "UNKNOWN";
export type GeneratedExperienceProjectionQualification = "CURRENT" | "PARTIAL" | "STALE" | "RECONCILE_BEFORE_RETRY" | "INVALID";
export type GeneratedExperienceLocalityScope = "LOCAL" | "STATION" | "FLEET";

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
  switch (projection.source.completeness) {
    case "KNOWN":
      return true;
    case "PARTIAL":
      return projection.completeness !== "KNOWN";
    case "UNKNOWN":
      return projection.completeness === "UNKNOWN";
    case "INCONCLUSIVE":
      return projection.completeness === "INCONCLUSIVE" || projection.completeness === "UNKNOWN";
  }
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
