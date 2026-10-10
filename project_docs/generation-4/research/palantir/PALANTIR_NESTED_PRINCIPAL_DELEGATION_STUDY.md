# Palantir Nested Principal / Delegation Study

Date: 2026-09-23
Status: `RESEARCH / PUBLIC-DOC EVIDENCE`
Implementation state: `DEFERRED_IMPROVEMENT`
Sequencing: Station visual/application milestone remains the implementation priority. Nothing in this study authorizes product work, WBS, Work Packages, Sprints, TASKs, Core/Agent/infra refactors, or priority changes.

## Scope

This pass investigates principal propagation and authority semantics across pro-code agents, OSDK/OMCP/Palantir MCP, Functions, Actions and Automate. It is a public-architecture benchmark only; no private implementation or reverse engineering is used.

## Finding P-NPD01 — Caller identity is not a universal transitive execution principal

**Source/date:** Palantir official Pro-code agents overview; Functions permissions; Automate security/permissions; reviewed 2026-09-23.

**Palantir mechanism:** Pro-code agents are published as asynchronous Functions and can be called from Workshop, OSDK, Ontology Actions and Automate. Functions normally load Ontology objects according to the end user's permissions. However, Automate evaluates conditions and executes Action/Logic/Function effects using the automation owner's permissions; third-party-application-owned automations use the application's service user. Function-backed Actions are another special boundary: end users can apply the Action based on Action-level submission criteria without necessarily having direct read access to the underlying Function; the Action author/admin is responsible for configuring the underlying function relationship.

**Problem solved:** supports reusable functions/agents across interactive and unattended workflows while allowing long-lived automation identity and application-level admission rules.

**Universal primitive:** `invoker identity != necessarily effective downstream principal`; every delegation edge must declare how the effective principal is selected rather than assuming caller identity propagates transitively.

**Preconditions:** each execution surface has explicit principal-selection semantics; delegated calls are re-authorized at the receiving boundary; audit evidence records both initiating actor and effective execution principal when they differ.

**Trade-offs:** owner/service execution provides continuity and avoids depending on an interactive user's availability, but can create authority amplification relative to the initiating user and makes nested reasoning harder to audit.

**Failure modes:** a low-privilege user triggers an automation whose owner/service user has materially broader rights; an agent calls another agent/function and the UI attributes the effect only to the human initiator; ownership transfer changes future effective authority without requalifying effects; a function-backed Action is mistaken for direct function authorization; nested calls erase the authority transition.

**Lock-in boundary:** Palantir's Function registry, Automate owner semantics and Action submission criteria are platform-specific. The transferable requirement is explicit principal-transition semantics and provenance at every delegation boundary.

**SB relation:** strengthens `AI inference != authority`, Station/Core/Agent boundaries, workflow/action/policy engines and capability/provider separation. SB should not infer that a principal resolved at the first AI/tool boundary remains the effective principal through nested capability calls. A portable delegation envelope should preserve initiator, effective principal, authority source, scope and delegation lineage without making Builder/Core a mandatory runtime backend.

**Classification:** `ADOPT PRINCIPLE`. **Implementation:** `DEFERRED_IMPROVEMENT`.

## Finding P-NPD02 — Function execution has multiple independent authority gates

**Source/date:** Palantir official Functions permissions and Developer Console application restrictions, reviewed 2026-09-23.

**Palantir mechanism:** published Function execution is governed by several distinct controls: repository/function availability, registration in Developer Console where applicable, end-user object read permissions for object loading, application restrictions/scopes, and additional administrator allowlists for extended execution capabilities. Extended capabilities are checked at execution time. Developer Console computes access from application restrictions, requested operation scopes where applicable, and the underlying user/service-user permissions.

**Problem solved:** prevents code availability from automatically implying data or elevated-operation authority and permits separate administrative control of high-risk execution features.

**Universal primitive:** `callable artifact != data authority != elevated-effect authority`; effective authority is an intersection of independently governed gates and may require explicit elevation qualification.

**Preconditions:** stable function/capability identity, explicit resource/operation closure, server-side authorization, and current administrator policy for elevated capabilities.

**Trade-offs:** layered gates reduce blast radius but create configuration drift and non-obvious failures when code, registration, resource closure and elevated-capability policy evolve independently.

**Failure modes:** function version becomes callable while dependent resource closure is stale; repository visibility is mistaken for execution permission; a service user gains a new resource but the application envelope is not reviewed; an extended capability remains allowlisted after semantic/tool changes; UI exposes a callable function while one of its downstream gates rejects it.

**Lock-in boundary:** Developer Console, Function registry and Palantir allowlists are platform mechanisms. The transferable requirement is a provider-neutral multidimensional admission vector, not those products.

