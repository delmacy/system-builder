import { MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, normalizeAnalyticalDefinitionRevision, type AnalyticalDefinitionRevision } from "./index.js";
import { normalizeAnalyticalValueQualification, type AnalyticalEvidenceReference, type AnalyticalUncertainty, type AnalyticalValueQualification } from "./uncertainty.js";

export const ANALYTICAL_ASSOCIATION_DESCRIPTOR_KINDS = ["EVIDENCE_ASSOCIATION", "CORRELATION"] as const;
export type AnalyticalAssociationDescriptorKind = (typeof ANALYTICAL_ASSOCIATION_DESCRIPTOR_KINDS)[number];

export type AnalyticalAssociationParticipant = Readonly<{
  participantRef: string;
  qualification: AnalyticalValueQualification;
}>;

export type AnalyticalAssociationDescriptor = Readonly<{
  contractVersion: typeof MATHEMATICAL_SEMANTICS_CONTRACT_VERSION;
  associationRef: string;
  kind: AnalyticalAssociationDescriptorKind;
  analyticalRevision: AnalyticalDefinitionRevision;
  participants: readonly AnalyticalAssociationParticipant[];
  evidence: readonly AnalyticalEvidenceReference[];
  uncertainty: AnalyticalUncertainty;
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

function stable(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  const r = value as UnknownRecord;
  return `{${Object.keys(r).sort().map((key) => `${JSON.stringify(key)}:${stable(r[key])}`).join(",")}}`;
}

function normalizeEvidence(input: unknown): readonly AnalyticalEvidenceReference[] {
  if (!Array.isArray(input)) throw new Error("association evidence must be an array");
  return Object.freeze(input.map((item, index) => {
    const r = record(item, `association evidence ${index}`);
    exact(r, ["evidenceRef", "evidenceRevision", "evidenceOwner"], `association evidence ${index}`);
    return Object.freeze({
      evidenceRef: text(r.evidenceRef, "evidenceRef"),
      evidenceRevision: text(r.evidenceRevision, "evidenceRevision"),
      evidenceOwner: text(r.evidenceOwner, "evidenceOwner"),
    });
  }));
}

function normalizeUncertainty(input: unknown): AnalyticalUncertainty {
  const r = record(input, "association uncertainty");
  if (r.state === "UNRESOLVED" || r.state === "NONE_DECLARED") {
    exact(r, ["state"], "association uncertainty");
    return Object.freeze({ state: r.state });
  }
  if (r.state === "BOUNDED") {
    exact(r, ["state", "uncertaintyRef", "uncertaintyRevision", "uncertaintyOwner"], "association uncertainty");
    return Object.freeze({
      state: "BOUNDED",
      uncertaintyRef: text(r.uncertaintyRef, "uncertaintyRef"),
      uncertaintyRevision: text(r.uncertaintyRevision, "uncertaintyRevision"),
      uncertaintyOwner: text(r.uncertaintyOwner, "uncertaintyOwner"),
    });
  }
  throw new Error("invalid association uncertainty state");
}

export function normalizeAnalyticalAssociationDescriptor(
  input: unknown,
  expectedAnalyticalRevision: AnalyticalDefinitionRevision,
  expectedParticipants: readonly AnalyticalAssociationParticipant[],
  expectedEvidence: readonly AnalyticalEvidenceReference[],
  expectedUncertainty: AnalyticalUncertainty,
): AnalyticalAssociationDescriptor {
  const r = record(input, "analytical association descriptor");
  exact(r, ["contractVersion", "associationRef", "kind", "analyticalRevision", "participants", "evidence", "uncertainty"], "analytical association descriptor");
  if (r.contractVersion !== MATHEMATICAL_SEMANTICS_CONTRACT_VERSION) throw new Error("unsupported mathematical semantics contract version");
  if (r.kind !== "EVIDENCE_ASSOCIATION" && r.kind !== "CORRELATION") throw new Error("association kind cannot claim causal authority");

  const analyticalRevision = normalizeAnalyticalDefinitionRevision(r.analyticalRevision);
  const expectedRevision = normalizeAnalyticalDefinitionRevision(expectedAnalyticalRevision);
  if (stable(analyticalRevision) !== stable(expectedRevision)) throw new Error("association must preserve the exact historical analytical revision");

  if (!Array.isArray(r.participants) || r.participants.length < 2) throw new Error("association requires at least two explicit participants");
  if (r.participants.length !== expectedParticipants.length) throw new Error("association cannot add or drop participants");

  const participants = r.participants.map((raw, index) => {
    const participant = record(raw, `association participant ${index}`);
    exact(participant, ["participantRef", "qualification"], `association participant ${index}`);
    const expected = expectedParticipants[index];
    if (!expected) throw new Error("association participant order is not declared");
    const participantRef = text(participant.participantRef, `association participant ${index} participantRef`);
    if (participantRef !== expected.participantRef) throw new Error("association participant order and identity must remain exact");
    const expectedQualification = normalizeAnalyticalValueQualification(expected.qualification, expected.qualification.vector);
    const qualification = normalizeAnalyticalValueQualification(participant.qualification, expectedQualification.vector);
    if (stable(qualification) !== stable(expectedQualification)) throw new Error("association cannot substitute source revision, owner, currentness, locality, evidence or uncertainty qualification");
    return Object.freeze({ participantRef, qualification: expectedQualification });
  });

  const evidence = normalizeEvidence(r.evidence);
  const normalizedExpectedEvidence = normalizeEvidence(expectedEvidence);
  if (stable(evidence) !== stable(normalizedExpectedEvidence)) throw new Error("association evidence revisions and owners must remain exact");

  const uncertainty = normalizeUncertainty(r.uncertainty);
  const normalizedExpectedUncertainty = normalizeUncertainty(expectedUncertainty);
  if (stable(uncertainty) !== stable(normalizedExpectedUncertainty)) throw new Error("association uncertainty cannot be strengthened or substituted");

  return Object.freeze({
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    associationRef: text(r.associationRef, "associationRef"),
    kind: r.kind,
    analyticalRevision: expectedRevision,
    participants: Object.freeze(participants),
    evidence: normalizedExpectedEvidence,
    uncertainty: normalizedExpectedUncertainty,
  });
}
