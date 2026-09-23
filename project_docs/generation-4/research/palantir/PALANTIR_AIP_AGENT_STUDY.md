# Palantir AIP / Agent Study

Date: 2026-09-23
Status: `RESEARCH / PUBLIC-DOC EVIDENCE`
Implementation state: `DEFERRED_IMPROVEMENT`

## Findings

### P-AIP01 — AI logic executes in an explicit permission scope
AIP Logic publicly documents user-scoped and project-scoped execution modes. This makes execution identity/authority an explicit configuration rather than assuming model authority.

**Primitive:** inference context != execution principal.

**SB relation:** reinforces `AI inference != authority`; every AI-proposed command requires an independently resolved principal/authority context.

**Classification:** `ADOPT PRINCIPLE`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-AIP02 — Evaluation is a first-class lifecycle
AIP Evals supports test cases, metrics, multi-run variance, model comparisons and cost/performance experiments.

**Primitive:** probabilistic component qualification requires repeatable evaluation evidence, not deterministic unit-test assumptions alone.

**SB relation:** candidate for AI provider/model qualification and regression gates, while evaluation result remains evidence rather than authority.

**Classification:** `ADAPT`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-AIP03 — Ontology mutation by AI can be bounded per entity
Pilot public docs expose per-entity controls such as allowing or disallowing Ontology modifications; when locked resources require change, Pilot pauses for a decision.

**Primitive:** AI change scope is capability/resource bounded and can escalate rather than silently broaden authority.

**SB relation:** aligns with candidate->review->authorized change and bounded self-evolution.

**Classification:** `ADOPT PRINCIPLE`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-AIP04 — AI/application coupling follows Ontology contracts
AIP and Pilot operate against Ontology entities/actions rather than treating free-form model output as direct business state.

**Primitive:** AI interacts through typed governed tools/contracts.

**SB relation:** strongly compatible with `AI interprets; contracts formalize; engines execute`.

**Classification:** `ALREADY COVERED`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-AIP05 — Observability content can be more sensitive than its source-executor metadata
**Source/date:** Palantir official docs, Ontology and AIP observability — Log permissions / Configure logging / Trace views, reviewed 2026-09-23.

**Palantir mechanism:** trace and service logs may contain prompts, completions, object-property values, user inputs and function input/output. Log viewing requires resource permission, explicit log-access enablement and every marking explicitly attached to the logs. Critically, those log markings are not automatically derived from the source executor, its inputs, or data reached during execution; administrators must choose markings representing the maximum sensitivity the workflow may touch.

**Problem solved:** makes rich cross-service debugging possible while providing a separately governed telemetry-access boundary.

**Universal primitive:** `source-data authorization/classification != derived-observability authorization/classification`; derivation creates a new governed disclosure surface whose sensitivity must be conservatively qualified.

**Preconditions:** know or bound the maximum sensitivity reachable by the workflow; control who may enable logging; retain independent authorization for telemetry access.

**Trade-offs:** rich traces materially improve diagnosis and AI evaluation, but prompt/output/input visibility expands disclosure surface and conservative classification may reduce observability usability.

**Failure modes:** under-marked logs expose restricted derived content; workflow reach expands after log policy was configured; privileged editor receives telemetry broader than intended; exported telemetry escapes the in-platform policy domain; debugging code logs sensitive provider payloads.

**Lock-in boundary:** Palantir's markings/log-access machinery is platform-specific. The transferable requirement is classification/authorization continuity for derived telemetry, not Foundry markings or Workflow Lineage.

**SB relation:** strengthens evidence/provenance/currentness and `projection != canonical truth`. Observe remains replaceable and non-authoritative, but replaceability cannot discard confidentiality obligations. Resource Fabric/provider data, AI context and generated-runtime telemetry need explicit derived-data policy rather than inheriting a UI/resource label by assumption.

**Classification:** `ADOPT PRINCIPLE`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-AIP06 — Trace access is a distinct authority domain from execution authority
**Source/date:** Palantir official docs, Log permissions and Trace views, reviewed 2026-09-23.

