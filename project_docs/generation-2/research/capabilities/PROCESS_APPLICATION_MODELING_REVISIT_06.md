# Generation 2 Research — Process & Application Modeling — Revisit 6 / Cycle 7

Status: RESEARCH_ELICITATION; cycle-7 pass complete; NOT SATURATED.

## Research question
Using research-by-exception, do the cycle-7 Universal Capability Architecture findings materially change Process & Application Modeling when semantic claims have bounded applicability, evidence can age or disappear independently of claim validity, stability is mixed across surfaces, and migrations may require dual representation? What must SB prove so canonical process/application meaning does not collapse into file identity, import success, provider realization, content integrity, or generic UI/AI authority?

## Representatives and evidence/source ledger
| Representative | Coverage | Source of truth / adversarial contribution |
|---|---|---|
| Camunda 8 Web Modeler process applications + process-definition migration | DEEP | Process-application snapshots, file-level versions, template versions, deployed definitions and running-instance identity evolve on different axes. Current 8.10 material explicitly introduces independently controlled file-level and application versioning; instance migration preserves instance identity/history while definition semantics may change. Sources: https://docs.camunda.io/docs/next/reference/announcements-release-notes/8100/whats-new-in-810/ ; https://docs.camunda.io/docs/components/modeler/web-modeler/process-applications/process-application-versioning/ ; https://docs.camunda.io/docs/components/best-practices/operations/versioning-process-definitions/ |
| Mendix Studio Pro version control / merge | DEEP | A merge can be conflict-free yet introduce model inconsistencies that prevent deployment, proving repository/VCS success is not executable semantic conformance. Source: https://docs.mendix.com/refguide10/version-control/ |
| Microsoft Dataverse solution layering / ALM | DEEP | Imported component values can remain non-effective because an active or managed layer above them stays authoritative at runtime; transport acceptance and effective model realization are different claims. Source: https://learn.microsoft.com/en-us/troubleshoot/power-platform/dataverse/working-with-solutions/changes-not-effective-solution-import |
| ServiceNow delegated application development | DEEP | Development, source-control and deployment permissions are application-scoped/faceted; selected actions can be delegated without system-admin authority. Sources: https://www.servicenow.com/docs/r/application-development/manage-app-development.html ; https://www.servicenow.com/docs/r/application-development/delegated-development-and-deployment/developer-permissions.html ; https://www.servicenow.com/docs/r/application-development/delegated-development-and-deployment/delegated-dev-source-control.html |
| OMG BPMN 2.0.x semantic model family | DEEP historical cross-check | Standard semantic vocabulary is separable from provider-specific extensions/execution support; portable representation does not prove a given runtime realization. Source: https://www.omg.org/bpmn/ |

## Research-by-exception delta from cycle 6
Cycle 6 already established typed semantic/representation/provider/execution identities, multi-axis revisions, semantic validation after conflict-free merge, composite proof joins, layered portability, offline evidence horizons and AGWS domain-change escalation. Cycle 7 therefore does not repeat those conclusions. It stress-tests only the new UCA obligations: applicability-scoped claims, evidence-retention independence, relational conformance, mixed stability/support, dual representation, narrow integrity claims, append/supersede history and constraint compatibility without authority transfer.

## Source of truth and applicability-scoped semantic claims
Process & Application Modeling owns canonical semantic claims such as `Process P@semanticRevision R declares task T`, `Application A contains model unit M`, or `Model revision R is approved for Station scope S`. It does not own provider runtime state, deployment acceptance, file storage truth or operator observation.

A model claim therefore needs `claim_kind + semantic_subject + semantic_revision + applicability_scope + authority_owner + effective_interval/condition`. Applicability may differ by Enterprise, Station, runtime profile, consumer population or migration cohort. One global `current model` flag is unsafe when old and new semantics coexist intentionally.

Dataverse layering is a concrete negative proof: an incoming solution value may exist and be valid as an imported claim while a higher effective layer governs runtime behavior. Camunda similarly separates process-application/file version history from deployed/running definitions. The universal architecture must link these claims without collapsing them into one source of truth.

## Evidence availability and retention horizon
Claim applicability and evidence availability are independent. A canonical revision can remain historically applicable to a completed execution even when a modeler/provider no longer retains every intermediate comparison artifact, editor snapshot or validation log. Conversely, fresh evidence can exist for a claim no longer applicable to the current runtime cohort.

Required proof metadata includes `evidence_revision`, `collected_at`, `retention_class`, `available_until/retention_horizon`, `replayability`, `subject_revision`, `validation_profile` and provenance. If evidence needed to replay a historical proof has expired, disposition is `EVIDENCE_UNAVAILABLE` / `INCONCLUSIVE_FOR_REPLAY`, not retroactive `INVALID`.

