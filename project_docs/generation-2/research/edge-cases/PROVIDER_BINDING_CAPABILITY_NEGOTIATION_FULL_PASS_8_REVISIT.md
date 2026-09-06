# Generation 2 — Provider / Binding / Capability Negotiation — Full Pass 8 Revisit

Status: ELIGIBLE NO-NEW-MATERIAL REVISIT  
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`  
Full pass: 8  
Disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`

## Authority and bounded scope

This revisit follows `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json` as the sole operational authority for phase, phase order, gates, current focus and next action. Immediately before persistence the branch `research/g2-capability-pipeline` was revalidated at `32be103ada896fbf8dcd0b66b52819252e96a60d`, with Full Pass 8 at 24/28 capabilities and 12/12 mandatory clusters, 7/8 minimum full passes complete, negative-space `NOT_STARTED`, saturation `NOT_SATURATED`, and Planning C blocked.

Research only. No product code, Work Package, TASK, Construction, remediation, target-architecture commitment, canonical capability promotion, preventive invariant, or direct physical-control authority is authorized.

Preserved distinctions:

- `Research != remediation`;
- `ConflictPattern != ConflictInstance`;
- `Signal != ConfirmedConflict`;
- `discovered != advertised != qualified != admitted != bound != effective != converged`;
- provider-native identity != canonical identity;
- provider request/ACK != provider effect != canonical/business convergence;
- external provider state != canonical authority != actual physical/media access success;
- provider feature/profile label != portable semantic equivalence;
- current utilization != queue health != sustainable capacity != headroom != stability margin;
- `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN` remain distinct;
- local evidence != exported telemetry != Fleet aggregate != control authority;
- provenance/lineage != authority != causal proof;
- AI inference/ranking = candidate, never authority;
- Physical/Peripheral Operations remains bounded to integration/governance-plane provisioning, brokering, read/query/event, inventory, drift/reconciliation and provider-health concerns by default.

## Full-Pass-8 attack technique

Pass 8 intentionally rotates away from the Pass-7 qualification-vector emphasis and attacks the provider lifecycle through **state-cut subtraction, evidence-currentness fracture, support-scope mutation and operability false-completeness**:

1. **Discovery→qualification→admission→binding cut mutation** — preserve green discovery while independently removing semantic support, revision evidence, tenant/site scope, privacy/security qualification, source-of-truth, rollback or reconciliation evidence.
2. **Support-scope shrink/expand mutation** — keep connector/API identity stable while a provider revision narrows, broadens or reinterprets supported operations/scopes.
3. **External-identity fracture** — keep a canonical subject/resource stable while rotating external IDs, aliases, recreated resources, account domains, sites or groups.
4. **Population-completeness subtraction** — preserve successful pages/events while omitting late events, tombstones, deletes, unsupported populations, filter-excluded resources or unfinished scans.
5. **Effect/evidence cut** — place failure between external mutation and local evidence persistence so the canonical state becomes `UNKNOWN`, not `NOT_APPLIED`.
6. **Bind/rebind/withdraw race mutation** — overlap old/new providers, queued operations, retries, credentials, sessions, callbacks, residual accounts/resources/grants and offline connector cohorts.
7. **Quota/backlog superposition** — combine provisioning, reconciliation, inventory scans, retry storms and shared provider quotas so nominal quota remains green while queue age and stability degrade.
8. **Connector-offline evidence fracture** — remove provider/Fleet visibility while local cached state remains apparently healthy; then vary currentness and reconciliation age.
9. **Cross-client/site mapping permutation** — exchange external resource/group/site mappings under syntactically valid identifiers to challenge tenant/site isolation.
10. **Unsupported-scope no-silent-drop mutation** — submit a canonical grant/resource dimension that the provider cannot represent while preserving transport success.
11. **Elicitation/readiness subtraction** — mark an integration `RESOLVED`/publishable after endpoint/auth/happy-path success while omitting source-of-truth, lag/gap limits, outage behavior, unsupported scope, reconciliation owner, API revision assumptions, capacity and escalation.
12. **Bounded Physical/Peripheral challenge** — expose provider-native camera/access/BMS/PDV/device functions but require operation-class distinction so `read/provision/broker/reconcile` cannot silently inherit actuation authority.
13. **AI/low-code amplification challenge** — compose individually allowed provider actions/mappings into stronger aggregate reach, cross-site effects or inferred control authority.
14. **Causal non-strengthening** — observe improvement after provider replacement without controlling workload, topology, revision, backlog and operator intervention; do not promote correlation to causal proof.

## Fresh evidence differential — 2026-09-06

