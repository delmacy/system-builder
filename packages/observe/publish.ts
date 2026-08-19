import type { DeploymentObservation } from "./index.js";

export type PublishObserver = Readonly<{
  readonly deliver: (observation: DeploymentObservation) => void | Promise<void>;
}>;

export type PublishResult =
  | Readonly<{ ok: true; outcome: "not-configured"; observationId: null }>
  | Readonly<{ ok: true; outcome: "delivered"; observationId: string }>
  | Readonly<{
      ok: false;
      outcome: "channel-failed";
      observationId: string;
      diagnostic: Readonly<{ code: "OBSERVE_CHANNEL_FAILED"; detail: string }>;
    }>;

const CHANNEL_FAILED_DIAGNOSTIC = Object.freeze({
  code: "OBSERVE_CHANNEL_FAILED" as const,
  detail: "observe channel unavailable; deployment outcome unchanged",
});

export async function publish(
  observation: DeploymentObservation,
  observer?: PublishObserver | null,
): Promise<PublishResult> {
  if (observer === undefined || observer === null) {
    return Object.freeze({ ok: true, outcome: "not-configured", observationId: null });
  }
  try {
    await observer.deliver(observation);
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