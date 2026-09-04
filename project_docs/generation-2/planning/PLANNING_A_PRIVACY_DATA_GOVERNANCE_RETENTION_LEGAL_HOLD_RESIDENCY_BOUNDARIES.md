# Generation 2 — Planning A — Privacy / Data Governance / Retention / Legal Hold / Residency Boundaries

Status: PASS_FOR_CAPABILITY
Phase: PLANNING_A_TAXONOMY_BOUNDARIES
Capability: Privacy / Data Governance / Retention / Legal Hold / Residency

This document defines semantic ownership only. It makes no current-product claim and authorizes no implementation work.

## Ownership

Privacy / Data Governance / Retention / Legal Hold / Residency owns portable semantics for processing-purpose/use qualification, governed-data populations, retention and disposition eligibility, legal/investigative hold precedence, residency/jurisdiction/transfer constraints, exceptional release or override authority, residual governed copies, obligation currentness, provider-qualified enforcement, and evidence-backed disposition closure.

Its canonical subject is not merely a storage object. A governed transition is evaluated over an identified data population, requested transition, independently revisioned obligations and the evidence proving their effective coverage.

Logical visibility, destructive eligibility and physical disposition are distinct facts. Hiding or dereferencing data does not prove lawful destruction; lawful eligibility does not prove that all authoritative copies were physically disposed; provider acknowledgement does not prove population-wide closure.

## Source of truth

Canonical privacy/data-governance intent and obligation revisions are owner truth. Provider retention, hold, location or lifecycle mechanisms are realization evidence. Storage copies, replicas, backups, indexes, exports, caches and downstream consumers are governed populations whose effective state must be qualified independently.

A transition qualification is applicability-scoped across, at minimum, governed population identity, purpose/use revision, retention-schedule revision, hold-set revision, residency/jurisdiction revision, provider/control realization revision, effective-coverage evidence and evidence-currentness horizon.

Historical disposition evidence retains producing-revision lineage. Later obligation revisions may alter current or future eligibility but do not rewrite the basis of prior decisions.

## Lifecycle and versioning

The portable lifecycle remains `identify governed population → resolve applicable purpose/use and preservation/location obligations → qualify provider/control support → verify effective population coverage → ALLOW/DENY/INCONCLUSIVE → actuate if allowed → observe → reconcile ambiguous effects → disposition or requalify residual populations → validate closure → retain evidence`.

Purpose/use, retention, holds, residency constraints, provider bindings and population topology evolve independently. Retention expiry alone therefore never implies delete eligibility, and release of a hold or restriction requires a fresh qualification rather than an implicit transition to ALLOW.

Provider or region substitution is a new qualification event. Matching location labels or feature names do not establish semantic equivalence. Migration, restore, replication, export and create may each have different residency applicability and provider-support characteristics.

## Authority and hierarchy

Authority to view, process, delete, release a hold, approve an exception, change retention, authorize transfer, administer a provider control, or attest closure are distinct authorities.

`Enterprise → Station → Role → Person` remains monotonic and non-amplifying. Lower scopes may narrow purposes, locations, retention bounds or delegated actions only inside superior constraints. A Station, Role or Person cannot weaken mandatory preservation, jurisdiction, purpose or residency obligations or obtain exceptional-delete, hold-release, transfer-exception or provider-admin authority implicitly.

AI and Adaptive Governed Work Surfaces may classify, propose, route and explain governed transitions under delegated authority, but cannot invent lawful basis, release superior holds, weaken retention/residency policy, manufacture closure evidence or amplify authority.

## Residual populations and disposition closure

A governed population may span primary stores, replicas, backups, archives, search indexes, exports, caches, derived copies and downstream consumers. These populations remain governed until they are physically dispositioned, explicitly retained under a controlling obligation, or qualified under another lawful state.

A successful primary delete does not close disposition while authoritative residual populations remain unresolved. Backup/archive limitations are modeled explicitly as support constraints and residual-state facts rather than silently treated as complete deletion.

Closure requires evidence that the applicable populations have converged to their required state or have an explicit governed residual disposition. Partial population coverage yields PARTIAL or INCONCLUSIVE, not a global success claim.

## Residency, jurisdiction and transfer

Residency is a qualified support vector rather than equality of provider region names. Qualification may depend on data class, jurisdiction, transfer rule, resource/service type, operation class, provider/service enforcement coverage, replication/backup behavior, support exemptions and evidence-export capability.

A provider may support creation residency but not equivalent backup, restore, replica, derived-data or metadata residency. Provider substitution must therefore requalify the exact required vector and preserve explicit unsupported/partial axes.

## Capability boundaries

