# G4 Research State — System Builder Product R&D

Date: 2026-09-18
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE

## Purpose

Generation 4 is the product R&D layer that follows G3 architectural closure. G3 defines the implementation-independent semantic/operational substrate; G4 studies how the System Builder product should realize that substrate with usable interaction, measurable performance, robust data/infrastructure engineering, controlled lifecycle management and bounded self-management.

G4 does not reopen G3 and does not authorize implementation, WBS, Work Packages, Sprints, TASKs, migrations or provider adoption.

## Current research families

1. Product UX, Living Canvas & AI-native Builder interaction.
2. Computational Core & Performance Engineering.
3. Data, Persistence, Access & Infrastructure Access Engineering.
4. Data Treatment Engineering.
5. Infrastructure Engineering & Control Plane R&D.
6. Engineering Lifecycle, Product Change & Continuous Improvement.
7. Self-Hosting, Autonomic Control & Bounded Self-Evolution.

These families may later be deduplicated or recomposed. A research family is not automatically a product module.

## Cross-cutting rules

- `G3 semantic decision != G4 technology binding`.
- `Research candidate != implementation authority`.
- `Polyglot-ready != Polyglot-from-day-one`.
- `Measured bottleneck -> qualified specialization candidate`.
- `Technology preference -> no migration authority`.
- `Builder != Runtime`; published client runtimes remain autonomous.
- `Projection/index/cache/vector/telemetry != canonical truth`.
- `Provider ACK != effective state`.
- `AI inference != authority`.
- self-management must remain governed, reversible and externally recoverable.
- every durable technology binding requires an exit/migration path compatible with anti-lock-in goals.

## Research progression

```text
G3 CLOSED/FROZEN
      |
      v
G4 research inventory
      |
      v
workload / user / operational evidence
      |
      v
benchmarks + prototypes + failure cases
      |
      v
implementation-independent product architecture
      |
      v
provider/technology comparison
      |
      v
explicit planning authorization
      |
      v
WBS / Work Packages / implementation
```

## Current maturity

- Data/Persistence/Access: substantial backlog captured; deep evidence consolidation still required.
- Data Treatment: **deep evidence consolidation now covers temporal/streaming/replay plus temporal identity and interpretation revision**: multidimensional time, watermark non-finality, scoped processing guarantees, correction/retraction, replay context, live/backfill convergence, CDC/outbox boundaries, ordering scope, merge/split identity lineage, and pinned-vs-current replay interpretation. Other treatment vectors still require deep consolidation; family remains `RESEARCH_ACTIVE`, not saturated.
- Infrastructure Engineering: consolidated research backlog captured; operational protocols/evidence still shallow.
- Computational Core/Performance: consolidated initial architecture and qualification rules captured; workload benchmarks not yet materialized.
- Lifecycle/Continuous Improvement: **first deep evidence consolidation completed** for incident/postmortem/action separation, work hierarchy vs semantic graph, multidimensional closure, outcome/effectiveness measurement and lesson lineage. Still `RESEARCH_ACTIVE`, not saturated.
- Self-Hosting/Autonomic Evolution: **first deep evidence consolidation completed** for secure update trust, generation consistency, version skew, anti-rollback vs recovery, state/schema rollback, promotion evidence, reboot identity and failed-update-loop containment. Still `RESEARCH_ACTIVE`, not saturated.
- Product UX/AI-native Builder: initial product R&D program captured; deeper usability research remains open.

## Material research log

### 2026-09-18 — Temporal identity, merge/split lineage and replay interpretation

Evidence classes: provenance standard, mature cross-record identity-link semantics and snapshot/schema time-travel behavior (W3C PROV, HL7 FHIR, Apache Iceberg).

Material delta:

- separated stable source-record identity from asserted subject identity, identity-resolution assertions/revisions and current canonical subject projection;
- established that merge/canonicalization must preserve predecessor identities and evidence rather than destructively rewriting historical records;
- treated split/unmerge as a new resolution revision with downstream impact/reconciliation obligations, not pointer reversal;
- required historical decisions/effects to retain the identity-resolution revision on which they relied when material;
- strengthened dedup boundaries so same-subject resolution cannot by itself prove duplicate event/fact identity;
- separated historical source snapshot from historical interpretation snapshot;
- introduced candidate `InterpretationContext` spanning schema, contract, reference/master data, identity resolution, rule/policy and transformation revisions;
- distinguished `FORENSIC_REPRODUCTION`, `CURRENT_REINTERPRETATION` and explicit controlled mixed-revision replay intents;
- required degraded/inconclusive reproducibility when a historically required interpretation dependency is unavailable instead of silently substituting current state;
- required derived generations to preserve source range plus interpretation/treatment lineage.

No provenance store, MDM system, FHIR model, Iceberg/lakehouse or temporal database was selected as canonical.

