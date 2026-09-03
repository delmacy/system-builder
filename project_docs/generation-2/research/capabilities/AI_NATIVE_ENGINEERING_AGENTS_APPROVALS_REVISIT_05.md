# AI-native Engineering / Agents / Approvals — Revisit 05 / Cycle 6

## Research question
How should Generation 2 model AI/agent identity, authority, approval, durable execution, external evidence and provider substitution so that cumulative context, human review, model/tool composition and offline execution remain useful without turning probabilistic outputs, retrieved content or sticky approvals into constitutional authority?

## Representatives and evidence/source ledger
1. **OpenAI Agents SDK (2026)** — run-wide HITL interruptions; per-call approval state; optional sticky `alwaysApprove/alwaysReject`; nested `agent.asTool()` approvals at outer and inner layers; fail-closed handling for malformed approval inputs and ambiguous serialized output ownership; pre/post tool guardrails; explicit guardrail coverage differences across function tools, handoffs, hosted/built-in tools; explicit warning that post-execution guardrails cannot undo external side effects. Official SDK evidence. Sources: https://openai.github.io/openai-agents-js/guides/human-in-the-loop/ ; https://openai.github.io/openai-agents-js/guides/guardrails/
2. **Anthropic Claude Code containment (2025–2026)** — OS-level filesystem/network containment, scoped credentials/proxy mediation, evidence that repeated confirmations produce approval fatigue, and 2026 engineering analysis showing external content/tool results remain adversarial even when connectors are trusted; project-local configuration parsed before an explicit trust boundary created real vulnerabilities. Official engineering evidence. Sources: https://www.anthropic.com/engineering/claude-code-sandboxing ; https://www.anthropic.com/engineering/how-we-contain-claude
3. **Model Context Protocol authorization (2025–2026)** — resource/audience-bound access tokens, prohibition on token passthrough, explicit confused-deputy risk, and separation of client→MCP-server authorization from MCP-server→upstream authorization. Standards/ecosystem evidence. Source: https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization
4. **LangGraph interrupts (2026)** — interrupt/resume re-runs nodes, making pre-interrupt side effects replay-sensitive and requiring idempotency or separation of side-effect nodes. Official framework evidence. Source: https://docs.langchain.com/oss/python/langgraph/interrupts
5. **Google ADK + Restate (2026)** — durable session isolation; LLM/tool-call journaling; pause/resume for human approval; retry/recovery from journaled execution state; version-aware routing and operational control. Official ecosystem evidence. Source: https://google.github.io/adk-docs/integrations/restate/
6. **NIST Software/AI Agent Identity & Authorization initiative (2026)** — explicitly frames identification, authorization, auditing, non-repudiation and prompt-injection mitigation as software-agent security concerns and emphasizes constraining agent access to data, tools and applications. Standards/public-sector architecture evidence. Sources: https://www.nist.gov/news-events/news/2026/02/new-concept-paper-identity-and-authority-software-agents ; https://csrc.nist.gov/pubs/other/2026/02/05/accelerating-the-adoption-of-software-and-ai-agent/ipd

## Universal primitives and source of truth
The semantic source of truth remains deterministic and outside the model/provider. Generation 2 should preserve typed identities for at least:

`ModelRealizationRevision`
`AgentDefinitionRevision`
`AgentRunIdentity`
`InstructionEnvelopeRevision`
`ContextArtifact{origin,trust_class,content_digest,freshness}`
`ToolCapabilityIdentity`
`ToolBindingRevision`
`ToolCallCandidate`
`SemanticProposalRevision`
`DeterministicValidationEvidence`
`ApprovalRequirement`
`ApprovalDecision{approver,scope,candidate_digest,revision_vector,expiry}`
`ExecutionAuthorization`
`ActuationAttempt`
`ProviderReceipt`
`OutcomeUnknown`
`EffectivePostconditionEvidence`
`RecoveryDisposition`

The canonical lifecycle is:

`intent → context qualification → proposal → deterministic validation → approval applicability → approval decision → execution authorization → actuation attempt → provider observation → effective-state reconciliation → postcondition validation → closure/recovery`.

Provider run objects may bundle these facts for convenience but do not collapse their identities.

## Identity and revision vectors
A material agent operation depends on a vector, not a scalar version:

`{agent_definition, model_realization, prompt/instruction, context/provenance, tool_schema, tool_binding, policy, effective_authority, trust_root, provider_runtime, Station/domain_contract}`.

