# Generation 2 — Lifecycle / Versioning / Evolution / Migration — Full Pass 3 Revisit

Status: MATERIAL FINDING
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 3
Disposition: research-only; no remediation, Work Package, TASK, Construction or product-code authority.

## Authority and scope

This revisit followed `RESEARCH_PIPELINE_STATE.json` as the sole phase/current-focus/next-action authority. Required framework inputs were re-read before analysis:

- `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`;
- `edge-cases/PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`;
- `LIFECYCLE_VERSIONING_EVOLUTION_MIGRATION_EDGE_CASE_REGISTER.md`;
- `LIFECYCLE_VERSIONING_EVOLUTION_MIGRATION_FULL_PASS_2_REVISIT.md`;
- current `ADVERSARIAL_SATURATION_STATE.json`, `EDGE_CASE_INDEX.md` and `CROSS_CAPABILITY_EDGE_CASE_MATRIX.md`.

Start baseline: Full Pass 3 at 26/28 capabilities and 12/12 mandatory clusters; 283 material edge scenarios + 118 reusable ConflictPatterns = 401 material findings. Lifecycle local no-material streak was 1. Planning C remained blocked.

Canonical distinctions preserved: `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`; compatibility evidence is revision-, direction-, operation- and cohort-qualified; migration status != convergence; retained history != current rollback eligibility; provider ACK != canonical effective state; `UNKNOWN mutating effect -> reconcile-before-retry` unless the exact qualified operation contract proves retry safety.

## Techniques materially different from Full Passes 1 and 2

1. **Compatibility-direction inversion** — hold the same two revisions/components constant and reverse producer/consumer, reader/writer, control-plane/node or old/new roles to test whether a symmetric compatibility claim survives incorrectly.
2. **Operation-mode permutation** — vary read, write, transform, replay, rollback, migrate, validate and compensate while keeping the same revision pair to expose operation-specific admissibility.
3. **Coexistence topology mutation** — route one actor to one of several differently-versioned peers through rolling/HA/provider topologies and test whether pairwise support claims remain valid for the actual reachable set.
4. **Presence/default transduction across evolution** — vary `ABSENT/null/default/delete` across old/new representations and check whether representational compatibility is incorrectly promoted to semantic compatibility.
5. **Trust/privacy overlay mutation** — preserve technical read/write compatibility while changing trust namespace, purpose/residency or cumulative disclosure context.
6. **Residual-cohort replay** — reintroduce old clients/workers/providers after nominal migration and test whether previously valid one-way compatibility is reused in the opposite direction or for a newer operation.
7. **Rollback non-injectivity challenge** — keep an old binary/artifact available while newer transformations have discarded or reinterpreted information and test whether reverse migration is inferred from forward success.
8. **Resource/cardinality fan-out** — increase revision/cohort combinations and partial eligibility sets to test whether a bounded analyzer collapses relation-specific results into one scalar `compatible` status.
9. **AI/low-code plan mutation** — generate syntactically valid evolution plans that infer symmetric compatibility from one successful path, feature label or migration rehearsal.

## Material finding

### G2-EDGE-LIFECYCLE-008 — Directional compatibility collapsed into symmetric compatibility

