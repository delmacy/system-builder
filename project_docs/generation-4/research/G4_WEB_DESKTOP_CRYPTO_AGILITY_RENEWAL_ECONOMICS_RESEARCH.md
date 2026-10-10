# G4 Web Desktop — Crypto-Agility Renewal Economics Research

Status: RESEARCH_ACTIVE / NON_EXECUTABLE
Scope: documentary R&D only. No WBS, Work Package, Sprint or TASK materialization.

## Research question

How should G4 preserve large populations of long-lived evidence when cryptographic algorithms, TSA/log providers, certificates and policy floors evolve at different rates, without turning renewal into a stop-the-world batch, silently dropping minority-critical evidence, or coupling historical verification to one provider?

## Decision candidate

Treat preservation renewal as a portfolio of independently qualified **renewal cohorts**, not as a global cron and not as one renewal per artifact by default.

`Evidence != PreservationEnvelope != RenewalCohort != RenewalAttempt != RenewalEffect`

`Renewal due != renewal authorized`

`Provider ACK != durable renewed evidence`

`Batch membership != shared business authority`

`Majority renewed != portfolio safe`

`Cheapest provider != admissible provider`

`Timestamp renewal != hash-tree renewal`

## External evidence and contradiction

RFC 4998 explicitly supports protecting groups of archived objects with Merkle/hash trees so only the root is timestamped; reduced trees can later prove an individual object. It also distinguishes timestamp renewal from hash-tree renewal. Timestamp renewal can protect the previous timestamp without accessing every original object, while hash-tree renewal is required when the hash algorithm protecting the tree itself becomes weak and therefore requires the archived objects/evidence to be processed again.

This creates an important cost discontinuity: renewal cost is not linear in `number of evidence objects`. It depends on which cryptographic layer is aging. A TSA certificate/public-key transition may permit cheap cohort renewal; degradation of the tree digest may force broad object access and rehashing.

RFC 4998 also states that many old Archive Timestamps can be collected into a new hash tree during renewal. Therefore batching is standards-compatible, but batching is a proof optimization, not a semantic grouping of the underlying artifacts.

RFC 6283 reinforces that verification context such as certificate/status information must be collected before renewal when it is needed and protected by the succeeding timestamp. Consequently `renewal job succeeded` cannot mean only `new timestamp received`.

NIST SP 800-131A Rev. 2 requires planned transitions to stronger cryptographic algorithms/key lengths. G4 therefore must model crypto-policy change as an input to preservation scheduling rather than assume that today's algorithm suite remains acceptable for the evidence lifetime.

## Renewal cohort model

Candidate identity:

`RenewalCohortRef = { cohortId, preservationClass, algorithmSuite, renewalKind, policyFloor, deadlineClass, providerClass, retentionHorizonClass, localityClass, criticalityClass, evidenceCount, aggregateBytes, coverage }`

Cohorts are **derived scheduling/computation units**. They do not own evidence and cannot change artifact authority, retention or disclosure.

Candidate renewal kinds:

- `TIMESTAMP_CHAIN_RENEWAL`: predecessor timestamp/evidence can be renewed without re-reading original payloads.
- `HASH_TREE_RENEWAL`: original protected objects/evidence must be available and rehashed under a stronger digest.
- `VALIDATION_CONTEXT_REFRESH`: collect/preserve certificates, revocation/status, transparency/log or policy context before it disappears.
- `PROVIDER_EXIT_REANCHOR`: establish provider-independent survivability before TSA/log/provider exit.
- `FORMAT_OR_PARSER_PRESERVATION`: preserve canonical verification representation or qualified parser environment when format support itself is aging.

## Scheduling state machine

`MONITORED -> RISK_SIGNAL_OBSERVED -> DEADLINE_QUALIFYING -> COHORT_ELIGIBLE -> PROVIDER_CAPACITY_QUALIFYING -> RENEWAL_RESERVED -> RENEWAL_RUNNING -> PROVIDER_EFFECT_OBSERVED -> DURABILITY_VERIFYING -> COVERAGE_VERIFYING -> RENEWED | PARTIAL | BLOCKED | UNKNOWN`

Additional explicit states: `DEADLINE_UNCERTAIN`, `PROVIDER_UNAVAILABLE`, `POLICY_CONFLICT`, `SOURCE_OBJECT_UNAVAILABLE`, `VALIDATION_CONTEXT_MISSING`, `BATCH_SPLIT_REQUIRED`, `RENEWAL_EVIDENCE_NOT_DURABLE`.

