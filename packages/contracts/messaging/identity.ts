export type EvidenceCurrentness = "CURRENT" | "STALE" | "PARTIAL" | "UNKNOWN";

export interface MessagingProvenance {
  producerRef: string;
  sourceRef: string;
  subjectRef: string;
  producingRevisionRef: string;
}

export interface EventOccurrenceIdentity extends MessagingProvenance {
  occurrenceRef: string;
  parentOccurrenceRef?: string;
  rootOccurrenceRef: string;
  currentness: EvidenceCurrentness;
}

export interface MessageIdentity {
  messageRef: string;
  occurrenceRef: string;
  producingRevisionRef: string;
  providerMessageRef?: string;
  redeliveryOfMessageRef?: string;
}

export interface SubscriptionIdentity {
  subscriptionRef: string;
  subscriptionRevisionRef: string;
  currentness: EvidenceCurrentness;
}

export type MessagingIdentityError =
  | "IDENTITY_COLLISION"
  | "OCCURRENCE_LINEAGE_MISSING"
  | "OCCURRENCE_CURRENTNESS_NOT_AUTHORITATIVE"
  | "SUBSCRIPTION_CURRENTNESS_NOT_AUTHORITATIVE";

export type MessagingIdentityResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: MessagingIdentityError };

const nonAuthoritative = (value: EvidenceCurrentness) =>
  value === "STALE" || value === "PARTIAL" || value === "UNKNOWN";

export function validateEventOccurrence(
  occurrence: EventOccurrenceIdentity,
): MessagingIdentityResult<EventOccurrenceIdentity> {
  if (!occurrence.rootOccurrenceRef || !occurrence.producingRevisionRef) {
    return { ok: false, error: "OCCURRENCE_LINEAGE_MISSING" };
  }
  if (nonAuthoritative(occurrence.currentness)) {
    return { ok: false, error: "OCCURRENCE_CURRENTNESS_NOT_AUTHORITATIVE" };
  }
  return { ok: true, value: occurrence };
}

export function validateMessageIdentity(
  message: MessageIdentity,
): MessagingIdentityResult<MessageIdentity> {
  const canonical = new Set([
    message.messageRef,
    message.occurrenceRef,
    message.producingRevisionRef,
  ]);
  if (canonical.size !== 3 || (message.providerMessageRef && canonical.has(message.providerMessageRef))) {
    return { ok: false, error: "IDENTITY_COLLISION" };
  }
  return { ok: true, value: message };
}

export function validateSubscriptionIdentity(
  subscription: SubscriptionIdentity,
): MessagingIdentityResult<SubscriptionIdentity> {
  if (subscription.subscriptionRef === subscription.subscriptionRevisionRef) {
    return { ok: false, error: "IDENTITY_COLLISION" };
  }
  if (nonAuthoritative(subscription.currentness)) {
    return { ok: false, error: "SUBSCRIPTION_CURRENTNESS_NOT_AUTHORITATIVE" };
  }
  return { ok: true, value: subscription };
}
