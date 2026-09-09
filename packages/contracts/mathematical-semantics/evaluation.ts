import {
  MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
  normalizeAnalyticalDefinitionRevision,
  type AnalyticalDefinitionRevision,
} from "./index.js";
import {
  assertAnalyticalTransformDoesNotStrengthen,
  normalizeAnalyticalValueQualification,
  type AnalyticalEvidenceReference,
  type AnalyticalValueQualification,
} from "./uncertainty.js";

export type EvaluationInputBinding = Readonly<{
  inputRef: string;
  qualification: AnalyticalValueQualification;
}>;

export type AnalyticalEvaluationEnvelope = Readonly<{
  contractVersion: typeof MATHEMATICAL_SEMANTICS_CONTRACT_VERSION;
  evaluationRef: string;
  definition: AnalyticalDefinitionRevision;
  inputs: readonly EvaluationInputBinding[];
}>;

export type AnalyticalEvaluationOutcome =
  | Readonly<{ kind: "RESOLVED"; evaluation: AnalyticalEvaluationEnvelope; value: AnalyticalValueQualification }>
  | Readonly<{ kind: "UNRESOLVED"; evaluation: AnalyticalEvaluationEnvelope; reason: string; evidence: readonly AnalyticalEvidenceReference[] }>
  | Readonly<{ kind: "ERROR"; evaluation: AnalyticalEvaluationEnvelope; errorCode: string; reason: string; evidence: readonly AnalyticalEvidenceReference[] }>;

export type AnalyticalEvaluationOutcomeKind = AnalyticalEvaluationOutcome["kind"];

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown, label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value as UnknownRecord;
}

function exact(record: UnknownRecord, fields: readonly string[], label: string): void {
  for (const key of Object.keys(record)) if (!fields.includes(key)) throw new Error(`${label} has unexpected field ${key}`);
  for (const key of fields) if (!(key in record)) throw new Error(`${label} is missing field ${key}`);
}

