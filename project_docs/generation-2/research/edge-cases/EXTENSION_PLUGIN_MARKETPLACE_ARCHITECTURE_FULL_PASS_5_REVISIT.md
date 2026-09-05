# Generation 2 — Extension / Plugin / Marketplace Architecture — Full Pass 5 Revisit

Status: ACTIVE / ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 5
Capability: Extension / Plugin / Marketplace Architecture
Mandatory cluster: Extension/Plugin × authority × provider trust × lifecycle
Authority: `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`

Research only. `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`. Default disposition remains `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. No implementation, Work Package, executive TASK or Construction is authorized by this revisit.

## 1. Technique rotation and duplicate-screen baseline

Full Pass 5 deliberately challenged the capability through the active architecture hypothesis rather than repeating the Full Pass 4 probes verbatim:

- typed-relation cut analysis across `CapabilityDefinition -> CapabilityUse/Invocation -> host/build/runtime realization -> ProviderBinding`;
- definition-versus-realization identity mutation, including one logical extension realized by multiple host/runtime cohorts;
- transitive/diamond dependency joins over typed capability requirements, host/API compatibility direction and provider-specific realization evidence;
- activation/deactivation/uninstall races while hooks, jobs, callbacks, subscriptions, leases, tokens, handles and external mutations remain in flight;
- trust/admission currentness subtraction after publisher, marketplace, provider or policy state changes;
- residual-cohort analysis across old/new extension revisions, hosts, builds and providers;
- semantic-owner collision analysis where individually valid extensions write or derive the same canonical subject differently;
- shared-infrastructure tenancy and resource/cost fan-out stress;
- local-first evidence versus Fleet-exported evidence and cross-build comparability qualification;
- contradictory human extension-management procedures;
- AI/low-code aggregate composition where each extension is individually admissible but the combined authority/provider/trust reach is not jointly qualified.

Duplicate-screen baseline: all 119 reusable `G2-CONFLICT-PATTERN-*` patterns, local scenarios through `G2-EDGE-EXTENSION-009`, and cluster scenarios through `G2-XEDGE-EXTENSION-AUTH-TRUST-LIFECYCLE-005`.

## 2. Current evidence and portable interpretation

Current external evidence was used only to test portability of existing distinctions, not to import product-specific mechanics as universal architecture.

- VS Code documents multiple extension hosts (local, web and remote) and documents that an extension dependency may be declared across distinct hosts even though the provider's exported API is not available to the consumer in that topology. This supports the distinction `declared dependency != jointly usable semantic surface` and `logical extension identity != realized host/API surface`.
  - https://code.visualstudio.com/api/advanced-topics/extension-host
  - https://code.visualstudio.com/api/advanced-topics/remote-extensions
- npm documents peer dependencies, optional peer dependencies and optional dependencies separately; resolution/installability is not proof of N-wise semantic compatibility of a realized plugin closure.
  - https://docs.npmjs.com/cli/v11/configuring-npm/package-json/
- Chrome extension runtime exposes cross-extension messaging and native messaging. Effective communication/effect reach can therefore exceed immediate package/dependency edges and must be qualified separately from package admission.
  - https://developer.chrome.com/docs/extensions/mv2/reference/runtime

Portable conclusion remains: `installed/admitted != currently qualified aggregate authority`; `resolved dependency closure != jointly qualified semantic closure`; `disabled/uninstalled != proven effect quiescence`; `trust/integrity evidence != authorization`; `Fleet aggregate != local runtime truth`.

## 3. Typed Semantic Graph + ExecutionEnvelope hypothesis

Status remains **HIPÓTESE DE ARQUITETURA / EM PESQUISA**.

### 3.1 Hypothesis shape for extensions

A typed semantic graph remains plausible if it represents at least the following distinct subjects rather than collapsing them:

- `CapabilityDefinition`: reusable functional contract;
- `CapabilityUse/Invocation`: occurrence of that capability in a workflow/process composition;
- `ExtensionDefinition/Revision`: extension/plugin semantic definition and declared requirements;
- `HostRealization`: concrete host/runtime/build locus where an extension revision is loaded;
- `ProviderBinding`: provider/marketplace/external realization relation with qualification evidence;
- `AuthorityPolicyRef`, `TrustEvidenceRef`, `ContractRevisionRef`, `SecretRef/ConfigRef`: references, not implicit proof of current validity;
- `ExecutionEnvelope`: bounded contextual references and deltas traversing executable nodes;
- `ExecutionJournal`: immutable execution evidence, attempts, errors and traversal lineage;
- `ExecutionState`: current execution snapshot;
- business truth: owned separately from extension/runtime execution evidence.

The graph must not infer that reachability implies authorization, currentness, compatibility, trust eligibility or effect convergence.

### 3.2 Data-flow + control-flow implications

For extension composition, joint data/control analysis must be able to expose candidates such as:

- missing/incompatible typed input across extension hooks;
- parallel writers to one canonical subject without declared merge/ownership semantics;
- callback/event waits that cannot be jointly satisfied;
- dependency cycles that are legal for discovery/metadata but illegal for activation/execution;
- extension fan-out whose join semantics require results from mutually exclusive host/provider cohorts;
- one extension's output being interpreted under a different semantic revision by a downstream consumer;
- hidden external communication edges not represented by package dependencies.

These are detection/proof obligations, not implementation prescriptions.

### 3.3 Recursive/composed workflows

If a subworkflow is exposed as a composed capability, extension realization must preserve parent↔child contract mappings, version pinning, context scoping, termination/depth bounds and compensation ownership. Recursive composition remains legitimate only when the concrete relation type and termination semantics permit it; a generic graph cycle ban would over-constrain legitimate workflows.

### 3.4 PostgreSQL versus GraphDB

No evidence in this revisit requires GraphDB. Relational typed tables remain a plausible baseline for graph definitions/revisions/nodes/edges, extension realization/binding records, workflow/node execution, edge traversal and immutable journals, with bounded JSONB for provider/config-specific data. GraphDB remains optional/provider/projection-level until a later query/scale proof obligation demonstrates necessity.

### 3.5 Canvas / Graph Explorer projection

A navigable projection remains plausible for `Enterprise -> Workspace -> Workflow -> Subworkflow -> Capability -> Contract/Provider`, including Process/Capability/Data/Authority/Provider/Runtime/Risk views. The projection must preserve semantic distinction between declared edges and qualified runtime edges; otherwise the explorer could visually imply authority/compatibility that current evidence does not prove.

## 4. Candidate challenge dispositions

### 4.1 Typed capability reference versus concrete extension realization

Candidate: a workflow references a stable capability/extension identity, but different builds/hosts/providers realize semantically different surfaces while all remain nominally valid.

Disposition: covered by existing revision/currentness, compatibility-direction, provider-qualification, residual-cohort and semantic-ownership patterns. Detection candidate: qualify the realized closure against pinned capability/contract revisions and current provider/host evidence before claiming compatibility. No new reusable pattern.

### 4.2 Diamond dependency with individually valid edges but invalid aggregate profile

Candidate: A depends on B and C; both depend on D under individually satisfiable constraints, but the realized host/API/provider cut has no jointly valid semantic profile.

Disposition: covered by `G2-EDGE-EXTENSION-008` plus qualification-join, structural dependency closure, compatibility-direction and revision-vector patterns. Static graph reachability is only a signal; proof requires joint semantic qualification. No new pattern.

### 4.3 Deactivate/uninstall versus in-flight effects

Candidate: control-plane state becomes disabled/uninstalled while previously issued hooks/jobs/callbacks/leases/tokens/handles or external mutations remain active, queued, ambiguous or adopted downstream.

Disposition: covered by `G2-EDGE-EXTENSION-006`, ambiguous-effect/reconcile-before-retry, currentness, residual-cohort, compensation/adoption and rollback-eligibility patterns. Future remediation route when observed: require quiescence/reconciliation evidence or explicit accepted residual risk. No new pattern.

### 4.4 Trust/admission revocation after issuance

Candidate: publisher, marketplace, provider or policy trust changes after an extension obtained a handle, token, callback registration or provider credential.

Disposition: covered by authority-currentness, trust/currentness, lease/revocation and residual-cohort patterns. Detection candidate: compare currently reachable effective authority/effect graph to the current qualified admission envelope. Revocation signal alone is not proof that every issued capability has ceased. No new pattern.

### 4.5 Semantic-owner collision among valid extensions

Candidate: two admitted extensions produce individually valid but incompatible writes/derived claims for the same canonical subject, with effective result determined by ordering or concurrency.

Disposition: covered by `G2-EDGE-EXTENSION-009`, semantic-ownership, state-transition, temporal-ordering and data-consistency conflict families. False-positive guard: explicitly commutative/mergeable semantics or a declared authoritative owner. No new pattern.

### 4.6 Marketplace/provider substitution and residual cohorts

Candidate: canonical extension identity stays stable while source/provider/host realization changes and residual old cohorts continue to execute or emit evidence.

Disposition: covered by `G2-XEDGE-EXTENSION-AUTH-TRUST-LIFECYCLE-003/005`, provider-substitution, residual-cohort, qualification-join and currentness patterns. Fleet/export evidence cannot silently establish convergence across cohorts. No new pattern.

### 4.7 Shared-infrastructure tenancy and resource/cost amplification

Candidate: individually valid extensions share workers, queues, caches, credentials, rate limits or provider quotas; aggregate fan-out or recursive triggering causes cross-tenant starvation/cost amplification without any single extension violating its local contract.

Disposition: covered by resource/capacity, cross-process objective, authority-scope and boundedness patterns. Detection candidate: graph-derived reachable resource sets combined with runtime cardinality/capacity evidence. Prevention must not globally forbid legitimate high-scale compositions. No new pattern.

### 4.8 Contradictory human procedures

Candidate: two valid operator procedures prescribe incompatible enable/disable, trust override, rollback or provider-substitution actions for the same extension cohort.

Disposition: covered by human-procedure/instruction, lifecycle/currentness and authority/precedence conflict families. Detection candidate: procedure applicability/precedence graph plus current owner/authority evidence. `Signal != ConfirmedConflict`. No new pattern.

### 4.9 AI/low-code aggregate authority/provider/trust reach

Candidate: AI/low-code composes individually admitted extensions into a workflow whose aggregate reachable authority, external mutation surface or provider/trust domain exceeds the initiating envelope or lacks jointly current qualification.

Disposition: covered by `G2-XEDGE-EXTENSION-AUTH-TRUST-LIFECYCLE-004/005`, permission-composition, authority non-amplification, provider qualification, semantic ownership and AI/low-code conflict families. The graph can be a detection substrate, but graph reachability itself is not authorization. No new pattern.

## 5. Conflict-family coverage and materiality result

This revisit explicitly exercised structural graph, state-transition, semantic ownership, rule/condition interaction where extension configuration gates execution, temporal/ordering, resource/capacity, authority/responsibility/SoD, policy/compliance/trust, data/consistency, provider/integration, version/migration/coexistence, exception/compensation/recovery, human-procedure/instruction, cross-process, objective/optimization and AI/low-code composition.

Every candidate reduced to an existing catalogued class after duplicate-screen. Therefore no new material conflict record requiring activation conditions, incompatible claims/actions/states, owner/severity/confidence/detectability/blast-radius/reversibility/time-to-harm/misuse-likelihood/evidence-currentness/false-positive-risk fields was created in this pass; those dimensions remain carried by the originating 119 reusable patterns and linked scenarios.

No `ConflictInstance` is asserted. No `Signal` is promoted to `ConfirmedConflict`. No preventive invariant candidate is added because this pass discovered no new universal/material class beyond existing ownered patterns.

## 6. Architecture hypothesis — evidence for, against, alternatives and proof obligations

### Evidence for

- typed graph relations make declared dependency, capability use, provider realization, authority/trust references and runtime cohort identity explicit without requiring them to be flattened into one object;
- graph traversal is a natural detection candidate for hidden transitive authority/provider reach, diamonds, cycles, fan-out and residual-cohort connectivity;
- a separate `ExecutionJournal` helps preserve immutable evidence without confusing execution history with current state or business truth;
- a graph projection can support cross-cutting Process/Data/Authority/Provider/Risk views without forcing GraphDB persistence.

### Evidence against / risks

- graph shape can create false confidence if edge existence is mistaken for current authorization, compatibility, trust, provider support or effect convergence;
- N-wise semantic qualification may require domain constraints richer than generic graph topology/type checking;
- high-cardinality runtime instances, external callbacks and historical traversals could make unrestricted graph queries expensive;
- recursively composed capabilities can make naive cycle detection reject legitimate patterns or miss runtime recursion/fan-out bounds;
- Fleet/global projections can accidentally become hidden runtime dependencies or substitute aggregate telemetry for local truth.

### Alternatives

- relational domain tables with explicit foreign keys and capability-specific joins but no unified semantic graph abstraction;
- document/AST-style canonical IR with derived graph projections;
- event-sourced execution model with graph reconstructed as projection;
- dedicated GraphDB as canonical store.

No alternative is selected here. The current hypothesis remains: typed semantic graph as a candidate canonical/intermediate semantic model, relational PostgreSQL persistence as a plausible baseline, and GraphDB as optional projection/provider only if later evidence justifies it.

### Proof obligations carried forward

1. Distinguish definition/use/realization/execution/evidence/business-truth identities without accidental collapse.
2. Prove that graph traversal never implies authorization/trust/currentness without explicit qualification semantics.
3. Define typed compatibility joins across transitive/diamond dependencies and host/provider cohorts.
4. Bound recursion, fan-out/fan-in and graph/resource traversal without forbidding legitimate cycles/composition.
5. Preserve parent↔child context scope, version pinning and compensation ownership for composed workflows.
6. Keep `ExecutionEnvelope`, `ExecutionState`, `ExecutionJournal` and business truth semantically separate.
7. Qualify residual cohorts and in-flight effects before claiming disable/uninstall/rollback convergence.
8. Keep Fleet/Graph Explorer projections non-authoritative unless a later explicit owner/contract says otherwise.

## 7. Saturation result

- New local material edge scenarios: 0.
- New mandatory-cluster material scenarios: 0.
- New reusable ConflictPatterns: 0.
- New preventive invariant candidates: 0.
- Extension / Plugin / Marketplace Architecture local streak remains capped at 2.
- Extension/Plugin × authority × provider trust × lifecycle cluster streak remains capped at 2.
- Material inventory remains 284 edge scenarios + 119 ConflictPatterns = 403 material findings.
- HIGH/CRITICAL without owner/proof/detection route: 0.
- Full Pass 5 capability coverage advances to 10/28.
- Full Pass 5 mandatory-cluster coverage advances to 9/12.
- Saturation remains `NOT_SATURATED`; negative-space review remains `NOT_STARTED`.
- Planning C remains blocked.

## 8. Next bounded focus

Continue Full Pass 5 with Commercial Metering / Entitlements / Rating / Billing / Payment and explicitly exercise Commercial Metering × Entitlements × Rating × Billing × Payment without inflating its already-satisfied streak above 2. Carry Typed Semantic Graph + ExecutionEnvelope + Autonomous Builds/Fleet Observability into typed usage/entitlement/rating/invoice/payment relations; revision-sliced aggregation windows; late/corrected usage after invoice/payment adoption; entitlement versus authorization; rerating versus refunds/credits/chargebacks; currency/unit/rounding joins; replay/dedupe/provider substitution; settlement versus invoice/payment state; historical reproduction; residual provider cohorts; monetary `PARTIAL/UNKNOWN`; resource/cardinality/cost exhaustion; shared-infrastructure tenancy; local-first evidence versus Fleet export; contradictory human billing procedures; objective conflicts; and AI/low-code monetary composition. GraphDB remains optional/provider-level; Fleet remains non-authoritative by default. Do not enter Planning C.
