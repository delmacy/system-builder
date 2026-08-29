import {
  PROCESS_VERSION_IDENTITY_VERSION,
  normalizeProcessRevisionIdentity,
  type ProcessRevisionIdentity,
} from "./index.js";

export const PROCESS_SYSTEM_LINEAGE_VERSION = "1.0.0" as const;

export type ProcessSystemLineageEndpointKind =
  | "process-revision"
  | "analysis"
  | "system-definition"
  | "release"
  | "deployment";

export type ProcessRevisionLineageEndpoint = Readonly<{
  contractVersion: typeof PROCESS_SYSTEM_LINEAGE_VERSION;
  kind: "process-revision";
  processRevision: ProcessRevisionIdentity;
}>;

export type ReferencedLineageEndpoint = Readonly<{
  contractVersion: typeof PROCESS_SYSTEM_LINEAGE_VERSION;
  kind: Exclude<ProcessSystemLineageEndpointKind, "process-revision">;
  identityRef: string;
}>;

export type ProcessSystemLineageEndpoint = ProcessRevisionLineageEndpoint | ReferencedLineageEndpoint;

export type ProcessSystemLineageHopKind =
  | "process-revision-to-analysis"
  | "analysis-to-system-definition"
  | "system-definition-to-release"
  | "release-to-deployment";

export type ProcessSystemLineageHop = Readonly<{
  contractVersion: typeof PROCESS_SYSTEM_LINEAGE_VERSION;
  kind: ProcessSystemLineageHopKind;
  from: ProcessSystemLineageEndpoint;
  to: ProcessSystemLineageEndpoint;
}>;