### External mutation may have succeeded while the local system cannot know the created identity

Crossplane v2.3 documents a provider interval in which an external system can create a resource but the reconciler fails before persisting the external name. Crossplane treats this as a leaked-resource risk and raises `cannot determine creation result`, stopping reconciliation rather than blindly creating again. This is direct evidence that `request issued/accepted != known external identity != canonical convergence`, and supports explicit `UNKNOWN + reconcile-before-retry` semantics when idempotency cannot be proven.

Source: Crossplane v2.3, *Managed Resources*, accessed 2026-09-06.

### Nominal request limits do not prove sustainable provider capacity

Kubernetes API Priority and Fairness classifies requests, limits concurrency, uses bounded queues and fair dispatch under overload so a noisy flow does not starve others. This reinforces the portable distinction between a published rate limit and actual queue/backlog stability, fairness, service time and sustainable headroom.

Source: Kubernetes, *API Priority and Fairness*, accessed 2026-09-06.

### Exported connector telemetry can be incomplete or lost

OpenTelemetry Collector resiliency documentation describes bounded sending queues, retry horizons, queue overflow and loss when destinations remain unavailable or storage fails. Internal telemetry guidance further distinguishes send failures from actual data-loss conclusions. Therefore connector/Fleet telemetry is qualified evidence with its own durability/currentness, not proof of provider-side absence, convergence, revocation or physical truth.

Sources: OpenTelemetry, *Collector Resiliency* and *Internal telemetry*, accessed 2026-09-06.

### Provider-native role/entitlement labels lack universal authorization semantics

SCIM RFC 7643 defines `roles` and `entitlements` without a canonical vocabulary or syntax. This reinforces that provider-native groups/roles/entitlements require explicit semantic mapping; a successfully provisioned external role cannot be promoted automatically to canonical permission equivalence.

Source: RFC 7643, *SCIM Core Schema*.

## Candidate findings — duplicate-screened against all 124 ConflictPatterns

### Candidate A — provider remains “supported” after its semantic support scope changed

**Activation:** API/profile/provider identity remains stable while a revision changes supported operations, permission dimensions, limits, defaults, ordering, consistency, retention or site/tenant semantics.

**Conflict shape:** previously qualified provider label versus current operation-level semantic admissibility.

**Detection candidates:** revision-qualified capability matrix; effective interval; unsupported/partial scope; contract-diff evidence; currentness; affected bindings and cohorts.

**Assessment:** HIGH where permission/data/effect semantics change; strongly supported; pre-production/runtime detectable; potentially multi-tenant blast radius.

**Duplicate-screen:** provider qualification + compatibility-direction + revision/currentness + semantic-loss families. No new ConflictPattern.

### Candidate B — external mutation is successful but local identity/effect evidence is absent

**Activation:** provider creates/updates an external object, but the connector fails before recording external identity, operation status or provider observation.

**Conflict shape:** missing local confirmation is interpreted as `NOT_APPLIED` and replayed.

**Detection candidates:** operation identity/idempotency scope and horizon; create-pending evidence; provider-native lookup; `UNKNOWN`; reconcile-before-retry; human escalation where ambiguity is unsafe.

**Assessment:** HIGH/CRITICAL depending external effect; strongly supported by Crossplane semantics; reversibility may be limited.

**Duplicate-screen:** ambiguous external effect + idempotency/retry + false-convergence + proof/evidence families. No new ConflictPattern.

### Candidate C — provider list/event success silently describes an incomplete population

**Activation:** pages/events validate individually but cursors, filters, tombstones, late events, unsupported resource types, event gaps or provider-side retention omit relevant members.

**Conflict shape:** transport success versus population completeness/current provider truth.

**Detection candidates:** declared source population; cursor/watermark; scan completion; deletion/tombstone semantics; event-gap evidence; reconciliation checkpoint; `PARTIAL/UNKNOWN`.

**Assessment:** HIGH for deprovisioning/permissions; delayed harm; tenant/site/resource-set blast radius.

**Duplicate-screen:** source-population completeness + presence/currentness + provider drift + false convergence. No new ConflictPattern.

### Candidate D — external identifier remains syntactically valid but now names another provider object

**Activation:** provider recreates resources, recycles aliases/IDs, migrates sites/accounts, or changes identity domains while canonical mapping remains stale.

**Conflict shape:** valid external reference versus intended canonical entity/resource.

**Detection candidates:** stable identity tuple where available; tenant/site/account scope; provider revision; ambiguity/quarantine; re-resolution before mutation.

**Assessment:** HIGH/CRITICAL for permissions or physical-site targeting; potentially difficult to reverse.

