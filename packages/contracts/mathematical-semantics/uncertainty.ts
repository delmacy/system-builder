import { normalizeAnalyticalVectorBinding, type AnalyticalVectorBinding } from "./vector.js";

export const ANALYTICAL_EPISTEMIC_STATES = ["UNKNOWN", "INCONCLUSIVE", "PARTIAL", "KNOWN"] as const;
export type AnalyticalEpistemicState = (typeof ANALYTICAL_EPISTEMIC_STATES)[number];

export const ANALYTICAL_ASSOCIATION_KINDS = ["EVIDENCE_ASSOCIATION", "CORRELATION"] as const;
export type AnalyticalAssociationKind = (typeof ANALYTICAL_ASSOCIATION_KINDS)[number];

export type AnalyticalEvidenceReference = Readonly<{
  evidenceRef: string;
  evidenceRevision: string;
  evidenceOwner: string;
}>;

export type AnalyticalUncertainty = Readonly<{
  state: "UNRESOLVED" | "BOUNDED" | "NONE_DECLARED";
  uncertaintyRef?: string;
  uncertaintyRevision?: string;
  uncertaintyOwner?: string;
}>;

export type AnalyticalValueQualification = Readonly<{
  qualificationRef: string;
  qualificationRevision: string;
  qualificationOwner: string;
  epistemicState: AnalyticalEpistemicState;
  vector: AnalyticalVectorBinding;
  evidence: readonly AnalyticalEvidenceReference[];
  uncertainty: AnalyticalUncertainty;
  associationKind: AnalyticalAssociationKind;
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
function epistemicState(value: unknown): AnalyticalEpistemicState {
  if (typeof value !== "string" || !ANALYTICAL_EPISTEMIC_STATES.includes(value as AnalyticalEpistemicState)) throw new Error("invalid analytical epistemic state");
  return value as AnalyticalEpistemicState;
}
function associationKind(value: unknown): AnalyticalAssociationKind {
  if (typeof value !== "string" || !ANALYTICAL_ASSOCIATION_KINDS.includes(value as AnalyticalAssociationKind)) throw new Error("analytical association cannot claim causal authority");
  return value as AnalyticalAssociationKind;
}
function evidence(value: unknown): readonly AnalyticalEvidenceReference[] {
  if (!Array.isArray(value)) throw new Error("evidence must be an array");
  return Object.freeze(value.map((item, index) => {
    const r = record(item, `evidence[${index}]`);
    exact(r, ["evidenceRef", "evidenceRevision", "evidenceOwner"], `evidence[${index}]`);
    return Object.freeze({ evidenceRef: text(r.evidenceRef, "evidenceRef"), evidenceRevision: text(r.evidenceRevision, "evidenceRevision"), evidenceOwner: text(r.evidenceOwner, "evidenceOwner") });
  }));
}
function uncertainty(value: unknown): AnalyticalUncertainty {
  const r = record(value, "uncertainty");
  if (r.state === "UNRESOLVED" || r.state === "NONE_DECLARED") {
    exact(r, ["state"], "uncertainty");
    return Object.freeze({ state: r.state });
  }
  if (r.state === "BOUNDED") {
    exact(r, ["state", "uncertaintyRef", "uncertaintyRevision", "uncertaintyOwner"], "uncertainty");
    return Object.freeze({ state: "BOUNDED", uncertaintyRef: text(r.uncertaintyRef, "uncertaintyRef"), uncertaintyRevision: text(r.uncertaintyRevision, "uncertaintyRevision"), uncertaintyOwner: text(r.uncertaintyOwner, "uncertaintyOwner") });
  }
  throw new Error("invalid uncertainty state");
}

function vectorKey(value: AnalyticalVectorBinding): string {
  return JSON.stringify(value);
}

export function normalizeAnalyticalValueQualification(input: unknown, expectedVector: AnalyticalVectorBinding): AnalyticalValueQualification {
  const r = record(input, "analytical value qualification");
  exact(r, ["qualificationRef", "qualificationRevision", "qualificationOwner", "epistemicState", "vector", "evidence", "uncertainty", "associationKind"], "analytical value qualification");
  const vector = normalizeAnalyticalVectorBinding(r.vector, expectedVector.qualifiedValue);
  if (vectorKey(vector) !== vectorKey(expectedVector)) throw new Error("qualification must preserve vector, source revision, owner and locality lineage");
  const state = epistemicState(r.epistemicState);
  const refs = evidence(r.evidence);
  const u = uncertainty(r.uncertainty);
  if (state === "KNOWN" && refs.length === 0) throw new Error("KNOWN analytical value requires explicit evidence; absence is not authority");
  if (state === "KNOWN" && u.state === "UNRESOLVED") throw new Error("KNOWN analytical value cannot hide unresolved uncertainty");
  return Object.freeze({
    qualificationRef: text(r.qualificationRef, "qualificationRef"),
    qualificationRevision: text(r.qualificationRevision, "qualificationRevision"),
    qualificationOwner: text(r.qualificationOwner, "qualificationOwner"),
    epistemicState: state,
    vector,
    evidence: refs,
    uncertainty: u,
    associationKind: associationKind(r.associationKind),
  });
}

const STRENGTH: Readonly<Record<AnalyticalEpistemicState, number>> = { UNKNOWN: 0, INCONCLUSIVE: 0, PARTIAL: 1, KNOWN: 2 };

export function assertAnalyticalTransformDoesNotStrengthen(inputs: readonly AnalyticalValueQualification[], output: AnalyticalValueQualification): void {
  if (inputs.length === 0) throw new Error("analytical transform requires qualified inputs");
  const weakest = Math.min(...inputs.map((input) => STRENGTH[input.epistemicState]));
  if (STRENGTH[output.epistemicState] > weakest) throw new Error("analytical transform cannot strengthen epistemic state without owner-governed disposition");
  if (inputs.some((input) => input.epistemicState === "UNKNOWN") && output.epistemicState !== "UNKNOWN") throw new Error("UNKNOWN input must remain UNKNOWN without owner-governed disposition");
  if (inputs.some((input) => input.epistemicState === "INCONCLUSIVE") && output.epistemicState !== "INCONCLUSIVE" && output.epistemicState !== "UNKNOWN") throw new Error("INCONCLUSIVE input cannot be promoted by analytical mechanics");
}
