import { MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, normalizeAnalyticalDefinitionRevision, type AnalyticalDefinitionRevision } from "./index.js";
import { normalizeAnalyticalEvaluationOutcome, type AnalyticalEvaluationOutcome } from "./evaluation.js";
import { assertAnalyticalTransformDoesNotStrengthen, normalizeAnalyticalValueQualification, type AnalyticalValueQualification } from "./uncertainty.js";

export type AnalyticalTransformRevision = Readonly<{
  contractVersion: typeof MATHEMATICAL_SEMANTICS_CONTRACT_VERSION;
  transformRef: string;
  transformRevision: AnalyticalDefinitionRevision;
  transformOwner: string;
  kind: "DERIVATION" | "TRANSFORM";
}>;

export type AnalyticalDerivationParent = Readonly<{
  parentRef: string;
  outcome: AnalyticalEvaluationOutcome;
}>;

export type AnalyticalDerivationLineage = Readonly<{
  contractVersion: typeof MATHEMATICAL_SEMANTICS_CONTRACT_VERSION;
  derivationRef: string;
  transform: AnalyticalTransformRevision;
  sourceParentRef: string;
  parents: readonly AnalyticalDerivationParent[];
  output: AnalyticalValueQualification;
}>;

type UnknownRecord = Record<string, unknown>;

function record(value: unknown, label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value as UnknownRecord;
}

function exact(value: UnknownRecord, fields: readonly string[], label: string): void {
  for (const key of Object.keys(value)) if (!fields.includes(key)) throw new Error(`${label} has unexpected field ${key}`);
  for (const key of fields) if (!(key in value)) throw new Error(`${label} is missing field ${key}`);
}

