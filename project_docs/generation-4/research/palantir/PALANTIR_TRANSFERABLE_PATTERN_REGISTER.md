# Palantir Transferable Pattern Register

Date: 2026-09-23
Status: `RESEARCH_ACTIVE / DEFERRED_IMPROVEMENT_SOURCE`

| ID | Public mechanism | Universal primitive | SB disposition | Main caution / proof obligation |
|---|---|---|---|---|
| PT-01 | Apollo outbound Agent + environment certificate | enrolled executor with outbound authenticated channel | `ADOPT PRINCIPLE` | revocation, rotation, compromise, least privilege, attestation |
| PT-02 | Apollo Plan + Constraints | explicit change proposal + admission conditions | `ADOPT PRINCIPLE` | bind plan to revisions/floors/currentness; no stale execution |
| PT-03 | Reported State | observation distinct from intent | `ALREADY COVERED` | freshness/evidence; reported != effective |
| PT-04 | Connected/Intermittent/Relayed modes | expected connectivity is modeled separately from health | `ADOPT PRINCIPLE` | stale view must remain visibly stale |
| PT-05 | failure suppression windows | bounded mutation after failures | `ADAPT` | suppression != reconciliation; human authority precedence |
| PT-06 | release channels + ramped rollout + recall | staged fleet promotion and blast-radius control | `ADAPT` | health != semantic admissibility; cohort evidence |
| PT-07 | Ontology data+logic+action+security | operational semantic substrate | `ADAPT` | do not collapse BusinessRecipe/SystemDefinition/runtime truth |
| PT-08 | Ontology Interfaces | polymorphic semantic contract/mapping | `ADAPT` | shape != full behavior/permission/effect equivalence |
| PT-09 | interface breaking-change guidance | explicit contract version coexistence | `ALREADY COVERED` | migration of in-flight obligations and old consumers |
| PT-10 | OSDK generated bindings | typed generated semantic client | `ADAPT` | stable identity/revision; avoid mutable API-name authority |
| PT-11 | documented API-name install conflicts | identity/remapping failure case | `AVOID` | semantic ID != API/display/provider name |
| PT-12 | SuperRepo | co-versioned semantic model + functions + UI | `ADAPT` | keep Recipe/Definition/generated artifacts distinct |
| PT-13 | Marketplace dependency graph/inputs | typed install closure and dependency graph | `ADOPT PRINCIPLE` | ownership/lifecycle of external referenced dependencies |
| PT-14 | Global Branching | cross-resource isolated system change | `ADAPT` | partial feature support must be explicit; no fake atomicity |
| PT-15 | AIP user/project execution scope | inference principal != execution principal | `ADOPT PRINCIPLE` | project service authority may exceed user authority |
| PT-16 | AIP Evals | probabilistic qualification evidence | `ADAPT` | scalar eval score cannot hide critical safety failures |
| PT-17 | Pilot resource edit locks | bounded AI mutation authority | `ADOPT PRINCIPLE` | lock/allow state itself needs authority/currentness |
| PT-18 | Data Connection Agent | separate private connectivity/worker role | `OPEN QUESTION` | decide whether SB Host Agent splits tunnel/connectivity from executor |
| PT-19 | webhook/writeback/side effects | external effect distinct from local state mutation | `ALREADY COVERED` | UNKNOWN/reconciliation/effect identity |
| PT-20 | Foundry-as-backend OSDK | platform-backed application model | `AVOID AS CLIENT-RUNTIME DEFAULT` | violates SB runtime-autonomy goal if adopted literally |

## Sequencing rule

All entries in this register are research findings. For implementation sequencing, they are treated as `DEFERRED_IMPROVEMENT` until the Station visual/application milestone is materially established and a later Planning & Materialization gate explicitly promotes selected items. Research classification such as `ADOPT PRINCIPLE` or `ADAPT` means architectural relevance, not immediate execution priority.

See `PALANTIR_DEFERRED_IMPROVEMENT_BACKLOG.md`.

## Highest-value architecture questions generated

1. Should SB split **Host Execution Agent** and **Connectivity/Tunnel Agent** roles, or expose them as independently grantable capabilities in one daemon?
2. What immutable identities/revisions must an SB ChangePlan pin before a disconnected Agent may execute it?
3. What is the minimum Agent enrollment protocol: host identity, Core identity, certificate rotation, revocation, re-enrollment, recovery and clone detection?
4. How should a Release promotion gate combine operational health with semantic compatibility, authority/security floors and evidence currentness?
5. Can the SB Compiler generate typed SDKs without making generated code depend on Builder APIs at runtime?
6. What is the explicit **portability proof suite** for Recipe, SystemDefinition, source, artifact, data, runtime and operations?
7. How are partial external effects represented when provider success and canonical commit/observation disagree?
8. How does cross-resource branching handle Recipe/SystemDefinition/schema/UI/workflow revisions without pretending they are one atomic transaction?

## Saturation

Not saturated. First pass established high-confidence public patterns for Apollo Agents/Plans/connectivity, Ontology/interfaces, OSDK/SuperRepo/Marketplace and basic AIP Logic. Next pass should prioritize secrets/JIT access, agent upgrade/identity recovery, air-gap bundle semantics, multi-Hub authority, AIP observability/classification propagation and data lineage/writeback failure semantics.