# Generation 2 — Workflow & Durable Execution

Status: revisit cycle 2 pass 1 complete; NOT SATURATED.

## Research question

Which minimum portable durability contract can be satisfied by materially different providers without reducing the contract to the lowest common denominator, especially for versioned in-flight executions, recovery, migration and effect guarantees?

## Representatives

First-pass evidence from Temporal, Camunda 8, AWS Step Functions, Azure Durable Functions/Durable Task and Restate remains authoritative. Revisit 1 targets unresolved semantics with four strong representatives:

1. **Camunda 8** — live instance migration and modification, including explicit mapping constraints and operator-created unreachable states.
2. **AWS Step Functions** — execution association with versions/aliases and redrive identity/history semantics.
3. **DBOS** — durable workflows plus transaction-coupled exactly-once database effects, contrasting step-level at-least-once behavior.
4. **Restate** — retained from first pass as the journal/idempotency/durable-promise contrast; no first-pass finding is revoked.

## Evidence/source ledger — revisit 1

| Representative | Source of truth | Architectural evidence |
|---|---|---|
| Camunda 8 | https://docs.camunda.io/docs/components/concepts/process-instance-migration/ | Migration requires an explicit source→target mapping plan. Active jobs/expressions/input mappings are not automatically recreated or reevaluated; migration can produce semantically unintended states, so successful command execution is not semantic correctness proof. |
| Camunda 8 | https://docs.camunda.io/docs/components/operate/userguide/process-instance-modification/ | Operator repair can skip/repeat activities and may create states unreachable by normal execution; modification authority therefore differs from ordinary workflow execution authority. |
| AWS Step Functions | https://docs.aws.amazon.com/step-functions/latest/dg/execution-alias-version-associate.html | Execution association is determined at start: a version-qualified start pins that version, while an alias-associated execution records alias plus selected version. |
| AWS Step Functions | https://docs.aws.amazon.com/step-functions/latest/dg/redrive-executions.html | Redrive preserves successful history/results, original execution ARN and original version/alias association while rescheduling unsuccessful work. |
| DBOS | https://docs.dbos.dev/typescript/tutorials/workflow-tutorial | Workflow recovery resumes from completed steps; a step can be attempted at least once but is not re-executed after durable completion. |
| DBOS | https://docs.dbos.dev/golang/tutorials/transaction-tutorial | Application writes plus DBOS durability record can commit atomically in a datasource transaction, yielding an exactly-once transaction guarantee stronger than an ordinary durable step. |
| DBOS | https://docs.dbos.dev/production/workflow-recovery | Distributed self-hosted recovery requires executor identity and ownership/recovery coordination; durable state alone does not eliminate recovery-leadership semantics. |
| Restate | first-pass dossier evidence remains authoritative | Journal, durable handler/state/promise and retention evidence remains useful for cross-checking the separation of execution truth, effects and evidence retention. |

## Source of truth / identity / lifecycle

The revisit strengthens a three-way truth separation:

`definition/revision truth → execution/history truth → effect-commit truth`.

A workflow history can prove what the orchestrator durably recorded without universally proving that an external side effect occurred exactly once. DBOS demonstrates why the distinction matters: transaction-coupled application writes can obtain a stronger guarantee than a generic step because the business write and durability record share one atomic commit boundary.

Execution identity also needs an **attempt/recovery lineage** without pretending a redrive or recovered executor is a brand-new business execution. Step Functions preserves the same execution identity on redrive while appending new execution events; this is different from starting a replacement execution.

## Versioning and migration

Definition pinning and live migration are distinct lifecycle operations. Step Functions shows immutable association/redrive behavior; Camunda shows explicit in-flight migration with element mappings. A portable contract therefore cannot require all providers to support live migration. It can require providers to declare whether an execution is pinned, migratable, restart-only or replaceable-with-lineage.

A successful migration API response is only **mechanical migration evidence**. Camunda explicitly warns that valid mappings can still create unintended process states and that active job properties may retain pre-migration values. Semantic migration proof must therefore be a separate obligation.

## Failure semantics / recovery

Recovery needs at least four independently declared dimensions:

- **coordination recovery** — resume orchestration from durable truth;
- **effect retry guarantee** — at-most-once / at-least-once / provider-specific qualified semantics;
- **atomic effect guarantee** — only where a shared transaction/idempotency boundary actually proves it;
- **recovery ownership** — which executor/worker may resume abandoned work and how duplicate recovery is prevented.

The universal model must not label a workflow `exactly once` without scoping the claim to a particular effect boundary.

## Extensibility / provider boundaries / portability

Portable workflow semantics should express requirements and claims, not provider algorithms:

`ExecutionDefinitionBinding + DurableWaitRequirement + EffectRequirement + RecoveryRequirement + MigrationCapability + EvidenceRequirement`.

Provider bindings may implement these through history replay, journals, state-machine events, database transactions, worker leases or other mechanisms. Provider replacement is safe only when the new provider satisfies the required semantic profile; syntax translation alone is insufficient.

## Governance / observability

Migration, modification, redrive and recovery takeover are governed mutations. Their evidence should identify actor/authority, source execution revision, requested operation, resulting lineage and proof status. Operator modification is particularly sensitive because it can intentionally create a state that ordinary execution could never reach.

History/journal remains authoritative execution evidence, while logs/traces are projections. Effect evidence can require stronger provider-specific proof than history alone.

## Product-specific mechanism vs universal primitive

Do not universalize Camunda element-mapping rules, Step Functions ARN/alias semantics, DBOS database layout, Restate journal protocol or any Temporal SDK replay mechanism. Generalize only the semantic claims they expose: pinning, migration support, recovery ownership, effect guarantee scope and evidence lineage.

