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
| PT-31 | organization workflow + project role required for Agent creation | bootstrap authority != lifecycle/use authority | `ADOPT PRINCIPLE` | `DEFERRED_IMPROVEMENT` | creation privilege must not imply permanent executor/resource control |
| PT-32 | credentials encrypted to each assigned agent public key | executor membership change != implicit secret inheritance | `ADAPT` | `DEFERRED_IMPROVEMENT` | recipient-set changes require explicit re-encryption/re-authorization; recovery key must not clone authority |
| PT-33 | Apollo CLI Bundle signing operations | signature evidence != complete admission evidence | `ADOPT PRINCIPLE` | `DEFERRED_IMPROVEMENT` | public evidence reviewed confirms signing exists, but not destination binding/replay/expiry semantics |
| PT-34 | Action local ACID + writeback/side-effect ordering + retry suppression around external calls | local transaction != distributed transaction; retryability is part of effect contract | `ADOPT PRINCIPLE` | `DEFERRED_IMPROVEMENT` | external success/local failure and local success/external failure both exist; at-least-once replay requires idempotency/effect identity/reconciliation |
| PT-35 | branch Actions suppress webhooks by default | projection/branch execution authority != production effect authority | `ADOPT PRINCIPLE` | `DEFERRED_IMPROVEMENT` | safe preview can hide integration gaps; explicit live-effect opt-in needs visible destination/authority evidence |
| PT-36 | AIP/Ontology logs use explicitly configured log markings rather than automatically propagating markings from reached data | source classification != derived-observability classification | `ADOPT PRINCIPLE` | `DEFERRED_IMPROVEMENT` | telemetry may contain prompts, completions, object values and user inputs; policy must conservatively cover workflow reach and be requalified as reach changes |
| PT-37 | distinct execution-history/log-access requirements anchored at source executor/project | execution authority != telemetry-inspection authority != telemetry-policy administration | `ADAPT` | `DEFERRED_IMPROVEMENT` | trace access can disclose parameters/results/prompts across call chains; source attribution is not business-data ownership |
| PT-38 | bounded log search/run-history windows and non-live search results | telemetry retention/currentness != canonical evidence retention/currentness | `ALREADY COVERED` | `DEFERRED_IMPROVEMENT` | absence after retention or in stale search cannot prove non-occurrence/non-effect |
| PT-39 | AIP Logic model requests tools while executor runs them under invoking-user permissions | model tool selection != tool execution authority | `ADOPT PRINCIPLE` | `DEFERRED_IMPROVEMENT` | prompt/model can choose dangerous allowed tool; executor must independently resolve principal, policy and effect admission |
| PT-40 | Chatbot Action/Command confirmation + AI FDE mutating-tool approvals | tool availability != effect admission; approval is separately scoped authority evidence | `ADOPT PRINCIPLE` | `DEFERRED_IMPROVEMENT` | approval fatigue, stale payload, session-scope creep; approval != correctness/effect proof |
| PT-41 | deterministic Action/Function inputs pinned from application variables at reasoning-loop start | deterministic argument provenance != indefinitely current argument | `ADAPT` | `DEFERRED_IMPROVEMENT` | later tool/state changes can make pinned values stale; deterministic != authorized/current |
| PT-42 | local/external Palantir MCP explicitly changes data-governance domain | authorized egress != downstream governance continuity | `ADOPT PRINCIPLE` | `DEFERRED_IMPROVEMENT` | external model/provider may receive tool outputs under a different contract, retention and policy domain |
| PT-43 | Ontology MCP OAuth + Developer Console resource/operation restrictions | effective tool authority is intersection of principal authority and application/tool exposure ceiling | `ADAPT` | `DEFERRED_IMPROVEMENT` | service principal breadth, unrestricted apps, resource-closure drift and discoverable-but-not-admissible tools |
| PT-44 | Palantir MCP ontology edits require proposal review/human merge | AI-authored structural candidate != canonical semantic mutation; builder mutation surface != runtime action surface | `ALREADY COVERED` | `DEFERRED_IMPROVEMENT` | approval does not prove compatibility/deployment safety; app/resource closure can lag approved ontology change |

