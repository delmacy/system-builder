# Generation 2 — Planning A — Data / Schema / Migrations Boundaries

Status: PASS_FOR_CAPABILITY
Phase: PLANNING_A_TAXONOMY_BOUNDARIES
Capability: Data / Schema / Migrations

This document defines semantic ownership only. It makes no current-product claim and authorizes no implementation work.

## Ownership

Data / Schema / Migrations owns the portable semantic model for canonical data/schema identity, structural declarations, schema and data-state revisions, directional compatibility claims, migration intent and execution checkpoints, backfill semantics, coexistence across old/new representations, CDC-assisted transition semantics, cutover qualification, rollback/state-recovery eligibility, residual old-schema/data cohorts and provider-neutral data evolution.

Its subject is not merely a database catalog. A data evolution transition is evaluated over identified canonical schema revisions, affected data populations, consumers/producers, migration/backfill/cutover revisions, provider realization, compatibility requirements and evidence proving effective convergence.

Schema declaration, provider-materialized structure, migrated data state and consumer-effective compatibility are distinct facts. A migration acknowledgement or successful DDL call does not prove that all data populations converged, all consumers are compatible, or the cutover is safe.

## Source of truth

Canonical schema/data-contract identities and revision lineage are owner truth. Database catalogs, provider-native migration records, table/column identifiers, physical indexes and provider operation receipts are realization evidence unless explicitly adopted through a governed semantic transition.

Canonical entity, field, relationship and constraint identities remain stable across rename, provider substitution or physical remapping when semantic identity is preserved. Provider table/column IDs and names are non-canonical by default.

A compatibility or transition claim is applicability-scoped across, at minimum, source schema revision, target schema revision, operation/direction, producer and consumer revisions, affected population/cohort, migration/backfill/cutover revision, provider realization revision and evidence-currentness horizon.

Historical migration and compatibility evidence retains producing-revision lineage. Later schema or consumer revisions do not rewrite what was known or qualified at the time of a prior transition.

## Lifecycle and versioning

The portable evolution lifecycle remains `declare/revise schema intent → classify compatibility and affected populations → qualify provider support → plan migration/backfill/coexistence → materialize transition → observe → reconcile ambiguous effects → backfill/repair residual cohorts → qualify consumer-effective compatibility → cut over → drain old representations/cohorts → validate convergence → retain evidence`.

Schema revisions, migration plans, backfill revisions, consumer versions, provider bindings and physical data populations evolve independently. Therefore a target schema being present does not imply that old data has been transformed, that consumers can safely use it, or that old structures can be removed.

Compatibility is directional and context-dependent. A change may be safe for old readers with new writers, unsafe for new readers over old data, or safe only during a bounded coexistence interval. Later phases must not collapse these into a single undirected `compatible=true` flag.

## Coexistence, migration and cutover

Large or online transitions may require explicit coexistence between schema/data revisions. Dual-read, dual-write, shadow-write, translation or compatibility-adapter strategies are transition realizations whose eligibility depends on declared semantics and evidence; no one strategy is universally required.

CDC may assist population synchronization or transition validation, but CDC transport/runtime is not itself canonical migration truth. The owner records what transition semantics and convergence conditions CDC is expected to satisfy; Integration/Data Movement or provider runtimes may realize the mechanism.

Migration checkpoints distinguish at least intent accepted, provider operation attempted, provider operation acknowledged, target structure observed, data population transformed/backfilled, consumers/producers qualified, cutover effective, residual cohorts drained and convergence validated. No earlier checkpoint implies a later one.

Destructive or irreversible transitions require explicit authority and preconditions. When a compatible rollback path is unavailable, the plan must expose forward-fix/state-recovery semantics rather than advertising rollback by convention.

## Rollback and state-recovery eligibility

Rollback eligibility is a current, evidence-qualified capability, not a historical fact inferred from the existence of an earlier schema revision. It may depend on retained old structures, reversible transforms, unmodified source populations, dual-write correctness, backup/recovery state, consumer compatibility and provider support.

A rollback that restores schema shape but loses or misinterprets data is not a successful semantic rollback. Recovery must qualify both structural state and governed data-state consequences.

Provider rollback tooling is realization evidence. If the transition has crossed an irreversible boundary, rollback is denied or unavailable and a different recovery/forward migration path must be explicit.

## Residual schema and data cohorts

