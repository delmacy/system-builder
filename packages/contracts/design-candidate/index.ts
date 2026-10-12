import { systemDefinitionSchema, SYSTEM_DEFINITION_ARTIFACT_TYPE, SYSTEM_DEFINITION_SCHEMA_ID, SYSTEM_DEFINITION_SCHEMA_VERSION } from "@system-builder/contracts/system-definition";

export const CANDIDATE_LIMITS = Object.freeze({ bytes: 1_048_576, depth: 32 });
export interface DefinitionTransition { readonly id: string; readonly from: string; readonly to: string; readonly actionRef?: string }
export interface DefinitionProcess { readonly id: string; readonly name: string; readonly requirementRefs: readonly string[]; readonly states: readonly string[]; readonly initialState?: string; readonly transitions?: readonly DefinitionTransition[] }
export interface DesignCandidateDocument {
  readonly [key: string]: unknown;
  readonly envelopeVersion: string; readonly artifactType: typeof SYSTEM_DEFINITION_ARTIFACT_TYPE;
  readonly artifactId: string; readonly artifactVersion: string;
  readonly schema: Readonly<{ id: string; version: string }>;
  readonly provenance: Readonly<Record<string, unknown>>;
  readonly payload: Readonly<Record<string, unknown> & { processes: readonly DefinitionProcess[]; actions: readonly Readonly<{ id: string }>[] }>;
}
export type CandidateFailure = "invalid-document" | "unsupported-version" | "required-extension" | "size-limit" | "depth-limit" | "unsafe-input" | "malformed-json" | "invalid-workflow" | "stale-revision" | "unknown-process" | "unknown-element" | "invalid-command" | "invalid-version";
export type CandidateResult<T> = Readonly<{ accepted: true } & T> | Readonly<{ accepted: false; reason: CandidateFailure }>;
export class CandidateAdmissionError extends Error { constructor(readonly reason: CandidateFailure) { super(reason); } }
function requireValue(value: unknown, reason: CandidateFailure = "invalid-document"): asserts value { if (!value) throw new CandidateAdmissionError(reason); }
const object = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === "object" && !Array.isArray(v);
const uri = (v: unknown): v is string => typeof v === "string" && /^[A-Za-z][A-Za-z0-9+.-]*:[^\s]+$/.test(v);
const semver = (v: unknown): v is string => typeof v === "string" && /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(?:-((?:0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/.test(v);
const namespace = (v: unknown): boolean => uri(v) || typeof v === "string" && /^[A-Za-z][A-Za-z0-9-]*(?:\.[A-Za-z0-9-]+)+$/.test(v);
export function candidateCanonicalText(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(candidateCanonicalText).join(",")}]`;
  if (object(v)) return `{${Object.keys(v).sort().map(k => `${JSON.stringify(k)}:${candidateCanonicalText(v[k])}`).join(",")}}`;
  return JSON.stringify(v);
}
function freeze<T>(v: T): T { if (v !== null && typeof v === "object") { Object.values(v).forEach(freeze); Object.freeze(v); } return v; }
export function assertCandidateJson(v: unknown, depth = 1, ancestors = new Set<object>()): void {
  requireValue(depth <= CANDIDATE_LIMITS.depth, "depth-limit");
  if (v !== null && typeof v === "object") {
    requireValue(!ancestors.has(v) && (Array.isArray(v) || [Object.prototype, null].includes(Object.getPrototypeOf(v))), "unsafe-input");
    requireValue(!Object.getOwnPropertySymbols(v).length, "unsafe-input"); ancestors.add(v);
    for (const [k, d] of Object.entries(Object.getOwnPropertyDescriptors(v))) {
      if (Array.isArray(v) && k === "length") continue;
      requireValue(!["__proto__", "prototype", "constructor"].includes(k) && d.enumerable && Object.hasOwn(d, "value"), "unsafe-input");
      assertCandidateJson(d.value as unknown, depth + 1, ancestors);
    }
    if (Array.isArray(v)) requireValue(Object.keys(v).length === v.length, "unsafe-input");
    ancestors.delete(v);
  } else requireValue(v === null || typeof v === "string" || typeof v === "boolean" || typeof v === "number" && Number.isFinite(v), "unsafe-input");
}
type Schema = Readonly<Record<string, unknown>>;
/** Deliberately limited to the checked-in SystemDefinition schema vocabulary, not a general JSON Schema engine. */
function matches(v: unknown, s: Schema): boolean {
  if (s.const !== undefined && candidateCanonicalText(v) !== candidateCanonicalText(s.const)) return false;
  if (Array.isArray(s.enum) && !s.enum.includes(v)) return false;
  const type = (t: unknown): boolean => t === "object" ? object(v) : t === "array" ? Array.isArray(v) : t === "integer" ? Number.isInteger(v) : typeof v === t;
  if (s.type !== undefined && !(Array.isArray(s.type) ? s.type.some(type) : type(s.type))) return false;
  if (object(s.not) && matches(v, s.not)) return false;
  if (Array.isArray(s.oneOf) && s.oneOf.filter(x => object(x) && matches(v, x)).length !== 1) return false;
  if (typeof v === "string") {
    if (typeof s.minLength === "number" && [...v].length < s.minLength) return false;
    if (typeof s.pattern === "string" && !new RegExp(s.pattern).test(v)) return false;
  }
  if (typeof v === "number" && (typeof s.minimum === "number" && v < s.minimum || typeof s.maximum === "number" && v > s.maximum)) return false;
  if (Array.isArray(v)) {
    if (typeof s.minItems === "number" && v.length < s.minItems) return false;
    if (s.uniqueItems && new Set(v.map(candidateCanonicalText)).size !== v.length) return false;
    if (object(s.items) && !v.every(x => matches(x, s.items as Schema))) return false;
  }
  if (object(v)) {
    if (Array.isArray(s.required) && !s.required.every(k => typeof k === "string" && Object.hasOwn(v, k))) return false;
    if (typeof s.minProperties === "number" && Object.keys(v).length < s.minProperties) return false;
    const props = object(s.properties) ? s.properties : {};
    for (const [k, child] of Object.entries(v)) {
      if (Object.hasOwn(props, k)) { if (!object(props[k]) || !matches(child, props[k])) return false; }
      else if (s.additionalProperties === false || object(s.additionalProperties) && !matches(child, s.additionalProperties)) return false;
    }
    if (object(s.dependentRequired)) for (const [k, deps] of Object.entries(s.dependentRequired)) {
      if (Object.hasOwn(v, k) && Array.isArray(deps) && !deps.every(d => typeof d === "string" && Object.hasOwn(v, d))) return false;
    }
  }
  return true;
}
function reference(v: unknown): void {
  requireValue(object(v) && typeof v.artifactType === "string" && /^\S+$/.test(v.artifactType) && uri(v.artifactId) && semver(v.artifactVersion));
  if (v.digest !== undefined) requireValue(object(v.digest) && Object.keys(v.digest).length === 2 && typeof v.digest.algorithm === "string" && /^[A-Za-z0-9._-]+$/.test(v.digest.algorithm) && typeof v.digest.value === "string" && v.digest.value.length > 0);
}
function workflowRules(payload: DesignCandidateDocument["payload"]): void {
  const processIds = new Set<string>(); const actionIds = new Set<string>();
  for (const a of payload.actions) { requireValue(!actionIds.has(a.id), "invalid-workflow"); actionIds.add(a.id); }
  for (const p of payload.processes) {
    requireValue(!processIds.has(p.id), "invalid-workflow"); processIds.add(p.id);
    const states = new Set(p.states); const transitions = p.transitions ?? [];
    requireValue(states.size === p.states.length, "invalid-workflow");
    requireValue(p.initialState === undefined || states.has(p.initialState), "invalid-workflow");
    const ids = new Set<string>();
    for (const t of transitions) {
      requireValue(!ids.has(t.id) && states.has(t.from) && states.has(t.to) && (t.actionRef === undefined || actionIds.has(t.actionRef)), "invalid-workflow"); ids.add(t.id);
    }
  }
}
export function encodeDesignCandidate(input: unknown): CandidateResult<{ document: DesignCandidateDocument; text: string }> {
  try {
    assertCandidateJson(input); requireValue(object(input));
    const keys = ["envelopeVersion", "artifactType", "artifactId", "artifactVersion", "schema", "provenance", "payload"];
    requireValue(keys.every(k => Object.hasOwn(input, k)) && semver(input.envelopeVersion) && semver(input.artifactVersion) && uri(input.artifactId));
    requireValue(input.envelopeVersion === "1.0.0", "unsupported-version");
    requireValue(Object.keys(input).every(k => [...keys, "extensions", "requiredExtensions"].includes(k)));
    requireValue(input.artifactType === SYSTEM_DEFINITION_ARTIFACT_TYPE && object(input.schema) && Object.keys(input.schema).length === 2);
    requireValue(input.schema.id === SYSTEM_DEFINITION_SCHEMA_ID && input.schema.version === SYSTEM_DEFINITION_SCHEMA_VERSION, "unsupported-version");
    if (input.requiredExtensions !== undefined) { requireValue(Array.isArray(input.requiredExtensions) && input.requiredExtensions.every(namespace)); requireValue(input.requiredExtensions.length === 0, "required-extension"); }
    if (input.extensions !== undefined) requireValue(object(input.extensions) && Object.keys(input.extensions).every(namespace));
    const p = input.provenance;
    requireValue(object(p) && typeof p.createdAt === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(p.createdAt) && Number.isFinite(Date.parse(p.createdAt)) && new Date(p.createdAt).toISOString().slice(0,19) === p.createdAt.slice(0,19) && object(p.producer) && typeof p.producer.id === "string" && /^\S+$/.test(p.producer.id) && semver(p.producer.version) && Array.isArray(p.inputs));
    p.inputs.forEach(reference);
    requireValue(matches(input.payload, systemDefinitionSchema));
    const text = candidateCanonicalText(input); requireValue(new TextEncoder().encode(text).length <= CANDIDATE_LIMITS.bytes, "size-limit");
    const document = JSON.parse(text) as DesignCandidateDocument; workflowRules(document.payload);
    return freeze({ accepted: true, document, text });
  } catch (e) { return Object.freeze({ accepted: false, reason: e instanceof CandidateAdmissionError ? e.reason : "invalid-document" }); }
}
export function decodeDesignCandidate(text: string): CandidateResult<{ document: DesignCandidateDocument; text: string }> {
  if (typeof text !== "string") return { accepted: false, reason: "malformed-json" };
  if (new TextEncoder().encode(text).length > CANDIDATE_LIMITS.bytes) return { accepted: false, reason: "size-limit" };
  try { return encodeDesignCandidate(JSON.parse(text)); } catch { return { accepted: false, reason: "malformed-json" }; }
}

export const DESIGN_CANDIDATE_PROTOCOL_VERSION = "1.0.0" as const;
export interface CandidateActor { readonly scopeRef: string; readonly actorRef: string; readonly actorRevisionRef: string }
export interface CandidateIdentity { readonly artifactId: string; readonly artifactVersion: string }
export interface SubmitCandidate extends CandidateActor { readonly commandRef: string; readonly expectedOwnerRevision: string | null; readonly candidate: DesignCandidateDocument }
export interface CandidateRecord extends CandidateIdentity { readonly scopeRef: string; readonly ownerRevision: string; readonly predecessorOwnerRevision: string | null; readonly text: string; readonly digest: string; readonly retainedAt: string }
export type OwnerRejection = "invalid-request" | "denied" | "stale-owner-revision" | "immutable-conflict" | "command-conflict";
export type CandidateReceipt = Readonly<{ status: "retained"; commandRef: string; record: CandidateRecord }> | Readonly<{ status: "rejected"; commandRef: string; reason: OwnerRejection }> | Readonly<{ status: "unknown"; commandRef: string; reason: "unavailable" }>;
export interface CandidateQuery extends CandidateActor, CandidateIdentity {}
export interface CandidateHeadQuery extends CandidateActor { readonly artifactId: string }
export interface CandidateResultQuery extends CandidateActor { readonly commandRef: string }
export type CandidateRead<T> = Readonly<{ status: "found"; value: T }> | Readonly<{ status: "absent" | "denied" | "unavailable" | "invalid-request" }>;
