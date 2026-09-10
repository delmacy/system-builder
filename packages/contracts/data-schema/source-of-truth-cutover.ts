import type { CurrentnessQualification, DefinitionRevisionRef } from "../semantic-substrate/index.js";
import { normalizeCurrentnessQualification, normalizeDefinitionRevisionRef } from "../semantic-substrate/index.js";

export const SOURCE_OF_TRUTH_CUTOVER_CONTRACT_VERSION = "1.0.0" as const;
export type MigrationPopulationCount = number | "UNKNOWN";
export type ResidualCompleteness = "KNOWN" | "PARTIAL" | "UNKNOWN";
export type AdoptionState = "PENDING" | "PARTIAL" | "ADOPTED" | "UNKNOWN" | "INCONCLUSIVE";
export type ConvergenceState = "PENDING" | "PARTIAL" | "CONVERGED" | "UNKNOWN" | "INCONCLUSIVE";
export type ReplicationMode = "BACKFILL" | "CDC" | "DUAL_WRITE";
export type ResidualCohortKind = "SOURCE" | "READER" | "WRITER" | "REPLICATION";

export type SourceAuthority = Readonly<{
  sourceRef: string;
  scopeRef: string;
  epoch: number;
  fencingToken: string;
  canonical: boolean;
}>;

export type ReplicationLineage = Readonly<{
  lineageRef: string;
  mode: ReplicationMode;
  sourceRef: string;
  targetRef: string;
  sourceSchemaRevision: DefinitionRevisionRef;
  producingSchemaRevision: DefinitionRevisionRef;
  targetSchemaRevision: DefinitionRevisionRef;
  executedAt: string;
  acknowledgedAt: string | null;
  executionSucceeded: boolean;
  adoption: AdoptionState;
  convergence: ConvergenceState;
}>;

export type ResidualMigrationCohort = Readonly<{
  cohortRef: string;
  cohortKind: ResidualCohortKind;
  populationScope: string;
  localityScope: string;
  populationCount: MigrationPopulationCount;
  completeness: ResidualCompleteness;
  drained: boolean;
  currentness: CurrentnessQualification;
}>;

export type SourceOfTruthCutover = Readonly<{
  contractVersion: typeof SOURCE_OF_TRUTH_CUTOVER_CONTRACT_VERSION;
  cutoverRevision: DefinitionRevisionRef;
  scopeRef: string;
  evaluatedAt: string;
  authorities: readonly SourceAuthority[];
  lineage: readonly ReplicationLineage[];
  residualCohorts: readonly ResidualMigrationCohort[];
}>;

