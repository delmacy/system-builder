# Planning A — Developer / Operator Experience / Self-hosting Boundaries

Status: PASS_FOR_CAPABILITY
Phase: PLANNING_A_TAXONOMY_BOUNDARIES
Canonical capability: Developer / Operator Experience / Self-hosting

This artifact defines semantic ownership and boundaries only. It makes no claim about current System Builder implementation and performs no Planning B archaeology, product code, Work Package, TASK, Construction, PR, or worker handoff.

## 1. Semantic ownership

Developer / Operator Experience / Self-hosting owns the portable experience semantics by which authorized builders and operators can bootstrap, install, configure, diagnose, maintain, upgrade, repair, support, back up, restore, migrate and operate a system through safe workflows without turning ergonomics into a second source of domain, runtime, security, governance or provider truth.

It owns:

- bootstrap/install workflow identity and operator-facing prerequisite/readiness presentation;
- operational profile/topology selection ergonomics from simple local/self-hosted profiles through mature multi-node or provider-backed realizations;
- self-hosted operational-profile declarations and the human-facing closure/checklist needed to operate them safely;
- operator diagnostic views, guided triage and repair workflow orchestration over evidence and actuation owned elsewhere;
- upgrade/maintenance workflow UX, preflight/postflight evidence presentation and bounded administrative affordances;
- backup/restore and disaster-recovery runbook UX over state/recovery owners rather than backup/recovery truth itself;
- disconnected/air-gapped maintenance experience over declared retained closure and bounded evidence/currentness horizons;
- support bundles, evidence export/redaction packaging and handoff ergonomics;
- configuration/provider portability ergonomics, mapping assistance and explicit unresolved-support surfacing;
- administrative safety rails, previews, dry-runs where supported, effect-disposition presentation and reconcile-before-retry guidance;
- developer/operator-facing explanation of canonical identity versus provider/runtime realization identity.

Its source of truth is therefore the revisioned operator/developer experience contract, workflow/runbook identity, profile-selection semantics, user-visible preconditions and qualified effect/evidence presentation. It does not own the underlying runtime, release, build, provider, security, observability, data, trust, authorization or governance fact merely because it presents or orchestrates it.

## 2. Experience truth versus underlying semantic truth

The constitutional boundary is:

`operator workflow state ≠ underlying capability truth ≠ provider acknowledgement ≠ consumer/runtime-effective truth`.

A wizard reporting “installed”, “healthy”, “backed up”, “restored”, “upgraded”, “migrated”, “secure” or “compliant” may do so only from qualified claims produced by the owning capability. UX completion cannot manufacture those claims.

Operator convenience may aggregate evidence, explain dependencies and sequence authorized actions, but it cannot collapse distinctions such as:

- build result versus released artifact versus deployed/effective runtime;
- desired runtime generation versus observed/effective generation;
- backup creation versus restore eligibility versus validated recovered state;
- provider acceptance versus converged/effective mutation;
- configuration materialization versus consumer-effective adoption;
- evidence presence versus current applicability;
- authentication versus authorization;
- historical success versus current qualified readiness.

When required evidence is stale, partial, unavailable or contradictory, the operator surface must preserve `INCONCLUSIVE` rather than invent a positive state for usability.

## 3. Bootstrap and installation ergonomics

Bootstrap/install experience owns the guided path from declared prerequisites to an operator-visible completion disposition. It may collect or select environment/profile inputs, invoke owning capabilities and present their qualified outcomes.

A bootstrap flow should distinguish at least:

`profile selected → prerequisites evaluated → authority/policy evaluated → required artifacts/config/trust/bindings prepared → actuation attempted → effects reconciled → runtime convergence/readiness qualified → operator completion validated`.

An installer exiting successfully is not sufficient proof of operational readiness. If a mutating bootstrap step has an ambiguous effect, the UX must expose `UNKNOWN` and reconcile before retry unless operation-specific idempotency has been qualified.

Bootstrap dependencies that create a circular requirement on the still-unavailable control plane must be made explicit by the owning architecture/runtime capabilities; Operator Experience presents the closure and safe procedure rather than redefining it.

## 4. Operational profiles and topology progression

Self-hosting is a supported operational profile family, not a separate semantic universe. The same canonical identities, authority model, evidence rules, lifecycle semantics and capability boundaries apply whether the realization is local, single-node, multi-node, managed-provider-backed, disconnected or hybrid.

