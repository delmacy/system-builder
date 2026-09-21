import { describe, expect, it } from "vitest";
import {
  PRODUCT_PROOF_CLASSES,
  observeProductProof,
  type ProductProofObligation,
} from "../../packages/contracts/product-proof";

const obligation: ProductProofObligation = {
  obligationId: "elicitation.requirement.acceptance",
  revision: "r7",
  producer: { ownerId: "elicitation", producerId: "requirements", revision: "r7" },
  acceptanceTarget: { targetId: "REQ-42", revision: "r7" },
  proofClass: "POSITIVE",
};

describe("G2 Product Proof obligation registry", () => {
  it("keeps the four proof classes distinguishable", () => {
    expect(PRODUCT_PROOF_CLASSES).toEqual([
      "POSITIVE",
      "NEGATIVE",
      "ADVERSARIAL",
      "RECOVERY",
    ]);
  });

  it("keeps missing evidence UNKNOWN rather than promoting design or acceptance to PASS", () => {
    expect(observeProductProof(obligation)).toMatchObject({
      obligationId: obligation.obligationId,
      obligationRevision: "r7",
      state: "UNKNOWN",
    });
  });

  it("rejects evidence routed from a different producer revision", () => {
    expect(
      observeProductProof(obligation, {
        routeId: "route-1",
        obligationId: obligation.obligationId,
        obligationRevision: "r7",
        producer: { ownerId: "elicitation", producerId: "requirements", revision: "r6" },
        evidenceRef: "proof://REQ-42",
        evidenceRevision: "proof-r1",
        observedState: "PASS",
      }).state,
    ).toBe("UNKNOWN");
  });

  it("references producer-owned executed evidence without taking semantic ownership", () => {
    const observation = observeProductProof(obligation, {
      routeId: "route-2",
      obligationId: obligation.obligationId,
      obligationRevision: "r7",
      producer: obligation.producer,
      evidenceRef: "proof://REQ-42",
      evidenceRevision: "proof-r2",
      observedState: "PARTIAL",
    });

    expect(observation).toEqual({
      obligationId: obligation.obligationId,
      obligationRevision: "r7",
      producer: obligation.producer,
      proofClass: "POSITIVE",
      state: "PARTIAL",
      evidenceRef: "proof://REQ-42",
      evidenceRevision: "proof-r2",
    });
  });
});
