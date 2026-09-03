# Generation 2 — Deep Research: Relative Operational Complexity Measurement & Commercial Rating 01

Status: COMPLETE — RESEARCH RECOMMENDATION / NOT TARGET-ARCHITECTURE AUTHORITY

## Question

Can System Builder measure the **relative operational complexity** of a capability/system from auditable architecture and operations evidence — authority/trust boundaries, provider dependencies, topology/failure domains, recovery/evolution obligations, evidence burden, human criticality, SLOs and observed operational work — in a way that is portable, resistant to double counting and gaming, useful for capacity/support/commercial rating, and still preserves the rule that pricing policy must never redefine architectural truth?

## Why this is architecturally material

Generation 2 already has a mandatory pending candidate, `G2-CAPABILITY-CANDIDATE-RELATIVE-OPERATIONAL-COMPLEXITY-METERING-RATING`. The candidate is attractive because System Builder will eventually need to reason about materially different support/operations burdens: a single-process local capability is not operationally equivalent to a multi-provider, highly available, regulated, offline/reconciling, multi-tenant realization with strict recovery and evidence obligations.

But making “complexity” a scalar primitive too early creates serious architectural hazards:

- lines of code, service count, provider count or workflow-node count can reward implementation accidents rather than semantic burden;
- correlated factors can be counted repeatedly (for example provider count, failure modes, recovery obligations and toil may all arise from one boundary);
- a commercial multiplier can create incentives to make systems appear more complex, or to resist simplification;
- quality, risk, effort, cost, reliability target and actual operational toil are related but not interchangeable;
- provider-specific mechanics can change the cost of realizing the same portable requirements without changing their semantic identity;
- simple-system ergonomics requires enterprise semantics without mandatory enterprise ceremony;
- observed cost today is not necessarily intrinsic complexity: automation/provider leverage may reduce toil while preserving demanding correctness obligations;
- pricing policy is a business decision and must not become an architecture classifier.

The high-value architectural question is therefore not “what number is complexity?” but **what facts are canonical, which interpretations are profiles, and where may a commercial rating function legitimately begin?**

## System Builder input corpus

