# Generation 2 — Data / Schema / Migrations — Full Pass 4 Revisit

Status: FULL PASS 4 — ELIGIBLE NO-NEW-MATERIAL REVISIT / LOCAL STREAK 2 / PAIRED CLUSTER STREAK 2
Capability: Data / Schema / Migrations
Paired cluster: Data/Schema × Privacy × Storage × Lifecycle
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

Research-only disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. This dossier creates no implementation, target architecture, Work Package, TASK, Construction work or `ConflictInstance`. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, `StoredFact != DerivedValue`, qualified evidence/currentness, provider IDs as non-canonical and `UNKNOWN → reconcile-before-retry`.

## Revisit method

Full Pass 4 deliberately used techniques different from the Pass-1 register and the Pass-2/3 migration compatibility/common-cut exercises:

- **constraint-validity-state mutation**: distinguish a declared constraint from evidence that it holds for historical rows, current writers and all active cohorts;
- **semantic-cut tomography**: compare source-of-truth, migration transform, dual-write/CDC, storage realization, privacy disposition and downstream derived adoption at several independent cuts rather than assuming one global migration instant;
- **cohort witness subtraction**: remove one old reader/writer/provider/restored/offline cohort from convergence evidence and test whether a global claim is still qualified;
- **presence/default provenance mutation**: transform `ABSENT/UNSET/null/default/delete` through old/new schemas and backfills while preserving syntactic validity;
- **retention/hold/residency constraint intersection**: compose schema constraints, disposal obligations, legal hold and location restrictions to search for jointly unsatisfiable states;
- **long-write DDL interleaving**: allow validation/read under one schema revision and commit under another, including online constraint installation/validation;
- **identity/key temporal reuse**: reuse identifiers after migration, deletion, restore or provider substitution and test canonical-subject continuity;
- **correction-after-adoption braid**: supersede source facts after derived snapshots, exports or external consumers have adopted prior semantics;
- **directed compatibility inversion**: replay, rollback or reverse migration using a relation only qualified in the forward/read direction;
- **resource/pathology escalation**: expand schema dependency graphs, validation sets, backfill fan-out, CDC backlog and privacy-lineage cardinality without introducing invalid syntax;
- **human/AI migration-plan mutation**: keep steps individually admissible while reordering them or changing semantic ownership, privacy, authority or historical-evidence meaning.

## Duplicate screen against 119 reusable ConflictPatterns

No genuinely new material class survived duplicate screening.

The strongest candidate was **declared constraint != universally validated invariant**. PostgreSQL documents that a `NOT VALID` CHECK/foreign-key constraint can be installed without scanning historical rows, while subsequent writes are constrained and a later `VALIDATE CONSTRAINT` is required before the system may assume the condition holds for all rows. This is an excellent industrial witness for partial qualification, but not a new reusable conflict family: the catalogue already separates declared/configured state from qualified evidence/currentness and convergence, and already covers residual cohorts, revision vectors and partial migration state.

Other probes reduced as follows:

- multi-version read/write cuts and rolling cohorts → schema-losslessness, revision-vector, coexistence/residual-cohort and compatibility-direction families;
- defaults/backfills manufacturing facts → `G2-CONFLICT-PATTERN-DEFAULT-MATERIALIZATION-001` plus `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001`;
- constraint declaration without historical validation → qualification/currentness/convergence families; signal must not be promoted to confirmed invariant;
- retention deletion versus legal hold/residency/schema obligations → policy-precedence, preservation/disposition and lifecycle-owner families;
- dual-write/CDC without one qualified cut → currentness/convergence plus ambiguous-effect/idempotency families;
- identity/key reuse across deleted/restored/residual cohorts → canonical-identity, mapping/currentness and migration-coexistence families;
- online schema changes crossing long writes → stale-base/state-transition/revision-currentness families;
- correction/supersession after downstream adoption → lineage/supersession and cross-process compensation/adoption families;
- restore of disposed data from obsolete cohorts → recovery qualification, retention/disposition and residual-cohort families;
- reverse migration/rollback based on forward compatibility → `G2-CONFLICT-PATTERN-COMPATIBILITY-DIRECTION-001`;
- provider substitution with `PARTIAL/UNKNOWN` → provider qualification, residual-cohort and reconcile-before-retry families;
- pathological migration/lineage graphs → resource-boundedness/fan-out/cardinality families;
- human instructions whose safe order conflicts with actual migration prerequisites → human-procedure/temporal-ordering families;
- AI/low-code plans whose individually valid steps jointly change ownership/privacy/authority → semantic-ownership, cumulative-privacy and authority-non-amplification families.