**Duplicate-screen:** entity-resolution/identity drift + provider-native identity + cross-tenant/site + authority families. No new ConflictPattern.

### Candidate E — rebind/withdraw says complete while old provider effect paths remain

**Activation:** canonical binding changes but residual accounts, grants, credentials, sessions, retries, callbacks, queued mutations or offline agents remain effective.

**Conflict shape:** canonical withdrawal versus actual cessation of old external effect-producing paths.

**Detection candidates:** residual cohort inventory; credential/session/token horizon; in-flight operation IDs; old/new telemetry segregation; provider deprovision/reconciliation proof.

**Assessment:** HIGH/CRITICAL; immediate or latent harm.

**Duplicate-screen:** residual cohort + binding coexistence + revocation/deprovision lag + provider-effect ambiguity. No new ConflictPattern.

### Candidate F — provider quota looks green while reconciliation traffic destabilizes service

**Activation:** provisioning, scans, retries and drift reconciliation share quota/concurrency; queue age grows despite nominal utilization or published limits looking acceptable.

**Conflict shape:** quota eligibility/current utilization versus sustainable capacity and headroom.

**Detection candidates:** arrival/service rate; queue depth/age; concurrency; retry amplification; workload classes; shared bottlenecks; provider latency; fairness.

**Assessment:** HIGH for availability and recovery; multi-tenant blast radius possible.

**Duplicate-screen:** queue/capacity + retry amplification + resource exhaustion + provider qualification. No new ConflictPattern.

### Candidate G — unsupported canonical permission/resource scope is silently dropped

**Activation:** canonical grant has dimensions the provider cannot represent, but adapter/provider request succeeds with a weaker subset.

**Conflict shape:** successful provisioning versus canonical authority/effect equivalence.

**Detection candidates:** required-vs-supported semantic dimensions; no-silent-drop; explicit unsupported scope; round-trip/reconciliation; authority delta.

**Assessment:** HIGH/CRITICAL for access boundaries; low false-positive risk when required dimension is explicit.

**Duplicate-screen:** semantic-loss + provider false-equivalence + authority non-amplification + proof-claim families. No new ConflictPattern.

### Candidate H — elicitation marks provider integration publish-ready without operability semantics

**Activation:** endpoint, auth and happy-path call succeed, while source-of-truth, sync-lag/gap limits, outage behavior, `UNKNOWN`, idempotency, unsupported scope, reconciliation owner, revision assumptions, quota/backlog, escalation or recovery remain unanswered.

**Conflict shape:** configured/feature-complete versus understood/operable/publish-ready.

**Detection candidates:** Provider Elicitation Lens; Production Readiness Coverage; critical unanswered questions; evidence/currentness; owner/escalation; separate publish/operation sufficiency gate.

**Assessment:** MEDIUM→HIGH; best detected before publish.

**Duplicate-screen:** false-completeness + missing ownership + negative-space + qualified-evidence/provider-effect families. No new ConflictPattern.

### Candidate I — integration-plane capability is strengthened into physical-control authority

**Activation:** provider discovery exposes camera/door/BMS/PDV/device commands and UI/AI/low-code treats reachability or provider support as authorization to actuate.

**Conflict shape:** technical reachability/provider capability versus delegated authority and bounded integration/governance-plane scope.

**Detection candidates:** operation-class taxonomy (`read/query/event`, `provision/sync`, `grant/revoke`, `broker/session`, exceptional `actuate`); explicit client/site context; authority owner; safety proof; unsupported-by-default actuation.

**Assessment:** HIGH/CRITICAL; potentially irreversible physical/security effect.

**Duplicate-screen:** authority non-amplification + confused deputy + provider-state/physical-truth conflation + operation-kind preservation. No new ConflictPattern.

## Provider/Binding Elicitation & Operability Lens — Pass 8 refinement

Provider understanding must be capability-, context-, revision- and evidence-aware. The Elicitation Knowledge Base should route questions such as:

