import {
  MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
  normalizeAnalyticalDefinitionRevision,
  type AnalyticalDefinitionRevision,
} from "./index.js";
import {
  normalizeAnalyticalValueQualification,
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
    const qualification = normalizeAnalyticalValueQualification(
      expectedInput.qualification,
      expectedInput.qualification.vector,
    );
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
    const qualification = normalizeAnalyticalValueQualification(
      binding.qualification,
      expectedQualification.vector,
    );
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
