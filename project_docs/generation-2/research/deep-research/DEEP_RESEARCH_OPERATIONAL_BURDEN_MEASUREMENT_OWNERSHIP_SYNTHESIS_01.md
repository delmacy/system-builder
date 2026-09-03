# Generation 2 — Deep Research: Operational Burden Measurement Ownership — Synthesis Reconciliation 01

Status: COMPLETE — CAPABILITY SYNTHESIS RECONCILIATION RECOMMENDATION / NOT TARGET-ARCHITECTURE AUTHORITY

## Question

During Capability Synthesis, should `G2-CAPABILITY-CANDIDATE-RELATIVE-OPERATIONAL-COMPLEXITY-METERING-RATING` become a distinct CROSS_CUTTING semantic owner, or should its surviving semantics be reconciled into existing owners and universal primitives — specifically qualified derived claims/evidence, Observability/Operations, Architecture Reconciliation, Technology Economic Governance / FinOps and Commercial Metering / Rating?

The residual ownership question is narrower than the two earlier deep researches:

1. `DR-ROCMR-01` already falsified a universal scalar `ComplexityScore` and separated semantic burden, observed realized burden, measurement profile and commercial rating.
2. `DR-OBPM-01` already falsified a mutable canonical `OperationalBurdenProfile`, recommending revisioned `MeasurementProfile` + immutable derived `BurdenAssessment` with optional providerized materialization.

The remaining architecture-changing question is therefore:

> **Who owns the lifecycle and semantics of the measurement profile and burden assessment, and does that ownership justify a new capability?**

## Why this is architecturally material

A wrong disposition here creates one of two opposite failures.

If G2 promotes an `Operational Complexity` capability merely because measurement is cross-cutting, it risks introducing a new owner that duplicates facts from topology, authority, recovery, lifecycle, privacy, provider, observability and economic governance. That owner would become a semantic aggregation magnet and a Goodhart surface.

If G2 decomposes the candidate too aggressively, it can lose a real cross-cutting requirement: measurements need explicit information need/purpose, measurand/indicator definition, profile revision, evidence closure, applicability, uncertainty and reproducibility. Without a reusable structure, each domain can reinvent incompatible evaluation records and repeat stale-evidence, profile-drift and historical-replay bugs.

This disposition therefore affects:

- the canonical capability taxonomy;
- the universal-primitives register;
- ownership of authored measurement definitions;
- ownership of observational evidence versus derived assessment;
- Technology Economic Governance and customer-commercial rating boundaries;
- historical reproducibility and disputes;
- provider portability and semantic-convention mapping;
- proof reuse during Product Proof / Acceptance;
- simple-system ergonomics.

## System Builder input corpus

