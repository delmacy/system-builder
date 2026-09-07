# Generation 2 — WBS Dependency Graph

Status: `WBS_DEPENDENCY_GRAPH / CLOSED / PASS`

Authority: `RESEARCH_PIPELINE_STATE.json` with `WBS_DECOMPOSITION` already `CLOSED / PASS` and 26 non-executive planning nodes. This artifact adds dependency edges and planning-order constraints only. It does **not** authorize Work Packages, executive TASKs, Construction, product code, executable tests, or implementation sequencing.

## 1. Graph constitution

The graph preserves the 26 decomposition nodes from `GENERATION_2_WBS_DECOMPOSITION.md` and uses only the dependency kinds already authorized by Planning D:

- `SEMANTIC_PREREQUISITE`
- `AUTHORITY_PREREQUISITE`
- `REVISION_PREREQUISITE`
- `EVIDENCE_PREREQUISITE`
- `PROVIDER_PREREQUISITE`
- `DATA_PREREQUISITE`
- `OPERABILITY_PREREQUISITE`
- `TRUST_PREREQUISITE`
- `LOCALITY_PREREQUISITE`

An edge `A -> B [KIND]` means only that B cannot be considered planning-complete for the relevant concern until the contract/evidence/constraint owned by A is available. It does not mean A must be fully implemented before any work on B begins.

The graph is a typed planning DAG. Cross-cutting nodes may constrain many domain nodes without becoming semantic owners. No edge transfers canonical ownership, authority, evidence ownership, or provider truth.

## 2. Invariants applied to every edge

1. The 28 canonical capability ownership boundaries remain unchanged; WBS decomposition does not create a 29th capability.
2. `G2-WBS-02` Elicitation Knowledge Base remains cross-cutting authoring/knowledge infrastructure.
3. `G2-WBS-11` capacity, `G2-WBS-22` mathematical/analytical semantics, `G2-WBS-24` Product Proof and `G2-WBS-25` Production Readiness are cross-cutting planes, not substitute domain owners.
4. `PARTIAL/UNKNOWN` is preserved across boundaries; when effect ambiguity makes replay unsafe, `UNKNOWN -> reconcile-before-retry` remains mandatory.
5. Source-of-truth movement requires coexistence, fencing, residual-cohort visibility and finite drainage; an edge never licenses latest-wins.
6. Provider support/feature-name/API parity never implies semantic equivalence or authority.
7. Physical/Peripheral remains bounded to integration/governance; no edge introduces generic direct physical actuation authority.
8. `Research != remediation`, `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`.
9. Causality remains research-only; analytical edges cannot promote correlation into causal authority.
10. Product Proof design remains distinct from executed proof; Production Readiness Coverage remains separate from feature completeness.

## 3. Dependency layers

The partial order is organized into planning layers. Nodes in the same layer may be elaborated concurrently where their typed prerequisites are already stable.

### Layer L0 — constitutional semantic base

- `G2-WBS-01` Semantic substrate, revision and graph constitution

No later planning node may redefine canonical identity, revision/currentness, provenance, inter-system/federated graph semantics, or local/Station/Fleet truth boundaries contrary to WBS-01.

### Layer L1 — discovery, authority/trust and analytical primitives

- `G2-WBS-02` Elicitation Knowledge Base and adaptive understanding
- `G2-WBS-03` Identity, authentication, federation and authorization
- `G2-WBS-04` Trust, PKI, secrets, configuration, security and recovery
- `G2-WBS-22` Mathematical, rule, analytical, temporal, vector and uncertainty substrate

WBS-03 and WBS-04 form a bounded mutual design concern but not a cycle: authority semantics originate in WBS-03; cryptographic/trust/config/recovery realization originates in WBS-04. Planning closure therefore requires the explicit directional edges below rather than an ownership merge.

### Layer L2 — domain state and provider foundations

- `G2-WBS-05` Data, schema, migration and canonical persistence semantics
- `G2-WBS-09` Provider, binding, standards and interoperability
- `G2-WBS-23` Legacy Mirroring / Brownfield assimilation

### Layer L3 — execution, storage and finite-flow semantics