**SB relation:** reinforces SystemDefinition capability closure, capability/provider contracts and `health/discovery != admissibility`. Generated applications should version the maximum capability/resource/effect closure they intend to expose; provider replacement cannot silently weaken one gate. Station may represent these dimensions later but must not become the authority source.

**Classification:** `ADAPT`. **Implementation:** `DEFERRED_IMPROVEMENT`.

## Finding P-NPD03 — Read-time filtering does not automatically protect function outputs

**Source/date:** Palantir official Functions permissions, reviewed 2026-09-23.

**Palantir mechanism:** row/column controls filter what a user can read while a Function runs, but Palantir explicitly states those controls do not extend automatically to the Function's output; downstream protection requires markings or Classification-based Access Control.

**Problem solved:** permits functions to compute over user-visible subsets while requiring an explicit derived-data protection mechanism for outputs.

**Universal primitive:** `authorized input view != automatically authorized derived output`; principal propagation and classification propagation are independent proof obligations.

**Preconditions:** derived outputs carry independently enforceable policy/classification when source restrictions matter downstream.

**Trade-offs:** explicit output classification supports flexible computation but creates another policy boundary and risks under-classification if developers assume read-time filters are transitive.

**Failure modes:** a function combines individually permitted rows into a sensitive aggregate; nested agent/function output loses source restrictions; a service principal writes derived content to a broader destination; caller identity is preserved but classification is not, creating false confidence.

**Lock-in boundary:** Palantir markings/CBAC are implementation-specific. The transferable primitive is derived-output policy qualification across every capability/provider boundary.

**SB relation:** directly reinforces `projection != canonical truth`, evidence/provenance, IMP-PAL-013/035/040 and autonomous runtime governance. Authority lineage alone is insufficient; data-policy lineage must remain independently representable.

**Classification:** `ALREADY COVERED` with stronger primary evidence. **Implementation:** `DEFERRED_IMPROVEMENT`.

## Adversarial reconciliation

- **AI recommendation mistaken for authority:** nested agent calls do not inherit authority merely because the model selected the next tool.
- **Permission drift:** changing automation owner/service-user permissions or application restrictions can change effective authority without changing agent/function code.
- **Ontology/app mismatch:** published function/agent version, Ontology binding, Developer Console registration and resource closure can evolve independently.
- **Platform-specific SDK lock-in:** OSDK/OMCP simplify scoped access, but the portable requirement is explicit principal transition + capability closure + data-policy propagation.
- **Source/operational truth divergence:** a successful delegated function call proves neither external effect nor canonical business effectiveness; existing reconciliation semantics still apply.

## SB comparison

- **Business Mirroring / Recipe / SystemDefinition:** no Palantir principal mechanism should collapse approved business authority into application/service credentials. SystemDefinition may declare execution/delegation needs; Recipe remains technology-independent.
- **Ontology / Semantic Registry:** semantic identity and authorization remain separate. A callable semantic operation is not an authority grant.
- **Capability/provider contracts:** add principal-selection/delegation semantics and derived-output policy as contract dimensions later, only through explicit planning.
- **Station/Core/Station Gateway/Host Agent:** Station may show initiator/effective principal/delegation lineage, but authority is resolved at canonical execution boundaries. Host Agent rights must not be inferred from an upstream AI principal.
- **Resource Fabric:** resource/provider credentials remain distinct from initiating human/AI identity; delegated execution may use a service principal but must expose that transition.
- **Autonomous runtime:** all necessary principal/delegation/policy evidence must be runtime-portable; no dependency on Builder availability is introduced.
- **Workflow/action/policy engines:** ownership/service execution is a concrete benchmark for why workflow owner, trigger initiator, approver and effect principal are distinct roles.
- **Deployment/release:** code/version publication does not prove authority closure currentness; application/capability closure requires independent qualification.
- **Evidence/provenance/currentness/observability:** record initiator and effective principal separately; telemetry remains evidence, not canonical truth.
- **AI candidate vs authority:** model/tool selection never chooses the effective principal by itself.
- **Offline/disconnected:** cached delegation authority must retain currentness/security floors; no perpetual stale service authority is implied.
- **Generated application portability:** generated apps should carry explicit authority/capability closure in portable contracts rather than rely on Foundry-specific Developer Console semantics.

## Transferable conclusion

A useful portable chain is:

`initiator -> candidate/tool selection -> application capability ceiling -> delegation/principal transition -> resource/effect authorization -> execution -> derived-output policy -> effect/evidence observation`

No arrow implies the next one automatically. In particular:

`initiator != effective principal`, `callable != authorized`, and `authorized input != authorized output`.

All findings remain `DEFERRED_IMPROVEMENT`. No direct correctness/security blocker for the current Station visual milestone was found.
