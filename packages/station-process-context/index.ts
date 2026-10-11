import { normalizeProcessRevisionIdentity, type ProcessRevisionIdentity } from "@system-builder/contracts/process-versioning";

export const PROCESS_CONTEXT_TYPE = "urn:system-builder:station:process-context";
export const PROCESS_CONTEXT_SCHEMA = PROCESS_CONTEXT_TYPE + ":payload";
export const PROCESS_CONTEXT_LIMITS = Object.freeze({ bytes: 1_048_576, depth: 32, views: 16, ref: 256, title: 80 });
export interface CompositionReference {
  readonly artifactType: "urn:system-builder:station:composition";
  readonly artifactId: string; readonly artifactVersion: string;
}
export interface ProcessContextView {
  readonly ref: string; readonly title: string; readonly composition: CompositionReference;
}
export interface ProcessContextDocument {
  readonly [key: string]: unknown;
  readonly envelopeVersion: string; readonly artifactType: typeof PROCESS_CONTEXT_TYPE;
  readonly artifactId: string; readonly artifactVersion: string;
  readonly schema: Readonly<{ id: string; version: string }>;
  readonly provenance: Readonly<Record<string, unknown>>;
  readonly payload: Readonly<{ processRevision: ProcessRevisionIdentity; title: string; views: readonly ProcessContextView[] }>;
}
export type ContextFailure = "invalid-context" | "unsupported-version" | "required-extension" | "size-limit" | "depth-limit" | "unsafe-key" | "malformed-json";
export type ContextResult = { readonly accepted: true; readonly document: ProcessContextDocument; readonly text: string } |
  { readonly accepted: false; readonly reason: ContextFailure };