type UnknownRecord = Record<string, unknown>;
const asRecord = (value: unknown, label: string): UnknownRecord => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value as UnknownRecord;
};
const exactFields = (record: UnknownRecord, fields: readonly string[], label: string): void => {
  for (const key of Object.keys(record)) if (!fields.includes(key)) throw new Error(`${label} has unexpected field ${key}`);
  for (const key of fields) if (!(key in record)) throw new Error(`${label} is missing field ${key}`);
};
const nonEmpty = (value: unknown, label: string): string => {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${label} must be a non-empty string`);
  return value.trim();
};
const timestamp = (value: unknown, label: string): string => {
  const normalized = nonEmpty(value, label);
  if (!Number.isFinite(Date.parse(normalized))) throw new Error(`${label} must be an ISO timestamp`);
  return normalized;
};
const enumValue = <T extends string>(value: unknown, allowed: readonly T[], label: string): T => {
  if (!allowed.includes(value as T)) throw new Error(`invalid ${label}`);
  return value as T;
};
const count = (value: unknown): MigrationPopulationCount => {
  if (value === "UNKNOWN") return value;
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) throw new Error("populationCount must be a non-negative integer or UNKNOWN");
  return value;
};
const revisionKey = (value: DefinitionRevisionRef): string => [value.semanticOwner,value.semanticKind,value.canonicalRef,value.definitionRef,value.revisionOwner,value.revisionDimension,value.revisionRef].join("\u0000");
const sameRevision = (left: DefinitionRevisionRef, right: DefinitionRevisionRef): boolean => revisionKey(left) === revisionKey(right);

function normalizeAuthority(value: unknown): SourceAuthority {
  const record = asRecord(value, "source authority");
  exactFields(record,["sourceRef","scopeRef","epoch","fencingToken","canonical"],"source authority");
  if (typeof record.epoch !== "number" || !Number.isInteger(record.epoch) || record.epoch < 0) throw new Error("authority epoch must be a non-negative integer");
  if (typeof record.canonical !== "boolean") throw new Error("authority canonical must be boolean");
  return Object.freeze({sourceRef:nonEmpty(record.sourceRef,"sourceRef"),scopeRef:nonEmpty(record.scopeRef,"scopeRef"),epoch:record.epoch,fencingToken:nonEmpty(record.fencingToken,"fencingToken"),canonical:record.canonical});
}

function normalizeLineage(value: unknown): ReplicationLineage {
  const record = asRecord(value, "replication lineage");
  exactFields(record,["lineageRef","mode","sourceRef","targetRef","sourceSchemaRevision","producingSchemaRevision","targetSchemaRevision","executedAt","acknowledgedAt","executionSucceeded","adoption","convergence"],"replication lineage");
  if (typeof record.executionSucceeded !== "boolean") throw new Error("executionSucceeded must be boolean");
  const acknowledgedAt = record.acknowledgedAt === null ? null : timestamp(record.acknowledgedAt,"acknowledgedAt");
  const adoption = enumValue(record.adoption,["PENDING","PARTIAL","ADOPTED","UNKNOWN","INCONCLUSIVE"] as const,"adoption");
  const convergence = enumValue(record.convergence,["PENDING","PARTIAL","CONVERGED","UNKNOWN","INCONCLUSIVE"] as const,"convergence");
  if (acknowledgedAt !== null && adoption === "PENDING" && convergence === "CONVERGED") throw new Error("acknowledgement cannot imply convergence");
  if (!record.executionSucceeded && (adoption === "ADOPTED" || convergence === "CONVERGED")) throw new Error("failed execution cannot imply adoption or convergence");
  return Object.freeze({lineageRef:nonEmpty(record.lineageRef,"lineageRef"),mode:enumValue(record.mode,["BACKFILL","CDC","DUAL_WRITE"] as const,"replication mode"),sourceRef:nonEmpty(record.sourceRef,"sourceRef"),targetRef:nonEmpty(record.targetRef,"targetRef"),sourceSchemaRevision:normalizeDefinitionRevisionRef(record.sourceSchemaRevision),producingSchemaRevision:normalizeDefinitionRevisionRef(record.producingSchemaRevision),targetSchemaRevision:normalizeDefinitionRevisionRef(record.targetSchemaRevision),executedAt:timestamp(record.executedAt,"executedAt"),acknowledgedAt,executionSucceeded:record.executionSucceeded,adoption,convergence});
}

function normalizeResidual(value: unknown, cutoverRevision: DefinitionRevisionRef, evaluatedAt: string): ResidualMigrationCohort {
  const record = asRecord(value,"residual migration cohort");
  exactFields(record,["cohortRef","cohortKind","populationScope","localityScope","populationCount","completeness","drained","currentness"],"residual migration cohort");
  const completeness = enumValue(record.completeness,["KNOWN","PARTIAL","UNKNOWN"] as const,"residual completeness");
  const populationCount = count(record.populationCount);
  const populationScope = nonEmpty(record.populationScope,"populationScope");
  const localityScope = nonEmpty(record.localityScope,"localityScope");
  const currentness = normalizeCurrentnessQualification(record.currentness);
  if (!sameRevision(currentness.subject, cutoverRevision)) throw new Error("residual currentness subject must exactly match cutover revision");
  if (currentness.populationScope !== populationScope) throw new Error("residual currentness population scope must exactly match residual population scope");
  if (currentness.localityScope !== localityScope) throw new Error("residual currentness locality scope must exactly match residual locality scope");
  if ((completeness === "PARTIAL" || completeness === "UNKNOWN") && populationCount !== "UNKNOWN") throw new Error("PARTIAL/UNKNOWN residual must preserve populationCount as UNKNOWN");
  if (typeof record.drained !== "boolean") throw new Error("residual drained must be boolean");
  if (record.drained && (populationCount === "UNKNOWN" || (typeof populationCount === "number" && populationCount !== 0))) throw new Error("drained residual must have known zero population");
  if (record.drained) {
    if (currentness.state !== "CURRENT") throw new Error("drained residual requires CURRENT evidence");
    const evaluated = Date.parse(evaluatedAt);
    if (evaluated < Date.parse(currentness.currentnessHorizon.assessedAt) || evaluated > Date.parse(currentness.currentnessHorizon.validUntil)) throw new Error("drained residual evidence cannot be reused outside its currentness horizon");
  }
  return Object.freeze({cohortRef:nonEmpty(record.cohortRef,"cohortRef"),cohortKind:enumValue(record.cohortKind,["SOURCE","READER","WRITER","REPLICATION"] as const,"cohort kind"),populationScope,localityScope,populationCount,completeness,drained:record.drained,currentness});
}

export function normalizeSourceOfTruthCutover(input: unknown): SourceOfTruthCutover {
  const record = asRecord(input,"source of truth cutover");
  exactFields(record,["contractVersion","cutoverRevision","scopeRef","evaluatedAt","authorities","lineage","residualCohorts"],"source of truth cutover");
  if (record.contractVersion !== SOURCE_OF_TRUTH_CUTOVER_CONTRACT_VERSION) throw new Error("unsupported source of truth cutover contract version");
  if (!Array.isArray(record.authorities) || !Array.isArray(record.lineage) || !Array.isArray(record.residualCohorts)) throw new Error("authorities, lineage and residualCohorts must be arrays");
  const cutoverRevision = normalizeDefinitionRevisionRef(record.cutoverRevision);
  const scopeRef = nonEmpty(record.scopeRef,"scopeRef");
  const evaluatedAt = timestamp(record.evaluatedAt,"evaluatedAt");
  const authorities = record.authorities.map(normalizeAuthority);
  if (authorities.some((authority)=>authority.scopeRef !== scopeRef)) throw new Error("authority scope must exactly match cutover scope");
  const canonical = authorities.filter((authority)=>authority.canonical);
  if (canonical.length !== 1) throw new Error("cutover requires exactly one canonical source authority");
  const fencingEpochs = new Set<string>();
  for (const authority of authorities) {
    const key = `${authority.scopeRef}\u0000${authority.epoch}`;
    if (fencingEpochs.has(key)) throw new Error("fencing epoch cannot be reused within scope");
    fencingEpochs.add(key);
  }
  const highestEpoch = Math.max(...authorities.map((authority)=>authority.epoch));
  if (canonical[0]!.epoch !== highestEpoch) throw new Error("stale fenced source cannot reacquire canonical authority");
  const lineage = record.lineage.map(normalizeLineage);
  const residualCohorts = record.residualCohorts.map((value)=>normalizeResidual(value,cutoverRevision,evaluatedAt));
  const requiredResidualKinds: readonly ResidualCohortKind[] = ["SOURCE","READER","WRITER","REPLICATION"];
  for (const kind of requiredResidualKinds) {
    if (!residualCohorts.some((cohort)=>cohort.cohortKind === kind)) throw new Error(`residual cohort class ${kind} must remain explicit`);
  }
  const hasUnsafeResidual = residualCohorts.some((cohort)=>!cohort.drained || cohort.populationCount === "UNKNOWN" || cohort.completeness !== "KNOWN" || cohort.currentness.state !== "CURRENT");
  if (lineage.some((entry)=>entry.convergence === "CONVERGED") && hasUnsafeResidual) throw new Error("convergence requires explicit current drainage of all residual cohorts");
  return Object.freeze({contractVersion:SOURCE_OF_TRUTH_CUTOVER_CONTRACT_VERSION,cutoverRevision,scopeRef,evaluatedAt,authorities:Object.freeze(authorities),lineage:Object.freeze(lineage),residualCohorts:Object.freeze(residualCohorts)});
}
