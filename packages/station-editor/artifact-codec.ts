import { validateCompositionGraph, type ComponentRegistry, type CompositionGraph } from "@system-builder/station-composition";

export const COMPOSITION_ARTIFACT_TYPE = "urn:system-builder:station:composition";
export const COMPOSITION_PAYLOAD_SCHEMA = "urn:system-builder:station:composition:payload";
export const ARTIFACT_LIMITS = Object.freeze({ bytes: 1_048_576, nodes: 256, depth: 32, token: 256 });
export interface ArtifactSource {
  readonly applicationRef: string; readonly compositionRef: string; readonly revision: number;
  readonly composition: CompositionGraph; readonly registry: ComponentRegistry;
}
export type ArtifactSourceResolver = (ref: string) => ArtifactSource | null;
export interface CompositionArtifact {
  readonly [key: string]: unknown;
  readonly envelopeVersion: string; readonly artifactType: string; readonly artifactId: string;
  readonly artifactVersion: string; readonly schema: Readonly<{ id: string; version: string }>;
  readonly provenance: Readonly<Record<string, unknown>>;
  readonly payload: Readonly<{ applicationRef: string; compositionRef: string; baseRevision: number; graph: CompositionGraph }>;
}
export type ArtifactFailure = "malformed-json" | "size-limit" | "depth-limit" | "node-limit" | "token-limit" |
  "unsafe-key" | "invalid-envelope" | "unsupported-version" | "required-extension" | "invalid-payload" |
  "unknown-composition" | "identity-mismatch" | "revision-mismatch" | "invalid-graph" | "incompatible-source";
export type ArtifactResult =
  | { readonly accepted: true; readonly document: CompositionArtifact; readonly text: string }
  | { readonly accepted: false; readonly reason: ArtifactFailure };
