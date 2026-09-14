import { createHash } from "node:crypto";

export type AiMediatedCurrentness = "CURRENT" | "STALE" | "UNKNOWN" | "INCONCLUSIVE";
export type AiMediatedCompleteness = "KNOWN" | "PARTIAL" | "UNKNOWN" | "INCONCLUSIVE" | "CONFLICTED";
export type AiMediatedLocalityScope = "LOCAL" | "STATION" | "FLEET";
export type AiMediatedProvenanceKind = "PROMPT" | "CONTEXT" | "EVIDENCE";

export interface AiMediatedLocality {
  readonly scope: AiMediatedLocalityScope;
  readonly scopeRef: string;
}

export interface AiMediatedWorkspaceIdentity {
  readonly workspaceRef: string;
  readonly workspaceRevisionRef: string;
  readonly gatewayRef: string;
  readonly gatewayRevisionRef: string;
  readonly locality: AiMediatedLocality;
}

export interface AiMediatedProvenanceRef {
  readonly kind: AiMediatedProvenanceKind;
  readonly ref: string;
  readonly revisionRef: string;
  readonly digest: string;
  readonly currentness: AiMediatedCurrentness;
  readonly completeness: AiMediatedCompleteness;
}

export interface AiMediatedCandidateLineage {
  readonly candidateRef: string;
  readonly candidateRevisionRef: string;
  readonly sourceKind: Exclude<AiMediatedProvenanceKind, "PROMPT">;
  readonly sourceRef: string;
  readonly sourceRevisionRef: string;
  readonly provenanceHash: string;
}

export interface AiMediatedWorkspaceSnapshot {
  readonly identity: AiMediatedWorkspaceIdentity;
  readonly provenance: readonly AiMediatedProvenanceRef[];
  readonly candidateLineage: AiMediatedCandidateLineage;
}

export type AiMediatedWorkspaceEvaluation =
  | "AVAILABLE"
  | "DEGRADED"
  | "RECONCILE_BEFORE_RETRY";

function assertNonEmpty(value: string, field: string): void {
  if (value.trim().length === 0) {
    throw new Error(`AI_MEDIATED_PROVENANCE_INVALID:${field}`);
  }
}

function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(",")}]`;
  }
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(record[key])}`).join(",")}}`;
}

export function computeAiMediatedProvenanceHash(
  provenance: readonly AiMediatedProvenanceRef[],
): string {
  const ordered = [...provenance].sort((left, right) => {
    const leftKey = `${left.kind}:${left.ref}:${left.revisionRef}`;
    const rightKey = `${right.kind}:${right.ref}:${right.revisionRef}`;
    return leftKey.localeCompare(rightKey);
  });
  return createHash("sha256").update(canonicalize(ordered)).digest("hex");
}

export function assertAiMediatedWorkspaceSnapshot(snapshot: AiMediatedWorkspaceSnapshot): void {
  const { identity, provenance, candidateLineage } = snapshot;
  assertNonEmpty(identity.workspaceRef, "workspaceRef");
  assertNonEmpty(identity.workspaceRevisionRef, "workspaceRevisionRef");
  assertNonEmpty(identity.gatewayRef, "gatewayRef");
  assertNonEmpty(identity.gatewayRevisionRef, "gatewayRevisionRef");
  assertNonEmpty(identity.locality.scopeRef, "locality.scopeRef");
  assertNonEmpty(candidateLineage.candidateRef, "candidateRef");
  assertNonEmpty(candidateLineage.candidateRevisionRef, "candidateRevisionRef");
  assertNonEmpty(candidateLineage.sourceRef, "sourceRef");
  assertNonEmpty(candidateLineage.sourceRevisionRef, "sourceRevisionRef");

  if (provenance.length === 0) {
    throw new Error("AI_MEDIATED_PROVENANCE_INVALID:missing");
  }

  const identities = new Set<string>();
  let promptCount = 0;
  for (const entry of provenance) {
    assertNonEmpty(entry.ref, `${entry.kind}.ref`);
    assertNonEmpty(entry.revisionRef, `${entry.kind}.revisionRef`);
    assertNonEmpty(entry.digest, `${entry.kind}.digest`);
    const identity = `${entry.kind}:${entry.ref}`;
    if (identities.has(identity)) {
      throw new Error(`AI_MEDIATED_PROVENANCE_AMBIGUOUS:${identity}`);
    }
    identities.add(identity);
    if (entry.kind === "PROMPT") promptCount += 1;
  }
  if (promptCount !== 1) {
    throw new Error("AI_MEDIATED_PROVENANCE_INVALID:prompt-cardinality");
  }

  const lineageSource = provenance.find((entry) =>
    entry.kind === candidateLineage.sourceKind &&
    entry.ref === candidateLineage.sourceRef &&
    entry.revisionRef === candidateLineage.sourceRevisionRef
  );
  if (!lineageSource) {
    throw new Error("AI_MEDIATED_PROVENANCE_INVALID:source-lineage-mismatch");
  }

  const expectedHash = computeAiMediatedProvenanceHash(provenance);
  if (candidateLineage.provenanceHash !== expectedHash) {
    throw new Error("AI_MEDIATED_PROVENANCE_INVALID:hash-mismatch");
  }
}

export function evaluateAiMediatedWorkspace(
  snapshot: AiMediatedWorkspaceSnapshot,
): AiMediatedWorkspaceEvaluation {
  assertAiMediatedWorkspaceSnapshot(snapshot);

  if (snapshot.provenance.some((entry) =>
    entry.currentness === "UNKNOWN" ||
    entry.currentness === "INCONCLUSIVE" ||
    entry.completeness === "UNKNOWN" ||
    entry.completeness === "INCONCLUSIVE" ||
    entry.completeness === "CONFLICTED"
  )) {
    return "RECONCILE_BEFORE_RETRY";
  }

  if (snapshot.provenance.some((entry) =>
    entry.currentness === "STALE" || entry.completeness === "PARTIAL"
  )) {
    return "DEGRADED";
  }

  return "AVAILABLE";
}

export function aiMediatedInferenceEstablishesAuthority(
  snapshot: AiMediatedWorkspaceSnapshot,
): false {
  void snapshot;
  return false;
}

export function aiMediatedCandidateEstablishesCanonicalTruth(
  candidateLineage: AiMediatedCandidateLineage,
): false {
  void candidateLineage;
  return false;
}

export function aiMediatedOrdinaryGenerationRemainsAvailable(
  evaluation: AiMediatedWorkspaceEvaluation,
): true {
  void evaluation;
  return true;
}

export function aiMediatedProvenanceReplayMatches(
  snapshot: AiMediatedWorkspaceSnapshot,
  replayedProvenance: readonly AiMediatedProvenanceRef[],
): boolean {
  assertAiMediatedWorkspaceSnapshot(snapshot);
  return snapshot.candidateLineage.provenanceHash === computeAiMediatedProvenanceHash(replayedProvenance);
}
