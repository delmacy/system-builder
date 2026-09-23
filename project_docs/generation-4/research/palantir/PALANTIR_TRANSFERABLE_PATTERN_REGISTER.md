# Palantir Transferable Pattern Register

Date: 2026-09-23
Status: `RESEARCH_ACTIVE / DEFERRED_IMPROVEMENT_SOURCE`

| ID | Public mechanism | Universal primitive | SB disposition | Implementation | Main caution / proof obligation |
|---|---|---|---|---|---|
| PT-01 | Apollo outbound Agent + environment certificate | enrolled executor with outbound authenticated channel | `ADOPT PRINCIPLE` | `DEFERRED_IMPROVEMENT` | revocation, rotation, compromise, least privilege, attestation |
| PT-02 | Apollo Plan + Constraints | explicit change proposal + admission conditions | `ADOPT PRINCIPLE` | `DEFERRED_IMPROVEMENT` | bind plan to revisions/floors/currentness; no stale execution |
| PT-03 | Reported State | observation distinct from intent | `ALREADY COVERED` | `DEFERRED_IMPROVEMENT` | freshness/evidence; reported != effective |
| PT-04 | Connected/Intermittent/Relayed modes | expected connectivity separate from health and command authority | `ADOPT PRINCIPLE` | `DEFERRED_IMPROVEMENT` | stale/relayed view must not imply live control |
| PT-05 | failure suppression windows | bounded mutation after failures | `ADAPT` | `DEFERRED_IMPROVEMENT` | suppression != reconciliation; human authority precedence |
| PT-06 | release channels + ramped rollout + recall | staged fleet promotion and blast-radius control | `ADAPT` | `DEFERRED_IMPROVEMENT` | health != semantic admissibility; cohort evidence |
| PT-07 | Ontology data+logic+action+security | operational semantic substrate | `ADAPT` | `DEFERRED_IMPROVEMENT` | do not collapse BusinessRecipe/SystemDefinition/runtime truth |
| PT-08 | Ontology Interfaces | polymorphic semantic contract/mapping | `ADAPT` | `DEFERRED_IMPROVEMENT` | shape != full behavior/permission/effect equivalence |
| PT-09 | interface breaking-change guidance | explicit contract version coexistence | `ALREADY COVERED` | `DEFERRED_IMPROVEMENT` | migration of in-flight obligations and old consumers |
| PT-10 | OSDK generated bindings | typed generated semantic client | `ADAPT` | `DEFERRED_IMPROVEMENT` | stable identity/revision; avoid mutable API-name authority |
| PT-11 | documented API-name install conflicts | identity/remapping failure case | `AVOID` | `DEFERRED_IMPROVEMENT` | semantic ID != API/display/provider name |
| PT-12 | SuperRepo | co-versioned semantic model + functions + UI | `ADAPT` | `DEFERRED_IMPROVEMENT` | keep Recipe/Definition/generated artifacts distinct |
| PT-13 | Marketplace dependency graph/inputs | typed install closure and dependency graph | `ADOPT PRINCIPLE` | `DEFERRED_IMPROVEMENT` | ownership/lifecycle of external referenced dependencies |
| PT-14 | Global Branching | cross-resource isolated system change | `ADAPT` | `DEFERRED_IMPROVEMENT` | partial feature support explicit; no fake atomicity |
| PT-15 | AIP user/project execution scope | inference principal != execution principal | `ADOPT PRINCIPLE` | `DEFERRED_IMPROVEMENT` | project service authority may exceed user authority |
| PT-16 | AIP Evals | probabilistic qualification evidence | `ADAPT` | `DEFERRED_IMPROVEMENT` | scalar eval score cannot hide critical safety failures |
| PT-17 | Pilot resource edit locks | bounded AI mutation authority | `ADOPT PRINCIPLE` | `DEFERRED_IMPROVEMENT` | lock/allow state itself needs authority/currentness |
| PT-18 | Data Connection thin proxy vs agent worker | connectivity capability != execution capability | `ADAPT` | `DEFERRED_IMPROVEMENT` | independently scope tunnel and executor authority; central policy != host enforcement proof |
| PT-19 | webhook/writeback/side effects | external effect distinct from local state mutation | `ALREADY COVERED` | `DEFERRED_IMPROVEMENT` | UNKNOWN/reconciliation/effect identity |
| PT-20 | Foundry-as-backend OSDK | platform-backed application model | `AVOID AS CLIENT-RUNTIME DEFAULT` | `DEFERRED_IMPROVEMENT` | violates SB runtime-autonomy goal if adopted literally |
| PT-21 | Apollo Payload Bundler | exportable disconnected control artifact with provenance | `ADAPT` | `DEFERRED_IMPROVEMENT` | bundle possession != authority; replay/currentness/dependency closure |
| PT-22 | Relayed-from-another-Hub environment | observation relay without local mutation authority | `ADOPT PRINCIPLE` | `DEFERRED_IMPROVEMENT` | visibility != authority; imported health is last-bundle evidence |
| PT-23 | Agent version-stale metrics + maintenance windows | software-freshness evidence + bounded update admission | `ADAPT` | `DEFERRED_IMPROVEMENT` | latest != compatible/admissible; upgrade terminates running jobs |
| PT-24 | multiple agents + staggered upgrades | redundant executor cohort + staggered mutation | `ADAPT` | `DEFERRED_IMPROVEMENT` | correlated defects; retry safety and external-effect duplication |
| PT-25 | host-local proxy allowlist non-writable by agent | independent local policy enforcement | `ADOPT PRINCIPLE` | `DEFERRED_IMPROVEMENT` | central policy state != local enforcement state; protect policy writer authority |
| PT-26 | agent-worker local encryption-key continuity | secret custody is part of recovery identity | `ADAPT` | `DEFERRED_IMPROVEMENT` | lost key vs cloned authority; backup != execution authorization |
| PT-27 | Environment edit-source modes | declared-state authority independent from connectivity and observation | `ADOPT PRINCIPLE` | `DEFERRED_IMPROVEMENT` | imported/copy state must not silently acquire write authority |
| PT-28 | Source Hub -> Bundle -> Target Hub -> local Plans | transfer artifact separated from local execution admission | `ADAPT` | `DEFERRED_IMPROVEMENT` | import success != execution authority; approvals/currentness remain local obligations |
| PT-29 | metadata-only bundle when artifact store is unreachable | metadata closure != executable artifact closure | `ADOPT PRINCIPLE` | `DEFERRED_IMPROVEMENT` | target must prove required artifact availability before effective deployment |
| PT-30 | break-glass / edit-source takeover | explicit emergency authority transition | `ADAPT` | `DEFERRED_IMPROVEMENT` | takeover can create split-brain; require audit, fencing and reconciliation |

