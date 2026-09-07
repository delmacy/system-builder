export const SEMANTIC_SUBSTRATE_CONTRACT_VERSION = "1.0.0" as const;

export type CanonicalSemanticIdentityRef = Readonly<{
  contractVersion: typeof SEMANTIC_SUBSTRATE_CONTRACT_VERSION;
  semanticOwner: string;
  semanticKind: string;
  canonicalRef: string;
}>;
export type DefinitionRef = Readonly<CanonicalSemanticIdentityRef & { definitionRef: string }>;
export type OccurrenceRef = Readonly<CanonicalSemanticIdentityRef & { occurrenceRef: string }>;
export type RealizationIdentityRef = Readonly<{
  contractVersion: typeof SEMANTIC_SUBSTRATE_CONTRACT_VERSION;
  semanticOwner: string;
  semanticKind: string;
  realizationProvider: string;
  realizationRef: string;
}>;
export type DefinitionRevisionRef = Readonly<DefinitionRef & { revisionOwner: string; revisionDimension: string; revisionRef: string }>;
export type RevisionVectorDimension = Readonly<{ revisionOwner: string; revisionDimension: string; revisionRef: string }>;
export type RevisionVector = readonly RevisionVectorDimension[];
export type RevisionLineageRelation = "supersedes" | "corrects";
export type RevisionLineage = Readonly<{ relation: RevisionLineageRelation; predecessor: DefinitionRevisionRef; successor: DefinitionRevisionRef }>;
export type TemporalCoordinates = Readonly<{
  occurredAt: string | null;
  observedAt: string | null;
  evaluatedAt: string | null;
  effectiveFrom: string | null;
  effectiveUntil: string | null;
  reconciledAt: string | null;
}>;
export type CurrentnessState = "CURRENT" | "STALE" | "UNKNOWN" | "INSUFFICIENT";
export type CurrentnessHorizon = Readonly<{ assessedAt: string; validUntil: string }>;
export type CurrentnessQualification = Readonly<{
  contractVersion: typeof SEMANTIC_SUBSTRATE_CONTRACT_VERSION;
  subject: DefinitionRevisionRef;
  revisionVector: RevisionVector;
  temporal: TemporalCoordinates;
  populationScope: string;
  localityScope: string;
  currentnessHorizon: CurrentnessHorizon;
  state: CurrentnessState;
  reason: string;
}>;
export type SemanticRelationKind = "references" | "depends_on" | "realizes" | "derives_from";
export type SemanticMetadata = Readonly<Record<string, string>>;
export type TypedSemanticNode = Readonly<{
  ref: DefinitionRevisionRef;
  metadata: SemanticMetadata;
}>;
export type TypedSemanticRelation = Readonly<{
  relationKind: SemanticRelationKind;
  source: DefinitionRevisionRef;
  target: DefinitionRevisionRef;
  metadata: SemanticMetadata;
}>;
export type TypedSemanticGraph = Readonly<{
  contractVersion: typeof SEMANTIC_SUBSTRATE_CONTRACT_VERSION;
  nodes: readonly TypedSemanticNode[];
  relations: readonly TypedSemanticRelation[];
}>;

