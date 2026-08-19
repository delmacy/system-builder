import { enrichObservation, type DeploymentObservation, type EnrichedDeploymentObservation } from "./index.js";

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