During evolution, populations may remain on old schema/data semantics because of lagging backfills, offline clients, external consumers, replicas, indexes, exports, queues, caches or downstream systems. These are residual cohorts, not invisible implementation detail.

Cutover cannot be globally declared converged while material residual cohorts remain unresolved unless an explicit compatibility envelope qualifies them. Removal of old structures/contracts requires evidence that residual producers/consumers/populations are drained, migrated, fenced or governed under an accepted residual disposition.

Offline or intermittently connected consumers may remain inside an explicitly bounded compatibility horizon. Horizon expiry requires requalification, fencing or migration; it cannot be converted into implicit compatibility.

## Capability boundaries

- **Process & Application Modeling:** owns canonical business/process/application semantics. Data/Schema/Migrations owns persistent structural contracts and their evolution; a domain/process change may require schema evolution but does not transfer semantic ownership of the domain to the data layer.
- **Workflow & Durable Execution:** owns durable orchestration, retries, waits and in-flight execution. Workflow may execute migration/backfill activities, while Data/Schema/Migrations owns the schema/data transition semantics, checkpoints and compatibility conditions those activities must satisfy.
- **Storage / Documents / Media:** owns blob/object/document/media persistence and content lifecycle mechanics. Data/Schema/Migrations owns logical structured-data shape and evolution; physical storage mechanics do not decide canonical schema compatibility.
- **Privacy / Data Governance / Retention / Legal Hold / Residency:** owns purpose/use, preservation, hold, residency and lawful disposition constraints. Schema migration cannot silently weaken or erase those obligations, and governed data populations remain subject to them across transforms/copies.
- **Lifecycle / Versioning / Evolution / Migration:** owns generic revision/evolution machinery and cross-capability transition governance. Data/Schema/Migrations owns data-specific schema compatibility, backfill, coexistence and cutover semantics.
- **Provider / Binding / Capability Negotiation:** owns provider discovery, support qualification, binding and substitution. Data/Schema/Migrations owns the required semantic data capabilities and unsupported/partial consequences; provider-native types/features remain realization-specific unless explicitly adopted.
- **Deployment / Environment / Runtime:** owns runtime/environment actuation and rollout mechanics. It may invoke migrations but does not own schema truth, compatibility claims or convergence semantics.
- **Integration & Automation / Data Movement:** owns external synchronization, connectors, CDC/ETL/stream actuation and remote-system effects. Data/Schema/Migrations owns the schema/data transition contract those mechanisms may support.
- **Observability / Diagnostics / Operations:** owns generic telemetry/evidence transport and operational signals. Data/Schema/Migrations owns what evidence is sufficient to assert materialized schema state, cohort completion, compatibility and convergence.
- **Architecture Reconciliation as a Capability:** owns evidence-to-decision reconciliation of architectural gaps. It does not become the semantic owner of schema/data evolution.
- **Adaptive Governed Work Surfaces:** owns governed surface overlays. Personal/Role/Station customization may consume declared fields/entities but cannot create, remove or redefine canonical schema through presentation personalization.
- **Universal Capability Architecture:** supplies reusable identity, revision, applicability, evidence, provider-binding, transition and residual-cohort primitives without owning data/schema semantics.

## Provider boundary and portability

Portable schema semantics must distinguish universal requirements from provider-specific realizations. Provider-native column types, generated columns, extensions, partitioning, indexes, collations, constraints or online-DDL features may be qualified realization capabilities or hints; they do not silently redefine the canonical contract.

When a provider cannot faithfully realize a required semantic constraint or transition property, qualification is unsupported, partial or inconclusive. Silent weakening, lossy type coercion or provider-specific identity substitution is not portability.

Brownfield discovery follows `discover → normalize → explicit adopt`. Introspection of an existing catalog produces evidence/proposals, not automatic canonical truth. Lossy, ambiguous or incomplete mappings remain PARTIAL/INCONCLUSIVE until explicitly reconciled.

Provider substitution is a new qualification event. Semantic schema identity may remain stable while physical layout and migration strategy change, but compatibility and effective population state must be re-established with evidence for the new realization.

## Failure semantics

Later phases must preserve distinguishable states for invalid schema intent, unsupported provider semantics, incompatible producer/consumer combinations, partial migration, partial backfill, drift between declaration and materialized catalog, residual old-schema populations, stale catalog evidence, failed cutover preconditions, irreversible-boundary crossing, ambiguous external mutation and rollback currently unavailable.

