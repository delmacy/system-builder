# Generation 2 Research — Process & Application Modeling — Revisit 5 / Cycle 6

Status: RESEARCH_ELICITATION; cycle-6 pass complete; NOT SATURATED.

## Research question
Can the refined Universal Capability Architecture primitives survive adversarial process/application-modeling cases without collapsing semantic identity into file/provider identity, revision lineage into consistency, context into authority, or model portability into runtime realization? In particular: how should System Builder preserve typed identity and continuity across bundled/file-level revisions, brownfield imports, layered realizations, concurrent edits, migration and disconnected validation?

## Representatives and evidence/source ledger
| Representative | Coverage | Source of truth / adversarial contribution |
|---|---|---|
| Camunda 8 Web Modeler process applications + migration | DEEP | Current docs separate process-application bundle versions from independently versionable files/resources; editor/application versions, deployed definitions and running-instance migration remain different identities/lifecycles. Camunda 8.10 further decouples application and file-level version histories. Sources: https://docs.camunda.io/docs/components/modeler/web-modeler/process-applications/process-application-versioning/ ; https://docs.camunda.io/docs/next/reference/announcements-release-notes/8100/whats-new-in-810/ ; https://docs.camunda.io/docs/8.8/components/operate/userguide/process-instance-migration/ |
| Mendix Studio Pro version control / semantic merge | DEEP | Working copy, repository revision, merge result and deployability differ. Documentation explicitly warns that merge can introduce errors even when no merge conflict is reported; semantic validity therefore needs a post-merge validator distinct from VCS success. Source: https://docs.mendix.com/refguide10/version-control/ |
| Microsoft Dataverse solution layering / ALM | DEEP | Import/update success does not imply the incoming model is effective because a higher active/managed layer may remain authoritative at runtime. Source: https://learn.microsoft.com/en-us/troubleshoot/power-platform/dataverse/working-with-solutions/changes-not-effective-solution-import |
| ServiceNow scoped application development / delegated permissions | DEEP | Source-control capability and application-development/deployment actions are permission-faceted; delegated developers can receive selected application actions without full admin authority. Sources: https://www.servicenow.com/docs/r/application-development/manage-app-development.html ; https://www.servicenow.com/docs/r/application-development/delegated-development-and-deployment/developer-permissions.html |
| OMG BPMN 2.0.x semantic model family | DEEP historical cross-check | Portable process semantics are distinct from concrete execution/provider realization; provider extensions must remain explicitly qualified instead of being silently universalized. Source: https://www.omg.org/bpmn/ |

## Source of truth, typed identity and continuity
Process/Application Modeling owns canonical business/application semantic identity, not file identity, XML identity, provider deployment IDs or execution-instance IDs. Cycle-6 adversarial evidence requires explicit typed identities such as `CanonicalApplicationIdentity`, `CanonicalModelUnitIdentity`, `SemanticRevisionIdentity`, `RepresentationIdentity`, `ImportedSourceIdentity`, `RealizationIdentity`, `ProviderDefinitionIdentity` and `ExecutionInstanceIdentity`.

Identity continuity is therefore per kind. A process application may preserve canonical semantic identity while a file is renamed, a provider definition ID changes, a deployment is replaced or a running instance migrates. Conversely, two files with stable paths/digests do not prove semantic identity if ownership or meaning changed. Mapping between identity kinds requires explicit lineage/evidence.

Camunda's current model is particularly useful: process-application bundle versioning and file-level version history can evolve independently. This falsifies any universal rule that one repository/application revision is the only canonical revision axis.

## Lifecycle, revision vectors and semantic consistency
Required lifecycle remains `draft/observed → proposed → validated candidate → authorized canonical revision → realization attempt → accepted/applied realization → effective realization → semantic postcondition validation`.

A process/application revision vector can include `application_semantic_revision`, `model_unit_revision_set`, `schema/contract_revision_set`, `binding/provider_revision`, `validation_profile_revision` and, where execution exists, `runtime_definition_revision` / `instance_migration_revision`.

Revision lineage does not itself guarantee consistency. Mendix demonstrates that a merge may have no reported merge conflict and still produce model errors that prevent deployment. Therefore `MERGED` is not `SEMANTICALLY_VALID`; conflict detection and semantic conformance are separate proof classes.