The scheduler must use **deadline slack and consequence**, not FIFO alone. A small legally/security-critical cohort near a crypto deadline may dominate a huge low-criticality cohort even if aggregate completion percentage falls.

## Budget model

Do not invent fixed numeric thresholds yet. Future empirical budgets should measure at least:

- proof-envelope bytes and index cardinality;
- original-payload bytes that must be reread for hash-tree renewal;
- hashing CPU and memory working set;
- TSA/log/KMS/provider requests and monetary cost;
- network ingress/egress and offline-media retrieval;
- renewal throughput and p50/p95/p99 completion latency;
- deadline slack distribution, especially minimum slack among critical cohorts;
- retry amplification and provider failure rate;
- verification CPU after renewal;
- durability replication lag;
- cohort fan-out and reduced-proof extraction cost;
- correlated dependency concentration by algorithm family/provider/trust root.

A portfolio dashboard should never reduce these to one `percent renewed` KPI.

## Provider shock and diversity

Price shock, outage or policy rejection near deadline must not silently move evidence to an arbitrary provider. Candidate provider qualification dimensions: supported algorithms, timestamp/profile semantics, trust jurisdiction, SLA/currentness, exportability, validation-context availability, evidence portability, licensing/cost, rate limits, privacy/data locality and replacement path.

Provider diversity can reduce operational concentration but does not automatically reduce cryptographic correlation: two TSAs using the same vulnerable algorithm/root family may fail together. Therefore:

`Provider diversity != cryptographic diversity`

`Cryptographic diversity != automatic stronger proof`

Diversity is a portfolio property whose additional verification complexity and cost must be visible.

## Application Portfolio Matrix delta

| Capability | Preferred modes | Rationale / constraints |
|---|---|---|
| Evidence inventory, lineage, cohort derivation | Native SB | semantic ownership, coverage, criticality and UNKNOWN must remain provider-independent |
| TSA/archive renewal execution | API-backed / Hybrid / Deep-link | mature specialist service; SB owns intent/qualification/evidence |
| Transparency/log verification | Native verification + API-backed / Deep-link | portable verification common path, provider-native forensic recovery |
| PKI/CA administration | API-backed / Hybrid / Deep-link | avoid rebuilding mature CA consoles; preserve semantic boundary |
| HSM/KMS | API-backed / Hybrid / Deep-link; Native bridge only for local hardware | hardware/provider semantics must not be fabricated |
| Offline archive renewal | Hybrid / Native bridge | local media/HSM access may require device-local boundary |
| Provider-exit export/reanchor | Native semantic orchestration + API-backed/Hybrid | exitability and proof portability are SB concerns |
| Renewal observability | Native SB | must combine cost, deadline, currentness, durability and coverage without granting effect authority |

Matrix criteria added/refined: renewal-kind fidelity, batching semantics, deadline/currentness, provider concentration, crypto-family concentration, portability, validation-context capture, offline-media reachability, cost predictability, durability proof, replaceability and explicit `PARTIAL/UNKNOWN` representation.

## Desktop / Window / monitoring consequences

The established hierarchy remains unchanged: `Client != Workspace != Desktop != Application != Window`. Renewal work is not a Desktop and not a Window runtime.

- **Desktop Observatory** may aggregate deadline slack, provider health, cohort coverage and evidence gaps read-only.
- **Pinned Monitoring Surface** may show bounded alerts such as `critical cohort < safety slack` without becoming a management app.
- **Operations Desktop** is the correct guided sphere for authorized renewal/recovery actions.
- A secondary Display Surface may project progress, but stale display state never authorizes renewal/provider switching.
- Closing a Window does not cancel durable renewal work unless an explicit authorized cancellation effect exists.

## Application Manager / Control Center / deployment consequences

Application Manager lifecycle remains `discover/register/install/adopt/configure/operate/update/retire` with those transitions distinct. A TSA/log/KMS integration being installed or discovered does not make it qualified for evidence renewal.

Control Center should expose provenance for effective crypto-policy, provider policy, retention horizon, renewal margin and inherited overrides. `Policy != configuration`; effective renewal scheduling must explain source/provenance and why a cohort became due.

Declarative service definitions may express desired archive/TSA/log capabilities and SecretRefs, but provider YAML is not the semantic definition. Auto-binding may select only among compatible, authorized and current bindings; it must surface the selected binding and qualification evidence (`Automatic != hidden`).

