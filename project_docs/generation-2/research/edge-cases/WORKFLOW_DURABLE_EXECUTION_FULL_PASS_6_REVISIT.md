# Generation 2 — Workflow & Durable Execution — Full Pass 6 Revisit

Status: ACTIVE — ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Workflow & Durable Execution
Explicit mandatory cluster: Workflow × Integration × Messaging × external mutation
Disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`

Research only. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, `Research != remediation`, `definition/model proof != execution proof`, `ExecutionJournal != runtime/business truth`, and `provider/event acknowledgement != business effect`. No product code, Work Package, TASK, Construction, remediation or Planning C is authorized.

## 1. Full-Pass-6 attack profile

This revisit used a proof-falsification profile materially different from Passes 1–5. The Typed Semantic Graph/Federation and completion-certificate concepts remain hypotheses, not target-architecture decisions.

The sweep attempted to falsify a provisional `PROVEN_COMPLETED` claim by independently mutating or removing obligations while holding other evidence apparently valid:

1. **soundness/fairness differential** — a restricted Workflow-Net-style model has option-to-complete/proper-completion/no-dead-transition properties, while execution introduces unfair scheduling, cancellation, data guards, time/resource limits or external actors; test whether model soundness is strengthened into inevitable runtime termination;
2. **attempt-lineage splice** — preserve workflow definition and logical execution identity while inserting redrive/retry attempts with different timeout/resource budgets and partial prior effects; test whether flattened history hides materially different attempt semantics;
3. **child-quiescence subtraction** — parent reaches a terminal state while asynchronous/detached descendants, result writers, callbacks or cancellation cleanup remain active; test whether parent terminality is promoted to descendant/effect quiescence;
4. **UNKNOWN-effect cut** — external mutation times out after dispatch, transport evidence is absent, and a retry/redrive is proposed; test whether `UNKNOWN` is silently collapsed to `NOT_APPLIED`;
5. **event/correlation/effect identity permutation** — duplicate, reorder or redeliver events while preserving one or more transport identifiers; test whether event identity/correlation identity is incorrectly treated as canonical effect identity;
6. **partial fan-out/fan-in proof subtraction** — successful children retain valid evidence while failed/cancelled/timed-out children are redriven or replaced; test whether a join consumes a mixed proof set as one homogeneous completion claim;
7. **compensation-after-adoption cut** — one branch compensates a locally successful effect after another process/system has already adopted it; test whether local compensation is promoted to global reversal;
8. **federated callback residue** — provider/system binding is substituted while callbacks, webhooks, queues or child executions from the old realization remain live; test whether current binding is treated as proof that old effect producers are gone;
9. **journal truncation / online-conformance differential** — retain a prefix alignment, summary or integrity commitment while older trace detail is unavailable; test which claims remain supportable and whether deviation signals are promoted to confirmed conflict;
10. **AI/low-code proof strengthening** — compose individually valid nodes, retries, detached children and compensation paths so a generated workflow claims stronger terminal/effect semantics than its evidence profile supports.

GraphDB remains only a storage/provider hypothesis. Relational typed graph persistence, bounded JSONB configuration, append-only/event journals and optional projections remain viable research alternatives. Fleet/Canvas remain non-authoritative projections; autonomous builds retain local runtime/business truth.

## 2. Formal-assurance result

Classical Workflow-Net soundness remains useful but profile-qualified. The standard soundness dimensions — option to complete, proper completion and absence of dead transitions — reason over a selected formal model. Importantly, option-to-complete is an existential reachability property from every reachable marking; eventual completion additionally depends on assumptions such as fairness. Therefore a future verifier must not translate `sound WF-net` into `every real execution necessarily terminates correctly` once scheduling, external actors, cancellation, priorities, time, data, resources or provider effects are introduced.

Portable distinction retained:

`definition soundness != termination under runtime assumptions != execution conformance != journal integrity != external-effect proof != business convergence`.

No new ConflictPattern is required. Overclaiming across these proof domains remains `G2-CONFLICT-PATTERN-PROOF-CLAIM-CONFLATION-001` plus qualified currentness/authority/effect-evidence families.

Conformance checking also remains evidence-qualified. Online prefix-alignments deliberately operate on incomplete traces because more events can arrive later; a detected deviation is a strong signal relative to the selected reference model/profile, but a partial prefix cannot prove final completion and approximation/retention strategies can trade memory for conformance detail. This supports treating online conformance as `Signal`, not automatic `ConfirmedConflict`, and requiring the model revision, case identity, event completeness/currentness and analysis profile to qualify any claim.

## 3. Durable execution / cluster findings

No distinct material local edge scenario, cross-capability scenario or reusable ConflictPattern survived duplicate-screen against all 123 reusable patterns.

The strongest candidates reduced as follows:

- **Sound model but runtime non-termination under unfair scheduling/resource starvation or richer semantics** -> proof-claim-conflation, resource/capacity and temporal/liveness families. Soundness of the restricted model does not prove environmental fairness or completion under omitted semantics.
- **Redrive preserves logical definition/input while timeout/resource budget or attempt history changes** -> revision/currentness, replay divergence, resource-bound and qualified-history families. Same definition/identity does not imply identical operational attempt semantics.
- **Successful prior steps are preserved while failed branches/children are rerun** -> effect identity + historical lineage + certificate composition. Preserved success evidence must be joined with new attempt/effect lineage rather than treated as a fresh atomic execution.
- **Parent terminal state while child/map/callback/result writing remains active** -> state-transition/currentness, residual cohorts, acknowledgement/effect and proof-claim-conflation families. Parent terminality is not composite quiescence.
- **External timeout/transport failure followed by redrive** -> ambiguous mutation/idempotency family. `UNKNOWN -> reconcile-before-retry` remains mandatory where effect application cannot be proven.
- **Duplicate/reordered delivery with stable transport identity** -> correlation/cardinality and effect-identity families. Event/delivery/correlation identity is not canonical business-effect identity.
- **Fan-in over mixed original/redriven child proofs** -> `G2-CONFLICT-PATTERN-CERTIFICATE-COMPOSITION-001` plus revision/effect lineage. Parent claims may not become stronger than the weakest required child evidence profile.
- **Compensation after downstream adoption** -> exception/compensation/recovery + cross-process adoption families. A local inverse action is not proof that downstream business truth reverted.
- **Old provider callbacks after substitution** -> residual-provider-cohort/currentness + `G2-CONFLICT-PATTERN-FEDERATED-CONTINUITY-001`. Current binding does not erase prior effect producers or bilateral reconciliation obligations.
- **Truncated/compacted journal still has valid root/hash commitment** -> proof-claim-conflation. Integrity of retained commitments does not recreate omitted semantic evidence needed for execution/effect verification.
- **Online conformance deviation on an incomplete trace** -> model/runtime-conformance signal family. A deviation may justify investigation but remains `Signal != ConfirmedConflict` unless evidence and reference revision qualify the assertion.
- **AI/low-code generated retry/cancel/detached-child composition strengthens completion semantics** -> AI non-amplification + proof-claim-conflation + structural/lifecycle families.

No `ConflictInstance` is asserted. No blanket preventive invariant is elevated: asynchronous children, retries, redrive, compensation, detached work, partial fan-out, federation and provider substitution are legitimate when their semantics and proof obligations are explicit.

## 4. External evidence and portable implications

AWS Step Functions provides concrete industrial witnesses without prescribing System Builder architecture:

- `RedriveExecution` continues an unsuccessful Standard workflow from the unsuccessful state, preserves successful prior results/history, uses the same state-machine definition/execution ARN, and appends redrive history;
- redrive can selectively rerun failed/aborted Parallel/Map work, while some failure modes rerun successful branches as well;
- a Distributed Map can have child workflows with different redrive behavior, eligibility and concurrency constraints;
- a Map Run can continue operations after the parent stops/times out while children are being cancelled/completed or results are still being written;
- state-machine-level timeout is reset for a redrive, showing that replay/redrive may preserve definition identity while changing an execution-time budget dimension.

Portable implication: execution identity/definition pinning, event history and terminal state must be qualified by attempt lineage, child/effect state and resource/time semantics before a stronger completion claim is made.

Representative sources:
- https://docs.aws.amazon.com/step-functions/latest/dg/redrive-executions.html
- https://docs.aws.amazon.com/step-functions/latest/dg/redrive-map-run.html
- https://docs.aws.amazon.com/step-functions/latest/apireference/API_RedriveExecution.html

Process-mining literature on online conformance checking provides another boundary witness: prefix-alignments relate a streaming/incomplete trace to a reference process model without assuming the case has terminated; deviations can be identified incrementally, while memory/approximation choices affect retained evidence and alignment optimality. Portable implication: conformance evidence must expose trace completeness, model revision and analysis mode, and must not silently become a final completion certificate.

Representative source:
- https://link.springer.com/article/10.1007/s41060-017-0078-6

Classical Workflow-Net literature remains the formal baseline for option-to-complete, proper completion and dead-transition freedom, but those claims must remain bound to the analyzed formal fragment and assumptions.

## 5. Detection candidates and proof obligations

Detection candidates remain research inputs, not implementation commitments:

- static: control-flow reachability/deadlock/dead-transition analysis for the declared formal fragment; join satisfiability; child-proof-profile compatibility; explicit recursion/loop/fan-out bounds; declared detach/cancel/compensation semantics;
- pre-execution: pin/requalify workflow/build/provider/child revisions, authority, resource/time budgets, effect/idempotency contracts and callback ownership;
- runtime: attempt/redrive lineage, child lifecycle/quiescence, residual callbacks, competing/duplicate effect identities, stalled joins, budget exhaustion and unresolved `UNKNOWN` mutation;
- online conformance: revision-qualified prefix alignment/deviation signal with explicit incomplete-trace semantics;
- post-effect/reconciliation: compare expected postconditions with provider/business truth, downstream adoption, compensation disposition, child proofs and federated handoff evidence;
- offline verifier: independently verify model/profile, attempt lineage, trace completeness, integrity commitment, child proof refs, external effect evidence and unresolved UNKNOWNs; absence of required evidence yields `UNKNOWN/INCONCLUSIVE`, not `PROVEN_COMPLETED`.

Proof obligations carried to Planning C/D/E and Architecture Reconciliation:

1. **formal-profile binding** — every soundness/liveness claim names the exact workflow semantics and assumptions analyzed;
2. **fairness/non-strengthening** — option-to-complete or reachability must not be promoted to inevitable termination without the required fairness/environment assumptions;
3. **attempt-lineage binding** — completion evidence binds original + retry/redrive attempts, including timeout/resource-budget resets and which prior results were reused;
4. **quiescence obligation** — parent completion and child/detached/external-effect quiescence are separate claims; a certificate states which is proven;
5. **effect-disposition obligation** — required external effects are `APPLIED/NOT_APPLIED/PARTIAL/UNKNOWN` with current evidence; unresolved required `UNKNOWN` blocks `PROVEN_COMPLETED`;
6. **event/correlation/effect separation** — transport/event/correlation identity cannot substitute for qualified business-effect identity;
7. **child-proof monotonicity** — parent proof cannot strengthen child claims and must preserve child revision/effect/UNKNOWN lineage across mixed attempts;
8. **compensation/adoption obligation** — compensation evidence distinguishes local inverse action from global/downstream convergence;
9. **federated residual responsibility** — provider/system substitution preserves responsibility and reconciliation for old callbacks/effects until disposition is proven;
10. **conformance-evidence qualification** — online/prefix or approximate conformance exposes model revision, trace completeness, approximation/retention mode and confidence; deviation remains a signal until owner-qualified assessment;
11. **journal-retention qualification** — cryptographic integrity of retained history cannot substitute for semantic evidence that was never recorded or no longer available;
12. **AI/low-code non-strengthening** — generated composition may not claim stronger termination, effect or proof semantics than the composed contracts/evidence support.

Planning E should later include acceptance proofs for: sound simple workflow; bounded loop/recursion; invalid/deadlocking graph rejection; trace conformance; tamper detection; external `UNKNOWN` preventing false completion; child-proof composition; offline verifier; redrive/attempt-lineage preservation; parent-terminal-with-live-child rejection for a strong completion profile; and deviation-signal behavior for incomplete online traces.

## 6. Preventive-invariant review

No new preventive invariant candidate is elevated. Existing universal/material candidates are sufficient: ambiguous mutating effects require reconciliation before unsafe retry; completion/proof claims may not be strengthened beyond their evidence domain; AI/low-code may not amplify authority; currentness/revision/effect identity remains qualified; and local terminal/history state is not proof of external convergence.

Static rejection should be reserved for compositions proven invalid under the declared formal/semantic profile. Richer but legitimate constructs should instead surface boundedness, UNKNOWN or runtime/post-effect obligations rather than be globally forbidden.

## 7. Saturation result

Result: **ELIGIBLE NO-NEW-MATERIAL REVISIT**.

- new local edge scenarios: `0`;
- new cross-capability scenarios: `0`;
- new reusable ConflictPatterns: `0`;
- new preventive invariant candidates: `0`;
- ConflictInstances asserted: `0`;
- Workflow & Durable Execution local no-material streak remains capped at `2`;
- Workflow × Integration × Messaging × external mutation cluster streak remains capped at `2`;
- Full Pass 6 coverage after this revisit: `3/28` capabilities and `3/12` mandatory clusters;
- inventory remains `284` edge scenarios + `123` ConflictPatterns = `407` material findings;
- HIGH/CRITICAL without owner/proof/detection route: `0`;
- negative-space: `NOT_STARTED`;
- saturation: `NOT_SATURATED`;
- Planning C: `BLOCKED`.

## 8. Next rotation

Continue only `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`, Full Pass 6, with **Data / Schema / Migrations** and explicitly exercise **Data/Schema × Privacy × Storage × Lifecycle** using techniques materially different from Passes 1–5. Carry the formal-assurance front into typed data-flow and execution evidence: schema/semantic compatibility versus value-level validity, presence semantics, canonical fact ownership, multi-writer/non-commutative deltas, pinned workflow/schema revision vectors, historical snapshots versus live recomputation, sensitive-data propagation through envelopes/proofs, artifact/reference invalidation, migration/restore cohorts, journal/schema evolution, child proof input/output commitments, cross-system data handoff, `PARTIAL/UNKNOWN` data effects, resource/cardinality limits and AI/low-code transformations that preserve shape while changing semantic kind/authority. Duplicate-screen all 123 ConflictPatterns. Data local streak and Data×Privacy×Storage×Lifecycle cluster streak are already `2` and must not be inflated. Preserve Fleet non-authority and GraphDB optionality. Do not enter Planning C.