## Brownfield identity and normalization authority
Import/discovery must preserve source-native identity and representation before semantic interpretation. Brownfield normalization should be a typed mapping from `ImportedSourceIdentity@sourceRevision` to a candidate canonical semantic graph, recording unmapped/approximated/provider-only constructs.

The normalization operation is authority-bearing. Observe/import authority may preserve and classify legacy semantics but cannot publish them as canonical desired state. Dataverse layering further proves that incoming/imported revision and effective realization can diverge after technically successful transport.

## Concurrent edits, ownership and expected-base semantics
Concurrent mutation is governed by semantic ownership/preconditions, not only repository revision. `expected_base_semantic_revision + owned semantic units/fields + dependency revisions` are required for deterministic mutation admission.

A syntactically conflict-free textual/model merge can still violate cross-unit invariants. Post-merge semantic validation must therefore evaluate the resulting whole/cumulative context. Conflict-free VCS evidence cannot substitute for domain/model conformance evidence.

## Cumulative context is provenance, not authority
Composed process/application models may accumulate typed facts: prior step outputs, declared variables, schema references, role/context requirements and provider-neutral capability references. Each contribution needs provenance, scope and revision.

Propagated/derived context is non-authoritative by default. A downstream node receiving `customerRisk=high`, `Station=X` or a provider result does not gain authority to mutate canonical models, schemas, policies or bindings. Authorization remains separately resolved at actuation time.

## Composite proof compatibility
A model proof is valid only when its required evidence can be joined coherently. A validator result against model revision A, schema S1 and provider contract P1 cannot prove revision B/S2/P2 merely because each evidence item independently exists.

Process/application conformance therefore needs an evidence-compatibility join over semantic revision, dependency/schema revisions, validation profile, provider/binding realization, trust/policy epochs, scope and freshness. Incompatible required evidence yields `INCONCLUSIVE`, not PASS.

## Portability layers and provider boundaries
Portability is layered:
1. `PRESERVE` — bytes/model graph/source provenance can be exported/imported without loss claim.
2. `INTERPRET` — semantic vocabulary can be understood.
3. `VALIDATE` — constraints/invariants can be checked under a declared profile.
4. `REALIZE` — a provider/runtime can materialize the semantic intent.
5. `ACTUATE` — the caller has authority and dependencies to operate/deploy/migrate it.

A provider may support lower layers without higher ones. BPMN parsing does not imply executable support; import success does not imply effective runtime behavior; runtime support does not grant deployment authority.

## Failure semantics
Material failures: identity-kind mismatch; ambiguous continuity mapping; stale expected base; conflict-free merge with semantic error; partial brownfield interpretation; missing extension/template/schema; incompatible proof revisions; provider realization divergence; migration accepted but semantic postcondition invalid; stale policy/trust horizon; disconnected closure missing required validator/reference; and acknowledgement with effective outcome unknown.

Required states include `PARTIAL`, `INCONCLUSIVE`, `CONFLICT`, `OUTCOME_UNKNOWN`, `REALIZATION_DIVERGED` and `VALIDATION_FAILED`; none may be collapsed into generic failure/success where semantic disposition differs.

## Governance, observability, extensibility and lock-in
Authority remains faceted: observe/import, interpret, normalize/adopt, edit/merge, validate, publish canonical revision, bind/providerize, materialize/deploy, migrate and operate. ServiceNow's delegated permission model is corroborating product evidence that application actions can be independently delegated.

Extensions/providers must identify which semantic constructs are universal, extension-owned or provider-only. Unknown extensions remain explicit. Observability must report which semantic revision and realization revision are effective, which validation profile qualified them and which dependencies were unavailable.

Lock-in risk is highest when provider file IDs, solution layers, proprietary templates/extensions or deployment IDs become canonical business identity. The universal layer should preserve typed mappings instead.

## Qualified local/offline closure and reconnection
A local modeling closure is profile-qualified and includes required semantic vocabularies, schemas/contracts, extension metadata, validators, authority/policy snapshot, trust material and source/provenance sufficient for permitted local actions. Its proof has a `trust/evidence horizon`.