This reconciliation used the authoritative synthesis-entry corpus rather than treating earlier recommendations as final architecture:

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json` — Research Elicitation closure criteria are satisfied and the next execution is required to advance exactly one phase to `CAPABILITY_SYNTHESIS`; no Planning work is permitted in the same transition unless synthesis independently closes.
- `project_docs/generation-2/research/RESEARCH_EVIDENCE_METHOD.md` — multi-source triangulation and contradiction preservation; late work is information-gain driven.
- `project_docs/generation-2/research/ARCHITECTURE_PROOF_QUALITY_METHOD.md` — synthesis must deduplicate proofs and a primitive cannot be universal without cross-domain reuse proof.
- `project_docs/generation-2/research/CAPABILITY_DISCOVERY_REGISTER.md` — the relative-operational-complexity candidate is `RESEARCH_COMPLETE_PENDING_SYNTHESIS_DISPOSITION`; Technology Economic Governance is already promoted and saturated.
- `project_docs/generation-2/research/FINDING_INDEX.md` — compact index preserves prior findings and current centralized proof families.
- `project_docs/generation-2/research/REPRESENTATIVE_COVERAGE.md` — broad cross-capability representative coverage is already mature; this run does not reopen breadth collection.
- `project_docs/generation-2/research/CAPABILITY_PROOF_MATRIX.md` — UCA, Observability/Operations, Architecture Reconciliation and Commercial Metering each already have distinct proof responsibilities.
- `DEEP_RESEARCH_RELATIVE_OPERATIONAL_COMPLEXITY_MEASUREMENT_RATING_01.md` (`DR-ROCMR-01`).
- `DEEP_RESEARCH_OPERATIONAL_BURDEN_PROJECTION_MATERIALIZATION_01.md` (`DR-OBPM-01`).
- `DEEP_RESEARCH_QUALIFIED_DERIVED_CLAIM_EVALUATION_01.md` (`DR-QDCE-01`).
- `DEEP_RESEARCH_ECONOMIC_GOVERNANCE_FINOPS_PROCUREMENT_BOUNDARY_01.md` and `ECONOMIC_GOVERNANCE_FINOPS_PROCUREMENT_DISPOSITION.md`.
- `DEEP_RESEARCH_COMMERCIAL_USAGE_CORRECTION_RATING_BILLING_CLOSURE_01.md` (`DR-CURB-01`).
- Historical-interpretation, temporal-evidence, provider-substitution, Station/offline and authority deep researches as constraint sources.

Breadth candidates/findings and prior deep-research dispositions are treated as evidence/hypotheses to reconcile, not as unilateral target-architecture authority.

## External evidence ledger

This run intentionally adds only evidence that tests **ownership and measurement semantics**, not another broad complexity survey.

### E1 — ISO/IEC/IEEE 15939: measurement is driven by information needs, not by a universal measurement owner

ISO/IEC/IEEE 15939:2017 defines a measurement process for systems/software engineering and management. The official abstract emphasizes selecting a suitable set of measures for specific information needs, applying analysis results and determining whether results are valid. The process is explicitly tailorable/adaptable to different users.

Evidence:
- https://www.iso.org/standard/71197.html
- A successor DIS was registered on 2026-08-06: https://www.iso.org/es/contents/data/standard/09/51/95100.html

Architectural extraction:

- a measurement definition has lifecycle and purpose;
- the *information need* is owned by the consuming concern/domain;
- a generic measurement process can be reused without creating one semantic owner for every measured property;
- validity/applicability of analysis is part of measurement governance.

This supports a reusable measurement-profile/qualified-assessment relation, but **does not support a top-level Operational Complexity owner**.

### E2 — ISO/IEC 25020: measurement framework is reusable while quality semantics remain typed

ISO/IEC 25020:2019 provides a quality measurement framework applicable to system/software product quality, quality in use, data quality and IT service quality. It includes measure selection, reliability/validity, documentation, normalization and the relationship to ISO/IEC/IEEE 15939.

Evidence:
- https://www.iso.org/standard/72117.html

Architectural extraction: the reusable architectural value is a framework/profile for defining and qualifying measurements. The measured semantics remain attached to the quality model/domain rather than becoming owned by a universal scoring capability.

### E3 — ISO/IEC 25022: measured values do not imply universal rating levels

ISO/IEC 25022:2016 defines quality-in-use measures but explicitly does **not** assign universal value ranges to rated levels/grades; thresholds depend on context of use and user needs.

Evidence:
- https://www.iso.org/standard/35746.html

Architectural extraction: even where a standards family defines measures, **measurement and rating/classification remain separate**. This is directly analogous to G2 burden evidence versus commercial/support rating.

### E4 — JCGM VIM: a measurement requires a specified measurand and relevant information/uncertainty

The International Vocabulary of Metrology defines a measurand as the quantity intended to be measured, and notes that its specification requires describing relevant state/conditions. A measurement result is a set of quantity values attributed to the measurand together with other relevant information; measurement uncertainty is fundamental rather than optional decoration.

Evidence:
- https://jcgm.bipm.org/vim/en/2.3.html
- https://jcgm.bipm.org/vim/en/2.9.html
- https://jcgm.bipm.org/vim/en/2.50.html
- https://www.bipm.org/en/-/2025-07-03-webinar-explores-future-definition-of-measurement-uncertainty-1

Architectural extraction: `complexity=73` without a defined measured construct/profile, input model, scope and uncertainty is not semantically complete. This strengthens `MeasurementProfile` and qualified result semantics. It does not prove that “operational burden” is one physical/metrological quantity; on the contrary, it warns against pretending heterogeneous indicators are one natural scalar measurand.

### E5 — OpenTelemetry: common evidence vocabulary helps portability, but semantic ambiguity requires domain-specific names

OpenTelemetry semantic conventions standardize names/attributes for traces, metrics, logs, profiles and resources. Its metrics conventions explicitly warn against semantic ambiguity and recommend distinct/prefixed names where implementations differ enough that generic naming would create misleading comparisons.

Evidence:
- https://opentelemetry.io/docs/concepts/semantic-conventions/
- https://opentelemetry.io/docs/specs/semconv/general/metrics/

Architectural extraction:

- Observability can own provider-neutral collection/evidence contracts and semantic mappings;
- telemetry instruments are evidence sources, not the owner of burden interpretation;
- provider-native “health/complexity” scores cannot silently map to portable burden dimensions.

### E6 — SPACE / engineering-productivity research: multidimensional constructs resist one canonical scalar

The SPACE framework states that developer productivity cannot be measured by a single metric or dimension and instead uses multiple dimensions. A 2026 Microsoft engineering measurement system (`EngThrive`) continues the multidimensional pattern with separate Speed, Ease, Quality and Thriving guardrail dimensions, combining telemetry and surveys.

Evidence:
- Forsgren et al., *The SPACE of Developer Productivity*, ACM Queue 2021: https://www.microsoft.com/en-us/research/publication/the-space-of-developer-productivity-theres-more-to-it-than-you-think/
- Houck et al., *EngThrive: Make It Fast and Easy to Do Great Work*, 2026: https://www.microsoft.com/en-us/research/publication/engthrive-make-it-fast-and-easy-to-do-great-work/

Architectural extraction: multidimensional operational constructs are legitimately useful, but their measurement systems are designed around decision needs and guardrails. This reinforces profile-driven vectors and rejects a universal intrinsic complexity scalar.

### E7 — FinOps Unit Economics: economic interpretation can consume operational/technical measures without owning them

FinOps Unit Economics defines unit metrics aligned to business context and uses them for technology-investment/optimization decisions. At higher maturity, definitions have explicit ownership/governance and can incorporate fully loaded costs across technology categories.

Evidence:
- https://www.finops.org/framework/capabilities/unit-economics/

Architectural extraction: Technology Economic Governance can consume qualified operational measures as allocation/unit-economics inputs. It should own economic definitions/rates/allocations, **not retroactively own the operational burden semantics that generated those inputs**.

## Competing ownership models

### Model A — Promote `Operational Complexity / Burden Measurement` as a distinct CROSS_CUTTING capability

This owner would own burden dimensions, measurement profiles, assessments and perhaps commercial rating.

**Advantages**
- one obvious place for measurement UI/configuration;
- easy discovery and reporting;
- can centralize anti-gaming and calibration practices.

**Failures**
- duplicates semantic facts owned by authority, topology, provider, recovery, privacy, lifecycle and observability;
- risks becoming a universal “quality/complexity” meta-domain;
- `commercial rating` overlaps Commercial Metering/Rating and Technology Economic Governance;
- measurement purpose varies by consumer, so one owner would either over-own information needs or become a generic registry by another name;
- simple systems gain a mandatory capability even when no burden scoring/rating is needed;
- encourages scalarization and managerial override of architecture evidence.

**Disposition: DO_NOT_PROMOTE as a distinct top-level capability.**

### Model B — Put measurement ownership entirely inside Observability / Operations

Observability owns telemetry, SLOs, incidents, toil, measurements and resulting burden assessments.

**Advantages**
- natural home for observed evidence;
- mature collection/query mechanisms already exist.

**Failures**
- many burden inputs are declarative/semantic rather than observed: authority boundaries, offline guarantees, RTO/RPO obligations, legal/evidence requirements and provider-substitution obligations;
- Observability should not redefine requirements it observes;
- architecture facts can exist before runtime telemetry exists;
- commercial rating/economic interpretation remain separate.

**Disposition: SPECIALIZE Observability as evidence-source owner, not measurement semantic owner.**

### Model C — Put measurement ownership entirely inside Technology Economic Governance / FinOps

Economic Governance owns burden because burden ultimately informs support cost/chargeback/pricing.

**Advantages**
- strong need for auditable cost drivers and unit economics;
- natural governance for internal rates and allocation.

**Failures**
- burden may be used for architecture review, support capacity, risk review or operational planning without any economic purpose;
- economic policy can change without architecture/operational facts changing;
- commercial incentives could alter supposed architecture truth;
- customer-commercial rating remains a separate lifecycle from internal technology economics.

**Disposition: SPECIALIZE economic consumption/rating; do not transfer burden semantic ownership.**

### Model D — UCA owns a generic Measurement/Evaluation capability

A universal engine owns profile lifecycle, evaluation and results for authorization, conformance, readiness, burden, privacy, economic forecasts and other derived claims.

**Advantages**
- maximal reuse;
- uniform replay/provenance APIs.

**Failures**
- `DR-QDCE-01` already falsifies a universal evaluator/result vocabulary;
- different domains have different predicates, thresholds, freshness, authority and lifecycle;
- creates a “god evaluator” and semantic laundering risk.

**Disposition: DO_NOT_BUILD generic evaluator capability. GENERALIZE only the qualified-claim envelope and profile identity relation.**

### Model E — Distributed semantic ownership + shared qualified measurement/derived-claim primitives

Under this model:

```text
Domain-owned canonical facts / observations
        ↓