An approval is valid only against the operation and vector it actually reviewed. OpenAI's exact-call decisions are strong product evidence for call-scoped identity, while its sticky same-tool decisions are a useful convenience mechanism that must not become a universal constitutional primitive. `alwaysApprove(tool)` inside one run cannot establish that changed arguments, changed effective authority, changed provider binding or changed semantic consequences remain approved.

Agent-run identity is also distinct from model identity. Replacing a model or harness may preserve semantic task identity while creating a new realization/evidence lineage.

## Cumulative context, provenance and adversarial content
Retrieved files, web pages, tool outputs, connector data, memory and prior-agent messages are **evidence inputs**, not authority sources. Anthropic's containment analysis gives a decisive negative-space example: an audited connector can deliver attacker-controlled content, and project-local configuration can become dangerous before a trust boundary is established.

Therefore each context artifact needs provenance, trust class, content digest, applicable policy/freshness and transformation lineage. Context can influence a proposal; it cannot widen `ExecutionAuthorization`.

A trusted user-originating prompt is not automatically safe either. Anthropic's 2026 red-team evidence shows that user-mediated malicious instructions can bypass model-layer assumptions about user intent. The constitutional safety boundary must therefore be independently enforced by capability, filesystem, network, credential and provider controls.

## Approval semantics and separation of duties
Human approval is evidence for a bounded transition, not the root of trust. Approval fatigue demonstrates that repeated dialogs can reduce safety; hard environmental boundaries remain enforceable even when a user approves a bad request.

Generation 2 should distinguish:
- proposer identity;
- validator identity;
- approver identity;
- execution-authorizer identity;
- actuator/runtime identity;
- postcondition/evidence observer identity.

These roles may coincide only when policy explicitly allows it. High-risk operations can require separation of duties without inventing an AI-specific IAM plane.

Approval freshness is invalidated by material changes to candidate digest, policy, Station/Role/Person authority, tool/binding, trust roots, provider realization or required evidence. Revocation before actuation prevents release of the old authorization; revocation after external effect instead enters reconciliation/recovery semantics.

## Tool authorization and confused-deputy prevention
MCP's resource-bound token requirements make a universal boundary concrete: authentication to a tool transport and authority for the requested semantic effect are separate.

A tool token must not be treated as delegable ambient authority. Downstream calls require their own target-resource authorization or an explicitly modeled exchange. Token passthrough creates confused-deputy risk and therefore violates the SB's provider boundary.

For Generation 2, tool admission should resolve:

`semantic capability → effective authority → admitted tool contract → provider binding → credential/resource audience → attempt`.

The model may select from admitted tools, but it cannot mint a broader binding or redirect credentials to a new resource.

## Durable execution, idempotency and replay classification
Checkpoint semantics are provider-specific and must be negotiated explicitly. LangGraph re-runs an interrupted node; Restate journals calls and resumes from durable execution history. Both can support long-lived agents, but their replay obligations differ.

Generation 2 therefore needs a `ResumeSemanticsProfile` describing at least:
- re-enter-node versus journal-replay behavior;
- side-effect correlation/idempotency guarantees;
- tool-call/result persistence;
- approval persistence and freshness recheck;
- provider/version routing semantics;
- ambiguity handling when acknowledgement is lost.

A checkpoint is not evidence that the external world is unchanged. Before retrying an effectful tool, the runtime must reconcile prior attempt state when execution may have succeeded.

## Proposal, authorization, actuation and effective postcondition
The agent proposal and the authorized actuation are separate artifacts. Approval of a proposal does not prove:
- the tool call actually used the reviewed arguments;
- the execution authorization was still valid at dispatch time;
- the provider accepted the operation;
- the external effect occurred exactly once;
- the semantic postcondition is satisfied.

Likewise, OpenAI explicitly states that post-execution guardrails do not undo external side effects. A rejected model/tool output after an effect can therefore be `PARTIAL` or `OUTCOME_UNKNOWN`, never automatically `NO_EFFECT`.

## Extensibility and provider boundaries
Models, agent harnesses, checkpoint engines, tool transports, sandboxes, approval UIs and model-based classifiers are providerizable.

SB owns semantic intent, identity mapping, authority projection, admission rules, deterministic validation, approval applicability, attempt/effect lineage and closure disposition. Provider substitution may preserve semantic identity only if required contracts remain satisfied; it always creates fresh realization evidence.