**Palantir mechanism:** execution history, traces and service logs have distinct access requirements. Trace details can expose function parameters/results, LLM prompts/responses, token use, errors and cross-service execution structure. A source executor anchors log-access policy for a call chain.

**Problem solved:** permits operational debugging without treating ability to execute a workflow as blanket authority to inspect all historical telemetry.

**Universal primitive:** `may execute != may inspect derived telemetry != may administer telemetry disclosure`; observability authority is separately scoped.

**Preconditions:** stable execution/source identity, explicit telemetry-access policy, auditable administrator authority and retention boundaries.

**Trade-offs:** separation improves least privilege but complicates incident response and may make debugging unavailable exactly when access is constrained.

**Failure modes:** telemetry administrator silently broadens disclosure; moved/re-attributed resources create stale access assumptions; call-chain/source-executor attribution is mistaken for business-data ownership; trace correlation is mistaken for authority or causation.

**Lock-in boundary:** Foundry's source-executor and project permission model is implementation-specific. SB should preserve the authority separation without requiring a central Builder observability backend at client runtime.

**SB relation:** aligns with autonomous runtimes and replaceable OpenTelemetry-compatible Observe. Telemetry export must carry enough policy/evidence metadata for an external observability provider to avoid silently weakening the source system's disclosure constraints.

**Classification:** `ADAPT`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-AIP07 — Telemetry retention/currentness is not business evidence retention/currentness
**Source/date:** Palantir official docs, Log search / Execution history, reviewed 2026-09-23.

**Palantir mechanism:** log search and execution history expose bounded recent windows; log search is not live and requires refresh for newer entries.

**Problem solved:** bounds operational telemetry storage and search cost.

**Universal primitive:** `telemetry retention != canonical evidence retention`; `not present in current log window != did not occur`; `search snapshot != live state`.

**Preconditions:** consumers understand retention/currentness metadata and durable business evidence exists elsewhere when required.

**Trade-offs:** bounded retention reduces cost/privacy exposure but limits forensic reconstruction if telemetry was incorrectly treated as durable proof.

**Failure modes:** Station infers non-occurrence from expired logs; stale search results are presented as current; audit obligations depend on telemetry whose retention is shorter than the business obligation.

**Lock-in boundary:** exact Palantir retention windows are product policy, not a universal recommendation.

**SB relation:** reinforces `projection != canonical truth`, `reported != observed != effective` and the constitutional separation between Observe and autonomous runtime. UI must expose freshness/retention where absence could otherwise be interpreted as proof.

**Classification:** `ALREADY COVERED` with concrete benchmark evidence. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-AIP08 — The model proposes tool use; the governed executor performs it
**Source/date:** Palantir official AIP Logic Blocks and AIP Chatbot Studio Tools documentation, reviewed 2026-09-23.

**Palantir mechanism:** AIP Logic states that LLMs do not directly access tools: the model requests tool use and AIP Logic executes the call under the invoking user's permissions. Chatbot Studio separately configures concrete Action, Object query, Function, application-variable and Command tools.

**Problem solved:** keeps probabilistic tool selection separate from the security principal and deterministic platform enforcement that actually reads or mutates enterprise state.

**Universal primitive:** `model selected tool != tool execution authority`; tool proposal, argument construction, admission and effect execution are separate stages.

**Preconditions:** tools have typed/bounded contracts; the execution layer independently authenticates/authorizes every call; effective principal is known at execution time.

**Trade-offs:** explicit mediation improves least privilege and auditability but adds latency, failure states and policy complexity; project/service execution can legitimately differ from invoking-user authority and therefore must remain visible.

**Failure modes:** prompt injection selects an allowed but dangerous tool; stale tool/resource configuration grants unintended reach; project-scoped executor has broader rights than UI user; tool implementation trusts model-generated authorization claims; nested agent/function calls obscure the effective principal.

**Lock-in boundary:** AIP Logic/Chatbot tool registries and Ontology permissions are Palantir-specific. The transferable requirement is a provider-neutral `candidate -> admitted tool invocation -> authorized executor -> observed effect` boundary.

**SB relation:** directly reinforces `AI inference != authority`, capability/provider separation, workflow/action/policy engines and Station/Core/Agent boundaries. An AI candidate may select a capability but cannot manufacture provider credentials, Host Agent rights or canonical authorization.