## Proprietary editor / semantic bridge consequences

No new bespoke editor family is justified. Shared editor primitives should support: evidence/cohort table, deadline/risk timeline, provenance inspector, policy diff, dependency graph, proof/evidence inspector, batch preview and authorized action confirmation.

`View != Workflow Activity`, `Form != Workflow State`, `Button != Domain Command` remain unchanged. A renewal button emits a qualified domain intent; the durable renewal occurrence is observed independently.

## Componentization complexity map delta

High-reuse foundations (future decomposition input, **not WBS**):

- `CryptoRiskSignalBoundary`
- `RenewalDeadlineQualificationBoundary`
- `RenewalCohortDerivationBoundary`
- `RenewalKindQualificationBoundary`
- `RenewalPortfolioSchedulerBoundary`
- `MinorityCriticalityProtectionBoundary`
- `ProviderCapacityQualificationBoundary`
- `ProviderConcentrationBoundary`
- `CryptoDiversityQualificationBoundary`
- `ValidationContextCaptureBoundary`
- `RenewalDurabilityVerificationBoundary`
- `RenewalCoverageBoundary`
- `RenewalCostTelemetryBoundary`
- `ProviderExitReanchorBoundary`

Application/domain-owned: legal evidentiary weight, domain retention, business acceptance, workflow compensation, publication/deployment authority, organization-specific emergency approval and regulatory interpretation.

Complexity hotspots: hash-tree renewal over cold/offline media; cross-provider proof portability; correlated crypto/provider risk; validation-context preservation; deadline scheduling under rate/cost constraints; and legacy parser isolation.

## Adversarial proof obligations

1. 99.99% renewed while one critical item expires.
2. TSA outage inside safety margin.
3. TSA price increases 100x near deadline.
4. Two nominally diverse providers share the compromised crypto family.
5. Timestamp renewal incorrectly used when the tree digest itself is weak.
6. Hash-tree renewal begins but one cold object is unavailable.
7. Provider ACK exists but renewed proof was not durably replicated.
8. Batch root exists but reduced proof for one member cannot be reconstructed.
9. Evidence is moved between cohorts while renewal is in flight.
10. Policy floor changes after reservation but before effect.
11. Offline archive returns after its cohort was compacted.
12. Validation context disappears before the renewal job captures it.
13. A stale secondary display reports `safe` after deadline/currentness changes.
14. Automatic provider selection crosses residency/trust policy.
15. Provider exit occurs during an unfinished renewal chain.
16. Retry storm exhausts TSA rate limit and reduces slack for critical cohorts.
17. Huge low-criticality cohort starves tiny high-criticality cohort.
18. Cost optimizer delays renewal beyond admissible safety margin.
19. Historical-only trust material is accidentally restored to active issuance authority.
20. Renewal reserializes/canonicalizes evidence and silently changes the protected representation.
21. Hash-tree batch leaks cross-Client membership or correlation.
22. Cross-Client batching creates disclosure or retention coupling.
23. One Client erases an item without invalidating proofs for unrelated batch members.
24. Renewal result is cryptographically valid but violates current business retention/disclosure policy.
25. Clock skew produces a false deadline ordering.
26. Algorithm deprecation is discovered after the ideal renewal window.
27. Provider API semantics drift while an adapter still reports compatibility.
28. Browser/Window closes while durable renewal continues.
29. Restore from backup resurrects a pre-renewal evidence index.
30. `UNKNOWN` coverage is silently counted as success.

## Saturation / remaining gaps

- Web Desktop hierarchy/taxonomy/window/multi-display: **high conceptual saturation**.
- Application Portfolio/Application Manager/Control Center: **medium-high**.
- Historical evidence preservation semantics: **medium-high**.
- Renewal cohorting/batching semantics: **medium-high conceptual**, empirical economics still open.
- Crypto/provider correlated-risk modeling: **medium**.
- Offline/cold-media renewal economics: **medium-low empirical**.
- Performance/resource budgets: **medium-low empirical**; thresholds must come from measurement, not invented values.
- Accessibility/small-screen equivalence: **medium-high contractual**; operational validation remains future work.

## Next material vector

`RenewalCohort` privacy and isolation under multi-Client batching: how to obtain Merkle/TSA economies without leaking cross-Client membership, coupling retention/erasure, creating shared failure domains, or requiring one Client's evidence lifecycle to wait on another. This may still change proof-envelope contracts, batching boundaries, cost accounting, provider placement and future component decomposition.
