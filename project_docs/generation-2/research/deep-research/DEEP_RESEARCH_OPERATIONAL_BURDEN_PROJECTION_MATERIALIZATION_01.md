# Generation 2 — Deep Research: Operational Burden Projection & Materialization 01

Status: COMPLETE — RESEARCH RECOMMENDATION / NOT TARGET-ARCHITECTURE AUTHORITY

## Question

Should Generation 2 introduce a first-class revisioned `OperationalBurdenProfile`/burden artifact that stores the assessed operational burden of a capability/system, or should burden remain a reproducible projection over the existing architecture/proof/topology/provider/authority/recovery/observability evidence graph, with optional materialization only for performance, audit and commercial reproducibility?

This deep research intentionally follows `DEEP_RESEARCH_RELATIVE_OPERATIONAL_COMPLEXITY_MEASUREMENT_RATING_01.md`. It does **not** reopen whether a universal scalar complexity score should exist; that was already falsified. The residual architectural uncertainty is where source-of-truth should live and what, if anything, deserves independent revision identity.

## Why this is architecturally material

The previous deep research established four distinct layers:

```text
architecture / requirement facts
        ↓
observed realization evidence
        ↓
measurement profile revision
        ↓
normalized burden evidence
        ↓
commercial rating policy revision
        ↓
price / tier / allocation
```

That leaves a subtle but high-impact ownership question.

If SB stores a mutable `OperationalBurdenProfile` as independent canonical state, it can drift from the architecture and evidence that supposedly justify it. A provider can be removed, an RTO relaxed, a Station moved online-only or a proof invalidated while the burden record remains stale. The project would then have two competing claims about the same system.

If SB never persists burden results, however, historical commercial rating and audit may become expensive or impossible after telemetry retention expires, measurement rules change, providers are retired or interpretation dependencies are garbage-collected. Recomputing a 2026 rating in 2031 may require material no longer available.

Therefore this is not merely a caching choice. It affects:

- canonical ownership and avoidance of duplicate truth;
- deterministic/reproducible evaluation;
- historical rating and dispute resolution;
- evidence retention and historical interpretation closure;
- stale/unknown/INCONCLUSIVE semantics;
- privacy/retention of source telemetry;
- provider substitution;
- commercial Goodhart pressure;
- simple-system ergonomics;
- operational query cost and performance;
- migration/evolution of measurement rules.

## System Builder input corpus