class Rejection extends Error { constructor(readonly reason: ContextFailure) { super(reason); } }
function requireValue(value: unknown, reason: ContextFailure = "invalid-context"): asserts value {
  if (!value) throw new Rejection(reason);
}
const object = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === "object" && !Array.isArray(v);
const uri = (v: unknown): v is string => typeof v === "string" && /^[A-Za-z][A-Za-z0-9+.-]*:[^\s]+$/.test(v);
const namespace = (v: unknown): v is string => uri(v) || typeof v === "string" && /^[A-Za-z][A-Za-z0-9-]*(?:\.[A-Za-z0-9-]+)+$/.test(v);
const semver = (v: unknown): v is string => typeof v === "string" && /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(?:-((?:0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/.test(v);
function bounded(v: unknown, limit: number): asserts v is string {
  requireValue(typeof v === "string" && v === v.trim() && [...v].length > 0 && [...v].length <= limit && !/\p{Cc}|\p{Cs}/u.test(v));
}
function exact(v: unknown, names: readonly string[]): asserts v is Record<string, unknown> {
  requireValue(object(v) && Object.keys(v).length === names.length && names.every(key => Object.hasOwn(v, key)));
}
function canonical(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(canonical).join(",")}]`;
  if (object(v)) return `{${Object.keys(v).sort().map(key => `${JSON.stringify(key)}:${canonical(v[key])}`).join(",")}}`;
  return JSON.stringify(v);
}
function freeze<T>(v: T): T {
  if (v !== null && typeof v === "object") { for (const child of Object.values(v)) freeze(child); Object.freeze(v); }
  return v;
}
/** Reject cycles/accessors/prototypes/non-JSON/unsafe keys before reading values recursively. */
function inspect(input: unknown): void {
  const pending = [{ value: input, depth: 1 }]; const seen = new Set<object>();
  while (pending.length) {
    const { value, depth } = pending.pop()!;
    if (value !== null && typeof value === "object") {
      requireValue(depth <= PROCESS_CONTEXT_LIMITS.depth, "depth-limit");
      requireValue(!seen.has(value)); seen.add(value);
      requireValue(Array.isArray(value) || [Object.prototype, null].includes(Object.getPrototypeOf(value)));
      requireValue(Object.getOwnPropertySymbols(value).length === 0);
      for (const [key, d] of Object.entries(Object.getOwnPropertyDescriptors(value))) {
        if (Array.isArray(value) && key === "length") continue;
        requireValue(!["__proto__", "prototype", "constructor"].includes(key), "unsafe-key");
        requireValue(d.enumerable && Object.hasOwn(d, "value"));
        pending.push({ value: d.value as unknown, depth: depth + 1 });
      }
      if (Array.isArray(value)) requireValue(Object.keys(value).length === value.length);
    } else requireValue(value === null || typeof value === "string" || typeof value === "boolean" || typeof value === "number" && Number.isFinite(value));
  }
}
function reference(v: unknown): void {
  requireValue(object(v) && uri(v.artifactType) && uri(v.artifactId) && semver(v.artifactVersion));
  if (v.digest !== undefined) {
    exact(v.digest, ["algorithm", "value"]);
    requireValue(typeof v.digest.algorithm === "string" && /^[A-Za-z0-9._-]+$/.test(v.digest.algorithm) && typeof v.digest.value === "string" && v.digest.value.length > 0);
  }
}
export function encodeProcessContext(input: unknown): ContextResult {
  try {
    inspect(input); requireValue(object(input));
    const required = ["envelopeVersion", "artifactType", "artifactId", "artifactVersion", "schema", "provenance", "payload"];
    requireValue(required.every(key => Object.hasOwn(input, key)) && semver(input.envelopeVersion) && semver(input.artifactVersion) && uri(input.artifactId));
    requireValue(input.envelopeVersion.split(".")[0] === "1", "unsupported-version");
    if (input.envelopeVersion.split(/[+-]/)[0] === "1.0.0") requireValue(Object.keys(input).every(key => [...required, "extensions", "requiredExtensions"].includes(key)));
    requireValue(input.artifactType === PROCESS_CONTEXT_TYPE);
    exact(input.schema, ["id", "version"]);
    requireValue(input.schema.id === PROCESS_CONTEXT_SCHEMA && input.schema.version === "1.0.0", "unsupported-version");
    if (input.requiredExtensions !== undefined) {
      requireValue(Array.isArray(input.requiredExtensions) && input.requiredExtensions.every(namespace) && new Set(input.requiredExtensions).size === input.requiredExtensions.length);
      requireValue(input.requiredExtensions.length === 0, "required-extension");
    }
    if (input.extensions !== undefined) requireValue(object(input.extensions) && Object.keys(input.extensions).every(namespace));
    const p = input.provenance;
    requireValue(object(p) && typeof p.createdAt === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(p.createdAt) && Number.isFinite(Date.parse(p.createdAt)) && new Date(p.createdAt).toISOString().slice(0,19) === p.createdAt.slice(0,19) && object(p.producer) && uri(p.producer.id) && semver(p.producer.version) && Array.isArray(p.inputs));
    p.inputs.forEach(reference);
    exact(input.payload, ["processRevision", "title", "views"]);
    const payload = input.payload;
    const anchor = normalizeProcessRevisionIdentity(payload.processRevision);
    bounded(anchor.artifactRef, PROCESS_CONTEXT_LIMITS.ref); bounded(anchor.revisionRef, PROCESS_CONTEXT_LIMITS.ref);
    requireValue(anchor.artifactRef === (payload.processRevision as ProcessRevisionIdentity).artifactRef && anchor.revisionRef === (payload.processRevision as ProcessRevisionIdentity).revisionRef);
    if (anchor.previousRevisionRef !== null) { bounded(anchor.previousRevisionRef, PROCESS_CONTEXT_LIMITS.ref); requireValue(anchor.previousRevisionRef === (payload.processRevision as ProcessRevisionIdentity).previousRevisionRef); }
    bounded(payload.title, PROCESS_CONTEXT_LIMITS.title);
    requireValue(Array.isArray(payload.views) && payload.views.length <= PROCESS_CONTEXT_LIMITS.views);
    const refs = new Set<string>();
    for (const v of payload.views) {
      exact(v, ["ref", "title", "composition"]); bounded(v.ref, PROCESS_CONTEXT_LIMITS.ref); bounded(v.title, PROCESS_CONTEXT_LIMITS.title);
      requireValue(!refs.has(v.ref)); refs.add(v.ref);
      exact(v.composition, ["artifactType", "artifactId", "artifactVersion"]); reference(v.composition);
      requireValue(v.composition.artifactType === "urn:system-builder:station:composition");
      bounded(v.composition.artifactId, PROCESS_CONTEXT_LIMITS.ref);
    }
    const text = canonical(input);
    requireValue(new TextEncoder().encode(text).length <= PROCESS_CONTEXT_LIMITS.bytes, "size-limit");
    return Object.freeze({ accepted: true, document: freeze(JSON.parse(text) as ProcessContextDocument), text });
  } catch (error) { return Object.freeze({ accepted: false, reason: error instanceof Rejection ? error.reason : "invalid-context" }); }
}
export function decodeProcessContext(text: string): ContextResult {
  try {
    requireValue(typeof text === "string", "malformed-json");
    requireValue(new TextEncoder().encode(text).length <= PROCESS_CONTEXT_LIMITS.bytes, "size-limit");
    let depth = 0, quoted = false, escaped = false;
    for (const c of text) {
      if (quoted) { if (escaped) escaped = false; else if (c === "\\") escaped = true; else if (c === '"') quoted = false; }
      else if (c === '"') quoted = true;
      else if (c === "{" || c === "[") { depth++; requireValue(depth <= PROCESS_CONTEXT_LIMITS.depth, "depth-limit"); }
      else if (c === "}" || c === "]") depth--;
    }
    let input: unknown; try { input = JSON.parse(text); } catch { throw new Rejection("malformed-json"); }
    return encodeProcessContext(input);
  } catch (error) { return { accepted: false, reason: error instanceof Rejection ? error.reason : "malformed-json" }; }
}
export interface ContextMetadata { readonly artifactId: string; readonly createdAt: string }
/** New context identity, without publishing or changing the referenced process. */
export function createProcessContext(processRevision: ProcessRevisionIdentity, title: string, views: readonly ProcessContextView[], metadata: ContextMetadata): ContextResult {
  return encodeProcessContext({ envelopeVersion: "1.0.0", artifactType: PROCESS_CONTEXT_TYPE,
    artifactId: metadata.artifactId, artifactVersion: "1.0.0", schema: { id: PROCESS_CONTEXT_SCHEMA, version: "1.0.0" },
    provenance: { createdAt: metadata.createdAt, producer: { id: "urn:system-builder:station", version: "1.0.0" }, inputs: views.map(v => ({ ...v.composition })) },
    payload: { processRevision, title, views } });
}
export type ProcessResolution = Readonly<{ status: "available"; processRevision: ProcessRevisionIdentity }> |
  Readonly<{ status: "missing" | "stale" | "unavailable" | "invalid" }>;
export type ProcessOwnerAdapter = (reference: ProcessRevisionIdentity) => ProcessResolution;
/** Syntax validation is not proof of availability. A response must match the entire anchor. */
export function resolveProcessAnchor(reference: ProcessRevisionIdentity, owner?: ProcessOwnerAdapter): ProcessResolution {
  try {
    const anchor = normalizeProcessRevisionIdentity(reference);
    if (!owner) return Object.freeze({ status: "unavailable" });
    const result = owner(anchor);
    if (!object(result)) return Object.freeze({ status: "invalid" });
    if (result.status === "available") {
      const returned = normalizeProcessRevisionIdentity(result.processRevision);
      return canonical(returned) === canonical(anchor) ? Object.freeze({ status: "available", processRevision: returned }) : Object.freeze({ status: "stale" });
    }
    return ["missing", "stale", "unavailable", "invalid"].includes(result.status) ? Object.freeze({ status: result.status }) : Object.freeze({ status: "invalid" });
  } catch { return Object.freeze({ status: "unavailable" }); }
}