export type ProcessAnalysisDefinitionLineage = Readonly<{
  contractVersion: typeof PROCESS_SYSTEM_LINEAGE_VERSION;
  processRevision: ProcessRevisionLineageEndpoint;
  analysis: ReferencedLineageEndpoint & { readonly kind: "analysis" };
  systemDefinition: ReferencedLineageEndpoint & { readonly kind: "system-definition" };
  hops: readonly [ProcessSystemLineageHop, ProcessSystemLineageHop];
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

function version(value: unknown): typeof PROCESS_SYSTEM_LINEAGE_VERSION {
  if (value !== PROCESS_SYSTEM_LINEAGE_VERSION) throw new Error(`unsupported process-system lineage contract version: ${String(value)}`);
  return PROCESS_SYSTEM_LINEAGE_VERSION;
}

function nonEmpty(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${field} must be a non-empty string`);
  return value.trim();
}

function endpointFingerprint(endpoint: ProcessSystemLineageEndpoint): string {
  if (endpoint.kind === "process-revision") return `${endpoint.kind}:${endpoint.processRevision.artifactRef}:${endpoint.processRevision.revisionRef}`;
  return `${endpoint.kind}:${endpoint.identityRef}`;
}

export function normalizeProcessSystemLineageEndpoint(input: unknown): ProcessSystemLineageEndpoint {
  const record = asRecord(input, "process-system lineage endpoint");
  const kind = record.kind;
  if (kind === "process-revision") {
    assertExactFields(record, ["contractVersion", "kind", "processRevision"], "process-system lineage endpoint");
    const processRevision = normalizeProcessRevisionIdentity(record.processRevision);
    if (processRevision.contractVersion !== PROCESS_VERSION_IDENTITY_VERSION) throw new Error("process revision endpoint must use canonical process-versioning identity");
    return Object.freeze({ contractVersion: version(record.contractVersion), kind, processRevision });
  }
  if (kind !== "analysis" && kind !== "system-definition" && kind !== "release" && kind !== "deployment") throw new Error(`unsupported process-system lineage endpoint kind: ${String(kind)}`);
  assertExactFields(record, ["contractVersion", "kind", "identityRef"], "process-system lineage endpoint");
  return Object.freeze({ contractVersion: version(record.contractVersion), kind, identityRef: nonEmpty(record.identityRef, "identityRef") });
}

const HOP_ENDPOINTS: Readonly<Record<ProcessSystemLineageHopKind, readonly [ProcessSystemLineageEndpointKind, ProcessSystemLineageEndpointKind]>> = {
  "process-revision-to-analysis": ["process-revision", "analysis"],
  "analysis-to-system-definition": ["analysis", "system-definition"],
  "system-definition-to-release": ["system-definition", "release"],
  "release-to-deployment": ["release", "deployment"],
};

export function normalizeProcessSystemLineageHop(input: unknown): ProcessSystemLineageHop {
  const record = asRecord(input, "process-system lineage hop");
  assertExactFields(record, ["contractVersion", "kind", "from", "to"], "process-system lineage hop");
  const contractVersion = version(record.contractVersion);
  const kind = record.kind as ProcessSystemLineageHopKind;
  const expected = HOP_ENDPOINTS[kind];
  if (!expected) throw new Error(`unsupported process-system lineage hop kind: ${String(record.kind)}`);
  const from = normalizeProcessSystemLineageEndpoint(record.from);
  const to = normalizeProcessSystemLineageEndpoint(record.to);
  if (from.kind !== expected[0] || to.kind !== expected[1]) throw new Error(`lineage hop ${kind} requires ${expected[0]} -> ${expected[1]}`);
  if (endpointFingerprint(from) === endpointFingerprint(to)) throw new Error("lineage hop endpoints must be distinct");
  return Object.freeze({ contractVersion, kind, from, to });
}

export function normalizeProcessAnalysisDefinitionLineage(input: unknown): ProcessAnalysisDefinitionLineage {
  const record = asRecord(input, "process-analysis-definition lineage");
  assertExactFields(record, ["contractVersion", "processRevision", "analysis", "systemDefinition", "hops"], "process-analysis-definition lineage");
  const contractVersion = version(record.contractVersion);
  const processRevision = normalizeProcessSystemLineageEndpoint(record.processRevision);
  const analysis = normalizeProcessSystemLineageEndpoint(record.analysis);
  const systemDefinition = normalizeProcessSystemLineageEndpoint(record.systemDefinition);
  if (processRevision.kind !== "process-revision") throw new Error("lineage anchor must be process-revision");
  if (analysis.kind !== "analysis") throw new Error("lineage analysis endpoint must be analysis");
  if (systemDefinition.kind !== "system-definition") throw new Error("lineage definition endpoint must be system-definition");
  const analysisEndpoint: ReferencedLineageEndpoint & { readonly kind: "analysis" } = Object.freeze({
    contractVersion: analysis.contractVersion,
    kind: "analysis",
    identityRef: analysis.identityRef,
  });
  const systemDefinitionEndpoint: ReferencedLineageEndpoint & { readonly kind: "system-definition" } = Object.freeze({
    contractVersion: systemDefinition.contractVersion,
    kind: "system-definition",
    identityRef: systemDefinition.identityRef,
  });
  if (!Array.isArray(record.hops) || record.hops.length !== 2) throw new Error("process-analysis-definition lineage requires exactly two ordered hops");
  const first = normalizeProcessSystemLineageHop(record.hops[0]);
  const second = normalizeProcessSystemLineageHop(record.hops[1]);
  if (first.kind !== "process-revision-to-analysis" || second.kind !== "analysis-to-system-definition") throw new Error("process-analysis-definition lineage hops are out of order");
  if (endpointFingerprint(first.from) !== endpointFingerprint(processRevision) || endpointFingerprint(first.to) !== endpointFingerprint(analysisEndpoint)) throw new Error("process-to-analysis hop does not match declared endpoints");
  if (endpointFingerprint(second.from) !== endpointFingerprint(analysisEndpoint) || endpointFingerprint(second.to) !== endpointFingerprint(systemDefinitionEndpoint)) throw new Error("analysis-to-definition hop does not match declared endpoints");
  if (analysisEndpoint.identityRef === systemDefinitionEndpoint.identityRef) throw new Error("analysis and system-definition identities must be distinct");
  const hops: readonly [ProcessSystemLineageHop, ProcessSystemLineageHop] = Object.freeze([first, second]);
  return Object.freeze({ contractVersion, processRevision, analysis: analysisEndpoint, systemDefinition: systemDefinitionEndpoint, hops });
}