Developer/Operator Experience owns the ergonomics for selecting and understanding profiles, including:

- prerequisites and capability/support vectors;
- availability, durability, backup, restore and maintenance expectations;
- connectivity and disconnected-operation assumptions;
- required external dependencies and provider bindings;
- operational burden and evidence collection requirements;
- upgrade/migration constraints and coexistence expectations;
- unsupported combinations surfaced before actuation where evidence permits.

A “simple” profile may reduce realization complexity but may not silently weaken superior security, privacy, authorization, trust, retention or governance constraints. A “mature” profile may add realizations without changing canonical domain semantics.

## 5. Self-hosted operational closure

Self-hosted operation owns no special exemption from portable semantics. Developer/Operator Experience presents and manages the human-facing closure required to operate a declared self-hosted profile.

The closure may reference retained artifacts, configuration, trust material, local identity/authentication dependencies, data/storage prerequisites, provider/runtime components, observability collection, backup assets, recovery instructions and upgrade material. Each referenced fact remains owned by its semantic capability.

A self-hosted profile is qualified only for the conditions it declares. Claims such as “fully autonomous” or “offline capable” require an explicit retained-closure vector and bounded currentness horizon from the owning capabilities. Absence of a SaaS dependency alone does not prove autonomy.

## 6. Disconnected and air-gapped maintenance

Disconnected/air-gapped operation uses declared retained closure and bounded evidence/currentness horizons. Operator Experience owns the safe workflow for exporting/importing approved artifacts, support bundles, metadata, configuration packages, trust updates and diagnostic evidence without bypassing the owners of provenance, authorization, trust, privacy or release admission.

Offline procedure must distinguish:

- evidence valid at disconnect time;
- evidence whose validity has a bounded offline horizon;
- facts that cannot be refreshed while disconnected;
- local mutations pending enterprise reconciliation;
- imports awaiting trust/provenance/policy qualification;
- expired or unverifiable prerequisites requiring degraded/fail-closed behavior.

Reconnection requires reconciliation before stale local state is promoted to current enterprise truth. Air-gap inconvenience cannot justify bypassing signature, provenance, authorization, privacy, retention or trust controls.

## 7. Diagnostics, triage and repair workflows

Operator diagnostics may compose telemetry, runtime state, configuration/trust currentness, provider support, release provenance, dependency health and incident context into an explainable diagnostic surface. Observability and the relevant owning capabilities remain the source of the underlying evidence.

Guided repair workflows can propose and sequence bounded actions, but they must preserve effect lineage:

`proposed → authorized → attempted → accepted → applied/effective → converged → validated`.

Repair UX must not treat “command returned 0”, provider acknowledgement, resource existence or a single healthy probe as universal proof of repair. Partial and unknown outcomes must remain visible until reconciled.

Destructive or authority-sensitive repair actions should require explicit current authorization and superior policy qualification. A convenient “fix all” flow cannot become an authority bypass.

## 8. Upgrade and maintenance workflows

Developer/Operator Experience owns upgrade/maintenance orchestration UX and preflight/postflight presentation, while Lifecycle owns revision/coexistence/migration semantics, Artifact/Release owns release eligibility and provenance, Deployment owns runtime actuation, and Data/Schema owns schema/data compatibility and migration state.

An operator-facing upgrade should surface the qualified transition vector, including applicable release, configuration, schema, trust, provider/support, runtime profile and recovery prerequisites. Historical upgrade success does not make a path currently eligible.

The experience may offer pause/resume/abort or rollback requests only where the underlying capabilities qualify those actions. “Rollback” in UX must not conflate release rollback eligibility, deployment rollback actuation, data-state recovery and configuration restoration.

## 9. Backup, restore and recovery runbooks

Developer/Operator Experience owns runbook structure, guidance, prerequisite checks, operator-facing progress and evidence presentation for backup/restore/recovery. It does not own backup identity, storage truth, recovery point/objective semantics, data consistency or recovery eligibility.

A completed backup workflow must not imply recoverability without qualified restore evidence. A completed restore command must not imply recovered service until the owning state/runtime/security capabilities validate consistency, compatibility, trust, readiness and effective service.