**Classification:** `ADOPT PRINCIPLE`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-AIP09 — Human confirmation is an independent effect-admission policy
**Source/date:** Palantir official AIP Chatbot Studio Tools / Commands-as-tools and AI FDE Security and governance documentation, reviewed 2026-09-23.

**Palantir mechanism:** Chatbot Actions can be configured to execute automatically or after user confirmation; Commands ask the user to review payload data and approve/reject by default. AI FDE uses an additional approval layer for mutating operations, with conservative defaults and branch/project-scoped session approvals where applicable.

**Problem solved:** permits AI-assisted mutation without treating model intent or possession of a mutating tool as sufficient authorization to produce the effect.

**Universal primitive:** `tool available != effect admitted`; `human approval != model correctness proof`; approval is a separately scoped authority decision over a concrete proposed effect.

**Preconditions:** the approver sees the material target/arguments/scope; approval binds to an immutable or revalidated proposal; server-side permission checks still execute after approval.

**Trade-offs:** confirmation reduces autonomous throughput and can cause approval fatigue; session-wide grants improve usability but enlarge temporal/blast-radius scope.

**Failure modes:** approval UI omits consequential arguments; payload changes after approval; session approval silently applies to a broader branch/project/tool version; user approves a semantically stale proposal; confirmation is mistaken for proof that the effect succeeded.

**Lock-in boundary:** Palantir's confirmation widgets and AI FDE approval categories are product-specific. SB should preserve approval as an explicit portable admission/evidence primitive rather than couple authority to one UI or AI provider.

**SB relation:** strengthens AI candidate-vs-authority and future Station review surfaces. The visual layer may display a candidate and collect approval, but canonical admission belongs to the authoritative policy/action boundary; Station approval UI is not itself execution authority.

**Classification:** `ADOPT PRINCIPLE`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-AIP10 — Deterministic tool inputs can fence model discretion, but only within their pinning scope
**Source/date:** Palantir official AIP Chatbot Studio Application state documentation, reviewed 2026-09-23.

**Palantir mechanism:** Action and Function tools can receive predetermined values from application variables instead of model-generated inputs. These deterministic inputs are pinned to the variables' initial values at the start of the reasoning loop, so changes made by earlier tool calls in the same query are not reflected in those pinned values.

**Problem solved:** reduces model discretion over sensitive tool arguments and improves consistency/token efficiency.

**Universal primitive:** `deterministic input source != current input forever`; a pinned value has an explicit snapshot/currentness boundary.

**Preconditions:** the pinned variable itself is authorized and current for the intended operation; consumers understand whether later state changes require revalidation.

**Trade-offs:** deterministic inputs reduce hallucinated arguments but may intentionally become stale inside a multi-step reasoning loop.

**Failure modes:** a prior tool mutates state but a later effect uses the initial pinned value; UI presents a current variable while execution uses the initial snapshot; a deterministic value is mistaken for authorized value.

**Lock-in boundary:** application-variable mechanics are Palantir-specific. The transferable requirement is immutable argument provenance/currentness and explicit revalidation rules.

**SB relation:** aligns with revision-pinned candidates, `projection != canonical truth` and currentness semantics. Future Station review should show which values are model-generated, user-provided or revision-pinned rather than flattening them into one payload.

**Classification:** `ADAPT`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-AIP11 — Crossing an MCP boundary can transfer governance responsibility outside the platform
**Source/date:** Palantir official Palantir MCP Installation/Security and Ontology MCP Overview, reviewed 2026-09-23.

**Palantir mechanism:** local Palantir MCP is disabled by default and administrator-enabled for selected users/groups. Tool outputs consumed by local third-party AI clients are sent to that client's model provider; Palantir explicitly states that once data is accessed by the external system, governance of its use shifts to that external system/contract. Ontology MCP similarly warns that enabling external MCP clients makes environment data available outside Palantir and relies on application restrictions/permissions to bound exposure.

**Problem solved:** enables open-protocol interoperability with external AI IDEs/agents without pretending the external processor remains inside the platform's governance envelope.