Qualified local/offline modeling closure inherits the same rule: local evidence may remain usable only within its declared horizon. Reconnection may require re-observation/revalidation without rewriting the historical local decision.

## Relational executable semantic conformance
`VALID` is not an intrinsic model boolean. A conformance statement is a relation:
`Conformance(subject_revision, normative_profile_revision, evaluator_revision, dependency_revision_set, provider/binding_profile?, scope, evidence) -> result`.

Mendix supplies the adversarial example: merge success and absence of merge conflicts do not imply deployable semantic consistency. BPMN syntax/profile validity similarly cannot prove provider execution support. Therefore SB should distinguish at least structural validity, semantic invariant validity, dependency/reference validity, provider-profile realizability and runtime/postcondition validation.

Contradictory credible evaluations remain provenance-bearing. They yield `CONTRADICTED` or `INCONCLUSIVE` pending scope/profile reconciliation rather than last-writer-wins.

## Mixed stability and support vector
A process/application release can contain elements with different stability and support states: standardized BPMN constructs, vendor extensions, experimental connector/template capabilities, stable canonical domain constructs, deprecated fields, and provider-limited realization mappings.

Support therefore attaches to typed semantic surfaces/components and profiles, not to the application as a scalar. A useful vector is `semantic_surface -> {stability, support_level, provider_profile, deprecation_state, evidence_revision}`. Camunda's independently evolving application, individual-file and element-template histories reinforce why a single release version cannot carry all compatibility meaning.

Unknown/provider-only extensions remain explicit and must not silently inherit the stability of the surrounding model.

## Semantic continuity, dual representation and consumer populations
Evolution may require old and new semantic representations to coexist. A renamed/split field, changed process message, revised task contract or new canonical model unit may need a compatibility interval where producers/consumers, running instances or Stations remain on different semantic revisions.

Continuity proof therefore may require `old_representation + new_representation + translation/mapping lineage + consumer population/cohort + drainage evidence`. The new representation cannot become exclusively applicable merely because migration tooling accepted it. Camunda's running-instance migration and Dataverse effective-layer behavior show different mechanisms but the same universal need: distinguish intended new semantics from the population actually realizing them.

When consumer/drainage evidence is incomplete, retirement of the old representation is `INCONCLUSIVE`, not complete.

## Content integrity is narrower than semantic validity
A digest, immutable repository revision or provider resource identifier can prove byte/content identity within its algorithm/scope. It does not prove semantic interpretation, dependency closure, authority, provider admission, effective realization or runtime correctness.

Accordingly, `RepresentationDigestMatches` is admissible evidence for representation identity only. It cannot satisfy `CanonicalSemanticRevisionAuthorized`, `ProviderRealizationEffective` or `RuntimePostconditionValid` without additional evidence.

## Historical decision lineage: append and supersede
Canonical modeling decisions, imports, findings and approvals should be append-only historical records with explicit `supersedes`, `replaces-applicability-of`, `derived-from` or `withdraws` links. Editing a model's current applicability must not rewrite why an older revision was accepted or which evidence supported it.

This is particularly important for brownfield normalization: a later improved mapping can supersede the applicability of an earlier interpretation while preserving the imported source identity and historical normalization evidence.

## Constraint compatibility does not transfer authority
Two independently owned constraints may unify without conflict—for example domain schema constraints plus process-model rules, or Enterprise invariants plus Station-local specialization. Compatibility only proves the combined candidate is not contradictory under the evaluated profile. It does not grant one owner authority to publish the other's canonical constraint.

ServiceNow's application-scoped delegated permissions provide product evidence for faceted action authority. In SB, authority remains separately resolved for observe/import, normalize, edit, validate, publish canonical semantics, bind/providerize, deploy/migrate and operate.

## Failure semantics
Material states include `PARTIAL`, `CONFLICT`, `CONTRADICTED`, `INCONCLUSIVE`, `EVIDENCE_UNAVAILABLE`, `STALE`, `OUTCOME_UNKNOWN`, `REALIZATION_DIVERGED`, `VALIDATION_FAILED`, `CONSUMER_DRAIN_INCOMPLETE` and `APPLICABILITY_SUPERSEDED`.

Transport/import/merge/content-integrity success must never erase these semantic states. Attempted → accepted → effective → validated remains explicit for canonical model changes and provider/runtime realizations.