Runbooks must preserve current qualification and explicitly surface when recovery depends on external secrets, keys, trust anchors, provider APIs, schema versions, retained artifacts or identity systems.

## 10. Support bundles and evidence export

Developer/Operator Experience owns the portable support-bundle contract and export workflow: what classes of diagnostic evidence can be requested, how scope/time windows are expressed, how collection failures are reported, and how a bundle preserves lineage to producing revisions.

The bundle must not become a shadow source of truth. Exported logs, metrics, traces, configuration snapshots, provider reports and state summaries remain evidence with applicability/currentness/coverage metadata.

Privacy, authorization, secrets and governance owners constrain collection and disclosure. Redaction or minimization must be explicit and auditable enough that omission is not confused with absence. A support bundle may be `PARTIAL` or `INCONCLUSIVE`; UX must not silently label it complete.

## 11. Configuration and provider portability ergonomics

Developer/Operator Experience may provide mapping assistants, compatibility views, provider migration checklists, configuration conversion previews and unresolved-difference surfacing. Provider/Binding owns support qualification and binding semantics; Secrets/Configuration owns canonical references and values; Deployment owns runtime cutover/effectiveness.

Provider/runtime IDs remain realization identities unless explicitly adopted by a governed canonical transition. A migration wizard cannot canonize an external ID merely because it is necessary for import.

Portability ergonomics should surface semantic gaps rather than force false equivalence. Unsupported or only partially supported semantics remain explicit, and cutover remains incomplete while residual authoritative provider/runtime cohorts can still affect the system.

## 12. Safe administrative affordances

Administrative UX owns affordances such as preview, impact explanation, explicit scope display, confirmation, dry-run where truly supported, progress/effect disposition, safe retry guidance and escalation paths.

These affordances do not create authority. The authority chain remains `Enterprise → Station → Role → Person` and is monotonic. Station may expose/delegate only capabilities granted by Enterprise; Role/Person actions remain constrained by current grants, policy and relevant evidence.

An action button existing on a surface is never permission. Authentication never implies authorization. Lower scopes cannot weaken superior policy for operator convenience.

Ambiguous mutating administrative effects use `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN`; `UNKNOWN` requires reconcile-before-retry unless explicit idempotency qualification permits otherwise.

## 13. Capability boundaries

### Deployment / Environment / Runtime
Deployment owns desired/observed/effective runtime generations, rollout, placement, scaling, traffic, runtime retained closure, runtime/provider cutover and rollback actuation. Developer/Operator Experience owns the human-facing workflows and profile-selection ergonomics that invoke and explain those semantics.

### Build / Dependency Graph / Reproducibility
Build owns material/dependency closure, recipe/toolchain/runner identity and reproducibility evidence. Developer Experience exposes build/bootstrap diagnostics and guided workflows without redefining build truth.

### Artifact / Release / SBOM / Provenance
Artifact/Release owns immutable release identity, provenance/SBOM/signature evidence, promotion/distribution/admission and release rollback eligibility. Operator UX can display and request those transitions only within authority.

### Secrets / Configuration / Environment Portability
Secrets/Configuration owns reference/value separation, revisions, overlays, currentness and rotation/revocation. Operator Experience owns configuration editing/import/export ergonomics subject to those semantics and superior constraints.

### Provider / Binding / Capability Negotiation
Provider/Binding owns discovery, qualification, admission, support vectors, binding, coexistence/fallback and withdrawal. Operator Experience owns provider selection/mapping/migration ergonomics and explicit display of unresolved support differences.

### Observability / Operations / Incident
Observability owns telemetry/evidence semantics, freshness, coverage, SLI/SLO and incident/remediation evidence. Operator Experience composes these into diagnostics, triage, support bundles and guided repair.

### Security / Resilience / Failure Recovery
Security/Resilience owns posture, containment, recovery qualification and degraded-mode eligibility. Operator Experience owns safe runbooks and repair/recovery UX but cannot declare recovery safe or complete.

### Lifecycle / Versioning / Evolution / Migration
Lifecycle owns revision/coexistence/evolution/migration/withdrawal primitives. Developer/Operator Experience owns upgrade/migration workflow ergonomics over those primitives.

### Governance / Compliance / Audit
Governance owns obligations, control applicability, evidence qualification, exceptions and audit claims. Operator Experience exposes required controls/evidence and may guide remediation, but cannot create compliance truth or exceptions implicitly.