**Universal primitive:** `authorized egress != downstream governance continuity`; a provider/tool boundary is also a policy-domain transition unless obligations are independently represented and enforceable downstream.

**Preconditions:** explicit egress enablement, bounded resource/tool exposure, known external processor/provider, policy/contract assessment, and data minimization appropriate to the destination.

**Trade-offs:** MCP improves portability and ecosystem reach, but data leaving the platform may no longer inherit source-side controls automatically.

**Failure modes:** user-authorized MCP read sends restricted content to an unapproved model provider; external client retains prompts/tool outputs beyond source retention policy; tenant/classification metadata is stripped; a broadly scoped service token exposes more than an interactive user intended.

**Lock-in boundary:** Palantir's Control Panel, markings and Developer Console restrictions are platform-specific; MCP itself is an open protocol. SB should transfer the boundary semantics, not depend on Palantir governance machinery.

**SB relation:** strengthens capability/provider separation and anti-lock-in: an external AI provider may be replaceable, but replacement is not semantically transparent unless classification, tenant, purpose, retention and disclosure obligations are requalified at the provider boundary. Autonomous runtimes must carry these obligations without requiring Builder availability.

**Classification:** `ADOPT PRINCIPLE`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-AIP12 — MCP tool exposure has an application-level authority ceiling independent of caller authority
**Source/date:** Palantir official Ontology MCP Authentication and authorization and Developer Console Application restrictions/Permissions, reviewed 2026-09-23.

**Palantir mechanism:** Ontology MCP reuses the Developer Console application's OAuth configuration. Interactive clients can act under end-user authorization-code grants; non-interactive clients can act as service users through client credentials. In both cases tokens are constrained by configured scopes/resource/operation restrictions, and restricted applications create an application-level maximum over what resources/operations may be reached. The requesting user/service principal must still possess underlying permissions.

**Problem solved:** prevents a caller's broad identity from automatically making every platform resource/tool reachable through a particular application/agent integration.

**Universal primitive:** `effective tool authority = caller/service authority ∩ application/tool exposure ceiling ∩ operation/resource policy`; tool discovery/exposure is not itself execution permission.

**Preconditions:** explicit resource and operation closure, OAuth/principal identity, server-side enforcement, and lifecycle handling when tool/resource dependencies evolve.

**Trade-offs:** defense in depth reduces blast radius but creates configuration drift and closure maintenance; unrestricted application modes improve flexibility at substantially larger authority scope.

**Failure modes:** new tool/resource becomes reachable without corresponding restriction review; service-user authority exceeds expected interactive authority; unrestricted application turns a narrow agent into platform-wide reach; UI displays a tool because it is discoverable although invocation is not admissible.

**Lock-in boundary:** Developer Console/OAuth restriction implementation is Palantir-specific. The transferable primitive is a provider-neutral maximum authority envelope around an agent/tool surface.

**SB relation:** maps naturally to capability/provider contracts and Station/Core/Agent boundaries: capability discovery, provider binding, principal authority and application exposure must remain separate dimensions. Generated applications should carry their own explicit capability closure without requiring Builder/Core as runtime backend.

**Classification:** `ADAPT`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-AIP13 — AI-authored structural changes use proposal review rather than direct canonical mutation
**Source/date:** Palantir official Palantir MCP Security/Example workflows and Ontology proposal review, reviewed 2026-09-23.

**Palantir mechanism:** Palantir MCP limits destructive write tools; ontology modifications are routed through proposals and require human approval before merge to the main ontology. Proposal review exposes changed tasks/resources and approval policy before merge. Production-data interaction is separated into Ontology MCP, which exposes predefined objects/actions/queries rather than arbitrary ontology-structure mutation.

**Problem solved:** allows AI-assisted system construction while separating candidate edits from canonical semantic state and separating builder tools from production operational tools.

**Universal primitive:** `AI-authored structural candidate != canonical semantic mutation`; `builder mutation surface != runtime operational action surface`.

**Preconditions:** isolated proposal state, reviewable diff/task closure, qualified approver, immutable/revalidated candidate at merge, and server-side permission enforcement.