## Extensibility, provider boundaries, observability, portability and lock-in
Extensions identify semantic owner, stability/support state, provider scope and fallback/unknown semantics. Provider substitution changes realization mapping/evidence, not canonical semantic identity. Observability should expose which semantic claims are applicable to which Station/cohort, which provider realization is effective, what conformance profile was evaluated and whether evidence is unavailable/stale/contradictory.

Portability remains layered `PRESERVE → INTERPRET → VALIDATE → REALIZE → ACTUATE`; cycle 7 adds that every claim at each layer is applicability- and profile-scoped. Lock-in is highest when provider extensions, solution layers, file IDs or deployment IDs become canonical semantic owner rather than mapped realization evidence.

## Adaptive Governed Work Surfaces boundary
Adaptive Governed Work Surfaces remains a distinct promoted capability with `Enterprise → Station → Role → Person`. A surface may expose or specialize only the model claims applicable to its authority/profile; compatible local constraints do not transfer canonical domain ownership.

AI remains the sole AGWS materializer under the standing hypothesis, but AI/user intent that invents or changes canonical entities, fields, process rules, applicability or migration mappings becomes a typed Process/Application Modeling proposal. Materialization authority never implies semantic publication, provider-admin or migration authority.

## Product-specific mechanism versus universal primitive
Do not universalize Camunda bundle/file/template version mechanics, Mendix Git merge behavior, Dataverse solution layers, ServiceNow delegated-development menus or BPMN extension syntax.

Universal primitives strengthened here are: applicability-scoped semantic claims; evidence-retention horizons independent of applicability; revision-qualified relational conformance; typed mixed stability/support vectors; dual-representation continuity with consumer-population evidence; narrow content-integrity claims; append/supersede historical lineage; and constraint compatibility without authority transfer.

## System Builder comparison — evidence boundary
No product implementation archaeology is performed in this research worker. Existing cycle-6 bounded search remains only a question generator, not proof of repository-wide absence. Fresh-main implementation reconciliation remains owned by PLANNING_B. No product code, Work Package, TASK or Construction artifact is touched.

## Reconciliation hypotheses
- KEEP/HARDEN semantic-owner-defined identities and deterministic revision lineage where later repository evidence proves them.
- GENERALIZE applicability-scoped semantic claim records and revision-qualified relational conformance.
- GENERALIZE evidence-retention/availability horizons independently from claim applicability/freshness.
- GENERALIZE typed surface stability/support vectors rather than application-wide stability flags.
- GENERALIZE dual-representation continuity plus consumer/cohort drainage evidence for staged semantic evolution.
- PROVIDERIZE concrete import/export, proprietary extension, compilation/deployment and migration mechanics.
- INTEGRATE brownfield/provider evidence through append/supersede provenance mappings.
- REPLACE any path where digest/import/merge/provider success becomes semantic validity or canonical authority.
- DEFER exact canonical IR, translation and consumer-drain algorithm until synthesis/reconciliation.
- DO_NOT_BUILD a universal translation engine or Workflow/Data runtime inside this capability.

## Repo-validation questions
1. Can SB represent model claims with explicit applicability scope/condition instead of one global current revision?
2. Are model evidence retention/availability and semantic claim applicability separate fields/lifecycles?
3. Is conformance represented as a relation to evaluator/profile/dependency revisions rather than `valid=true` on an artifact?
4. Can one application carry mixed stability/support states for standard, extension, provider-only and deprecated semantic surfaces?
5. Can old/new semantic representations coexist with explicit cohort/consumer drainage evidence before retirement?
6. Are representation digests prevented from satisfying canonical semantic authorization or runtime validity proofs?
7. Are canonical modeling decisions append/supersede rather than mutable historical overwrite?
8. Can compatible constraints from Enterprise/Station/domain/process owners compose without transferring publish authority?
9. Are import/merge/deploy/migrate transitions recorded as attempted/accepted/effective/validated with `OUTCOME_UNKNOWN` where necessary?
10. Can provider substitution preserve canonical semantic identity while changing realization evidence and applicability?
11. Does AGWS escalate canonical semantic/applicability/migration change rather than silently materializing it?