- `G2-WBS-06` Workflow, durable execution and external-effect semantics
- `G2-WBS-08` Storage, documents and media
- `G2-WBS-11` Queueing, capacity, backpressure and finite convergence

WBS-11 is modeled as a cross-cutting constraint plane. Queue-producing nodes may be designed concurrently, but none may claim operability/readiness closure until its WBS-11 assumptions and finite-drainability obligations are linked.

### Layer L4 — integration, build and site/fleet realization

- `G2-WBS-07` Messaging, events, notifications and integration automation
- `G2-WBS-10` Bounded Physical / Peripheral integration and site/fleet operations
- `G2-WBS-12` Build, dependency graph and reproducibility

### Layer L5 — immutable supply-chain adoption

- `G2-WBS-13` Artifact, release, SBOM, provenance and lifecycle

### Layer L6 — runtime realization and generated/AI experience

- `G2-WBS-14` Deployment, runtime topology and autonomous lifecycle
- `G2-WBS-15` UI, low-code and generated experience
- `G2-WBS-16` AGWS / AI-mediated generation and assistance

### Layer L7 — operations and governance surfaces

- `G2-WBS-17` Observability, incident and reconciliation operations
- `G2-WBS-18` Developer, operator and self-hosting surfaces
- `G2-WBS-19` Governance, compliance, audit and privacy/data governance

### Layer L8 — economic/commercial derivations

- `G2-WBS-20` Commercial, monetization and entitlements
- `G2-WBS-21` Technology Economic Governance / FinOps

### Layer L9 — proof/readiness planes

- `G2-WBS-24` Product Proof architecture and traceability
- `G2-WBS-25` Production Readiness Coverage

These two nodes consume evidence and obligations from the graph but do not become the semantic owners of the claims they prove.

### Layer L10 — final cross-capability reconciliation

- `G2-WBS-26` Architecture Reconciliation capability realization

WBS-26 is a sink for planning reconciliation. It can route conflicts/gaps back to owners, but it cannot silently remediate or strengthen claims.

## 4. Direct typed dependency edges

The following are the canonical direct edges. Transitive dependencies are intentionally not duplicated.

### 4.1 Semantic, elicitation, authority and trust base

- `01 -> 02 [SEMANTIC_PREREQUISITE, REVISION_PREREQUISITE, EVIDENCE_PREREQUISITE]`
- `01 -> 03 [SEMANTIC_PREREQUISITE, REVISION_PREREQUISITE, LOCALITY_PREREQUISITE]`
- `02 -> 03 [EVIDENCE_PREREQUISITE, AUTHORITY_PREREQUISITE]` for unresolved critical authority questions and stakeholder/source coverage.
- `01 -> 04 [SEMANTIC_PREREQUISITE, REVISION_PREREQUISITE]`
- `03 -> 04 [AUTHORITY_PREREQUISITE]` for who may create/rotate/revoke/use trust and secret/config material.
- `04 -> 03 [TRUST_PREREQUISITE]` only for realization of authentication/federation/session trust; this does not make WBS-04 owner of authorization semantics. To keep the planning graph acyclic, this is treated as a **qualification edge**, not a closure-precedence edge: WBS-03 authority contract must stabilize before WBS-04 closes; WBS-03 realization cannot claim readiness until the referenced WBS-04 trust contract is qualified.
- `01 -> 22 [SEMANTIC_PREREQUISITE, REVISION_PREREQUISITE]`
- `02 -> 22 [EVIDENCE_PREREQUISITE]` for formula/rule/model purpose, inputs, units, uncertainty and unresolved semantics.

### 4.2 Data, providers and Brownfield

- `01 -> 05 [SEMANTIC_PREREQUISITE, REVISION_PREREQUISITE, DATA_PREREQUISITE]`
- `02 -> 05 [EVIDENCE_PREREQUISITE]`
- `03 -> 05 [AUTHORITY_PREREQUISITE]`
- `04 -> 05 [TRUST_PREREQUISITE]` where protected/encrypted/recovery-qualified state exists.
- `22 -> 05 [SEMANTIC_PREREQUISITE]` for units/precision/vector/uncertainty-bearing data.
- `01 -> 09 [SEMANTIC_PREREQUISITE, REVISION_PREREQUISITE]`
- `02 -> 09 [EVIDENCE_PREREQUISITE]`
- `03 -> 09 [AUTHORITY_PREREQUISITE]`
- `04 -> 09 [TRUST_PREREQUISITE]`
- `01 -> 23 [SEMANTIC_PREREQUISITE, EVIDENCE_PREREQUISITE]`
- `02 -> 23 [EVIDENCE_PREREQUISITE]`
- `05 -> 23 [DATA_PREREQUISITE]` for structured legacy data/schema assimilation.
- `09 -> 23 [PROVIDER_PREREQUISITE]` where discovery is mediated by external systems/providers.

