# Data / Schema / Migrations — Revisit 6 / Cycle 7

## Research question
Which additional semantics are required so a Generation 2 data claim remains valid only for its declared dataset/consumer/provider context, while schema evolution, transaction guarantees, CDC, backfill, provider migration, evidence retention and offline Stations evolve independently?

## Representatives and evidence/source ledger
1. **PostgreSQL 18/17** — logical decoding streams are anchored by replication slots and output plugins; UPDATE/DELETE old-row availability depends on replica identity. Logical replication does not replicate DDL, and publisher/subscriber schema mismatch can halt replication. Sources: https://www.postgresql.org/docs/current/logicaldecoding.html and https://www.postgresql.org/docs/17/logical-replication-restrictions.html
2. **CockroachDB** — online schema evolution uses staged capability transitions and cluster convergence; schema-version leases constrain coexistence and delay progress while old readers remain. Source: https://www.cockroachlabs.com/blog/how-online-schema-changes-are-possible-in-cockroachdb/
3. **Google Cloud Spanner** — schema updates are long-running operations; validation/backfill can create multiple internal schema versions and schema-update queues can throttle when too many versions remain in retention. Sources: https://docs.cloud.google.com/spanner/docs/schema-updates-best-practices and UpdateDatabaseDdl API documentation.
4. **Debezium** — connector correctness depends on retained offsets plus schema history; incremental snapshots retain chunk/snapshot endpoints in connector offsets. Loss/reset of offsets or schema history changes what can be reconstructed and can be destructive. Sources: https://debezium.io/documentation/reference/nightly/configuration/storage.html and current connector/incremental-snapshot documentation.
5. **Confluent Schema Registry** — compatibility is subject-scoped, directional and optionally transitive; non-transitive acceptance against the latest schema does not prove compatibility with the historical consumer population. Source: https://docs.confluent.io/platform/current/schema-registry/fundamentals/schema-evolution.html
6. **Prior Generation-2 Data research** — revisit 5 remains authoritative for typed semantic/physical identities, transaction-isolation independence, migration fencing, CDC row identity, qualified cutover and recovery boundaries.

## Source of truth, identity and applicability
Data truth is not a single database status. Generation 2 needs typed identities for at least `SemanticDataModel`, `SchemaRevision`, `DatasetScope`, `DataPopulationEpoch`, `MigrationPlan`, `MigrationAttempt`, `TransactionProfile`, `CDCStream`, `CDCCheckpoint`, `ProviderStorageRealization`, `ConsumerCohort`, and `ValidationEvidence`.

An effective data/schema claim is applicable only to an explicit vector such as semantic schema revision, dataset/tenant/Station scope, provider realization, transaction profile, writer/reader cohort, CDC/checkpoint epoch, compatibility profile, authority/trust revision and evidence horizon. A claim valid for one Station, consumer cohort or provider generation cannot silently become global truth.

Canonical model/schema identity belongs to the semantic data owner. Physical tables, indexes, schema jobs, replication slots, connector offsets and provider operation IDs are realization/evidence identities and must not replace canonical identity.

## Lifecycle and effective state
The portable lifecycle remains staged but is strengthened as:
`proposed → admitted → actuation-attempted → provider-accepted → physical-state-persisted → historical-data/backfill-converged → CDC/replica/derived-consumer-converged → semantic/transaction conformance validated → effective-qualified`.

A lost acknowledgement after a non-idempotent or partially applied migration yields `OUTCOME_UNKNOWN`; the system must observe/reconcile provider state before retry. Provider acceptance or operation completion cannot prove persisted-data, replica, CDC, cache/index, reader/writer or invariant convergence.

## Versioning, compatibility and mixed support
Confluent demonstrates that compatibility is a relation, not a scalar property: latest-only compatibility can differ from transitive population compatibility. PostgreSQL demonstrates that data movement and DDL realization can diverge. CockroachDB demonstrates that old schema leases/readers can remain valid while a newer schema is being introduced.

Therefore provider support must be represented as a mixed vector across schema expressiveness, constraint semantics, transaction/isolation guarantees, online-DDL behavior, backfill semantics, CDC ordering/checkpoint/row identity, replication/derived-read freshness, rollback/forward-fix capability, retention/replay and evidence quality. `supports SQL/schema migration` is insufficient.