Mandatory corpus consulted:

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json` — current phase is `RESEARCH_ELICITATION`; six full cycles are complete and cycle 7 is active. This deep research does not increment cycles, mark a capability revisited or declare saturation.
- `project_docs/generation-2/research/RESEARCH_EVIDENCE_METHOD.md` — requires triangulation across production systems, standards/specifications, scientific literature and industrial engineering evidence, preserving contradictions.
- `project_docs/generation-2/research/ARCHITECTURE_PROOF_QUALITY_METHOD.md` — material claims require explicit falsification/proof paths, revision/provider/evidence semantics and reproducibility tests.
- `project_docs/generation-2/research/CAPABILITY_DISCOVERY_REGISTER.md` — the relative-operational-complexity candidate is `RESEARCH_COMPLETE_PENDING_SYNTHESIS_DISPOSITION`, not a promoted capability.
- `project_docs/generation-2/research/FINDING_INDEX.md` — current Generation-2 direction emphasizes applicability-scoped claims, revision-qualified evidence, typed stability and append/supersede lineage rather than global scalars.
- `project_docs/generation-2/research/REPRESENTATIVE_COVERAGE.md` — UCA, lifecycle, provider/binding, security/recovery, observability/operator and architecture-reconciliation evidence is already deep enough to challenge this question transversally.
- `project_docs/generation-2/research/CAPABILITY_PROOF_MATRIX.md` — requires determinism/reproducibility, desired/effective/observed separation, provider substitution, historical revisions, operational simplicity and commercial rating reproducibility.
- `project_docs/generation-2/research/deep-research/DEEP_RESEARCH_RELATIVE_OPERATIONAL_COMPLEXITY_MEASUREMENT_RATING_01.md` — rejects universal scalar complexity and separates semantic burden, observed realized burden, measurement-profile revision and commercial rating policy.
- `DEEP_RESEARCH_HISTORICAL_INTERPRETATION_CLOSURE_01.md` — historical claims need transitive interpretation/validation closure, not a bare revision ID.
- `DEEP_RESEARCH_COMMERCIAL_USAGE_CORRECTION_RATING_BILLING_CLOSURE_01.md` — historical commercial facts require explicit revision/correction lineage rather than destructive recalculation.
- `DEEP_RESEARCH_LONG_LIVED_GATE_CRITERIA_EVOLUTION_01.md` — different revision axes have different pinning/freshness semantics.
- current concept hypotheses for UCA, topology/build/runtime realization, provider leverage, qualified evidence, autonomous runtime and Station authority.

Breadth findings and candidates are input hypotheses, not independent external authority.

## External evidence ledger

### E1 — CQRS/Event Sourcing: materialized views can be durable without becoming source of truth

Microsoft's CQRS/Event Sourcing guidance explicitly describes the event store/write model as the single source of truth while read models generate materialized views. It characterizes materialized views as durable read-only caches that can be regenerated by replaying the source history. It also notes that snapshots/materialized forms can be used to avoid repeatedly processing a large history.

Evidence:
- https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs

Architectural extraction: **persistence does not imply semantic ownership**. A burden assessment may be materialized and retained while the canonical facts remain elsewhere, provided derivation identity and rebuild/revalidation semantics are explicit.

Limit: SB is not required to adopt event sourcing. The transferable principle is source/projection separation.

### E2 — Materialize: persisted materialized views remain defined by their query

Materialize distinguishes ordinary views, whose results are recomputed, from materialized views, whose results are persisted durably and incrementally maintained. Both remain derived from a declared query; durability changes performance/availability, not semantic provenance.

Evidence:
- https://materialize.com/docs/concepts/views/
- https://materialize.com/docs/sql/create-materialized-view/

Architectural extraction: the useful distinction is:

```text
projection definition ≠ projection result ≠ projection materialization policy
```

SB should not collapse measurement rules, evaluated burden evidence and storage/cache policy into one object.

### E3 — Prometheus recording rules: expensive derived expressions may be persisted as new series

Prometheus recording rules precompute frequently used or expensive expressions and store their results as new time series. The rule expression is explicit; the recorded samples are derived results evaluated at particular times.

Evidence:
- https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/
- https://prometheus.io/docs/practices/rules/

Architectural extraction: persisting a derived burden dimension can be useful for query performance and historical operation, but the result must retain which rule/profile produced it and what observation window it covers. A historical recorded result should not be mistaken for the current architecture burden after inputs/rules change.

Divergence/limit: Prometheus recorded samples are time-series observations and do not by themselves preserve all inputs necessary for semantic replay. SB needs stronger provenance than metric naming conventions.

### E4 — OPA decision logs: retain decision output together with input/policy revision metadata

OPA decision logs include decision ID, query input/result and bundle revision metadata so decisions can be audited/offline-debugged later. This pattern preserves an evaluated outcome as evidence while retaining the revision context that produced it.

Evidence:
- https://www.openpolicyagent.org/docs/management-decision-logs

Architectural extraction: SB may legitimately persist a burden **assessment** as historical decision evidence if it names exact measurement-profile revision, subject/revision, input/evidence closure and evaluation time. That does not make the output an independently editable source of architecture truth.

### E5 — W3C PROV: derivation is first-class provenance, not identity collapse

W3C PROV defines derivation relationships such as `wasDerivedFrom` between entities and activities. Derived entities can have their own identity while remaining explicitly attributable to source entities and generation activities.

Evidence:
- https://www.w3.org/TR/prov-dm/
- https://www.w3.org/TR/prov-o/

Architectural extraction: a materialized burden assessment may be a first-class **evidence artifact** with identity and provenance without becoming a canonical **domain fact owner**. First-class identity and source-of-truth authority are distinct concepts.

### E6 — Nix/Bazel reproducibility: derived outputs are trustworthy only relative to declared inputs/tools/environment

Nix derivations model outputs as functions of declared inputs and support content-addressed outputs in some modes. Bazel's reproducibility guidance similarly depends on deterministic/hermetic rules, stable ordering and controlled inputs/environment.

Evidence:
- https://wiki.nixos.org/wiki/Derivations
- https://releases.nixos.org/nix/nix-2.34.1/manual/store/build-trace.html
- https://bazel.build/versions/8.0.0/reference/be/general

Architectural extraction: claiming that burden is “reproducible” requires more than a formula revision. The **input closure**, evaluator semantics, normalization/calibration artifacts and time-window/freshness assumptions must be identifiable. Hidden telemetry or mutable external lookups destroy strict reproducibility.

Limit: operational evidence is often time-varying and cannot be made fully hermetic. SB therefore needs explicit grades such as reproducible, replayable-with-retained-snapshot, non-replayable-historical, or INCONCLUSIVE rather than a universal deterministic claim.

### E7 — Database/query systems show an important lifecycle distinction: source change, view staleness and refresh are separate states

Across materialized-view systems, derived state may lag, require refresh/recomputation or be incrementally maintained. CQRS similarly warns about eventual consistency between source/write model and read projections.

Architectural extraction: an SB burden assessment needs an applicability/freshness relation. A previously valid assessment can remain historically true for `(subject revision, evidence horizon, measurement revision, evaluation time)` while no longer being current/effective for a changed system.

This aligns with Generation-2 evidence semantics: **historical validity is not current applicability**.

### E8 — Scientific/engineering evidence from prior ROCMR remains directly relevant

The prior deep research already triangulated ISO/IEC 25010 multidimensional quality, Google SRE toil/SLO/error-budget practice, NIST risk models, COSMIC functional sizing, COCOMO multi-driver cost estimation, metric collinearity, DORA decoupling evidence and Goodhart effects.

Those sources answer *what should be measured* and *why not one scalar*. This round uses materialized-view/provenance/reproducibility evidence to answer *where the derived result should live*.

The strongest anti-duplication conclusion is consistent across both rounds: canonical facts should remain owned by the domains that create them; measurement is a projection/interpretation layer.

## Competing models

### Model A — Mutable first-class `OperationalBurdenProfile` as canonical system state

Conceptually:

```text
System
  └─ OperationalBurdenProfile
       authorityScore: 4
       providerBurden: 7
       recoveryBurden: 8
       overallTier: HIGH
