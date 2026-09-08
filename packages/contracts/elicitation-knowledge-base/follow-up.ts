import {
  ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
  normalizeQuestionOccurrenceContext,
  normalizeQuestionOccurrenceIdentity,
  type QuestionOccurrenceContext,
  type QuestionOccurrenceIdentity,
} from "./index.js";
import { EKB_CONTRADICTION_SEVERITIES, type EKBContradictionSeverity, type EKBExternalResolutionAuthority } from "./routing.js";

export const EKB_FOLLOW_UP_TRIGGER_KINDS = ["GAP", "CONTRADICTION", "STAGE_OBLIGATION"] as const;
export const EKB_FOLLOW_UP_OUTCOMES = ["FOLLOW_UP_REQUIRED", "UNRESOLVED", "INCONCLUSIVE"] as const;
export const EKB_FOLLOW_UP_CURRENTNESS_STATES = ["CURRENT", "STALE", "UNKNOWN", "INSUFFICIENT"] as const;

export type EKBFollowUpTriggerKind = (typeof EKB_FOLLOW_UP_TRIGGER_KINDS)[number];
export type EKBFollowUpOutcome = (typeof EKB_FOLLOW_UP_OUTCOMES)[number];
export type EKBFollowUpCurrentnessState = (typeof EKB_FOLLOW_UP_CURRENTNESS_STATES)[number];

export type EKBFollowUpTrigger = Readonly<{
  kind: EKBFollowUpTriggerKind;
  gapRef: string | null;
  contradictionRef: string | null;
  stageObligationRef: string | null;
  severity: EKBContradictionSeverity;
  occurrence: QuestionOccurrenceIdentity;
  context: QuestionOccurrenceContext;
  currentnessState: EKBFollowUpCurrentnessState;
}>;

export type EKBFollowUpRoute = Readonly<{
  targetQuestionRevisionRef: string | null;
  targetAuthority: EKBExternalResolutionAuthority | null;
}>;

export type EKBFollowUpPlan = Readonly<{
  contractVersion: typeof ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION;
  followUpRef: string;
  trigger: EKBFollowUpTrigger;
  outcome: EKBFollowUpOutcome;
  route: EKBFollowUpRoute;
  rationale: string;
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

function nullableNonEmpty(value: unknown, field: string): string | null {
  if (value === null) return null;
  return nonEmpty(value, field);
}

function oneOf<T extends readonly string[]>(value: unknown, allowed: T, field: string): T[number] {
  if (typeof value !== "string" || !allowed.includes(value)) throw new Error(`${field} must be one of ${allowed.join(", ")}`);
  return value as T[number];
}

function normalizeAuthority(input: unknown): EKBExternalResolutionAuthority | null {
  if (input === null) return null;
  const record = asRecord(input, "follow-up target authority");
  assertExactFields(record, ["ownerRef", "authorityRef"], "follow-up target authority");
  return Object.freeze({
    ownerRef: nonEmpty(record.ownerRef, "route.targetAuthority.ownerRef"),
    authorityRef: nonEmpty(record.authorityRef, "route.targetAuthority.authorityRef"),
  });
}

function normalizeTrigger(input: unknown): EKBFollowUpTrigger {
  const record = asRecord(input, "EKB follow-up trigger");
  assertExactFields(record, ["kind", "gapRef", "contradictionRef", "stageObligationRef", "severity", "occurrence", "context", "currentnessState"], "EKB follow-up trigger");
  const kind = oneOf(record.kind, EKB_FOLLOW_UP_TRIGGER_KINDS, "trigger.kind");
  const gapRef = nullableNonEmpty(record.gapRef, "trigger.gapRef");
  const contradictionRef = nullableNonEmpty(record.contradictionRef, "trigger.contradictionRef");
  const stageObligationRef = nullableNonEmpty(record.stageObligationRef, "trigger.stageObligationRef");
  const refs = [gapRef, contradictionRef, stageObligationRef].filter((value) => value !== null);
  if (refs.length !== 1) throw new Error("follow-up trigger must preserve exactly one explicit unresolved source reference");
  if (kind === "GAP" && gapRef === null) throw new Error("GAP trigger requires gapRef");
  if (kind === "CONTRADICTION" && contradictionRef === null) throw new Error("CONTRADICTION trigger requires contradictionRef");
  if (kind === "STAGE_OBLIGATION" && stageObligationRef === null) throw new Error("STAGE_OBLIGATION trigger requires stageObligationRef");
  return Object.freeze({
    kind,
    gapRef,
    contradictionRef,
    stageObligationRef,
    severity: oneOf(record.severity, EKB_CONTRADICTION_SEVERITIES, "trigger.severity"),
    occurrence: normalizeQuestionOccurrenceIdentity(record.occurrence),
    context: normalizeQuestionOccurrenceContext(record.context),
    currentnessState: oneOf(record.currentnessState, EKB_FOLLOW_UP_CURRENTNESS_STATES, "trigger.currentnessState"),
  });
}

function normalizeRoute(input: unknown): EKBFollowUpRoute {
  const record = asRecord(input, "EKB follow-up route");
  assertExactFields(record, ["targetQuestionRevisionRef", "targetAuthority"], "EKB follow-up route");
  return Object.freeze({
    targetQuestionRevisionRef: nullableNonEmpty(record.targetQuestionRevisionRef, "route.targetQuestionRevisionRef"),
    targetAuthority: normalizeAuthority(record.targetAuthority),
  });
}

export function normalizeEKBFollowUpPlan(input: unknown): EKBFollowUpPlan {
  const record = asRecord(input, "EKB follow-up plan");
  assertExactFields(record, ["contractVersion", "followUpRef", "trigger", "outcome", "route", "rationale"], "EKB follow-up plan");
  if (record.contractVersion !== ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION) throw new Error(`unsupported EKB contract version: ${String(record.contractVersion)}`);
  const trigger = normalizeTrigger(record.trigger);
  const outcome = oneOf(record.outcome, EKB_FOLLOW_UP_OUTCOMES, "outcome");
  const route = normalizeRoute(record.route);
  const rationale = nonEmpty(record.rationale, "rationale");

  if (outcome === "FOLLOW_UP_REQUIRED" && route.targetQuestionRevisionRef === null && route.targetAuthority === null) {
    throw new Error("FOLLOW_UP_REQUIRED requires explicit routing context; fabricate-no-default question or owner");
  }
  if ((outcome === "INCONCLUSIVE" || outcome === "UNRESOLVED") && (route.targetQuestionRevisionRef !== null || route.targetAuthority !== null)) {
    throw new Error(`${outcome} must not fabricate a target question or owner while routing is unresolved`);
  }

  return Object.freeze({
    contractVersion: ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
    followUpRef: nonEmpty(record.followUpRef, "followUpRef"),
    trigger,
    outcome,
    route,
    rationale,
  });
}