## Convergent/divergent patterns

**Convergent:** stable execution identity; durable completed progress; explicit definition association; governed recovery; durable waits; effect boundaries.

**Divergent:** whether in-flight migration exists; whether redrive preserves the same execution identity; exactly-once scope; recovery ownership algorithm; history retention; worker protocol. These divergences should become capability declarations, not lowest-common-denominator behavior.

## Subcapabilities refined

- execution-definition binding;
- recovery-attempt lineage;
- effect guarantee qualification;
- recovery ownership/lease semantics;
- in-flight migration capability;
- semantic migration proof;
- operator repair authority/evidence;
- durable wait and external-event correlation.

## Comparison with fresh main

A fresh-main repository code search for `workflow execution durable retry compensation` returned no direct implementation match in this run. Therefore this revisit makes no new implementation claim. The later `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION` archaeology remains responsible for proving whether current contracts already implement any of these semantics.

## Architecture-reconciliation hypotheses

- **GENERALIZE** — represent effect guarantees as qualified claims scoped to an effect boundary, never as an unqualified workflow-wide `exactly once` flag.
- **HARDEN** — preserve execution identity while recording recovery/redrive attempt lineage where current runtime already has durable execution identity.
- **PROVIDERIZE** — recovery ownership, replay/journal algorithm and transaction coupling.
- **GENERALIZE** — migration capability declaration plus separate semantic migration proof obligation.
- **INTEGRATE** — governed operator repair/migration evidence with architecture/governance/provenance planes.
- **DEFER** — universal live-instance migration requirement; providers may legitimately declare it unsupported.
- **DO_NOT_BUILD** — a fake universal exactly-once abstraction over arbitrary external effects.

## Repository-validation questions

1. Does fresh main distinguish workflow execution identity from recovery/redrive attempt lineage?
2. Can effect guarantees be stated per activity/integration rather than globally?
3. Is there an atomic coupling boundary between business state and durable execution state anywhere today?
4. Who owns recovery of abandoned in-flight work, and is that ownership evidenced?
5. Can a definition change while instances are active, and what pins old executions?
6. Is migration mechanically validated separately from semantic post-migration proof?
7. Are operator repair and normal execution governed by different authorities?
8. Can external providers declare unsupported migration/recovery guarantees without breaking the portable model?

## Symbiotic Proof — refined

A future proof should run one portable business workflow against two materially different providers. It must prove: stable business execution identity; exact definition binding; durable wait; crash/recovery; a retryable external effect whose guarantee is explicitly qualified; recovery-attempt lineage; and normalized completion evidence. A migration-capable provider should additionally execute a governed in-flight migration and prove post-migration semantic invariants. A provider without live migration must instead declare the capability unsupported and still satisfy the portable workflow contract for new executions. Provider replacement must not silently upgrade the claimed effect guarantee.

## Stable findings

First-pass `G2-FINDING-WDE-01..10` remain authoritative.

- **G2-FINDING-WDE-11 — Effect Guarantee Must Be Scoped.** Durable orchestration history does not universally prove exactly-once external effects; guarantees must identify the concrete atomic/idempotency boundary they cover.
- **G2-FINDING-WDE-12 — Recovery Attempt and Business Execution Identity Differ.** Resume/redrive can preserve one business execution while producing a new recovery attempt/evidence segment; replacement execution is a different lineage operation.
- **G2-FINDING-WDE-13 — Mechanical Migration Success Is Not Semantic Migration Proof.** A provider may accept a valid migration mapping while leaving retained jobs/data or reachable-state assumptions semantically unsafe.
- **G2-FINDING-WDE-14 — Recovery Ownership Is a Durability Concern.** Distributed recovery needs an explicit authority/ownership mechanism so abandoned work is resumed without uncontrolled duplicate recovery.
- **G2-FINDING-WDE-15 — Migration Support Is a Negotiated Provider Capability.** Portable workflow semantics may require version lineage without requiring every provider to support live in-flight migration.
- **G2-FINDING-WDE-16 — Operator Repair Authority Is Stronger Than Execution Authority.** Instance modification can create states unreachable by normal execution and therefore requires a separately governed mutation authority and evidence trail.

## Candidate discoveries

Existing candidates remain authoritative. New revisit candidates:

- `G2-CAPABILITY-CANDIDATE-EFFECT-GUARANTEE-QUALIFICATION` — **CROSS_CUTTING**. Multi-representative need to scope delivery/atomicity/idempotency claims to the actual effect boundary. Promote if Integration/Automation and provider reconciliation need the same reusable claim/evidence primitive.
- `G2-CAPABILITY-CANDIDATE-RECOVERY-ATTEMPT-LINEAGE` — **CROSS_CUTTING**. Recovery/redrive may preserve business execution identity while adding a distinct attempt segment. Promote if failure-recovery/provenance synthesis confirms shared lineage semantics.
- `G2-CAPABILITY-CANDIDATE-SEMANTIC-MIGRATION-PROOF` — **CROSS_CUTTING**. Mechanical migration acceptance is insufficient to prove post-migration semantic invariants. Promote if lifecycle/data/schema migration research converges on the same proof obligation.

## Value / risk / priority / next question

**Value:** critical for runtime autonomy and provider replaceability. **Risk:** high if guarantees are flattened into labels such as `durable` or `exactly-once` without scope. **Priority:** critical. **Revisit result:** six material architectural findings; `consecutive_no_material_finding = 0`; NOT SATURATED.

**Next future revisit question:** can effect-guarantee qualification, recovery-attempt lineage and semantic migration proof be expressed through existing cross-cutting evidence primitives, or do they require promoted capabilities after synthesis/repository validation?
