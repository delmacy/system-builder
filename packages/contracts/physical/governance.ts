import { normalizeProviderBindingQualification, type ProviderBindingQualification } from "../provider/qualification.js";
import { normalizeCurrentnessQualification, normalizeDefinitionRevisionRef, type CurrentnessQualification, type DefinitionRevisionRef } from "../semantic-substrate/index.js";

export const PHYSICAL_PERIPHERAL_GOVERNANCE_CONTRACT_VERSION = "1.0.0" as const;

export type PhysicalCapabilityStatus = "SUPPORTED" | "PARTIAL" | "UNSUPPORTED" | "UNKNOWN";
export type PhysicalIntentKind = "OBSERVE" | "ACTUATE";
export type AuthorizationState = "NOT_REQUIRED" | "AUTHORIZED" | "DENIED" | "UNKNOWN";
export type EffectState = "NOT_APPLICABLE" | "CONFIRMED" | "NOT_CONFIRMED" | "UNKNOWN";

export type PhysicalPeripheralQualification = Readonly<{
  contractVersion: typeof PHYSICAL_PERIPHERAL_GOVERNANCE_CONTRACT_VERSION;
  peripheral: DefinitionRevisionRef;
  providerQualification: ProviderBindingQualification;
  localityRef: string;
  currentness: CurrentnessQualification;
  capability: PhysicalCapabilityStatus;
}>;

export type PhysicalPeripheralInteraction = Readonly<{
  contractVersion: typeof PHYSICAL_PERIPHERAL_GOVERNANCE_CONTRACT_VERSION;
  qualification: PhysicalPeripheralQualification;
  intentKind: PhysicalIntentKind;
  requestedIntentRef: string;
  owningDomainAuthorityRef: string | null;
  authorization: AuthorizationState;
  observedTelemetry: "PRESENT" | "MISSING" | "UNKNOWN";
  effect: EffectState;
}>;

type R = Record<string, unknown>;
const rec = (v: unknown, label: string): R => {
  if (typeof v !== "object" || v === null || Array.isArray(v)) throw new Error(`${label} must be an object`);
  return v as R;
};
const exact = (r: R, fields: readonly string[], label: string) => {
  for (const key of Object.keys(r)) if (!fields.includes(key)) throw new Error(`${label} has unexpected field ${key}`);
  for (const key of fields) if (!(key in r)) throw new Error(`${label} is missing field ${key}`);
};
const text = (v: unknown, label: string) => {
  if (typeof v !== "string" || !v.trim()) throw new Error(`${label} must be non-empty`);
  return v.trim();
};
const revisionKey = (v: DefinitionRevisionRef) => [v.semanticOwner,v.semanticKind,v.canonicalRef,v.definitionRef,v.revisionOwner,v.revisionDimension,v.revisionRef].join("\u0000");

function capability(v: unknown): PhysicalCapabilityStatus {
  if (v !== "SUPPORTED" && v !== "PARTIAL" && v !== "UNSUPPORTED" && v !== "UNKNOWN") throw new Error("invalid physical capability state");
  return v;
}

export function normalizePhysicalPeripheralQualification(input: unknown): PhysicalPeripheralQualification {
  const r = rec(input, "physical peripheral qualification");
  exact(r,["contractVersion","peripheral","providerQualification","localityRef","currentness","capability"],"physical peripheral qualification");
  if (r.contractVersion !== PHYSICAL_PERIPHERAL_GOVERNANCE_CONTRACT_VERSION) throw new Error("unsupported physical peripheral governance contract version");
  const peripheral = normalizeDefinitionRevisionRef(r.peripheral);
  const providerQualification = normalizeProviderBindingQualification(r.providerQualification);
  const localityRef = text(r.localityRef,"localityRef");
  const currentness = normalizeCurrentnessQualification(r.currentness);
  const state = capability(r.capability);
  if (revisionKey(currentness.subject) !== revisionKey(peripheral) || currentness.localityScope !== localityRef) throw new Error("physical currentness must qualify the exact peripheral revision and locality");
  if (state === "SUPPORTED") {
    if (providerQualification.disposition !== "SUPPORTED") throw new Error("PARTIAL, UNKNOWN or unsupported provider capability cannot strengthen to physical SUPPORTED");
    if (currentness.state !== "CURRENT") throw new Error("stale or UNKNOWN physical evidence cannot strengthen to SUPPORTED");
  }
  return Object.freeze({contractVersion:PHYSICAL_PERIPHERAL_GOVERNANCE_CONTRACT_VERSION,peripheral,providerQualification,localityRef,currentness,capability:state});
}

export function normalizePhysicalPeripheralInteraction(input: unknown): PhysicalPeripheralInteraction {
  const r = rec(input,"physical peripheral interaction");
  exact(r,["contractVersion","qualification","intentKind","requestedIntentRef","owningDomainAuthorityRef","authorization","observedTelemetry","effect"],"physical peripheral interaction");
  if (r.contractVersion !== PHYSICAL_PERIPHERAL_GOVERNANCE_CONTRACT_VERSION) throw new Error("unsupported physical peripheral governance contract version");
  const qualification = normalizePhysicalPeripheralQualification(r.qualification);
  if (r.intentKind !== "OBSERVE" && r.intentKind !== "ACTUATE") throw new Error("invalid physical intent kind");
  const requestedIntentRef = text(r.requestedIntentRef,"requestedIntentRef");
  const owningDomainAuthorityRef = r.owningDomainAuthorityRef === null ? null : text(r.owningDomainAuthorityRef,"owningDomainAuthorityRef");
  if (r.authorization !== "NOT_REQUIRED" && r.authorization !== "AUTHORIZED" && r.authorization !== "DENIED" && r.authorization !== "UNKNOWN") throw new Error("invalid authorization state");
  if (r.observedTelemetry !== "PRESENT" && r.observedTelemetry !== "MISSING" && r.observedTelemetry !== "UNKNOWN") throw new Error("invalid telemetry state");
  if (r.effect !== "NOT_APPLICABLE" && r.effect !== "CONFIRMED" && r.effect !== "NOT_CONFIRMED" && r.effect !== "UNKNOWN") throw new Error("invalid effect state");

  if (r.intentKind === "OBSERVE") {
    if (r.authorization !== "NOT_REQUIRED") throw new Error("observation must not manufacture actuation authorization");
    if (r.effect !== "NOT_APPLICABLE") throw new Error("observation cannot claim a physical actuation effect");
  } else {
    if (qualification.capability !== "SUPPORTED") throw new Error("unsupported, PARTIAL or UNKNOWN capability cannot be used for actuation intent");
    if (owningDomainAuthorityRef === null) throw new Error("actuation intent requires external owning-domain authority");
    if (r.authorization !== "AUTHORIZED") throw new Error("integration capability does not grant actuation authority");
    if (r.effect === "CONFIRMED" && r.observedTelemetry !== "PRESENT") throw new Error("missing telemetry cannot imply confirmed physical effect");
  }

  return Object.freeze({
    contractVersion:PHYSICAL_PERIPHERAL_GOVERNANCE_CONTRACT_VERSION,
    qualification,
    intentKind:r.intentKind,
    requestedIntentRef,
    owningDomainAuthorityRef,
    authorization:r.authorization,
    observedTelemetry:r.observedTelemetry,
    effect:r.effect,
  });
}
