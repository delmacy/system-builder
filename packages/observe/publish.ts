import {
  DeploymentFinding,
  type DeploymentFinding as DeploymentFindingType,
  type DeploymentFindingLinkage,
} from "./findings.js";
import { enrichObservation, type DeploymentObservation, type EnrichedDeploymentObservation } from "./index.js";

function isRecordLike(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export type PublishObserver = Readonly<{
  readonly deliver: (observation: DeploymentObservation) => void | Promise<void>;
}>;

export type EnrichedPublishObserver = Readonly<{
  readonly deliver: (observation: DeploymentObservation | EnrichedDeploymentObservation) => void | Promise<void>;
}>;

export type PublishResult =
  | Readonly<{ ok: true; outcome: "not-configured"; observationId: null }>
  | Readonly<{ ok: true; outcome: "delivered"; observationId: string }>
  | Readonly<{
      ok: false;
      outcome: "channel-failed";
      observationId: string;
      diagnostic: Readonly<{ code: "OBSERVE_CHANNEL_FAILED"; detail: string }>;
    }>
  | Readonly<{
      ok: false;
      outcome: "metadata-failed";
      observationId: string;
      diagnostic: Readonly<{ code: "OBSERVE_METADATA_FAILED"; detail: string }>;
    }>;

const CHANNEL_FAILED_DIAGNOSTIC = Object.freeze({
  code: "OBSERVE_CHANNEL_FAILED" as const,
  detail: "observe channel unavailable; deployment outcome unchanged",
});

const METADATA_FAILED_DIAGNOSTIC = Object.freeze({
  code: "OBSERVE_METADATA_FAILED" as const,
  detail: "operational metadata unavailable; deployment outcome unchanged",
});

export type DeploymentFindingsPublication = Readonly<{
  kind: "DeploymentFindingsPublication";
  findings: readonly DeploymentFindingType[];
  linkage?: DeploymentFindingLinkage;
}>;

export type FindingsPublishObserver = Readonly<{
  readonly deliver: (publication: DeploymentFindingsPublication) => void | Promise<void>;
}>;

export type FindingsPublishResult =
  | Readonly<{ ok: true; outcome: "not-configured"; count: number }>
  | Readonly<{ ok: true; outcome: "delivered"; count: number }>
  | Readonly<{
      ok: false;
      outcome: "channel-failed";
      count: number;
      diagnostic: Readonly<{ code: "OBSERVE_CHANNEL_FAILED"; detail: string }>;
    }>
  | Readonly<{
      ok: false;
      outcome: "findings-failed";
      count: number;
      diagnostic: Readonly<{ code: "OBSERVE_FINDINGS_FAILED"; detail: string }>;
    }>;

const FINDINGS_FAILED_DIAGNOSTIC = Object.freeze({
  code: "OBSERVE_FINDINGS_FAILED" as const,
  detail: "findings unavailable or malformed; deployment outcome unchanged",
});

async function publishInternal(
  observation: DeploymentObservation | EnrichedDeploymentObservation,
  observer: PublishObserver | EnrichedPublishObserver | null,
): Promise<PublishResult> {
  if (observer === undefined || observer === null) {
    return Object.freeze({ ok: true, outcome: "not-configured", observationId: null });
  }
  try {
    await observer.deliver(observation as never);
    return Object.freeze({ ok: true, outcome: "delivered", observationId: observation.observationId });
  } catch {
    return Object.freeze({
      ok: false,
      outcome: "channel-failed",
      observationId: observation.observationId,
      diagnostic: CHANNEL_FAILED_DIAGNOSTIC,
    });
  }
}

export async function publish(
  observation: DeploymentObservation,
  observer?: PublishObserver | null,
): Promise<PublishResult> {
  return publishInternal(observation, observer ?? null);
}

export async function publishEnriched(
  observation: DeploymentObservation,
  operation: unknown,
  observer?: EnrichedPublishObserver | null,
): Promise<PublishResult> {
  let enriched: DeploymentObservation | EnrichedDeploymentObservation;
  try {
    enriched = enrichObservation(observation, operation as never);
  } catch {
    return Object.freeze({
      ok: false,
      outcome: "metadata-failed",
      observationId: observation.observationId,
      diagnostic: METADATA_FAILED_DIAGNOSTIC,
    });
  }
  return publishInternal(enriched, observer ?? null);
}

function assertValidLinkage(
  linkage: unknown,
  findings: readonly DeploymentFindingType[],
): DeploymentFindingLinkage {
  if (!isRecordLike(linkage)) throw new Error("OBSERVE_FINDINGS_FAILED:linkage-not-object");
  const record = linkage as Record<string, unknown>;
  if (record["kind"] !== "DeploymentFindingLinkage") throw new Error("OBSERVE_FINDINGS_FAILED:linkage-kind");
  if (typeof record["findingId"] !== "string") throw new Error("OBSERVE_FINDINGS_FAILED:linkage-finding");
  if (!findings.some((finding) => finding.findingId === record["findingId"])) {
    throw new Error("OBSERVE_FINDINGS_FAILED:linkage-foreign-finding");
  }
  return linkage as DeploymentFindingLinkage;
}

export async function publishFindings(
  findings: readonly DeploymentFindingType[],
  linkage?: DeploymentFindingLinkage | null,
  observer?: FindingsPublishObserver | null,
): Promise<FindingsPublishResult> {
  let validated: readonly DeploymentFindingType[];
  let validatedLinkage: DeploymentFindingLinkage | undefined;
  try {
    validated = Object.freeze(findings.map((finding) => DeploymentFinding.validate(finding)));
    if (linkage !== undefined && linkage !== null) {
      validatedLinkage = assertValidLinkage(linkage, validated);
    }
  } catch {
    return Object.freeze({
      ok: false,
      outcome: "findings-failed",
      count: findings.length,
      diagnostic: FINDINGS_FAILED_DIAGNOSTIC,
    });
  }

  if (observer === undefined || observer === null) {
    return Object.freeze({ ok: true, outcome: "not-configured", count: validated.length });
  }

  const publication: DeploymentFindingsPublication = Object.freeze({
    kind: "DeploymentFindingsPublication",
    findings: validated,
    ...(validatedLinkage !== undefined ? { linkage: validatedLinkage } : {}),
  });

  try {
    await observer.deliver(publication);
    return Object.freeze({ ok: true, outcome: "delivered", count: validated.length });
  } catch {
    return Object.freeze({
      ok: false,
      outcome: "channel-failed",
      count: validated.length,
      diagnostic: CHANNEL_FAILED_DIAGNOSTIC,
    });
  }
}