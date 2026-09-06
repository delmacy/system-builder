# Generation 2 — Workflow & Durable Execution — Full Pass 7 Revisit

Status: ACTIVE — ELIGIBLE NO-NEW-MATERIAL LOCAL + CLUSTER REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Workflow & Durable Execution
Mandatory cluster exercised: Workflow × Integration × Messaging × external mutation
Prior authority: workflow edge-case register and Full Pass 2–6 revisit dossiers
Conflict-classification authority: `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`
Priority-hypothesis authority: `SEMANTIC_GRAPH_FEDERATION_SOUNDNESS_EXECUTION_PROOF_RESEARCH.md`
Reusable ConflictPattern inventory screened: 124

Research only. Preserve `Research != remediation`, `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, `model proof != execution proof`, `journal integrity != semantic/effect proof`, and `UNKNOWN != NOT_APPLIED`. This revisit authorizes no product code, Work Package, TASK, Construction, target-architecture decision or pre-emptive remediation.

## 1. Full-Pass-7 method

This revisit used a temporal-liveness and evidence-cut method materially different from Full Pass 6's proof-subtraction/redrive profile. The workflow is treated as a revision-pinned governed work algorithm executing across changing graph, authority, provider, schema, queue and external-effect conditions.

The probes were:

1. **temporal wait-boundary splice** — start a timer/wait/subscription under graph/policy/provider revision `R1`, cross an effective-time boundary into `R2`, and test whether wake-up eligibility, authority and event matching are silently reinterpreted;
2. **dynamic topology reachability cut** — preserve an in-flight instance while a graph transformation removes, replaces or remaps a node/edge required by its continuation; test stale proof reuse and orphaned wait/subscription references;
3. **retry/effect identity permutation** — vary event ID, delivery ID, correlation ID, invocation/attempt ID and business-effect identity independently across retries/redrives;
4. **UNKNOWN mutation temporal crossing** — external dispatch occurs under contract/provider `P1`, result becomes `UNKNOWN`, then binding/authority/currentness moves to `P2`; challenge reconcile-before-retry responsibility and evidence applicability;
5. **child lifecycle revision crossing** — parent and child are pinned independently; child completes after parent policy/interface/evidence profile changes; test child-proof composition without retroactive reinterpretation;
6. **late-child fan-in frontier** — bounded fan-out has success, failure, timeout and late children; vary join policy, deadline and result-arrival order under shared capacity pressure;
7. **cancellation/adoption race** — local workflow cancellation wins internally while a remote system has already adopted the effect or continues callback/result writing;
8. **compensation eligibility drift** — compensation was valid at original effect time but downstream use, policy or ownership revision later makes local inversion insufficient or unauthorized;
9. **queue-network retry storm** — individually bounded retries across multiple services create correlated arrival bursts, head-of-line blocking or priority inversion; test `bounded retries != stable network`;
10. **uncertain completion predicate** — SLA forecast, model confidence, interval or probabilistic evidence is used as a completion/branch predicate and silently collapsed to deterministic truth;
11. **provenance relation permutation** — preserve a valid trace but vary `derivedFrom`, `used`, `generatedBy`, responsibility/association and authorization evidence to detect provenance over-attribution;
12. **formalism-strengthening attack** — start from a sound restricted Workflow Net and add cancellation/reset-like behavior, data/resource/time semantics or external effects; test whether prior decidability/soundness claims are inherited without a preservation theorem;
13. **online-conformance currentness cut** — receive an incomplete prefix aligned to model `M1`, then model/revision changes to `M2`; test whether deviation or conformance is strengthened into final completion/conflict under the wrong reference revision;
14. **AI/low-code orchestration strengthening** — generated composition hides `UNKNOWN`, uncertainty, residual callbacks, revision crossing or queue instability while claiming a stronger terminal state.

The mandatory `Workflow × Integration × Messaging × external mutation` cluster is materially exercised by probes 1, 3, 4, 6, 7, 8, 9, 11 and 13.

## 2. Evidence refresh

External evidence is comparative research evidence, not an architecture prescription.

### 2.1 Soundness is fragment/profile qualified; cancellation/reset can cross decidability boundaries

Classical Workflow-Net soundness remains useful for restricted control-flow models, but richer reset/cancellation semantics materially change the formal problem. Blondin et al. (2025), *Soundness of reset workflow nets*, report undecidability for all principal soundness variants of reset workflow nets, including generalized soundness. Related work on acyclic reset workflow nets shows that restricting structure can restore decidability/tractability for some reachability/coverability questions.

Portable consequence: `sound under formal profile F` must never be inherited by a transformed workflow whose cancellation/reset/data/time/resource semantics are outside F unless a preservation result explicitly covers the transformation.

Representative sources refreshed 2026-09-06:
- https://arxiv.org/abs/2503.04440
- https://arxiv.org/abs/2310.01992

### 2.2 Durable redrive demonstrates attempt/child/quiescence distinctions

AWS Step Functions documents that a Distributed Map may continue canceling children or writing results after the parent stops or times out; redrive can wait for those operations, child redrive behavior differs by execution type, concurrency limits can leave children pending, and some failures rerun previously successful work.

Portable consequence: parent terminality, attempt identity, child lifecycle, result-writer quiescence and business-effect completion are separate claims. Same workflow definition/ARN does not prove homogeneous attempt/effect history.

Representative sources refreshed 2026-09-06:
- https://docs.aws.amazon.com/step-functions/latest/dg/redrive-map-run.html
- https://docs.aws.amazon.com/step-functions/latest/dg/redrive-executions.html

### 2.3 Online conformance is prefix/reference qualified

Online prefix-alignment literature explicitly relates streaming/incomplete traces to a reference process model. It can surface deviations before termination, but the trace is incomplete and the selected reference model is part of the claim.

Portable consequence: `prefix conforms/deviates relative to M@revision` is a qualified signal. It is not automatically a final completion certificate or a `ConfirmedConflict`.

Representative source refreshed 2026-09-06:
- https://link.springer.com/article/10.1007/s41060-017-0078-6

### 2.4 Provenance relation does not manufacture derivation, causality or authority

W3C PROV formal semantics distinguishes generation, usage, association, attribution, communication and derivation. Its semantics explicitly notes that the existence of an alternating generation/use chain does not by itself justify inferring a derivation relation.

Portable consequence: workflow trace connectivity cannot be strengthened into exact lineage, causal proof or authorization merely because events/activities are connected.

Representative sources refreshed 2026-09-06:
- https://www.w3.org/TR/prov-sem/
- https://www.w3.org/TR/prov-constraints/

## 3. Candidate findings and duplicate-screen against 124 reusable ConflictPatterns

No candidate survived duplicate-screen as a distinct 125th reusable ConflictPattern.

### 3.1 Wait/subscription wakes under a different temporal contract

Candidate: a workflow registers a timer/event wait under `R1`; by wake-up, authority/provider/schema/event contract is `R2`, and the engine applies current semantics to an `R1` instance without qualification.

Disposition: existing temporal/currentness, revision-vector, compatibility-direction, residual-cohort and authority families. Detection candidate: persist and compare registration revision/effective-time contract with wake-up/effect contract. Proof obligation: historical execution evidence names both producing and consuming temporal/revision cuts rather than rewriting old evidence through the current projection.

### 3.2 Graph rewrite orphans an in-flight continuation

Candidate: Canvas/model transformation preserves visual shape but removes/reuses a node identity, rewrites an edge or changes a wait mapping while an instance still references the former semantic element.

Disposition: existing graph-revision/proof-invalidation, qualified identity, migration-readiness and stale-proof families. Detection candidate: semantic diff + in-flight reference closure + proof invalidation/preservation assessment. No blanket ban on graph evolution is justified.

### 3.3 Stable transport identity is mistaken for business-effect identity

Candidate: retries/redrives preserve some combination of event/correlation IDs while invocation/attempt or external effect differs, or redelivery changes transport identity while representing the same effect.

Disposition: existing correlation/cardinality/effect-identity and proof-claim families. `event identity != delivery identity != attempt identity != business-effect identity` remains explicit.

### 3.4 UNKNOWN mutation crosses provider/authority revision

Candidate: effect status is `UNKNOWN` under old provider/contract, current binding changes, and a new owner retries because the current provider reports no corresponding state.

Disposition: existing ambiguous-mutation, federated-continuity, residual-provider, currentness and authority families. Detection route: bilateral correlation/effect identity + old-provider/current-provider reconciliation. Proof obligation: unresolved required `UNKNOWN` blocks strong completion and unsafe retry until operation-specific evidence qualifies disposition.

### 3.5 Child proof is valid but not composable under the parent's current profile

Candidate: child completes correctly under its pinned revision, but parent interface/evidence requirements have changed before join.

Disposition: `G2-CONFLICT-PATTERN-CERTIFICATE-COMPOSITION-001`, compatibility-direction and revision/currentness families. Valid child proof does not imply current parent acceptability; parent cannot strengthen the child's claim.

### 3.6 Bounded fan-out remains operationally unstable

Candidate: the number of children and retries is finite but synchronized bursts overload a shared service center, create pending-redrive backlog or starve higher/lower priority work.

Disposition: existing resource/capacity/fairness, queue/backpressure and proof-claim families. Detection candidate: queue-network topology, correlated arrivals, service-rate/headroom and retry amplification. `finite/bounded != stable/sustainable`.

### 3.7 Cancellation is not external revocation

Candidate: workflow reaches cancelled/aborted locally while external adoption, callback processing or result writing remains live.

Disposition: existing false-convergence, residual-work/effect, state-transition and federated-continuity families. Proof obligation: cancellation certificate states local orchestration disposition separately from child/external quiescence and business convergence.

### 3.8 Compensation validity changes after downstream adoption

Candidate: original inverse action is technically available, but ownership/policy/revision or downstream dependence changed, so local compensation no longer proves business reversal.

Disposition: existing compensation/adoption, temporal/currentness and authority families. Detection candidate: downstream adoption lineage and current compensation authority/eligibility.

### 3.9 Retry network is bounded locally but unstable globally

Candidate: each workflow/service has a retry cap, yet coupled backoff windows and shared bottlenecks synchronize retry bursts and increase queue growth.

Disposition: existing resource/capacity, cross-process and objective families. Queue instability remains an operational claim distinct from control-flow termination/soundness.

### 3.10 Uncertainty is collapsed into terminal truth

Candidate: forecast/confidence/probability/interval is treated as deterministic satisfaction of a required condition or SLA/effect postcondition.

Disposition: `G2-CONFLICT-PATTERN-ANALYTICAL-KIND-CONFLATION-001` plus decision/uncertainty/proof-claim families. Preserve `UNKNOWN != probabilistic uncertainty != bounded interval != model confidence`.

### 3.11 Provenance chain is promoted to causal or authorization proof

Candidate: because activity/event lineage is connected, the system infers exact derivation, causal responsibility or authority to execute/approve.

Disposition: `G2-CONFLICT-PATTERN-PROVENANCE-EDGE-OVERATTRIBUTION-001` plus semantic-owner/authority families. Detection candidate: explicit relation kind and evidence source/currentness; no inferred Cartesian or causal/authority strengthening.

### 3.12 Soundness claim survives an unsupported semantic extension

Candidate: a control-flow model proved sound under an ordinary Workflow-Net profile is extended with reset/cancellation behavior, priorities, data/time/resources, recursion or external effects and keeps the old proof label.

Disposition: `G2-CONFLICT-PATTERN-PROOF-CLAIM-CONFLATION-001`, graph-transformation/proof-invalidation and compatibility-direction families. The 2025 reset-workflow-net result strengthens the proof obligation but does not create a new conflict family.

### 3.13 Online conformance uses stale reference revision

Candidate: a prefix deviation/conformance is computed against `M1` while the instance is actually pinned to `M0` or migrated to `M2`, and the result is promoted to final conflict/completion.

Disposition: existing conformance/currentness/proof-claim families. Detection candidate: bind case identity, model revision, trace completeness and analysis profile. Deviation remains `Signal != ConfirmedConflict` until owner-qualified assessment.

### 3.14 AI/low-code hides weak evidence behind terminal state

Candidate: generated orchestration converts unresolved external effect, uncertain evidence, stale child proof or queue backlog into a `completed` surface state.

Disposition: existing AI non-amplification, analytical-kind, currentness and proof-claim families. No new pattern.

## 4. Formal-assurance disposition

The portable proof lattice remains deliberately non-collapsible:

`definition soundness != liveness/termination under environment assumptions != queue stability/deadline feasibility != execution conformance != journal integrity != external-effect proof != child/external quiescence != business convergence`.

For loops/recursion, later architecture/proof work may use ranking/variant functions over well-founded orders, explicit iteration/depth/time/resource budgets, temporal logic/model checking or SAT/SMT for bounded fragments where appropriate. This revisit does not claim one universal termination procedure. The decidability result for reset workflow nets is evidence against assuming that arbitrary rich workflow semantics admit a single complete verifier.

For `WorkflowCompletionCertificate` / `ProcessProofBundle`, the hypothesis remains useful only if the verifier can distinguish proof domains and return `UNKNOWN/INCONCLUSIVE` when evidence is insufficient. At minimum the proof hypothesis must bind graph/workflow revision, build/deployment identity, input commitments, attempt lineage, node/edge identities, trace, child proof refs, external effect dispositions, outputs, terminal state, invariants, unresolved UNKNOWNs and journal-integrity commitment. A cryptographic commitment proves neither workflow semantics nor external occurrence by itself.

## 5. Detection candidates and proof obligations carried forward

Research candidates only:

1. **temporal wait-contract binding** — waits/timers/subscriptions bind registration and wake-up effective-time/revision semantics;
2. **historical non-rewrite** — current graph/policy/provider projection cannot silently reinterpret producing historical evidence;
3. **graph-transformation proof invalidation** — semantic diff determines which soundness/conformance/mapping/proof claims are preserved, invalidated or weakened;
4. **formal-profile binding** — every soundness/reachability/liveness result names the exact formal fragment and assumptions; unsupported cancellation/reset extensions invalidate inheritance;
5. **termination qualification** — loops/recursion require an explicit proof/bound/budget appropriate to the chosen semantics; absence remains unproven, not implicitly safe;
6. **attempt/effect identity separation** — retry/redrive lineage preserves event, delivery, correlation, attempt and business-effect identities without conflation;
7. **UNKNOWN reconcile-before-retry** — ambiguous mutating effects preserve owner and provider/contract revision across substitution until disposition is proven;
8. **child-proof composability** — valid child proof must match the exact parent interface/evidence/revision profile and cannot be strengthened by composition;
9. **quiescence qualification** — parent terminal/cancel state is separate from child, callback, result-writer and external-effect quiescence;
10. **queue-stability qualification** — finite fan-out/retry bounds do not prove sustainable capacity; analysis carries arrival/service assumptions and shared-bottleneck topology;
11. **uncertainty-kind preservation** — interval/distribution/probability/model-confidence/UNKNOWN cannot silently become deterministic branch or terminal truth;
12. **provenance relation discipline** — `derivedFrom != causedBy != authorizedBy`; exact lineage is asserted/observed/inferred with evidence and revision/currentness;
13. **online-conformance qualification** — prefix result binds reference model/revision, trace completeness and analysis mode and remains a signal until assessed;
14. **offline verifier non-strengthening** — missing external/current/child/trace evidence yields `UNKNOWN/INCONCLUSIVE`, never fabricated `PROVEN_COMPLETED`;
15. **AI/low-code non-strengthening** — generated orchestration cannot amplify authority, certainty, effect disposition, proof strength or causal/provenance claims.

Planning E should later prove at least: sound simple workflow; bounded loop/recursion; invalid/deadlocking graph rejection; trace conformance; tamper detection; external `UNKNOWN` preventing false completion; child-proof composition; offline verifier; stale reference-revision rejection; wait/timer revision-cut qualification; parent-terminal-with-live-child rejection under strong completion profile; cancellation-with-residual-external-work distinction; bounded-local-retries/global-queue-instability case; and reset/cancellation semantic extension invalidating an unsupported prior soundness proof.

## 6. Saturation disposition

Result: **ELIGIBLE NO-NEW-MATERIAL LOCAL + CLUSTER REVISIT**.

- new local material edge scenarios: **0**;
- new cross-capability material scenarios: **0**;
- new reusable ConflictPatterns: **0**;
- new ConflictInstances asserted: **0**;
- new preventive invariant candidates: **0**;
- HIGH/CRITICAL without owner/proof/detection route introduced: **0**;
- Workflow & Durable Execution local no-material streak remains capped at **2**;
- Workflow × Integration × Messaging × external mutation cluster streak remains capped at **2**;
- Full Pass 7 capability coverage becomes **3/28**;
- Full Pass 7 mandatory-cluster coverage becomes **3/12**;
- completed full passes remain **6/8 minimum**;
- target remains **12**, no maximum;
- inventory remains **284 edge scenarios + 124 ConflictPatterns = 408 material findings**;
- negative-space remains `NOT_STARTED`;
- saturation remains `NOT_SATURATED`;
- Planning C remains `BLOCKED`.

## 7. Next rotation

Continue only `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`, Full Pass 7, with **Data / Schema / Migrations** and explicitly exercise **Data/Schema × Privacy × Storage × Lifecycle**. Use techniques materially different from prior passes and this temporal-liveness workflow revisit. Carry temporal valid-time/transaction-time, provenance/field lineage, decision/calculation ownership, dimensional analysis, uncertainty, graph/schema transformation invalidation, queue/capacity effects on migrations, causal non-strengthening and execution-proof boundaries into data/schema evolution. Challenge bitemporal corrections, in-flight revision pins, presence semantics, non-commutative writes, schema-valid-but-semantic-invalid values, field-level lineage loss, unit/currency/timezone transformations, uncertain data quality, partial migration, dual-write cohorts, restore/migration races, journal-schema evolution, child input/output commitments, cross-system handoff, `PARTIAL/UNKNOWN` data mutations and AI/low-code transformations that preserve shape while changing semantic kind/authority. Duplicate-screen all 124 ConflictPatterns. Data local streak and the mandatory cluster streak are already capped at 2 and must not inflate absent material novelty. Do not enter Planning C.