## Data-currentness and consumer cohorts
`primary/current schema` is not equivalent to `effective current data`. Effective currentness must identify which writers, readers, replicas, CDC consumers, indexes/materialized projections, caches and external consumers have converged to the required data/schema epoch.

A provider/schema migration therefore closes only after residual source writers, old readers, pending backfills, in-flight CDC, dual-write divergences and derived consumer cohorts are drained or explicitly dispositioned. Destination success is not authority-transfer proof.

## Evidence replay/retention horizon
Historical validity and later replayability are different claims. PostgreSQL logical decoding depends on retained slot/WAL availability; Debezium depends on persistent offsets and, for schema-based connectors, schema history. Spanner explicitly retains multiple schema versions for a bounded operational period.

If required offsets, WAL/log positions, schema history, old schema revisions or validation populations are gone, the system may still know that a migration was historically accepted, but exact reconstruction/re-evaluation becomes `INCONCLUSIVE` or must use a new qualified baseline. Evidence garbage collection must never be interpreted as evidence that an event did not occur.

## Failure semantics
Required states include `NOT_STARTED`, `IN_PROGRESS`, `OUTCOME_UNKNOWN`, `PHYSICAL_APPLIED_NOT_CONVERGED`, `CONVERGED_NOT_VALIDATED`, `VALIDATED`, `FAILED_RECONCILABLE`, and `FAILED_REQUIRING_FORWARD_FIX_OR_RECOVERY`.

Ambiguous actuation requires reconcile-before-retry. Replica/CDC health with incompatible schema is not semantic success. Schema acceptance with insufficient transaction semantics is not invariant safety. Missing replay evidence is `INCONCLUSIVE`, not automatic failure or success.

## Extensibility and provider boundary
Generation 2 owns semantic model identity, applicability, invariant/transaction requirements, migration intent, expected-base/fencing, consumer-cohort closure, evidence shape and provider-neutral cutover semantics. Providers own DDL syntax, physical storage/types/indexes, lock/lease mechanisms, backfill engines, replication slots/logs, CDC implementations and query/storage internals.

Provider substitution is qualified only when destination realization satisfies the required mixed support vector and residual source/consumer cohorts are closed. Portability means `represent → move → converge → validate → transfer authority`, not merely `schema can be created`.

## Governance and delegated Station authority
Keep distinct `SchemaDefinitionAuthority`, `MigrationPlanAuthority`, `MigrationExecutionAuthority`, `DataReadAuthority`, `DataWriteAuthority`, `BackfillAuthority`, `CDCAdministrationAuthority`, `ValidationAuthority`, `CutoverAuthority`, `DestructiveEvolutionAuthority` and recovery authority.

`Enterprise → Station → Role → Person` delegation may attenuate data scope and permitted operations but cannot infer schema/migration/provider authority from access to existing records. A Station may operate a qualified local subset only within its explicit dataset epoch, closure and authority horizon.

## Observability
Useful evidence joins semantic/schema revision, dataset/population epoch, provider physical state, migration attempt/owner epoch, transaction profile, CDC/checkpoint, writer/reader/derived-consumer coverage, validation rules, authority/trust and retention horizon. Healthy provider jobs are observations, not effective-data truth.

## Portability, lock-in and local/offline closure
Qualified offline evolution requires a retained canonical model/schema, migration plan, provider realization artifacts, transaction profile, source snapshot/checkpoint, validators, authority/trust evidence and scoped consumer closure. Reconnection after upstream schema/data/trust/authority advancement requires reconciliation before privileged continuation.

Lock-in risk appears when provider-specific physical identity, CDC position, DDL semantics or transaction guarantees become canonical. Generation 2 should preserve semantic identity while provider realizations remain replaceable but explicitly qualified.

