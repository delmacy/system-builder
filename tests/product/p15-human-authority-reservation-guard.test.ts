import assert from "node:assert/strict";
import test from "node:test";
import { evaluateHumanAuthorityReservation } from "../../packages/contracts/decision-boundary/index.js";

const humanReserved = {
  boundaryVersion: "1.0.0",
  decisionId: "decision:release-approval",
  category: "human-decision",
} as const;
const deterministic = {
  boundaryVersion: "1.0.0",
  decisionId: "decision:release-check",
  category: "deterministic",
} as const;
const probabilistic = {
  boundaryVersion: "1.0.0",
  decisionId: "decision:release-recommendation",
  category: "probabilistic",
} as const;

const authorityRef = "authority:release-approver";

test("human-reserved descriptor may satisfy only its matching authority reservation", () => {
  assert.deepEqual(
    evaluateHumanAuthorityReservation({
      descriptor: humanReserved,
      metadata: { authorityRef },
      authorityRef,
    }),
    {
      status: "compatible",
      decisionId: "decision:release-approval",
      authorityRef,
    },
  );
});

test("probabilistic output cannot impersonate human-reserved authority", () => {
  assert.deepEqual(
    evaluateHumanAuthorityReservation({
      descriptor: probabilistic,
      metadata: { inferenceRef: "inference:release-recommendation" },
      authorityRef,
    }),
    {
      status: "rejected",
      decisionId: "decision:release-recommendation",
      authorityRef,
      diagnostic: "probabilistic decision cannot satisfy human-reserved authority",
    },
  );
});

test("deterministic output cannot satisfy human-reserved authority", () => {
  assert.deepEqual(
    evaluateHumanAuthorityReservation({
      descriptor: deterministic,
      metadata: { invariantRef: "invariant:release-safe" },
      authorityRef,
    }),
    {
      status: "rejected",
      decisionId: "decision:release-check",
      authorityRef,
      diagnostic: "deterministic decision cannot satisfy human-reserved authority",
    },
  );
});

test("human authority reference mismatch fails closed", () => {
  assert.deepEqual(
    evaluateHumanAuthorityReservation({
      descriptor: humanReserved,
      metadata: { authorityRef: "authority:different-approver" },
      authorityRef,
    }),
    {
      status: "rejected",
      decisionId: "decision:release-approval",
      authorityRef,
      diagnostic: "human authority reference mismatch",
    },
  );
});

test("reservation evaluation never fabricates approval or authorization", () => {
  const result = evaluateHumanAuthorityReservation({
    descriptor: humanReserved,
    metadata: { authorityRef },
    authorityRef,
  });

  assert.equal(result.status, "compatible");
  assert.equal("approved" in result, false);
  assert.equal("authorized" in result, false);
  assert.equal("receipt" in result, false);
  assert.equal("signature" in result, false);
});

test("invalid human metadata fails explicitly rather than coercing authority", () => {
  const result = evaluateHumanAuthorityReservation({
    descriptor: humanReserved,
    metadata: { inferenceRef: "inference:not-human" },
    authorityRef,
  });

  assert.equal(result.status, "invalid");
  assert.match(result.diagnostic, /unexpected field inferenceRef/);
});