On reconnection, if canonical semantic revisions, policies, trust roots, provider contracts or dependent schemas advanced outside that horizon, locally produced candidates remain evidence/proposals until requalified. Offline capability never broadens authority.

## Adaptive Governed Work Surfaces boundary
AGWS remains a distinct active capability. `Enterprise → Station → Role → Person` determines which canonical model capabilities a surface may expose and which specialization intents may be proposed. A Person/Role surface can compose admitted list/form/grid/action projections but cannot create canonical entities, fields, process rules or provider bindings merely because the AI can generate them.

AI is the sole AGWS materializer under the hypothesis, but a request requiring canonical domain/process change must become a typed Process/Application Modeling proposal and cross the appropriate semantic-model authority/validation gate. Station movement or Role change triggers revalidation of dependent projections rather than identity transfer or authority amplification.

## Product-specific mechanisms vs universal primitives
Do not universalize Camunda application/file version mechanics, Mendix merge implementation, Dataverse solution layers, ServiceNow source-control transport, or BPMN extension syntax.

Universal primitives strengthened in this pass: typed model identity mappings; multi-axis semantic revision vectors; conflict-detection-vs-semantic-validation separation; evidence-compatibility joins; layered portability claims; trust/evidence-horizon local closure; context-as-provenance-not-authority; and explicit domain-change escalation from AGWS.

## System Builder comparison — evidence boundary
A bounded fresh-main code search for `ProcessApplication model revision canonical semantic migration SystemDefinition` returned no matches in this run. This is not evidence of repository-wide absence. Full implementation archaeology remains owned by PLANNING_B; no product code or current-milestone docs were modified.

## Reconciliation hypotheses
- KEEP/HARDEN deterministic semantic model identities where later fresh-main archaeology proves them.
- GENERALIZE typed identity mappings instead of one identity invariant across semantic/file/provider/runtime kinds.
- GENERALIZE semantic revision vectors and evidence-compatibility joins.
- GENERALIZE conflict-detection vs semantic-validation separation and expected-base semantic ownership.
- GENERALIZE layered portability `PRESERVE → INTERPRET → VALIDATE → REALIZE → ACTUATE` as capability claims.
- PROVIDERIZE concrete import/export, proprietary extension, merge, deployment and migration mechanics.
- INTEGRATE brownfield through provenance-preserving mappings and explicit normalization authority.
- REPLACE any path where imported/provider/file identity silently becomes canonical semantic identity or where propagated context confers authority.
- DEFER exact canonical IR/merge algorithm to synthesis/reconciliation.
- DO_NOT_BUILD Workflow/Data runtime semantics inside Process & Application Modeling.

## Repo-validation questions
1. Which existing SB IDs are semantic-owner-defined versus file/provider/runtime-derived?
2. Can one canonical application/model identity map to multiple representation/provider identities with explicit continuity lineage?
3. Can SB represent application revision and constituent model-unit revisions independently?
4. Is merge/conflict evidence distinct from semantic validation evidence?
5. Are stale expected-base and semantic ownership checked before AI/user model mutation?
6. Can brownfield import preserve unmapped/provider-specific constructs and source identity before normalization?
7. Can proof composition reject incompatible schema/provider/trust/revision evidence as INCONCLUSIVE?
8. Are context propagation and actuation authority independently resolved?
9. Can portability be claimed separately at preserve/interpret/validate/realize/actuate layers?
10. Does offline modeling retain a trust/evidence horizon and requalify after reconnection?
11. Does AGWS escalate canonical domain/process changes into this capability instead of silently materializing them?