```

The profile is directly stored/edited and treated as authoritative.

Advantages:
- trivial query path;
- simple integration with commercial rating;
- stable historical record if never recomputed.

Failures:
- duplicates facts owned by architecture, provider, topology, security/recovery and observability domains;
- unclear update ownership after any source fact changes;
- stale profile can contradict current graph;
- creates manual-override/gaming surface;
- turns measurement implementation into semantic architecture;
- migration becomes dangerous because changing formula may look like changing system truth;
- impossible to distinguish “burden changed” from “measurement changed” without extra lineage.

Disposition: **DO_NOT_BUILD as canonical mutable architecture truth**.

### Model B — Pure on-demand projection, never persisted

Conceptually:

```text
burden = evaluate(current graph, current evidence, measurement profile)
```

Advantages:
- one canonical source graph;
- no projection drift by persistence;
- simple conceptual model.

Failures:
- historical inputs may expire or be privacy-disposed;
- recomputation can be costly over large topology/telemetry/proof graphs;
- current evaluator/profile may not reproduce old commercial decision;
- commercial disputes require evidence of what was actually evaluated then, not only what would be evaluated now;
- provider retirement may remove interpretation dependencies;
- on-demand query may have unstable results as observation windows advance.

Disposition: **KEEP for live evaluation/simple systems, but insufficient as the only historical mechanism**.

### Model C — Canonical measurement-profile definition + derived assessments, optionally materialized

Conceptually:

```text
Canonical architecture / evidence graph
      │
      ├── subject revision vector
      ├── authority/topology/provider/recovery facts
      ├── proof/conformance evidence
      └── observed operational evidence + windows
                │
                ▼
MeasurementProfile revision
  dimensions / selectors / normalization
  applicability / freshness / uncertainty
  correlation handling / missing-data semantics
                │
                ▼
Evaluation activity
                │
                ▼
BurdenAssessment (immutable derived evidence)
  subject revision
  measurement-profile revision
  evidence/input closure identity
  evaluation time/window
  typed output vector
  uncertainty/coverage
  replayability/reproducibility status
  derivation/provenance
                │
                ├── may be materialized for query/audit
                └── may feed CommercialRatingPolicy revision