### 4.3 Workflow, storage and finite-flow plane

- `01 -> 06 [SEMANTIC_PREREQUISITE, REVISION_PREREQUISITE]`
- `03 -> 06 [AUTHORITY_PREREQUISITE]`
- `04 -> 06 [TRUST_PREREQUISITE]`
- `05 -> 06 [DATA_PREREQUISITE]`
- `22 -> 06 [SEMANTIC_PREREQUISITE]` for rule/expression/temporal/vector semantics used by execution.
- `01 -> 08 [SEMANTIC_PREREQUISITE, REVISION_PREREQUISITE]`
- `04 -> 08 [TRUST_PREREQUISITE]`
- `05 -> 08 [DATA_PREREQUISITE]` for metadata/schema/source-of-truth boundaries.
- `09 -> 08 [PROVIDER_PREREQUISITE]`
- `01 -> 11 [SEMANTIC_PREREQUISITE, REVISION_PREREQUISITE]`
- `22 -> 11 [SEMANTIC_PREREQUISITE]` for units/time/distribution assumptions.
- `05 -> 11 [DATA_PREREQUISITE]` where queue state/checkpoints/replay ledgers require persistence.

### 4.4 Messaging, Physical/Peripheral and build

- `06 -> 07 [SEMANTIC_PREREQUISITE, EVIDENCE_PREREQUISITE]` for effect identity and reconciliation.
- `09 -> 07 [PROVIDER_PREREQUISITE]`
- `11 -> 07 [OPERABILITY_PREREQUISITE]`
- `03 -> 10 [AUTHORITY_PREREQUISITE]`
- `04 -> 10 [TRUST_PREREQUISITE]`
- `09 -> 10 [PROVIDER_PREREQUISITE, LOCALITY_PREREQUISITE]`
- `11 -> 10 [OPERABILITY_PREREQUISITE]`
- `06 -> 10 [EVIDENCE_PREREQUISITE]` for physical-effect reconciliation without generic actuation ownership.
- `01 -> 12 [SEMANTIC_PREREQUISITE, REVISION_PREREQUISITE, EVIDENCE_PREREQUISITE]`
- `04 -> 12 [TRUST_PREREQUISITE]`
- `09 -> 12 [PROVIDER_PREREQUISITE]`
- `11 -> 12 [OPERABILITY_PREREQUISITE]`

### 4.5 Artifact, deployment, experience and AI

- `12 -> 13 [SEMANTIC_PREREQUISITE, REVISION_PREREQUISITE, EVIDENCE_PREREQUISITE]`
- `04 -> 13 [TRUST_PREREQUISITE]`
- `09 -> 13 [PROVIDER_PREREQUISITE]`
- `11 -> 13 [OPERABILITY_PREREQUISITE]`
- `13 -> 14 [REVISION_PREREQUISITE, EVIDENCE_PREREQUISITE]`
- `04 -> 14 [TRUST_PREREQUISITE]`
- `09 -> 14 [PROVIDER_PREREQUISITE, LOCALITY_PREREQUISITE]`
- `11 -> 14 [OPERABILITY_PREREQUISITE]`
- `05 -> 14 [DATA_PREREQUISITE]` for schema/data migration compatibility and source-of-truth cuts.
- `01 -> 15 [SEMANTIC_PREREQUISITE, REVISION_PREREQUISITE]`
- `02 -> 15 [EVIDENCE_PREREQUISITE]`
- `03 -> 15 [AUTHORITY_PREREQUISITE]`
- `05 -> 15 [DATA_PREREQUISITE]`
- `06 -> 15 [SEMANTIC_PREREQUISITE]` for governed actions/workflow state.
- `08 -> 15 [DATA_PREREQUISITE]` for document/media surfaces.
- `02 -> 16 [EVIDENCE_PREREQUISITE]`
- `03 -> 16 [AUTHORITY_PREREQUISITE]`
- `04 -> 16 [TRUST_PREREQUISITE]`
- `09 -> 16 [PROVIDER_PREREQUISITE]`
- `11 -> 16 [OPERABILITY_PREREQUISITE]`
- `22 -> 16 [SEMANTIC_PREREQUISITE]` where AI proposes formula/rule/analytical structures.