## Sequencing rule

All entries are research findings and remain `DEFERRED_IMPROVEMENT` until the Station visual/application milestone is materially established and a later Planning & Materialization gate explicitly promotes selected items. `ADOPT PRINCIPLE`/`ADAPT` express architectural relevance only. No finding in this round establishes a direct correctness/security blocker requiring visual-priority displacement.

## Highest-value architecture questions generated

1. Should one SB Host Agent binary expose independently authorized **Execution** and **Connectivity/Tunnel** capabilities, or should they become separate processes later?
2. What immutable identities/revisions must an SB ChangePlan or disconnected bundle pin before an Agent may execute it?
3. What is the minimum Agent enrollment/recovery protocol: host identity, Core identity, certificate rotation, revocation, re-enrollment, recovery and clone detection?
4. How should a Release promotion gate combine operational health with semantic compatibility, authority/security floors and evidence currentness?
5. Can the SB Compiler generate typed SDKs without making generated code depend on Builder APIs at runtime?
6. What is the explicit portability proof suite for Recipe, SystemDefinition, source, artifact, data, runtime and operations?
7. What durable effect identity and reconciliation evidence survives `external succeeded / canonical failed`, acknowledgement loss and at-least-once replay without assuming retry is safe?
8. How does cross-resource branching handle Recipe/SystemDefinition/schema/UI/workflow revisions without pretending they are one atomic transaction?
9. What is the SB disconnected-bundle admission protocol for signature, destination, dependency closure, replay, expiry/security floor and imported evidence freshness?
10. Can Host Agent recovery preserve required secrets without permitting copied recovery material to create two authoritative hosts?
11. Which Station visual states must distinguish `CONNECTED`, `EXPECTED_OFFLINE`, `RELAYED`, `STALE`, `UNHEALTHY`, `VERSION_STALE`, and `NO_COMMAND_AUTHORITY` without exposing backend implementation assumptions?
12. What durable evidence fences an old Core/Hub before an offline/read-only copy may become authoritative, and how are divergent local emergency edits reconciled after rejoin?
13. Should disconnected release admission require independent proofs for bundle authenticity, declared-state authority, artifact closure, policy approval and currentness rather than one `valid bundle` boolean?
14. Which authority may create/enroll a Host Agent, which may attach capabilities/providers, and which may deliver secrets after enrollment? These must not be one implicit privilege.
15. When executor membership changes, can provider credentials be rewrapped without exposing plaintext to Core, while still requiring explicit authorization for the new recipient set?
16. How must Station represent preview/simulated/suppressed effects so projected local success can never be mistaken for an externally effective operation?
17. How does an autonomous runtime carry source-data classification into AI context/output/log/trace/export policy without making Builder/Observe a runtime dependency?
18. Which principal may execute a workflow, inspect its derived telemetry, administer telemetry disclosure, and export that telemetry? These authorities must remain independently representable.
19. How should an AI tool invocation bind candidate, effective principal, immutable arguments/revisions, approval scope, provider capability and eventual effect evidence so no layer can silently turn inference into authority?
20. When session-scoped approval exists, what branch/project/tool-version/context changes invalidate or require requalification of that approval?
21. Which policy obligations survive an AI/provider egress boundary, and how does an autonomous runtime prove destination/provider admissibility when protocol interoperability alone does not preserve governance?
22. How should generated applications declare and version their maximum capability/resource/operation closure so principal authority cannot silently exceed application intent as tools evolve?

## Saturation

Not saturated. MCP governance-boundary semantics and application-level authority ceilings are now materially evidenced from primary Palantir documentation, as is the construction-vs-production distinction between Palantir MCP and Ontology MCP. Repeated searches for basic MCP existence/approval have low marginal value. Next pass should prioritize exported telemetry policy propagation, nested pro-code agent/function principal propagation and whether application/tool closure changes are versioned/requalified; Bundle verification/replay remains open if stronger primary evidence appears.