- **Governance / Compliance / Audit:** owns obligation/control frameworks, assessments, exceptions/waivers governance and audit lineage. Privacy/Data Governance owns the data-specific purpose, preservation, residency and disposition semantics to which those controls refer.
- **Data / Schema / Migrations:** owns logical data shape, schema evolution and migration semantics. Schema lifecycle cannot silently alter retention, hold, purpose or residency obligations.
- **Storage / Documents / Media:** owns storage/document/media realization, object lifecycle mechanics and durable content handling. Physical delete/archive capability does not decide lawful disposition eligibility.
- **Authorization / Policy / Organization / Multitenancy:** owns permission decisions and delegated authority. Permission to invoke deletion or movement is necessary but not sufficient for privacy-governance eligibility.
- **Provider / Binding / Capability Negotiation:** owns provider discovery, support qualification, binding and substitution. Privacy/Data Governance owns the required semantic support vector and postconditions for governed transitions.
- **Lifecycle / Versioning / Evolution / Migration:** owns generic evolution and transition governance. Privacy/Data Governance owns data-obligation applicability and disposition eligibility across those transitions.
- **Security / Resilience / Failure Recovery:** owns security posture, recovery and degraded-operation semantics. Recovery cannot restore or replicate governed data into a state that violates current privacy/residency obligations.
- **Observability / Diagnostics / Operations:** owns generic telemetry and operational evidence transport. Privacy/Data Governance owns what evidence is sufficient to assert governed-population compliance and disposition closure.
- **Adaptive Governed Work Surfaces:** owns effective work-surface overlays and delegated Station/Role/Person experiences. It consumes privacy-governance decisions without becoming their semantic owner.
- **Universal Capability Architecture:** supplies reusable identity, revision, evidence, applicability, provider-binding and residual-cohort primitives without owning privacy or data-governance policy.

## Failure semantics

Later phases must preserve distinguishable states for explicit policy denial, stale or unknown obligation state, unsupported provider axis, partially covered governed population, ambiguous destructive/movement effect, non-conforming residency, active preservation hold, expired retention with other blockers remaining, residual copies pending disposition and evidence-currentness horizon exceeded.

Canonical outcomes include at least `ALLOW`, `DENY`, `INCONCLUSIVE`, `PARTIAL`, `NON_CONFORMING` and `OUTCOME_UNKNOWN` where external mutation may have occurred but acknowledgement is ambiguous. `OUTCOME_UNKNOWN` requires observe/reconcile-before-retry unless idempotency/effect safety is explicitly qualified.

Offline or disconnected operation may rely only on retained obligation and enforcement evidence inside authorized horizons. Horizon expiry cannot be converted to implicit permission; privileged destructive or cross-jurisdiction transitions deny or remain inconclusive until requalification according to superior policy.

## Provider boundary and portability

Providers own their native retention engines, hold objects, records stores, region/location constructs, organization policies, backup behavior and enforcement resources. System Builder's portable responsibility remains semantic intent, identities, revision lineage, applicability, required support vector, qualification outcomes and closure evidence.

Provider/external identifiers remain non-canonical unless explicitly adopted through a governed identity transition. Provider acceptance, configuration success or matching labels do not by themselves prove effective governance across all populations.

## Non-goals

This capability does not own every compliance control, generic RBAC/ABAC, schema design, generic storage operations, backup orchestration, provider selection, generic observability, or statutory/legal interpretation engine. It also does not require SB to natively implement every preservation or residency mechanism; external providers may realize those semantics behind qualified contracts.

## Planning B repository-validation questions

Deferred to fresh `main`; no answer is inferred here:

1. Can current SB identify governed data populations across primary stores, replicas, backups, indexes, exports, caches and downstream consumers?
2. Can current contracts represent purpose/use, retention, hold and residency revisions independently and preserve producing-revision lineage in disposition evidence?
3. Are `DENY`, `INCONCLUSIVE`, `PARTIAL`, `NON_CONFORMING` and ambiguous external mutation distinguishable from provider API failure?
4. Can provider bindings express partial or unsupported retention/hold/residency axes instead of a single capability boolean?
5. Does deletion/disposition closure distinguish logical invisibility, eligibility and verified physical/residual population disposition?
6. Can hold/restriction release trigger fresh qualification rather than implicitly allow deletion or transfer?
7. Are Station/Role/Person scopes structurally prevented from weakening superior purpose, retention, hold or residency constraints?
8. Are offline destructive or cross-jurisdiction transitions fenced by explicit evidence-currentness horizons?
9. Can migration/restore/replication/provider substitution force privacy/residency requalification while preserving historical evidence?

## Proof obligations carried forward

Later phases must support proof that preservation obligations can override technically valid destruction; retention expiry alone cannot establish deletion eligibility; residency is operation/provider/population scoped; provider substitution forces requalification; residual copies remain governed until disposition or explicit qualification; stale/partial evidence yields INCONCLUSIVE; historical evidence remains replayable against producing revisions; and delegated Station/Role/Person or AI/AGWS operation cannot weaken superior obligations or amplify authority.

## Planning A decision

**PASS_FOR_CAPABILITY.** Privacy / Data Governance / Retention / Legal Hold / Residency has a distinct semantic owner, source-of-truth model, lifecycle/versioning, failure semantics, provider boundary, residual-population closure model and non-goals. It remains CROSS_CUTTING without absorbing adjacent owners.