- Which canonical capability/use is being realized, and who owns the semantics?
- Which provider/API/profile/revision/region/tenant/site is qualified, for what effective interval?
- Which operations and semantic dimensions are `SUPPORTED`, `PARTIAL`, `UNSUPPORTED`, provider-specific or unknown?
- What is source-of-truth for users, groups, permissions, resources, events and bindings?
- Which provider IDs are stable, scoped, recyclable or recreated, and how is ambiguity handled?
- What precisely does success mean at request, ACK, provider effect, observation and canonical convergence stages?
- Which states may be `PARTIAL/UNKNOWN`, how long may they remain so, and who owns reconciliation/escalation?
- What idempotency guarantee exists by operation, revision, tenant/site and horizon?
- How are pagination, tombstones, deletes, late events, retention and filters reflected in completeness evidence?
- What are expected/peak arrival rates, quotas, concurrency, service times, backlog/headroom, retry policy and acceptable synchronization lag?
- What happens during provider outage, connector offline state, credential expiry or Fleet unavailability?
- How are bind/rebind/withdraw/cutover, residual accounts/resources/grants/sessions and rollback proven?
- Which unsupported semantic scope must block publish rather than degrade silently?
- Which functions remain specialized VMS/access/BMS/PDV/device control/media plane?
- What local evidence proves status when exported telemetry is partial/stale/lost?
- Which Production Readiness Coverage dimensions remain `UNTOUCHED`, `DISCOVERING`, `PARTIAL`, `CONFLICTED`, `BLOCKED`, `DEFERRED` or evidence-stale?

An answer containing text is not automatically `Fact`, `Requirement`, `RESOLVED` or publish-ready. Missing semantic owner, evidence/currentness, contradiction disposition, negative case, recovery or operability proof remains coverage debt.

## Carry-forward for later phases — no architecture decision here

If and only if the adversarial phase later closes, Planning C must decide rather than inherit:

- provider qualification/binding/currentness ownership and model;
- canonical↔external identity/resource/grant mapping boundaries;
- discovery/qualification/admission/binding/effect/convergence state distinctions;
- provider support matrices and explicit unsupported-scope/no-silent-drop semantics;
- `PARTIAL/UNKNOWN` effect/reconciliation and residual cohorts;
- provider abstraction versus provider-specific semantics;
- bounded Physical/Peripheral integration/governance-plane model and explicit decision on whether any actuation capability exists;
- Elicitation Knowledge Base / capability lenses / Production Readiness Coverage as cross-cutting methodology or infrastructure, not automatically a canonical capability;
- Fleet as analysis/observability over qualified local evidence, not control authority.

Planning D must later address staged onboarding, coexistence, identity/permission mapping, provider replacement, residual resources/accounts/grants and structured/free-form elicitation migration. Planning E must later prove create/update/disable/delete external user, grant/revoke, `PARTIAL/UNKNOWN`, permission drift/reconciliation, provider outage, unsupported scope, site/tenant isolation, read/event freshness, no silent authority escalation and adaptive elicitation/critical-gap detection.

## Duplicate-screen and saturation result

**0 new local edge scenarios. 0 new cross-capability scenarios. 0 new reusable ConflictPatterns. 0 ConflictInstances. 0 preventive invariants. 0 bounded Planning-A backfill.**

All candidates reduce to the existing 124 ConflictPatterns. No signal is promoted to a confirmed conflict and no 125th pattern is justified.

Saturation disposition:

- Provider / Binding / Capability Negotiation local no-material streak: **preserve at 2 (capped)**.
- `Provider/Binding × external realizations` cluster streak: **preserve at 2 (capped)**.
- Material totals: **284 edge scenarios + 124 ConflictPatterns = 408**.
- HIGH/CRITICAL without owner/proof/detection route: **0**.
- Full Pass 8 capability coverage after this revisit: **25/28**.
- Mandatory cluster coverage: **12/12**.
- Completed full passes remain **7/8 minimum** until all 28 capabilities in Full Pass 8 are completed.
- Negative-space: `NOT_STARTED`.
- Saturation: `NOT_SATURATED`.
- Planning C: **BLOCKED**.

## Exact next-action candidate

Subject to immediate fresh state/head revalidation before state persistence, continue only Full Pass 8 with **Standards / Interoperability / API Contracts**. Challenge profile/dialect/extension intersections; canonicalization/content negotiation; schema-valid but semantically invalid representations; unknown/critical fields; compatibility direction/downgrade; protocol success versus canonical/external/business effect; idempotency across revisions; residual/dual-version clients; provider labels versus portable semantics; external versus canonical identity; trust/privacy/authority; `ABSENT/null/default/delete`; pathological payload/cardinality pressure; temporal applicability; provenance without all-to-all over-attribution; preservation of decision/calculation/workflow kind, units/vector/uncertainty; bounded Physical/Peripheral operation-class semantics; human integration procedures; cross-build/Fleet comparability; and AI/low-code contracts that remain syntactically valid while erasing mandatory semantics. Falsify elicitation sufficiency through missing version/profile negotiation, unknown-field policy, downgrade, source-of-truth, owner, evidence/currentness, negative cases and Production Readiness Coverage. Duplicate-screen all 124 ConflictPatterns. Standards streak is already 2 and remains capped absent material novelty. Do not enter Planning C.