- **Scenario:** two revisions/components are individually valid and one interaction direction is supported, so the lifecycle coordinator treats the pair as generically compatible. The reversed direction or a different operation is not supported, yet rolling migration, rollback, replay or residual-cohort routing exercises it.
- **Activation conditions:** coexistence of independently versioned producer/consumer, reader/writer, control-plane/node, client/server, schema/runtime/provider/contract components; compatibility evidence recorded without direction and operation; topology permits reversed or alternate interaction.
- **Incompatible claims/actions/states:** `A can safely interact with B for operation X in direction A→B` versus `A and B are mutually compatible for any reachable direction/operation`; a migration plan may therefore route a valid component into an invalid interaction even though every component is locally healthy and supported.
- **Why local validation may miss it:** each component can be valid for its own revision and the tested path can pass; the conflict emerges from composition when direction, role or operation changes.
- **Expected safe behavior:** compatibility claims remain qualified by subject revisions, direction/roles, operation/profile, reachable peer set and evidence currentness. Missing required dimensions produce `INCONCLUSIVE` rather than symmetric compatibility.
- **Forbidden behavior:** infer `compatible(A,B) == compatible(B,A)` or infer read/write/forward/rollback equivalence from one successful relation unless the semantic owners explicitly prove that symmetry for the qualified scope.
- **Detection stage/candidates:** static/pre-execution compatibility-relation matrix; topology-aware reachable-peer analysis; producer/consumer and reader/writer role inversion tests; rolling-upgrade pairwise/N-wise model; operation-specific round-trip/migration tests; runtime signal when an interaction occurs outside the qualified relation.
- **Owners:** Lifecycle coordination owns relation/currentness composition; each schema/contract/runtime/provider/data semantic owner owns its directional/operation-specific support semantics; Standards/Provider owners supply realization evidence only.
- **Severity:** HIGH, potentially CRITICAL when the invalid direction can corrupt data or make rollback/recovery unsafe.
- **Confidence:** strongly supported.
- **Detectability:** static + pre-execution; runtime/post-effect for unmodeled topology paths.
- **Blast radius:** workflow/process/system/enterprise depending on the reused compatibility claim.
- **Reversibility:** bounded migration required to potentially irreversible where the unsupported direction mutates/lossily transforms data.
- **Time-to-harm:** immediate on first invalid interaction or latent until routing/rollback exercises the reverse relation.
- **Misuse likelihood:** plausible; likely under rolling upgrade, incident rollback or generated migration planning if compatibility is stored as a scalar boolean.
- **Evidence currentness:** current relation evidence required for the actual revisions, roles, operation and reachable topology.
- **False-positive risk:** medium; many pairs are intentionally symmetric, and one-way compatibility is legitimate. The finding rejects unqualified symmetry, not asymmetric coexistence.
- **Failure/effect disposition:** `INCONCLUSIVE` before actuation when relation dimensions are missing; after an ambiguous mutating interaction preserve `PARTIAL/UNKNOWN` and reconcile before unsafe retry.
- **Future remediation disposition:** `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`; later routes may require refreshed relation evidence, migration ordering, bounded coexistence, explicit exception or owner reconciliation. No mechanism is implemented here.
- **Proof/test candidate:** mutate a known-supported A→B relation into B→A and across read/write/migrate/rollback operations; the system must not inherit compatibility without explicit proof for the new qualified relation.
- **Saturation status:** MATERIAL in Full Pass 3; Lifecycle local no-material streak resets.

## Reusable ConflictPattern

### G2-CONFLICT-PATTERN-COMPATIBILITY-DIRECTION-001 — One-way compatibility promoted to undirected compatibility

- **Family/type:** version/migration/coexistence + state/temporal + provider/integration + data/consistency.
- **Narrative example:** a newer control plane can serve an older worker, but the older control plane cannot safely serve the newer worker; or a new schema can read old data while the old code cannot read/write the new representation. Both components remain individually supported, yet a rolling topology exposes the unsupported direction.
- **Involved capabilities/processes:** Lifecycle primary; Data/Schema, Runtime, Standards/API Contracts, Provider/Binding, Workflow/Integration and Recovery where applicable.
- **Preconditions / activation conditions:** at least two independently evolving endpoints/revisions; evidence exists for one qualified interaction; composition changes direction, role, operation or reachable peer set without independently requalifying it.
- **Incompatible claims/actions/states:** qualified relation `support(A→B, op=X)` versus undirected/scalar `compatible(A,B)` reused for `B→A`, `op=Y`, rollback or another cohort.
- **Why local validation may miss it:** local conformance and one successful path do not establish closure over reversed relations or other operations.
- **Detection candidates / required evidence:** directed compatibility graph keyed by revisions/roles/operation/profile; topology reachability; upgrade-order constraints; round-trip/forward-backward mutation tests; current evidence horizon and owner-qualified exceptions.
- **Owner set:** Lifecycle coordination plus the semantic owner(s) of each endpoint/revision/operation; Standards/Provider are realization owners, not universal semantic owners.
- **Severity:** HIGH–CRITICAL.
- **Confidence:** strongly supported.
- **Detectability:** static / pre-execution; runtime when topology differs from declared plan.
- **Blast radius:** workflow to enterprise/external parties.
- **Reversibility:** migration required to potentially irreversible.
- **Time-to-harm:** immediate or latent until a reverse/alternate path is exercised.
- **Misuse likelihood:** plausible to likely in rolling migration, rollback and AI-generated evolution plans.
- **Evidence currentness:** current and relation-specific.
- **Static prevention feasibility:** feasible as a bounded representation/proof obligation; undesirable only if implemented as blanket prohibition of asymmetric compatibility.
- **Known false-positive risks:** deliberate one-way compatibility, append-only readers, controlled forward-only migrations and owner-qualified asymmetric support are valid and must remain expressible.
- **Future remediation disposition:** require additional relation evidence, reorder migration, constrain reachable topology, explicitly accept bounded asymmetry or route to owner reconciliation later. Research does not execute remediation.
- **Preventive invariant candidate:** **YES — bounded**. Compatibility used for lifecycle decisions must not be widened from a qualified directed/operation-specific relation into an undirected/global claim without owner evidence. This permits legitimate asymmetric processes and does not prescribe implementation.
- **Saturation status:** new reusable material pattern; no `ConflictInstance` asserted.