## Symbiotic Proof / architecture proof backfill
1. **Applicability split:** authorize semantic revision R2 only for Station B while Station A remains on R1; product truth must represent both without global-current collapse.
2. **Evidence-retention negative proof:** expire detailed validation evidence for historical R1 while retaining its accepted historical claim; replay becomes evidence-unavailable, not retroactively invalid.
3. **Relational conformance:** evaluate the same representation against profiles P1/P2 and providers Q1/Q2; results remain separately scoped rather than overwriting one artifact boolean.
4. **Mixed stability:** place stable standard constructs and experimental provider extension in one app; support reporting must preserve the mixed vector.
5. **Dual representation:** migrate a semantic field/process contract with old/new encodings while one consumer cohort remains old; old representation cannot retire until drainage/translation proof closes.
6. **Integrity narrowness:** verify identical digest for an imported representation whose dependency/profile is unsupported; integrity PASS cannot become semantic/provider PASS.
7. **Append/supersede:** supersede a brownfield normalization mapping; earlier source evidence and decision remain queryable with historical applicability.
8. **Constraint-authority separation:** compose compatible Enterprise invariant and Station specialization; Station cannot publish/relax Enterprise constraint despite successful unification.
9. **Provider substitution:** move realization from provider Q1 to Q2; canonical semantic identity remains while realization/conformance evidence changes and is revalidated.
10. **AGWS escalation:** Person-level intent requests a canonical process applicability/migration change; AI may propose but must escalate to model authority and preserve reversible surface lineage.

## Stable findings
`G2-FINDING-PAM-01..44` remain authoritative.

- **G2-FINDING-PAM-45 — Canonical Model Truth Is a Typed Applicability-Scoped Semantic Claim Set, Not One Global Current Revision.** Semantic claims can be simultaneously valid for different Stations, cohorts or runtime profiles; representation/provider truth remains separately owned.
- **G2-FINDING-PAM-46 — Model Claim Applicability and Model Evidence Availability/Retention Are Independent.** Expired or compacted proof material makes replay unavailable or inconclusive; it does not retroactively falsify the historical canonical claim.
- **G2-FINDING-PAM-47 — Process/Application Conformance Is a Revision-Qualified Relation.** Subject, normative profile, evaluator, dependency revisions, scope/provider profile and evidence determine a result; merge/import/content identity cannot supply a universal `valid` boolean.
- **G2-FINDING-PAM-48 — Process/Application Stability and Support Are Typed Semantic-Surface Vectors.** Standard constructs, extensions, templates and provider realizations can have independent stability/support and version streams inside one application.
- **G2-FINDING-PAM-49 — Semantic Continuity May Require Dual Representation Plus Consumer/Cohort Drainage Evidence.** New semantics cannot exclusively supersede old representation while affected consumers/running realizations remain unqualified or undrained.
- **G2-FINDING-PAM-50 — Representation Content Integrity Is Narrower Than Semantic Validity, Applicability and Authority.** Digest/immutable revision evidence proves representation identity only within scope; it cannot prove canonical authorization, provider suitability or runtime postconditions.
- **G2-FINDING-PAM-51 — Canonical Modeling History Is Append-and-Supersede While Applicability Evolves.** New mappings/decisions change applicability through explicit lineage without rewriting imported evidence, prior findings or accepted historical revisions.
- **G2-FINDING-PAM-52 — Constraint Compatibility Does Not Transfer Canonical Modeling Authority.** Compatible Enterprise, Station, domain, schema and process constraints may compose, but publication/relaxation authority remains independently governed and non-amplifying.

## Candidate discoveries
- `G2-CAPABILITY-CANDIDATE-PAM-APPLICABILITY-SCOPED-SEMANTIC-CLAIM` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE; reconcile with UCA typed claim graph while preserving Process/Application semantic ownership.
- `G2-CAPABILITY-CANDIDATE-PAM-MODEL-EVIDENCE-RETENTION-REPLAY-HORIZON` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE; reconcile with UCA evidence horizon and Governance/Observability retention semantics.
- `G2-CAPABILITY-CANDIDATE-PAM-MIXED-SEMANTIC-SURFACE-STABILITY-SUPPORT` — CORE_SUBCAPABILITY / PENDING_SYNTHESIS; preserve model/extension support semantics and reconcile universal vector primitives.
- `G2-CAPABILITY-CANDIDATE-PAM-DUAL-REPRESENTATION-CONSUMER-DRAINAGE-CLOSURE` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE; reconcile with Lifecycle/Standards/Data consumer-population migration while retaining model semantic continuity ownership.

No candidate is promoted in this pass. Adaptive Governed Work Surfaces remains promoted and distinct.

## Value / risk / priority / next question
Value critical; risk high because global-current flags, expired evidence, scalar stability, digest success or migration acceptance can masquerade as semantic truth. Eight material findings reset `consecutive_no_material_finding=0`; Process & Application Modeling remains NOT SATURATED. Next authoritative rotation after persistence should be UI / Generated Experience / Low-code Builder — revisit 6 / cycle 7, unless optimistic-concurrency revalidation selects a newer state.