**Trade-offs:** review protects canonical semantics but slows autonomous iteration and does not by itself prove semantic correctness, compatibility or downstream runtime safety.

**Failure modes:** proposal approved against stale dependencies; reviewer sees syntactic diff but misses capability/permission blast radius; candidate changes after review; approved ontology change leaves generated app/resource closure stale; proposal approval is mistaken for deployment/effect approval.

**Lock-in boundary:** Palantir proposal/Global Branching mechanics are product-specific. The transferable requirement is candidate/review/canonical separation and explicit construction-vs-operation authority.

**SB relation:** strongly reinforces `AI inference != authority`, `projection != canonical truth`, BusinessRecipe/SystemDefinition separation and the Builder/Runtime boundary. It is especially relevant to future AI-assisted Station authoring but remains post-visual research.

**Classification:** `ALREADY COVERED` with stronger benchmark evidence. **Implementation:** `DEFERRED_IMPROVEMENT`.

## Adversarial requirements for SB

- AI proposes an action outside the invoking user's authority -> reject/escalate; never inherit model/service authority silently.
- AI recommends a schema/interface change that breaks consumers -> proposal must expose blast radius and compatibility evidence.
- Model/provider change improves average eval score but weakens critical safety case -> multidimensional evals; no scalar score as sole gate.
- AI output is derived from restricted data -> downstream classification/evidence policy must survive derivation.
- AI-generated change is correct but stale relative to newer SystemDefinition/policy -> bind candidate to source revisions/currentness and revalidate before authorization.
- Project-scoped automation has broader rights than the human invoking a UI -> UI must make execution principal/authority explicit.
- Workflow reaches a newly restricted source after telemetry policy was configured -> existing log markings/access policy may be insufficient; requalify derived-observability policy.
- User may execute an AI workflow but is not entitled to inspect another user's prompts/results -> execution and telemetry-inspection authority remain separate.
- Observability export reaches a third-party backend -> export must not silently erase classification, tenant, retention or disclosure constraints.
- Log entry is absent after retention expiry or search snapshot is stale -> absence cannot prove non-execution/non-effect.
- Prompt injection or model error chooses a configured mutating tool -> executor still resolves principal, permission, policy and effect admission independently.
- User approves a proposed command but target/arguments/revision change before execution -> stale approval must not authorize a materially different effect.
- Session-wide approval exists for a tool but branch/project/context changes -> approval scope must not silently expand.
- Deterministic tool argument was pinned at reasoning-loop start and underlying state changes -> expose/revalidate snapshot semantics before consequential effect.
- External MCP client is authorized to read a resource but sends tool output to a third-party model -> source authorization does not prove destination/provider admissibility or retention/classification continuity.
- MCP application exposes a narrow tool set but uses a service principal with broader rights -> effective authority must remain bounded by the application/tool ceiling as well as the principal.
- AI proposes ontology changes through a review branch while generated application/resource restrictions still reference the old closure -> merge/admission must surface mismatch rather than treating proposal approval as complete system consistency.

## Station sequencing implications

No finding above is a correctness/security blocker requiring displacement of the current visual milestone. Only representation constraints may be consumed now: future Station AI/review surfaces should distinguish model proposal, tool selection, effective execution principal, human approval/admission, execution/effect evidence, argument provenance/currentness, external-provider egress, and application/tool authority ceilings. These are representation constraints, not implementation promotion.

## Remaining gaps

Next passes should inspect whether exported log streams preserve source classification/tenant/purpose constraints, nested agent/function principal propagation, pro-code agent scoped-permission semantics, and approval binding/revalidation across tool/version changes. MCP governance-boundary and application-ceiling semantics are now materially evidenced; do not repeatedly rediscover them unless primary documentation changes.

## Sources

Official Palantir docs reviewed 2026-09-23: AIP Logic core concepts and Blocks; AIP Chatbot Studio Tools, Commands as tools and Application state; AI FDE Security and governance; Pilot Ontology tab; Ontology and AIP observability; Palantir MCP Installation, Security and Example workflows; Ontology MCP Overview and Authentication/authorization; Developer Console Permissions/Application restrictions; Ontology proposal review.