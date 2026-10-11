import { systemDefinitionSchema, SYSTEM_DEFINITION_ARTIFACT_TYPE, SYSTEM_DEFINITION_SCHEMA_ID, SYSTEM_DEFINITION_SCHEMA_VERSION } from "@system-builder/contracts/system-definition";

export const WORKFLOW_LIMITS = Object.freeze({ bytes: 1_048_576, depth: 32, states: 64, transitions: 128, history: 50 });
export interface WorkflowTransition { readonly id: string; readonly from: string; readonly to: string; readonly actionRef?: string }
export interface WorkflowProcess { readonly id: string; readonly name: string; readonly requirementRefs: readonly string[]; readonly states: readonly string[]; readonly initialState?: string; readonly transitions?: readonly WorkflowTransition[] }
export interface WorkflowDocument {
  readonly [key: string]: unknown;
  readonly envelopeVersion: string; readonly artifactType: typeof SYSTEM_DEFINITION_ARTIFACT_TYPE;
  readonly artifactId: string; readonly artifactVersion: string;
  readonly schema: Readonly<{ id: string; version: string }>;
  readonly provenance: Readonly<Record<string, unknown>>;
  readonly payload: Readonly<Record<string, unknown> & { processes: readonly WorkflowProcess[]; actions: readonly Readonly<{ id: string }>[] }>;
}
export type WorkflowFailure = "invalid-document" | "unsupported-version" | "required-extension" | "size-limit" | "depth-limit" | "unsafe-input" | "malformed-json" | "invalid-workflow" | "stale-revision" | "unknown-process" | "unknown-element" | "invalid-command" | "invalid-version";
export type WorkflowResult<T> = Readonly<{ accepted: true } & T> | Readonly<{ accepted: false; reason: WorkflowFailure }>;
class Rejection extends Error { constructor(readonly reason: WorkflowFailure) { super(reason); } }
function requireValue(value: unknown, reason: WorkflowFailure = "invalid-document"): asserts value { if (!value) throw new Rejection(reason); }
const object = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === "object" && !Array.isArray(v);
const uri = (v: unknown): v is string => typeof v === "string" && /^[A-Za-z][A-Za-z0-9+.-]*:[^\s]+$/.test(v);
const semver = (v: unknown): v is string => typeof v === "string" && /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(?:-((?:0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/.test(v);
const namespace = (v: unknown): boolean => uri(v) || typeof v === "string" && /^[A-Za-z][A-Za-z0-9-]*(?:\.[A-Za-z0-9-]+)+$/.test(v);
export function workflowCanonicalText(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(workflowCanonicalText).join(",")}]`;
  if (object(v)) return `{${Object.keys(v).sort().map(k => `${JSON.stringify(k)}:${workflowCanonicalText(v[k])}`).join(",")}}`;
  return JSON.stringify(v);
}
function freeze<T>(v: T): T { if (v !== null && typeof v === "object") { Object.values(v).forEach(freeze); Object.freeze(v); } return v; }
function inspect(v: unknown, depth = 1, ancestors = new Set<object>()): void {
  requireValue(depth <= WORKFLOW_LIMITS.depth, "depth-limit");
  if (v !== null && typeof v === "object") {
    requireValue(!ancestors.has(v) && (Array.isArray(v) || [Object.prototype, null].includes(Object.getPrototypeOf(v))), "unsafe-input");
    requireValue(!Object.getOwnPropertySymbols(v).length, "unsafe-input"); ancestors.add(v);
    for (const [k, d] of Object.entries(Object.getOwnPropertyDescriptors(v))) {
      if (Array.isArray(v) && k === "length") continue;
      requireValue(!["__proto__", "prototype", "constructor"].includes(k) && d.enumerable && Object.hasOwn(d, "value"), "unsafe-input");
      inspect(d.value as unknown, depth + 1, ancestors);
    }
    if (Array.isArray(v)) requireValue(Object.keys(v).length === v.length, "unsafe-input");
    ancestors.delete(v);
  } else requireValue(v === null || typeof v === "string" || typeof v === "boolean" || typeof v === "number" && Number.isFinite(v), "unsafe-input");
}
type Schema = Readonly<Record<string, unknown>>;
/** Deliberately limited to the checked-in SystemDefinition schema vocabulary, not a general JSON Schema engine. */
function matches(v: unknown, s: Schema): boolean {
  if (s.const !== undefined && workflowCanonicalText(v) !== workflowCanonicalText(s.const)) return false;
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
    if (s.uniqueItems && new Set(v.map(workflowCanonicalText)).size !== v.length) return false;
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
function workflowRules(payload: WorkflowDocument["payload"]): void {
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
export function encodeWorkflow(input: unknown): WorkflowResult<{ document: WorkflowDocument; text: string }> {
  try {
    inspect(input); requireValue(object(input));
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
    const text = workflowCanonicalText(input); requireValue(new TextEncoder().encode(text).length <= WORKFLOW_LIMITS.bytes, "size-limit");
    const document = JSON.parse(text) as WorkflowDocument; workflowRules(document.payload);
    return freeze({ accepted: true, document, text });
  } catch (e) { return Object.freeze({ accepted: false, reason: e instanceof Rejection ? e.reason : "invalid-document" }); }
}
export function decodeWorkflow(text: string): WorkflowResult<{ document: WorkflowDocument; text: string }> {
  if (typeof text !== "string") return { accepted: false, reason: "malformed-json" };
  if (new TextEncoder().encode(text).length > WORKFLOW_LIMITS.bytes) return { accepted: false, reason: "size-limit" };
  try { return encodeWorkflow(JSON.parse(text)); } catch { return { accepted: false, reason: "malformed-json" }; }
}
export interface WorkflowStarter { readonly artifactId: string; readonly createdAt: string; readonly analysisRef: string; readonly recipeRef: string; readonly process: WorkflowProcess }
export function createWorkflow(input: WorkflowStarter): ReturnType<typeof encodeWorkflow> {
  return encodeWorkflow({ envelopeVersion: "1.0.0", artifactType: SYSTEM_DEFINITION_ARTIFACT_TYPE, artifactId: input.artifactId, artifactVersion: "1.0.0",
    schema: { id: SYSTEM_DEFINITION_SCHEMA_ID, version: SYSTEM_DEFINITION_SCHEMA_VERSION },
    provenance: { createdAt: input.createdAt, producer: { id: "urn:system-builder:station:workflow-studio", version: "1.0.0" }, inputs: [] },
    payload: { definition: "SystemDefinition", analysisRef: input.analysisRef, recipeRef: input.recipeRef, entities: [], processes: [input.process], actions: [], capabilities: [], views: [], permissions: [], policies: [], integrations: [], environmentRequirements: [] } });
}
export function isWorkflowProcessEditable(p: WorkflowProcess): boolean { return p.states.length <= WORKFLOW_LIMITS.states && (p.transitions?.length ?? 0) <= WORKFLOW_LIMITS.transitions; }
export interface WorkflowSession { readonly base: WorkflowDocument; readonly document: WorkflowDocument; readonly revision: number; readonly past: readonly WorkflowDocument[]; readonly future: readonly WorkflowDocument[]; readonly dirty: boolean; readonly upstreamStatus: "unresolved" }
export function openWorkflow(input: unknown): WorkflowResult<{ session: WorkflowSession }> {
  const r = encodeWorkflow(input); return r.accepted ? freeze({ accepted: true, session: { base: r.document, document: r.document, revision: 0, past: [], future: [], dirty: false, upstreamStatus: "unresolved" } }) : r;
}
export type WorkflowCommand =
  | Readonly<{ kind: "add-process"; process: WorkflowProcess }>
  | Readonly<{ kind: "add-state" | "remove-state" | "set-initial"; processId: string; state: string }>
  | Readonly<{ kind: "add-transition" | "edit-transition"; processId: string; transition: WorkflowTransition }>
  | Readonly<{ kind: "remove-transition"; processId: string; transitionId: string }>
  | Readonly<{ kind: "undo" | "redo" }>;
function newSession(s: WorkflowSession, document: WorkflowDocument, past: readonly WorkflowDocument[], future: readonly WorkflowDocument[]): WorkflowSession {
  return freeze({ ...s, document, revision: s.revision + 1, past, future, dirty: workflowCanonicalText(document) !== workflowCanonicalText(s.base) });
}
export function applyWorkflowCommand(s: WorkflowSession, expectedRevision: number, command: WorkflowCommand): WorkflowResult<{ session: WorkflowSession; changed: boolean }> {
  try {
    requireValue(expectedRevision === s.revision, "stale-revision"); inspect(command);
    if (command.kind === "undo" || command.kind === "redo") {
      const source = command.kind === "undo" ? s.past : s.future; const document = source.at(-1);
      if (!document) return { accepted: true, session: s, changed: false };
      const past = command.kind === "undo" ? s.past.slice(0,-1) : [...s.past, s.document].slice(-WORKFLOW_LIMITS.history);
      const future = command.kind === "redo" ? s.future.slice(0,-1) : [...s.future, s.document].slice(-WORKFLOW_LIMITS.history);
      return { accepted: true, session: newSession(s, document, past, future), changed: true };
    }
    const draft = JSON.parse(workflowCanonicalText(s.document)) as { payload: { processes: { id: string; name: string; requirementRefs: string[]; states: string[]; initialState?: string; transitions?: WorkflowTransition[] }[] } };
    if (command.kind === "add-process") draft.payload.processes.push(JSON.parse(workflowCanonicalText(command.process)) as typeof draft.payload.processes[number]);
    else {
      requireValue("processId" in command, "invalid-command");
      const p = draft.payload.processes.find(p => p.id === command.processId); requireValue(p, "unknown-process"); requireValue(isWorkflowProcessEditable(p), "invalid-workflow");
      if (command.kind === "add-state") p.states.push(command.state);
      else if (command.kind === "remove-state") { requireValue(p.states.includes(command.state), "unknown-element"); p.states = p.states.filter(v => v !== command.state); }
      else if (command.kind === "set-initial") p.initialState = command.state;
      else if (command.kind === "add-transition") p.transitions = [...(p.transitions ?? []), command.transition];
      else if (command.kind === "edit-transition") { const i = p.transitions?.findIndex(t => t.id === command.transition.id) ?? -1; requireValue(i >= 0 && p.transitions, "unknown-element"); p.transitions[i] = command.transition; }
      else if (command.kind === "remove-transition") { const transitions = p.transitions; requireValue(transitions && transitions.some(t => t.id === command.transitionId), "unknown-element"); p.transitions = transitions.filter(t => t.id !== command.transitionId); if (!p.transitions.length) delete p.transitions; }
      else throw new Rejection("invalid-command");
    }
    const r = encodeWorkflow(draft); if (!r.accepted) return r;
    const editedId = command.kind === "add-process" ? command.process.id : "processId" in command ? command.processId : "";
    requireValue(isWorkflowProcessEditable(r.document.payload.processes.find(p => p.id === editedId)!), "invalid-workflow");
    if (r.text === workflowCanonicalText(s.document)) return { accepted: true, session: s, changed: false };
    return { accepted: true, session: newSession(s, r.document, [...s.past, s.document].slice(-WORKFLOW_LIMITS.history), []), changed: true };
  } catch (e) { return { accepted: false, reason: e instanceof Rejection ? e.reason : "invalid-command" }; }
}
export function materializeWorkflow(s: WorkflowSession, expectedRevision: number, artifactVersion: string, createdAt: string): ReturnType<typeof encodeWorkflow> {
  if (expectedRevision !== s.revision) return { accepted: false, reason: "stale-revision" };
  if (!semver(artifactVersion) || artifactVersion === s.base.artifactVersion) return { accepted: false, reason: "invalid-version" };
  const inputs = s.document.provenance.inputs as readonly unknown[];
  return encodeWorkflow({ ...s.document, artifactVersion, provenance: { ...s.document.provenance, createdAt,
    producer: { ...(s.document.provenance.producer as Record<string, unknown>), id: "urn:system-builder:station:workflow-studio", version: "1.0.0" },
    inputs: [...inputs, { artifactType: s.base.artifactType, artifactId: s.base.artifactId, artifactVersion: s.base.artifactVersion }] } });
}
export function workflowSelectionKey(document: WorkflowDocument, processId: string, kind: "state" | "transition", id: string): string {
  return JSON.stringify([document.artifactType, document.artifactId, document.artifactVersion, processId, kind, id]);
}
export function compareWorkflows(a: WorkflowDocument, b: WorkflowDocument): Readonly<{ same: boolean; processesChanged: boolean; baseVersion: string; candidateVersion: string }> {
  return Object.freeze({ same: workflowCanonicalText(a) === workflowCanonicalText(b), processesChanged: workflowCanonicalText(a.payload.processes) !== workflowCanonicalText(b.payload.processes), baseVersion: a.artifactVersion, candidateVersion: b.artifactVersion });
}