```

Properties:
- source facts remain owned by their original domains;
- `MeasurementProfile` is first-class because it is an interpretation rule/policy, not because burden is intrinsic state;
- `BurdenAssessment` may be first-class **immutable evidence** with identity/lineage;
- materialized burden values are never directly edited;
- invalidation/re-evaluation produces append/supersede lineage rather than mutation;
- simple systems can evaluate on demand and avoid maintaining a burden store;
- mature/commercial systems can retain selected assessments required by rating/audit policy.

Disposition: **KEEP / GENERALIZE — strongest model**.

### Model D — Event-sourced burden ledger independent from architecture graph

All changes affecting burden emit separate burden events; burden is reconstructed from that ledger.

Advantages:
- historical query and audit can be strong;
- incremental updates possible.

Failures:
- creates synchronization obligation between every architecture owner and burden ledger;
- missing one event silently corrupts measurement;
- duplicates semantic changes in a second event taxonomy;
- turns projection transport into canonical coupling;
- simple-system ergonomics suffers.

Disposition: **DEFER/DO_NOT_BUILD as universal architecture; possible realization optimization only if derived from authoritative change/evidence streams with reconciliation**.

### Model E — Persist only the commercial result/tier, discard burden assessment

Advantages:
- minimal storage;
- business sees exactly billed tier.

Failures:
- cannot explain why rating happened;
- cannot distinguish pricing-policy revision from architecture/evidence change;
- difficult provider/commercial dispute reconciliation;
- encourages pricing truth to replace architecture evidence;
- weakens falsifiability and historical simulation.

Disposition: **DO_NOT_BUILD for auditable rating**.

## Strongest evidence for the recommended model

1. **Materialized views demonstrate that durable derived state need not be source of truth.** CQRS and Materialize both separate source/query definition from persisted projection.
2. **OPA demonstrates that evaluated outcomes can be retained as evidence with exact revision/input context.** Persisting an assessment is valuable for historical truth even when the underlying policy/facts remain canonical elsewhere.
3. **W3C PROV distinguishes identity from derivation.** A derived assessment can have an identity without gaining canonical ownership over its sources.
4. **Reproducible-build systems show why input/tool closure matters.** A profile revision alone cannot prove repeatability if evidence inputs or evaluator semantics are mutable/unknown.
5. **Prometheus shows why materialization can be operationally worthwhile.** Repeated expensive projections can be prerecorded, but recorded results remain products of named expressions/windows.
6. **Generation-2 historical-interpretation research already requires retained interpretation closure.** Historical commercial assessment is a natural consumer of that closure.
7. **Generation-2 architecture-reconciliation findings already distinguish desired/effective/observed and attempted/applied/healthy.** Burden must not become a shortcut that collapses those source states.

## Strongest evidence against over-generalization

1. Not every burden assessment can be exactly replayed. Observability evidence may be sampled, aggregated, privacy-disposed or supplied by opaque providers.
2. Persisting every raw input forever conflicts with privacy/cost/retention goals. Historical reproducibility may need retained normalized evidence or a qualified non-replayable assessment rather than unlimited telemetry retention.
3. Incremental materialization can itself fail or lag. A materialized burden result needs freshness/coverage evidence; `stored=true` does not imply `current=true`.
4. Measurement profiles may contain empirical calibration coefficients that are population/time-specific. Replaying old input under a new calibration does not reproduce the old assessment.
5. Some commercial decisions may intentionally use negotiated/value-based pricing. A burden assessment can inform but must not masquerade as the pricing rule.
6. A global architecture graph may eventually be federated/partitioned. “Pure projection” cannot assume one physically centralized database.
7. Materialization systems such as databases/Prometheus do not solve semantic ownership automatically; they only illustrate implementation patterns.

## Contradictions reconciled

### Contradiction 1 — “If it is persisted, it becomes a second source of truth” vs “we need persisted history”

Resolution: **persist immutable derived evidence, not independently mutable burden facts**.

A `BurdenAssessment` may be stored durably. Its authority is narrow: it proves that evaluator/profile `M` evaluated subject revision `S` using evidence closure `E` at time/window `T` and produced vector `V`. It does not assert that `V` remains current after `S`, `E` or `M` changes.

### Contradiction 2 — “Pure projection avoids drift” vs “historical replay may become impossible”

Resolution: live/current burden should be projected from current authoritative facts. Historical/commercial decisions may retain the exact derived assessment plus enough interpretation/input closure to satisfy the required replay/audit profile. If closure has expired, retain the historical assessment with explicit `NON_REPLAYABLE`/limited-assurance status rather than inventing current reproducibility.

### Contradiction 3 — “Measurement profile is derived too” vs “profile must be revisioned”

Resolution: the **measurement profile is an authored interpretation rule** and therefore deserves revision identity. It is not a burden fact. Its outputs are derived assessments. This is analogous to a policy/query definition versus the decision/view result.

### Contradiction 4 — “Snapshots are duplication” vs “snapshots improve performance”

Resolution: materialization/snapshotting is a realization optimization with a validity relation to canonical inputs/profile. It is acceptable if invalidation/rebuild/provenance are explicit and it cannot be edited as independent semantic truth.

### Contradiction 5 — “Commercial rating needs stable inputs” vs “architecture changes continuously”

Resolution: rating consumes a **specific immutable burden assessment** or an assessment snapshot fixed to the contract/billing decision horizon, not a floating query against whatever the architecture looks like later. Re-rating under newer architecture/profile creates a new assessment/rating lineage.

## Candidate portable semantic model

Names remain subject to synthesis. The research recommendation distinguishes at least four objects/roles:

### 1. `MeasurementProfile` — first-class revisioned interpretation definition

Possible semantic contents:

```text
MeasurementProfile
  identity / revision
  applicable subject/profile scopes
  dimension definitions
  selectors over canonical evidence types
  normalization rules
  missing-data / INCONCLUSIVE semantics
  correlation/deduplication rules
  observation-window rules
  uncertainty / confidence method
  calibration dataset/model identity if any
  compatibility/stability metadata
```

It must **not** own provider/topology/authority/recovery facts.

### 2. `BurdenAssessment` — immutable derived evidence/assertion

Possible envelope:

```text
BurdenAssessment
  assessment identity
  subject + revision vector
  measurement-profile revision
  evaluator/conformance revision
  evidence/input closure identity
  evaluation timestamp
  observation windows
  typed burden dimensions
  coverage / uncertainty / unknown dimensions
  reproducibility / replayability class
  provenance / integrity
  supersedes/re-evaluates relation if applicable