### Architecture Reconciliation
Architecture Reconciliation owns cross-capability consistency and later current-state/target-state disposition. Developer/Operator Experience may surface architectural diagnostics but does not become reconciliation authority.

### Universal Capability Architecture
UCA supplies typed identity, revision vectors, claims/evidence, effect dispositions, support vectors, currentness and residual-cohort primitives. It does not absorb operator/developer semantics.

## 14. Enterprise → Station → Role → Person, AGWS and AI

Operator/developer surfaces obey the same monotonic authority chain as every other capability. Enterprise may constrain available profiles, providers, maintenance windows, offline horizons, destructive operations, support exports and recovery actions. Station may expose/administer only delegated capabilities. Role/Person may act only within current authority.

Adaptive Governed Work Surfaces may personalize or compose operator experiences while remaining distinct from this capability's semantic ownership. AI may explain diagnostics, suggest commands, assemble support evidence, propose a migration plan or draft a repair sequence. Neither AI nor AGWS may:

- manufacture health, readiness, compliance, provenance, backup or recovery evidence;
- convert `INCONCLUSIVE` or `UNKNOWN` into success for convenience;
- extend offline/currentness horizons;
- bypass superior authority, privacy, trust, security or governance constraints;
- adopt provider/runtime IDs as canonical identity implicitly;
- retry ambiguous mutations without reconciliation or explicit idempotency qualification;
- convert a self-hosted profile into a weaker policy universe;
- amplify provider, runtime or administrative authority.

## 15. Non-goals

This capability does not own runtime desired state, build truth, release/provenance truth, configuration/secret truth, provider admission, telemetry truth, incident truth, security posture, recovery qualification, lifecycle compatibility, governance obligations, canonical architecture reconciliation or generic authorization. It does not mandate one CLI, UI, package manager, installer, container runtime, orchestrator, cloud, backup engine, observability stack or support transport.

Self-hosting is not defined as “everything runs on one machine”, “no external dependency exists” or “operator has unrestricted root authority”. It is a supported operational profile whose dependencies, authority, portability and evidence horizons are explicit.

## 16. Planning B repository-validation questions

Defer all answers to fresh-main archaeology in Planning B:

1. Does SB have an explicit Developer/Operator Experience semantic layer, or are operator workflows currently scattered across deployment/build/provider tooling?
2. Are bootstrap/install workflows revisioned and able to distinguish prerequisite evaluation, actuation, reconciliation, convergence and final readiness?
3. Are simple, self-hosted, mature and disconnected profiles represented explicitly with support/dependency/currentness vectors?
4. Does any current self-hosted path preserve the same canonical identities and policy semantics as other runtime realizations?
5. Can operator surfaces distinguish underlying owner truth from convenience status labels?
6. Are ambiguous administrative mutations represented as `UNKNOWN` and reconciled before retry?
7. Do diagnostics/support bundles retain evidence provenance, currentness, coverage and redaction/minimization state?
8. Are backup/restore runbooks separated from actual recovery qualification and validated recovered service?
9. Are upgrade workflows separated across release eligibility, deployment actuation, schema/data migration and recovery/rollback qualification?
10. Can disconnected/air-gapped operation declare retained closure and bounded evidence horizons rather than assume indefinite validity?
11. Are provider/configuration portability tools able to surface semantic support gaps instead of forcing one-to-one mappings?
12. Are provider/runtime IDs kept non-canonical through install/migration/import flows?
13. Are administrative affordances scoped by `Enterprise → Station → Role → Person` authority rather than UI availability?
14. Can AI/AGWS assist diagnostics and operations without gaining additional provider/runtime/admin authority or manufacturing evidence?

No answer is inferred in Planning A.

## 17. Planning A disposition

**PASS_FOR_CAPABILITY.** Developer / Operator Experience / Self-hosting has a distinct semantic owner and bounded relations to adjacent capabilities. Self-hosting is explicitly a supported operational profile over the same canonical semantics, while convenience remains subordinate to authority, trust, policy, evidence/currentness and recovery qualification. Research and synthesis inputs are sufficient for Planning A; no new finding or capability candidate is required. Planning B remains blocked until every canonical capability completes Planning A reconciliation.