If a replacement provider cannot represent required approval boundaries, resource-scoped authorization, replay semantics, containment or evidence fields, negotiation returns `DEGRADED`, `UNSUPPORTED` or `INCONCLUSIVE` rather than weakening policy.

## Governance and observability
A consequential agent action should be reconstructable as:

`actor → Enterprise/Station/Role/Person authority projection → agent/model realization → instruction/context provenance → semantic proposal digest → deterministic validator evidence → approval requirement/decision → execution authorization → tool/binding/credential audience → attempt → provider receipt/ambiguity → effective-state observation → postcondition → closure/recovery`.

Tracing that records “model selected tool”, “approval clicked” or “tool returned success” is useful telemetry but not sufficient proof of the effective semantic result.

## Portability and lock-in
Portability should preserve intent, authority, admitted semantic capability, tool contract, approval/evidence obligations and postconditions. It need not reproduce identical tokens, reasoning traces or provider-internal state.

Model/provider substitution requires fresh realization lineage and result validation. Where exact replay is impossible, the system should be reproducible at the level of governed intent, inputs/provenance, policy and observable acceptance criteria.

## Local/offline closure and reconnect
A qualified local agent closure includes model/runtime artifacts, policy and effective-authority revisions, tool schemas/bindings, local trust roots, credential references, sandbox/network policy, deterministic validators, checkpoint semantics, approval mechanism, evidence store and recovery dispositions.

Disconnected execution cannot increase authority. Privileged queued work is released only while its approval and authority vector remain valid. Reconnection requalifies trust, policy, Station/Role membership, provider bindings and externally dependent evidence before queued privileged actuation proceeds.

## Product-specific mechanisms vs universal primitives
**Product-specific:** OpenAI `RunState`, `interruptions`, `alwaysApprove`, pre/post tool guardrails; Claude Code sandbox/proxy; MCP OAuth resource indicators; LangGraph `interrupt()` node replay; Restate journal/version-aware routing.

**Universal:** typed agent/run/proposal/approval/attempt/effect identities; revision-bound approval applicability; provenance-qualified cumulative context; non-amplifying environmental containment; resource/audience-bound tool authority; resume-semantics profile; reconcile-before-retry; effective-postcondition evidence; provider-substitution requalification; qualified offline closure.

## Convergent patterns
- Hard enforcement lives outside probabilistic model output.
- Approval applies to bounded actions and should not silently widen through nesting or provider substitution.
- Durable execution needs explicit replay/idempotency semantics.
- Context and tool results are untrusted or qualified inputs, not implicit authority.
- Transport credentials must remain target/resource scoped.
- External success requires effect/postcondition evidence beyond model/tool traces.

## Divergent patterns
- Approval may be call-scoped, tool-scoped, run-scoped or provider-hosted.
- Durable runtimes differ between node re-execution and journal replay.
- Tool-guardrail coverage differs across custom functions, hosted tools, handoffs and nested agents.
- Some agent products rely more on human confirmation; others reduce prompts using strong sandbox/egress boundaries.
- Provider runtimes expose different levels of execution determinism and replay evidence.

## Subcapabilities
Typed agent identity; model/harness realization; cumulative-context provenance; deterministic proposal validation; approval applicability/freshness; separation of duties; nested delegation; tool admission/resource scoping; containment; checkpoint/replay semantics; idempotent actuation; outcome reconciliation; provider substitution; audit/non-repudiation; AGWS materialization; qualified offline closure.

## System Builder comparison — bounded evidence only
No new repository implementation claim is made in this revisit. Prior bounded searches remain non-authoritative for repository-wide absence. Full reconciliation of current SB implementation is reserved for `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION` so research does not invent architecture from partial code evidence.

## Reconciliation hypotheses
- **GENERALIZE** typed `Proposal → Approval → ExecutionAuthorization → Attempt → EffectivePostcondition` across AI, Workflow, Integration, Lifecycle and Architecture Reconciliation.
- **HARDEN** approval with exact effect/candidate digest, governing revision vector, expiry and revocation semantics.
- **HARDEN** cumulative context with provenance/trust/freshness lineage.
- **GENERALIZE** `ResumeSemanticsProfile` and reconcile-before-retry across agent/checkpoint providers.
- **PROVIDERIZE** model, agent harness, checkpoint engine, tool transport, sandbox and classifier while preserving semantic authority outside them.
- **INTEGRATE** resource/audience-bound tool authorization with Identity, Authorization, Secrets and Provider/Binding.
- **KEEP** AI-only materialization for Adaptive Governed Work Surfaces, bounded by deterministic validators and Enterprise→Station→Role→Person authority.
- **DO_NOT_BUILD** blanket sticky approval as constitutional authority, model-self-certified safety, AI-specific IAM, unrestricted token passthrough or provider-specific agent state as semantic truth.

