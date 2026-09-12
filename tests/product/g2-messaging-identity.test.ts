import {
  validateEventOccurrence,
  validateMessageIdentity,
  validateSubscriptionIdentity,
} from "../../packages/contracts/messaging";

describe("G2 messaging identity", () => {
  test("keeps occurrence, message, revision and provider identities separate", () => {
    expect(validateMessageIdentity({
      messageRef: "msg:1",
      occurrenceRef: "occ:1",
      producingRevisionRef: "rev:7",
      providerMessageRef: "provider:abc",
    }).ok).toBe(true);

    expect(validateMessageIdentity({
      messageRef: "msg:1",
      occurrenceRef: "occ:1",
      producingRevisionRef: "rev:7",
      providerMessageRef: "occ:1",
    })).toEqual({ ok: false, error: "IDENTITY_COLLISION" });
  });

  test("redelivery preserves business occurrence lineage", () => {
    const first = validateMessageIdentity({
      messageRef: "msg:1",
      occurrenceRef: "occ:1",
      producingRevisionRef: "rev:7",
    });
    const redelivery = validateMessageIdentity({
      messageRef: "msg:2",
      occurrenceRef: "occ:1",
      producingRevisionRef: "rev:7",
      redeliveryOfMessageRef: "msg:1",
    });
    expect(first.ok && redelivery.ok && first.value.occurrenceRef === redelivery.value.occurrenceRef).toBe(true);
  });

  test("historical producing revision remains explicit", () => {
    expect(validateEventOccurrence({
      occurrenceRef: "occ:old",
      rootOccurrenceRef: "occ:old",
      producerRef: "producer:1",
      sourceRef: "source:1",
      subjectRef: "subject:1",
      producingRevisionRef: "rev:historical",
      currentness: "CURRENT",
    })).toMatchObject({ ok: true, value: { producingRevisionRef: "rev:historical" } });
  });

  test.each(["STALE", "PARTIAL", "UNKNOWN"] as const)(
    "%s occurrence evidence cannot become authoritative currentness",
    currentness => {
      expect(validateEventOccurrence({
        occurrenceRef: "occ:1",
        rootOccurrenceRef: "occ:1",
        producerRef: "producer:1",
        sourceRef: "source:1",
        subjectRef: "subject:1",
        producingRevisionRef: "rev:1",
        currentness,
      })).toEqual({ ok: false, error: "OCCURRENCE_CURRENTNESS_NOT_AUTHORITATIVE" });
    },
  );

  test("subscription revision is historical identity and UNKNOWN cannot strengthen it", () => {
    expect(validateSubscriptionIdentity({
      subscriptionRef: "sub:1",
      subscriptionRevisionRef: "subrev:4",
      currentness: "UNKNOWN",
    })).toEqual({ ok: false, error: "SUBSCRIPTION_CURRENTNESS_NOT_AUTHORITATIVE" });
  });
});
