export const BUILD_EXECUTION_CONTEXT_CONTRACT_VERSION = "1.0.0" as const;

export type BuildQualificationCompleteness = "KNOWN" | "PARTIAL" | "UNKNOWN";
export type BuildQualificationCurrentnessState = "CURRENT" | "STALE" | "UNKNOWN";
export type ProviderEvidenceState = "SUPPORTED" | "UNSUPPORTED" | "UNKNOWN";
export type LocalityState = "QUALIFIED" | "UNQUALIFIED" | "UNKNOWN";

export type QualificationCurrentness = Readonly<{
  state: BuildQualificationCurrentnessState;
  assessedAt: string;
  validUntil: string;
}>;

export type BuildRunner = Readonly<{
  runnerRef: string;
  runnerRevisionRef: string;
  populationRef: string;
  locality: LocalityState;
}>;

export type BuildToolchain = Readonly<{
  toolchainRef: string;
  toolchainRevisionRef: string;
}>;

export type BuildEnvironment = Readonly<{
  environmentRef: string;
  environmentLabel: string;
}>;

export type BuildInputBoundary = Readonly<{
  inputBoundaryRef: string;
  qualifiedInputRefs: readonly string[];
}>;

export type ControlledImpurity = Readonly<{
  impurityRef: string;
  scopeRef: string;
  evidenceRef: string | null;
  declared: boolean;
  completeness: BuildQualificationCompleteness;
  currentness: QualificationCurrentness;
}>;

export type ProviderRunnerEvidence = Readonly<{
  providerRef: string;
  providerLocalRunnerId: string;
  support: ProviderEvidenceState;
  acknowledged: boolean;
  completeness: BuildQualificationCompleteness;
  currentness: QualificationCurrentness;
}>;

export type BuildExecutionContext = Readonly<{
  executionContextRef: string;
  runner: BuildRunner;
  toolchain: BuildToolchain;
  environment: BuildEnvironment;
  inputBoundary: BuildInputBoundary;
  controlledImpurities: readonly ControlledImpurity[];
  providerEvidence: ProviderRunnerEvidence;
}>;

const nonEmpty = (value: string | null): value is string => typeof value === "string" && value.trim().length > 0;
const validTime = (value: string): boolean => Number.isFinite(Date.parse(value));

function currentnessIsValid(currentness: QualificationCurrentness, evaluatedAt: string): boolean {
  if (currentness.state !== "CURRENT") return false;
  if (!validTime(evaluatedAt) || !validTime(currentness.assessedAt) || !validTime(currentness.validUntil)) return false;
  const evaluated = Date.parse(evaluatedAt);
  return evaluated >= Date.parse(currentness.assessedAt) && evaluated <= Date.parse(currentness.validUntil);
}

export function controlledImpurityIsQualified(impurity: ControlledImpurity, evaluatedAt: string): boolean {
  return impurity.declared
    && nonEmpty(impurity.impurityRef)
    && nonEmpty(impurity.scopeRef)
    && nonEmpty(impurity.evidenceRef)
    && impurity.completeness === "KNOWN"
    && currentnessIsValid(impurity.currentness, evaluatedAt);
}

export function buildExecutionContextIsQualified(context: BuildExecutionContext, evaluatedAt: string): boolean {
  if (!nonEmpty(context.executionContextRef)) return false;
  if (!nonEmpty(context.runner.runnerRef) || !nonEmpty(context.runner.runnerRevisionRef) || !nonEmpty(context.runner.populationRef)) return false;
  if (context.runner.locality !== "QUALIFIED") return false;
  if (!nonEmpty(context.toolchain.toolchainRef) || !nonEmpty(context.toolchain.toolchainRevisionRef)) return false;
  if (!nonEmpty(context.environment.environmentRef) || !nonEmpty(context.inputBoundary.inputBoundaryRef)) return false;
  if (context.inputBoundary.qualifiedInputRefs.some((ref) => !nonEmpty(ref))) return false;
  if (context.controlledImpurities.some((impurity) => !controlledImpurityIsQualified(impurity, evaluatedAt))) return false;
  if (context.providerEvidence.completeness !== "KNOWN") return false;
  if (context.providerEvidence.support !== "SUPPORTED") return false;
  return currentnessIsValid(context.providerEvidence.currentness, evaluatedAt);
}

export function providerAcknowledgementEstablishesQualifiedRunner(evidence: ProviderRunnerEvidence): false {
  void evidence;
  return false;
}

export function sameEnvironmentLabelEstablishesSameEffectiveInputs(
  left: BuildEnvironment,
  right: BuildEnvironment,
): false {
  void left;
  void right;
  return false;
}

export function executionContextClaimsHermeticity(context: BuildExecutionContext, evaluatedAt: string): boolean {
  return context.controlledImpurities.length === 0 && buildExecutionContextIsQualified(context, evaluatedAt);
}