## Sequencing rule

All entries are research findings and remain `DEFERRED_IMPROVEMENT` until the Station visual/application milestone is materially established and a later Planning & Materialization gate explicitly promotes selected items. `ADOPT PRINCIPLE`/`ADAPT` express architectural relevance only. No finding in this round establishes a direct correctness/security blocker requiring visual-priority displacement.

## Highest-value architecture questions generated

1. Should one SB Host Agent binary expose independently authorized **Execution** and **Connectivity/Tunnel** capabilities, or should they become separate processes later?
2. What immutable identities/revisions must an SB ChangePlan or disconnected bundle pin before an Agent may execute it?
3. What is the minimum Agent enrollment/recovery protocol: host identity, Core identity, certificate rotation, revocation, re-enrollment, recovery and clone detection?
4. How should a Release promotion gate combine operational health with semantic compatibility, authority/security floors and evidence currentness?
5. Can the SB Compiler generate typed SDKs without making generated code depend on Builder APIs at runtime?
6. What is the explicit portability proof suite for Recipe, SystemDefinition, source, artifact, data, runtime and operations?
7. How are partial external effects represented when provider success and canonical commit/observation disagree?
8. How does cross-resource branching handle Recipe/SystemDefinition/schema/UI/workflow revisions without pretending they are one atomic transaction?
9. What is the SB disconnected-bundle admission protocol for signature, destination, dependency closure, replay, expiry/security floor and imported evidence freshness?
10. Can Host Agent recovery preserve required secrets without permitting copied recovery material to create two authoritative hosts?
11. Which Station visual states must distinguish `CONNECTED`, `EXPECTED_OFFLINE`, `RELAYED`, `STALE`, `UNHEALTHY`, `VERSION_STALE`, and `NO_COMMAND_AUTHORITY` without exposing backend implementation assumptions?
12. What durable evidence fences an old Core/Hub before an offline/read-only copy may become authoritative, and how are divergent local emergency edits reconciled after rejoin?
13. Should disconnected release admission require independent proofs for bundle authenticity, declared-state authority, artifact closure, policy approval and currentness rather than one `valid bundle` boolean?

## Saturation

Not saturated. This pass materially deepened Source/Target Hub authority, explicit edit-source ownership, disconnected import admission, metadata-versus-artifact closure and emergency authority takeover. Next pass should prioritize bundle signing/integrity/replay evidence, Agent enrollment/revocation/compromise recovery, secrets/JIT access, AIP classification propagation, and lineage/writeback failure semantics.