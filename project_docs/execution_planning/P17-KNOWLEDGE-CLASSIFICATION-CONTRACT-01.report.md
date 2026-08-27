# P17-KNOWLEDGE-CLASSIFICATION-CONTRACT-01 — Sprint Report

## Scope

Construction A for `P17-PACKAGE-01 — Knowledge Classification & Use Policy Foundation`, limited to WBS 17.1.1–17.1.3 contract foundations. No WBS 17.2 enforcement or WBS 17.3 promotion/anonymization behavior was executed.

## Authoritative TASK chain

| TASK | Commit | Evidence before successor |
| --- | --- | --- |
| TASK-355 | `1e20324197b15ef4e31628e62371cb1b259c7f69` | Deterministic CI #979 PASS / Heavy Product Tests #422 PASS |
| TASK-356 | `e8d96dd0142c3e911f2d5d5152150628e5f9727a` | Deterministic CI #980 PASS / Heavy Product Tests #423 PASS |
| TASK-357 | `4a4305a221d370b3ee46700a0a4425a472dd9309` | Deterministic CI #982 PASS / Heavy Product Tests #426 PASS |
| TASK-358 | `36d616ebb71eff20c1d605624aa9331ea282f21a` | Deterministic CI #983 PASS / Heavy Product Tests #427 PASS |
| TASK-359 | `f4854d438551396afbc6f35268d89fea99725a6a` | Deterministic CI #984 PASS / Heavy Product Tests #428 PASS |
| TASK-360 | `5b1b9152c2236c11285e21ecd8d29dab9877ab8b` | Deterministic CI #985 PASS / Heavy Product Tests #429 PASS |
| TASK-361 | Construction A growing proof | completed before conformance review |
| TASK-362 | bounded conformance correction | exact-head final CI/Heavy required before Sprint Review |

## Delivered boundary

- four canonical knowledge classes: `generic`, `client-proprietary`, `personal`, `trade-secret`;
- explicit normalized ownership reference;
- provider-neutral purpose/use restriction descriptor with deterministic canonicalization and no inferred reuse permission;
- explicit manual vs assisted classification decision record;
- final classification decisions now consume the canonical M15 Decision Boundary and must verify as `human-decision`; `decisionActorRef` must match the verified human `authorityRef`;
- assisted proposal contract with bounded confidence plus model/context/evidence references, remaining non-authoritative;
- deterministic aggregate normalization across class/owner/use-policy/decision contracts with fail-closed mismatch detection;
- payload-minimal traceability projection carrying only class/owner/purpose and stable decision/proposal/evidence references.

## Integrated proof

The Construction A product proof exercises all four classes through exported APIs, validates manual and assisted paths, proves proposal-only data cannot satisfy the final decision contract, proves deterministic/probabilistic Decision Boundary categories cannot substitute for human authority, proves absent/invalid purpose restrictions do not become permission, and proves payload/secret/provider/promotion-authority fields are rejected from the evidence projection.

## Deviations and discoveries

A conformance review after TASK-361 found a material authority-semantic gap: TASK-357/TASK-361 described the final classification as an explicit human decision, while the implementation accepted any non-empty `decisionActorRef`/`decisionRef`. Therefore an actor such as `model:classifier` could satisfy the final Knowledge Boundary record even though M15 already defines `human-decision` as a distinct authority category.

TASK-362 corrects this within committed WBS 17.1.2 scope without changing the Decision Boundary public contract. `KnowledgeClassificationDecision` now carries explicit Decision Boundary input normalized and verified through `verifyDecisionBoundary(... expectedCategory: "human-decision")`; the verified `authorityRef` must equal `decisionActorRef`. A semantic architecture gate reproduces and rejects the prior actor-only anti-pattern so future contracts cannot silently equate non-empty actor references with human authority.

No WBS 17.2/17.3 behavior, provider topology, promotion authority, unrelated conformance/productization finding or `TD-P13-01..04` was absorbed.

## Construction B disposition

`P17-KNOWLEDGE-CLASSIFICATION-INTEGRATION-01` remains `FORECAST / NOT MATERIALIZED`. Construction A proves the contract boundary only. Promotion/materialization of Construction B requires TASK-362 exact-head Deterministic CI + Heavy Product Tests PASS, Sprint Review + merge, then fresh-main evidence showing a real consumer-integration gap. This report does not itself authorize or materialize Construction B.

## Exit condition

Construction A remains `CORRECTION_PENDING` and is not eligible for Sprint Review/merge until the exact head containing TASK-362 passes all required deterministic and heavy product gates with no blocking review finding or head drift.