## Duplicate-screen against the prior 118 patterns

The candidate is not reducible to the existing catalogue:

- `G2-CONFLICT-PATTERN-MIGRATION-READINESS-001` governs readiness/currentness over a migration scope, but can still be satisfied by fresh evidence that is itself missing direction/operation.
- `G2-CONFLICT-PATTERN-CUTOVER-AUTHORITY-001` concerns residual authoritative actors, not whether the interaction relation itself is asymmetric.
- `G2-CONFLICT-PATTERN-ROLLBACK-ELIGIBILITY-001` governs current rollback safety; directional compatibility is a reusable upstream reason a rollback can become ineligible, including outside rollback.
- `G2-CONFLICT-PATTERN-CONTRACT-COEXISTENCE-001` concerns old/new contract cohorts retaining incompatible writes; the new class also applies to locally supported components with no stale cohort and to read/control-plane relations.
- `G2-CONFLICT-PATTERN-CONFORMANCE-SEMANTICS-001` distinguishes syntax/conformance from semantic equivalence but does not encode direction/role/operation of a compatibility relation.
- `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001`, `TRUST-NAMESPACE-COLLAPSE-001` and `CUMULATIVE-PRIVACY-001` were explicitly challenged and remain orthogonal overlays.

No separate cross-capability scenario ID is created in this visit. The reusable pattern is linked into the cross-capability matrix so future explicit cluster revisits can challenge it without manufacturing a cluster streak update.

## Refreshed external evidence

Evidence checked 2026-09-05:

- Kubernetes Version Skew Policy documents explicitly directional constraints: `kubelet` must not be newer than the `kube-apiserver`, while older kubelets are supported within a bounded range. In HA, the set of reachable API-server versions can further narrow which client/control-plane versions are supported. Upgrade order therefore depends on direction and topology, not merely the unordered pair of versions: https://kubernetes.io/releases/version-skew-policy/
- PostgreSQL logical replication documents that DDL/schema changes are not replicated automatically and that additive schema changes can need to be applied to the subscriber first to avoid replication errors. The same old/new schema pair therefore does not imply order-independent compatibility: https://www.postgresql.org/docs/16/logical-replication-restrictions.html
- Protocol Buffers field-presence evolution guidance distinguishes explicit and implicit presence semantics, reinforcing that old/new representations may remain parseable while round-trip/write semantics differ by direction and operation: https://protobuf.dev/programming-guides/field_presence/

These sources support the portable relation/direction principle; product-specific version ranges or migration procedures are not promoted into universal architecture.

## Conflict-family coverage

The pass explicitly challenged structural graph, state-transition, semantic ownership, rule/formula/condition, temporal/ordering, resource/capacity, authority/responsibility/SoD, policy/compliance, data/consistency, provider/integration, version/migration/coexistence, exception/compensation/recovery, human-procedure/instruction, cross-process, objective/optimization and AI/low-code composition.

Other probes—including presence/default semantics, trust namespace, cumulative privacy across retained history, residual authoritative cohorts, ambiguous migration effects, supersession lineage, resource/cardinality exhaustion and AI authority—were duplicate-screened into existing patterns and did not produce additional material findings.

## Saturation disposition

- New local edge scenario: **1** — `G2-EDGE-LIFECYCLE-008`.
- New cross-capability scenario: **0**.
- New reusable ConflictPattern: **1** — `G2-CONFLICT-PATTERN-COMPATIBILITY-DIRECTION-001`.
- Lifecycle local eligible no-material streak: **1 -> 0** because a material finding resets the affected streak.
- Mandatory cluster streaks: **unchanged**; this was a local revisit and no cluster-specific material scenario survived duplicate-screen. The new reusable pattern is cross-linked for future explicit cluster challenge.
- Material totals after this visit: **284 edge scenarios + 119 ConflictPatterns = 403 material findings**.
- HIGH/CRITICAL without owner/proof/detection route: **0**.
- Full Pass 3 capability coverage: **27/28**.
- Full Pass 3 mandatory cluster coverage: **12/12**.
- Completed full passes: **2/8 minimum**.
- Negative-space: `NOT_STARTED`.
- Saturation: `NOT_SATURATED`.
- `PLANNING_C_TARGET_ARCHITECTURE`: **BLOCKED**.

## Next-action candidate

Subject to fresh authoritative-state/head revalidation before persistence, continue Full Pass 3 with `Architecture Reconciliation as a Capability`, duplicate-screening against all 119 reusable ConflictPatterns and explicitly challenging compatibility-direction evidence when desired/declared state is compared with observed/effective cohorts. Preserve research-only disposition. Do not enter Planning C.