## Product-specific mechanism vs universal primitive
- PostgreSQL slot/WAL/replica identity → realization of CDC identity, retention horizon and row-identity requirements.
- CockroachDB schema leases/stages → realization of multi-version convergence and stale-consumer drainage.
- Spanner schema LRO/internal schema versions → realization of asynchronous actuation, validation/backfill and retention pressure.
- Debezium offsets/schema history → realization of replay checkpoint and reconstruction evidence.
- Confluent compatibility modes → realization of directional/transitive compatibility policy.
- Universal primitives → applicability-scoped data claims, typed lifecycle identities, revision-qualified conformance, evidence horizons, mixed support vectors and consumer-cohort drainage.

## Convergent / divergent patterns
Convergent: typed semantic-vs-realization identity; asynchronous actuation; multi-version coexistence; explicit compatibility relation; historical-data convergence; checkpointed movement; retention-bounded evidence; consumer drainage; semantic validation after provider success.

Divergent/provider-specific: DDL atomicity; isolation/anomaly guarantees; lease/locking design; schema-change cancellation; backfill implementation; WAL/log retention; CDC ordering; replica identity; physical constraints/indexes; rollback/revert behavior.

## Subcapabilities
Semantic schema/model identity; dataset/population epoch; migration orchestration and fencing; transaction/invariant profile; CDC/backfill and checkpoint continuity; effective-currentness/consumer convergence; compatibility/conformance; provider realization/substitution; evidence retention/replay; qualified offline data operation.

## Comparison with current SB — evidence only
A bounded fresh-`main` GitHub code search for `schema migration registry database provider checkpoint` returned no matches in this run. This is not repository-wide proof of absence. Planning B must perform full repository archaeology before any KEEP/HARDEN/GENERALIZE/REPLACE disposition based on implementation truth.

## Reconciliation hypotheses
- **KEEP** semantic Data ownership separate from storage/provider and Authorization.
- **HARDEN** applicability-scoped effective-data claims, ambiguous-actuation reconciliation, consumer drainage and replay-horizon semantics.
- **GENERALIZE** mixed support vectors, revision-qualified conformance and evidence-retention semantics with UCA/Lifecycle primitives.
- **PROVIDERIZE** DDL, leases, physical schema, logs/slots, replication, backfill engines and transaction implementation.
- **INTEGRATE** recovery, authorization and observability through explicit evidence contracts without moving semantic ownership.
- **REPLACE** boolean `migrated/current/compatible/healthy` shortcuts with scoped qualified claims.
- **DEFER** a universal database/CDC engine.
- **DO_NOT_BUILD** a bespoke storage engine solely to erase meaningful provider differences.

## Stable findings
- **G2-FINDING-DSM-45 — Effective data/schema truth is an applicability-scoped claim over schema/model, dataset/population, tenant/Station, provider realization, transaction profile, consumer cohort, CDC/checkpoint, compatibility, authority/trust and evidence horizon; no single database status is globally authoritative.**
- **G2-FINDING-DSM-46 — Data-currentness is realization- and consumer-specific: primary/schema success does not prove replicas, CDC, indexes/materialized projections, caches, writers/readers or external consumers have converged to the same effective epoch.**
- **G2-FINDING-DSM-47 — Data conformance is revision-qualified across semantic schema, data population, transaction/invariant profile, provider realization and validation rules; schema compatibility alone cannot prove business-invariant safety.**
- **G2-FINDING-DSM-48 — Migration actuation has distinct attempted, accepted, persisted, converged and validated states; acknowledgement loss or timeout creates OUTCOME_UNKNOWN and requires reconcile-before-retry rather than blind replay.**
- **G2-FINDING-DSM-49 — Data/migration evidence has a replay horizon distinct from historical validity; loss/GC of WAL/log positions, CDC offsets, schema history, old revisions or validation populations makes exact reconstruction unavailable and must propagate INCONCLUSIVE/new-baseline semantics.**
- **G2-FINDING-DSM-50 — Database/provider portability is a mixed support vector across schema/constraint semantics, transaction/isolation, online DDL, backfill, CDC/checkpoint/ordering, derived-read freshness, rollback/forward-fix and evidence; nominal schema compatibility is insufficient.**
- **G2-FINDING-DSM-51 — Provider/schema migration closes only after residual source writers, old readers, dual-write divergence, backfill, CDC and derived-consumer cohorts are drained or explicitly dispositioned; destination success does not transfer data authority by itself.**
- **G2-FINDING-DSM-52 — Qualified local/offline data operation and delegated Station administration are non-amplifying and horizon-bounded; reconnect after superior schema/data/trust/authority advancement requires reconciliation before privileged writes, migration or cutover continue.**

