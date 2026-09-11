import type { BrownfieldEvidenceAuthority, BrownfieldEvidenceCompleteness } from "./assimilation.js";
import { normalizeExternalIdentityCoexistence, type ExternalIdentityCoexistence } from "./external-identity-coexistence.js";
import { normalizeLocalityReconciliation, type LocalityReconciliation } from "../locality/reconciliation.js";

export const BROWNFIELD_RECOVERY_CONTRACT_VERSION = "1.0.0" as const;
export type BrownfieldRecoveryDisposition = "RECONCILE_REQUIRED" | "RECOVERY_ELIGIBLE";
export type ResidualDrainageEvidence = Readonly<{
  cohortRef: string;
  evidenceRef: string;
  evidenceAuthority: BrownfieldEvidenceAuthority;
  completeness: BrownfieldEvidenceCompleteness;
}>;
export type BrownfieldRecovery = Readonly<{
  contractVersion: typeof BROWNFIELD_RECOVERY_CONTRACT_VERSION;
  coexistence: ExternalIdentityCoexistence;
  locality: LocalityReconciliation;
  drainageEvidence: readonly ResidualDrainageEvidence[];
  disposition: BrownfieldRecoveryDisposition;
}>;

type R = Record<string, unknown>;
const rec = (value: unknown, label: string): R => { if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`${label} must be an object`); return value as R; };
const exact = (record: R, fields: readonly string[], label: string): void => { for (const key of Object.keys(record)) if (!fields.includes(key)) throw new Error(`${label} has unexpected field ${key}`); for (const key of fields) if (!(key in record)) throw new Error(`${label} is missing field ${key}`); };
const text = (value: unknown, label: string): string => { if (typeof value !== "string" || !value.trim()) throw new Error(`${label} must be non-empty`); return value.trim(); };
const authority = (value: unknown): BrownfieldEvidenceAuthority => { if (value !== "AUTHORITATIVE" && value !== "OBSERVED" && value !== "INFERRED") throw new Error("invalid drainage evidence authority"); return value; };
const completeness = (value: unknown): BrownfieldEvidenceCompleteness => { if (value !== "KNOWN" && value !== "PARTIAL" && value !== "UNKNOWN") throw new Error("invalid drainage evidence completeness"); return value; };

function normalizeDrainageEvidence(input: unknown): ResidualDrainageEvidence {
  const r = rec(input, "residual drainage evidence");
  exact(r, ["cohortRef", "evidenceRef", "evidenceAuthority", "completeness"], "residual drainage evidence");
  return Object.freeze({ cohortRef: text(r.cohortRef, "cohortRef"), evidenceRef: text(r.evidenceRef, "evidenceRef"), evidenceAuthority: authority(r.evidenceAuthority), completeness: completeness(r.completeness) });
}

export function normalizeBrownfieldRecovery(input: unknown): BrownfieldRecovery {
  const r = rec(input, "brownfield recovery");
  exact(r, ["contractVersion", "coexistence", "locality", "drainageEvidence", "disposition"], "brownfield recovery");
  if (r.contractVersion !== BROWNFIELD_RECOVERY_CONTRACT_VERSION) throw new Error("unsupported brownfield recovery contract version");
  if (!Array.isArray(r.drainageEvidence)) throw new Error("drainageEvidence must be an explicit array");
  if (r.disposition !== "RECONCILE_REQUIRED" && r.disposition !== "RECOVERY_ELIGIBLE") throw new Error("invalid brownfield recovery disposition");

  const coexistence = normalizeExternalIdentityCoexistence(r.coexistence);
  const locality = normalizeLocalityReconciliation(r.locality);
  const drainageEvidence = Object.freeze(r.drainageEvidence.map(normalizeDrainageEvidence));
  const evidenceByCohort = new Map(drainageEvidence.map((item) => [item.cohortRef, item] as const));

  for (const cohort of coexistence.residualCohorts) {
    if (!cohort.drained) continue;
    const proof = evidenceByCohort.get(cohort.cohortRef);
    if (!proof || proof.evidenceAuthority !== "AUTHORITATIVE" || proof.completeness !== "KNOWN") {
      throw new Error("drained residual cohort requires explicit AUTHORITATIVE KNOWN drainage evidence");
    }
  }
  for (const binding of coexistence.bindings.filter((item) => item.state === "DRAINED")) {
    const cohort = coexistence.residualCohorts.find((item) => item.bindingRefs.includes(binding.bindingRef));
    if (!cohort?.drained) throw new Error("drained binding must retain explicit drained residual lineage");
  }

  const localityBinding = coexistence.bindings.find((item) => item.state === "ACTIVE" && item.canonicalEntityRef === locality.canonicalSource.canonicalRef && item.bindingRevision === locality.canonicalSource.revisionRef);
  const localityIdentityMismatch = !localityBinding || locality.observations.some((item) => item.authority === "CANONICAL_SOURCE" && item.currentness.populationScope !== localityBinding.scopeRef);
  const unresolvedResidual = coexistence.residualCohorts.some((item) => !item.drained || item.completeness !== "KNOWN");
  const localityUnresolved = locality.reconciliation !== "RECONCILED" || locality.conflict !== "NONE" || locality.residuals.some((item) => item.state !== "DRAINED") || locality.observations.some((item) => item.currentness.state !== "CURRENT");
  const uncertainDrainage = drainageEvidence.some((item) => item.evidenceAuthority !== "AUTHORITATIVE" || item.completeness !== "KNOWN");

  if (r.disposition === "RECOVERY_ELIGIBLE" && localityIdentityMismatch) {
    throw new Error("recovery locality canonical identity/revision/scope must match an ACTIVE canonical binding");
  }
  if (r.disposition === "RECOVERY_ELIGIBLE" && (unresolvedResidual || localityUnresolved || uncertainDrainage)) {
    throw new Error("UNKNOWN/conflict/residual state requires reconcile-before-retry");
  }
  if ((unresolvedResidual || localityUnresolved || localityIdentityMismatch) && r.disposition !== "RECONCILE_REQUIRED") {
    throw new Error("unresolved recovery state must remain RECONCILE_REQUIRED");
  }

  return Object.freeze({ contractVersion: BROWNFIELD_RECOVERY_CONTRACT_VERSION, coexistence, locality, drainageEvidence, disposition: r.disposition });
}