```

It is historical evidence, not mutable architecture state.

### 3. `MaterializedBurdenProjection` — optional realization

An index/read model/cache/time-series/materialized view may store current or historical assessments for performance. Its storage topology/provider is not portable semantic identity.

### 4. `CommercialRatingPolicy` — separate revisioned business policy

Consumes one or more qualified burden assessments plus contract/value/market inputs and produces commercial outcomes. It cannot rewrite the burden evidence.

## Invariants

### I1 — Single ownership of source facts

Every authority, provider, topology, SLO, recovery, migration, compliance and observed-operations fact remains canonically owned by its defining capability/domain. Measurement only references/evaluates it.

### I2 — No editable derived burden truth

A burden assessment is generated by evaluation. Manual change to an output requires changing source facts, measurement profile or creating an explicit authorized override/adjustment artifact whose nature is visible; never mutate the historical assessment.

### I3 — Historical assessment ≠ current applicability

An assessment can remain historically valid and still be stale/inapplicable to the current system revision.

### I4 — Profile revision is mandatory for reproducible interpretation

Changing weights, normalization, dimensions, missing-data handling, correlation logic, windows or calibration changes measurement semantics and requires a new profile revision.

### I5 — Evidence closure is explicit

Assessment claims must identify the evidence/input closure or a reproducible reference/snapshot sufficient for the declared assurance level.

### I6 — Missing evidence is not zero burden

Unknown/unavailable/stale source evidence propagates as unknown/partial/INCONCLUSIVE according to the measurement profile; it must not silently become zero.

### I7 — Materialization is optional

Simple/local SB systems may evaluate a small profile on demand and persist only assessments that are externally/audit/commercially required. They do not need a dedicated analytics subsystem.

### I8 — Materialization failure cannot change architecture truth

A stale or failed projection affects query availability/freshness, not canonical provider/topology/recovery facts.

### I9 — Commercial policy cannot mutate measurement facts

Price/tier can change under a new commercial policy with the same burden assessment. Conversely a new burden assessment can exist without changing price.

### I10 — Provider substitution is evidence-visible

Replacing a provider may change realized observed burden while preserving semantic obligation dimensions. New assessment must identify new realization/evidence; historical assessment remains attributable to the prior provider revision.

### I11 — Privacy/retention qualification

Historical reproducibility cannot require retaining personal/sensitive telemetry indefinitely. The required evidence closure must respect privacy/disposition policy and may therefore degrade from exact replay to retained signed/qualified assessment evidence where permitted.

### I12 — No circular pricing evidence

Commercial price/tier cannot become an input architecture fact to the burden measurement unless the profile explicitly measures an externally imposed commercial operational constraint and keeps that dimension separate. Otherwise rating would feed back into measurement and become circular.

## Failure and adversarial analysis

### F1 — Source graph changes but materialized burden does not

Expected: assessment becomes stale/inapplicable for current-use queries. Historical use remains valid for its original revision/window. A materialization health signal must not hide the source-revision mismatch.

### F2 — Measurement rule changes without profile revision

Expected: conformance failure. Same profile revision must not silently evaluate different logic.

### F3 — Telemetry expires after invoice/support tier was decided

Expected: historical retained assessment remains explainable at its declared assurance. Exact replay may become unavailable; system records replayability degradation rather than recomputing against current telemetry.

### F4 — Attacker/manual operator edits cached burden result to lower price

Expected: materialized result integrity/provenance fails; canonical assessment is immutable/rederived. Commercial use rejects unauthenticated/unqualified projection output.

### F5 — Provider reports a proprietary “complexity score”

Expected: provider score may be attached as source/auxiliary evidence under provider-specific semantics but cannot automatically populate portable dimensions unless admitted/mapped by a measurement profile with conformance proof.

### F6 — Duplicate evidence double-counts one latent boundary

Expected: measurement profile's correlation/deduplication semantics prevent blind addition; raw evidence remains inspectable.

### F7 — Materialization pipeline lags during provider outage

Expected: current burden query reports freshness/coverage degradation or INCONCLUSIVE; no default to the last value as if current.

### F8 — Recompute old assessment under latest profile produces different vector

Expected: this is a new simulation/assessment with new profile revision; original historical assessment remains unchanged.

### F9 — Privacy erasure removes detailed operator/subject telemetry

Expected: required disposition occurs. Historical assessment may remain if its retained fields are permitted and non-subject-bearing; replayability/coverage metadata updates if source evidence is no longer available for replay.

### F10 — Federation/Station offline

Expected: a Station may evaluate only the burden dimensions whose evidence/profile/evaluator closure is locally qualified. Missing global evidence yields partial/INCONCLUSIVE assessment; offline mode cannot infer zero.

### F11 — Rating policy is changed to increase price but architecture is unchanged

Expected: burden assessment remains unchanged; only commercial rating lineage changes.

### F12 — New architecture proof invalidates a prior assumption

Expected: new assessment reflects the changed evidence/qualification. Historical burden assessment is not rewritten; its input closure remains inspectable.

## Provider-specific vs portable semantics

### Portable semantics to preserve

- subject/revision identity;
- measurement-profile identity/revision;
- evaluation activity identity/time/window;
- typed dimensions with units/meaning;
- evidence references/closure and provenance;
- coverage/uncertainty/unknown semantics;
- current applicability/freshness relation;
- replayability/reproducibility claim;
- supersede/re-evaluate lineage;
- separation from commercial rating policy.

### Provider-/realization-specific mechanisms

- SQL/materialized views/indexes;
- Prometheus recording rules;
- OLAP cubes/query engines;
- stream processors;
- feature stores;
- proprietary observability/service scores;
- provider-specific risk/health indices;
- materialization refresh mechanisms;
- caching/storage topology.

Generation 2 should **own the measurement semantics and evidence contract; delegate projection mechanics**.

## Consequences for existing findings/candidates/hypotheses

### `G2-CAPABILITY-CANDIDATE-RELATIVE-OPERATIONAL-COMPLEXITY-METERING-RATING`

Recommendation remains **MERGE / GENERALIZE / SPECIALIZE**, but this round sharpens the split:

1. **DO_NOT_BUILD** a mutable canonical `OperationalBurdenProfile` storing burden as system truth.
2. **KEEP / GENERALIZE** a revisioned `MeasurementProfile` as an authored interpretation/profile definition.
3. **KEEP / GENERALIZE** immutable `BurdenAssessment` as derived qualified evidence when retention/audit/rating requires it.
4. **PROVIDERIZE** materialization/query/cache mechanics.
5. **SPECIALIZE** `CommercialRatingPolicy` separately from architectural measurement.

No new top-level capability is justified by this question alone.

### Universal Capability Architecture

Strengthen the candidate distinction:

```text
canonical claim/fact
    ≠
