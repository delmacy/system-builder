import {
  applyCompositionDraftMutation,
  createCompositionDraftTransaction,
  type ComponentRegistry,
  type CompositionDraftMutation,
  type CompositionDraftTransaction,
  type CompositionGraph,
} from "../station-composition/index.js";

export type EditorBaseCurrentness = "current" | "stale" | "unknown";

export interface EditorSessionBaseRef {
  readonly applicationRef: string;
  readonly compositionRef: string;
  readonly revision: number;
  readonly currentness: EditorBaseCurrentness;
}

export interface EditorSessionInit {
  readonly sessionRef: string;
  readonly base: EditorSessionBaseRef;
  readonly composition: CompositionGraph;
}

export interface EditorSession {
  readonly sessionRef: string;
  readonly base: EditorSessionBaseRef;
  readonly draftRevision: number;
  readonly draftCurrentness: "current";
  readonly transaction: CompositionDraftTransaction;
  readonly authority: "station-draft-projection";
}

export type EditorSessionRejectionReason =
  | "malformed-reference"
  | "identity-collision"
  | "invalid-revision"
  | "stale-base"
  | "unknown-currentness"
  | "invalid-composition";

export type EditorSessionInitResult =
  | {
      readonly accepted: true;
      readonly currentness: "current";
      readonly session: EditorSession;
    }
  | {
      readonly accepted: false;
      readonly currentness: EditorBaseCurrentness;
      readonly reason: EditorSessionRejectionReason;
    };

export type EditorSessionMutationResult =
  | {
      readonly accepted: true;
      readonly changed: boolean;
      readonly session: EditorSession;
    }
  | {
      readonly accepted: false;
      readonly reason: "stale-draft-revision" | "invalid-mutation";
      readonly session: EditorSession;
    };

function nonEmpty(value: string): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function reject(
  currentness: EditorBaseCurrentness,
  reason: EditorSessionRejectionReason,
): EditorSessionInitResult {
  return Object.freeze({ accepted: false, currentness, reason });
}

export function initializeEditorSession(
  input: EditorSessionInit,
  registry: ComponentRegistry,
): EditorSessionInitResult {
  const { sessionRef, base } = input;
  if (
    !nonEmpty(sessionRef) ||
    !nonEmpty(base.applicationRef) ||
    !nonEmpty(base.compositionRef)
  ) {
    return reject(base.currentness, "malformed-reference");
  }
  if (new Set([sessionRef, base.applicationRef, base.compositionRef]).size !== 3) {
    return reject(base.currentness, "identity-collision");
  }
  if (!Number.isSafeInteger(base.revision) || base.revision < 0) {
    return reject(base.currentness, "invalid-revision");
  }
  if (base.currentness === "stale") {
    return reject(base.currentness, "stale-base");
  }
  if (base.currentness === "unknown") {
    return reject(base.currentness, "unknown-currentness");
  }

  let transaction: CompositionDraftTransaction;
  try {
    transaction = createCompositionDraftTransaction(input.composition, registry);
  } catch {
    return reject(base.currentness, "invalid-composition");
  }

  return Object.freeze({
    accepted: true,
    currentness: "current",
    session: Object.freeze({
      sessionRef,
      base: Object.freeze({ ...base }),
      draftRevision: base.revision,
      draftCurrentness: "current",
      transaction,
      authority: "station-draft-projection",
    }),
  });
}

export function applyEditorSessionMutation(
  session: EditorSession,
  expectedDraftRevision: number,
  mutation: CompositionDraftMutation,
  registry: ComponentRegistry,
): EditorSessionMutationResult {
  if (expectedDraftRevision !== session.draftRevision) {
    return Object.freeze({
      accepted: false,
      reason: "stale-draft-revision",
      session,
    });
  }
  const result = applyCompositionDraftMutation(session.transaction, mutation, registry);
  if (!result.ok) {
    return Object.freeze({ accepted: false, reason: "invalid-mutation", session });
  }
  const changed =
    result.transaction !== session.transaction &&
    JSON.stringify(result.transaction.draft) !== JSON.stringify(session.transaction.draft);
  if (!changed) {
    return Object.freeze({ accepted: true, changed: false, session });
  }
  return Object.freeze({
    accepted: true,
    changed: true,
    session: Object.freeze({
      ...session,
      draftRevision: session.draftRevision + 1,
      transaction: result.transaction,
    }),
  });
}