## Repo-validation questions
1. Are model, agent definition, run, proposal, tool call, approval, execution authorization, attempt and effective outcome distinct persisted identities?
2. Does approval bind candidate/effect digest plus policy/authority/tool/binding/trust revision vector, rather than only tool name or run identity?
3. Can sticky approval convenience be constrained by deterministic policy so changed semantic effects still require requalification?
4. Is retrieved/tool/context provenance retained and prevented from widening effective authority?
5. Are tool credentials audience/resource scoped, with downstream token passthrough prohibited or explicitly exchanged?
6. Does every checkpoint provider declare replay semantics and side-effect/idempotency obligations?
7. Can acknowledgement loss produce `OUTCOME_UNKNOWN` and reconcile-before-retry instead of blind replay?
8. Are proposer, approver, authorizer and actuator identities separately observable and enforceable where separation of duties is required?
9. Does provider/model substitution create fresh realization/evaluation evidence while preserving semantic task identity only when contract-equivalent?
10. Does AGWS AI materialization escalate canonical domain/process/provider changes rather than treating user intent as authority to mutate them?
11. Does offline execution preserve a declared authority/trust/tool closure and requalify privileged queued work on reconnect?
12. Are pre-trust configuration, external tool results and user-mediated prompts treated as potentially adversarial inputs to containment policy?

## Adaptive Governed Work Surfaces / Station interaction
Adaptive Governed Work Surfaces remains a distinct promoted capability. Effective authority resolves `Enterprise → Station → Role → Person`; lower layers may specialize delegated dimensions but cannot weaken inherited invariants.

AI remains the sole materializer for permitted AGWS composition, not its authority source. A user may request a list, form, grid, layout or personal automation using existing admitted semantic components. If materialization requires canonical domain/schema/process/provider/deployment/recovery mutation, the agent emits an escalation/proposal artifact instead of silently broadening scope.

Mandatory inherited components remain non-removable. Station/Role/Person changes invalidate dependent approvals and personal automation authority. Personal→Team/Role/System promotion requires independent governance/evidence, not “the agent already did it successfully.”

## Symbiotic Proof / architecture proof obligations
1. **Typed-identity proof:** hold semantic intent constant while changing model, agent run and tool-call realization; prove proposal/approval/attempt/effect identities remain distinct and traceable.
2. **Sticky-approval containment proof:** set provider-level same-tool sticky approval, then materially change arguments/effect or Station/Role authority; constitutional policy blocks/requalifies despite provider convenience state.
3. **Context-non-authority proof:** inject malicious instructions through a trusted connector/tool result and through user-mediated content; proposal may observe the content, but filesystem/network/credential/semantic authority remains unchanged.
4. **Pre-trust-boundary proof:** provide hostile project-local configuration before explicit trust establishment; parsing/execution is delayed or sandboxed so no privileged side effect occurs pre-consent.
5. **Resource-audience proof:** give an MCP/tool token valid for resource A and attempt downstream resource B or token passthrough; the binding rejects or performs explicit authorized exchange.
6. **Replay-profile proof:** execute equivalent paused workflows on node-replay and journal-replay providers with a side effect before the pause; duplicate effect is prevented/reconciled under both declared semantics.
7. **Ambiguous-effect proof:** external effect succeeds but response is lost; system records `OUTCOME_UNKNOWN`, observes effective state and refuses blind retry.
8. **Separation-of-duties proof:** proposer/agent cannot self-approve a high-risk mutation when policy requires an independent approver; approver still cannot bypass execution-authorizer/provider constraints.
9. **Provider-substitution proof:** change model/harness/tool provider after approval; old approval/evidence is requalified against the new realization vector before actuation.
10. **Qualified-offline proof:** disconnect external services under declared local closure, then change policy/binding before reconnect; queued privileged action remains blocked until fresh qualification.
11. **AGWS escalation proof:** ask AI to materialize a surface that implicitly requires a new canonical field/process/provider mutation; AI emits governed escalation rather than creating canonical state.
12. **Postcondition proof:** tool/provider reports success while semantic postcondition fails; operation remains partial/inconclusive and enters recovery rather than being marked complete.