evaluator/profile
    ≠
derived evidence/assertion
    ≠
materialized read model
    ≠
commercial decision
```

This pattern may generalize beyond burden measurement to conformance, compliance, readiness and generated-UI projections, but synthesis must avoid prematurely creating one universal mega-object.

### Qualified evidence

Add a reusable requirement for derived claims to expose:

- source/applicability revision;
- evaluator/profile revision;
- input/evidence closure;
- replayability/reproducibility status;
- freshness/coverage/uncertainty;
- historical versus current applicability.

### Historical Interpretation Closure

A retained burden assessment is interpretable only if its dimension vocabulary/profile/evaluator semantics remain available. Bare persisted numbers such as `recovery=8` are insufficient historical evidence.

### Commercial Rating/Billing

Historical rating should bind to exact assessment + commercial-policy revisions. Re-rating later is an explicit new calculation, not destructive reinterpretation of the original invoice/support decision.

### Observability/Operations

Telemetry is evidence input, not burden truth. Recording/materializing derived metrics is a valid realization optimization, but freshness and retention must remain explicit.

### Topology/Provider

Provider/topology substitutions may alter observed realized burden while preserving semantic requirement burden. This difference becomes visible rather than forcing one profile value to serve both roles.

## Proof obligations

These are research proof obligations for later acceptance translation; they are not executable work in this phase.

### DR-OBPM-01 — Source-change invalidation
- Start with subject revision S1 and qualified assessment A1.
- Change a canonical provider/topology/recovery fact to S2 without evaluating again.
- Current-query path must not report A1 as current for S2; historical query for S1 remains valid.

### DR-OBPM-02 — Materialized/read-model corruption
- Tamper with a materialized burden vector while source facts/profile remain unchanged.
- Integrity/reconciliation must reject or rebuild the projection; canonical facts remain unaffected.

### DR-OBPM-03 — Deterministic replay with retained closure
- Evaluate the same immutable subject/evidence/profile/evaluator closure twice.
- Where profile claims deterministic replay, logical burden vector and qualification metadata must match.

### DR-OBPM-04 — Hidden-input falsification
- Evaluator reads an undeclared mutable external metric/configuration.
- Strict reproducibility claim must fail; evaluator must either declare the dependency/snapshot or downgrade replayability.

### DR-OBPM-05 — Profile revision evolution
- Change normalization/weight/missing-data/correlation rule.
- New evaluation requires a new profile revision; old historical assessment remains unchanged.

### DR-OBPM-06 — Measurement versus price separation
- Apply two commercial rating policies to the same burden assessment.
- Architecture/burden evidence remains identical while price/tier may differ with explicit rating lineage.

### DR-OBPM-07 — Provider substitution
- Satisfy the same semantic requirement through two materially different providers with different toil/incident evidence.
- Semantic obligation dimensions remain stable where appropriate; realized-burden dimensions and provenance differ.

### DR-OBPM-08 — Materialization lag
- Delay/stop projection maintenance while source evidence advances.
- Query must expose stale/coverage state or recompute; it must not silently call last materialized vector current.

### DR-OBPM-09 — Missing evidence is not zero
- Remove one required observability/recovery/evidence dependency.
- Corresponding burden dimension becomes unknown/partial/INCONCLUSIVE according to profile; no zero/default simplification.

### DR-OBPM-10 — Historical telemetry expiry
- Retain A1 but expire raw telemetry according to policy.
- Historical decision remains attributable to A1/profile/input closure available at decision time; replayability status reflects lost raw evidence rather than inventing exact replay.

### DR-OBPM-11 — Privacy disposition
- Erase subject-bearing telemetry after a lawful disposition.
- Derived assessment may remain only if permitted/non-identifying; no retained assessment may reconstruct erased subject data. Replayability/coverage is updated honestly.

### DR-OBPM-12 — Simple-system ergonomics
- Evaluate a collapsed local system with a small deterministic evidence set.
- No dedicated OLAP/materialized-view/streaming infrastructure is required merely to satisfy architecture semantics.

### DR-OBPM-13 — Mature-system performance
- Evaluate a large fleet/profile repeatedly.
- Optional materialization materially improves query cost/latency while conformance proves equality/qualified equivalence with source projection for the same revision/window.

### DR-OBPM-14 — Federated/Station local closure
- Disconnect a Station with partial local evidence/profile closure.
- Local assessment covers only qualified dimensions; unavailable global facts produce explicit incompleteness and cannot broaden rating/authority semantics.

### DR-OBPM-15 — Manual-edit adversarial proof
- Attempt to directly edit a historical burden assessment's output vector.
- Mutation is denied; correction/re-evaluation creates a new append/supersede lineage with authority evidence.

### DR-OBPM-16 — Correlation/deduplication proof
- Supply provider count, external-boundary count, recovery procedures and failure modes caused by one shared dependency.
- Profile must demonstrate declared correlation/dedup semantics or explicitly retain separate dimensions without claiming additive total truth.

### DR-OBPM-17 — Provider proprietary score mapping
- Provider returns a health/complexity score with incompatible semantics.
- Score cannot populate portable dimensions without explicit mapping/profile/conformance evidence; otherwise it remains provider-specific auxiliary evidence.

### DR-OBPM-18 — Historical interpretation closure
- Retain burden vector but delete its dimension vocabulary/profile evaluator semantics.
- Historical interpretation must become INCONCLUSIVE/non-interpretable rather than treating raw numbers as self-describing.

### DR-OBPM-19 — Re-rating simulation versus historical truth
- Re-evaluate S1 under newer profile M2 and/or rating policy R2.
- Produce a new simulation/assessment/rating lineage; original A1/R1 commercial history remains immutable.

### DR-OBPM-20 — Non-circularity / Goodhart proof
- Increase commercial price for HIGH burden and attempt to feed resulting higher support spend/tier back into burden as evidence of higher intrinsic complexity.
- Unless explicitly modeled as a separate observed commercial-cost dimension, circular input must be rejected/isolated and cannot recursively inflate architecture burden.

## Falsification paths for material conclusions

1. **Projection-not-source conclusion would be falsified** if multiple independent mature architectures demonstrate that independently editable burden state is necessary for correctness and can remain authoritative without reconciliation to underlying architecture/evidence. Current evidence supports the opposite.
2. **Optional materialization conclusion would be falsified** if historical rating/audit can always be reproduced solely from retained canonical facts with bounded cost and no retention/privacy conflict. Current evidence shows practical reasons to retain evaluated outcomes/snapshots.
3. **First-class MeasurementProfile conclusion would be falsified** if measurement semantics can change without affecting interpretation/reproducibility. Prometheus/OPA/reproducibility evidence and prior G2 revision research indicate revisions matter.
4. **Immutable BurdenAssessment conclusion would be falsified** if destructive mutation of prior assessments is necessary to preserve truthful history. Existing commercial/evidence lineage research supports append/supersede instead.
5. **Input-closure requirement would be falsified** if profile revision plus output alone can reproduce historical evaluation despite mutable/missing evidence. Reproducibility systems demonstrate the dependency on declared inputs/environment.
6. **No-new-capability conclusion would be falsified** if synthesis finds a semantic ownerless lifecycle/authority domain that cannot be housed in qualified evidence + observability/operations + commercial rating. This round did not establish that need.

## Unresolved questions

1. What exact evidence closure must a `BurdenAssessment` retain versus reference through Historical Interpretation Closure?
2. Should observation windows be part of `MeasurementProfile`, assessment request/context, or both with constrained override semantics?
3. Which dimensions are purely semantic/declarative and which are inherently observational/time-varying?
4. How should profile compatibility be expressed when dimensions are added/removed/renamed or units change?
5. Can incremental assessment maintenance be proven equivalent to full recomputation for non-additive/correlated dimensions?
6. What is the minimum replayability taxonomy required: deterministic, snapshot-replayable, evidence-reconstructable, historical-only/non-replayable, INCONCLUSIVE?
7. How should uncertainty/confidence be represented without pretending probabilistic estimates are universal facts?
8. How much normalized evidence may be retained after raw telemetry privacy disposition?
9. Should historical commercial disputes require the original evaluator binary, a conformance-compatible interpreter, or only retained normalized inputs/profile/result?
10. Which owner governs measurement profiles: Architecture Reconciliation, Observability/Operations, Governance, a cross-cutting measurement service, or a declarative profile registry? Synthesis should resolve ownership without promoting a new capability by naming convenience.

## Confidence

### High confidence

- A mutable `OperationalBurdenProfile` must **not** become an independent canonical source of architecture truth.
- Measurement rules/profile semantics require revision identity.
- Historical evaluated outcomes can legitimately be retained as immutable derived evidence.
- Materialization/storage mechanism is provider/realization-specific and optional.
- Current versus historical applicability/freshness must be explicit.
- Missing/stale evidence must not silently become zero burden.
- Commercial rating remains separate from burden measurement.

### Medium-high confidence

- The best synthesis shape is `MeasurementProfile` + immutable `BurdenAssessment` derived from canonical evidence, with optional materialized projection.
- Assessment reproducibility should identify evaluator/profile/input closure and observation window.
- Append/supersede/re-evaluate lineage is preferable to destructive correction.

### Medium confidence / synthesis required

- Exact portable fields and naming.
- Ownership of measurement-profile lifecycle.
- Whether a generic derived-claim/evaluation primitive from UCA should subsume burden assessments.
- Exact replayability/uncertainty taxonomy.
- Required materialization/retention defaults for commercial installations.

## Explicit proposed dispositions

### KEEP
- Typed operational burden dimensions from `DR-ROCMR-01`.
- Separation of semantic burden, realized observed burden, measurement and commercial rating.
- Qualified-evidence and historical-interpretation semantics.

### GENERALIZE
- Model burden as a revision-qualified **derived assessment over canonical evidence**, not stored intrinsic state.
- Generalize derived-claim evidence to include source revision, evaluator/profile revision, input closure, freshness/coverage and replayability.

### MERGE
- Merge burden assessment provenance with UCA qualified-evidence/evaluator concepts rather than creating an independent evidence architecture.
- Merge historical burden retention with Historical Interpretation Closure and commercial rating lineage.

### SPECIALIZE
- `MeasurementProfile` as the burden-specific interpretation/profile definition.
- `CommercialRatingPolicy` as a separate business specialization consuming qualified assessments.

### PROVIDERIZE
- Materialized views, recording rules, OLAP stores, stream processors, caches and provider-specific health/complexity scores.

### DEFER
- Learned/predictive burden models and calibration infrastructure until sufficient production data exists.
- Exact profile owner/taxonomy until Capability Synthesis.

### DO_NOT_BUILD
- Mutable canonical `OperationalBurdenProfile` as a second source of truth.
- Directly editable assessment vectors.
- Materialization freshness as proof of source correctness.
- Provider proprietary score as portable truth without mapping/conformance.
- Bare historical scalar/vector without profile/vocabulary/evidence lineage.
- Pricing tier as architecture classification.
- Mandatory analytics/materialization infrastructure for simple systems.

## Research recommendation

The residual question from `DR-ROCMR-01` is sufficiently resolved for synthesis:

> **Operational burden should remain a reproducible/qualified projection over canonical Generation-2 architecture and evidence. The measurement rule/profile should be first-class and revisioned. Individual evaluated burden results may be retained as immutable derived evidence and optionally materialized for performance, audit or commercial reproducibility, but they must never become independently editable architecture truth.**

A useful concise formulation is:

```text
Facts own truth.
Profiles own interpretation.
Assessments own historical evaluated evidence.
Materializations own performance.
Commercial policies own price.
```

This preserves mature-system semantics with simple-system ergonomics: a small system can calculate burden directly and retain only required assessments, while a mature fleet can incrementally materialize the same projection without changing portable meaning.

## Recommended next deep question

**Qualified Derived-Claim Evaluation as a universal primitive or repeated pattern?** Generation 2 now repeatedly needs the same relation across burden assessment, policy decisions, conformance, generated-UI validation, readiness, historical interpretation and commercial rating: `subject revision + evaluator/profile revision + evidence/input closure + applicability/freshness → qualified derived claim`. Deep research should determine whether this is genuinely a universal UCA primitive or merely a disciplined pattern that must remain specialized to avoid an over-generic `Evaluation` mega-object.