### 4.6 Operations, governance, commercial and FinOps

- `01 -> 17 [SEMANTIC_PREREQUISITE, REVISION_PREREQUISITE, EVIDENCE_PREREQUISITE]`
- `06 -> 17 [EVIDENCE_PREREQUISITE]`
- `07 -> 17 [EVIDENCE_PREREQUISITE]`
- `10 -> 17 [LOCALITY_PREREQUISITE, EVIDENCE_PREREQUISITE]`
- `11 -> 17 [OPERABILITY_PREREQUISITE]`
- `14 -> 17 [EVIDENCE_PREREQUISITE, LOCALITY_PREREQUISITE]`
- `14 -> 18 [LOCALITY_PREREQUISITE, OPERABILITY_PREREQUISITE]`
- `17 -> 18 [EVIDENCE_PREREQUISITE, OPERABILITY_PREREQUISITE]`
- `03 -> 18 [AUTHORITY_PREREQUISITE]`
- `04 -> 18 [TRUST_PREREQUISITE]`
- `01 -> 19 [SEMANTIC_PREREQUISITE, REVISION_PREREQUISITE, EVIDENCE_PREREQUISITE]`
- `03 -> 19 [AUTHORITY_PREREQUISITE]`
- `08 -> 19 [DATA_PREREQUISITE]`
- `09 -> 19 [PROVIDER_PREREQUISITE]`
- `17 -> 19 [EVIDENCE_PREREQUISITE]`
- `22 -> 19 [SEMANTIC_PREREQUISITE]` for policy/risk/retention calculations without scalar-quality collapse.
- `01 -> 20 [SEMANTIC_PREREQUISITE, REVISION_PREREQUISITE]`
- `03 -> 20 [AUTHORITY_PREREQUISITE]`
- `09 -> 20 [PROVIDER_PREREQUISITE]`
- `11 -> 20 [OPERABILITY_PREREQUISITE]`
- `19 -> 20 [AUTHORITY_PREREQUISITE, EVIDENCE_PREREQUISITE]`
- `22 -> 20 [SEMANTIC_PREREQUISITE]` for units/time/rating formulas.
- `01 -> 21 [SEMANTIC_PREREQUISITE, REVISION_PREREQUISITE]`
- `09 -> 21 [PROVIDER_PREREQUISITE, EVIDENCE_PREREQUISITE]`
- `11 -> 21 [OPERABILITY_PREREQUISITE]`
- `19 -> 21 [EVIDENCE_PREREQUISITE]`
- `20 -> 21 [DATA_PREREQUISITE, EVIDENCE_PREREQUISITE]`
- `22 -> 21 [SEMANTIC_PREREQUISITE]` for currency/rates/allocation/unit-economics calculations.

### 4.7 Cross-cutting proof and readiness closure

- `02 -> 24 [EVIDENCE_PREREQUISITE]`
- `01 -> 24 [SEMANTIC_PREREQUISITE, REVISION_PREREQUISITE, EVIDENCE_PREREQUISITE]`
- `03..23 -> 24 [EVIDENCE_PREREQUISITE]` as producer-owned proof routes; this range notation means each relevant semantic owner contributes scoped evidence without transferring ownership.
- `17 -> 25 [OPERABILITY_PREREQUISITE, EVIDENCE_PREREQUISITE]`
- `18 -> 25 [OPERABILITY_PREREQUISITE, EVIDENCE_PREREQUISITE]`
- `03..23 -> 25 [OPERABILITY_PREREQUISITE]` only for production-bearing populations; `NOT_APPLICABLE` requires explicit rationale/evidence.
- `24 -> 26 [EVIDENCE_PREREQUISITE]`
- `25 -> 26 [OPERABILITY_PREREQUISITE, EVIDENCE_PREREQUISITE]`
- `01..23 -> 26 [SEMANTIC_PREREQUISITE, REVISION_PREREQUISITE, EVIDENCE_PREREQUISITE]` as reconciliation inputs, not as ownership transfer.