## Stable findings
- **G2-FINDING-AIN-39 — Agentic Control Requires Typed Model, Agent, Run, Proposal, Approval, Attempt and Effective-Outcome Identities.** Value HIGH; risk CRITICAL; priority P0. Provider run state may correlate these artifacts but cannot safely alias them.
- **G2-FINDING-AIN-40 — Sticky or Tool-Level Approval Is a Provider Convenience, Not Constitutional Authority.** Value HIGH; risk CRITICAL; priority P0. Approval applicability must bind the reviewed semantic effect/candidate and governing revision vector; changed arguments, policy, authority or binding require requalification.
- **G2-FINDING-AIN-41 — Human Approval Is Fallible Evidence; Independently Enforced Capability, Filesystem, Network and Credential Boundaries Remain the Trust Root.** Value HIGH; risk CRITICAL; priority P0. Approval fatigue and pre-trust attack surfaces make repeated confirmation insufficient as a safety boundary.
- **G2-FINDING-AIN-42 — Cumulative Agent Context Must Carry Provenance/Trust/Freshness but Can Never Amplify Authority.** Value HIGH; risk CRITICAL; priority P0. Trusted connectors and user-originated prompts can still carry attacker-controlled instructions.
- **G2-FINDING-AIN-43 — Tool Authorization Is Resource/Audience Bound; Token Passthrough or Ambient Credential Reuse Creates Confused-Deputy Authority Leakage.** Value HIGH; risk CRITICAL; priority P0.
- **G2-FINDING-AIN-44 — Durable Agent Resume Needs an Explicit Resume-Semantics Profile and Attempt Lineage.** Value HIGH; risk CRITICAL; priority P0. Node replay and journal replay are materially different provider contracts; retries must respect effect/idempotency evidence.
- **G2-FINDING-AIN-45 — Model/Harness Substitution Preserves Semantic Intent Only with Fresh Realization and Acceptance Evidence.** Value HIGH; risk HIGH; priority P1. Token-identical replay is not required, but authority, evidence obligations and deterministic postconditions must be requalified.
- **G2-FINDING-AIN-46 — Proposer, Approver, Execution Authorizer, Actuator and Postcondition Observer Are Distinct Governance Roles.** Value HIGH; risk HIGH; priority P1. They may coincide only where policy permits; high-risk paths can require separation of duties without an AI-specific IAM plane.

## Candidate concepts
- `G2-CAPABILITY-CANDIDATE-AIN-TYPED-AGENTIC-CONTROL-IDENTITY` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile with typed transition identities across Workflow, Integration and Lifecycle.
- `G2-CAPABILITY-CANDIDATE-AIN-PROVENANCE-QUALIFIED-CUMULATIVE-CONTEXT` — **CORE_SUBCAPABILITY / PENDING_SYNTHESIS**; context provenance/trust/freshness without authority amplification.
- `G2-CAPABILITY-CANDIDATE-AIN-RESUME-SEMANTICS-PROFILE` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; unify replay/idempotency/ambiguity contracts across agent, workflow and runtime providers.
- `G2-CAPABILITY-CANDIDATE-AIN-RESOURCE-BOUND-TOOL-AUTHORITY` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile with Authorization, Secrets, Provider/Binding and MCP-style audience/resource constraints.

No candidate is promoted in this pass. Adaptive Governed Work Surfaces remains explicitly promoted and distinct.

## Saturation assessment
Representative coverage is sufficient for this revisit but eight material architectural findings were produced. `consecutive_no_material_finding = 0`; capability remains **NOT SATURATED**.

## Value / risk / priority / next question
**Value:** very high because AI is a cross-cutting materializer/orchestrator in Generation 2. **Risk:** critical because authority leakage, replay ambiguity or adversarial context can cross product/provider boundaries. **Priority:** P0 for typed control identities, approval applicability, context non-amplification, resource-bound tool authority and resume semantics.

**Next research question if reopened:** can a later research-by-exception pass collapse any of these controls into already-proven cross-capability primitives without losing AI-specific adversarial-context and provider-replay semantics, or do new evidence profiles remain materially distinct?