Mandatory corpus consulted for this round:

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json` — phase is `RESEARCH_ELICITATION`; five full cycles are complete; cycle 6 has 24/25 capability revisits completed. Deep research must not increment `completed_full_cycles`, mark a capability revisited or declare saturation.
- `project_docs/generation-2/research/RESEARCH_EVIDENCE_METHOD.md` — requires triangulation across production systems, standards, scientific literature and industrial engineering evidence, preserving contradictions instead of averaging them away.
- `project_docs/generation-2/research/ARCHITECTURE_PROOF_QUALITY_METHOD.md` — material claims require explicit semantic, adversarial, failure, authority, provider, version, evidence and simple-system proof obligations.
- `project_docs/generation-2/research/CAPABILITY_DISCOVERY_REGISTER.md` — `G2-CAPABILITY-CANDIDATE-RELATIVE-OPERATIONAL-COMPLEXITY-METERING-RATING` is `CROSS_CUTTING / PENDING_RESEARCH`; promotion remains blocked on this dedicated research/negative-space challenge.
- `project_docs/generation-2/research/FINDING_INDEX.md` — current research emphasizes typed identities, desired/effective/observed separation, qualified closures, explicit ambiguity and non-amplifying authority; compact index does not revoke earlier findings.
- `project_docs/generation-2/research/REPRESENTATIVE_COVERAGE.md` — broad architecture/provider/security/developer-operator coverage is deep, but commercial/relative complexity remains negative-space rather than a saturated standalone capability.
- `project_docs/generation-2/research/CAPABILITY_PROOF_MATRIX.md` — Commercial Metering/Entitlements/Rating/Billing/Payment already has proof debt for entitlement, usage evidence, reproducible rating, quotas, billing evidence, payment boundary and dispute/replay; the matrix also separately tests reliability, recovery, portability, operational simplicity and topology.
- `project_docs/generation-2/research/deep-research/DEEP_RESEARCH_COMMERCIAL_USAGE_CORRECTION_RATING_BILLING_CLOSURE_01.md` — establishes separate Entitlement → Metering → Rating → Billing → Payment lifecycles, immutable correction lineage, rating revision identity and provider-neutral commercial evidence.
- Prior deep researches on transaction/effect semantics, offline Station rights, reclaim/fencing, composite effect closure, long-lived Gate evolution, historical interpretation, privacy/disposition and derived-data closure — used to test whether complexity can safely compress their obligations into one number.
- Generation-2 concept hypotheses for topology/build/runtime realization, provider leverage, autonomous closure, Station/AGWS authority and semantic longitudinal process composition.

Breadth findings/candidates were treated as hypotheses and input corpus, not as external factual authority.

## External evidence ledger

### E1 — ISO/IEC 25010:2023: quality is multi-characteristic, not one scalar complexity truth

ISO/IEC 25010:2023 defines a product quality model containing **nine characteristics**, further decomposed into subcharacteristics, intended to support specification, measurement and evaluation across a product lifecycle. The standard does not define one universal “software complexity” number that replaces reliability, security, maintainability, flexibility, performance, compatibility, safety and other quality concerns.

Evidence:
- https://www.iso.org/standard/78176.html

Architectural extraction: SB should preserve typed quality/obligation dimensions rather than claim that one scalar complexity score is architectural truth. A scalar can exist only as an explicit projection for a declared decision/profile.

### E2 — Google SRE: operational toil is observable burden, but not equivalent to architecture complexity

Google SRE defines toil as work tied to running a production service that tends to be manual, repetitive, automatable, tactical, lacking enduring value and often growing linearly with service size. Google explicitly measures toil and targets reducing it, while treating engineering investment as a way to reduce future operational burden.

Evidence:
- https://sre.google/sre-book/eliminating-toil/
- https://sre.google/workbook/eliminating-toil/

Architectural extraction: observed operator effort/toil is useful evidence of **realized operational burden**, but it is not intrinsic semantic complexity. Better automation can lower toil without changing safety, authority, recovery or portability obligations. Complexity measurement should therefore distinguish declared burden from observed realized cost/toil.

### E3 — Google SRE error budgets: reliability policy is outcome/risk-oriented, not a complexity multiplier

Google’s SRE error-budget model derives action from SLO performance and error-budget consumption. The policy is explicitly a control mechanism balancing reliability and change velocity; it does not infer reliability from microservice count or code size.

Evidence:
- https://sre.google/workbook/error-budget-policy/
- https://sre.google/sre-book/embracing-risk/

Architectural extraction: SLO strictness, error-budget consumption and incident consequences are separate evidence dimensions. A strict SLO may increase support/rating burden, but it must not be represented as “the system is objectively X% more complex” without a declared rating model.

### E4 — NIST SP 800-30 Rev. 1: risk is driven by likelihood and impact, not complexity alone

NIST defines risk in terms of the extent an entity is threatened by circumstances/events, typically as a function of adverse impact and likelihood. Its risk-assessment process treats threat, vulnerability, controls and impact as structured inputs rather than substituting a generic complexity score.

Evidence:
- https://csrc.nist.gov/pubs/sp/800/30/r1/final
- https://csrc.nist.gov/glossary/term/risk

Architectural extraction: security/resilience risk must remain a typed risk/evidence concern. Complexity may correlate with exposure, but cannot replace likelihood/impact/control evidence.

### E5 — COSMIC / ISO/IEC 19761: functional size is intentionally a different measurement problem

COSMIC defines an ISO-recognized Functional Size Measurement method applicable across software types and development techniques. Its purpose is to measure functional size from user-visible data movements, not operational/reliability/security burden.

Evidence:
- https://cosmic-sizing.org/

Architectural extraction: functional size is useful evidence for estimation, but it falsifies the assumption that “more LOC/functions” is a portable operational-complexity truth. Functional size and operational burden must remain distinct axes.

### E6 — COCOMO II: cost estimation uses multiple cost drivers, not size alone

COCOMO II’s post-architecture effort model combines software size with multiple cost drivers such as required reliability, product complexity, documentation/lifecycle needs, execution/storage constraints, platform volatility, personnel/tool/site factors and schedule. Even this cost-estimation model does not equate implementation size with total engineering effort.

Evidence:
- Barry Boehm et al., *COCOMO II Model Definition Manual*, Version 2.1 (2000); accessible mirror: https://sceweb.uhcl.edu/boetticher/swen5230/modelman.pdf
- Sunita Chulani & Daniel Ferens, “COCOMO”, Encyclopedia of Software Engineering (2002), DOI 10.1002/0471028959.sof043

Architectural extraction: multiple drivers can improve estimation, but COCOMO factors are development-effort predictors calibrated to specific datasets, not universal SB operational primitives. It supports **multi-driver estimation** while warning against adopting old model coefficients as architecture truth.

### E7 — Empirical software-metrics research: cumulative metrics are often strongly correlated

Al Mamun, Berger and Hansson (Empirical Software Engineering, 2019) found cumulative software metrics highly correlated with each other (average coefficient reported around 0.79 in their dataset) and identify cumulative measurement as a major source of collinearity. Collinearity makes it difficult to isolate individual effects and can degrade extrapolation/model interpretation.

Evidence:
- https://link.springer.com/article/10.1007/s10664-019-09714-9

Architectural extraction: naïvely adding provider count + dependency count + failure-mode count + recovery procedure count + incident count can double-count shared latent causes. Any composite rating must declare factor dependencies, normalization/calibration and uncertainty; independent raw dimensions should remain inspectable.

### E8 — Maintainability/quality metric research: metric validity and cross-context portability remain limited

Research evaluating internal software-quality metrics finds that many metrics exposed by tools lack strong validation, and cross-language/application comparability is difficult. Longitudinal quality studies also show that different maintainability models can disagree and require manual/contextual interpretation.

Evidence:
- https://arxiv.org/abs/1909.09682
- https://arxiv.org/abs/2003.00447
- https://arxiv.org/abs/2009.01557

Architectural extraction: SB must not freeze one implementation/code metric as universal operational truth. Any learned/calibrated predictor must state its population, version, uncertainty and validity envelope.

### E9 — DORA: architecture affects delivery outcomes through decoupling/coordination properties

DORA reports that loosely coupled teams/architecture are predictors of continuous-delivery performance: teams can deploy, test and make changes independently with less cross-team coordination.

Evidence:
- https://dora.dev/capabilities/loosely-coupled-teams/
- https://dora.dev/capabilities/continuous-delivery/

Architectural extraction: coordination boundaries and independent deployability are stronger operational facts than microservice count. A system with many units can be operationally simpler than a tightly coupled system with fewer units. Therefore “count the services” is a poor portable metric.

### E10 — Goodhart/Campbell effect: commercializing the metric changes the system being measured

Goodhart’s law is commonly summarized as the failure of a measure when it becomes an optimization target. Recent formal work shows conditions under which over-optimizing proxy metrics can become useless or actively harmful to the true goal.

Evidence:
- El-Mhamdi & Hoang, *On Goodhart's law, with an application to value alignment*, arXiv:2410.09638 (2024): https://arxiv.org/abs/2410.09638
- Majka & El-Mhamdi, *The Strong, Weak and Benign Goodhart's law*, arXiv:2505.23445 (2025): https://arxiv.org/abs/2505.23445

Architectural extraction: once complexity evidence affects price/support tier, parties have incentives to game the proxy. Therefore **measurement facts must be architecture-owned and pricing weights must be commercially owned, versioned and auditable**. Pricing must not mutate the underlying architecture classification.

## Competing models

### Model A — One intrinsic universal complexity score

Example:

```text
complexity = providers + services + workflows + integrations + users + LOC
```

Advantages:
- easy to explain and sort;
- easy to map to pricing tiers.

Failures:
- heterogeneous units have no universal additive meaning;
- double-counts correlated manifestations;
- implementation choice changes score even when semantic obligation is unchanged;
- encourages architectural gaming;
- obscures uncertainty/missing evidence;
- cannot distinguish high business criticality from high operational effort;
- violates simple-system/provider-leverage goals.

Disposition: **DO_NOT_BUILD as architectural truth**.

### Model B — Code/functional size as complexity proxy

Use LOC, function points, COSMIC Function Points, number of entities/processes or code complexity.

Advantages:
- measurable and often useful for development estimation;
- functional-size standards provide reproducible sizing independent of LOC.

Failures:
- functional size intentionally measures functionality, not availability/recovery/security/authority burden;
- provider leverage may implement high semantic capability with little SB code;
- generated code volume can vary without changing semantic operational obligation;
- operational externalities dominate many enterprise systems.

Disposition: **SPECIALIZE as one possible factual dimension; DO_NOT_BUILD as operational-complexity surrogate**.

### Model C — Observed cost/toil as the truth

Define complexity by SRE/support hours, incidents, cloud spend or tickets.

Advantages:
- grounded in actual operational burden;
- commercially relevant.

Failures:
- rewards poor automation and punishes efficient automation in perverse ways;
- low incident rate may reflect luck/short observation window rather than low risk;
- cost differences may be provider pricing/geography, not architecture;
- new systems have sparse history;
- external teams may absorb toil invisibly.

Disposition: **KEEP as realized-burden evidence, never as sole intrinsic complexity**.

### Model D — Typed operational burden vector + explicit projection/rating policy

Preserve auditable facts in dimensions such as:

```text
OperationalBurdenVector
  semantic/authority boundaries
  dependency/provider boundaries
  consistency/coordination obligations
  topology/failure-domain obligations
  availability/SLO profile
  recovery/RTO/RPO obligations
  evolution/migration/coexistence obligations
  evidence/compliance/privacy obligations
  human intervention/criticality obligations
  autonomy/offline/reconciliation obligations
  observed toil/incidents/recovery effort
  resource/capacity/cost observations
