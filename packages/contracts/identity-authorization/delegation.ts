import { normalizeDefinitionRevisionRef, type DefinitionRevisionRef } from "../semantic-substrate/index.js";
import { normalizeAuthorizationDecision, normalizeActorContext, normalizeIdentityReference, normalizeAuthorizationScope, type ActorContext, type AuthorizationDecision, type AuthorizationScope, type IdentityReference } from "./index.js";

export const DERIVED_AUTHORITY_CONTRACT_VERSION = "1.0.0" as const;
export type DerivedAuthorityMode = "DELEGATION" | "BREAK_GLASS";
export type AuthorityWindow = Readonly<{ notBefore: string; expiresAt: string }>;
export type DerivedAuthorityDescriptor = Readonly<{
  contractVersion: typeof DERIVED_AUTHORITY_CONTRACT_VERSION;
  mode: DerivedAuthorityMode;
  sourceDecision: AuthorizationDecision;
  delegator: ActorContext;
  delegate: IdentityReference;
  sourceWindow: AuthorityWindow;
  effectiveWindow: AuthorityWindow;
  effectiveScope: AuthorizationScope;
  reason: string;
  evidence: DefinitionRevisionRef;
}>;

type UnknownRecord = Record<string, unknown>;
function asRecord(value: unknown, label: string): UnknownRecord { if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`${label} must be an object`); return value as UnknownRecord; }
function assertExactFields(record: UnknownRecord, fields: readonly string[], label: string): void { for (const key of Object.keys(record)) if (!fields.includes(key)) throw new Error(`${label} has unexpected field ${key}`); for (const key of fields) if (!(key in record)) throw new Error(`${label} is missing field ${key}`); }
function nonEmpty(value: unknown, label: string): string { if (typeof value !== "string" || value.length === 0) throw new Error(`${label} must be a non-empty string`); return value; }
function instant(value: unknown, label: string): string { const text = nonEmpty(value, label); const parsed = Date.parse(text); if (!Number.isFinite(parsed)) throw new Error(`${label} must be an ISO timestamp`); return new Date(parsed).toISOString(); }
function windowOf(value: unknown, label: string): AuthorityWindow { const record = asRecord(value, label); assertExactFields(record, ["notBefore", "expiresAt"], label); const notBefore = instant(record.notBefore, `${label}.notBefore`); const expiresAt = instant(record.expiresAt, `${label}.expiresAt`); if (Date.parse(expiresAt) <= Date.parse(notBefore)) throw new Error(`${label} expiry must be after notBefore`); return Object.freeze({ notBefore, expiresAt }); }
function same(value: unknown, expected: unknown): boolean { return JSON.stringify(value) === JSON.stringify(expected); }

export function normalizeDerivedAuthorityDescriptor(input: unknown, expectedSourceDecision?: AuthorizationDecision): DerivedAuthorityDescriptor {
  const record = asRecord(input, "derived authority descriptor");
  assertExactFields(record, ["contractVersion", "mode", "sourceDecision", "delegator", "delegate", "sourceWindow", "effectiveWindow", "effectiveScope", "reason", "evidence"], "derived authority descriptor");
  if (record.contractVersion !== DERIVED_AUTHORITY_CONTRACT_VERSION) throw new Error(`unsupported derived authority contract version: ${String(record.contractVersion)}`);
  if (record.mode !== "DELEGATION" && record.mode !== "BREAK_GLASS") throw new Error("derived authority mode must be DELEGATION or BREAK_GLASS");
  const sourceDecision = normalizeAuthorizationDecision(record.sourceDecision, expectedSourceDecision?.request);
  if (sourceDecision.disposition !== "ALLOW") throw new Error("UNKNOWN or DENY source authority cannot become an effective derived grant");
  const delegator = normalizeActorContext(record.delegator);
  if (!same(delegator, sourceDecision.request.actor)) throw new Error("delegator must be the exact source-authority actor revision");
  const delegate = normalizeIdentityReference(record.delegate);
  const sourceWindow = windowOf(record.sourceWindow, "source authority window");
  const effectiveWindow = windowOf(record.effectiveWindow, "effective authority window");
  if (Date.parse(effectiveWindow.notBefore) < Date.parse(sourceWindow.notBefore) || Date.parse(effectiveWindow.expiresAt) > Date.parse(sourceWindow.expiresAt)) throw new Error("effective authority time bounds cannot exceed source authority bounds");
  const effectiveScope = normalizeAuthorizationScope(record.effectiveScope);
  if (!same(effectiveScope, sourceDecision.request.requested)) throw new Error("effective authority scope/locality cannot exceed or substitute the explicit source scope");
  const reason = nonEmpty(record.reason, "derived authority reason");
  const evidence = normalizeDefinitionRevisionRef(record.evidence);
  return Object.freeze({ contractVersion: DERIVED_AUTHORITY_CONTRACT_VERSION, mode: record.mode, sourceDecision, delegator, delegate, sourceWindow, effectiveWindow, effectiveScope, reason, evidence });
}