Next highest-value gap in this family: deletion/retention interaction with replay, identity lineage and historical reconstruction, especially the conflict between reproducibility evidence and privacy/deletion obligations. Cross-family priority may supersede this based on comparative maturity.

### 2026-09-18 — Temporal, streaming and replay semantics

Evidence classes: mature stream-processing models, messaging transaction semantics, CDC/outbox practice and relational transaction/time semantics (Apache Beam, Apache Flink, Apache Kafka, Debezium, PostgreSQL).

Material delta:

- separated occurrence/event time, business-valid time, observation, recording, ingestion, processing and publication time instead of relying on one generic timestamp;
- established that watermark/window completion is a progress/completeness estimate and cannot become absolute source completeness;
- introduced candidate temporal-materialization evidence so early/on-time/late/corrected results retain publication policy and completeness qualification;
- made correction/retraction/supersession first-class rather than silently overwriting prior temporal evidence;
- replaced generic `exactly once` claims with a scoped processing-guarantee envelope covering source replayability, processor state, checkpoint, sink behavior and external effects;
- introduced explicit replay context because replay under changed code/schema/reference data is not equivalent to original execution;
- required live/backfill overlap to have an explicit convergence contract and proof;
- preserved CDC/outbox publication as distinct from canonical business truth and downstream effective state;
- made ordering guarantees explicitly scoped and rejected timestamp comparison as causal proof;
- required historical/as-of queries to declare temporal perspective rather than returning an unlabeled snapshot.

No stream processor, broker, CDC platform or temporal database was selected as canonical.

### 2026-09-18 — Lifecycle learning and improvement-effectiveness semantics

Evidence classes: mature SRE incident-learning practice, empirical software-delivery research and modern issue/work hierarchy documentation (Google SRE, DORA, GitHub Issues).

Material delta:

- separated incident occurrence, postmortem/review evidence, findings, action candidates and authorized work items;
- established that parent/sub-issue hierarchy is a planning/decomposition view and cannot replace typed N:N lifecycle/causal relationships;
- introduced multidimensional closure: work completion, resolution, effectiveness and learning may disagree;
- strengthened continuous improvement so `change deployed != improvement achieved`;
- introduced candidate `ImprovementEffectEvidence` with hypothesis, metric definition, population/scope, baseline/observation windows, confounders, measurements, uncertainty and conclusion;
- required `INCONCLUSIVE` as a legitimate effectiveness result rather than forced success/failure;
- added lesson lineage and supersession so a learned rule remains tied to evidence and can be revised;
- added proof obligations for hierarchy projection, review authority separation, effectiveness evidence and AI non-authority.

No issue tracker, ITSM framework, metric suite or workflow product was selected as canonical.

Next highest-value gap in this family: primitive-vs-view work-item taxonomy and causal reasoning boundaries. Cross-family priority may supersede this based on comparative maturity.

### 2026-09-17 — Self-hosting secure-update protocol foundations

Evidence classes: primary security/update specifications plus mature control-plane/host documentation (TUF, Uptane, Kubernetes, systemd).

Material delta:

- separated artifact authenticity from generation/update authorization;
- introduced research requirement for threshold/role-separated root trust and out-of-band root recovery;
- added complete-generation consistency to defend against partial and mix-and-match activation;
- separated `CurrentGeneration`, `GoldenRecoveryGeneration` and `MinimumPermittedGeneration` so operational rollback does not silently defeat security anti-rollback;
- introduced explicit compatibility/skew envelopes for independently upgradeable control components;
- elevated durable-state/schema compatibility to a rollback proof obligation;
- strengthened promotion from a liveness/health check to layered independent evidence;
- distinguished host identity, boot epoch and service invocation across reboot;
- added external failed-update/boot-attempt budget so a bad candidate cannot perpetuate its own restart loop;
- added clock/freshness uncertainty to the update threat model.

No provider, language, database, bootloader, orchestrator or update framework was selected.

Next highest-value gap in this family: durable-state migration/rollback protocols and proof of downgrade readability. Cross-family priority may supersede this based on comparative maturity.

## Non-goals at this stage

- no decision to rewrite the Builder in Rust;
- no decision to introduce a graph database, vector database, search cluster, stream broker or Kubernetes;
- no decision to make the Builder an operating system;
- no autonomous self-modification without external trust/recovery boundaries;
- no replacement of the current G2 execution plan;
- no G4 implementation before explicit planning authorization.

## Closure target for G4 research

G4 research should eventually produce:

1. a deduplicated product capability map;
2. workload and interaction profiles;
3. performance and scale budgets;
4. data/infrastructure/lifecycle/self-hosting proof obligations;
5. implementation-independent target product architecture;
6. technology/provider qualification matrices;
7. prototype evidence for high-risk interaction or performance choices;
8. G3 -> G4 traceability;
9. gap against the then-current System Builder;
10. a planning handoff, without materializing work automatically.