```

Then produce separately versioned projections:

```text
architecture facts
   + measurement profile revision
   -> normalized evidence vector

normalized vector
   + commercial rating policy revision
   -> support/rating class or price input
```

Advantages:
- preserves falsifiable architecture truth;
- allows simple/mature realizations to be compared under the same semantics;
- commercial weights can evolve without rewriting historical architecture;
- correlated factors can be controlled/calibrated rather than blindly summed;
- provider substitution can change realization burden without changing semantic identity;
- can express unknown/inconclusive dimensions.

Costs:
- cannot promise one timeless universal scalar;
- calibration requires population/period/profile evidence;
- commercial product may need simpler tier labels derived from richer facts.

Disposition: **KEEP / GENERALIZE**.

### Model E — Empirically learned scalar predictor

Train a model from historical support hours/cost/incidents using architecture metrics.

Advantages:
- may predict real burden better than hand weights;
- can reveal interactions/nonlinearities.

Failures:
- target variable embeds organizational/provider inefficiency;
- population drift and architecture evolution can invalidate coefficients;
- correlated features and hidden confounders weaken interpretability;
- optimization against a commercial predictor creates gaming pressure;
- model output cannot become canonical semantic truth.

Disposition: **DEFER / SPECIALIZE as advisory calibrated projection** with version, population, uncertainty and out-of-distribution handling.

## Strongest evidence for the recommended model

1. **Quality standards remain multidimensional.** ISO/IEC 25010 explicitly decomposes quality rather than collapsing all properties into one score.
2. **Operations practice distinguishes target, risk and burden.** SLO/error budget, toil, incident response and capacity are different measures with different operational meanings.
3. **Risk engineering distinguishes likelihood and impact.** Complexity is not a substitute for threat/control/impact analysis.
4. **Cost models need multiple drivers.** COCOMO’s use of separate drivers shows why size alone cannot explain effort, while also demonstrating that coefficients are model/calibration artifacts rather than universal semantics.
5. **Empirical metric collinearity is real.** Many cumulative metrics share the same latent size/structure signal; blind addition exaggerates burden.
6. **Architecture outcomes depend on coupling/coordination, not unit count.** DORA’s loose-coupling evidence directly contradicts simplistic service-count scoring.
7. **Commercialization creates a Goodhart surface.** Separating measurement facts from rating weights reduces the incentive/ability to redefine architecture to fit price.

## Strongest evidence against over-generalization

1. A rich burden vector is not evidence that every SB installation needs a scoring engine. A simple system can expose a minimal profile and no commercial rating at all.
2. Factors are context-dependent: an external provider boundary can reduce operator burden while increasing lock-in/failure/evidence obligations. Therefore `provider_count=+N complexity` is unjustified.
3. High availability targets may drive substantial engineering effort, but a mature managed provider can absorb much of that operational work. Semantic requirement and realized effort must remain separate.
4. Observed incident/toil history is valuable but lagging and organization-dependent. It should calibrate predictions rather than redefine requirements.
5. A commercial organization may intentionally price by value, scarcity, support contract or market strategy rather than complexity. That is legitimate **only if pricing is explicitly not presented as architectural measurement**.
6. Not all dimensions are safely comparable across domains. Safety-critical human/physical actuation may require categorical escalation/nonlinear policy rather than additive weight.

## Recommended semantic separation

### 1. Architecture/requirement facts

These are derived from the accepted SystemDefinition/capability/topology/authority/provider/evidence model and must remain independent of pricing.

Examples:

- number/type of independent authority/trust domains;
- required provider/dependency contracts and whether critical/optional;
- declared consistency/coordination invariants;
- failure-domain and placement requirements;
- SLO/RTO/RPO and durability profiles;
- migration/coexistence/revision obligations;
- offline/autonomous closure requirements;
- privacy/compliance/evidence obligations;
- human/physical actuation criticality;
- required provider substitution/brownfield compatibility profiles.

### 2. Observed realization evidence

Examples:

- actual dependency/provider count and churn;
- incidents/error-budget consumption;
- operator toil/support time;
- recovery frequency/duration;
- failed migrations/rollbacks;
- resource utilization and provider spend;
- queue/backpressure/capacity saturation;
- evidence gaps/INCONCLUSIVE rates.

These observations are revision/time/topology/provider qualified. They describe the current realization, not the permanent capability identity.

### 3. Measurement profile

A versioned interpretation that maps heterogeneous facts to normalized dimensions. It must declare:

```text
profile_id/revision
input schema/revisions
units and normalization
missing/INCONCLUSIVE treatment
correlation/dependency handling
population/baseline window
confidence/uncertainty
applicability/non-applicability rules
```

It must not be silently changed to achieve a desired price.

### 4. Commercial rating policy

A separately versioned business function:

```text
CommercialRating
  = f(qualified burden dimensions,
      contract/support profile,
      commercial policy revision)