## 5. Order constraints and allowed concurrency

### Hard planning-precedence constraints

The following must hold before downstream planning can be declared closed:

1. WBS-01 semantic/revision/locality constitution precedes closure of every node that creates canonical identity, revision, evidence or locality claims.
2. WBS-03 authority semantics precede closure of authority-bearing realizations; WBS-04 trust realization qualifies but does not redefine authorization.
3. WBS-05 data/source-of-truth semantics precede closure of durable workflow, migration-sensitive deployment and data-bearing governance/commercial claims.
4. WBS-06 external-effect semantics precede closure of messaging/integration effects and any Physical/Peripheral effect-reconciliation claim.
5. WBS-09 provider qualification precedes closure of any provider-bound realization or substitution claim.
6. WBS-12 precedes WBS-13; WBS-13 precedes WBS-14 for supply-path identity/revision/evidence.
7. WBS-24 and WBS-25 consume owner-produced evidence and readiness obligations; they cannot be used to waive owner gaps.
8. WBS-26 closes only after all material owner gaps/conflicts have an explicit disposition route; it may return work to owners but may not silently remediate.

### Conditional closure constraints

- WBS-11 is required before closure of any node that asserts queue/backlog/retry/replay/residual-drain/capacity behavior.
- WBS-22 is required before closure of any node using units, formulas, rounding, windows, vectors, uncertainty or analytical derivations.
- WBS-23 is required where Brownfield/Legacy evidence is part of the system-understanding or migration path; it is not a universal prerequisite for purely Greenfield scope.
- WBS-10 is required only for bounded Physical/Peripheral or Station/Fleet integration scope and remains non-authoritative for generic physical actuation.
- WBS-19 is required where privacy/compliance/governance constraints bind storage, commercial, provider, analytics or operational populations.

### Safe planning concurrency bands

Subject to the hard/conditional constraints above, the graph permits concurrent planning in these bands:

- after WBS-01: WBS-02, WBS-03, WBS-22, and the authority-definition portion of WBS-04;
- after authority/trust contracts stabilize: WBS-05 and WBS-09 can advance in parallel;
- WBS-06, WBS-08 and WBS-11 can advance concurrently once their direct semantic/data/provider prerequisites are stable;
- WBS-07, WBS-10 and WBS-12 may advance concurrently because they consume different owner contracts;
- WBS-15 and WBS-16 may advance while the supply path WBS-12→13→14 advances, provided they consume only stable semantic contracts and do not assume deployment realization;
- WBS-17, WBS-19, WBS-20 and WBS-21 may be progressively elaborated as evidence contracts become stable, but cannot claim closure ahead of their direct dependencies;
- WBS-24 and WBS-25 can define registries/frameworks early, but acceptance/readiness closure remains downstream of owner evidence.

## 6. Critical planning paths

The graph has several critical paths rather than one scalar sequence:

- **Semantic execution path:** `01 -> 05 -> 06 -> 07 -> 17 -> 24/25 -> 26`.
- **Authority/trust path:** `01 -> 03 -> 04 -> 09/14/18/19 -> 24/25 -> 26`.
- **Autonomous supply path:** `01 -> 12 -> 13 -> 14 -> 17/18 -> 25 -> 26`.
- **Provider/site path:** `01 -> 09 -> 10 -> 17 -> 25 -> 26`.
- **Elicitation/Brownfield path:** `01 -> 02 -> 23 -> domain owners -> 24 -> 26`.
- **Analytical/economic path:** `01 -> 22 -> 20/21 -> 24/25 -> 26`.
- **Governance/privacy path:** `01 -> 08/09/17 -> 19 -> 20/21 -> 24/25 -> 26`.

No path is allowed to hide HIGH/CRITICAL unresolved elicitation gaps, unresolved contradictions, stale evidence, `UNKNOWN` effects, residual cohorts, provider qualification gaps or failed readiness dimensions behind aggregate progress.

