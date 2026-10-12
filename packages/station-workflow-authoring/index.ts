import { SYSTEM_DEFINITION_ARTIFACT_TYPE, SYSTEM_DEFINITION_SCHEMA_ID, SYSTEM_DEFINITION_SCHEMA_VERSION } from "@system-builder/contracts/system-definition";
import { CANDIDATE_LIMITS, CandidateAdmissionError as Rejection, assertCandidateJson as inspect, encodeDesignCandidate as encodeWorkflow, decodeDesignCandidate as decodeWorkflow, candidateCanonicalText as workflowCanonicalText, type CandidateFailure as WorkflowFailure, type CandidateResult as WorkflowResult, type DesignCandidateDocument as WorkflowDocument, type DefinitionProcess as WorkflowProcess, type DefinitionTransition as WorkflowTransition } from "@system-builder/contracts/design-candidate";
export { encodeWorkflow, decodeWorkflow, workflowCanonicalText };
export type { WorkflowFailure, WorkflowResult, WorkflowDocument, WorkflowProcess, WorkflowTransition };
export const WORKFLOW_LIMITS = Object.freeze({ ...CANDIDATE_LIMITS, states: 64, transitions: 128, history: 50 });
function requireValue(value: unknown, reason: WorkflowFailure = "invalid-document"): asserts value { if (!value) throw new Rejection(reason); }
const semver = (v: unknown): v is string => typeof v === "string" && /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(?:-((?:0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/.test(v);

function freeze<T>(v: T): T { if (v !== null && typeof v === "object") { Object.values(v).forEach(freeze); Object.freeze(v); } return v; }
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