## Symbiotic Proof / explicit architecture proof backfill
1. **Typed-identity continuity:** rename/move a representation and replace its provider definition while preserving semantic meaning; canonical identity remains stable and mappings change with lineage.
2. **Identity mismatch negative proof:** reuse a file/provider identifier for semantically different content/ownership; continuity must be denied or require explicit authorized remapping.
3. **Conflict-free semantic-invalid merge:** merge two branches without a VCS/model conflict but produce an invalid cross-model reference/invariant; merge may succeed while semantic validation fails.
4. **Evidence compatibility join:** combine validator PASS for model A/schema S1 with provider realization evidence for model B/schema S2; composite result must be INCONCLUSIVE rather than PASS.
5. **Brownfield normalization authority:** import provider-specific legacy semantics under observe-only authority; source evidence is retained but canonical desired model cannot change.
6. **Context non-authority:** propagate typed context from an upstream modeled operation containing Station/role/provider facts; downstream canonical mutation remains denied unless independently authorized.
7. **Portability layering:** demonstrate a model that can be preserved/interpreted/validated locally but cannot be realized by provider Q; report layered support instead of generic compatible=true.
8. **Qualified-local horizon:** validate a candidate offline, advance schema/trust/policy while disconnected, reconnect and require requalification before publish/actuation.
9. **Runtime/migration separation:** accept migration to provider definition B but violate a declared semantic postcondition; provider acceptance cannot become semantic VALIDATED.
10. **AGWS escalation:** ask a Person-level work surface to invent a canonical field/process rule. AI may produce a proposal, but canonical mutation is denied/escalated and surface lineage remains reversible.

## Stable findings
`G2-FINDING-PAM-01..36` remain authoritative.

- **G2-FINDING-PAM-37 — Process/Application Identity Continuity Is Typed Across Semantic, Representation, Provider and Execution Kinds.** Stable file/provider IDs cannot define canonical semantic identity; continuity mappings need explicit lineage.
- **G2-FINDING-PAM-38 — Application Revision Is a Vector, Not Necessarily One Bundle Version.** Application semantics, constituent model units, schemas/contracts, bindings and runtime definitions may version independently.
- **G2-FINDING-PAM-39 — Conflict-Free Merge Does Not Prove Semantic Validity.** Merge/conflict detection and whole-model semantic validation are independent evidence classes.
- **G2-FINDING-PAM-40 — Process/Application Composite Proof Requires Revision-Compatible Evidence Joins.** Individually valid model/schema/provider/trust evidence that cannot describe one coherent subject/snapshot must yield INCONCLUSIVE.
- **G2-FINDING-PAM-41 — Propagated Modeling Context Is Provenance, Not Canonical Mutation or Actuation Authority.** Typed cumulative context may inform downstream modeling but never silently confers authority.
- **G2-FINDING-PAM-42 — Process/Application Portability Must Be Layered Across Preserve, Interpret, Validate, Realize and Actuate.** Lower-layer support cannot be promoted into generic execution compatibility.
- **G2-FINDING-PAM-43 — Qualified Local Modeling Closure Has a Trust/Evidence Horizon.** Offline validity is profile/epoch-qualified and requires reconnection requalification when relevant dependencies advance.
- **G2-FINDING-PAM-44 — AGWS Domain-Change Escalation Is a Cross-Capability Boundary, Not a UI Convenience Rule.** Personal/Role/Station surface intent that changes canonical model semantics must enter Process/Application Modeling authority and validation lineage.

## Candidate discoveries
- `G2-CAPABILITY-CANDIDATE-PAM-TYPED-SEMANTIC-REPRESENTATION-PROVIDER-IDENTITY-MAPPING` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE; reconcile with UCA typed-identity continuity.
- `G2-CAPABILITY-CANDIDATE-PAM-MULTI-AXIS-SEMANTIC-REVISION-VECTOR` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE; reconcile with Lifecycle revision vectors without transferring domain consistency ownership.
- `G2-CAPABILITY-CANDIDATE-PAM-SEMANTIC-VALIDATION-AFTER-CONFLICT-FREE-MERGE` — CORE_SUBCAPABILITY / PENDING_SYNTHESIS; retain inside Process & Application Modeling unless evidence shows wider ownership.
- `G2-CAPABILITY-CANDIDATE-PAM-COMPOSITE-MODEL-PROOF-COMPATIBILITY-JOIN` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE; merge with UCA evidence-compatibility composite-proof join.

No candidate is promoted in this pass. Adaptive Governed Work Surfaces remains distinct.

## Value / risk / priority / next question
Value critical; risk high because file/repository/provider success can masquerade as canonical semantic continuity or validity. Eight material findings reset `consecutive_no_material_finding=0`; Process & Application Modeling remains NOT SATURATED. Next rotation must follow the authoritative state after persistence: UI / Generated Experience / Low-code Builder — revisit 5 / cycle 6.