## 7. Cycle and authority-amplification checks

The typed graph is planning-acyclic after classifying realization feedback as qualification rather than reverse ownership. The important apparent cycles are intentionally broken as follows:

- **Identity ↔ trust:** WBS-03 owns authority/authentication semantics; WBS-04 realizes trust/credential prerequisites. Trust evidence can qualify identity realization but cannot rewrite authorization semantics.
- **Provider ↔ domain:** WBS-09 owns provider qualification/binding mechanics; domain nodes own domain semantics. Provider observations return evidence, not canonical truth.
- **Observability ↔ operations:** WBS-17 observes and reconciles; owner nodes remain source of canonical operational meaning. `Signal != ConfirmedConflict`.
- **Proof ↔ owner:** WBS-24 judges scoped proof obligations; it cannot make an unsupported owner claim true.
- **Readiness ↔ owner:** WBS-25 records multidimensional readiness; it cannot convert feature completeness into production readiness.
- **Reconciliation ↔ owner:** WBS-26 routes inconsistency to owners; it cannot become a god-object or silent remediation plane.

## 8. Elicitation/System Understanding routing in the graph

WBS-02 supplies question definitions/occurrences, epistemic state, adaptive follow-ups, evidence/currentness and coverage gaps to every capability-specific lens. Routing rules are:

- universal questions attach to their semantic owner rather than being copied into multiple owner domains;
- cross-capability answers create semantic references to all affected nodes while retaining one owner for each predicate;
- critical unanswered questions create blocking evidence edges to the affected WBS nodes;
- `Fact`, `Claim`, `Assumption`, `InferredCandidate`, `Decision`, `Requirement`, `Constraint`, `OpenQuestion`, `Conflict`, `Unknown`, `OutOfScope`, `Deferred` remain distinct through derivation;
- User Stories remain intent/value/context; Use Cases carry actor/trigger/preconditions/flows/effects/postconditions; Scenarios include failure/boundary/abuse/recovery/offline/concurrency/version-change; none is complete specification in isolation;
- traceability follows `Source/Elicitation Evidence -> Answer/Finding -> Requirement/Constraint -> User Story/Use Case/Scenario -> Semantic Model -> Capability/Workflow/Data/etc. -> Acceptance Criterion -> Product Proof -> Runtime Evidence`;
- AI suggestions/inferences remain candidates and cannot satisfy a blocking edge without governed evidence/disposition.

## 9. Operability and readiness routing

Every production-bearing node has a conditional `OPERABILITY_PREREQUISITE` toward WBS-25 through WBS-11/17/18 as appropriate. Closure evidence must keep separate dimensions for observability, ownership, failure handling, recovery, capacity, currentness, security, reconciliation, change safety, cost and documentation.

Queue/capacity evidence must include declared populations, units, expected/peak load, arrival/service assumptions, queue depth **and age**, latency, timeout/UNKNOWN behavior, retry/idempotency, dependency/provider quotas, capacity headroom, residual cohort drain, recovery/reconciliation and post-change validation. A low average utilization or green aggregate cannot prove finite convergence.

## 10. Planning closure test

`WBS_DEPENDENCY_GRAPH` is `PASS` only if all of the following hold:

- all 26 decomposition nodes are represented;
- dependency kinds are restricted to the nine authorized kinds;
- direct prerequisite edges and critical order constraints are explicit;
- the graph distinguishes closure precedence from safe concurrent elaboration;
- no edge changes the 28 canonical capability ownership model;
- EKB remains cross-cutting, adaptive, auditable and non-authoritative for AI inference;
- `PARTIAL/UNKNOWN`, reconciliation-before-retry and residual-cohort drainage remain visible;
- provider qualification, Physical/Peripheral bounded scope, Station/Fleet currentness and finite capacity/drainability are preserved;
- Product Proof and Production Readiness remain separate and downstream-qualified;
- Architecture Reconciliation remains a non-remediating sink/router;
- no Work Package, TASK, Construction or implementation authorization is created.

Disposition: **PASS**. The graph is sufficiently explicit to authorize the next planning phase, `WORK_PACKAGE_DESIGN`, in a later, separate action only. This artifact itself does not execute or materialize that phase.