The explicit paired-cluster question also produced no new family. A schema migration, privacy rule, storage lifecycle rule and restore path may each be valid in isolation while their joint state is unsafe or unqualified; the catalogue already carries the required owner/detection routes through policy precedence, qualified-currentness, lineage/disposition, cumulative privacy, residual cohorts and cross-process recovery/adoption. No new `G2-XEDGE-*` or `G2-CONFLICT-PATTERN-*` ID is warranted.

## External evidence refresh

Portable evidence was refreshed against mature-system documentation:

- PostgreSQL `ALTER TABLE` documents `NOT VALID` constraints as intentionally not proving historical-row conformance until `VALIDATE CONSTRAINT` scans the existing population. This reinforces `declared constraint != globally qualified invariant` and the need for evidence that identifies the validated population/cut.
- PostgreSQL logical replication documents that schema/DDL is not replicated automatically and that replicated data can fail at a subscriber whose schema does not accept it. This reinforces `replication transport progress != schema convergence` and keeps schema compatibility qualified by direction, operation and cohort.

Sources:
- https://www.postgresql.org/docs/17/sql-altertable.html
- https://www.postgresql.org/docs/17/logical-replication-restrictions.html

These are evidence witnesses, not architectural prescriptions. System Builder research extracts the portable semantic distinction rather than universalizing PostgreSQL mechanics.

## Conflict-class coverage exercised

The revisit deliberately exercised the required processual/semantic conflict families: structural dependency graph; state-transition and long-write revision crossing; semantic ownership; rule/constraint/default semantics; temporal/ordering; resource/capacity; authority/responsibility; policy/compliance; data/consistency; provider/integration; version/migration/coexistence; exception/compensation/recovery; human-procedure/instruction; cross-process adoption; objective trade-offs such as availability versus validation/retention; and AI/low-code composition.

For every candidate material signal, the duplicate screen required an existing owner and detection/future-remediation route. No candidate remained ownerless or classificationless.

## Eligibility result

Local result: **ELIGIBLE NO-NEW-MATERIAL REVISIT**.

Paired-cluster result: **ELIGIBLE NO-NEW-MATERIAL REVISIT**.

New local edge scenarios: **0**.
New cross-capability scenarios: **0**.
New reusable `G2-CONFLICT-PATTERN-*`: **0**.
Preventive invariant candidates newly elevated: **0**.
HIGH/CRITICAL findings without owner/proof/detection route: **0**.

This is evidence of catalogue saturation for this revisit only, not proof that concrete conflicts cannot occur. `Signal != ConfirmedConflict` remains mandatory.

## Streak disposition

- Data / Schema / Migrations local no-material streak: **1 → 2**.
- Data/Schema × Privacy × Storage × Lifecycle explicit cluster no-material streak: **1 → 2**.
- Material inventory remains **284 edge scenarios + 119 reusable ConflictPatterns = 403 material findings**.
- Full Pass 4 advances to **4/28 capabilities + 3/12 mandatory clusters**.
- Completed full passes remain **3/8 minimum**; target reference **12**, no maximum.
- Negative-space remains `NOT_STARTED`.
- Saturation remains `NOT_SATURATED`.
- Planning C remains blocked.

## Next rotation

Continue only Full Pass 4 with **Storage / Documents / Media**. Explicitly exercise the next state-authorized mandatory cluster if selected by the reconciled pipeline state; otherwise perform the local revisit without manufacturing cluster coverage. Use techniques materially different from Full Passes 1–3 and duplicate-screen against all 119 reusable ConflictPatterns. Challenge semantic document identity versus bytes/aliases, multipart/range partial effects, metadata/content revision divergence, lifecycle/legal-hold/residency joins, restore/hydration against current canonical semantics, provider-specific version/checksum/immutability claims, residual provider cohorts, `PARTIAL/UNKNOWN`, presence semantics, cumulative privacy through derived/preview/index copies, resource exhaustion and AI/low-code transforms that preserve syntax while changing semantic ownership, retention, authority or evidentiary meaning. Do not enter Planning C.
