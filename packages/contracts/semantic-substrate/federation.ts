import {
  SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  normalizeCurrentnessQualification,
  normalizeTypedSemanticGraph,
  type CurrentnessQualification,
  type TypedSemanticRelation,
} from "./index.js";

export type AutonomousSystemRevisionRef = Readonly<{
  contractVersion: typeof SEMANTIC_SUBSTRATE_CONTRACT_VERSION;
  systemOwner: string;
  systemRef: string;
  systemRevisionRef: string;
}>;

export type LocalityScopeKind = "STATION" | "FLEET" | "REMOTE";
export type LocalityQualification = Readonly<{
  scopeKind: LocalityScopeKind;
  localityRef: string;
}>;

export type FederationConnectivityState = "CONNECTED" | "DISCONNECTED" | "UNKNOWN";

export type FederatedSemanticEdgeQualification = Readonly<{
  contractVersion: typeof SEMANTIC_SUBSTRATE_CONTRACT_VERSION;
  producerSystem: AutonomousSystemRevisionRef;
  consumerSystem: AutonomousSystemRevisionRef;
  relation: TypedSemanticRelation;
  producerCurrentness: CurrentnessQualification;
  consumerCurrentness: CurrentnessQualification;
  producerLocality: LocalityQualification;
  consumerLocality: LocalityQualification;
  connectivity: FederationConnectivityState;
}>;

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown, label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value as UnknownRecord;
}

function assertExactFields(record: UnknownRecord, fields: readonly string[], label: string): void {
  for (const key of Object.keys(record)) {
    if (!fields.includes(key)) throw new Error(`${label} has unexpected field ${key}`);
  }
  for (const key of fields) {
    if (!(key in record)) throw new Error(`${label} is missing field ${key}`);
  }
}

function nonEmpty(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} must be a non-empty string`);
  }
  return value.trim();
}

function version(value: unknown): typeof SEMANTIC_SUBSTRATE_CONTRACT_VERSION {
  if (value !== SEMANTIC_SUBSTRATE_CONTRACT_VERSION) {
    throw new Error(`unsupported semantic substrate contract version: ${String(value)}`);
  }
  return SEMANTIC_SUBSTRATE_CONTRACT_VERSION;
}

function systemKey(value: AutonomousSystemRevisionRef): string {
  return `${value.systemOwner}\u0000${value.systemRef}`;
}

function revisionKey(value: CurrentnessQualification["subject"]): string {
  return [
    value.semanticOwner,
    value.semanticKind,
    value.canonicalRef,
    value.definitionRef,
    value.revisionOwner,
    value.revisionDimension,
    value.revisionRef,
  ].join("\u0000");
}

export function normalizeAutonomousSystemRevisionRef(input: unknown): AutonomousSystemRevisionRef {
  const record = asRecord(input, "autonomous system revision ref");
  assertExactFields(
    record,
    ["contractVersion", "systemOwner", "systemRef", "systemRevisionRef"],
    "autonomous system revision ref",
  );
  return Object.freeze({
    contractVersion: version(record.contractVersion),
    systemOwner: nonEmpty(record.systemOwner, "systemOwner"),
    systemRef: nonEmpty(record.systemRef, "systemRef"),
    systemRevisionRef: nonEmpty(record.systemRevisionRef, "systemRevisionRef"),
  });
}

export function normalizeLocalityQualification(input: unknown): LocalityQualification {
  const record = asRecord(input, "locality qualification");
  assertExactFields(record, ["scopeKind", "localityRef"], "locality qualification");
  if (record.scopeKind !== "STATION" && record.scopeKind !== "FLEET" && record.scopeKind !== "REMOTE") {
    throw new Error("locality scope kind must be STATION, FLEET or REMOTE");
  }
  return Object.freeze({
    scopeKind: record.scopeKind,
    localityRef: nonEmpty(record.localityRef, "localityRef"),
  });
}

export function normalizeFederatedSemanticEdgeQualification(input: unknown): FederatedSemanticEdgeQualification {
  const record = asRecord(input, "federated semantic edge qualification");
  assertExactFields(
    record,
    [
      "contractVersion",
      "producerSystem",
      "consumerSystem",
      "relation",
      "producerCurrentness",
      "consumerCurrentness",
      "producerLocality",
      "consumerLocality",
      "connectivity",
    ],
    "federated semantic edge qualification",
  );

  const producerSystem = normalizeAutonomousSystemRevisionRef(record.producerSystem);
  const consumerSystem = normalizeAutonomousSystemRevisionRef(record.consumerSystem);
  if (systemKey(producerSystem) === systemKey(consumerSystem)) {
    throw new Error("federated semantic edge requires distinct producer and consumer systems");
  }

  const relationRecord = asRecord(record.relation, "federated semantic relation");
  assertExactFields(relationRecord, ["relationKind", "source", "target", "metadata"], "federated semantic relation");
  const graph = normalizeTypedSemanticGraph({
    contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
    nodes: [
      { ref: relationRecord.source, metadata: {} },
      { ref: relationRecord.target, metadata: {} },
    ],
    relations: [relationRecord],
  });
  const relation = graph.relations[0];
  if (relation === undefined) throw new Error("federated semantic relation is required");

  const producerCurrentness = normalizeCurrentnessQualification(record.producerCurrentness);
  const consumerCurrentness = normalizeCurrentnessQualification(record.consumerCurrentness);
  if (revisionKey(producerCurrentness.subject) !== revisionKey(relation.source)) {
    throw new Error("producer currentness must qualify the exact producer semantic revision");
  }
  if (revisionKey(consumerCurrentness.subject) !== revisionKey(relation.target)) {
    throw new Error("consumer currentness must qualify the exact consumer semantic revision");
  }

  const producerLocality = normalizeLocalityQualification(record.producerLocality);
  const consumerLocality = normalizeLocalityQualification(record.consumerLocality);
  if (producerCurrentness.localityScope !== producerLocality.localityRef) {
    throw new Error("producer currentness locality must exactly match producer locality qualification");
  }
  if (consumerCurrentness.localityScope !== consumerLocality.localityRef) {
    throw new Error("consumer currentness locality must exactly match consumer locality qualification");
  }

  if (record.connectivity !== "CONNECTED" && record.connectivity !== "DISCONNECTED" && record.connectivity !== "UNKNOWN") {
    throw new Error("federation connectivity must be CONNECTED, DISCONNECTED or UNKNOWN");
  }

  return Object.freeze({
    contractVersion: version(record.contractVersion),
    producerSystem,
    consumerSystem,
    relation,
    producerCurrentness,
    consumerCurrentness,
    producerLocality,
    consumerLocality,
    connectivity: record.connectivity,
  });
}