```

It may produce a support tier, internal cost allocation, quota, price multiplier or manual-review trigger.

The output is **commercial evidence**, not architecture truth.

## Candidate burden dimensions for synthesis

Exact taxonomy is deferred, but the evidence supports testing at least these dimensions rather than one universal scalar:

1. **Semantic/authority surface** — independent owners, trust/decision/mutation boundaries, delegated authority, tenant/Station scopes.
2. **Coordination/consistency burden** — invariants requiring coordination, distributed effects, ambiguity/reconciliation requirements.
3. **Dependency/provider burden** — critical external dependencies, capability compatibility/fallback/substitution obligations, not raw provider count alone.
4. **Topology/failure-domain burden** — placements, replicas, split-brain/fencing, routing and isolation obligations.
5. **Reliability/recovery burden** — SLO/error-budget profile, RTO/RPO, irreversible effects, recovery validation and drills.
6. **Evolution burden** — in-flight coexistence, schema/process/provider migration, rollback eligibility and historical interpreter retention.
7. **Evidence/governance burden** — audit, provenance, privacy disposition, retention, compliance/control qualification.
8. **Human/physical criticality burden** — approvals, regulated/safety-sensitive actions, manual fallback/escalation and blast radius.
9. **Autonomy/offline burden** — local closure, escrow/fencing, delayed revocation and reconnect/reconciliation obligations.
10. **Observed operational burden** — toil, incidents, recovery work, support load and capacity pressure as time-qualified evidence.

These dimensions may be correlated. Synthesis should prefer causal/ownership grouping and explicit dependency relationships before weighting.

## Core invariants

### I1 — Measurement fact is not rating

Architecture and operational facts are recorded before and independently of the commercial function that consumes them.

Changing a price/tier policy must not mutate historical facts or reclassify provider/topology semantics.

### I2 — No universal scalar complexity truth

SB may offer relative indices for declared decision contexts, but every scalar must identify its measurement/rating profile revision. `complexity=73` without a profile/baseline/evidence closure is semantically incomplete.

### I3 — Semantic burden and realized burden remain distinct

Required HA, RTO, audit or offline guarantees remain requirements even if a managed provider realizes them cheaply. Conversely, provider/operator inefficiency may create toil without increasing semantic requirement burden.

### I4 — Size is not operational burden

LOC, functional size, entity count, workflow nodes and generated artifact size may be factual inputs but cannot stand in for recovery, authority, provider, risk, evidence or autonomy obligations.

### I5 — Correlation is not independent burden

A composite model must detect/document materially correlated factors and avoid blind additive double counting. Where factors share an upstream cause, retain the individual evidence but do not assume independent commercial contribution.

### I6 — Unknown is not zero

Missing telemetry, unproven provider semantics, unknown dependency closure or insufficient observation history must produce `UNKNOWN`/`INCONCLUSIVE`/low-confidence dimensions rather than a favorable zero score.

### I7 — Simplification must be rewarded, not punished

If the same semantic requirements can be realized with fewer failure/coordination/operational obligations while preserving proofs, the measurement model must not increase burden merely because implementation becomes simpler or more automated.

### I8 — Provider leverage is allowed to reduce realized burden

Delegating mature mechanics to a provider can legitimately lower toil/operating cost. Providerization must still account for new portability, dependency, outage, migration and evidence obligations; neither “provider = more complex” nor “provider = simpler” is universally true.

### I9 — Risk remains risk-qualified

Security/safety/business impact cannot be replaced by complexity. If rating uses risk, it must consume an explicit risk assessment/profile rather than infer impact from component counts.

### I10 — Pricing is allowed to be strategic, but must say so

Commercial value-based or market-based pricing is legitimate. It must be modeled as commercial policy rather than mislabeled as measured architectural complexity.

### I11 — Historical reproducibility

A historical rating must be reproducible from retained measurement facts, measurement-profile revision and commercial-policy revision, subject to privacy/retention rules. Re-running today’s price policy over old facts is a simulation, not the historical charge truth.

### I12 — Gaming/adversarial analysis is mandatory

Any measure used for commercial decisions must document obvious manipulation paths and counter-evidence. A metric that rewards adding wrappers/services/providers/alerts must fail validation.

## Failure/adversarial analysis

### F1 — Service-count inflation

A client/system is split from one runtime into twenty microservices without changing semantic requirements. Raw service-count scoring rises dramatically.

Required disposition: architecture facts show topology realization changed, but the commercial model must prove why the split increases an independent burden (coordination, failure domains, operator toil, SLO complexity). Raw count alone is insufficient.

### F2 — Provider abstraction wrapper inflation

One external provider gets five internal adapter objects. If adapter count raises rating, the metric is implementation-gameable.

Required disposition: count semantic provider/dependency boundaries and obligations, not code wrappers.

### F3 — Managed provider substitution

A self-hosted HA subsystem is replaced by a managed provider satisfying the same semantic profile. Operational toil falls while external dependency/lock-in/evidence burden changes.

Required disposition: semantic requirement vector remains stable; realized-burden dimensions change with provider/topology revision; rating may change under explicit policy.

### F4 — Low incident history through luck

A new high-impact service has zero incidents for one month. Incident-only complexity becomes zero.

Required disposition: observed history carries low confidence/short window; required reliability/recovery/risk obligations remain independently represented.

### F5 — Correlated counting

One new external payment provider creates one dependency, two failure modes, one reconciliation process, one runbook and some toil. A naïve sum charges five independent increments.

Required disposition: evidence remains visible, but measurement profile must group/depend factors or empirically calibrate contribution rather than assume independence.

### F6 — Commercial reweighting

Price strategy changes so privacy/compliance work receives a 2× commercial multiplier.

Required disposition: commercial rating revision changes; architecture/evidence facts do not.

### F7 — Missing observability

Provider telemetry disappears. Toil/incident counts appear lower.

Required disposition: coverage becomes `INCONCLUSIVE`; missing evidence cannot reduce the burden score as if no incidents existed.

### F8 — Automation success

AI/runbook automation reduces operator minutes by 80% while correctness/recovery obligations remain the same.

Required disposition: realized toil decreases, semantic burden does not. Commercial support policy may recognize either or both explicitly.

### F9 — Safety-critical category

A physically actuating capability has few components and low toil but catastrophic failure impact.

Required disposition: safety/risk profile cannot be averaged away by low size/toil. Policy may require categorical floor/manual underwriting.

### F10 — Deliberate architectural complication for revenue

An internal team adds unnecessary providers/services to justify a higher customer tier.

Required disposition: proof must show additional realization has a semantic/SLO/risk necessity or measurable independent burden; otherwise simplification/conformance review treats it as avoidable complexity rather than billable truth.

## Provider-specific vs portable semantics

### Portable semantics the SB should own

- identity and revision of architecture/requirement facts;
- typed operational-burden dimensions and evidence coverage;
- required vs observed realization distinction;
- measurement-profile identity/revision and applicability;
- uncertainty/INCONCLUSIVE semantics;
- commercial-rating policy identity/revision;
- historical reproducibility lineage;
- correction/supersession of underlying evidence where applicable;
- provider-substitution conformance and realization lineage.

### Providerized mechanics

- observability collection and incident systems;
- cloud/provider cost ingestion;
- SLO/error-budget implementation;
- ticket/time-tracking/toil collection;
- billing/rating engine;
- statistical/ML estimation implementation;
- FinOps allocation provider;
- topology/dependency discovery tools.

Provider output is qualified evidence. A Datadog/Prometheus/Grafana metric, cloud-cost line, billing-provider tier or Jira ticket is not the canonical identity of an SB burden dimension.

## Consequences for existing candidates/findings/hypotheses

### `G2-CAPABILITY-CANDIDATE-RELATIVE-OPERATIONAL-COMPLEXITY-METERING-RATING`

Recommended disposition: **MERGE / GENERALIZE / SPECIALIZE; do not promote under its current conflated name.**

- **GENERALIZE** the architecture side into a cross-cutting **Operational Burden Evidence / Measurement Profile** concern that consumes already-owned architecture, topology, authority, reliability, lifecycle, governance and operations facts.
- **SPECIALIZE** commercial rating as part of the Commercial Metering/Rating/Billing domain established in DR-CURB-01.
- **DO NOT BUILD** a universal top-level `ComplexityMeter` that owns provider/service/code counts or one canonical scalar.
- **DEFER** any learned/empirical complexity predictor until enough SB fleet/support evidence exists to calibrate and validate it.

This disposition preserves the information value behind the candidate while removing the dangerous semantic collapse of “measurement” and “commercial rating”.

### Executable Capability Composition / longitudinal model

A workflow with more stages/nodes is not automatically more operationally complex. Complexity evidence should come from actual semantic obligations (authority, durable waits, distributed effects, recovery, human criticality, etc.), not node count.

### Transaction / Consistency / Concurrency

Non-confluent invariants, ambiguous external effects, compensation and reconciliation are stronger burden signals than transaction count. They remain owned by transaction semantics; the burden profile references them rather than duplicating ownership.

### Topology / Build / Runtime Realization

Simple-to-mature topology transitions can change realized operational burden without changing capability identity. This becomes a central proof that measurement is revision/topology qualified.

### Tenant Fleet / Edge / Station authority

Offline closure, fencing, escrow rights, reconnect reconciliation and delegated administration may add material burden. These are typed obligations already owned by their domains; rating consumes their evidence and cannot mint new authority.

### Provider leverage

Provider leverage is explicitly compatible with the measurement model: mature providers may reduce toil/cost while introducing dependency/portability/evidence obligations. Net effect is empirical/profile-specific, not predetermined.

### Qualified evidence / revision/evolution

Burden measurement and commercial rating must participate in multi-axis revision/evidence semantics. A historical rating requires the exact architecture/topology/provider evidence snapshot, measurement profile and rating policy used then.

### Commercial Metering / Entitlements / Rating / Billing

DR-CURB-01 remains authoritative research input: commercial rating is downstream of qualified measurement facts and separate from entitlement, invoice and payment. Relative operational burden is **not customer usage metering**; it is an input to support/cost/pricing policy when explicitly selected.

## Proof obligations — DR-ROCMR

### DR-ROCMR-01 — Same semantics, topology split

**Claim:** service/process count is not canonical complexity.

Start with one collapsed runtime, split the same semantic capability into multiple services without changing requirements, and compare burden dimensions. A scalar based only on service count must be rejected. Only newly proven independent obligations may alter the normalized burden profile.

### DR-ROCMR-02 — Same semantics, managed-provider substitution

Replace a self-hosted implementation with a conformant managed provider. Semantic requirements remain stable; provider/dependency/evidence/toil/cost observations change. Historical and new burden profiles must name exact realization revisions.

### DR-ROCMR-03 — Wrapper inflation adversarial proof

Add internal adapters/wrappers around one provider without adding semantic boundaries. Measurement must remain unchanged for provider-boundary burden.

### DR-ROCMR-04 — Correlated-factor double-count proof

Construct a case where one external boundary causes provider dependency, failure mode, runbook and toil. Compare naïve additive model with dependency-aware profile. The accepted model must expose correlation/grouping/calibration and must not claim four independent units merely because four observations exist.

### DR-ROCMR-05 — Missing-evidence negative proof

Remove telemetry/ticket/provider-health evidence. Observed burden must become coverage-qualified/`INCONCLUSIVE`; missing data cannot be interpreted as zero incidents/toil.

### DR-ROCMR-06 — Automation reduction proof

Automate repetitive recovery/support tasks while preserving the same semantic/SLO/recovery requirements. Observed toil must fall; semantic burden must remain unchanged.

### DR-ROCMR-07 — Reliability profile proof

Compare otherwise identical systems with materially different SLO/RTO/RPO requirements. Measurement preserves the requirement difference independently from observed incident count and independently from commercial weighting.

### DR-ROCMR-08 — Risk/impact separation proof

A small low-toil physically/safety-critical operation and a larger low-impact batch system must not be ordered purely by size/toil. Risk/safety profile remains a separate qualified input or categorical constraint.

### DR-ROCMR-09 — Functional-size separation proof

Two systems with equal COSMIC/function-size estimate but different provider/recovery/offline/evidence obligations must produce different operational-burden vectors without claiming different functional size.

### DR-ROCMR-10 — Commercial-policy mutation proof

Change commercial weights/tier thresholds while keeping architecture facts fixed. Historical architecture/burden evidence must remain unchanged; only the rating-policy revision/output changes.

### DR-ROCMR-11 — Historical reproducibility proof

Reproduce a prior rating using retained architecture/topology/provider evidence, measurement-profile revision and commercial-policy revision. Re-rating the same facts under the latest policy must be labeled simulation/current policy, not historical truth.

### DR-ROCMR-12 — Goodhart gaming proof

Attempt to increase price/support tier by adding unnecessary services/providers/alerts without changing semantic requirements. Measurement must either remain stable or require evidence of genuine independent operational burden; architectural complication alone cannot guarantee a higher rating.

### DR-ROCMR-13 — Simplification reward proof

Remove a failure/coordination boundary while preserving all required semantic proofs. Normalized realized burden must not increase solely because architecture became simpler.

### DR-ROCMR-14 — Provider opaque-cost proof

A provider supplies one aggregate “complexity/cost score” without underlying evidence. SB may retain it as advisory provider evidence but cannot treat it as canonical burden truth or substitute it for mandatory dimensions.

### DR-ROCMR-15 — Population/calibration drift proof

If an empirical model is used, evaluate it after provider/topology/support-process population changes. Out-of-distribution or degraded calibration must reduce confidence/trigger revalidation rather than silently preserve coefficients.

### DR-ROCMR-16 — Station/offline burden proof

Compare a centrally connected profile with a Station requiring offline authority, bounded rights, fencing and reconnect reconciliation. The added obligations are referenced from Station/transaction evidence; the rating layer does not create or modify those rights.

### DR-ROCMR-17 — Privacy/compliance evidence burden proof

Add a lawful privacy disposition/historical-retention requirement. Measurement can recognize extra evidence/reconciliation obligations, but commercial policy cannot use the score to weaken erasure or compliance obligations.

### DR-ROCMR-18 — Simple-system ergonomics proof

A single-process, single-provider/simple local system with no commercial rating requirement must not need to configure a large scoring model. The system can expose a minimal factual profile and leave rating absent/`N_A`.

### DR-ROCMR-19 — Value-pricing separation proof

Set a commercial price based primarily on customer value/contract strategy rather than operational burden. The system must represent this as commercial policy, not falsify/rewrite architecture measurements to make the price appear complexity-derived.

### DR-ROCMR-20 — Proof-cost non-circularity

Adding tests/evidence solely because the proof method requires them must not mechanically increase a complexity price and create an incentive to omit proofs. Evidence rigor may expose underlying obligations but proof count itself is not a billable complexity unit.

## Falsification paths for material conclusions

The recommendation should be revised if strong evidence demonstrates any of the following:

1. a provider-neutral, cross-domain standard establishes a validated scalar operational-complexity measure with stable causal interpretation across architectures and organizations;
2. independent empirical datasets show one compact factor set predicts operational/support burden robustly across provider/topology/domain changes without material calibration drift or gaming;
3. a scalar can be optimized commercially without systematic architecture/measurement gaming and while retaining explainability/proof obligations;
4. the distinction between semantic burden and observed realization burden proves operationally useless in SB product proofs.

Until then, a multidimensional qualified evidence model is better supported.

## Unresolved questions

1. Which burden dimensions survive Capability Synthesis as canonical reusable evidence versus being projections of existing capability proof metadata?
2. Is a dedicated `OperationalBurdenProfile` semantic artifact needed, or can it be a derived query over the capability/topology/evidence graph?
3. How should correlation/dependency between dimensions be represented without introducing a heavyweight causal model?
4. Which dimensions are ordinal/categorical versus ratio-scale quantities?
5. What reference populations are legitimate for relative comparison: same capability family, same SLA class, same tenant size, same topology profile, or fleet-wide?
6. When should uncertainty force manual commercial underwriting instead of automatic rating?
7. How should support contracts distinguish fixed support commitments from realized toil/cost variance?
8. Can open standards such as FOCUS contribute cost-allocation evidence without becoming architecture semantics?
9. Which historical facts are privacy-retainable for long-term commercial reproducibility?
10. How should AI-generated architecture proposals be prevented from optimizing toward a desired commercial score?

## Confidence

**High** confidence in these negative/structural conclusions:

- LOC/service/provider count cannot be universal operational-complexity truth;
- architecture/operational facts must remain separate from commercial rating policy;
- semantic burden and observed realized burden must be distinguishable;
- missing evidence must not become zero burden;
- correlated metrics make blind additive scoring unsafe;
- provider leverage can raise some burden dimensions while lowering others;
- commercial optimization introduces a material Goodhart/gaming surface.

**Moderate** confidence in the proposed burden-dimension taxonomy. The exact dimensions, normalization and whether a first-class profile artifact is needed should remain for Capability Synthesis and later product-proof calibration.

**Low** confidence that any single stable scalar should be promoted to universal architecture. Current evidence argues against doing so.

## Proposed dispositions

| Subject | Research disposition | Rationale |
|---|---|---|
| `G2-CAPABILITY-CANDIDATE-RELATIVE-OPERATIONAL-COMPLEXITY-METERING-RATING` as one top-level capability | **MERGE / GENERALIZE / SPECIALIZE** | Preserve information need, split architecture measurement from commercial rating. |
| Universal scalar `ComplexityScore` | **DO_NOT_BUILD** | Unsupported units, correlation, gaming and context dependence. |
| Typed operational burden/evidence dimensions | **GENERALIZE / KEEP** | Cross-cutting reusable projection over existing architecture/operations evidence. |
| Measurement profile revision/uncertainty | **KEEP candidate** | Required for reproducibility and contextual interpretation. |
| Commercial weighting/tier/price | **SPECIALIZE under commercial rating** | Business policy, not architecture truth. |
| LOC/function points/code complexity | **SPECIALIZE as factual estimation inputs** | Useful in some contexts; not sufficient for operations. |
| Observed toil/incidents/cost | **KEEP as realization evidence** | Important calibrated evidence; not intrinsic semantics. |
| Learned predictor | **DEFER / PROVIDERIZE** | Requires SB fleet data, calibration, drift/uncertainty proof. |
| SLO/risk/compliance/authority facts | **KEEP with original owners** | Rating references evidence; does not duplicate semantic ownership. |
| Commercial price as architecture classifier | **DO_NOT_BUILD** | Violates separation and creates Goodhart incentives. |

## Synthesis recommendation

Capability Synthesis should **not promote the current candidate under the conflated name `RELATIVE-OPERATIONAL-COMPLEXITY-METERING-RATING`**.

Instead, synthesizers should test this formation:

```text
Architecture / requirement / realization evidence
              ↓
      typed burden dimensions
              ↓
   measurement profile revision
              ↓
 normalized relative burden evidence
              ↓
       ┌───────────────┐
       │               │
 support/capacity      commercial rating policy revision
 engineering input               ↓
                         tier / price / allocation
```

The left side remains architecture/operations evidence. The right side is commercial policy. The boundary is intentional and must be auditable.

This preserves the original business insight — systems with materially different operational obligations should not be treated as operationally equivalent — while preventing pricing from becoming a feedback loop that corrupts architectural truth.

## Recommended next deep question

**Evidence-derived burden profile vs existing proof graph: duplicate primitive or reusable projection?**

The next highest-value uncertainty is whether a typed `OperationalBurdenProfile` should become a first-class revisioned artifact, or whether it should be calculated as a reproducible projection over existing proof obligations, topology/provider/authority/recovery evidence and observed operations. Deep research should compare architectural observability/query models, policy-as-code/decision evidence and cost/risk models to avoid creating another source of truth that duplicates the capability/evidence graph.