consumer-owned information need
        ↓
revisioned MeasurementProfile / EvaluationProfile
        ↓
qualified evaluation activity
        ↓
immutable BurdenAssessment / DerivedClaim
        ↓
optional consumers
  - Architecture/operations decision
  - support/capacity planning
  - Technology Economic Governance
  - customer-commercial rating policy
```

Ownership rules:

1. **Source facts remain with source capabilities.**
2. **Observability/Operations owns observed operational evidence semantics and collection coverage.**
3. **UCA / qualified-evidence primitives own only the structural envelope needed for subject/profile/evidence/applicability/provenance/replay lineage.**
4. **The authored `MeasurementProfile` belongs to the domain/decision context whose information need it serves**, registered through a common profile/evaluation contract rather than a new capability.
5. **Operational-burden vocabulary is a cross-cutting typed profile family**, not a canonical independent domain state.
6. **Technology Economic Governance owns internal economic interpretation, rates, allocation and unit economics.**
7. **Commercial Metering/Rating owns customer-commercial rating/billing semantics when burden is selected as an input.**
8. **Materialization/query engines are providerized.**

**Disposition: KEEP / MERGE / GENERALIZE / SPECIALIZE — strongest model.**

## Strongest evidence for Model E

1. `DR-ROCMR-01` and multi-domain measurement standards converge on profile-driven multidimensional measurement rather than one intrinsic scalar.
2. `DR-OBPM-01` establishes that durable derived assessments need not be source-of-truth state.
3. `DR-QDCE-01` already identifies the reusable structural envelope and explicitly uses BurdenAssessment as one cross-domain proof case.
4. ISO/IEC/IEEE 15939 makes measurement serve declared information needs; it does not imply one universal owner of everything measured.
5. ISO/IEC 25020/25022 show reusable measurement frameworks with domain/context-specific measures and thresholds.
6. OpenTelemetry demonstrates a provider-neutral evidence layer while warning against semantic ambiguity.
7. Technology Economic Governance already has a proven/saturated owner for economic interpretation and therefore does not need the complexity candidate promoted merely to get internal rates/unit economics.
8. The existing Commercial Metering lifecycle already owns commercial rating separately from usage/economic source facts.

## Strongest evidence against over-generalization

1. `MeasurementProfile` should not automatically become a universal UCA-authored object for every capability. Its **envelope** may be universal; predicate/dimensions/threshold semantics remain owner-specific.
2. “Operational burden” is not proven to be a single natural measurand. It is a decision-oriented composite construct, often combining categorical obligations, observations and normalized indicators.
3. Not all dimensions support cardinal arithmetic. Safety, authority, offline autonomy and irreversible effects may impose categorical floors/vetoes rather than additive weights.
4. A profile can be valid for support planning and invalid for pricing or architecture admission. Applicability/purpose must be explicit.
5. Cross-organization comparison may be invalid when baselines, automation maturity, provider realization and evidence coverage differ.
6. Statistical/ML calibration can be useful but remains population/time/model-qualified and advisory unless explicitly governed by a domain decision policy.

## Contradictions reconciled

### C1 — “Cross-cutting measurement needs a cross-cutting capability” vs “measurement duplicates domain truth”

**Resolved:** cross-cutting reuse justifies a **shared primitive/profile contract**, not necessarily a new semantic capability. The candidate does not own the facts it measures.

### C2 — “MeasurementProfile needs revision identity, therefore it needs an owner” vs “no new capability”

**Resolved:** revision identity does not imply a dedicated top-level capability. A profile is an authored policy/evaluation definition whose semantic owner is the decision/domain context; UCA/Lifecycle can provide generic revision/provenance mechanics.

### C3 — “Operational burden is needed commercially” vs “pricing must not redefine architecture”

**Resolved:** burden assessments are qualified inputs. Technology Economic Governance and customer-commercial rating apply separately revisioned policies. Changing price/rate does not mutate burden evidence.

### C4 — “Observed toil is the best evidence” vs “architecture obligations exist before operations”

**Resolved:** preserve separate **semantic/declarative obligation dimensions** and **observed realized burden dimensions**. Both can participate in one declared profile, but are never silently substituted.

### C5 — “A burden assessment is first-class” vs “no new domain state”

**Resolved:** first-class identity/evidence does not imply canonical domain ownership. `BurdenAssessment` is an immutable qualified derived claim.

### C6 — “All measurement should normalize to one comparable number” vs “commercial product needs simple tiers”

**Resolved:** simple tier/score outputs are permitted as **purpose/profile-qualified projections**. Their source vector/profile and applicability remain inspectable. No scalar is canonical architecture truth.

## Synthesis invariants

### I1 — No new canonical complexity owner

No capability may claim ownership of authority, topology, recovery, provider, SLO, privacy, lifecycle or observed-operational facts merely because it measures them.

### I2 — Information need / purpose is explicit

A measurement profile must state the decision/information need it serves. `support_capacity`, `architecture_review`, `internal_cost_allocation` and `customer_pricing_input` are not interchangeable purposes.

### I3 — Profile and assessment are different identities

```text
MeasurementProfile revision
    ≠