External mutating effects preserve the lineage `attempted → accepted → applied/effective → converged → validated`. Canonical effect dispositions include at least `APPLIED`, `NOT_APPLIED`, `PARTIAL` and `UNKNOWN`; `UNKNOWN` requires observe/reconcile-before-retry unless idempotency/effect safety is explicitly qualified.

Provider acknowledgement is not convergence. A target table/column appearing in a catalog is not sufficient proof that data transformation, consumers, replicas, backfills and residual cohorts have reached the required state.

Evidence that is stale, population-incomplete or revision-mismatched yields PARTIAL/INCONCLUSIVE rather than implicit success. Destructive cutovers fail closed when required compatibility or recovery evidence is insufficient.

## Authority and hierarchy

Authority to propose a schema revision, approve a breaking change, execute a migration, authorize destructive cutover, accept a residual cohort, adopt an external schema identity or declare convergence are distinct authorities.

`Enterprise → Station → Role → Person` remains monotonic and non-amplifying. Lower scopes may consume or specialize data capabilities only inside superior delegation and cannot redefine canonical schema, weaken compatibility requirements or bypass migration/recovery preconditions.

AI and Adaptive Governed Work Surfaces may propose schema-aware projections and escalate a request that requires canonical data/domain change, but cannot silently create entities/columns, alter constraints, invent provider compatibility, declare convergence or amplify migration authority. A surface request requiring a domain/schema change is an escalation boundary, not a personalization operation.

## Non-goals

This capability does not own business-domain semantics, UI composition, generic workflow orchestration, blob/document lifecycle, lawful retention/hold decisions, generic provider selection, runtime deployment, generic CDC/ETL transport, analytics semantic metrics, query optimization engines or architecture-gap adjudication.

It also does not require System Builder to natively implement every database engine or online-migration technique. External providers may realize schema/data transitions behind qualified contracts while canonical identity, compatibility, transition semantics and evidence remain portable.

## Planning B repository-validation questions

Deferred to fresh `main`; no answer is inferred here:

1. Does current SB have stable canonical identities for entities, fields, relationships and constraints independent of physical provider names/IDs?
2. Can current definitions distinguish declared schema revision from provider-materialized structure, migrated data population and consumer-effective compatibility?
3. Are compatibility claims directional and scoped to producer/consumer/schema/population revisions rather than a single global boolean?
4. Can current migration representations model backfill, coexistence, cutover checkpoints and residual old-schema/data cohorts?
5. Are migration/provider acknowledgements distinguished from observed/effective/converged/validated state?
6. Can ambiguous mutation outcomes be reconciled before retry, and are idempotency assumptions explicit?
7. Is rollback eligibility represented as current evidence-qualified capability, including data-state consequences, rather than assumed from revision history?
8. Can provider bindings express unsupported or partial semantic type/constraint/migration capabilities without silent weakening?
9. Does brownfield introspection require explicit adoption before external table/column identities become canonical?
10. Are privacy/residency/hold obligations preserved across migration, copy, backfill, rollback and provider substitution?
11. Are offline/lagging consumers and residual cohorts represented and drained or explicitly qualified before old contracts are removed?
12. Can AI/AGWS requests that imply canonical schema/domain changes be detected and escalated rather than materialized as personalization?

## Proof obligations carried forward

Later phases must support proof that canonical schema identity survives physical rename/provider substitution; schema declaration, materialized structure, migrated data and consumer-effective compatibility remain distinct; compatibility is directional and applicability/revision/population scoped; migration acknowledgement does not prove convergence; partial/backfill/residual cohorts are visible; UNKNOWN mutation is reconciled before retry; rollback eligibility is current and evidence-qualified; brownfield discovery does not silently adopt provider identity; destructive cutover fails closed without sufficient compatibility/recovery evidence; and Station/Role/Person or AI/AGWS operation cannot amplify schema/migration authority.

## Planning A decision

**PASS_FOR_CAPABILITY.** Data / Schema / Migrations has a distinct semantic owner, source-of-truth model, lifecycle/versioning, coexistence/cutover semantics, failure semantics, provider boundary, residual-cohort model, authority boundary and non-goals. It remains CORE without absorbing adjacent lifecycle, provider, workflow, storage, privacy, runtime or architecture-reconciliation owners.
