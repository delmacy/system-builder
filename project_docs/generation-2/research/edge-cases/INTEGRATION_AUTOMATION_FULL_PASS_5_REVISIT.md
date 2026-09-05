# Generation 2 — Integration & Automation — Full Pass 5 Revisit

Status: ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Integration & Automation
Pass: 5

Research only. No product code, Work Package, TASK, Construction or concrete remediation is authorized. Preserve `ConflictPattern != ConflictInstance` and `Signal != ConfirmedConflict`. Default disposition remains `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

## 1. Authority and method

This revisit follows `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md` and `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`. It carries the current architecture-research hypothesis — `Typed Semantic Graph` as a possible canonical IR, capability-use nodes, executable workflow/subworkflow subgraphs, `ExecutionEnvelope + delta + ExecutionJournal`, autonomous build/runtime realizations and non-authoritative Fleet observability — into Integration & Automation without promoting that hypothesis to architecture fact.

Techniques rotated in this pass: graph cut and dependency-closure mutation; trigger/action revision-product analysis; invocation/event/callback identity aliasing; callback authenticity versus currentness; enable/disable/update race braiding; residual provider subscription cohorts; replay/redrive after downstream adoption; partial-batch and UNKNOWN-effect reasoning; queue/backpressure/reordering analysis; hidden shared resource/authority analysis; cross-process compensation conflicts; human procedure contradiction; objective-priority inversion; and AI/low-code fan-out/target-population mutation.

All candidate findings were duplicate-screened against the authoritative inventory of 119 reusable `G2-CONFLICT-PATTERN-*` patterns.

## 2. Adversarial graph/workflow-composition probes

### 2.1 Typed graph reachability is not qualified invocation closure

A semantic edge from trigger/capability-use A to operation B can be structurally reachable and type-compatible while the realized invocation is not currently executable: the required provider binding can be absent, unsupported for the selected operation revision, disabled, rate-limited, offline, policy-ineligible, or only partially deployed to the relevant runtime cohort. Conversely, an old provider-side registration can remain active after the canonical edge is withdrawn.

Candidate detection stages: static graph support check, pre-execution binding/currentness qualification, runtime residual-registration detection and post-effect reconciliation. False-positive risk is high if static analysis treats optional/provider-specific realizations as universally required. This remains covered by existing provider-support/currentness, compatibility-direction, residual-cohort and false-convergence conflict families; no new pattern is justified.

### 2.2 Trigger, event, delivery, invocation and business effect are distinct identities

A graph node or event edge may carry one canonical operation identity while transport/provider layers expose delivery IDs, callback IDs, request IDs or retry tokens. CloudEvents defines event identity in the qualified namespace `(source, id)` and explicitly allows replay to reuse an event `id`; GitHub keeps a webhook delivery GUID constant across redeliveries. Therefore equality of one identifier cannot prove equality of invocation, business effect, current eligibility or safe redrive.

Detection candidate: typed identity namespaces plus correlation-cardinality checks, followed by effect-lineage reconciliation when mutation outcome is ambiguous. False-positive risk arises if legitimate replay or fan-out is treated as duplicate effect automatically. Existing qualified-identity, correlation/cardinality, ambiguous-mutation/idempotency and retry-after-adoption patterns cover this.

Evidence:
- CloudEvents primer, core `id` semantics — https://github.com/cloudevents/spec/blob/main/cloudevents/primer.md
- GitHub webhook failed-delivery/redelivery guidance — https://docs.github.com/en/webhooks/using-webhooks/automatically-redelivering-failed-deliveries-for-a-repository-webhook

### 2.3 Successful delivery is not successful or current business effect

Transport acceptance, webhook HTTP success or connector acknowledgement can establish only a transport-level fact. It does not prove that the receiving system applied the intended canonical mutation, that the mutation remains eligible after later state/authority changes, or that all downstream subgraphs converged.

GitHub documents that failed webhook deliveries are not automatically redelivered and that manual/programmatic redelivery is possible; this separates delivery lifecycle from application/business state. A redelivery decision therefore needs current semantic qualification rather than assuming a failed transport attempt means `NOT_APPLIED` or that a prior success means current convergence.

Detection candidates: runtime/post-effect observation against canonical postconditions and qualified effect identity. Existing acknowledgement-versus-effect, partial/UNKNOWN-effect, currentness and reconciliation patterns cover this candidate.

Evidence:
- GitHub handling failed webhook deliveries — https://docs.github.com/en/webhooks/using-webhooks/handling-failed-webhook-deliveries
- GitHub redelivering webhooks — https://docs.github.com/en/webhooks/testing-and-troubleshooting-webhooks/redelivering-webhooks

### 2.4 Graph update versus residual callback/subscription cohort

A trigger/action node can be disabled, deleted or rebound in the canonical graph while a provider-side webhook, subscription, queue consumer, cached secret, scheduler or offline connector still emits work under the old revision. The inverse can also occur: provider realization is withdrawn while the canonical graph still presents the edge as enabled.

Activation conditions: revision change plus asynchronous/provider-managed registration lifecycle. Incompatible claims: canonical graph says inactive/new binding while residual realization continues to mutate or callback. Owners: Integration & Automation semantic owner plus provider/binding realization owner and affected domain owner. Severity range: MEDIUM–CRITICAL depending on mutation scope; blast radius from workflow instance to external parties; reversibility from easy to potentially irreversible; time-to-harm immediate or delayed; misuse likelihood plausible; evidence currentness must include provider registration/runtime cohort state. Detection: pre-execution/currentness check, runtime residual-cohort signal, post-effect reconciliation. False-positive risk: intentionally draining old cohorts. Future remediation route when observed: reconcile cohort, quiesce/isolate residual path, or explicitly adopt/migrate revision. Existing residual-cohort/cutover/false-convergence patterns cover this reusable class.

### 2.5 `ExecutionEnvelope + delta` can hide duplicate semantic ownership

Two individually valid automation nodes can both emit deltas for the same canonical field/resource through different aliases or connector mappings. A deterministic mechanical merge does not make the semantic ownership conflict safe; last-write-wins can merely hide the contradiction. The same issue appears when one node writes a provider-native projection while another writes the canonical fact.

Detection candidates: static semantic-owner/type checks, read/write and write/write conflict analysis, pre-execution owner qualification, and runtime competing-authoritative-effect detection. False-positive risk: legitimate commutative/mergeable fields or explicitly multi-writer CRDT-like semantics. Existing semantic-ownership, data-consistency, presence-semantics and competing-authoritative-mutation patterns cover this; no new universal invariant beyond qualified owner semantics is justified in research.

### 2.6 Presence semantics across graph edges remain non-isomorphic

A typed edge that maps `ABSENT`, omission, explicit `null`, explicit default and delete across APIs/connectors can preserve structural type validity while changing business meaning. The graph cannot infer equivalence merely from JSON/schema compatibility. This remains the already catalogued presence-semantics class and `G2-EDGE-INTEGRATION-008`, not a new edge.

### 2.7 Partial batch, fan-out and impossible aggregate closure

A fan-out node may invoke N external mutations and receive a mixture of `APPLIED`, `NOT_APPLIED`, `PARTIAL` and `UNKNOWN`. A downstream join can be structurally live yet semantically impossible to close if it assumes one aggregate boolean success, loses per-effect identity, or waits forever for outcomes that the provider cannot supply.

Detection candidates: static join/cardinality obligations, bounded fan-out analysis, runtime outcome lattice checks, timeout/quiescence detection and reconciliation. False-positive risk: workflows that explicitly allow quorum/partial success. Existing structural dead-join, partial/UNKNOWN-effect, effect-cardinality, resource/fan-out and qualified-convergence patterns cover this candidate.

### 2.8 Manual redrive after downstream adoption

A failed or ambiguous integration step can be retried manually after later workflow branches, human procedures or external systems have adopted an outcome. Redrive using the same delivery/event identity does not prove semantic replay safety. The operator instruction can itself be locally valid yet conflict with current process state.

Detection candidates: pre-redrive currentness/adoption check, effect identity and compensation lineage, authority re-evaluation. Owners: Integration, affected domain owner and procedure/authority owner. Future remediation route when observed: reconcile before retry, require human reconciliation or bounded compensation. Existing retry-after-adoption, human-procedure, compensation and currentness patterns cover this.

### 2.9 Hidden shared mutable resources and cross-process automation conflict

Two graph subflows can be individually valid and have disjoint visible data paths while mutating the same hidden external resource: provider quota, remote inventory, account balance, rate-limit bucket, subscription object, shared credential or external record. Static closure based only on declared payload dependencies can therefore produce a false claim of independence.

Detection candidates: declared resource/effect footprints, provider capability metadata, pairwise/N-wise cross-process analysis and runtime contention/backpressure signals. False-positive risk is substantial where resources are shareable or provider-managed. Existing resource/capacity, semantic ownership, provider conflict and cross-process patterns cover the class.

### 2.10 Queue/backpressure/reordering can invert intended graph order

A semantic graph can encode A-before-B while async realizations through independent queues/providers provide only partial ordering or no common order. Backpressure can delay A while B proceeds through another path; retry can also arrive after a later event. Static topology is therefore insufficient evidence of runtime happens-before.

Detection candidates: transport ordering capability qualification, causal/correlation metadata, runtime sequence/currentness checks and post-effect reconciliation. Existing temporal/ordering, compatibility-direction and provider-semantics patterns cover this.

### 2.11 Fleet/local evidence comparability is not authority

A Fleet aggregate or exported telemetry can suggest that automation revision R is enabled, healthy or converged while local provider registrations, queues, secrets, callbacks or external effects disagree. Aggregation may hide missing cohorts or stale evidence. Fleet remains non-authoritative by default; `semantic topology != build topology != deployment topology != runtime truth != local evidence != exported telemetry != Fleet aggregate != control authority`.

Detection candidates: evidence-window/currentness metadata, cohort completeness checks and local reconciliation. Existing observability coverage/currentness/false-convergence patterns cover the risk.

### 2.12 AI/low-code can widen target population or external mutation scope without adding a new primitive

An AI or low-code composer can connect individually authorized trigger/action nodes into a graph that broadens fan-out, target population, invocation frequency, external mutation scope or resource cost beyond the author's effective authority/objective envelope. The unsafe property emerges from composition, not from an intrinsically unsafe node.

Detection candidates: static authority/resource/effect-footprint composition, pre-execution current authority qualification and runtime scope/cardinality monitoring. False-positive risk: intentionally delegated bulk automation. Existing AI/low-code composition, authority non-amplification, objective and resource/cardinality patterns cover this candidate.

## 3. Conflict-class coverage and disposition

The revisit deliberately challenged structural graph, state-transition, semantic ownership, rule/condition, temporal/ordering, resource/capacity, authority/responsibility/SoD, policy/compliance, data/consistency, provider/integration, version/migration/coexistence, exception/compensation/recovery, human-procedure, cross-process, objective/optimization and AI/low-code composition conflicts.

No candidate survived duplicate-screen as a new reusable material `ConflictPattern`, new capability-specific material edge or new mandatory-cluster scenario. No concrete `ConflictInstance` was asserted. No detector signal was promoted to confirmed conflict.

The strongest architecture-research conclusion remains a separation obligation, not a remediation decision: **semantic graph reachability and static type compatibility cannot by themselves prove runtime realizability, qualified effect identity, current authority, provider convergence or semantic replay safety**.

`GraphDB` remains only a storage/provider hypothesis. Relational typed graph representations, JSONB documents, event/journal stores and optional graph projections remain compatible research options; graph semantics must not be coupled to one database technology.

## 4. Saturation disposition

- new local material edge scenarios: **0**;
- new cross-capability scenario IDs: **0**;
- new reusable ConflictPatterns: **0**;
- new preventive invariant candidates: **0**;
- Integration & Automation local no-material streak: **1 → 2**;
- mandatory-cluster streaks: **unchanged / capped at 2**;
- material edge inventory: **284**;
- reusable ConflictPatterns: **119**;
- combined material findings: **403**;
- HIGH/CRITICAL without owner/proof/detection route: **0**;
- Full Pass 5 capability coverage after this revisit: **15/28**;
- Full Pass 5 mandatory clusters: **11/12**;
- completed full passes: **4/8 minimum**;
- negative-space review: **NOT_STARTED**;
- saturation: **NOT_SATURATED**;
- Planning C: **BLOCKED**.

No `EDGE_CASE_INDEX.md` or `CROSS_CAPABILITY_EDGE_CASE_MATRIX.md` material entry is added because the revisit produced no new material scenario and did not increment a mandatory cluster.

## 5. Next rotation

Continue Full Pass 5 with **Identity / Authentication / Federation** and explicitly exercise the remaining not-yet-covered Full Pass 5 mandatory cluster **Identity × Authorization × Station × AGWS × AI**. Carry Typed Semantic Graph + ExecutionEnvelope into subject/session/credential/assurance graph semantics; account merge/split/linking; issuer/subject/session/key revision skew; login/refresh/logout/revoke races; identifier reassignment; recovery/reset; offline tokens and stale sessions; IdP substitution and residual sessions; current authentication evidence versus current Authorization/Station/AGWS authority; cross-tenant/person correlation; trust-namespace collapse; `ABSENT/null/default` in claims; cumulative privacy; shared-resource/cardinality pressure; contradictory human recovery procedures; Fleet/local evidence comparability; and AI/low-code use of authentication evidence as authorization or widening subject/target populations.

Duplicate-screen all 119 ConflictPatterns. Preserve `authentication evidence != authorization`, `identity proof != current authority`, and the topology/evidence/authority separations above. A material finding resets affected streak(s); otherwise increment only eligible local/cluster streaks supported by the actual revisit. Do not enter Planning C.