export interface ArtifactMetadata {
  readonly artifactId: string; readonly artifactVersion: string;
  readonly provenance: Readonly<Record<string, unknown>>;
  readonly extensions?: Readonly<Record<string, unknown>>;
}
class Rejection extends Error { constructor(readonly reason: ArtifactFailure) { super(reason); } }
function requireValue(condition: unknown, reason: ArtifactFailure): asserts condition {
  if (!condition) throw new Rejection(reason);
}
function object(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function keys(value: unknown, required: readonly string[], optional: readonly string[] = []): asserts value is Record<string, unknown> {
  requireValue(object(value) && required.every(key => Object.hasOwn(value, key)) &&
    Object.keys(value).every(key => required.includes(key) || optional.includes(key)), "invalid-payload");
}
const semver = /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(?:-((?:0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
const uri = /^[A-Za-z][A-Za-z0-9+.-]*:[^\s]+$/;
function version(value: unknown): value is string { return typeof value === "string" && semver.test(value); }
function nonblank(value: unknown): value is string { return typeof value === "string" && /^\S+$/.test(value); }
function token(value: unknown): asserts value is string {
  requireValue(nonblank(value), "invalid-graph");
  requireValue([...value].length <= ARTIFACT_LIMITS.token, "token-limit");
}
function freeze<T>(value: T): T {
  if (typeof value === "object" && value !== null) {
    for (const child of Object.values(value)) freeze(child);
    Object.freeze(value);
  }
  return value;
}
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (object(value)) return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
  return JSON.stringify(value);
}
/** Validate inert JSON iteratively before recursive canonicalization/copying. */
function inspect(value: unknown): void {
  const pending: { value: unknown; depth: number }[] = [{ value, depth: 1 }];
  const seen = new Set<object>();
  while (pending.length) {
    const item = pending.pop()!;
    const current = item.value;
    if (typeof current === "object" && current !== null) {
      requireValue(item.depth <= ARTIFACT_LIMITS.depth, "depth-limit");
      requireValue(!seen.has(current), "invalid-envelope"); seen.add(current);
      requireValue(Array.isArray(current) || Object.getPrototypeOf(current) === Object.prototype || Object.getPrototypeOf(current) === null, "invalid-envelope");
      const descriptors = Object.getOwnPropertyDescriptors(current);
      requireValue(Object.getOwnPropertySymbols(current).length === 0, "invalid-envelope");
      for (const [key, descriptor] of Object.entries(descriptors)) {
        if (Array.isArray(current) && key === "length") continue;
        requireValue(!["__proto__", "prototype", "constructor"].includes(key), "unsafe-key");
        requireValue(descriptor.enumerable && Object.hasOwn(descriptor, "value"), "invalid-envelope");
        pending.push({ value: descriptor.value as unknown, depth: item.depth + 1 });
      }
      if (Array.isArray(current)) requireValue(Object.keys(current).length === current.length, "invalid-envelope");
    } else requireValue(current === null || typeof current === "string" || typeof current === "boolean" ||
      (typeof current === "number" && Number.isFinite(current)), "invalid-envelope");
  }
}
function checkEnvelope(input: unknown): asserts input is CompositionArtifact {
  requireValue(object(input), "invalid-envelope");
  requireValue(["envelopeVersion", "artifactType", "artifactId", "artifactVersion", "schema", "provenance", "payload"].every(key => Object.hasOwn(input, key)), "invalid-envelope");
  requireValue(version(input.envelopeVersion) && version(input.artifactVersion) && typeof input.artifactId === "string" && uri.test(input.artifactId), "invalid-envelope");
  requireValue(input.envelopeVersion.split(".")[0] === "1", "unsupported-version");
  const baseVersion = input.envelopeVersion.split(/[+-]/)[0];
  if (baseVersion === "1.0.0") requireValue(Object.keys(input).every(key =>
    ["envelopeVersion", "artifactType", "artifactId", "artifactVersion", "schema", "provenance", "payload", "requiredExtensions", "extensions"].includes(key)), "invalid-envelope");
  requireValue(input.artifactType === COMPOSITION_ARTIFACT_TYPE, "invalid-envelope");
  requireValue(object(input.schema) && Object.keys(input.schema).length === 2 &&
    input.schema.id === COMPOSITION_PAYLOAD_SCHEMA && ["1.0.0", "2.0.0"].includes(input.schema.version as string), "unsupported-version");
  if (input.requiredExtensions !== undefined) {
    requireValue(Array.isArray(input.requiredExtensions) && input.requiredExtensions.every(nonblank) &&
      new Set(input.requiredExtensions).size === input.requiredExtensions.length, "invalid-envelope");
    requireValue(input.requiredExtensions.length === 0, "required-extension");
  }
  if (input.extensions !== undefined) requireValue(object(input.extensions), "invalid-envelope");
  const p = input.provenance;
  requireValue(object(p) && typeof p.createdAt === "string" &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(p.createdAt) && Number.isFinite(Date.parse(p.createdAt)) &&
    new Date(p.createdAt).toISOString().slice(0, 19) === p.createdAt.slice(0, 19) &&
    object(p.producer) && nonblank(p.producer.id) && version(p.producer.version) && Array.isArray(p.inputs), "invalid-envelope");
  for (const reference of p.inputs) {
    requireValue(object(reference) && nonblank(reference.artifactType) && typeof reference.artifactId === "string" &&
      uri.test(reference.artifactId) && version(reference.artifactVersion), "invalid-envelope");
    if (reference.digest !== undefined) requireValue(object(reference.digest) &&
      Object.keys(reference.digest).length === 2 && typeof reference.digest.algorithm === "string" &&
      /^[A-Za-z0-9._-]+$/.test(reference.digest.algorithm) && typeof reference.digest.value === "string" && reference.digest.value.length > 0, "invalid-envelope");
  }
}
function checkGraph(value: unknown, source: ArtifactSource, schemaVersion: string): asserts value is CompositionGraph {
  keys(value, ["rootRef", "nodes"]); token(value.rootRef);
  requireValue(Array.isArray(value.nodes) && value.nodes.length > 0, "invalid-graph");
  requireValue(value.nodes.length <= ARTIFACT_LIMITS.nodes, "node-limit");
  const nodes = new Map<string, Record<string, unknown>>();
  const occupancy = new Map<string, number>(); const parentCount = new Map<string, number>();
  for (const node of value.nodes) {
    keys(node, ["ref", "componentRef"], ["placement"]); token(node.ref); token(node.componentRef);
    requireValue(!nodes.has(node.ref), "invalid-graph"); nodes.set(node.ref, node);
    requireValue(source.registry.get(node.componentRef), "invalid-graph");
    if (node.placement !== undefined) {
      keys(node.placement, ["parentRef", "slotRef", "columnSpan", "rowSpan"]);
      token(node.placement.parentRef); token(node.placement.slotRef);
      requireValue(Number.isSafeInteger(node.placement.columnSpan) && Number.isSafeInteger(node.placement.rowSpan), "invalid-graph");
    }
  }
  const root = nodes.get(value.rootRef);
  requireValue(root && root.placement === undefined, "invalid-graph");
  for (const node of nodes.values()) {
    if (node.ref === value.rootRef) continue;
    requireValue(object(node.placement), "invalid-graph");
    const placement = node.placement;
    const parent = nodes.get(placement.parentRef as string);
    requireValue(parent, "invalid-graph");
    const descriptor = source.registry.get(parent.componentRef as string)!;
    const slot = descriptor.slots.find(item => item.id === placement.slotRef);
    requireValue(slot, "invalid-graph");
    const slotKey = JSON.stringify([placement.parentRef, placement.slotRef]);
    occupancy.set(slotKey, (occupancy.get(slotKey) ?? 0) + 1);
    parentCount.set(placement.parentRef as string, (parentCount.get(placement.parentRef as string) ?? 0) + 1);
    requireValue(slot.childPolicy !== "single" || occupancy.get(slotKey) === 1, "invalid-graph");
    requireValue(descriptor.childPolicy !== "single" || parentCount.get(placement.parentRef as string) === 1, "invalid-graph");
    let cursor = node; const visited = new Set<unknown>();
    while (cursor.ref !== value.rootRef) {
      requireValue(!visited.has(cursor.ref), "invalid-graph"); visited.add(cursor.ref);
      requireValue(object(cursor.placement), "invalid-graph");
      const next = nodes.get(cursor.placement.parentRef as string); requireValue(next, "invalid-graph"); cursor = next;
    }
  }
  requireValue(validateCompositionGraph(value as unknown as CompositionGraph, source.registry).length === 0, "invalid-graph");
  const sourceRoot = source.composition.nodes.find(node => node.ref === source.composition.rootRef);
  requireValue(value.rootRef === source.composition.rootRef && root.componentRef === sourceRoot?.componentRef, "incompatible-source");
  if (schemaVersion === "2.0.0") return;
  requireValue(value.nodes.length === source.composition.nodes.length, "incompatible-source");
  value.nodes.forEach((node: Record<string, unknown>, index: number) => {
    const expected = source.composition.nodes[index]!;
    requireValue(node.ref === expected.ref && node.componentRef === expected.componentRef, "incompatible-source");
    const placement = node.placement as Record<string, unknown> | undefined;
    requireValue(expected.placement ? placement && placement.parentRef === expected.placement.parentRef && placement.slotRef === expected.placement.slotRef : placement === undefined, "incompatible-source");
  });
}
function validate(input: unknown, resolve: ArtifactSourceResolver): ArtifactResult {
  try {
    inspect(input); checkEnvelope(input);
    keys(input.payload, ["applicationRef", "compositionRef", "baseRevision", "graph"]);
    const payload = input.payload;
    requireValue(nonblank(payload.applicationRef) && nonblank(payload.compositionRef), "invalid-payload");
    const source = resolve(payload.compositionRef); requireValue(source, "unknown-composition");
    requireValue(payload.applicationRef === source.applicationRef && payload.compositionRef === source.compositionRef, "identity-mismatch");
    requireValue(Number.isSafeInteger(payload.baseRevision) && payload.baseRevision >= 0 && payload.baseRevision === source.revision, "revision-mismatch");
    checkGraph(payload.graph, source, input.schema.version);
    const text = canonical(input);
    requireValue(new TextEncoder().encode(text).length <= ARTIFACT_LIMITS.bytes, "size-limit");
    return Object.freeze({ accepted: true, document: freeze(JSON.parse(text) as CompositionArtifact), text });
  } catch (error) { return Object.freeze({ accepted: false, reason: error instanceof Rejection ? error.reason : "invalid-envelope" }); }
}
/** Re-emit a validated document without losing inert compatible metadata. */
export function encodeCompositionArtifact(document: unknown, resolve: ArtifactSourceResolver): ArtifactResult { return validate(document, resolve); }
export function createCompositionArtifact(graph: CompositionGraph, source: ArtifactSource, metadata: ArtifactMetadata): ArtifactResult {
  return validate({ envelopeVersion: "1.0.0", artifactType: COMPOSITION_ARTIFACT_TYPE,
    artifactId: metadata.artifactId, artifactVersion: metadata.artifactVersion,
    schema: { id: COMPOSITION_PAYLOAD_SCHEMA, version: compositionPayloadVersion(graph, source) }, provenance: metadata.provenance,
    ...(metadata.extensions === undefined ? {} : { extensions: metadata.extensions }),
    payload: { applicationRef: source.applicationRef, compositionRef: source.compositionRef, baseRevision: source.revision, graph } },
  ref => ref === source.compositionRef ? source : null);
}
export function decodeCompositionArtifact(text: string, resolve: ArtifactSourceResolver): ArtifactResult {
  try {
    requireValue(typeof text === "string", "malformed-json");
    requireValue(new TextEncoder().encode(text).length <= ARTIFACT_LIMITS.bytes, "size-limit");
    let depth = 0; let quoted = false; let escaped = false;
    for (const character of text) {
      if (quoted) { if (escaped) escaped = false; else if (character === "\\") escaped = true; else if (character === '"') quoted = false; }
      else if (character === '"') quoted = true;
      else if (character === "{" || character === "[") { depth++; requireValue(depth <= ARTIFACT_LIMITS.depth, "depth-limit"); }
      else if (character === "}" || character === "]") depth--;
    }
    let input: unknown;
    try { input = JSON.parse(text) as unknown; } catch { throw new Rejection("malformed-json"); }
    return validate(input, resolve);
  } catch (error) { return Object.freeze({ accepted: false, reason: error instanceof Rejection ? error.reason : "malformed-json" }); }
}

/** Choose a payload major explicitly; envelope/version metadata remains caller-owned. */
export function compositionPayloadVersion(graph: CompositionGraph, source: ArtifactSource): "1.0.0" | "2.0.0" {
  const original = source.composition;
  return graph.rootRef === original.rootRef && graph.nodes.length === original.nodes.length &&
    graph.nodes.every((node, index) => {
      const expected = original.nodes[index]!;
      return node.ref === expected.ref && node.componentRef === expected.componentRef &&
        node.placement?.parentRef === expected.placement?.parentRef && node.placement?.slotRef === expected.placement?.slotRef;
    }) ? "1.0.0" : "2.0.0";
}