function nonEmpty(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${field} must be a non-empty string`);
  return value.trim();
}

function stable(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  const record = value as UnknownRecord;
  const keys = Object.keys(record).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stable(record[key])}`).join(",")}}`;
}

function definitionKey(value: AnalyticalDefinitionRevision): string {
  return stable(value);
}

function normalizeOutcomeEvidence(value: unknown): readonly AnalyticalEvidenceReference[] {
  if (!Array.isArray(value)) throw new Error("evaluation outcome evidence must be an array");
  const normalized = value.map((item, index) => {
    const record = asRecord(item, `evaluation outcome evidence ${index}`);
    exact(record, ["evidenceRef", "evidenceRevision", "evidenceOwner"], `evaluation outcome evidence ${index}`);
    return Object.freeze({
      evidenceRef: nonEmpty(record.evidenceRef, "evidenceRef"),
      evidenceRevision: nonEmpty(record.evidenceRevision, "evidenceRevision"),
      evidenceOwner: nonEmpty(record.evidenceOwner, "evidenceOwner"),
    });
  });
  normalized.sort((left, right) => stable(left).localeCompare(stable(right)));
  return Object.freeze(normalized);
}

export function normalizeAnalyticalEvaluationEnvelope(
  input: unknown,
  expectedDefinition: AnalyticalDefinitionRevision,
  expectedInputs: readonly EvaluationInputBinding[],
): AnalyticalEvaluationEnvelope {
  const record = asRecord(input, "analytical evaluation envelope");
  exact(record, ["contractVersion", "evaluationRef", "definition", "inputs"], "analytical evaluation envelope");
  if (record.contractVersion !== MATHEMATICAL_SEMANTICS_CONTRACT_VERSION) {
    throw new Error("unsupported mathematical semantics contract version");
  }

  const definition = normalizeAnalyticalDefinitionRevision(record.definition);
  const expected = normalizeAnalyticalDefinitionRevision(expectedDefinition);
  if (definitionKey(definition) !== definitionKey(expected)) {
    throw new Error("evaluation definition must preserve the exact explicitly requested historical revision");
  }

  if (!Array.isArray(record.inputs)) throw new Error("evaluation inputs must be an array");
  if (record.inputs.length !== expectedInputs.length) {
    throw new Error("evaluation inputs must be explicit; missing inputs cannot be defaulted");
  }

  const expectedByRef = new Map<string, AnalyticalValueQualification>();
  for (const expectedInput of expectedInputs) {
    const inputRef = nonEmpty(expectedInput.inputRef, "expected inputRef");
    if (expectedByRef.has(inputRef)) throw new Error(`expected evaluation input ${inputRef} is duplicated`);
    const qualification = normalizeAnalyticalValueQualification(expectedInput.qualification, expectedInput.qualification.vector);
    expectedByRef.set(inputRef, qualification);
  }

  const seen = new Set<string>();
  const normalizedInputs = record.inputs.map((raw, index) => {
    const binding = asRecord(raw, `evaluation input ${index}`);
    exact(binding, ["inputRef", "qualification"], `evaluation input ${index}`);
    const inputRef = nonEmpty(binding.inputRef, `evaluation input ${index} inputRef`);
    if (seen.has(inputRef)) throw new Error(`evaluation input ${inputRef} is duplicated or ambiguous`);
    seen.add(inputRef);

    const expectedQualification = expectedByRef.get(inputRef);
    if (!expectedQualification) throw new Error(`evaluation input ${inputRef} is not explicitly declared`);
    const qualification = normalizeAnalyticalValueQualification(binding.qualification, expectedQualification.vector);
    if (stable(qualification) !== stable(expectedQualification)) {
      throw new Error(`evaluation input ${inputRef} must preserve source/value/producing revisions, owner, locality and qualification exactly`);
    }
    return Object.freeze({ inputRef, qualification: expectedQualification });
  });

  for (const inputRef of expectedByRef.keys()) {
    if (!seen.has(inputRef)) throw new Error(`evaluation input ${inputRef} is missing; implicit defaults are forbidden`);
  }

  normalizedInputs.sort((left, right) => left.inputRef.localeCompare(right.inputRef));
  return Object.freeze({
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    evaluationRef: nonEmpty(record.evaluationRef, "evaluationRef"),
    definition: expected,
    inputs: Object.freeze(normalizedInputs),
  });
}

export function normalizeAnalyticalEvaluationOutcome(
  input: unknown,
  expectedEnvelope: AnalyticalEvaluationEnvelope,
  expectedKind: AnalyticalEvaluationOutcomeKind,
  expectedResolvedValue?: AnalyticalValueQualification,
): AnalyticalEvaluationOutcome {
  const record = asRecord(input, "analytical evaluation outcome");
  if (record.kind !== expectedKind) throw new Error("evaluation outcome kind cannot be masked or substituted");
  const evaluation = normalizeAnalyticalEvaluationEnvelope(record.evaluation, expectedEnvelope.definition, expectedEnvelope.inputs);
  if (stable(evaluation) !== stable(expectedEnvelope)) throw new Error("evaluation outcome must preserve the exact evaluation envelope and historical lineage");

  if (expectedKind === "RESOLVED") {
    exact(record, ["kind", "evaluation", "value"], "resolved evaluation outcome");
    if (!expectedResolvedValue) throw new Error("resolved evaluation outcome requires an explicitly expected qualified value");
    const value = normalizeAnalyticalValueQualification(record.value, expectedResolvedValue.vector);
    if (stable(value) !== stable(expectedResolvedValue)) {
      throw new Error("resolved evaluation value must preserve exact source/currentness/locality qualification and revisions");
    }
    if (stable(value.vector.qualifiedValue.producingAnalyticalRevision) !== stable(evaluation.definition.ref)) {
      throw new Error("resolved evaluation value producing revision must match the pinned analytical definition revision");
    }
    assertAnalyticalTransformDoesNotStrengthen(evaluation.inputs.map((binding) => binding.qualification), value);
    return Object.freeze({ kind: "RESOLVED", evaluation, value });
  }

  if (expectedKind === "UNRESOLVED") {
    exact(record, ["kind", "evaluation", "reason", "evidence"], "unresolved evaluation outcome");
    return Object.freeze({
      kind: "UNRESOLVED",
      evaluation,
      reason: nonEmpty(record.reason, "unresolved reason"),
      evidence: normalizeOutcomeEvidence(record.evidence),
    });
  }

  exact(record, ["kind", "evaluation", "errorCode", "reason", "evidence"], "error evaluation outcome");
  return Object.freeze({
    kind: "ERROR",
    evaluation,
    errorCode: nonEmpty(record.errorCode, "errorCode"),
    reason: nonEmpty(record.reason, "error reason"),
    evidence: normalizeOutcomeEvidence(record.evidence),
  });
}