function text(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${field} must be a non-empty string`);
  return value.trim();
}

function historicalText(value: unknown, field: string): string {
  const normalized = text(value, field);
  if (normalized.toLowerCase() === "latest") throw new Error(`${field} must pin an exact historical revision`);
  return normalized;
}

function stable(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  const r = value as UnknownRecord;
  return `{${Object.keys(r).sort().map((key) => `${JSON.stringify(key)}:${stable(r[key])}`).join(",")}}`;
}

function normalizeTransform(input: unknown): AnalyticalTransformRevision {
  const r = record(input, "analytical transform revision");
  exact(r, ["contractVersion", "transformRef", "transformRevision", "transformOwner", "kind"], "analytical transform revision");
  if (r.contractVersion !== MATHEMATICAL_SEMANTICS_CONTRACT_VERSION) throw new Error("unsupported mathematical semantics contract version");
  if (r.kind !== "DERIVATION" && r.kind !== "TRANSFORM") throw new Error("analytical transform kind must be DERIVATION or TRANSFORM");
  const transformRevision = normalizeAnalyticalDefinitionRevision(r.transformRevision);
  historicalText(transformRevision.ref.revisionRef, "transform revisionRef");
  const transformOwner = text(r.transformOwner, "transformOwner");
  if (transformRevision.ref.revisionOwner !== transformOwner) throw new Error("transform owner must preserve the owner of the pinned transform revision");
  return Object.freeze({
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    transformRef: text(r.transformRef, "transformRef"),
    transformRevision,
    transformOwner,
    kind: r.kind,
  });
}

function normalizeExpectedOutcome(expected: AnalyticalEvaluationOutcome): AnalyticalEvaluationOutcome {
  return normalizeAnalyticalEvaluationOutcome(
    expected,
    expected.evaluation,
    expected.kind,
    expected.kind === "RESOLVED" ? expected.value : undefined,
  );
}

function normalizeParent(input: unknown, expected: AnalyticalDerivationParent): AnalyticalDerivationParent {
  const r = record(input, `derivation parent ${expected.parentRef}`);
  exact(r, ["parentRef", "outcome"], `derivation parent ${expected.parentRef}`);
  const parentRef = text(r.parentRef, "parentRef");
  if (parentRef !== expected.parentRef) throw new Error("derivation parent reference cannot be substituted");
  const expectedOutcome = normalizeExpectedOutcome(expected.outcome);
  const outcome = normalizeAnalyticalEvaluationOutcome(
    r.outcome,
    expectedOutcome.evaluation,
    expectedOutcome.kind,
    expectedOutcome.kind === "RESOLVED" ? expectedOutcome.value : undefined,
  );
  if (stable(outcome) !== stable(expectedOutcome)) throw new Error(`derivation parent ${parentRef} must preserve exact historical outcome lineage`);
  return Object.freeze({ parentRef, outcome: expectedOutcome });
}

export function normalizeAnalyticalDerivationLineage(
  input: unknown,
  expectedTransform: AnalyticalTransformRevision,
  expectedParents: readonly AnalyticalDerivationParent[],
  expectedOutput: AnalyticalValueQualification,
): AnalyticalDerivationLineage {
  const r = record(input, "analytical derivation lineage");
  exact(r, ["contractVersion", "derivationRef", "transform", "sourceParentRef", "parents", "output"], "analytical derivation lineage");
  if (r.contractVersion !== MATHEMATICAL_SEMANTICS_CONTRACT_VERSION) throw new Error("unsupported mathematical semantics contract version");

  const transform = normalizeTransform(r.transform);
  const expectedPinnedTransform = normalizeTransform(expectedTransform);
  if (stable(transform) !== stable(expectedPinnedTransform)) throw new Error("derivation must preserve the exact historical transform revision and owner");

  if (!Array.isArray(r.parents) || r.parents.length === 0) throw new Error("derivation must preserve at least one explicit parent");
  if (r.parents.length !== expectedParents.length) throw new Error("derivation cannot drop or add parent lineage");

  const expectedByRef = new Map<string, AnalyticalDerivationParent>();
  for (const parent of expectedParents) {
    const parentRef = text(parent.parentRef, "expected parentRef");
    if (expectedByRef.has(parentRef)) throw new Error(`expected derivation parent ${parentRef} is duplicated or ambiguous`);
    expectedByRef.set(parentRef, Object.freeze({ parentRef, outcome: normalizeExpectedOutcome(parent.outcome) }));
  }

  const seen = new Set<string>();
  const parents = r.parents.map((raw, index) => {
    const parentRecord = record(raw, `derivation parent ${index}`);
    const parentRef = text(parentRecord.parentRef, `derivation parent ${index} parentRef`);
    if (seen.has(parentRef)) throw new Error(`derivation parent ${parentRef} is duplicated or ambiguous`);
    seen.add(parentRef);
    const expected = expectedByRef.get(parentRef);
    if (!expected) throw new Error(`derivation parent ${parentRef} is not explicitly declared`);
    return normalizeParent(raw, expected);
  });
  for (const parentRef of expectedByRef.keys()) if (!seen.has(parentRef)) throw new Error(`derivation parent ${parentRef} lineage was dropped`);
  parents.sort((left, right) => left.parentRef.localeCompare(right.parentRef));

  const sourceParentRef = text(r.sourceParentRef, "sourceParentRef");
  const sourceParent = expectedByRef.get(sourceParentRef);
  if (!sourceParent) throw new Error("source parent must be one of the explicitly pinned derivation parents");
  if (sourceParent.outcome.kind !== "RESOLVED") throw new Error("source parent must have a resolved qualified value; unresolved lineage cannot invent source authority");

  const output = normalizeAnalyticalValueQualification(r.output, expectedOutput.vector);
  const expectedQualifiedOutput = normalizeAnalyticalValueQualification(expectedOutput, expectedOutput.vector);
  if (stable(output) !== stable(expectedQualifiedOutput)) throw new Error("derived output must preserve the explicitly expected source/currentness/locality qualification and revisions");

  const sourceValue = sourceParent.outcome.value;
  if (stable(output.vector.qualifiedValue.sourceRevision) !== stable(sourceValue.vector.qualifiedValue.sourceRevision)) {
    throw new Error("analytical mechanics cannot replace the source-domain owner or historical source revision");
  }
  if (stable(output.vector.locality) !== stable(sourceValue.vector.locality)) {
    throw new Error("analytical mechanics cannot strengthen or substitute source locality");
  }
  if (output.qualificationOwner !== sourceValue.qualificationOwner) {
    throw new Error("analytical mechanics cannot reassign source qualification ownership");
  }
  if (stable(output.vector.qualifiedValue.producingAnalyticalRevision) !== stable(transform.transformRevision.ref)) {
    throw new Error("derived output must pin the exact producing analytical transform revision");
  }

  const resolvedInputs = parents.flatMap((parent) => parent.outcome.kind === "RESOLVED" ? [parent.outcome.value] : []);
  const hasUnresolvedParent = parents.some((parent) => parent.outcome.kind !== "RESOLVED");
  if (hasUnresolvedParent) {
    if (output.epistemicState !== "UNKNOWN" || output.uncertainty.state !== "UNRESOLVED") {
      throw new Error("UNRESOLVED or ERROR parent must remain UNKNOWN with unresolved uncertainty; analytical mechanics cannot promote disposition");
    }
  }
  if (resolvedInputs.length > 0) assertAnalyticalTransformDoesNotStrengthen(resolvedInputs, output);

  return Object.freeze({
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    derivationRef: text(r.derivationRef, "derivationRef"),
    transform: expectedPinnedTransform,
    sourceParentRef,
    parents: Object.freeze(parents),
    output: expectedQualifiedOutput,
  });
}