## Capability candidates
1. `G2-CAPABILITY-CANDIDATE-DSM-APPLICABILITY-SCOPED-EFFECTIVE-DATA-CLAIM` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile with UCA applicability while Data retains dataset/population/transaction/CDC semantics.
2. `G2-CAPABILITY-CANDIDATE-DSM-DATA-EVIDENCE-REPLAY-HORIZON` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile with UCA/Governance/Lifecycle evidence-horizon primitives while Data owns WAL/log/offset/schema-history meaning.
3. `G2-CAPABILITY-CANDIDATE-DSM-MIXED-DATABASE-PROVIDER-SUPPORT-VECTOR` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; preserve independent schema, transaction, DDL, backfill, CDC, freshness, recovery and evidence axes.
4. `G2-CAPABILITY-CANDIDATE-DSM-DATA-CONSUMER-COHORT-DRAINAGE` — **CORE_SUBCAPABILITY / PENDING_SYNTHESIS**; Data owns residual writer/reader/CDC/dual-write/derived-consumer closure during schema/provider migration.

No candidate is promoted in this pass.

## Repo-validation questions
During Planning B determine: where semantic schema/data identity lives; whether provider physical identities leak into canonical contracts; whether migration attempts have typed owner/epoch/outcome identities; whether ambiguity is reconciled before retry; which transaction/isolation guarantees are explicit; how CDC/source/key/checkpoints and schema history are represented; how consumer convergence is proven; what evidence is retained and for how long; and whether Station/tenant scope can accidentally amplify schema/migration/provider authority.

## Architecture proof-backfill / Symbiotic Proof
1. Qualify one dataset/schema revision for provider A and consumer cohort C1, then change only provider generation, transaction profile, Station scope or consumer cohort; the old claim must become inapplicable.
2. Apply DDL successfully while a replica/CDC target or historical population is incompatible; state must remain partial until convergence and validation.
3. Lose acknowledgement after a migration step; retry must first reconcile provider state and attempt identity.
4. Expire/delete required CDC offset/schema-history evidence; historical success remains recorded but exact replay/re-evaluation becomes INCONCLUSIVE/new-baseline.
5. Migrate to provider B while old writers/readers and dual-write divergence remain; refuse authority transfer until residual cohorts are dispositioned.
6. Demonstrate a schema that is representable on B but fails a required transaction/invariant profile; portability must fail for that capability profile.
7. Perform an authorized offline Station migration from qualified closure, reconnect after superior data/schema/trust epoch, and gate privileged continuation pending reconciliation.
8. From AGWS, ask AI to add a canonical field or alter migration semantics; AI may propose/escalate but cannot materialize without explicit canonical-data/migration authority.

## Adaptive Governed Work Surfaces boundary
Adaptive Governed Work Surfaces remains a distinct promoted capability. `Enterprise → Station → Role → Person` governs surface exposure and delegated administration but does not move canonical data ownership. AGWS components bind to admitted semantic fields/capabilities; users cannot create arbitrary schema/query/domain mutations through layout composition. AI remains sole surface materializer but canonical field/schema/migration changes require authority escalation. External data capabilities must be consumed through provider-independent bindings, with lineage/version/diff/reset/rollback of the surface independent from schema/provider realization.

## Value / risk / priority / next question
**Value:** foundational for portable generated enterprise systems and safe brownfield/provider evolution. **Risk:** critical if currentness, compatibility or migration completion are inferred from one provider status, or if retained evidence/consumer cohorts are ignored. **Priority:** high. **Next question:** continue the authoritative cycle-7 rotation with Storage / Documents / Media revisit 6, stress-testing applicability-scoped content/document claims, version/retention/legal-hold/evidence horizons, derived indexes/previews, provider support vectors, residual consumer/provider drainage, offline closure and AGWS/AI non-amplification.