type UnknownRecord = Record<string, unknown>;
function asRecord(value: unknown, label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value as UnknownRecord;
}
function assertExactFields(record: UnknownRecord, fields: readonly string[], label: string): void {
  for (const key of Object.keys(record)) if (!fields.includes(key)) throw new Error(`${label} has unexpected field ${key}`);
  for (const key of fields) if (!(key in record)) throw new Error(`${label} is missing field ${key}`);
}
function nonEmpty(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${field} must be a non-empty string`);
  return value.trim();
}
function version(value: unknown): typeof SEMANTIC_SUBSTRATE_CONTRACT_VERSION {
  if (value !== SEMANTIC_SUBSTRATE_CONTRACT_VERSION) throw new Error(`unsupported semantic substrate contract version: ${String(value)}`);
  return SEMANTIC_SUBSTRATE_CONTRACT_VERSION;
}
function semanticCoordinates(record: UnknownRecord) {
  return Object.freeze({ contractVersion: version(record.contractVersion), semanticOwner: nonEmpty(record.semanticOwner, "semanticOwner"), semanticKind: nonEmpty(record.semanticKind, "semanticKind") });
}
function canonicalFromRecord(record: UnknownRecord): CanonicalSemanticIdentityRef {
  return Object.freeze({ ...semanticCoordinates(record), canonicalRef: nonEmpty(record.canonicalRef, "canonicalRef") });
}
function timestamp(value: unknown, field: string): string {
  const normalized = nonEmpty(value, field);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(normalized) || Number.isNaN(Date.parse(normalized))) throw new Error(`${field} must be a valid UTC timestamp`);
  return normalized;
}
function nullableTimestamp(value: unknown, field: string): string | null {
  return value === null ? null : timestamp(value, field);
}
function revisionKey(value: DefinitionRevisionRef): string {
  return [value.semanticOwner, value.semanticKind, value.canonicalRef, value.definitionRef, value.revisionOwner, value.revisionDimension, value.revisionRef].join("\u0000");
}
function normalizeMetadata(input: unknown, label: string): SemanticMetadata {
  const record = asRecord(input, label);
  const reserved = new Set(["contractVersion", "semanticOwner", "semanticKind", "canonicalRef", "definitionRef", "revisionOwner", "revisionDimension", "revisionRef", "relationKind", "source", "target", "predicate", "lifecycle"]);
  const entries = Object.entries(record).map(([key, value]) => {
    if (reserved.has(key)) throw new Error(`${label} cannot redefine semantic field ${key}`);
    if (typeof value !== "string") throw new Error(`${label}.${key} must be a string`);
    return [nonEmpty(key, `${label} key`), value] as const;
  });
  entries.sort(([a], [b]) => a.localeCompare(b));
  return Object.freeze(Object.fromEntries(entries));
}
export function normalizeCanonicalSemanticIdentityRef(input: unknown): CanonicalSemanticIdentityRef {
  const record = asRecord(input, "canonical semantic identity");
  assertExactFields(record, ["contractVersion", "semanticOwner", "semanticKind", "canonicalRef"], "canonical semantic identity");
  return canonicalFromRecord(record);
}
export function normalizeDefinitionRef(input: unknown): DefinitionRef {
  const record = asRecord(input, "semantic definition ref");
  assertExactFields(record, ["contractVersion", "semanticOwner", "semanticKind", "canonicalRef", "definitionRef"], "semantic definition ref");
  return Object.freeze({ ...canonicalFromRecord(record), definitionRef: nonEmpty(record.definitionRef, "definitionRef") });
}
export function normalizeOccurrenceRef(input: unknown): OccurrenceRef {
  const record = asRecord(input, "semantic occurrence ref");
  assertExactFields(record, ["contractVersion", "semanticOwner", "semanticKind", "canonicalRef", "occurrenceRef"], "semantic occurrence ref");
  return Object.freeze({ ...canonicalFromRecord(record), occurrenceRef: nonEmpty(record.occurrenceRef, "occurrenceRef") });
}
export function normalizeRealizationIdentityRef(input: unknown): RealizationIdentityRef {
  const record = asRecord(input, "semantic realization identity");
  assertExactFields(record, ["contractVersion", "semanticOwner", "semanticKind", "realizationProvider", "realizationRef"], "semantic realization identity");
  return Object.freeze({ ...semanticCoordinates(record), realizationProvider: nonEmpty(record.realizationProvider, "realizationProvider"), realizationRef: nonEmpty(record.realizationRef, "realizationRef") });
}
export function normalizeDefinitionRevisionRef(input: unknown): DefinitionRevisionRef {
  const record = asRecord(input, "definition revision ref");
  assertExactFields(record, ["contractVersion", "semanticOwner", "semanticKind", "canonicalRef", "definitionRef", "revisionOwner", "revisionDimension", "revisionRef"], "definition revision ref");
  return Object.freeze({ ...canonicalFromRecord(record), definitionRef: nonEmpty(record.definitionRef, "definitionRef"), revisionOwner: nonEmpty(record.revisionOwner, "revisionOwner"), revisionDimension: nonEmpty(record.revisionDimension, "revisionDimension"), revisionRef: nonEmpty(record.revisionRef, "revisionRef") });
}
export function normalizeRevisionVector(input: unknown): RevisionVector {
  if (!Array.isArray(input)) throw new Error("revision vector must be an array");
  const seen = new Set<string>();
  const dimensions = input.map((value) => {
    const record = asRecord(value, "revision vector dimension");
    assertExactFields(record, ["revisionOwner", "revisionDimension", "revisionRef"], "revision vector dimension");
    const normalized = Object.freeze({ revisionOwner: nonEmpty(record.revisionOwner, "revisionOwner"), revisionDimension: nonEmpty(record.revisionDimension, "revisionDimension"), revisionRef: nonEmpty(record.revisionRef, "revisionRef") });
    const key = `${normalized.revisionOwner}\u0000${normalized.revisionDimension}`;
    if (seen.has(key)) throw new Error(`duplicate revision dimension: ${normalized.revisionOwner}/${normalized.revisionDimension}`);
    seen.add(key);
    return normalized;
  });
  dimensions.sort((a, b) => a.revisionOwner.localeCompare(b.revisionOwner) || a.revisionDimension.localeCompare(b.revisionDimension));
  return Object.freeze(dimensions);
}
export function normalizeRevisionLineage(input: unknown): RevisionLineage {
  const record = asRecord(input, "revision lineage");
  assertExactFields(record, ["relation", "predecessor", "successor"], "revision lineage");
  if (record.relation !== "supersedes" && record.relation !== "corrects") throw new Error("revision lineage relation must be supersedes or corrects");
  const predecessor = normalizeDefinitionRevisionRef(record.predecessor);
  const successor = normalizeDefinitionRevisionRef(record.successor);
  if (JSON.stringify(predecessor) === JSON.stringify(successor)) throw new Error("revision lineage successor must differ from predecessor");
  return Object.freeze({ relation: record.relation, predecessor, successor });
}
export function normalizeTemporalCoordinates(input: unknown): TemporalCoordinates {
  const record = asRecord(input, "temporal coordinates");
  const fields = ["occurredAt", "observedAt", "evaluatedAt", "effectiveFrom", "effectiveUntil", "reconciledAt"] as const;
  assertExactFields(record, fields, "temporal coordinates");
  const normalized = Object.freeze({
    occurredAt: nullableTimestamp(record.occurredAt, "occurredAt"),
    observedAt: nullableTimestamp(record.observedAt, "observedAt"),
    evaluatedAt: nullableTimestamp(record.evaluatedAt, "evaluatedAt"),
    effectiveFrom: nullableTimestamp(record.effectiveFrom, "effectiveFrom"),
    effectiveUntil: nullableTimestamp(record.effectiveUntil, "effectiveUntil"),
    reconciledAt: nullableTimestamp(record.reconciledAt, "reconciledAt"),
  });
  if (Object.values(normalized).every((value) => value === null)) throw new Error("temporal coordinates require at least one explicit role");
  if (normalized.effectiveFrom !== null && normalized.effectiveUntil !== null && Date.parse(normalized.effectiveUntil) < Date.parse(normalized.effectiveFrom)) throw new Error("effectiveUntil must not precede effectiveFrom");
  return normalized;
}
export function normalizeCurrentnessQualification(input: unknown): CurrentnessQualification {
  const record = asRecord(input, "currentness qualification");
  assertExactFields(record, ["contractVersion", "subject", "revisionVector", "temporal", "populationScope", "localityScope", "currentnessHorizon", "state", "reason"], "currentness qualification");
  const horizon = asRecord(record.currentnessHorizon, "currentness horizon");
  assertExactFields(horizon, ["assessedAt", "validUntil"], "currentness horizon");
  const assessedAt = timestamp(horizon.assessedAt, "currentnessHorizon.assessedAt");
  const validUntil = timestamp(horizon.validUntil, "currentnessHorizon.validUntil");
  if (Date.parse(validUntil) < Date.parse(assessedAt)) throw new Error("currentness horizon validUntil must not precede assessedAt");
  if (record.state !== "CURRENT" && record.state !== "STALE" && record.state !== "UNKNOWN" && record.state !== "INSUFFICIENT") throw new Error("currentness state must be CURRENT, STALE, UNKNOWN or INSUFFICIENT");
  return Object.freeze({
    contractVersion: version(record.contractVersion),
    subject: normalizeDefinitionRevisionRef(record.subject),
    revisionVector: normalizeRevisionVector(record.revisionVector),
    temporal: normalizeTemporalCoordinates(record.temporal),
    populationScope: nonEmpty(record.populationScope, "populationScope"),
    localityScope: nonEmpty(record.localityScope, "localityScope"),
    currentnessHorizon: Object.freeze({ assessedAt, validUntil }),
    state: record.state,
    reason: nonEmpty(record.reason, "reason"),
  });
}
export function normalizeTypedSemanticGraph(input: unknown): TypedSemanticGraph {
  const record = asRecord(input, "typed semantic graph");
  assertExactFields(record, ["contractVersion", "nodes", "relations"], "typed semantic graph");
  if (!Array.isArray(record.nodes)) throw new Error("typed semantic graph nodes must be an array");
  if (!Array.isArray(record.relations)) throw new Error("typed semantic graph relations must be an array");
  const nodeKeys = new Set<string>();
  const nodes = record.nodes.map((value) => {
    const node = asRecord(value, "typed semantic node");
    assertExactFields(node, ["ref", "metadata"], "typed semantic node");
    const ref = normalizeDefinitionRevisionRef(node.ref);
    const key = revisionKey(ref);
    if (nodeKeys.has(key)) throw new Error("typed semantic graph contains duplicate node identity");
    nodeKeys.add(key);
    return Object.freeze({ ref, metadata: normalizeMetadata(node.metadata, "typed semantic node metadata") });
  });
  nodes.sort((a, b) => revisionKey(a.ref).localeCompare(revisionKey(b.ref)));
  const relationKinds = new Set<SemanticRelationKind>(["references", "depends_on", "realizes", "derives_from"]);
  const relationKeys = new Set<string>();
  const relations = record.relations.map((value) => {
    const relation = asRecord(value, "typed semantic relation");
    assertExactFields(relation, ["relationKind", "source", "target", "metadata"], "typed semantic relation");
    if (typeof relation.relationKind !== "string" || !relationKinds.has(relation.relationKind as SemanticRelationKind)) throw new Error(`unknown semantic relation kind: ${String(relation.relationKind)}`);
    const source = normalizeDefinitionRevisionRef(relation.source);
    const target = normalizeDefinitionRevisionRef(relation.target);
    const sourceKey = revisionKey(source);
    const targetKey = revisionKey(target);
    if (!nodeKeys.has(sourceKey)) throw new Error("typed semantic relation source does not exactly match a graph node revision");
    if (!nodeKeys.has(targetKey)) throw new Error("typed semantic relation target does not exactly match a graph node revision");
    const relationKind = relation.relationKind as SemanticRelationKind;
    const edgeKey = `${relationKind}\u0000${sourceKey}\u0000${targetKey}`;
    if (relationKeys.has(edgeKey)) throw new Error("typed semantic graph contains duplicate ambiguous relation");
    relationKeys.add(edgeKey);
    return Object.freeze({ relationKind, source, target, metadata: normalizeMetadata(relation.metadata, "typed semantic relation metadata") });
  });
  relations.sort((a, b) => `${a.relationKind}\u0000${revisionKey(a.source)}\u0000${revisionKey(a.target)}`.localeCompare(`${b.relationKind}\u0000${revisionKey(b.source)}\u0000${revisionKey(b.target)}`));
  return Object.freeze({ contractVersion: version(record.contractVersion), nodes: Object.freeze(nodes), relations: Object.freeze(relations) });
}

export * from "./federation.js";