Evaluation activity
    ≠
BurdenAssessment / result
    ≠
Commercial/economic decision
```

### I4 — Qualified derived-claim reuse, not evaluator unification

BurdenAssessment should reuse the UCA qualified-claim envelope if synthesis cross-domain proof succeeds, while retaining burden-specific dimensions/result schema.

### I5 — Source semantics remain typed

A provider count, incident count, RTO, authority-domain boundary and privacy obligation are not interchangeable quantities. Normalization is a declared profile transformation.

### I6 — Unknown/partial evidence is not zero

Missing/stale/incompatible evidence propagates coverage/uncertainty/`INCONCLUSIVE` according to the profile.

### I7 — Economic conversion is downstream

Internal cost/rate allocation and customer-commercial rating are separate derived decisions over qualified inputs and separately revisioned policies.

### I8 — Materialization is not authority

Caches, time series, OLAP views and provider-native scores are optional realizations and cannot become canonical burden identity by storage convenience.

### I9 — Historical replay preserves profile purpose and revision

Replaying old facts under a new profile/rating policy produces a simulation/new assessment, never a rewrite of historical truth.

### I10 — Simple-system ergonomics

A small system with no pricing use case can omit burden scoring entirely or use a local deterministic profile without deploying an analytics/FinOps subsystem.

## Provider-specific versus portable semantics

### Portable semantics to preserve

- profile identity/revision and declared purpose/information need;
- subject + revision vector;
- typed dimension/predicate vocabulary reference;
- input/evidence closure;
- observation window/currentness/applicability;
- normalization/evaluation revision;
- coverage/uncertainty/unknown semantics;
- result provenance/integrity;
- replayability/reproducibility claim;
- supersession/re-evaluation lineage;
- separation from economic/commercial decision revisions.

### Providerized mechanics

- telemetry collectors/backends;
- SLO/incident/ticket/toil systems;
- dependency/topology discovery;
- materialized views/OLAP/streaming;
- proprietary health/complexity indices;
- statistical/ML scoring engines;
- FinOps cost ingestion;
- billing/rating engines.

Provider substitution must preserve the required portable semantics or surface a mixed/partial support vector; it must never silently weaken evidence coverage or alter the meaning of a burden dimension.

## Consequences for existing findings/candidates/hypotheses

### `G2-CAPABILITY-CANDIDATE-RELATIVE-OPERATIONAL-COMPLEXITY-METERING-RATING`

**Synthesis recommendation: MERGE + GENERALIZE + SPECIALIZE + DO_NOT_PROMOTE under the current name.**

Decompose as follows:

- **MERGE** `BurdenAssessment` structural qualification into the qualified-derived-claim/UCA primitive family, subject to the existing cross-domain proof.
- **GENERALIZE** revisioned measurement/evaluation profile semantics as a reusable cross-cutting contract/primitive family, not a capability owner.
- **KEEP** a typed Operational Burden profile vocabulary as a reusable decision-profile family where needed.
- **SPECIALIZE** observed toil/incidents/SLO evidence in Observability/Operations.
- **SPECIALIZE** architecture/topology/authority/recovery/privacy/provider facts in their current owners.
- **SPECIALIZE** internal economic conversion/allocation/unit economics in Technology Economic Governance / FinOps.
- **SPECIALIZE** customer-commercial rating/billing in Commercial Metering / Rating / Billing.
- **PROVIDERIZE** metric collection, materialization, statistical scoring and billing engines.
- **DEFER** learned fleet-wide predictors until enough calibrated SB operational history exists.
- **DO_NOT_BUILD** `ComplexityMeter`, global `complexity_score`, editable canonical burden state or a generic evaluator engine.

### Universal Capability Architecture / qualified evidence

`DR-QDCE-01` gains its strongest third-domain synthesis case: Authorization, Conformance and BurdenAssessment can share qualification/provenance mechanics while preserving different result schemas and authority. This is evidence **for the relation**, not for a universal evaluator capability.

### Observability / Operations

Observability owns collection semantics, freshness/coverage and observed operational facts. It does not own declarative architecture burden or commercial interpretation.

### Architecture Reconciliation

Architecture Reconciliation can consume burden assessments for diagnostics/prioritization, but cannot mutate canonical architecture or classify provider/topology obligations solely from a burden score.

### Technology Economic Governance / FinOps

Economic Governance may consume qualified burden assessments as allocation/rate/unit-economics drivers. Its internal economic policy revision is a separate transformation and cannot back-propagate into burden measurement truth.

### Commercial Metering / Entitlements / Rating / Billing / Payment

Operational burden is **not customer usage metering**. When contractually selected, it can be a qualified rating input under an explicit commercial policy revision. Entitlement, usage, invoice, settlement and payment retain their independent lifecycles.

### Capability taxonomy

No additional active top-level capability is recommended from this candidate. Synthesis should record a cross-cutting **measurement/evaluation profile primitive family** and map operational burden as one consumer/profile family.

## Proof obligations — DR-OBMOS

These are synthesis proof obligations for later acceptance translation; no product code is executed here.

### DR-OBMOS-01 — Cross-domain qualified-claim reuse
Represent Authorization, Conformance and BurdenAssessment through the same structural subject/profile/evidence/applicability/provenance envelope. Pass only if each domain retains its own result schema, authority and lifecycle without meaningless mandatory fields.

### DR-OBMOS-02 — Profile-purpose mismatch
Create a valid support-capacity burden assessment and present it directly as a customer-pricing or architecture-admission result. Consumption must reject or require an explicit downstream policy/profile that declares the transformation.

### DR-OBMOS-03 — Source-owner integrity
Change an RTO or authority boundary through an attempted burden-profile edit without changing the source capability. Canonical source fact must remain unchanged; measurement cannot acquire source mutation authority.

### DR-OBMOS-04 — Observability boundary
Remove runtime telemetry while declarative recovery/authority/topology facts remain known. Observed dimensions become partial/INCONCLUSIVE while declarative dimensions remain addressable; no whole-profile zeroing or false completeness.

### DR-OBMOS-05 — Pre-runtime assessment
Evaluate a newly designed system before production telemetry exists. Profile may assess declared semantic obligations with explicit absence of realized-burden history; lack of incidents must not imply low realized risk/burden.

### DR-OBMOS-06 — Automation effect separation
Automate 80% of operator toil without changing semantic recovery/SLO/privacy/authority obligations. Realized burden changes; semantic obligation dimensions do not.

### DR-OBMOS-07 — Economic-policy separation
Apply two internal rate/allocation policies to the same qualified burden assessment. Burden evidence remains unchanged while economic outputs differ with explicit Technology Economic Governance revisions.

### DR-OBMOS-08 — Commercial-policy separation
Apply two customer-commercial rating policies to the same burden assessment. Price/tier may differ; burden facts/profile remain unchanged and neither output becomes architecture truth.

### DR-OBMOS-09 — Provider-native score isolation
Provider A returns `complexity=82`; provider B returns `health=green`. Without explicit mapping/profile/conformance evidence, neither may populate portable burden dimensions.

### DR-OBMOS-10 — Provider substitution
Replace telemetry/materialization/scoring provider while preserving the same profile semantics. If one provider lacks required dimensions/currentness/evidence closure, result becomes PARTIAL/INCONCLUSIVE rather than silently comparable.

### DR-OBMOS-11 — Measurement-profile revision
Change normalization, dimension definition, baseline, correlation handling or missing-data semantics. New evaluations require a new profile revision; historical assessments remain immutable.

### DR-OBMOS-12 — Scalar projection non-authority
Two different burden vectors intentionally map to the same support tier/scalar. Downstream consumers requiring a specific safety/recovery dimension must still inspect/require that dimension rather than infer equivalence from the scalar.

### DR-OBMOS-13 — Cross-profile comparison rejection
Attempt direct ordering of scores produced under incompatible profile revisions/baselines/populations. System must reject, bridge through explicit equivalence evidence or mark comparison INCONCLUSIVE.

### DR-OBMOS-14 — Correlated evidence / no double count
One provider boundary generates dependency, recovery, incident and toil evidence. Profile must preserve evidence while preventing an unsupported claim that these are four independent additive burden units.

### DR-OBMOS-15 — Historical replay
Reproduce a historical assessment from retained subject/profile/evidence/evaluator closure. If raw evidence has lawfully expired, replayability is downgraded honestly while the retained historical assessment remains attributable at its declared assurance.

### DR-OBMOS-16 — Materialization corruption
Corrupt/delete a materialized burden view. Canonical source facts and immutable assessment evidence remain unaffected; current queries rebuild/recompute or expose stale/unavailable state.

### DR-OBMOS-17 — Station/offline partial closure
A disconnected Station evaluates only locally qualified dimensions. Missing Enterprise/global inputs remain explicit; local assessment cannot broaden Station authority or manufacture a globally complete rating.

### DR-OBMOS-18 — AI/AGWS non-amplification
AI proposes a measurement profile or returns a high-confidence burden result. Without authorized profile publication/adoption and downstream decision authority, neither action can mutate canonical facts, pricing, provider configuration or Station authority.

### DR-OBMOS-19 — Simple-system ergonomics
A collapsed local system with no commercial rating requirement must satisfy architecture semantics without dedicated observability warehouse, FinOps engine or complexity service. Optional local profile evaluation remains possible.

### DR-OBMOS-20 — Falsify need for a new capability
Implement the synthesis model using existing semantic owners + shared qualified-profile/claim primitives. If a lifecycle/authority/source-of-truth obligation remains ownerless — specifically profile publication authority, profile compatibility, correction/supersession or provider portability — the `DO_NOT_PROMOTE` recommendation must be reopened. Otherwise the candidate is successfully decomposed.

## Falsification paths for material conclusions

1. **No-new-capability disposition is falsified** if synthesis demonstrates a lifecycle with independent source-of-truth, authority, state transitions and provider boundary that cannot be assigned to profile governance/qualified claims or an existing capability without circular ownership.
2. **UCA primitive reuse is falsified** if Authorization, Conformance and BurdenAssessment cannot share the qualification envelope without semantic loss or mandatory nonsense fields.
3. **Distributed profile ownership is falsified** if independent domains cannot reliably govern profile revisions/compatibility through a common contract and require one central authority for correctness rather than convenience.
4. **Observability-as-input conclusion is falsified** if burden semantics can be shown to be fully observational and no declarative architecture obligation is required; the current corpus strongly contradicts this.
5. **Economic/commercial separation is falsified** only if a contractual/economic model necessarily changes the underlying measured architecture fact; current standards and G2 economic/billing research support separate transformations.
6. **Optional materialization is falsified** if the required assurance/replay model cannot be achieved without a mandatory central burden store even for simple systems.

## Unresolved questions for synthesizers

1. Exact canonical name of the shared profile/qualified-evaluation primitive family: `EvaluationProfile`, `MeasurementProfile`, `QualifiedAssessmentProfile`, or a more general relation.
2. Whether profile publication/adoption authority belongs generically to Governance/Lifecycle or remains capability-specific with only a shared envelope.
3. Whether typed operational-burden dimension vocabulary belongs in the universal-primitives register, a profile catalog, or the Observability/Operations synthesis entry.
4. Minimum compatibility relation between two profile revisions: identical, backward-compatible, bridgeable/equivalent, or incomparable.
5. Minimum uncertainty/coverage vocabulary that is genuinely cross-domain rather than burden-specific.
6. How much normalized evidence may survive privacy disposition while preserving commercial dispute evidence.
7. Whether a future fleet-calibrated predictor is only advisory evidence or can become a governed rating input under explicit confidence/OOD constraints.

None of these unresolved questions currently proves a new top-level capability owner.

## Confidence

### High confidence

- Do not promote the current conflated `RELATIVE-OPERATIONAL-COMPLEXITY-METERING-RATING` candidate unchanged.
- Do not build a universal scalar complexity truth or editable canonical burden state.
- Source facts remain with their semantic owners.
- Observability evidence, burden interpretation, internal economics and customer-commercial rating are distinct ownership layers.
- `BurdenAssessment` is structurally compatible with the qualified-derived-claim family.

### Medium-high confidence

- Measurement/evaluation profile semantics deserve a reusable cross-cutting primitive/contract family rather than a new capability.
- Profile purpose/information need must be explicit for safe reuse and comparison.
- Operational-burden vocabulary should remain a typed profile family and not a universal quantity model.

### Medium confidence

- Exact profile-publication authority and compatibility vocabulary.
- Exact placement of burden dimension catalog in the synthesis taxonomy.
- Whether future calibrated fleet predictors warrant a specialized economic/operations subcapability.

## Explicit proposed dispositions for Capability Synthesis

### KEEP
- typed operational-burden dimensions as a reusable profile vocabulary;
- semantic-versus-realized burden distinction;
- immutable burden-assessment evidence;
- purpose/profile/revision/evidence/currentness lineage.

### MERGE
- `BurdenAssessment` qualification/provenance into the UCA qualified-derived-claim primitive family;
- generic profile revision/applicability mechanics with Lifecycle/qualified evidence rather than a new complexity owner.

### GENERALIZE
- a small reusable measurement/evaluation-profile contract driven by declared information need/purpose;
- cross-domain proof of subject + profile + evidence closure + applicability/currentness + provenance.

### SPECIALIZE
- Observability/Operations: observed toil/incidents/SLO/coverage evidence;
- architecture/security/topology/provider/privacy owners: their canonical facts;
- Technology Economic Governance: internal economic interpretation, rates, allocation and unit economics;
- Commercial Metering/Rating: customer-commercial rating/billing;
- operational-burden dimension/profile vocabulary: specialized profile family over shared primitives.

### PROVIDERIZE
- collection, materialization, OLAP/time-series, dependency discovery, statistical/ML scoring and billing engines.

### DEFER
- fleet-trained complexity/burden predictors and universal coefficients until calibrated empirical evidence exists.

### DO_NOT_BUILD / DO_NOT_PROMOTE
- top-level `Operational Complexity Meter` capability under the current candidate name;
- universal `complexity_score` as architecture truth;
- editable canonical `OperationalBurdenProfile`;
- generic evaluator engine or universal result vocabulary;
- implicit direct comparison across incompatible profile revisions/populations;
- pricing/economic policy as authority over architecture facts.

## Synthesis recommendation

The synthesizers should **decompose rather than promote** `G2-CAPABILITY-CANDIDATE-RELATIVE-OPERATIONAL-COMPLEXITY-METERING-RATING`.

The surviving architectural principle is:

> **Own the facts where they arise; own the decision where it is made; standardize only the qualification/profile/provenance relation needed to connect them.**

Operational burden remains valuable and auditable, but it should exist as a purpose-qualified multidimensional assessment over canonical evidence. Economic or commercial rating is a separate downstream transformation. This satisfies mature-system semantics while preserving simple-system ergonomics and provider leverage.
